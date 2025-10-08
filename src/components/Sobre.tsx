import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Award, Users, Target, Heart, Shield, Star } from 'lucide-react';

const Sobre: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const instrutores = [
    {
      nome: 'Mestre Leandro Lima',
      especialidade: 'Jiu-Jitsu, Muay Thai, MMA',
      experiencia: '35 anos',
      graduacao: '7º Dan',
      foto: '/uploads/image.png',
      conquistas: ['Campeão Mundial 1998', 'Técnico da Seleção Brasileira']
    },
    {
      nome: 'Professor Ana Santos',
      especialidade: 'Jiu-Jitsu Brasileiro',
      experiencia: '15 anos',
      graduacao: 'Faixa Preta 3º Grau',
      foto: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300&h=300',
      conquistas: ['Campeã Pan-Americana', 'Especialista em Defesa Pessoal']
    },
    {
      nome: 'Sensei Roberto Lima',
      especialidade: 'Muay Thai',
      experiencia: '20 anos',
      graduacao: 'Kru Certificado',
      foto: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=300&h=300',
      conquistas: ['Ex-lutador profissional', 'Técnico de MMA']
    }
  ];

  const valores = [
    {
      icon: Shield,
      titulo: 'Tradição',
      descricao: 'Respeitamos e preservamos as tradições milenares das artes marciais.'
    },
    {
      icon: Target,
      titulo: 'Disciplina',
      descricao: 'Desenvolvemos disciplina mental e física através do treinamento constante.'
    },
    {
      icon: Heart,
      titulo: 'Respeito',
      descricao: 'Cultivamos o respeito mútuo entre alunos, instrutores e adversários.'
    },
    {
      icon: Users,
      titulo: 'Comunidade',
      descricao: 'Criamos uma família unida pela paixão das artes marciais.'
    }
  ];

  return (
    <section id="sobre" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sobre a <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white">Academia</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Há mais de 15 anos formando guerreiros e transformando vidas através das artes marciais.
          </p>
        </div>

        {/* História */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className={`transition-all duration-1000 ${
            inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <h3 className="text-3xl font-bold text-white mb-6">Nossa História</h3>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              A Academia Dragão Vermelho nasceu do sonho de democratizar o acesso às artes marciais, 
              oferecendo ensino de qualidade em um ambiente acolhedor e familiar.
            </p>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Fundada pelo Mestre Carlos Silva, nossa academia cresceu e se tornou referência na região, 
              formando não apenas lutadores, mas cidadãos mais disciplinados, confiantes e respeitosos.
            </p>

            {/* Conquistas */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">500+</div>
                <div className="text-gray-400">Alunos Formados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">50+</div>
                <div className="text-gray-400">Campeões</div>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-300 ${
            inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/7045717/pexels-photo-7045717.jpeg?auto=compress&cs=tinysrgb&w=800&h=600"
                alt="Academia Dragão Vermelho"
                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-red-600 p-6 rounded-2xl shadow-lg">
                <div className="text-2xl font-bold text-white">15+</div>
                <div className="text-red-200 text-sm">Anos de Tradição</div>
              </div>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className={`mb-20 transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h3 className="text-3xl font-bold text-white text-center mb-12">Nossos Valores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((valor, index) => (
              <div key={index} className="text-center bg-black/30 rounded-2xl p-6 hover:bg-black/50 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <valor.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{valor.titulo}</h4>
                <p className="text-gray-300">{valor.descricao}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Instrutores */}
        <div className={`transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h3 className="text-3xl font-bold text-white text-center mb-12">Nossos Instrutores</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {instrutores.map((instrutor, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-6 text-center hover:bg-gray-700 transition-colors">
                <img
                  src={instrutor.foto}
                  alt={instrutor.nome}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-red-500"
                />
                <h4 className="text-xl font-bold text-white mb-2">{instrutor.nome}</h4>
                <p className="text-red-400 font-semibold mb-2">{instrutor.especialidade}</p>
                <div className="text-gray-300 text-sm mb-4">
                  <p>{instrutor.graduacao}</p>
                  <p>{instrutor.experiencia} de experiência</p>
                </div>
                <div className="space-y-1">
                  {instrutor.conquistas.map((conquista, idx) => (
                    <div key={idx} className="flex items-center justify-center space-x-2">
                      <Star className="w-4 h-4 text-red-400" />
                      <span className="text-gray-300 text-sm">{conquista}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sobre;