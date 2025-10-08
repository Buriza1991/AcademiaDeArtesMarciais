import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Instagram, Facebook, Youtube } from 'lucide-react';

const Contato: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const horarios = [
    { dia: 'Segunda a Sexta', horario: '06:00 - 22:00' },
    { dia: 'Sábado', horario: '08:00 - 18:00' },
    { dia: 'Domingo', horario: '08:00 - 12:00' }
  ];

  return (
    <section id="contato" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Entre em <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white">Contato</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Estamos aqui para ajudar! Entre em contato conosco para tirar dúvidas, 
            agendar uma aula experimental ou fazer sua matrícula.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informações de Contato */}
          <div className={`transition-all duration-1000 delay-300 ${
            inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <h3 className="text-2xl font-bold text-white mb-8">Informações de Contato</h3>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-gray-900 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Endereço</h4>
                  <p className="text-gray-300">Rua das Artes Marciais, 123<br/>Centro, São Paulo - SP<br/>CEP: 01234-567</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-gray-900 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Telefones</h4>
                  <p className="text-gray-300">(11) 3456-7890<br/>(11) 99876-5432</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-gray-900 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">E-mail</h4>
                  <p className="text-gray-300">contato@studiotopteamfight.com.br<br/>matriculas@studiotopteamfight.com.br</p>
                </div>
              </div>
            </div>

            {/* Horários */}
            <div className="bg-gray-900 rounded-2xl p-6 mb-8 mt-8">
              <h4 className="font-semibold text-white mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-red-400" />
                <span>Horários de Funcionamento</span>
              </h4>
              <div className="space-y-3">
                {horarios.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-300">{item.dia}</span>
                    <span className="font-medium text-white">{item.horario}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Redes Sociais */}
            <div>
              <h4 className="font-semibold text-white mb-4">Siga-nos nas Redes Sociais</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <Instagram className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <Facebook className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <Youtube className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div className={`transition-all duration-1000 delay-500 ${
            inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-white transition-all duration-200"
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-white transition-all duration-200"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="telefone" className="block text-sm font-medium text-gray-300 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        id="telefone"
                        name="telefone"
                        required
                        value={formData.telefone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-white transition-all duration-200"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="assunto" className="block text-sm font-medium text-gray-300 mb-2">
                      Assunto *
                    </label>
                    <select
                      id="assunto"
                      name="assunto"
                      required
                      value={formData.assunto}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-white transition-all duration-200"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="matricula">Matrícula</option>
                      <option value="aula-experimental">Aula Experimental</option>
                      <option value="informacoes">Informações Gerais</option>
                      <option value="planos">Planos e Valores</option>
                      <option value="horarios">Horários</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mensagem" className="block text-sm font-medium text-gray-300 mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      required
                      rows={5}
                      value={formData.mensagem}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-white transition-all duration-200 resize-none"
                      placeholder="Digite sua mensagem..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Enviar Mensagem</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Mensagem Enviada!</h3>
                  <p className="text-gray-300">
                    Obrigado pelo contato! Responderemos em breve.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className={`mt-16 transition-all duration-1000 delay-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h3 className="text-3xl font-bold text-white text-center mb-8">Nossa Localização</h3>
          <div className="bg-gray-800 rounded-2xl p-4 h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Mapa Interativo</h4>
              <p className="text-gray-300">
                Rua das Artes Marciais, 123 - Centro<br/>
                São Paulo - SP, CEP: 01234-567
              </p>
              <button className="mt-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg hover:scale-105 transition-transform">
                Ver no Google Maps
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contato;