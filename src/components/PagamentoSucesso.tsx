import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, Download, Mail, Phone } from 'lucide-react';

// Definir interfaces mais específicas
interface UserData {
  name: string;
  email: string;
  mode: string;
  belt: string;
  ageGroup: string;
}

interface LocationState {
  paymentMethod?: 'cartao' | 'boleto' | 'pix';
  userData?: UserData;
}

// Tipo para os métodos de pagamento
type PaymentMethods = {
  [key in 'cartao' | 'boleto' | 'pix']: string;
};

const PagamentoSucesso: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const paymentMethodNames: PaymentMethods = {
    cartao: 'Cartão de Crédito/Débito',
    boleto: 'Boleto Bancário',
    pix: 'PIX'
  };

  const getPaymentInstructions = () => {
    const method = state?.paymentMethod;
    
    switch (method) {
      case 'boleto':
        return {
          title: 'Próximos passos',
          instructions: [
            'Você receberá o boleto por email em até 5 minutos',
            'O boleto tem vencimento em 3 dias úteis',
            'Após o pagamento, aguarde até 2 dias úteis para confirmação',
            'Você receberá confirmação por email quando o pagamento for processado'
          ]
        };
      case 'pix':
        return {
          title: 'Pagamento processado',
          instructions: [
            'Seu pagamento via PIX foi processado com sucesso',
            'Você receberá um email de confirmação em breve',
            'Sua matrícula está ativa e você pode iniciar os treinos',
            'Em caso de dúvidas, entre em contato conosco'
          ]
        };
      case 'cartao':
        return {
          title: 'Pagamento aprovado',
          instructions: [
            'Seu pagamento foi aprovado com sucesso',
            'Você receberá um email de confirmação em breve',
            'Sua matrícula está ativa e você pode iniciar os treinos',
            'O comprovante estará disponível em sua área do aluno'
          ]
        };
      default:
        return {
          title: 'Matrícula confirmada',
          instructions: [
            'Sua matrícula foi processada com sucesso',
            'Você receberá mais informações por email',
            'Em caso de dúvidas, entre em contato conosco'
          ]
        };
    }
  };

  const paymentInfo = getPaymentInstructions();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Matrícula <span className="text-[#d90429]">Concluída!</span>
            </h1>
            <p className="text-xl text-gray-300">
              Parabéns! Você agora faz parte da família Studio Top Team Fight!
            </p>
          </div>

          {/* User and Payment Info */}
          <div className="bg-gray-800 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Resumo da Matrícula</h2>
            
            {state?.userData && (
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#d90429] mb-3">Dados do Aluno</h3>
                  <div className="space-y-2 text-gray-300">
                    <p><span className="text-white">Nome:</span> {state.userData.name}</p>
                    <p><span className="text-white">Email:</span> {state.userData.email}</p>
                    <p><span className="text-white">Modalidade:</span> {state.userData.mode}</p>
                    <p><span className="text-white">Faixa:</span> {state.userData.belt}</p>
                    <p><span className="text-white">Categoria:</span> {state.userData.ageGroup}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#d90429] mb-3">Pagamento</h3>
                  <div className="space-y-2 text-gray-300">
                    <p>
                      <span className="text-white">Método:</span>{' '}
                      {state?.paymentMethod 
                        ? paymentMethodNames[state.paymentMethod] 
                        : 'Não informado'
                      }
                    </p>
                    <p>
                      <span className="text-white">Status:</span>{' '}
                      {state?.paymentMethod === 'boleto' ? 'Aguardando pagamento' : 'Aprovado'}
                    </p>
                    <p>
                      <span className="text-white">Data:</span>{' '}
                      {new Date().toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Instructions */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-[#d90429] mb-4">{paymentInfo.title}</h3>
              <ul className="space-y-3">
                {paymentInfo.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#d90429] rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="text-gray-300">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {state?.paymentMethod === 'boleto' && (
              <button 
                type="button"
                className="flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-200"
              >
                <Download className="w-5 h-5" />
                <span>Baixar Boleto</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center justify-center space-x-2 bg-[#d90429] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#b8032a] transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              <span>Voltar ao Início</span>
            </button>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Precisa de ajuda?</h3>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-6">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-5 h-5 text-[#d90429]" />
                <span>contato@studiotopteamfight.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-5 h-5 text-[#d90429]" />
                <span>(11) 3456-7890</span>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center mt-8 p-6 bg-gradient-to-r from-[#d90429]/10 to-transparent border border-[#d90429]/30 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-2">Bem-vindo à família!</h3>
            <p className="text-gray-300">
              Estamos ansiosos para vê-lo em nossos treinos. 
              Prepare-se para uma jornada incrível nas artes marciais!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagamentoSucesso;