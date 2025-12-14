import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const WishlistScreen = ({ navigation }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.get('/wishlist');
      // Backend returns { wishlist: [...] }
      const rawItems = response.data.wishlist || response.data.items || response.data || [];
      
      // Parse images if they're strings (backend already parses them but just in case)
      const parsedItems = rawItems.map(item => {
        let images = item.images || [];
        if (typeof images === 'string') {
          try {
            images = JSON.parse(images);
          } catch (e) {
            images = images.split(',').map(img => img.trim());
          }
        }
        return {
          ...item,
          images: Array.isArray(images) ? images : [],
        };
      });
      
      setWishlist(parsedItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      // Backend uses /wishlist/remove/:productId
      await api.delete(`/wishlist/remove/${productId}`);
      setWishlist(wishlist.filter(item => (item.product_id || item.id) !== productId));
      Alert.alert('Succès', 'Produit retiré de la liste de souhaits');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de retirer le produit');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id || product.product_id, 1);
      Alert.alert('Succès', `${product.name} ajouté au panier !`);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter au panier');
    }
  };

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={100} color={colors.gray[300]} />
        <Text style={styles.emptyTitle}>Connectez-vous</Text>
        <Text style={styles.emptyText}>
          Connectez-vous pour voir votre liste de souhaits
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

  if (wishlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={100} color={colors.gray[300]} />
        <Text style={styles.emptyTitle}>Liste de souhaits vide</Text>
        <Text style={styles.emptyText}>
          Ajoutez des produits à votre liste de souhaits
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ma Liste de Souhaits</Text>
        <Text style={styles.itemCount}>{wishlist.length} article(s)</Text>
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.productsGrid}>
          {wishlist.map((item) => {
            const product = item.product || item;
            const productId = item.product_id || item.id;

            return (
              <View key={productId} style={styles.productCard}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProductDetails', { productId })}
                >
                  <View style={styles.productImageContainer}>
                    <Image
                      source={{ uri: product.images?.[0] || 'https://via.placeholder.com/150' }}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeFromWishlist(productId)}
                    >
                      <Ionicons name="close" size={18} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productBrand}>{product.brand}</Text>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <Text style={styles.productPrice}>{product.price} Dt</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addToCartBtn}
                  onPress={() => handleAddToCart(product)}
                >
                  <Ionicons name="cart" size={16} color={colors.white} />
                  <Text style={styles.addToCartText}>Ajouter au panier</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: colors.gray[50],
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginTop: 24,
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
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  shopButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
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
  listContainer: {
    flex: 1,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  productCard: {
    width: (width - 48) / 2,
    backgroundColor: colors.white,
    borderRadius: 16,
    margin: 8,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    backgroundColor: '#f9fafb',
  },
  productImage: {
    width: '100%',
    height: 130,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.error,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 12,
  },
  productBrand: {
    fontSize: 12,
    color: colors.gray[500],
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[600],
    paddingVertical: 12,
    gap: 6,
  },
  addToCartText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default WishlistScreen;
