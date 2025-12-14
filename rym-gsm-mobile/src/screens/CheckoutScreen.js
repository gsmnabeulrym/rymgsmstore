import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import { colors } from '../theme/colors';

const CheckoutScreen = ({ navigation }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    phone: user?.phone || '',
  });

  const deliveryFee = 7;
  // Ensure cartTotal is a valid number
  const safeCartTotal = typeof cartTotal === 'number' && !isNaN(cartTotal) ? cartTotal : 0;
  const total = safeCartTotal + deliveryFee;

  // Load default address on mount
  useEffect(() => {
    loadDefaultAddress();
  }, []);

  const loadDefaultAddress = async () => {
    try {
      const savedAddresses = await AsyncStorage.getItem('user_addresses');
      if (savedAddresses) {
        const addresses = JSON.parse(savedAddresses);
        const defaultAddress = addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setShippingInfo({
            address: defaultAddress.address || '',
            city: defaultAddress.city || '',
            postalCode: defaultAddress.postalCode || '',
            phone: defaultAddress.phone || user?.phone || '',
          });
        }
      }
    } catch (error) {
      console.error('Error loading default address:', error);
    }
  };

  const handlePlaceOrder = async () => {
    const { address, city, postalCode, phone } = shippingInfo;

    if (!address || !city || !postalCode || !phone) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (cart.length === 0) {
      Alert.alert('Erreur', 'Votre panier est vide');
      return;
    }

    setLoading(true);
    try {
      // Calculate total from cart items to ensure valid amount
      const calculatedTotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.price) || parseFloat(item.product?.price) || 0;
        const qty = parseInt(item.quantity) || 1;
        return sum + (price * qty);
      }, 0) + deliveryFee;

      const orderData = {
        items: cart.map(item => ({
          product_id: item.productId || item.product_id || item.id,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price) || parseFloat(item.product?.price) || 0,
        })),
        shippingAddress: {
          address: address,
          city: city,
          postalCode: postalCode,
          phone: phone,
          firstName: user?.name?.split(' ')[0] || '',
          lastName: user?.name?.split(' ').slice(1).join(' ') || '',
          email: user?.email || '',
          country: 'Tunisie'
        },
        // Backend expects 'totalAmount' or 'total', not 'total_amount'
        totalAmount: parseFloat(calculatedTotal.toFixed(2)),
        paymentMethod: 'cash'
      };

      console.log('Order data:', JSON.stringify(orderData, null, 2));

      await api.post('/orders', orderData);
      await clearCart();

      Alert.alert(
        'Commande confirmée!',
        'Votre commande a été passée avec succès',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Main');
              navigation.navigate('Orders');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.message || 'Échec de la commande');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setShippingInfo({ ...shippingInfo, [field]: value });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Shipping Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de livraison</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color={colors.gray[400]} />
            <TextInput
              style={styles.input}
              placeholder="Adresse complète"
              value={shippingInfo.address}
              onChangeText={(value) => updateField('address', value)}
              placeholderTextColor={colors.gray[400]}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfInput]}>
              <Ionicons name="business-outline" size={20} color={colors.gray[400]} />
              <TextInput
                style={styles.input}
                placeholder="Ville"
                value={shippingInfo.city}
                onChangeText={(value) => updateField('city', value)}
                placeholderTextColor={colors.gray[400]}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfInput]}>
              <Ionicons name="mail-outline" size={20} color={colors.gray[400]} />
              <TextInput
                style={styles.input}
                placeholder="Code postal"
                value={shippingInfo.postalCode}
                onChangeText={(value) => updateField('postalCode', value)}
                keyboardType="numeric"
                placeholderTextColor={colors.gray[400]}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color={colors.gray[400]} />
            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              value={shippingInfo.phone}
              onChangeText={(value) => updateField('phone', value)}
              keyboardType="phone-pad"
              placeholderTextColor={colors.gray[400]}
            />
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résumé de la commande</Text>

          {cart.map((item, index) => {
            const product = item.product || item;
            const itemKey = item.productId || item.product_id || item.id || `item-${index}`;
            return (
              <View key={itemKey} style={styles.orderItem}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {product.name || item.name || 'Produit'}
                </Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                <Text style={styles.itemPrice}>
                  {((product.price || item.price || 0) * item.quantity).toFixed(2)} DT
                </Text>
              </View>
            );
          })}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total</Text>
            <Text style={styles.summaryValue}>{cartTotal.toFixed(2)} DT</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Livraison</Text>
            <Text style={styles.summaryValue}>{deliveryFee.toFixed(2)} DT</Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{total.toFixed(2)} DT</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mode de paiement</Text>
          <View style={styles.paymentMethod}>
            <Ionicons name="cash-outline" size={24} color={colors.primary[600]} />
            <Text style={styles.paymentText}>Paiement à la livraison</Text>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.orderButtonText}>Confirmer la commande</Text>
              <Text style={styles.orderButtonPrice}>{total.toFixed(2)} DT</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.white,
    marginTop: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.gray[900],
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    color: colors.gray[700],
  },
  itemQuantity: {
    fontSize: 14,
    color: colors.gray[500],
    marginHorizontal: 12,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[900],
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: 12,
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
    fontWeight: '600',
    color: colors.gray[900],
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
  },
  bottomContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  orderButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  orderButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
  orderButtonPrice: {
    color: colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
