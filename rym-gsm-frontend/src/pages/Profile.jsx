import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, Mail, Phone, MapPin, Save, Edit3, 
  Shield, Star, ShoppingBag, Heart, Settings,
  Camera, CheckCircle, XCircle, Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    }
  });

  const onSubmit = async (data) => {
    const result = await updateProfile(data);
    if (result.success) {
      toast.success('Profil mis à jour avec succès ! 🎉');
      setIsEditing(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const stats = [
    { icon: <ShoppingBag className="h-6 w-6" />, label: 'Commandes', value: '12', color: 'from-blue-500 to-blue-600' },
    { icon: <Heart className="h-6 w-6" />, label: 'Favoris', value: '8', color: 'from-red-500 to-red-600' },
    { icon: <Star className="h-6 w-6" />, label: 'Avis', value: '5', color: 'from-yellow-500 to-yellow-600' },
    { icon: <Shield className="h-6 w-6" />, label: 'Membre Depuis', value: '2024', color: 'from-green-500 to-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mon <span className="gradient-text">Profil</span>
          </h1>
          <p className="text-xl text-gray-600">Gérez les informations et préférences de votre compte</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
              {/* Avatar */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-16 w-16 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors duration-200">
                    <Camera className="h-5 w-5" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'Utilisateur'}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                  user?.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user?.role === 'admin' ? 'Administrateur' : 'Client'}
                </span>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className={`bg-gradient-to-r ${stat.color} rounded-xl p-4 text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {stat.icon}
                        <span className="font-semibold">{stat.label}</span>
                      </div>
                      <span className="text-2xl font-bold">{stat.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Settings className="h-6 w-6 mr-3 text-primary-500" />
                  Informations du Compte
                </h3>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="btn-secondary flex items-center"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Modifier le Profil
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nom Complet
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-4 h-5 w-5 text-primary-400" />
                        <input
                          {...register('name', {
                            required: 'Le nom est requis',
                            minLength: {
                              value: 2,
                              message: 'Le nom doit contenir au moins 2 caractères'
                            }
                          })}
                          type="text"
                          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                          placeholder="Entrez votre nom complet"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Adresse Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-4 h-5 w-5 text-primary-400" />
                        <input
                          {...register('email', {
                            required: 'L\'email est requis',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Adresse email invalide'
                            }
                          })}
                          type="email"
                          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                          placeholder="Entrez votre email"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Numéro de Téléphone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-4 h-5 w-5 text-primary-400" />
                        <input
                          {...register('phone', {
                            pattern: {
                              value: /^[\+]?[1-9][\d]{0,15}$/,
                              message: 'Numéro de téléphone invalide'
                            }
                          })}
                          type="tel"
                          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                          placeholder="Entrez votre numéro de téléphone"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rôle
                      </label>
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <Shield className="h-5 w-5 text-primary-500 mr-3" />
                        <span className="font-semibold text-gray-700">
                          {user?.role === 'admin' ? 'Administrateur' : 'Client'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Adresse
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-primary-400" />
                      <textarea
                        {...register('address')}
                        rows={4}
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                        placeholder="Entrez votre adresse"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enregistrement...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Save className="h-4 w-4 mr-2" />
                          Enregistrer les Modifications
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="p-6 bg-gray-50 rounded-xl">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nom Complet
                      </label>
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-primary-500 mr-3" />
                        <p className="text-lg text-gray-900">{user?.name || 'Non fourni'}</p>
                      </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-xl">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Adresse Email
                      </label>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-primary-500 mr-3" />
                        <p className="text-lg text-gray-900">{user?.email || 'Non fourni'}</p>
                      </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-xl">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Numéro de Téléphone
                      </label>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-primary-500 mr-3" />
                        <p className="text-lg text-gray-900">{user?.phone || 'Non fourni'}</p>
                      </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-xl">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rôle
                      </label>
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-primary-500 mr-3" />
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user?.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user?.role === 'admin' ? 'Administrateur' : 'Client'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary-500 mr-3 mt-1" />
                      <p className="text-lg text-gray-900">{user?.address || 'Non fourni'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Actions Rapides</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href="/orders"
                className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white text-center hover:scale-105 transition-transform duration-200"
              >
                <ShoppingBag className="h-8 w-8 mx-auto mb-3" />
                <h4 className="font-semibold">Voir les Commandes</h4>
                <p className="text-sm text-blue-100">Suivez vos commandes</p>
              </a>
              <a
                href="/cart"
                className="p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white text-center hover:scale-105 transition-transform duration-200"
              >
                <Heart className="h-8 w-8 mx-auto mb-3" />
                <h4 className="font-semibold">Panier d'Achat</h4>
                <p className="text-sm text-green-100">Voir votre panier</p>
              </a>
              <a
                href="/contact"
                className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white text-center hover:scale-105 transition-transform duration-200"
              >
                <Sparkles className="h-8 w-8 mx-auto mb-3" />
                <h4 className="font-semibold">Assistance</h4>
                <p className="text-sm text-purple-100">Obtenir de l'aide</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;