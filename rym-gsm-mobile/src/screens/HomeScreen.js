import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { colors } from '../theme/colors';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const slideRef = useRef(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Hero slides data matching web app
  const heroSlides = [
    {
      title: "OPPO A6 Pro",
      subtitle: "Performance et élégance à prix accessible",
      price4g: "999",
      price5g: "1199",
      gradient: ['#db2777', '#f43f5e', '#fb923c'],
      specs: ["4G / 5G", "7000mAh", "50MP AI", "8GB + 256GB"]
    },
    {
      title: "Xiaomi Redmi 15C",
      subtitle: "Performance et design à petit prix",
      price: "549",
      gradient: ['#0891b2', '#14b8a6', '#10b981'],
      specs: ["4G LTE", "5160mAh", "50MP", "4GB + 128GB"]
    },
    {
      title: "Samsung Galaxy A56 5G",
      subtitle: "L'expérience Galaxy nouvelle génération",
      price: "1999",
      gradient: ['#7c3aed', '#a855f7', '#6366f1'],
      specs: ["5G", "5000mAh", "50MP OIS", "8GB + 256GB"]
    }
  ];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchFeaturedProducts();
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
      // Silently fail
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

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/products?limit=8');
      const products = response.data.products || response.data || [];
      
      // Parse images and specs if they're strings
      const parsedProducts = products.map(product => ({
        ...product,
        images: typeof product.images === 'string' 
          ? JSON.parse(product.images || '[]') 
          : (product.images || []),
        specs: typeof product.specs === 'string'
          ? JSON.parse(product.specs || '{}')
          : (product.specs || {}),
      }));
      
      setFeaturedProducts(parsedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const categories = [
    { id: 'phone', name: 'Téléphones', icon: 'phone-portrait', color: '#3b82f6' },
    { id: 'accessory', name: 'Accessoires', icon: 'headset', color: '#8b5cf6' },
    { id: 'speaker', name: 'Enceintes', icon: 'volume-high', color: '#ec4899' },
    { id: 'watch', name: 'Montres', icon: 'watch', color: '#f59e0b' },
    { id: 'earphone', name: 'Écouteurs', icon: 'ear', color: '#10b981' },
    { id: 'charger', name: 'Chargeurs', icon: 'battery-charging', color: '#ef4444' },
  ];

  const brands = [
    { name: "Samsung", emoji: "🔷" },
    { name: "Xiaomi", emoji: "🟠" },
    { name: "OPPO", emoji: "🟢" },
    { name: "Infinix", emoji: "🔵" },
    { name: "Tecno", emoji: "🟣" },
    { name: "Honor", emoji: "🔶" },
  ];

  const stats = [
    { number: "5000+", label: "Clients", icon: "people" },
    { number: "200+", label: "Modèles", icon: "phone-portrait" },
    { number: "100%", label: "Original", icon: "shield-checkmark" },
    { number: "24h", label: "Livraison", icon: "car" },
  ];

  const features = [
    { icon: "phone-portrait", title: "Originaux", desc: "100% authentiques", color: ['#ec4899', '#f43f5e'] },
    { icon: "car", title: "Livraison", desc: "24-48h", color: ['#06b6d4', '#14b8a6'] },
    { icon: "shield-checkmark", title: "Garantie", desc: "1 An", color: ['#8b5cf6', '#a855f7'] },
    { icon: "cash", title: "Paiement", desc: "À la livraison", color: ['#f59e0b', '#fb923c'] },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Slider */}
      <LinearGradient
        colors={heroSlides[currentSlide].gradient}
        style={styles.heroSlider}
      >
        {/* Header inside hero */}
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>RYM GSM</Text>
            <Text style={styles.headerSubtitle}>Nabeul</Text>
          </View>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => navigation.navigate('ProductsTab')}
          >
            <Ionicons name="search" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Hero Content */}
        <View style={styles.heroContent}>
          <View style={styles.heroBadge}>
            <Ionicons name="sparkles" size={14} color="#fbbf24" />
            <Text style={styles.heroBadgeText}>Nouveau Arrivage</Text>
          </View>
          
          <Text style={styles.heroTitle}>{heroSlides[currentSlide].title}</Text>
          <Text style={styles.heroSubtitle}>{heroSlides[currentSlide].subtitle}</Text>
          
          {/* Price */}
          <View style={styles.priceContainer}>
            {heroSlides[currentSlide].price4g ? (
              <>
                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>4G</Text>
                  <Text style={styles.priceValue}>{heroSlides[currentSlide].price4g} Dt</Text>
                </View>
                <View style={[styles.priceBox, styles.priceBoxHighlight]}>
                  <Text style={styles.priceLabelHighlight}>5G</Text>
                  <Text style={styles.priceValue}>{heroSlides[currentSlide].price5g} Dt</Text>
                </View>
              </>
            ) : (
              <View style={styles.priceBox}>
                <Text style={styles.priceValue}>{heroSlides[currentSlide].price} Dt</Text>
              </View>
            )}
          </View>

          {/* Specs */}
          <View style={styles.specsRow}>
            {heroSlides[currentSlide].specs.map((spec, i) => (
              <View key={i} style={styles.specItem}>
                <Text style={styles.specText}>{spec}</Text>
              </View>
            ))}
          </View>

          {/* CTA Button */}
          <TouchableOpacity 
            style={styles.heroButton}
            onPress={() => navigation.navigate('ProductsTab')}
          >
            <Text style={styles.heroButtonText}>Acheter Maintenant</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.primary[600]} />
          </TouchableOpacity>

          {/* Slide Indicators */}
          <View style={styles.slideIndicators}>
            {heroSlides.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentSlide(index)}
                style={[
                  styles.indicator,
                  index === currentSlide && styles.indicatorActive
                ]}
              />
            ))}
          </View>
        </View>
      </LinearGradient>

      {/* Brands Marquee */}
      <View style={styles.brandsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {brands.map((brand, index) => (
            <View key={index} style={styles.brandItem}>
              <Text style={styles.brandEmoji}>{brand.emoji}</Text>
              <Text style={styles.brandName}>{brand.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Catégories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('ProductsTab', { category: category.id })}
            >
              <View style={styles.categoryIcon}>
                <Ionicons name={category.icon} size={28} color={colors.primary[600]} />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Produits Populaires</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProductsTab')}>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary[600]} style={styles.loader} />
        ) : (
          <View style={styles.productsGrid}>
            {featuredProducts.slice(0, 6).map((product) => (
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
                        size={20} 
                        color={wishlist.includes(product.id) ? "#ef4444" : colors.gray[500]} 
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productBrand}>{product.brand}</Text>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <View style={styles.productFooter}>
                      <Text style={styles.productPrice}>{product.price} DT</Text>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color={colors.warning} />
                        <Text style={styles.ratingText}>
                          {product.rating || '4.5'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Features Section with Gradient Cards */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleCenter}>Pourquoi Nous Choisir</Text>
        </View>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <LinearGradient
              key={index}
              colors={feature.color}
              style={styles.featureCardGradient}
            >
              <View style={styles.featureIconBox}>
                <Ionicons name={feature.icon} size={24} color={colors.white} />
              </View>
              <Text style={styles.featureTitleWhite}>{feature.title}</Text>
              <Text style={styles.featureDescWhite}>{feature.desc}</Text>
            </LinearGradient>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <LinearGradient
        colors={['#1f2937', '#111827', '#1f2937']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.statsSection}
      >
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <LinearGradient
              colors={[colors.primary[500], '#ec4899']}
              style={styles.statIconBox}
            >
              <Ionicons name={stat.icon} size={20} color={colors.white} />
            </LinearGradient>
            <Text style={styles.statNumber}>{stat.number}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </LinearGradient>

      {/* CTA Section */}
      <LinearGradient
        colors={[colors.primary[600], '#ec4899', '#8b5cf6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.ctaSection}
      >
        <Text style={styles.ctaTitle}>Prêt à Commander ?</Text>
        <Text style={styles.ctaSubtitle}>Livraison gratuite pour les commandes de plus de 500 Dt</Text>
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => navigation.navigate('ProductsTab')}
        >
          <Text style={styles.ctaButtonText}>Explorer les Produits</Text>
          <Ionicons name="arrow-forward" size={20} color="#1f2937" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Bottom Spacing */}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  // Hero Slider Styles
  heroSlider: {
    paddingTop: 50,
    paddingBottom: 30,
    minHeight: 480,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  searchButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  heroContent: {
    paddingHorizontal: 20,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
    gap: 6,
  },
  heroBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  priceBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  priceBoxHighlight: {
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  priceLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 2,
  },
  priceLabelHighlight: {
    color: '#fbbf24',
    fontSize: 12,
    marginBottom: 2,
  },
  priceValue: {
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  specsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  specItem: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  specText: {
    color: colors.white,
    fontSize: 11,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    alignSelf: 'flex-start',
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  heroButtonText: {
    color: colors.primary[600],
    fontWeight: 'bold',
    fontSize: 16,
  },
  slideIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  indicatorActive: {
    width: 24,
    backgroundColor: colors.white,
  },
  // Brands Section
  brandsSection: {
    backgroundColor: '#1f2937',
    paddingVertical: 16,
  },
  brandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    gap: 8,
  },
  brandEmoji: {
    fontSize: 24,
  },
  brandName: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[900],
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllText: {
    color: colors.primary[600],
    fontWeight: '600',
  },
  categoryCard: {
    alignItems: 'center',
    marginLeft: 20,
    width: 80,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: colors.gray[700],
    textAlign: 'center',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  productCard: {
    width: (width - 48) / 2,
    backgroundColor: colors.white,
    borderRadius: 12,
    margin: 8,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    backgroundColor: '#f9fafb',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.white,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    zIndex: 10,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
  loader: {
    marginVertical: 40,
  },
  // Features Grid Styles
  sectionTitleCenter: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.gray[900],
    textAlign: 'center',
    flex: 1,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  featureCardGradient: {
    width: (width - 48) / 2,
    margin: 8,
    padding: 20,
    borderRadius: 20,
    minHeight: 140,
  },
  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitleWhite: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  featureDescWhite: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  // Stats Section Styles
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  // CTA Section Styles
  ctaSection: {
    padding: 32,
    alignItems: 'center',
    marginTop: 20,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  ctaButtonText: {
    color: '#1f2937',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;
