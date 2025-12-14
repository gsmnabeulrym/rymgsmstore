import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const ContactScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const contactInfo = [
    {
      icon: 'location',
      title: 'Adresse',
      value: 'Nabeul, Tunisie',
      action: null,
    },
    {
      icon: 'call',
      title: 'Téléphone',
      value: '+216 XX XXX XXX',
      action: () => Linking.openURL('tel:+21600000000'),
    },
    {
      icon: 'mail',
      title: 'Email',
      value: 'contact@rymgsm.com',
      action: () => Linking.openURL('mailto:contact@rymgsm.com'),
    },
    {
      icon: 'time',
      title: 'Horaires',
      value: 'Lun - Sam: 9h - 19h',
      action: null,
    },
  ];

  const socialLinks = [
    { icon: 'logo-facebook', color: '#1877F2', url: 'https://facebook.com' },
    { icon: 'logo-instagram', color: '#E4405F', url: 'https://instagram.com' },
    { icon: 'logo-whatsapp', color: '#25D366', url: 'https://wa.me/21600000000' },
  ];

  const handleSubmit = () => {
    const { name, email, subject, message } = formData;
    if (!name || !email || !subject || !message) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    Alert.alert('Succès', 'Votre message a été envoyé. Nous vous répondrons bientôt!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary[600], colors.purple[600]]}
        style={styles.header}
      >
        <Ionicons name="chatbubbles" size={50} color={colors.white} />
        <Text style={styles.headerTitle}>Contactez-nous</Text>
        <Text style={styles.headerSubtitle}>
          Nous sommes là pour vous aider
        </Text>
      </LinearGradient>

      {/* Contact Info Cards */}
      <View style={styles.infoContainer}>
        {contactInfo.map((info, index) => (
          <TouchableOpacity
            key={index}
            style={styles.infoCard}
            onPress={info.action}
            disabled={!info.action}
          >
            <View style={styles.infoIconContainer}>
              <Ionicons name={info.icon} size={24} color={colors.primary[600]} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>{info.title}</Text>
              <Text style={styles.infoValue}>{info.value}</Text>
            </View>
            {info.action && (
              <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Social Links */}
      <View style={styles.socialContainer}>
        <Text style={styles.socialTitle}>Suivez-nous</Text>
        <View style={styles.socialLinks}>
          {socialLinks.map((social, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.socialButton, { backgroundColor: social.color }]}
              onPress={() => Linking.openURL(social.url)}
            >
              <Ionicons name={social.icon} size={24} color={colors.white} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Contact Form */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Envoyez-nous un message</Text>

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

        <View style={styles.inputContainer}>
          <Ionicons name="document-text-outline" size={20} color={colors.gray[400]} />
          <TextInput
            style={styles.input}
            placeholder="Sujet"
            value={formData.subject}
            onChangeText={(value) => updateField('subject', value)}
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <View style={[styles.inputContainer, styles.textAreaContainer]}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Votre message..."
            value={formData.message}
            onChangeText={(value) => updateField('message', value)}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Envoyer le message</Text>
          <Ionicons name="send" size={20} color={colors.white} />
        </TouchableOpacity>
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
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.white,
    marginTop: 8,
    opacity: 0.9,
  },
  infoContainer: {
    backgroundColor: colors.white,
    marginTop: 20,
    paddingVertical: 8,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
  },
  socialContainer: {
    backgroundColor: colors.white,
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 16,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: colors.white,
    marginTop: 20,
    padding: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 12,
    fontSize: 16,
    color: colors.gray[900],
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 100,
    paddingLeft: 0,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default ContactScreen;
