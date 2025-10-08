import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, FileText, Smartphone, Check, ChevronDown, ChevronUp, ArrowLeft, User } from 'lucide-react';

interface LocationState {
  userData?: {
    name: string;
    email: string;
    mode: string;
    belt: string;
    ageGroup: string;
  };
}

const PagamentoPagina: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [selectedPayment, setSelectedPayment] = useState<'cartao' | 'boleto' | 'pix' | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Verificar se há dados do usuário, senão redirecionar para cadastro
  useEffect(() => {
    if (!state?.userData) {
      navigate('/cadastro');
    }
  }, [state, navigate]);

  const paymentMethods = [
    {
      id: 'cartao',
      name: 'Cartão de Crédito/Débito',
      icon: CreditCard,
      description: 'Pagamento seguro com cartão',
      features: ['Pagamento imediato', 'Parcelamento até 12x', 'Máxima segurança', 'Sem juros no débito'],
      color: 'bg-blue-500',
      benefits: 'Ideal para quem quer começar imediatamente os treinos',
      processingTime: 'Aprovação imediata'
    },
    {
      id: 'boleto',
      name: 'Boleto Bancário',
      icon: FileText,
      description: 'Pagamento via boleto bancário',
      features: ['Vencimento em 3 dias', 'Sem taxas adicionais', 'Pagamento em qualquer banco', 'Comprovante oficial'],
      color: 'bg-red-600',
      benefits: 'Perfeito para quem prefere pagar no banco ou lotérica',
      processingTime: 'Até 2 dias úteis após pagamento'
    },
    {
      id: 'pix',
      name: 'PIX',
      icon: Smartphone,
      description: 'Pagamento instantâneo via PIX',
      features: ['Pagamento instantâneo', '24h por dia', 'QR Code ou chave PIX', 'Sem taxas'],
      color: 'bg-green-500',
      benefits: 'A forma mais rápida e prática de pagar',
      processingTime: 'Aprovação imediata'
    }
  ];

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const handlePaymentConfirmation = async () => {
    if (!selectedPayment) {
      alert('Por favor, selecione uma forma de pagamento.');
      return;
    }

    setLoading(true);

    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Aqui você implementaria a lógica real de pagamento
      // Por exemplo, integração com gateway de pagamento
      
      // Por ora, vamos simular sucesso e redirecionar
      navigate('/pagamento-sucesso', { 
        state: { 
          paymentMethod: selectedPayment,
          userData: state?.userData 
        } 
      });
    } catch (error) {
      console.error('Erro no processamento do pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!state?.userData) {
    return null; // Componente será desmontado pelo useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/cadastro')}
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar ao cadastro</span>
          </button>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Forma de <span className="text-[#d90429]">Pagamento</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Parabéns por completar sua matrícula! Agora escolha como deseja pagar.
          </p>

          {/* User Info */}
          <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-[#d90429] rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold">{state.userData.name}</h3>
                <p className="text-gray-400 text-sm">{state.userData.email}</p>
              </div>
            </div>
            <div className="text-sm text-gray-300 space-y-1">
              <p><span className="text-[#d90429]">Modalidade:</span> {state.userData.mode}</p>
              <p><span className="text-[#d90429]">Faixa:</span> {state.userData.belt}</p>
              <p><span className="text-[#d90429]">Categoria:</span> {state.userData.ageGroup}</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
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

                  <div className="mb-4">
                    <span className="text-sm text-[#d90429] font-medium">
                      {method.processingTime}
                    </span>
                  </div>

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

        {/* Payment Confirmation */}
        <div className="text-center">
          <button
            onClick={handlePaymentConfirmation}
            disabled={!selectedPayment || loading}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
              !selectedPayment || loading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-[#d90429] text-white hover:bg-[#b8032a] shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? 'Processando...' : selectedPayment ? `Pagar com ${paymentMethods.find(m => m.id === selectedPayment)?.name}` : 'Selecione uma forma de pagamento'}
          </button>
        </div>

        {/* Security Info */}
        <div className="mt-12 text-center">
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
    </div>
  );
};

export default PagamentoPagina;