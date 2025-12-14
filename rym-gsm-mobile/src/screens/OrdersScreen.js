import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      // Backend uses /orders/my-orders for user orders
      const response = await api.get('/orders/my-orders');
      setOrders(response.data.orders || response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'processing':
        return colors.info;
      case 'shipped':
        return colors.primary[600];
      case 'delivered':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.gray[500];
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En traitement';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'processing':
        return 'hourglass-outline';
      case 'shipped':
        return 'car-outline';
      case 'delivered':
        return 'checkmark-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'ellipse-outline';
    }
  };

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="log-in-outline" size={100} color={colors.gray[300]} />
        <Text style={styles.emptyTitle}>Connectez-vous</Text>
        <Text style={styles.emptyText}>
          Connectez-vous pour voir vos commandes
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={100} color={colors.gray[300]} />
        <Text style={styles.emptyTitle}>Aucune commande</Text>
        <Text style={styles.emptyText}>
          Vous n'avez pas encore passé de commande
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {orders.map((order) => (
        <TouchableOpacity 
          key={order.id} 
          style={styles.orderCard}
          onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
        >
          {/* Order Header */}
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>Commande #{order.id}</Text>
              <Text style={styles.orderDate}>
                {new Date(order.created_at).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
              <Ionicons
                name={getStatusIcon(order.status)}
                size={16}
                color={getStatusColor(order.status)}
              />
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {getStatusText(order.status)}
              </Text>
            </View>
          </View>

          {/* Order Items */}
          <View style={styles.orderItems}>
            {(order.products || order.items || []).slice(0, 2).map((item, index) => (
              <Text key={index} style={styles.itemText} numberOfLines={1}>
                • {item.name || item.product_name || 'Produit'} x{item.quantity}
              </Text>
            ))}
            {(order.products || order.items || []).length > 2 && (
              <Text style={styles.moreItems}>
                +{(order.products || order.items || []).length - 2} autre(s) produit(s)
              </Text>
            )}
          </View>

          {/* Order Footer */}
          <View style={styles.orderFooter}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{parseFloat(order.total || order.total_amount || 0).toFixed(2)} DT</Text>
            </View>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Détails</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary[600]} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: colors.gray[500],
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: colors.gray[500],
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  orderItems: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray[100],
    paddingVertical: 12,
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: colors.gray[700],
    marginBottom: 6,
  },
  moreItems: {
    fontSize: 13,
    color: colors.gray[500],
    fontStyle: 'italic',
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: colors.gray[600],
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[600],
  },
  loginButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrdersScreen;
