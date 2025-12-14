import { useState, useEffect } from 'react';
import { 
  MapPin, Phone, Mail, Clock, Facebook, Instagram, 
  Sparkles, CheckCircle, ArrowRight, Copy, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié dans le presse-papiers !`);
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Notre Emplacement",
      details: [
        "126, Avenue Habib Bourguiba",
        "Nabeul 8000 – Tunisia"
      ],
      color: "from-blue-500 to-blue-600",
      action: "Voir sur la carte",
      link: "https://maps.google.com/?q=126+Avenue+Habib+Bourguiba+Nabeul"
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Appelez-nous",
      details: [
        "+216 26 419 140",
        "+216 20 144 333"
      ],
      color: "from-green-500 to-green-600",
      action: "Appeler",
      link: "tel:+21626419140"
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Envoyez-nous un Email",
      details: [
        "gsmnabeulrym@gmail.com"
      ],
      color: "from-purple-500 to-purple-600",
      action: "Envoyer un email",
      link: "mailto:gsmnabeulrym@gmail.com"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Horaires d'Ouverture",
      details: [
        "🟢 Ouvert tous les jours : 9h00 – 21h00"
      ],
      color: "from-orange-500 to-orange-600",
      action: null,
      link: null
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 via-purple-600 to-pink-600 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s', transform: 'translate(-50%, -50%)' }}></div>
        
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-gradient bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent bg-[length:200%_auto]">
            Contactez-<span className="text-yellow-300 drop-shadow-lg">Nous</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Contactez notre équipe pour toute question, support ou commentaire
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
              <Phone className="h-5 w-5 animate-pulse" />
              <span>Réponse Rapide</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
              <CheckCircle className="h-5 w-5" />
              <span>Support Expert</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
              <Clock className="h-5 w-5" />
              <span>Disponible 9h-21h</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Information */}
        <div className="max-w-5xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Contactez-Nous
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nous sommes là pour vous aider ! Visitez notre magasin ou contactez-nous pour toute question.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <div 
                key={index} 
                className={`group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`bg-gradient-to-br ${info.color} rounded-2xl p-6 text-white hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl relative overflow-hidden`}>
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-12">
                          {info.icon}
                        </div>
                        <h3 className="text-lg font-bold ml-3">
                          {info.title}
                        </h3>
                      </div>
                    </div>
                    {info.details.map((detail, idx) => {
                      const isPhone = detail.includes('+216');
                      const isEmail = detail.includes('@');
                      const isClickable = isPhone || isEmail;
                      
                      return (
                        <div key={idx} className="flex items-center justify-between mb-2 group/item">
                          {isClickable ? (
                            <div className="flex items-center space-x-2">
                              <a
                                href={isPhone ? `tel:${detail.replace(/\s/g, '')}` : `mailto:${detail}`}
                                className="text-white/95 font-medium hover:text-white hover:underline transition-all duration-300"
                              >
                                {detail}
                              </a>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  copyToClipboard(detail, isPhone ? 'Numéro de téléphone' : 'Email');
                                }}
                                className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 bg-white/20 hover:bg-white/30 rounded p-1 backdrop-blur-sm"
                                title="Copier"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <p className="text-white/95 font-medium">
                              {detail}
                            </p>
                          )}
                          {idx === 0 && info.action && (
                            <a
                              href={info.link}
                              target={info.link?.startsWith('http') ? '_blank' : undefined}
                              rel={info.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 hover:bg-white/30 rounded-lg p-2 backdrop-blur-sm"
                              title={info.action}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      );
                    })}
                    {info.action && (
                      <a
                        href={info.link}
                        target={info.link?.startsWith('http') ? '_blank' : undefined}
                        rel={info.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="mt-4 inline-flex items-center text-sm font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2 transition-all duration-300 hover:scale-105"
                      >
                        {info.action}
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Media */}
          <div className={`bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-200 mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Sparkles className="h-6 w-6 mr-3 text-primary-500 animate-pulse" />
              Suivez-Nous sur les Réseaux Sociaux
            </h3>
            <div className="space-y-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between space-x-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                    <Facebook className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-semibold">Facebook: Rym GSM Nabeul</span>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between space-x-4 p-4 bg-pink-50 rounded-xl hover:bg-pink-100 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-pink-100 rounded-lg group-hover:bg-pink-200 group-hover:scale-110 transition-all duration-300">
                    <Instagram className="h-6 w-6 text-pink-600" />
                  </div>
                  <span className="text-gray-700 font-semibold">Instagram: @rym.gsm.nabeul</span>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-pink-600 transition-colors" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <span className="text-gray-700 font-semibold">TikTok: @rym.gsm0</span>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className={`mt-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trouvez-<span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Nous</span>
            </h2>
            <p className="text-xl text-gray-600">Visitez notre magasin au cœur de Nabeul</p>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200 hover:shadow-3xl transition-all duration-500 group">
            <div className="h-96 bg-gradient-to-br from-primary-100 via-purple-100 to-pink-100 flex items-center justify-center relative overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
              
              <div className="text-center relative z-10 transform group-hover:scale-105 transition-transform duration-500">
                <div className="mb-6 inline-block">
                  <div className="p-6 bg-white/80 backdrop-blur-sm rounded-full shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:rotate-12">
                    <MapPin className="h-20 w-20 text-primary-500 mx-auto animate-bounce" style={{ animationDuration: '2s' }} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">RYM GSM Store</h3>
                <p className="text-gray-700 mb-6 text-lg font-medium">126, Avenue Habib Bourguiba, Nabeul 8000</p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <div className="flex items-center text-sm text-gray-700 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                    <Clock className="h-4 w-4 mr-2 text-primary-500" />
                    <span className="font-semibold">9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 animate-pulse" />
                    <span className="font-semibold">Ouvert Maintenant</span>
                  </div>
                </div>
                <a
                  href="https://maps.google.com/?q=126+Avenue+Habib+Bourguiba+Nabeul"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Ouvrir dans Google Maps
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>


        {/* CTA Section */}
        <div className={`mt-20 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-primary-500 via-purple-600 to-pink-600 rounded-2xl p-12 text-center text-white relative overflow-hidden group">
            {/* Animated background */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 transform group-hover:scale-105 transition-transform duration-500">
                Prêt à Commencer ?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Visitez notre magasin ou parcourez notre catalogue en ligne pour trouver l'appareil parfait pour vous
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+21626419140"
                  className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl inline-flex items-center justify-center group/btn"
                >
                  <Phone className="h-5 w-5 mr-2 group-hover/btn:animate-pulse" />
                  Appeler Maintenant
                </a>
                <a
                  href="/products"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl inline-flex items-center justify-center group/btn"
                >
                  Parcourir les Produits
                  <ArrowRight className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
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