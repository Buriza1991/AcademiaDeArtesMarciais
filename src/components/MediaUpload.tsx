import React, { useState, useEffect } from 'react';
import { Upload, X, Image, Video, Loader2, CheckCircle, AlertCircle, Link, FileText } from 'lucide-react';
import { MediaService, ModalityService } from '../services/api';

interface Modality {
  id: string;
  name: string;
}

interface MediaUploadProps {
  onUploadSuccess?: () => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onUploadSuccess }) => {
  // Buscar modalidades do backend
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [selectedModality, setSelectedModality] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadMode, setUploadMode] = useState<'single' | 'multiple'>('single');
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  useEffect(() => {
    async function fetchModalities() {
      const response = await ModalityService.getAllModalities();
      if (response.success && response.data) {
        setModalities(response.data as Modality[]);
      }
    }
    fetchModalities();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
    
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach((file, index) => {
      // Validar tipo de arquivo
      if (!allowedImageTypes.includes(file.type) && !allowedVideoTypes.includes(file.type)) {
        errors.push(`${file.name}: Tipo de arquivo não suportado.`);
        return;
      }

      // Validar tamanho (50MB máximo)
      if (file.size > 50 * 1024 * 1024) {
        errors.push(`${file.name}: Arquivo muito grande (máx: 50MB).`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setErrorMessage(errors.join('\n'));
    } else {
      setErrorMessage('');
    }

    if (uploadMode === 'single') {
      setSelectedFile(validFiles[0] || null);
    } else {
      setSelectedFiles(validFiles);
    }
  };

  const uploadSingleFile = async () => {
    console.log('🚀 Iniciando upload único...');
    const formData = new FormData();
    formData.append('file', selectedFile!);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('modalityId', selectedModality);

    const response = await MediaService.uploadMedia(formData);
    
    if (response.success) {
      setUploadStatus('success');
      resetForm();
      if (onUploadSuccess) onUploadSuccess();
    } else {
      setUploadStatus('error');
      setErrorMessage(response.error || 'Erro ao fazer upload do arquivo.');
    }
  };

  const uploadMultipleFiles = async () => {
    console.log('🚀 Iniciando upload múltiplo...');
    const uploadPromises = selectedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title || file.name.split('.')[0]);
      formData.append('description', description);
      formData.append('modalityId', selectedModality);

      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        const response = await MediaService.uploadMedia(formData);
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        return { success: response.success, fileName: file.name, error: response.error };
      } catch (error) {
        setUploadProgress(prev => ({ ...prev, [file.name]: -1 }));
        return { success: false, fileName: file.name, error: 'Erro no upload' };
      }
    });

    const results = await Promise.all(uploadPromises);
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    if (successful.length === selectedFiles.length) {
      setUploadStatus('success');
      resetForm();
      if (onUploadSuccess) onUploadSuccess();
    } else if (successful.length > 0) {
      setUploadStatus('success');
      setErrorMessage(`${successful.length} arquivos enviados. ${failed.length} falharam: ${failed.map(f => f.fileName).join(', ')}`);
      if (onUploadSuccess) onUploadSuccess();
    } else {
      setUploadStatus('error');
      setErrorMessage(`Todos os uploads falharam: ${failed.map(f => f.fileName).join(', ')}`);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedFile(null);
    setSelectedFiles([]);
    setMediaUrl('');
    setUploadProgress({});
    setSelectedModality('');
    
    // Limpar input de arquivo
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (uploadType === 'file') {
      if (uploadMode === 'single') {
        if (!selectedModality || !title || !selectedFile) {
          setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
          return;
        }
      } else {
        if (!selectedModality || selectedFiles.length === 0) {
          setErrorMessage('Por favor, selecione uma modalidade e pelo menos um arquivo.');
          return;
        }
      }
    } else {
      if (!selectedModality || !title || !mediaUrl) {
        setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      if (!validateUrl(mediaUrl)) {
        setErrorMessage('Por favor, insira uma URL válida.');
        return;
      }

      const fileType = getFileTypeFromUrl(mediaUrl);
      if (!fileType) {
        setErrorMessage('URL deve apontar para uma imagem ou vídeo válido.');
        return;
      }
    }

    setUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      if (uploadType === 'file') {
        if (uploadMode === 'single') {
          await uploadSingleFile();
        } else {
          await uploadMultipleFiles();
        }
      } else {
        // Upload por URL
        const fileType = getFileTypeFromUrl(mediaUrl);
        const fileName = mediaUrl.split('/').pop() || 'media';
        
        const mediaData = {
          title,
          description,
          modalityId: selectedModality,
          fileUrl: mediaUrl,
          fileType: fileType!,
          fileName,
          fileSize: 0 // Não temos o tamanho real para URLs externas
        };

        const response = await MediaService.addMediaByUrl(mediaData);

        if (response.success) {
          setUploadStatus('success');
          setTitle('');
          setDescription('');
          setMediaUrl('');
          setSelectedModality('');
        }
      }

      // Resetar status após 3 segundos
      setTimeout(() => {
        setUploadStatus('idle');
      }, 3000);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      setUploadStatus('error');
      setErrorMessage(error.message || 'Erro ao adicionar mídia.');
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="w-8 h-8" />;
    
    const isImage = selectedFile.type.startsWith('image/');
    return isImage ? <Image className="w-8 h-8" /> : <Video className="w-8 h-8" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getFileTypeFromUrl = (url: string): 'IMAGE' | 'VIDEO' | null => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
    
    const urlLower = url.toLowerCase();
    const hasImageExt = imageExtensions.some(ext => urlLower.includes(ext));
    const hasVideoExt = videoExtensions.some(ext => urlLower.includes(ext));
    
    if (hasImageExt) return 'IMAGE';
    if (hasVideoExt) return 'VIDEO';
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Upload de Mídia</h2>
        <div className="flex items-center space-x-2">
          <Upload className="w-6 h-6 text-red-600" />
          <span className="text-sm text-gray-600">Acesso Livre</span>
        </div>
      </div>

      {/* Abas de Upload */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setUploadType('file')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              uploadType === 'file'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Upload de Arquivo</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setUploadType('url')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              uploadType === 'url'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Link className="w-4 h-4" />
              <span>URL da Mídia</span>
            </div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seleção de Modalidade */}
        <div>
          <label htmlFor="modality" className="block text-sm font-medium text-gray-700 mb-2">
            Modalidade *
          </label>
          <select
            id="modality"
            value={selectedModality}
            onChange={(e) => setSelectedModality(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          >
            <option value="">Selecione uma modalidade</option>
            {modalities.map((modality) => (
              <option key={modality.id} value={modality.id}>
                {modality.name}
              </option>
            ))}
          </select>
        </div>

        {/* Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Título {uploadMode === 'multiple' ? '(opcional - usa nome do arquivo se vazio)' : '*'}
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder={uploadMode === 'multiple' ? "Título geral (opcional)" : "Ex: Treino de Karatê - Aula Avançada"}
            required={uploadMode === 'single'}
          />
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descrição (opcional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Descreva brevemente o conteúdo da mídia..."
          />
        </div>

        {/* Upload de Arquivo */}
        {uploadType === 'file' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Arquivo *
              </label>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Múltiplos arquivos:</label>
                <input
                  type="checkbox"
                  checked={uploadMode === 'multiple'}
                  onChange={(e) => {
                    setUploadMode(e.target.checked ? 'multiple' : 'single');
                    setSelectedFile(null);
                    setSelectedFiles([]);
                  }}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
              </div>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
              <input
                id="file-input"
                type="file"
                onChange={handleFileSelect}
                accept="image/*,video/*"
                multiple={uploadMode === 'multiple'}
                className="hidden"
                required={uploadType === 'file'}
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-2">
                  {getFileIcon()}
                  <div className="text-sm text-gray-600">
                    {uploadMode === 'single' ? (
                      selectedFile ? (
                        <div className="space-y-1">
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-xs">{formatFileSize(selectedFile.size)}</p>
                        </div>
                      ) : (
                        <>
                          <p className="font-medium">Clique para selecionar um arquivo</p>
                          <p className="text-xs">Imagens (JPG, PNG, GIF, WebP) ou Vídeos (MP4, AVI, MOV, WMV, FLV, WebM)</p>
                          <p className="text-xs">Tamanho máximo: 50MB</p>
                        </>
                      )
                    ) : (
                      selectedFiles.length > 0 ? (
                        <div className="space-y-1">
                          <p className="font-medium">{selectedFiles.length} arquivo(s) selecionado(s)</p>
                          <div className="text-xs space-y-1 max-h-24 overflow-y-auto">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="truncate">{file.name}</span>
                                <span>{formatFileSize(file.size)}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-green-600">Total: {formatFileSize(selectedFiles.reduce((acc, file) => acc + file.size, 0))}</p>
                        </div>
                      ) : (
                        <>
                          <p className="font-medium">Clique para selecionar múltiplos arquivos</p>
                          <p className="text-xs">Segure Ctrl/Cmd para selecionar vários arquivos</p>
                          <p className="text-xs">Imagens (JPG, PNG, GIF, WebP) ou Vídeos (MP4, AVI, MOV, WMV, FLV, WebM)</p>
                          <p className="text-xs">Tamanho máximo: 50MB por arquivo</p>
                        </>
                      )
                    )}
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* URL da Mídia */}
        {uploadType === 'url' && (
          <div>
            <label htmlFor="mediaUrl" className="block text-sm font-medium text-gray-700 mb-2">
              URL da Mídia *
            </label>
            <input
              type="url"
              id="mediaUrl"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="https://exemplo.com/imagem.jpg ou https://exemplo.com/video.mp4"
              required={uploadType === 'url'}
            />
            <p className="text-xs text-gray-500 mt-1">
              Insira a URL completa de uma imagem ou vídeo. Formatos suportados: JPG, PNG, GIF, WebP, MP4, AVI, MOV, WMV, FLV, WebM
            </p>
          </div>
        )}

        {/* Status de Upload */}
        {uploadStatus === 'success' && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Upload realizado com sucesso!</span>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{errorMessage}</span>
          </div>
        )}

        {errorMessage && uploadStatus === 'idle' && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{errorMessage}</span>
          </div>
        )}

        {/* Botão de Submit */}
        <button
          type="submit"
          disabled={uploading || !selectedModality || !title || (uploadType === 'file' ? selectedFiles.length === 0 : !mediaUrl)}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-md font-medium hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              {uploadType === 'file' ? (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Enviar Arquivo</span>
                </>
              ) : (
                <>
                  <Link className="w-5 h-5" />
                  <span>Adicionar por URL</span>
                </>
              )}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default MediaUpload; 