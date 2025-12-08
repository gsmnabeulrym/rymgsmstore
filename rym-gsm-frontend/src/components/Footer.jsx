import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Clock, Heart } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <Logo size="lg" />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Votre partenaire de confiance pour les smartphones et accessoires premium à Nabeul, Tunisie. 
              Nous offrons les derniers appareils à des prix compétitifs avec un excellent service.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300 hover:text-primary-400 transition-colors duration-300">
                <Facebook className="h-5 w-5 text-primary-400" />
                <span className="text-sm">Facebook: Rym Gsm Nabeul</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 hover:text-primary-400 transition-colors duration-300">
                <Instagram className="h-5 w-5 text-primary-400" />
                <span className="text-sm">Instagram: @rym.gsm.nabeul</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 hover:text-primary-400 transition-colors duration-300">
                <span className="text-sm">🎵</span>
                <span className="text-sm">TikTok: @rym.gsm0</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 gradient-text">Liens Rapides</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Produits
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  À Propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-bold mb-6 gradient-text">Service Client</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Mes Commandes
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Infos Livraison
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Retours & Échanges
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="text-gray-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Garantie
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 gradient-text">📍 Coordonnées</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <MapPin className="h-5 w-5 text-primary-400 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-300 text-sm leading-relaxed">
                  126, Avenue Habib Bourguiba<br />
                  Nabeul 8000 – Tunisie
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 group">
                  <Phone className="h-5 w-5 text-primary-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-gray-300 text-sm">+216 26 419 140</span>
                </div>
                <div className="flex items-center space-x-3 ml-8 group">
                  <span className="text-gray-300 text-sm group-hover:text-primary-400 transition-colors duration-300">+216 20 144 333</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 group">
                <Mail className="h-5 w-5 text-primary-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-300 text-sm group-hover:text-primary-400 transition-colors duration-300">gsmnabeulrym@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <Clock className="h-5 w-5 text-primary-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-300 text-sm group-hover:text-primary-400 transition-colors duration-300">🟢 Ouvert tous les jours : 9h00 – 21h00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>2024 Rym GSM. Fait avec</span>
              <Heart className="h-4 w-4 text-primary-400 animate-pulse" />
              <span>à Nabeul, Tunisie. Tous droits réservés.</span>
            </div>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-400 text-sm transition-all duration-300 hover:translate-y-0.5">
                Politique de Confidentialité
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-400 text-sm transition-all duration-300 hover:translate-y-0.5">
                Conditions d'Utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
