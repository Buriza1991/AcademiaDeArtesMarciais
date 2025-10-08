import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Check, Star, CreditCard, Smartphone, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Planos: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const navigate = useNavigate();

  const planos = [
    {
      name: 'Básico',
      price: 'R$ 100,00',
      period: '/mês',
      description: 'Perfeito para iniciantes',
      features: [
        '3x por semana',
        ' 1h de aulas particulares 2x por semana',
        '2 modalidades',
        'Acompanhamento básico',
        'Certificado de participação'
      ],
      popular: false,
      color: 'from-gray-600 to-gray-700'
    },
    {
      name: 'Premium',
      price: 'R$ 149',
      period: '/mês',
      description: 'Mais popular entre nossos alunos',
      features: [
        'Acesso ilimitado',
        '3 modalidades',
        'Aulas personalizadas',
        'Acompanhamento Semanal',
        'Acesso a eventos',
        'Kit de uniforme',
        'Desconto em produtos'
      ],
      popular: true,
      color: 'from-red-600 to-red-700'
    },
    {
      name: 'Elite',
      price: 'R$ 249',
      period: '/mês',
      description: 'Para atletas dedicados',
      features: [
        'Acesso total VIP',
        'Todas as modalidades',
        'Treino personalizado',
        'Preparação para competições',
        'Acompanhamento médico',
        'Suplementação inclusa',
        'Acesso prioritário',
        'Mentoria individual'
      ],
      popular: false,
      color: 'from-red-500 to-gray-800'
    }
  ];

  const paymentMethods = [
    { icon: CreditCard, name: 'Cartão de Crédito', description: 'Até 12x sem juros' },
    { icon: Smartphone, name: 'PIX', description: '5% de desconto' },
    { icon: Building, name: 'Débito Automático', description: '10% de desconto' }
  ];

  return (
    <section id="planos" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Planos e <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white">Valores</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Escolha o plano ideal para sua jornada nas artes marciais. Todos os planos incluem aula experimental gratuita.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {planos.map((plano, index) => (
            <div
              key={index}
              className={`relative bg-gray-800 rounded-2xl p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                plano.popular ? 'ring-2 ring-red-500 scale-105' : ''
              } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {plano.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Mais Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plano.name}</h3>
                <p className="text-gray-400 mb-4">{plano.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-white">{plano.price}</span>
                  <span className="text-gray-400 ml-1">{plano.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plano.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full bg-gradient-to-r ${plano.color} text-white py-4 rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg`}
                onClick={() => navigate(`/cadastro?plano=${encodeURIComponent(plano.name)}`)}
              >
                Escolher Plano
              </button>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className={`transition-all duration-1000 delay-500 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h3 className="text-2xl font-bold text-white text-center mb-8">Formas de Pagamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-700 transition-colors">
                <method.icon className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">{method.name}</h4>
                <p className="text-gray-400 text-sm">{method.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Special Offers */}
        <div className={`mt-16 bg-gradient-to-r from-red-600/20 to-gray-900/20 rounded-2xl p-8 border border-red-500/30 transition-all duration-1000 delay-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Promoções Especiais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-red-400 mb-2">Primeira Mensalidade</h4>
                <p className="text-gray-300">50% de desconto para novos alunos</p>
              </div>
              <div className="bg-black/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-red-400 mb-2">Traga um Amigo</h4>
                <p className="text-gray-300">Ganhe 1 mês grátis por indicação</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Planos;