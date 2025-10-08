import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Play, Clock, Users, Target } from 'lucide-react';

const Modalidades: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const modalidades = [
    {
      name: 'Jiu-Jitsu Infantil',
      description: 'Arte suave que desenvolve disciplina, respeito e autoconfiança nas crianças através de técnicas adaptadas para a idade.',
      image: 'http://localhost:3001/uploads/file-1759259637385-456954244.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      benefits: ['Disciplina', 'Respeito', 'Coordenação motora', 'Autoconfiança', 'Trabalho em equipe', 'Autodefesa'],
      ages: '6 a 12 anos',
      duration: '60 min',
      instructor: 'Prof. Ana Santos',
      schedule: ['Seg/Qua/Sex 16:00', 'Ter/Qui 17:00'],
      level: 'Iniciante a Avançado',
      price: 'R$ 120/mês',
      equipment: ['Kimono (fornecido)', 'Faixa'],
      category: 'infantil',
      color: 'blue'
    },
    {
      name: 'Jiu-Jitsu Adulto',
      description: 'Arte marcial completa que combina técnicas de solo, autodefesa e condicionamento físico para adultos.',
      image: 'http://localhost:3001/uploads/file-1759259637385-456954244.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      benefits: ['Técnica refinada', 'Estratégia', 'Flexibilidade', 'Autodefesa', 'Condicionamento', 'Controle emocional'],
      ages: '16+ anos',
      duration: '90 min',
      instructor: 'Mestre Leandro Lima',
      schedule: ['Seg/Qua/Sex 19:00', 'Ter/Qui 20:00', 'Sáb 09:00'],
      level: 'Todos os níveis',
      price: 'R$ 180/mês',
      equipment: ['Kimono', 'Faixa', 'Protetor bucal'],
      category: 'adulto',
      color: 'blue'
    },
    {
      name: 'Muay Thai',
      description: 'A arte das oito armas que desenvolve força, resistência e técnicas de striking com punhos, cotovelos, joelhos e canelas.',
      image: 'https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      benefits: ['Condicionamento intenso', 'Força explosiva', 'Resistência cardiovascular', 'Flexibilidade', 'Autodefesa', 'Disciplina mental'],
      ages: '14+ anos',
      duration: '75 min',
      instructor: 'Sensei Roberto Lima',
      schedule: ['Seg/Qua/Sex 18:00', 'Ter/Qui 19:00', 'Sáb 10:00'],
      level: 'Iniciante a Profissional',
      price: 'R$ 160/mês',
      equipment: ['Luvas', 'Caneleiras', 'Protetor bucal', 'Shorts'],
      category: 'striking',
      color: 'red'
    },

    {
      name: 'MMA (Artes Marciais Mistas)',
      description: 'Combinação das melhores técnicas de várias modalidades para formação completa de lutadores versáteis.',
      image: 'https://images.pexels.com/photos/4761662/pexels-photo-4761662.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      benefits: ['Versatilidade total', 'Condicionamento completo', 'Competição profissional', 'Adaptabilidade', 'Confiança', 'Resistência mental'],
      ages: '18+ anos',
      duration: '90 min',
      instructor: 'Mestre Leandro Lima',
      schedule: ['Seg/Qua/Sex 20:00', 'Ter/Qui 21:00', 'Sáb 11:00'],
      level: 'Intermediário a Profissional',
      price: 'R$ 220/mês',
      equipment: ['Luvas MMA', 'Protetor bucal', 'Caneleiras', 'Shorts de luta'],
      category: 'misto',
      color: 'purple'
    }

  ];

  return (
    <section id="modalidades" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-red-700 mb-6 
               [text-shadow:2px_2px_0px_white] relative">
            Nossas <span className="relative text-red-700 
                          [paint-order:stroke_fill] 
                          [stroke:white] 
                          [stroke-width:2px] 
                          drop-shadow-[3px_3px_8px_rgba(0,0,0,0.4)]">
              Modalidades
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descubra a arte marcial perfeita para você. Cada modalidade oferece benefícios únicos para seu desenvolvimento físico e mental.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modalidades.map((modalidade, index) => (
            <div
              key={index}
              className={`group bg-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-red-500/20 transition-all duration-500 hover:-translate-y-2 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={modalidade.image}
                  alt={modalidade.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <button
                  onClick={() => setSelectedVideo(modalidade.videoUrl)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="p-4 bg-red-600 rounded-full hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-white">{modalidade.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    modalidade.category === 'infantil' ? 'bg-green-500 text-white' :
                    modalidade.category === 'adulto' ? 'bg-blue-500 text-white' :
                    modalidade.category === 'striking' ? 'bg-red-500 text-white' :
                    'bg-purple-500 text-white'
                  }`}>
                    {modalidade.category === 'infantil' ? 'KIDS' :
                     modalidade.category === 'adulto' ? 'ADULTO' :
                     modalidade.category === 'striking' ? 'STRIKING' : 'MMA'}
                  </span>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed">{modalidade.description}</p>

                {/* Informações básicas */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{modalidade.ages}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{modalidade.duration}</span>
                  </div>
                </div>

                {/* Instrutor e nível */}
                <div className="bg-gray-700/50 rounded-lg p-3 mb-4 text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Instrutor:</span>
                    <span className="text-white font-semibold">{modalidade.instructor}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Nível:</span>
                    <span className="text-white">{modalidade.level}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Preço:</span>
                    <span className="text-red-400 font-bold">{modalidade.price}</span>
                  </div>
                </div>

                {/* Horários */}
                <div className="mb-4">
                  <h4 className="text-red-400 font-semibold text-sm mb-2">Horários:</h4>
                  <div className="space-y-1">
                    {modalidade.schedule.map((schedule, idx) => (
                      <div key={idx} className="text-gray-300 text-xs bg-gray-700/30 rounded px-2 py-1">
                        {schedule}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefícios */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-red-400 font-semibold text-sm">Benefícios:</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {modalidade.benefits.slice(0, 4).map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Target className="w-3 h-3 text-red-400" />
                        <span className="text-gray-300 text-xs">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  {modalidade.benefits.length > 4 && (
                    <div className="text-xs text-gray-400 mt-1">
                      +{modalidade.benefits.length - 4} benefícios adicionais
                    </div>
                  )}
                </div>

                {/* Equipamentos */}
                <div className="mb-6">
                  <h4 className="text-red-400 font-semibold text-sm mb-2">Equipamentos:</h4>
                  <div className="text-xs text-gray-400">
                    {modalidade.equipment.join(' • ')}
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300 shadow-lg">
                  Aula Experimental Grátis
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-white hover:text-red-400 text-2xl"
              >
                ✕
              </button>
              <div className="aspect-video">
                <iframe
                  src={selectedVideo}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  title="Vídeo da modalidade"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Modalidades;