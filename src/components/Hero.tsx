import React from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { Play, Users, Award, Target } from 'lucide-react';
import FundoSite from '../image/Screenshot_9.jpg';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <img
          src={FundoSite}
          alt="Artes Marciais"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
<div className="relative z-10 container mx-auto px-6 text-center bg-white/25 rounded-2xl shadow-lg">
  <div
    ref={ref}
    className={`transition-all duration-1000 ${
      inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
  >
    {/* Badge */}
    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-white-600 to-white-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
      <Award className="w-4 h-4" />
      <span>Mais de 15 anos de experiência</span>
    </div>

    {/* Main Title */}
    <h1
      className="text-5xl md:text-7xl font-sonic text-white mb-6 leading-tight"
      style={{
        textShadow:
          "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
      }}
    >
      STUDIO TIANGUA TOP TEAM
    </h1>

    <h2 className="text-2xl md:text-3xl text-black font-bold text-white mb-6 leading-tight 8">      
      Transforme seu corpo e mente através das Artes Marciais
    </h2>

    {/* Description */}
    <p className="text-xl text-white max-w-3xl mx-auto mb-12 leading-relaxed">
      Descubra a força interior, desenvolva disciplina e conquiste seus
      objetivos em um ambiente profissional e acolhedor. Nossa equipe de
      instrutores experientes está pronta para guiar sua jornada.
    </p>

    {/* ... resto do código permanece igual ... */}
  </div>
</div>


      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;