import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { colors } from '../theme/colors';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

const ProductsScreen = ({ navigation, route }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(route?.params?.category || '');
  const [sortBy, setSortBy] = useState('newest');
  const [showSortModal, setShowSortModal] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const sortOptions = [
    { value: 'newest', label: 'Plus Récents' },
    { value: 'price-low', label: 'Prix: Croissant' },
    { value: 'price-high', label: 'Prix: Décroissant' },
    { value: 'name', label: 'Nom A-Z' },
    { value: 'rating', label: 'Mieux Notés' }
  ];

  // Fetch wishlist when user is logged in
  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/wishlist');
      const items = response.data.wishlist || [];
      setWishlist(items.map(item => item.id || item.product_id));
    } catch (error) {
      // Silently fail - user might not be logged in
    }
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      Alert.alert('Connexion requise', 'Veuillez vous connecter pour ajouter aux favoris', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se connecter', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }

    try {
      if (wishlist.includes(productId)) {
        await api.delete(`/wishlist/remove/${productId}`);
        setWishlist(wishlist.filter(id => id !== productId));
        Alert.alert('Succès', 'Produit retiré des favoris');
      } else {
        await api.post('/wishlist/add', { productId });
        setWishlist([...wishlist, productId]);
        Alert.alert('Succès', 'Produit ajouté aux favoris');
      }
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id, 1);
      Alert.alert('Succès', `${product.name} ajouté au panier !`);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter au panier');
    }
  };

  const categories = [
    { id: '', name: 'Tous', icon: 'apps' },
    { id: 'phone', name: 'Téléphones', icon: 'phone-portrait' },
    { id: 'accessory', name: 'Accessoires', icon: 'headset' },
    { id: 'speaker', name: 'Enceintes', icon: 'volume-high' },
    { id: 'watch', name: 'Montres', icon: 'watch' },
    { id: 'earphone', name: 'Écouteurs', icon: 'ear' },
    { id: 'charger', name: 'Chargeurs', icon: 'battery-charging' },
    { id: 'case', name: 'Coques', icon: 'shield' },
    { id: 'powerbank', name: 'Powerbank', icon: 'battery-full' },
    { id: 'tablet', name: 'Tablettes', icon: 'tablet-portrait' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (sortBy) params.append('sort', sortBy);

      const response = await api.get(`/products?${params.toString()}`);
      const rawProducts = response.data.products || [];
      
      // Parse images and specs if they're strings
      const parsedProducts = rawProducts.map(product => ({
        ...product,
        images: typeof product.images === 'string' 
          ? JSON.parse(product.images || '[]') 
          : (product.images || []),
        specs: typeof product.specs === 'string'
          ? JSON.parse(product.specs || '{}')
          : (product.specs || {}),
      }));
      
      setProducts(parsedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Produits</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.gray[400]} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.gray[400]}
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon}
              size={18}
              color={selectedCategory === category.id ? colors.white : colors.primary[600]}
            />
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category.id && styles.categoryChipTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary[600]} style={styles.loader} />
      ) : (
        <ScrollView
          style={styles.productsContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.productsGrid}>
            {products.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
                >
                  <View style={styles.productImageContainer}>
                    <Image
                      source={{ uri: product.images?.[0] || 'https://via.placeholder.com/150' }}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                    {/* Wishlist Heart Button */}
                    <TouchableOpacity 
                      style={styles.wishlistBtn}
                      onPress={() => toggleWishlist(product.id)}
                    >
                      <Ionicons 
                        name={wishlist.includes(product.id) ? "heart" : "heart-outline"} 
                        size={22} 
                        color={wishlist.includes(product.id) ? "#ef4444" : colors.gray[500]} 
                      />
                    </TouchableOpacity>
                    {/* Badge */}
                    {product.stock > 0 && product.stock < 10 && (
                      <View style={styles.productBadge}>
                        <Text style={styles.productBadgeText}>Stock limité</Text>
                      </View>
                    )}
                    {/* Quick View Button */}
                    <TouchableOpacity 
                      style={styles.quickViewBtn}
                      onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
                    >
                      <Ionicons name="eye" size={18} color={colors.gray[600]} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productBrand}>{product.brand}</Text>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <View style={styles.productFooter}>
                      <Text style={styles.productPrice}>{product.price} <Text style={styles.priceUnit}>Dt</Text></Text>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#fbbf24" />
                        <Text style={styles.ratingText}>{product.rating || '4.5'}</Text>
                      </View>
                    </View>
                    {product.stock < 5 && product.stock > 0 && (
                      <View style={styles.stockBadge}>
                        <Text style={styles.stockText}>Stock limité</Text>
                      </View>
                    )}
                    {product.stock === 0 && (
                      <View style={[styles.stockBadge, styles.outOfStock]}>
                        <Text style={styles.stockText}>Rupture</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
                {/* Add to Cart Button */}
                <TouchableOpacity
                  style={styles.addToCartBtn}
                  onPress={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <Ionicons name="cart" size={16} color={colors.white} />
                  <Text style={styles.addToCartText}>Ajouter</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {products.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={colors.gray[300]} />
              <Text style={styles.emptyText}>Aucun produit trouvé</Text>
            </View>
          )}
        </ScrollView>
      )}
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
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.gray[900],
  },
  categoriesContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    marginRight: 8,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: colors.primary[600],
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[600],
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  productsContainer: {
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
    borderRadius: 20,
    margin: 8,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  productImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.white,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    zIndex: 10,
  },
  productBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.primary[500],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  productBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  quickViewBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.white,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: colors.gray[600],
  },
  stockBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  outOfStock: {
    backgroundColor: colors.error,
  },
  stockText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: '600',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray[500],
    marginTop: 16,
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: 'normal',
    color: colors.gray[500],
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f2937',
    paddingVertical: 12,
    gap: 6,
  },
  addToCartText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductsScreen;
