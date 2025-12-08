import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, 
  MessageCircle, Users, Headphones, Sparkles, CheckCircle,
  ArrowRight, Heart, Star, Zap, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Message envoyé avec succès ! Nous vous répondrons bientôt ! 🎉');
    reset();
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-8 w-8 text-primary-500" />,
      title: "📍 Notre Emplacement",
      details: [
        "126, Avenue Habib Bourguiba",
        "Nabeul 8000 – Tunisia"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Phone className="h-8 w-8 text-primary-500" />,
      title: "📞 Appelez-nous",
      details: [
        "+216 26 419 140",
        "+216 20 144 333"
      ],
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Mail className="h-8 w-8 text-primary-500" />,
      title: "📧 Envoyez-nous un Email",
      details: [
        "gsmnabeulrym@gmail.com"
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary-500" />,
      title: "🕒 Horaires d'Ouverture",
      details: [
        "🟢 Ouvert tous les jours : 9h00 – 21h00"
      ],
      color: "from-orange-500 to-orange-600"
    }
  ];

  const faqs = [
    {
      question: "Quelle est votre politique de retour ?",
      answer: "Nous offrons une politique de retour sans tracas de 30 jours pour tous les produits. Les articles doivent être dans leur état d'origine avec l'emballage."
    },
    {
      question: "Offrez-vous une garantie ?",
      answer: "Oui, tous nos produits sont accompagnés d'une garantie complète de 2 ans couvrant les défauts de fabrication et l'usure normale."
    },
    {
      question: "Combien de temps prend la livraison ?",
      answer: "La livraison standard prend 3 à 5 jours ouvrables. La livraison express est disponible pour une livraison en 1 à 2 jours."
    },
    {
      question: "Alignez-vous les prix ?",
      answer: "Oui, nous alignons les prix des concurrents sur des produits identiques. Contactez-nous avec les détails pour vérification."
    },
    {
      question: "Quels modes de paiement acceptez-vous ?",
      answer: "Nous acceptons les espèces, les cartes de crédit, les virements bancaires et les paiements mobiles pour votre commodité."
    },
    {
      question: "Offrez-vous un support technique ?",
      answer: "Absolument ! Notre équipe technique fournit un support gratuit pour tous les produits achetés dans notre magasin."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Contactez-<span className="text-yellow-300">Nous</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Contactez notre équipe pour toute question, support ou commentaire
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-lg rounded-xl px-6 py-3">
              <MessageCircle className="h-5 w-5" />
              <span>Réponse Rapide</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-lg rounded-xl px-6 py-3">
              <Users className="h-5 w-5" />
              <span>Support Expert</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-lg rounded-xl px-6 py-3">
              <Heart className="h-5 w-5" />
              <span>Disponible 24/7</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Envoyez-nous un Message</h2>
                <p className="text-gray-600">Nous serions ravis de vous entendre ! Envoyez-nous un message et nous vous répondrons dès que possible.</p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      {...register('firstName', { required: 'Le prénom est requis' })}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                      placeholder="Entrez votre prénom"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      {...register('lastName', { required: 'Le nom est requis' })}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                      placeholder="Entrez votre nom"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresse Email
                  </label>
                  <input
                    {...register('email', {
                      required: 'L\'email est requis',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Adresse email invalide'
                      }
                    })}
                    type="email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Entrez votre email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sujet
                  </label>
                  <input
                    {...register('subject', { required: 'Le sujet est requis' })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Entrez le sujet"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    {...register('message', { required: 'Le message est requis' })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                    placeholder="Entrez votre message"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Send className="h-5 w-5 mr-2" />
                      Envoyer le Message
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contactez-Nous</h2>
              <p className="text-lg text-gray-600 mb-8">
                Nous sommes là pour vous aider ! Que vous ayez des questions sur nos produits, 
                besoin d'un support technique ou que vous souhaitiez nous faire part de vos commentaires, nous serions ravis de vous entendre.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="group">
                  <div className={`bg-gradient-to-r ${info.color} rounded-2xl p-6 text-white hover:scale-105 transition-all duration-300 shadow-lg`}>
                    <div className="flex items-center mb-4">
                      {info.icon}
                      <h3 className="text-lg font-bold ml-3">
                        {info.title}
                      </h3>
                    </div>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-white/90 mb-1">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Sparkles className="h-6 w-6 mr-3 text-primary-500" />
                Suivez-Nous
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200">
                  <Facebook className="h-6 w-6 text-blue-600" />
                  <span className="text-gray-700 font-semibold">Facebook: Rym GSM</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors duration-200">
                  <Instagram className="h-6 w-6 text-pink-600" />
                  <span className="text-gray-700 font-semibold">Instagram: @rym.gsm.nabeul</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                  <span className="text-2xl">🎵</span>
                  <span className="text-gray-700 font-semibold">TikTok: @rym.gsm.nabeul</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trouvez-<span className="gradient-text">Nous</span>
            </h2>
            <p className="text-xl text-gray-600">Visitez notre magasin au cœur de Nabeul</p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
            <div className="h-96 bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center relative">
              <div className="text-center">
                <MapPin className="h-20 w-20 text-primary-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">RYM GSM Store</h3>
                <p className="text-gray-600 mb-4">126, Avenue Habib Bourguiba, Nabeul 8000</p>
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    <span>Ouvert Maintenant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Questions <span className="gradient-text">Fréquentes</span>
            </h2>
            <p className="text-xl text-gray-600">Trouvez des réponses aux questions courantes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-primary-500" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Prêt à Commencer ?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Visitez notre magasin ou parcourez notre catalogue en ligne pour trouver l'appareil parfait pour vous
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+21626419140"
                  className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Appeler Maintenant
                </a>
                <a
                  href="/products"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Parcourir les Produits
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;