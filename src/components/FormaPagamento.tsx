import React, { useState } from 'react';
import { CreditCard, FileText, Smartphone, Check, ChevronDown, ChevronUp } from 'lucide-react';

const FormaPagamento: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<'cartao' | 'boleto' | 'pix' | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: 'cartao',
      name: 'Cartão de Crédito/Débito',
      icon: CreditCard,
      description: 'Pagamento seguro com cartão',
      features: ['Pagamento imediato', 'Parcelamento disponível', 'Máxima segurança', '12x sem juros'],
      color: 'bg-blue-500',
      benefits: 'Ideal para quem quer começar imediatamente os treinos'
    },
    {
      id: 'boleto',
      name: 'Boleto Bancário',
      icon: FileText,
      description: 'Pagamento via boleto bancário',
      features: ['Vencimento em 3 dias', 'Sem taxas adicionais', 'Pagamento em qualquer banco', 'Comprovante oficial'],
      color: 'bg-red-600',
      benefits: 'Perfeito para quem prefere pagar no banco ou lotérica'
    },
    {
      id: 'pix',
      name: 'PIX',
      icon: Smartphone,
      description: 'Pagamento instantâneo via PIX',
      features: ['Pagamento instantâneo', '24h por dia', 'QR Code ou chave PIX', 'Sem taxas'],
      color: 'bg-green-500',
      benefits: 'A forma mais rápida e prática de pagar'
    }
  ];

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <section id="forma-pagamento" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Formas de <span className="text-[#d90429]">Pagamento</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Escolha a forma de pagamento que mais se adequa ao seu perfil. 
            Oferecemos diversas opções para facilitar sua matrícula.
          </p>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedPayment === method.id;
            const isExpanded = expandedCard === method.id;

            return (
              <div
                key={method.id}
                className={`relative bg-gray-800 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                  isSelected 
                    ? 'border-[#d90429] shadow-2xl shadow-[#d90429]/20' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => {
                  setSelectedPayment(method.id as 'cartao' | 'boleto' | 'pix');
                  toggleCard(method.id);
                }}
              >
                {/* Card Header */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    {isSelected && (
                      <div className="w-8 h-8 bg-[#d90429] rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{method.name}</h3>
                  <p className="text-gray-400 mb-4">{method.description}</p>

                  {/* Features Preview */}
                  <div className="space-y-2">
                    {method.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-[#d90429]" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expand Button */}
                  <div className="flex items-center justify-between mt-6">
                    <span className="text-sm text-[#d90429] font-medium">
                      {isExpanded ? 'Ver menos' : 'Ver detalhes'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[#d90429]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#d90429]" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                <div className={`overflow-hidden transition-all duration-500 ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-8 pb-8 border-t border-gray-700">
                    <div className="pt-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Todas as vantagens:</h4>
                      <div className="space-y-3">
                        {method.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <Check className="w-5 h-5 text-[#d90429] flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                        <p className="text-sm text-gray-300">
                          <strong className="text-[#d90429]">Recomendado para:</strong> {method.benefits}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Payment Info */}
        {selectedPayment && (
          <div className="bg-gradient-to-r from-[#d90429]/10 to-transparent border border-[#d90429]/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ótima escolha! Você selecionou: 
              <span className="text-[#d90429] ml-2">
                {paymentMethods.find(m => m.id === selectedPayment)?.name}
              </span>
            </h3>
            <p className="text-gray-300 mb-6">
              Para finalizar sua matrícula com esta forma de pagamento, clique no botão abaixo.
            </p>
            <button className="bg-[#d90429] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#b8032a] transition-all duration-200 shadow-lg hover:shadow-xl">
              Prosseguir com Matrícula
            </button>
          </div>
        )}

        {/* Security Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-800 px-6 py-3 rounded-full">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-300">
              <strong className="text-white">100% Seguro</strong> - Seus dados estão protegidos
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormaPagamento;