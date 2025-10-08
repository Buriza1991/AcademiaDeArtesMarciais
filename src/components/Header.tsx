import React, { useState, useRef } from 'react';
import { Menu, X, Phone, MapPin, User, LogOut, Edit } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/api';
import UserProfileModal from './UserProfileModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);

  // Só mostra o header na página inicial
  const isHomePage = location.pathname === '/';

  // Fecha dropdown ao clicar fora
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdown(false);
      }
    }
    if (profileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdown]);

  const menuItems = [
    { name: 'Início', href: '#inicio' },
    { name: 'Modalidades', href: '#modalidades' },
    { name: 'Galeria', href: '#galeria' },
    { name: 'Planos', href: '#planos' },
    { name: 'Forma de Pagamento', href: '#forma-pagamento' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Contato', href: '#contato' }
  ];

  // Se não estiver na página inicial, não renderiza o header
  if (!isHomePage) {
    return null;
  }

  return (
    <>
      {/* Header sempre fixo no topo */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-black shadow-lg"
      >
        {/* Top Bar */}
        <div className="bg-black text-white py-2 border-b-2 border-[#d90429]">
          <div className="container mx-auto px-6 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>(11) 3456-7890</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Rua 31 de Julho - Centro</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span>Horário: Seg-Sab 06:00-22:00</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#d90429] border-2 border-white rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">ST</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white" >
                  STUDIO TOP TEAM FIGHT
                </h1>
                <p className="text-sm text-gray-300">Artes Marciais</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-[#d90429] transition-colors duration-200 font-medium"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* CTA e Login/Profile */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => navigate('/alunos')}
                className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                Alunos
              </button>
              <button
                onClick={() => navigate('/cadastro')}
                className="bg-[#d90429] border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-black hover:text-[#d90429] hover:border-[#d90429] transition-all duration-200"
              >
                Matricule-se
              </button>
              {!isAuthenticated ? (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-[#d90429] border-2 border-white text-white px-5 py-2 rounded-lg font-semibold hover:bg-black hover:text-[#d90429] hover:border-[#d90429] transition-all duration-200"
                >
                  Fazer login
                </button>
              ) : (
                <div
                  className="relative"
                  ref={profileRef}
                  tabIndex={0}
                >
                  <button
                    className="flex items-center space-x-2 bg-[#d90429] border-2 border-white text-white px-5 py-2 rounded-lg font-semibold hover:bg-black hover:text-[#d90429] hover:border-[#d90429] transition-all duration-200"
                    onClick={() => setProfileDropdown((prev) => !prev)}
                  >
                    <User className="w-5 h-5" />
                    <span>Meu Perfil</span>
                  </button>
                  {profileDropdown && (
                    <div className="absolute right-0 mt-0 w-64 bg-black border-2 border-[#d90429] rounded-lg shadow-lg z-50 p-4 text-white">
                      <div className="mb-2">
                        <div className="font-bold text-lg">{user?.name}</div>
                        <div className="text-sm text-gray-300">{user?.email}</div>
                      </div>
                      <hr className="border-[#d90429] my-2" />
                      <button
                        onClick={() => { setShowProfileModal(true); setProfileDropdown(false); }}
                        className="flex items-center w-full space-x-2 px-3 py-2 rounded hover:bg-[#d90429] hover:text-white transition-all duration-200 mb-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Editar Perfil</span>
                      </button>
                      <button
                        onClick={() => { logout(); setProfileDropdown(false); }}
                        className="flex items-center w-full space-x-2 px-3 py-2 rounded hover:bg-[#d90429] hover:text-white transition-all duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sair</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black border-t-2 border-[#d90429]">
            <nav className="container mx-auto px-6 py-4">
              <div className="flex flex-col space-y-4">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-white hover:text-[#d90429] transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <button
                  onClick={() => { setIsMenuOpen(false); navigate('/alunos'); }}
                  className="text-white hover:text-[#d90429] transition-colors duration-200 font-medium py-2 text-left"
                >
                  Alunos Cadastrados
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); navigate('/cadastro'); }}
                  className="bg-[#d90429] border-2 border-white text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-black hover:text-[#d90429] hover:border-[#d90429] transition-all duration-200"
                >
                  Matricule-se
                </button>
                {!isAuthenticated ? (
                  <button
                    onClick={() => { setIsMenuOpen(false); navigate('/login'); }}
                    className="bg-[#d90429] border-2 border-white text-white px-5 py-2 rounded-lg font-semibold hover:bg-black hover:text-[#d90429] hover:border-[#d90429] transition-all duration-200"
                  >
                    Fazer login
                  </button>
                ) : (
                  <button
                    onClick={() => { setIsMenuOpen(false); setShowProfileModal(true); }}
                    className="flex items-center space-x-2 bg-[#d90429] border-2 border-white text-white px-5 py-2 rounded-lg font-semibold hover:bg-black hover:text-[#d90429] hover:border-[#d90429] transition-all duration-200"
                  >
                    <User className="w-5 h-5" />
                    <span>Meu Perfil</span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}

        {/* Modal de edição de perfil */}
        {showProfileModal && (
          <UserProfileModal onClose={() => setShowProfileModal(false)} />
        )}
      </header>
    </>
  );
};

export default Header;