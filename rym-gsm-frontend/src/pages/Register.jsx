import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowRight, Sparkles, Shield, CheckCircle, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    const result = await registerUser(data);
    if (result.success) {
      toast.success('Bienvenue chez RYM GSM ! Inscription réussie ! 🎉');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  const benefits = [
    { icon: <Shield className="h-5 w-5" />, text: "Protection sécurisée du compte" },
    { icon: <Star className="h-5 w-5" />, text: "Réductions exclusives membres" },
    { icon: <CheckCircle className="h-5 w-5" />, text: "Support client prioritaire" },
    { icon: <Sparkles className="h-5 w-5" />, text: "Accès anticipé aux nouveaux produits" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-100 flex">
      {/* Left Side - Registration Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo size="2xl" showText={false} className="animate-fade-in" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Rejoignez RYM GSM
            </h2>
            <p className="text-gray-600">
              Créez votre compte et commencez vos achats
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                  Nom Complet
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-primary-400" />
                  </div>
                  <input
                    {...register('name', {
                      required: 'Le nom est requis',
                      minLength: {
                        value: 2,
                        message: 'Le nom doit contenir au moins 2 caractères'
                      }
                    })}
                    type="text"
                    autoComplete="name"
                    className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Entrez votre nom complet"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Adresse Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-primary-400" />
                  </div>
                  <input
                    {...register('email', {
                      required: 'L\'email est requis',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Adresse email invalide'
                      }
                    })}
                    type="email"
                    autoComplete="email"
                    className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Entrez votre email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                  Numéro de Téléphone <span className="text-gray-400">(Optionnel)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-primary-400" />
                  </div>
                  <input
                    {...register('phone', {
                      pattern: {
                        value: /^[\+]?[1-9][\d]{0,15}$/,
                        message: 'Numéro de téléphone invalide'
                      }
                    })}
                    type="tel"
                    autoComplete="tel"
                    className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Entrez votre numéro de téléphone"
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Address Field */}
              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
                  Adresse <span className="text-gray-400">(Optionnel)</span>
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-primary-400" />
                  </div>
                  <textarea
                    {...register('address')}
                    rows={3}
                    className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                    placeholder="Entrez votre adresse"
                  />
                </div>
              </div>

              {/* Mot de Passe Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Mot de Passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-primary-400" />
                  </div>
                  <input
                    {...register('password', {
                      required: 'Le mot de passe est requis',
                      minLength: {
                        value: 6,
                        message: 'Le mot de passe doit contenir au moins 6 caractères'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="block w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Entrez votre mot de passe"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-primary-600 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Mot de Passe Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                  Confirm Mot de Passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-primary-400" />
                  </div>
                  <input
                    {...register('confirmPassword', {
                      required: 'Veuillez confirmer votre mot de passe',
                      validate: value => value === password || 'Les mots de passe ne correspondent pas'
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="block w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Confirmez votre mot de passe"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-primary-600 transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="agree-terms" className="ml-3 block text-sm text-gray-700">
                  J'accepte les{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500 font-semibold">
                    Conditions d'Utilisation
                  </Link>{' '}
                  et{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-500 font-semibold">
                    Politique de Confidentialité
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Création du compte...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Créer un Compte
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                )}
              </button>
            </form>

            {/* Benefits Section */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Avantages Membres</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="text-primary-500">{benefit.icon}</div>
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Vous avez déjà un compte ?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-200"
                >
                  Connectez-vous ici
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-primary-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 left-20 w-24 h-24 bg-white/5 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Phone Mockups */}
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="grid grid-cols-2 gap-8">
            <div className="transform rotate-12 hover:rotate-0 transition-transform duration-500">
              <div className="w-48 h-80 bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-600 rounded-[1.5rem] flex items-center justify-center">
                  <Sparkles className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
            <div className="transform -rotate-12 hover:rotate-0 transition-transform duration-500 mt-16">
              <div className="w-48 h-80 bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 rounded-[1.5rem] flex items-center justify-center">
                  <Shield className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Text */}
        <div className="absolute bottom-10 right-10 text-white text-right">
          <h3 className="text-2xl font-bold mb-2">Rejoignez Notre Communauté</h3>
          <p className="text-white/80">Accédez aux offres exclusives</p>
        </div>
      </div>
    </div>
  );
};

export default Register;