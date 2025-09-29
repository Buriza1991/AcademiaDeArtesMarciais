import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { X, ChevronLeft, ChevronRight, Camera, Plus, Trash2 } from 'lucide-react';
import { MediaService, ModalityService, useAuth } from '../services/api';
import MediaUpload from './MediaUpload';

interface Media {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: 'IMAGE' | 'VIDEO';
  fileName: string;
  createdAt: string;
  modality: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
  };
}

interface Modality {
  id: string;
  name: string;
}

const Galeria: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { isAuthenticated, user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState('todos');
  const [media, setMedia] = useState<Media[]>([]);
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    loadModalities();
    loadMedia();
  }, []);

  const loadModalities = async () => {
    try {
      const response = await ModalityService.getAllModalities();
      if (response.success && response.data) {
        setModalities(response.data as Modality[]);
      }
    } catch (error) {
      console.error('Erro ao carregar modalidades:', error);
    }
  };

  const loadMedia = async () => {
    try {
      setLoading(true);
      const response = await MediaService.getAllMedia({ limit: 100 });
      if (response.success && response.data) {
        const mediaData = (response.data as any).media as Media[];
        console.log('Dados da API recebidos:', mediaData);
        console.log('URLs das imagens:', mediaData.map(item => `http://localhost:3001${item.fileUrl}`));
        setMedia(mediaData);
      }
    } catch (error) {
      console.error('Erro ao carregar mídia:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    loadMedia();
    setShowUploadModal(false);
  };

  const handleDeleteMedia = async (mediaId: string, mediaTitle: string) => {
    const confirmMessage = `Tem certeza que deseja deletar a imagem "${mediaTitle}"?\n\nEsta ação não pode ser desfeita.`;
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await MediaService.deleteMedia(mediaId);
      if (response.success) {
        // Mostrar mensagem de sucesso
        alert('Imagem deletada com sucesso!');
        // Recarregar a galeria
        loadMedia();
      }
    } catch (error) {
      console.error('Erro ao deletar mídia:', error);
      alert('Erro ao deletar a imagem. Tente novamente.');
    }
  };

  const categories = [
    { id: 'todos', name: 'Todas' },
    ...modalities.map(modality => ({
      id: `modality-${modality.id}`,
      name: modality.name
    }))
  ];

  const filteredMedia = media.filter(item => {
    if (filter === 'todos') return true;
    if (filter === 'IMAGE' || filter === 'VIDEO') return item.fileType === filter;
    if (filter.startsWith('modality-')) {
      const modalityId = filter.replace('modality-', '');
      return item.modality.id === modalityId;
    }
    return true;
  });

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredMedia.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + filteredMedia.length) % filteredMedia.length);
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <section id="galeria" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nossa <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white">Galeria</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Veja momentos especiais da nossa academia, treinos, competições e conquistas dos nossos alunos.
          </p>

          {/* Filter Buttons and Upload Button */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === category.id
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
            {/* Botão de Upload sempre visível */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-400 mt-4">Carregando galeria...</p>
          </div>
        )}

        {/* Media Grid */}
        {!loading && (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {filteredMedia.map((item, index) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-lg cursor-pointer aspect-square"
                onClick={() => setSelectedImage(index)}
              >
                {item.fileType === 'IMAGE' ? (
                  <img
                    src={`http://localhost:3001${item.fileUrl}`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onLoad={() => console.log('Imagem carregada com sucesso:', item.fileName)}
                    onError={(e) => {
                      console.error('Erro ao carregar imagem:', item.fileName, 'URL:', `http://localhost:3001${item.fileUrl}`);
                      console.error('Elemento:', e.target);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <video
                      src={`http://localhost:3001${item.fileUrl}`}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                    <p className="text-gray-300 text-xs">{item.modality.name}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white opacity-80" />
                  </div>
                </div>

                {/* Admin Controls */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMedia(item.id, item.title);
                      }}
                      className="bg-red-600 text-white p-2 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
                      title="Deletar imagem"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMedia.length === 0 && (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Nenhuma mídia encontrada</p>
            {isAuthenticated && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="mt-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200"
              >
                Adicionar Primeira Mídia
              </button>
            )}
          </div>
        )}

        {/* Lightbox */}
        {selectedImage !== null && filteredMedia[selectedImage] && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-red-400 text-3xl z-10"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-red-400 z-10"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-red-400 z-10"
            >
              <ChevronRight className="w-12 h-12" />
            </button>

            <div className="max-w-4xl max-h-full">
              {filteredMedia[selectedImage].fileType === 'IMAGE' ? (
                <img
                  src={`http://localhost:3001${filteredMedia[selectedImage].fileUrl}`}
                  alt={filteredMedia[selectedImage].title}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <video
                  src={`http://localhost:3001${filteredMedia[selectedImage].fileUrl}`}
                  controls
                  className="max-w-full max-h-full"
                />
              )}
              <div className="text-center mt-4">
                <h3 className="text-white text-xl font-semibold">
                  {filteredMedia[selectedImage].title}
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  {filteredMedia[selectedImage].modality.name} • {selectedImage + 1} de {filteredMedia.length}
                </p>
                {filteredMedia[selectedImage].description && (
                  <p className="text-gray-300 text-sm mt-2">
                    {filteredMedia[selectedImage].description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Upload de Mídia</h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <MediaUpload onUploadSuccess={handleUploadSuccess} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Galeria;