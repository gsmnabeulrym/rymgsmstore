import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

const AddressesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    isDefault: false,
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const saved = await AsyncStorage.getItem('user_addresses');
      if (saved) {
        setAddresses(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const saveAddresses = async (newAddresses) => {
    try {
      await AsyncStorage.setItem('user_addresses', JSON.stringify(newAddresses));
      setAddresses(newAddresses);
    } catch (error) {
      console.error('Error saving addresses:', error);
    }
  };

  const handleSave = () => {
    if (!formData.address || !formData.city || !formData.postalCode) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    let newAddresses;
    if (editingAddress !== null) {
      newAddresses = addresses.map((addr, index) =>
        index === editingAddress ? { ...formData, id: addr.id } : addr
      );
    } else {
      const newAddress = {
        ...formData,
        id: Date.now().toString(),
      };
      newAddresses = [...addresses, newAddress];
    }

    if (formData.isDefault) {
      newAddresses = newAddresses.map((addr, index) => ({
        ...addr,
        isDefault: editingAddress !== null 
          ? index === editingAddress 
          : index === newAddresses.length - 1,
      }));
    }

    saveAddresses(newAddresses);
    resetForm();
  };

  const handleDelete = (index) => {
    Alert.alert(
      'Supprimer',
      'Voulez-vous supprimer cette adresse?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            const newAddresses = addresses.filter((_, i) => i !== index);
            saveAddresses(newAddresses);
          },
        },
      ]
    );
  };

  const handleEdit = (index) => {
    setEditingAddress(index);
    setFormData(addresses[index]);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      label: '',
      address: '',
      city: '',
      postalCode: '',
      phone: '',
      isDefault: false,
    });
    setEditingAddress(null);
    setShowModal(false);
  };

  const setAsDefault = (index) => {
    const newAddresses = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index,
    }));
    saveAddresses(newAddresses);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary[600], colors.purple[600]]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Mes Adresses</Text>
        <Text style={styles.headerSubtitle}>{addresses.length} adresse(s) enregistrée(s)</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={80} color={colors.gray[300]} />
            <Text style={styles.emptyTitle}>Aucune adresse</Text>
            <Text style={styles.emptyText}>
              Ajoutez une adresse pour faciliter vos commandes
            </Text>
          </View>
        ) : (
          addresses.map((address, index) => (
            <View key={address.id} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <View style={styles.labelContainer}>
                  <Ionicons name="location" size={20} color={colors.primary[600]} />
                  <Text style={styles.addressLabel}>
                    {address.label || `Adresse ${index + 1}`}
                  </Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Par défaut</Text>
                    </View>
                  )}
                </View>
                <View style={styles.addressActions}>
                  <TouchableOpacity onPress={() => handleEdit(index)}>
                    <Ionicons name="pencil" size={20} color={colors.gray[500]} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(index)}>
                    <Ionicons name="trash" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.addressText}>{address.address}</Text>
              <Text style={styles.addressText}>{address.city}, {address.postalCode}</Text>
              {address.phone && (
                <Text style={styles.addressPhone}>📞 {address.phone}</Text>
              )}
              {!address.isDefault && (
                <TouchableOpacity
                  style={styles.setDefaultBtn}
                  onPress={() => setAsDefault(index)}
                >
                  <Text style={styles.setDefaultText}>Définir par défaut</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowModal(true)}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>

      {/* Add/Edit Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={resetForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingAddress !== null ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
              </Text>
              <TouchableOpacity onPress={resetForm}>
                <Ionicons name="close" size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nom de l'adresse (optionnel)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Maison, Bureau..."
                  value={formData.label}
                  onChangeText={(value) => setFormData({ ...formData, label: value })}
                  placeholderTextColor={colors.gray[400]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Adresse *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Rue, numéro, quartier..."
                  value={formData.address}
                  onChangeText={(value) => setFormData({ ...formData, address: value })}
                  placeholderTextColor={colors.gray[400]}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Ville *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ville"
                    value={formData.city}
                    onChangeText={(value) => setFormData({ ...formData, city: value })}
                    placeholderTextColor={colors.gray[400]}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Code postal *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Code postal"
                    value={formData.postalCode}
                    onChangeText={(value) => setFormData({ ...formData, postalCode: value })}
                    keyboardType="numeric"
                    placeholderTextColor={colors.gray[400]}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Téléphone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Numéro de téléphone"
                  value={formData.phone}
                  onChangeText={(value) => setFormData({ ...formData, phone: value })}
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
              >
                <Ionicons
                  name={formData.isDefault ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={colors.primary[600]}
                />
                <Text style={styles.checkboxLabel}>Définir comme adresse par défaut</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: 8,
  },
  addressCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
  },
  defaultBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  defaultText: {
    fontSize: 11,
    color: colors.primary[600],
    fontWeight: '600',
  },
  addressActions: {
    flexDirection: 'row',
    gap: 16,
  },
  addressText: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 4,
  },
  addressPhone: {
    fontSize: 14,
    color: colors.gray[600],
    marginTop: 8,
  },
  setDefaultBtn: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  setDefaultText: {
    fontSize: 14,
    color: colors.primary[600],
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.gray[900],
  },
  row: {
    flexDirection: 'row',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 16,
  },
  checkboxLabel: {
    fontSize: 15,
    color: colors.gray[700],
  },
  saveButton: {
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default AddressesScreen;
