import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Users, User, Calendar, Award, ArrowLeft, Search } from 'lucide-react';
import { AuthService } from '../services/api';

interface Student {
  id: string;
  userId: string;
  name: string;
  email: string;
  age: number | null;
  belt: string;
  modality: string;
  phone: string;
  photo?: string | null;
  createdAt: string;
}

const AlunosCadastrados: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await AuthService.getAllStudents();
      if (response.success && response.data) {
        setStudents(response.data as Student[]);
      } else {
        setError('Erro ao carregar alunos');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar alunos');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.belt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.modality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Função para obter a cor da faixa
  const getBeltColor = (belt: string) => {
    const beltColors: { [key: string]: string } = {
      'Branca': 'bg-white text-gray-800',
      'Azul': 'bg-blue-500 text-white',
      'Roxa': 'bg-purple-500 text-white',
      'Marrom': 'bg-amber-700 text-white',
      'Preta': 'bg-gray-800 text-white',
      'Amarela': 'bg-yellow-400 text-gray-800',
      'Laranja': 'bg-orange-500 text-white',
      'Verde': 'bg-green-500 text-white',
      'Vermelha': 'bg-red-500 text-white',
      // Faixas infantis
      'Branca-Preta': 'bg-gradient-to-r from-white to-gray-800 text-gray-800',
      'Branca-Azul': 'bg-gradient-to-r from-white to-blue-500 text-gray-800',
      'Branca-Verde': 'bg-gradient-to-r from-white to-green-500 text-gray-800',
      'Branca-Amarela': 'bg-gradient-to-r from-white to-yellow-400 text-gray-800',
      'Branca-Laranja': 'bg-gradient-to-r from-white to-orange-500 text-gray-800',
      'Branca-Vermelha': 'bg-gradient-to-r from-white to-red-500 text-gray-800',
      'Cinza-Branca': 'bg-gradient-to-r from-gray-400 to-white text-gray-800',
      'Cinza-Azul': 'bg-gradient-to-r from-gray-400 to-blue-500 text-white',
      'Cinza-Verde': 'bg-gradient-to-r from-gray-400 to-green-500 text-white',
      'Cinza-Amarela': 'bg-gradient-to-r from-gray-400 to-yellow-400 text-gray-800',
      'Cinza-Laranja': 'bg-gradient-to-r from-gray-400 to-orange-500 text-white',
      'Cinza-Vermelha': 'bg-gradient-to-r from-gray-400 to-red-500 text-white',
      'Amarela-Branca': 'bg-gradient-to-r from-yellow-400 to-white text-gray-800',
      'Amarela-Azul': 'bg-gradient-to-r from-yellow-400 to-blue-500 text-white',
      'Amarela-Verde': 'bg-gradient-to-r from-yellow-400 to-green-500 text-white',
      'Amarela-Laranja': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
      'Amarela-Vermelha': 'bg-gradient-to-r from-yellow-400 to-red-500 text-white',
      'Laranja-Branca': 'bg-gradient-to-r from-orange-500 to-white text-gray-800',
      'Laranja-Azul': 'bg-gradient-to-r from-orange-500 to-blue-500 text-white',
      'Laranja-Verde': 'bg-gradient-to-r from-orange-500 to-green-500 text-white',
      'Laranja-Preta': 'bg-gradient-to-r from-orange-500 to-gray-800 text-white',
      'Verde-Branca': 'bg-gradient-to-r from-green-500 to-white text-gray-800',
      'Verde-Azul': 'bg-gradient-to-r from-green-500 to-blue-500 text-white',
      'Verde-Preta': 'bg-gradient-to-r from-green-500 to-gray-800 text-white',
    };
    
    return beltColors[belt] || 'bg-gray-500 text-white';
  };

  // Componente para exibir faixa colorida
  const BeltDisplay: React.FC<{ belt: string }> = ({ belt }) => {
    const colorClass = getBeltColor(belt);
    
    return (
      <span className={`px-3 py-1 rounded-md text-xs font-semibold ${colorClass}`}>
        {belt}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-red-600">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-white hover:text-red-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          <h1 className="text-3xl font-bold text-white">Alunos Cadastrados</h1>
          <div className="w-20"></div> {/* Espaçador */}
        </div>

        {/* Estatísticas */}
        <div ref={ref} className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-white mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{students.length}</h3>
            <p className="text-white/80">Total de Alunos</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Award className="w-8 h-8 text-white mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">
              {students.filter(s => s.modality === 'jiujitsu').length}
            </h3>
            <p className="text-white/80">Jiu-jitsu</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Award className="w-8 h-8 text-white mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">
              {students.filter(s => s.modality === 'muaythai').length}
            </h3>
            <p className="text-white/80">Muay Thai</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Calendar className="w-8 h-8 text-white mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">
              {students.filter(s => new Date(s.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </h3>
            <p className="text-white/80">Novos (7 dias)</p>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome, email, faixa ou modalidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        {/* Lista de Alunos */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-white mt-4">Carregando alunos...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-200">{error}</p>
              <button
                onClick={loadStudents}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white/80">
                {searchTerm ? 'Nenhum aluno encontrado com essa busca.' : 'Nenhum aluno cadastrado ainda.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Foto</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">ID</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Nome</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Idade</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Modalidade</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Faixa</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Telefone</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={student.userId} className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                      index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'
                    }`}>
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
                          {student.photo ? (
                            <img
                              src={student.photo}
                              alt={`Foto de ${student.name}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-white/60" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white font-mono font-bold">
                        {student.id}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-semibold">{student.name}</div>
                          <div className="text-white/60 text-sm">{student.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white">
                        {student.age ? `${student.age} anos` : 'Não informado'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          student.modality === 'jiujitsu' 
                            ? 'bg-blue-500/20 text-blue-200' 
                            : student.modality === 'muaythai'
                            ? 'bg-red-500/20 text-red-200'
                            : 'bg-gray-500/20 text-gray-200'
                        }`}>
                          {student.modality}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <BeltDisplay belt={student.belt} />
                      </td>
                      <td className="px-6 py-4 text-white">
                        {student.phone}
                      </td>
                      <td className="px-6 py-4 text-white/80 text-sm">
                        {formatDate(student.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlunosCadastrados; 