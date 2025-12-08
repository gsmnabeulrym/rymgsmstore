import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Shield, Zap, Heart, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      toast.success('Bon retour ! Connexion réussie ! 🎉');
      navigate(from, { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo size="xl" className="animate-fade-in" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bon Retour !
            </h2>
            <p className="text-gray-600">
              Connectez-vous à votre compte RYM GSM
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Mot de passe
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
                    autoComplete="current-password"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Se souvenir de moi
                  </label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
                >
                  Mot de passe oublié ?
                </Link>
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
                    Connexion en cours...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Se Connecter
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Identifiants de Démo</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="bg-gradient-to-r from-primary-50 to-purple-50 p-4 rounded-xl border border-primary-100">
                  <div className="flex items-center mb-2">
                    <Shield className="h-4 w-4 text-primary-500 mr-2" />
                    <p className="text-sm font-semibold text-gray-700">Compte Admin</p>
                  </div>
                  <p className="text-xs text-gray-600">Email: admin@rymgsm.com</p>
                  <p className="text-xs text-gray-600">Password: password</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                  <div className="flex items-center mb-2">
                    <Heart className="h-4 w-4 text-purple-500 mr-2" />
                    <p className="text-sm font-semibold text-gray-700">Compte Client</p>
                  </div>
                  <p className="text-xs text-gray-600">Email: customer@example.com</p>
                  <p className="text-xs text-gray-600">Password: password</p>
                </div>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Vous n'avez pas de compte ?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-200"
                >
                  Créez-en un maintenant
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Phone Mockups */}
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="grid grid-cols-2 gap-8">
            <div className="transform rotate-12 hover:rotate-0 transition-transform duration-500">
              <div className="w-48 h-80 bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 rounded-[1.5rem] flex items-center justify-center">
                  <Phone className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
            <div className="transform -rotate-12 hover:rotate-0 transition-transform duration-500 mt-16">
              <div className="w-48 h-80 bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-600 rounded-[1.5rem] flex items-center justify-center">
                  <Sparkles className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Text */}
        <div className="absolute bottom-10 left-10 text-white">
          <h3 className="text-2xl font-bold mb-2">Bienvenue chez RYM GSM</h3>
          <p className="text-white/80">Votre partenaire mobile de confiance</p>
        </div>
      </div>
    </div>
  );
};

export default Login;