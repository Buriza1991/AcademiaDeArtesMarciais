import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, RotateCcw, Check } from 'lucide-react';
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

  // Foto do aluno
  const [photo, setPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Controle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para validação de campos
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  // Removido o redirecionamento automático para permitir acesso à página de cadastro

  // Função para validar campos
  const validateField = (name: string, value: string) => {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/;
    
    switch (name) {
      case 'name':
        return value.trim().length < 2 ? 'Nome deve ter pelo menos 2 caracteres' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Email inválido' : '';
      case 'password':
        return value.length < 6 ? 'Senha deve ter pelo menos 6 caracteres' : '';
      case 'birthDate':
        return !value ? 'Data de nascimento é obrigatória' : '';
      case 'cpf':
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
        return !cpfRegex.test(value.replace(/\D/g, '')) ? 'CPF inválido' : '';
      case 'phone':
        return !phoneRegex.test(value.replace(/\D/g, '')) ? 'Telefone inválido' : '';
      case 'address':
        return value.trim().length < 10 ? 'Endereço deve ser mais detalhado' : '';
      case 'responsibleName':
        return ageGroup === 'infantil' && value.trim().length < 2 ? 'Nome do responsável é obrigatório para menores' : '';
      case 'responsiblePhone':
        return ageGroup === 'infantil' && !phoneRegex.test(value.replace(/\D/g, '')) ? 'Telefone do responsável é obrigatório para menores' : '';
      default:
        return '';
    }
  };

  // Função para validar todos os campos
  const validateAllFields = () => {
    const newErrors: {[key: string]: string} = {};
    
    newErrors.name = validateField('name', name);
    newErrors.email = validateField('email', email);
    newErrors.password = validateField('password', password);
    newErrors.birthDate = validateField('birthDate', birthDate);
    newErrors.cpf = validateField('cpf', cpf);
    newErrors.phone = validateField('phone', phone);
    newErrors.address = validateField('address', address);
    
    if (ageGroup === 'infantil') {
      newErrors.responsibleName = validateField('responsibleName', responsibleName);
      newErrors.responsiblePhone = validateField('responsiblePhone', responsiblePhone);
    }

    // Verificar consentimentos
    if (!termsAccepted) {
      newErrors.terms = 'Você deve aceitar os termos e regulamento';
    }

    // Remove campos vazios
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler para quando o usuário sai do campo
  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const fieldValue = getFieldValue(fieldName);
    const error = validateField(fieldName, fieldValue);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  // Função para obter o valor do campo
  const getFieldValue = (fieldName: string) => {
    switch (fieldName) {
      case 'name': return name;
      case 'email': return email;
      case 'password': return password;
      case 'birthDate': return birthDate;
      case 'cpf': return cpf;
      case 'phone': return phone;
      case 'address': return address;
      case 'responsibleName': return responsibleName;
      case 'responsiblePhone': return responsiblePhone;
      default: return '';
    }
  };

  // Listas de faixas
  const beltsJiuInfantil = [
    'Branca', 'Cinza-Branca', 'Cinza', 'Cinza-Preta',
    'Amarela-Branca', 'Amarela', 'Amarela-Preta',
    'Laranja-Branca', 'Laranja', 'Laranja-Preta',
    'Verde-Branca', 'Verde', 'Verde-Preta'
  ];
  const beltsJiuAdulto = ['Branca', 'Azul', 'Roxa', 'Marrom', 'Preta'];
  const beltsMuayThai = ['Branca', 'Amarela', 'Laranja', 'Azul', 'Roxa', 'Vermelha', 'Preta'];

  // Funções da câmera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPhoto(photoDataUrl);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  const removePhoto = () => {
    setPhoto(null);
  };

  // Cleanup ao desmontar o componente
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos os campos
    if (!validateAllFields()) {
      setError('Por favor, corrija os erros no formulário.');
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
            photo: photo || null, // Incluir a foto no perfil
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-red-600">
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
            <input 
              value={name} 
              onChange={e => setName(e.target.value)}
              onBlur={() => handleBlur('name')}
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 ${errors.name ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
              required 
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
              <input 
                type="date" 
                value={birthDate} 
                onChange={e => setBirthDate(e.target.value)}
                onBlur={() => handleBlur('birthDate')}
                className={`w-full px-3 py-2 border rounded-md ${errors.birthDate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 ${errors.birthDate ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                required 
              />
              {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input 
                value={cpf} 
                onChange={e => setCpf(e.target.value)}
                onBlur={() => handleBlur('cpf')}
                placeholder="000.000.000-00"
                className={`w-full px-3 py-2 border rounded-md ${errors.cpf ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 ${errors.cpf ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                required 
              />
              {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
            </div>
          </div>

          {/* Contato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input 
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder="(11) 99999-9999"
              className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 ${errors.phone ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
              required 
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="seu@email.com"
              className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 ${errors.email ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
              required 
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Mínimo 6 caracteres"
              className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 ${errors.password ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
              required 
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço completo</label>
            <input 
              value={address} 
              onChange={e => setAddress(e.target.value)}
              onBlur={() => handleBlur('address')}
              placeholder="Rua, número, bairro, cidade, CEP"
              className={`w-full px-3 py-2 border rounded-md ${errors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 ${errors.address ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
              required 
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Foto do aluno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Foto do Aluno (opcional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {!photo && !showCamera && (
                <div>
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">Tire uma selfie para o cadastro</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Abrir Câmera</span>
                  </button>
                </div>
              )}

              {showCamera && (
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full max-w-sm mx-auto rounded-lg"
                  />
                  <div className="flex justify-center space-x-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Capturar</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancelar</span>
                    </button>
                  </div>
                </div>
              )}

              {photo && (
                <div className="space-y-4">
                  <img
                    src={photo}
                    alt="Foto do aluno"
                    className="w-48 h-48 object-cover rounded-lg mx-auto border-4 border-green-500"
                  />
                  <div className="flex justify-center space-x-3">
                    <button
                      type="button"
                      onClick={retakePhoto}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Tirar Novamente</span>
                    </button>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Canvas oculto para captura */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Responsável se menor */}
          {age > 0 && age < 18 && (
            <>
              <h3 className="font-semibold text-gray-800 mt-4">Responsável Legal</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do responsável</label>
                <input 
                  value={responsibleName} 
                  onChange={e => setResponsibleName(e.target.value)}
                  onBlur={() => handleBlur('responsibleName')}
                  className={`w-full px-3 py-2 border rounded-md ${errors.responsibleName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 ${errors.responsibleName ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                  required={age<18} 
                />
                {errors.responsibleName && <p className="text-red-500 text-sm mt-1">{errors.responsibleName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone do responsável</label>
                <input 
                  value={responsiblePhone} 
                  onChange={e => setResponsiblePhone(e.target.value)}
                  onBlur={() => handleBlur('responsiblePhone')}
                  placeholder="(11) 99999-9999"
                  className={`w-full px-3 py-2 border rounded-md ${errors.responsiblePhone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-1 ${errors.responsiblePhone ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                  required={age<18} 
                />
                {errors.responsiblePhone && <p className="text-red-500 text-sm mt-1">{errors.responsiblePhone}</p>}
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

          {/* Consentimentos */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <input 
                type="checkbox" 
                checked={termsAccepted} 
                onChange={e => setTermsAccepted(e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm">Li e aceito os termos e regulamento da academia.</span>
            </div>
            {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
            
            <div className="flex items-start space-x-2">
              <input 
                type="checkbox" 
                checked={imageConsent} 
                onChange={e => setImageConsent(e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm">Autorizo o uso de imagem para divulgação.</span>
            </div>
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
