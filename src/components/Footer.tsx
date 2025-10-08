import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube, ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">ST</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">STUDIO TOP TEAM FIGHT</h3>
                <p className="text-gray-400">Artes Marciais</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed font-sonic">
              Transforme seu corpo e mente através das artes marciais. Nossa missão é desenvolver
              não apenas atletas, mas pessoas mais fortes, disciplinadas e confiantes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              <li><a href="#inicio" className="text-gray-300 hover:text-red-400 transition-colors">Início</a></li>
              <li><a href="#modalidades" className="text-gray-300 hover:text-red-400 transition-colors">Modalidades</a></li>
              <li><a href="#galeria" className="text-gray-300 hover:text-red-400 transition-colors">Galeria</a></li>
              <li><a href="#planos" className="text-gray-300 hover:text-red-400 transition-colors">Planos</a></li>
              <li><button onClick={() => navigate('/cadastro')} className="text-gray-300 hover:text-red-400 transition-colors">Cadastro</button></li>
              <li><a href="#sobre" className="text-gray-300 hover:text-red-400 transition-colors">Sobre</a></li>
              <li><a href="#contato" className="text-gray-300 hover:text-red-400 transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Informações de Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    Rua das Artes Marciais, 123<br />
                    Centro, São Paulo - SP<br />
                    CEP: 01234-567
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">(11) 3456-7890</p>
                  <p className="text-gray-300 text-sm">(11) 99876-5432</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">contato@studiotopteamfight.com.br</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Seg-Sex: 06:00-22:00</p>
                  <p className="text-gray-300 text-sm">Sáb: 08:00-18:00</p>
                  <p className="text-gray-300 text-sm">Dom: 08:00-12:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 STUDIO TOP TEAM FIGHT. Todos os direitos reservados.
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-red-400 text-sm transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 text-sm transition-colors">
                Termos de Uso
              </a>
              <button
                onClick={scrollToTop}
                className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                <ArrowUp className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;