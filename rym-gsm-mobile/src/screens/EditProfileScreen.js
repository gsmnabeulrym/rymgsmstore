import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Erreur', 'Le nom et l\'email sont requis');
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/auth/profile', formData);
      if (updateUser) {
        updateUser(response.data.user || formData);
      }
      Alert.alert('Succès', 'Profil mis à jour avec succès', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.message || 'Échec de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

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
              {formData.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <TouchableOpacity style={styles.editAvatarBtn}>
            <Ionicons name="camera" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Informations personnelles</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom complet</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={colors.gray[400]} />
            <TextInput
              style={styles.input}
              placeholder="Votre nom"
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholderTextColor={colors.gray[400]}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.gray[400]} />
            <TextInput
              style={styles.input}
              placeholder="Votre email"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.gray[400]}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Téléphone</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color={colors.gray[400]} />
            <TextInput
              style={styles.input}
              placeholder="Votre numéro de téléphone"
              value={formData.phone}
              onChangeText={(value) => updateField('phone', value)}
              keyboardType="phone-pad"
              placeholderTextColor={colors.gray[400]}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.saveButtonText}>Enregistrer</Text>
              <Ionicons name="checkmark" size={20} color={colors.white} />
            </>
          )}
        </TouchableOpacity>
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
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary[600],
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 12,
    fontSize: 16,
    color: colors.gray[900],
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
