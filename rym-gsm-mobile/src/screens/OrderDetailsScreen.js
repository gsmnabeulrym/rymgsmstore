import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { colors } from '../theme/colors';

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      const orderData = response.data.order || response.data;
      
      // Parse order items with product images
      if (orderData.items || orderData.order_items) {
        const items = orderData.items || orderData.order_items;
        orderData.items = items.map(item => {
          const product = item.product || item;
          return {
            ...item,
            product: product ? {
              ...product,
              images: typeof product.images === 'string' 
                ? JSON.parse(product.images || '[]') 
                : (product.images || []),
            } : null,
          };
        });
      }
      
      setOrder(orderData);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#f59e0b';
      case 'processing':
        return '#3b82f6';
      case 'shipped':
        return '#8b5cf6';
      case 'delivered':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return colors.gray[500];
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.gray[400]} />
        <Text style={styles.errorText}>Commande introuvable</Text>
      </View>
    );
  }

  // Backend returns 'products' array, not 'items'
  const items = order.products || order.items || order.order_items || [];
  const orderTotal = parseFloat(order.total || order.total_amount || 0);
  const deliveryFee = 7;
  const subtotal = orderTotal - deliveryFee;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary[600], colors.purple[600]]}
        style={styles.header}
      >
        <Text style={styles.orderNumber}>Commande #{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
        <Text style={styles.orderDate}>
          {new Date(order.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </LinearGradient>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Articles commandés</Text>
        {items.length === 0 ? (
          <Text style={styles.noItemsText}>Aucun article</Text>
        ) : (
          items.map((item, index) => {
            const product = item.product || item;
            const itemPrice = parseFloat(item.price) || parseFloat(product.price) || 0;
            const itemImage = item.image || product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/80';
            return (
              <View key={index} style={styles.orderItem}>
                <Image
                  source={{ uri: itemImage }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.name || product.name || 'Produit'}
                  </Text>
                  <Text style={styles.productBrand}>{item.brand || product.brand || ''}</Text>
                  <View style={styles.productFooter}>
                    <Text style={styles.productQuantity}>Qté: {item.quantity}</Text>
                    <Text style={styles.productPrice}>
                      {(itemPrice * item.quantity).toFixed(2)} Dt
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Shipping Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Adresse de livraison</Text>
        <View style={styles.infoCard}>
          <Ionicons name="location-outline" size={24} color={colors.primary[600]} />
          <Text style={styles.infoText}>{order.shipping_address || 'Non spécifiée'}</Text>
        </View>
        {order.phone && (
          <View style={styles.infoCard}>
            <Ionicons name="call-outline" size={24} color={colors.primary[600]} />
            <Text style={styles.infoText}>{order.phone}</Text>
          </View>
        )}
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Récapitulatif</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total</Text>
            <Text style={styles.summaryValue}>
              {subtotal > 0 ? subtotal.toFixed(2) : '0.00'} Dt
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Livraison</Text>
            <Text style={styles.summaryValue}>{deliveryFee.toFixed(2)} Dt</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{orderTotal.toFixed(2)} Dt</Text>
          </View>
        </View>
      </View>

      {/* Order Timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suivi de commande</Text>
        <View style={styles.timeline}>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: '#10b981' }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Commande passée</Text>
              <Text style={styles.timelineDate}>
                {new Date(order.created_at).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          </View>
          {order.status !== 'pending' && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#3b82f6' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>En traitement</Text>
              </View>
            </View>
          )}
          {(order.status === 'shipped' || order.status === 'delivered') && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#8b5cf6' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Expédiée</Text>
              </View>
            </View>
          )}
          {order.status === 'delivered' && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#10b981' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Livrée</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={{ height: 40 }} />
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
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.gray[600],
    marginTop: 16,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  section: {
    backgroundColor: colors.white,
    marginTop: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 13,
    color: colors.gray[500],
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productQuantity: {
    fontSize: 13,
    color: colors.gray[600],
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: colors.gray[700],
  },
  noItemsText: {
    fontSize: 15,
    color: colors.gray[500],
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  summaryCard: {
    backgroundColor: colors.gray[50],
    padding: 16,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: colors.gray[600],
  },
  summaryValue: {
    fontSize: 15,
    color: colors.gray[900],
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 16,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[900],
  },
  timelineDate: {
    fontSize: 13,
    color: colors.gray[500],
    marginTop: 2,
  },
});

export default OrderDetailsScreen;
