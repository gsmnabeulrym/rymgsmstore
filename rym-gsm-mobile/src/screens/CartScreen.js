import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

const CartScreen = ({ navigation }) => {
  const { cart, cartTotal, updateQuantity, removeFromCart, fetchCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId, productName) => {
    Alert.alert(
      'Supprimer',
      `Voulez-vous supprimer ${productName} du panier?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => removeFromCart(productId),
        },
      ]
    );
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={100} color={colors.gray[300]} />
        <Text style={styles.emptyTitle}>Votre panier est vide</Text>
        <Text style={styles.emptyText}>
          Ajoutez des produits pour commencer vos achats
        </Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('ProductsTab')}
        >
          <Text style={styles.shopButtonText}>Découvrir les produits</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Panier</Text>
        <Text style={styles.itemCount}>{cart.length} article(s)</Text>
      </View>

      <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
        {cart.map((item, index) => {
          // Handle different data structures from backend and local storage
          const productId = item.productId || item.product_id || item.id;
          const productName = item.name || item.product?.name || 'Produit';
          const productBrand = item.brand || item.product?.brand || '';
          const productPrice = item.price || item.product?.price || 0;
          const productImage = item.image || item.images?.[0] || item.product?.images?.[0] || 'https://via.placeholder.com/100';
          
          return (
            <View key={`${productId}-${index}`} style={styles.cartItem}>
              <Image
                source={{ uri: productImage }}
                style={styles.productImage}
                resizeMode="contain"
              />
              
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {productName}
                </Text>
                <Text style={styles.productBrand}>{productBrand}</Text>
                <Text style={styles.productPrice}>{productPrice} DT</Text>
              </View>

              <View style={styles.actions}>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleUpdateQuantity(productId, item.quantity - 1)}
                  >
                    <Ionicons name="remove" size={16} color={colors.gray[700]} />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleUpdateQuantity(productId, item.quantity + 1)}
                  >
                    <Ionicons name="add" size={16} color={colors.gray[700]} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove(productId, productName)}
                >
                  <Ionicons name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom Summary */}
      <View style={styles.bottomContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sous-total</Text>
          <Text style={styles.summaryValue}>{cartTotal.toFixed(2)} DT</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Livraison</Text>
          <Text style={styles.summaryValue}>7.00 DT</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{(cartTotal + 7).toFixed(2)} DT</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => {
            if (!user) {
              Alert.alert(
                'Connexion requise',
                'Veuillez vous connecter pour continuer',
                [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Se connecter', onPress: () => navigation.navigate('Login') },
                ]
              );
            } else {
              navigation.navigate('Checkout');
            }
          }}
        >
          <Text style={styles.checkoutButtonText}>Passer la commande</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.white} />
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
  header: {
    backgroundColor: colors.white,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  itemCount: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 4,
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
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
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  actions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
  },
  quantityButton: {
    padding: 6,
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
    paddingHorizontal: 12,
  },
  removeButton: {
    padding: 8,
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
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
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
    marginBottom: 20,
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
  checkoutButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  checkoutButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default CartScreen;
