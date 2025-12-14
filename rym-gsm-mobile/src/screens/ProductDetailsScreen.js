import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProduct();
    if (user) {
      checkWishlistStatus();
    }
  }, [productId, user]);

  const checkWishlistStatus = async () => {
    try {
      const response = await api.get('/wishlist');
      const items = response.data.wishlist || [];
      const isInList = items.some(item => (item.id || item.product_id) === parseInt(productId));
      setIsInWishlist(isInList);
    } catch (error) {
      // Silently fail
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      Alert.alert('Connexion requise', 'Veuillez vous connecter pour ajouter aux favoris', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se connecter', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }

    try {
      if (isInWishlist) {
        await api.delete(`/wishlist/remove/${productId}`);
        setIsInWishlist(false);
        Alert.alert('Succès', 'Produit retiré des favoris');
      } else {
        await api.post('/wishlist/add', { productId: parseInt(productId) });
        setIsInWishlist(true);
        Alert.alert('Succès', 'Produit ajouté aux favoris');
      }
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${productId}`);
      // Backend returns { product: {...} }
      const productData = response.data.product || response.data;
      
      // Parse images if they're a string
      if (typeof productData.images === 'string') {
        try {
          productData.images = JSON.parse(productData.images);
        } catch (e) {
          productData.images = [];
        }
      }
      
      // Parse specs if they're a string
      if (typeof productData.specs === 'string') {
        try {
          productData.specs = JSON.parse(productData.specs);
        } catch (e) {
          productData.specs = {};
        }
      }
      
      setProduct(productData);
    } catch (error) {
      console.error('Error fetching product:', error);
      Alert.alert('Erreur', 'Impossible de charger le produit');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const result = await addToCart(productId, quantity);
    if (result.success) {
      Alert.alert('Succès', 'Produit ajouté au panier', [
        { text: 'Continuer', style: 'cancel' },
        { text: 'Voir le panier', onPress: () => navigation.navigate('CartTab') },
      ]);
    } else {
      Alert.alert('Erreur', result.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.gray[400]} />
        <Text style={styles.errorText}>Produit introuvable</Text>
      </View>
    );
  }

  const images = product.images || [];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          {/* Wishlist Heart Button */}
          <TouchableOpacity 
            style={styles.wishlistBtn}
            onPress={toggleWishlist}
          >
            <Ionicons 
              name={isInWishlist ? "heart" : "heart-outline"} 
              size={26} 
              color={isInWishlist ? "#ef4444" : colors.gray[500]} 
            />
          </TouchableOpacity>
          <Image
            source={{ uri: images[selectedImage] || 'https://via.placeholder.com/400' }}
            style={styles.mainImage}
            resizeMode="contain"
          />
          {images.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailContainer}
            >
              {images.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImage(index)}
                  style={[
                    styles.thumbnail,
                    selectedImage === index && styles.thumbnailActive,
                  ]}
                >
                  <Image
                    source={{ uri: img }}
                    style={styles.thumbnailImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <View style={styles.rating}>
              <Ionicons name="star" size={18} color={colors.warning} />
              <Text style={styles.ratingText}>{product.rating || '4.5'}</Text>
              <Text style={styles.reviewsText}>({product.reviews_count || 0} avis)</Text>
            </View>
            {product.stock > 0 ? (
              <View style={styles.stockBadge}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.stockText}>En stock</Text>
              </View>
            ) : (
              <View style={[styles.stockBadge, styles.outOfStock]}>
                <Ionicons name="close-circle" size={16} color={colors.error} />
                <Text style={[styles.stockText, { color: colors.error }]}>Rupture</Text>
              </View>
            )}
          </View>

          <Text style={styles.price}>{product.price} DT</Text>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Specifications */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Caractéristiques</Text>
              {Object.entries(product.specs).map(([key, value]) => (
                <View key={key} style={styles.specRow}>
                  <Text style={styles.specKey}>{key}</Text>
                  <Text style={styles.specValue}>{value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Ionicons name="remove" size={20} color={colors.gray[700]} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock}
          >
            <Ionicons name="add" size={20} color={colors.gray[700]} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.addToCartButton, product.stock === 0 && styles.disabledButton]}
          onPress={handleAddToCart}
          disabled={product.stock === 0}
        >
          <Ionicons name="cart" size={20} color={colors.white} />
          <Text style={styles.addToCartText}>
            {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  imageContainer: {
    backgroundColor: colors.gray[50],
    position: 'relative',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.white,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  mainImage: {
    width: width,
    height: width,
  },
  thumbnailContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.gray[200],
    marginRight: 8,
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: colors.primary[600],
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 20,
  },
  brand: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
  },
  reviewsText: {
    fontSize: 14,
    color: colors.gray[500],
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  outOfStock: {
    opacity: 1,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary[600],
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: colors.gray[700],
    lineHeight: 22,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  specKey: {
    fontSize: 14,
    color: colors.gray[600],
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
    flex: 1,
    textAlign: 'right',
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.white,
    gap: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    paddingHorizontal: 16,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary[600],
    borderRadius: 8,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  disabledButton: {
    backgroundColor: colors.gray[400],
  },
  addToCartText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreen;
