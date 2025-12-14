import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.navigate('HomeTab');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'receipt-outline',
      title: 'Mes Commandes',
      subtitle: 'Voir l\'historique',
      onPress: () => navigation.navigate('Orders'),
    },
    {
      icon: 'heart-outline',
      title: 'Liste de Souhaits',
      subtitle: 'Produits favoris',
      onPress: () => navigation.navigate('Wishlist'),
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Voir les notifications',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      icon: 'person-outline',
      title: 'Informations personnelles',
      subtitle: 'Modifier le profil',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: 'location-outline',
      title: 'Adresses',
      subtitle: 'Gérer les adresses',
      onPress: () => navigation.navigate('Addresses'),
    },
    {
      icon: 'chatbubbles-outline',
      title: 'Contactez-nous',
      subtitle: 'Aide & Support',
      onPress: () => navigation.navigate('Contact'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary[600], colors.purple[600]]}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        </View>
        <Text style={styles.userName}>{user?.name || 'Utilisateur'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
      </LinearGradient>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name={item.icon} size={24} color={colors.primary[600]} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color={colors.error} />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>RYM GSM Mobile v1.0.0</Text>
        <Text style={styles.appInfoText}>© 2024 RYM GSM Nabeul</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 15,
    color: colors.white,
    opacity: 0.9,
  },
  menuContainer: {
    backgroundColor: colors.white,
    marginTop: 20,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: colors.gray[500],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  appInfoText: {
    fontSize: 13,
    color: colors.gray[500],
    marginBottom: 4,
  },
});

export default ProfileScreen;
