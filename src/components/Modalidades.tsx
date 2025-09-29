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
      name: 'Jiu-Jitsu',
      description: 'Arte suave brasileira que ensina como usar a técnica para vencer oponentes maiores.',
      image: 'https://images.pexels.com/photos/7045718/pexels-photo-7045718.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      benefits: ['Técnica refinada', 'Estratégia', 'Flexibilidade', 'Autoconfiança'],
      ages: '6+ anos',
      duration: '90 min'
    },
    {
      name: 'Muay Thai',
      description: 'A arte das oito armas, combinando punhos, cotovelos, joelhos e canelas.',
      image: 'https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      benefits: ['Condicionamento intenso', 'Força', 'Resistência', 'Coordenação'],
      ages: '12+ anos',
      duration: '75 min'
    },

    {
      name: 'MMA',
      description: 'Artes marciais mistas combinando as melhores técnicas de várias modalidades.',
      image: 'https://images.pexels.com/photos/4761662/pexels-photo-4761662.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      benefits: ['Versatilidade', 'Condicionamento completo', 'Competição', 'Adaptabilidade'],
      ages: '16+ anos',
      duration: '90 min'
    }

  ];

  return (
    <section id="modalidades" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nossas <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">Modalidades</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descubra a arte marcial perfeita para você. Cada modalidade oferece benefícios únicos para seu desenvolvimento físico e mental.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modalidades.map((modalidade, index) => (
            <div
              key={index}
              className={`group bg-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-red-500/20 transition-all duration-500 hover:-translate-y-2 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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
                <h3 className="text-2xl font-bold text-white mb-3">{modalidade.name}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{modalidade.description}</p>

                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{modalidade.ages}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{modalidade.duration}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <h4 className="text-red-400 font-semibold text-sm">Benefícios:</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {modalidade.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Target className="w-3 h-3 text-red-400" />
                        <span className="text-gray-300 text-xs">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-300">
                  Aula Experimental
                  
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