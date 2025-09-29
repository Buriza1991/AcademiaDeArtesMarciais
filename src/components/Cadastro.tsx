import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService, ProfileService } from '../services/api';

const Cadastro: React.FC = () => {
  const navigate = useNavigate();

  // Dados básicos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Responsável (para menores)
  const [responsibleName, setResponsibleName] = useState('');
  const [responsiblePhone, setResponsiblePhone] = useState('');

  // Modalidade e faixa
  const [mode, setMode] = useState<'jiujitsu' | 'muaythai'>('jiujitsu');
  const [ageGroup, setAgeGroup] = useState<'infantil' | 'adulto'>('infantil');
  const [belt, setBelt] = useState('');

  // Saúde e histórico
  const [lesion, setLesion] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [priorExperience, setPriorExperience] = useState('');

  // Consentimentos
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [imageConsent, setImageConsent] = useState(false);

  // Controle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Removido o redirecionamento automático para permitir acesso à página de cadastro

  // Listas de faixas
  const beltsJiuInfantil = [
    'Branca', 'Cinza-Branca', 'Cinza', 'Cinza-Preta',
    'Amarela-Branca', 'Amarela', 'Amarela-Preta',
    'Laranja-Branca', 'Laranja', 'Laranja-Preta',
    'Verde-Branca', 'Verde', 'Verde-Preta'
  ];
  const beltsJiuAdulto = ['Branca', 'Azul', 'Roxa', 'Marrom', 'Preta'];
  const beltsMuayThai = ['Branca', 'Amarela', 'Laranja', 'Azul', 'Roxa', 'Vermelha', 'Preta'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      setError('Você deve aceitar os termos e regulamento.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Primeiro, registrar o usuário com dados básicos
      const userPayload = {
        name,
        email,
        password,
      };

      const userResponse = await AuthService.register(userPayload);
      
      if (userResponse.success && userResponse.data) {
        // Se o registro foi bem-sucedido, salvar dados adicionais do perfil
        try {
          const profilePayload = {
            userId: (userResponse.data as any).user.id,
            phone,
            birthDate,
            address,
            emergencyContact: responsibleName,
            emergencyPhone: responsiblePhone,
            healthIssues: `${lesion ? `Lesões: ${lesion}. ` : ''}${medicalConditions ? `Condições médicas: ${medicalConditions}. ` : ''}${priorExperience ? `Experiência anterior: ${priorExperience}` : ''}`,
            experience: `Modalidade: ${mode}, Faixa: ${belt}, Grupo: ${ageGroup}`,
            objectives: `Termos aceitos: ${termsAccepted}, Uso de imagem: ${imageConsent}`,
          };

          // Salvar o perfil no backend
          await ProfileService.createProfile(profilePayload);
          
          // Redirecionar para a página de pagamento com os dados do usuário
          navigate('/pagamento', {
            state: {
              userData: {
                name,
                email,
                mode,
                belt,
                ageGroup
              }
            }
          });
        } catch (profileError: any) {
          console.error('Erro ao salvar perfil:', profileError);
          // Mesmo com erro no perfil, o usuário foi criado, então ainda redireciona para pagamento
          navigate('/pagamento', {
            state: {
              userData: {
                name,
                email,
                mode,
                belt,
                ageGroup
              }
            }
          });
        }
      } else {
        setError(userResponse.message || 'Erro ao cadastrar');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  // Idade automática
  const age = birthDate ? Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0;

  useEffect(() => {
    if (age && age < 16) setAgeGroup('infantil');
    else setAgeGroup('adulto');
  }, [age]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-yellow-400">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 text-gray-500 hover:text-red-600 transition-colors"
        >
          ← Voltar
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Cadastro - Academia de Artes Marciais</h2>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Dados pessoais */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
              <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input value={cpf} onChange={e => setCpf(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
            </div>
          </div>

          {/* Contato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço completo</label>
            <input value={address} onChange={e => setAddress(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          </div>

          {/* Responsável se menor */}
          {age > 0 && age < 18 && (
            <>
              <h3 className="font-semibold text-gray-800 mt-4">Responsável Legal</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do responsável</label>
                <input value={responsibleName} onChange={e => setResponsibleName(e.target.value)} className="w-full px-3 py-2 border rounded-md" required={age<18} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone do responsável</label>
                <input value={responsiblePhone} onChange={e => setResponsiblePhone(e.target.value)} className="w-full px-3 py-2 border rounded-md" required={age<18} />
              </div>
            </>
          )}

          {/* Modalidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modalidade</label>
            <select value={mode} onChange={e => setMode(e.target.value as any)} className="w-full px-3 py-2 border rounded-md">
              <option value="jiujitsu">Jiu-jitsu</option>
              <option value="muaythai">Muay Thai</option>
            </select>
          </div>

          {/* Faixas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Faixa atual</label>
            <select value={belt} onChange={e => setBelt(e.target.value)} className="w-full px-3 py-2 border rounded-md" required>
              {mode === 'jiujitsu' && ageGroup === 'infantil' && beltsJiuInfantil.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
              {mode === 'jiujitsu' && ageGroup === 'adulto' && beltsJiuAdulto.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
              {mode === 'muaythai' && beltsMuayThai.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Saúde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Possui ou já teve alguma lesão/fratura? (descreva)</label>
            <textarea value={lesion} onChange={e => setLesion(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Ex.: Ombro direito fraturado em 2022" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condições médicas especiais</label>
            <textarea value={medicalConditions} onChange={e => setMedicalConditions(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Ex.: Asma, diabetes..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Já praticou artes marciais antes?</label>
            <textarea value={priorExperience} onChange={e => setPriorExperience(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Modalidade, tempo, faixa..." />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          </div>

          {/* Consentimentos */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
            <span className="text-sm">Li e aceito os termos e regulamento da academia.</span>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={imageConsent} onChange={e => setImageConsent(e.target.checked)} />
            <span className="text-sm">Autorizo o uso de imagem para divulgação.</span>
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-md font-medium hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          Já tem conta?{' '}
          <a href="/login" className="text-red-600 hover:underline font-medium">Entrar</a>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
