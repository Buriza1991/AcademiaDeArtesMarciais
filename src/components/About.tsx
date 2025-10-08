import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Users, Award, Target, Heart } from 'lucide-react';

const About: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We pursue perfection in every project, ensuring the highest quality standards.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We work closely with our clients as partners to achieve their business goals.'
    },
    {
      icon: Award,
      title: 'Innovation',
      description: 'We stay ahead of trends and use cutting-edge technologies in our solutions.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'We love what we do and it shows in the quality of our work and relationships.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div ref={ref} className={`transition-all duration-15000 ${
            inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Our Story</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Founded with a vision to transform how businesses connect with their audiences, 
              Digital Excellence has grown from a small startup to a leading digital agency. 
              We combine creativity, technology, and strategy to deliver exceptional results.
            </p>

            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
              Our team of passionate designers, developers, and strategists work together to 
              create digital experiences that not only look amazing but also drive real business growth.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">1000+</div>
                <div className="text-gray-600">Projects Delivered</div>
              </div>
            </div>

            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-300 hover:shadow-lg">
              Meet Our Team
            </button>
          </div>

          {/* Image and Values */}
          <div className={`transition-all duration-1000 delay-300 ${
            inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            {/* Team Image */}
            <div className="relative mb-12">
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600"
                  alt="Our team working together"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-lg">
                <div className="text-2xl font-bold text-gray-800">5+</div>
                <div className="text-gray-600 text-sm">Years Experience</div>
              </div>
            </div>

            {/* Values */}
            <div className="grid grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div key={index} className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;