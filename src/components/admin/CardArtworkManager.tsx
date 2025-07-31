import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image, Save, Trash2, Eye, X } from 'lucide-react';
import { Card } from '../../types/card';

interface CardArtworkManagerProps {
  card: Card;
  onSave: (cardId: string, artworkUrl: string) => void;
  onClose: () => void;
}

const CardArtworkManager: React.FC<CardArtworkManagerProps> = ({ card, onSave, onClose }) => {
  const [artworkUrl, setArtworkUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('O arquivo deve ter no máximo 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      // Create a preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // In a real implementation, you would upload to your storage service here
      // For now, we'll simulate the upload
      setTimeout(() => {
        setArtworkUrl(preview);
        setIsUploading(false);
      }, 1000);

    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem.');
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (artworkUrl) {
      onSave(card.id, artworkUrl);
      onClose();
    }
  };

  const handleRemoveArtwork = () => {
    setArtworkUrl('');
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'city': return 'from-amber-900/20 to-orange-800/20';
      case 'farm': return 'from-green-800/20 to-emerald-700/20';
      case 'magic': return 'from-purple-800/20 to-violet-700/20';
      case 'landmark': return 'from-blue-800/20 to-indigo-700/20';
      case 'event': return 'from-red-800/20 to-rose-700/20';
      case 'trap': return 'from-gray-800/20 to-slate-700/20';
      case 'defense': return 'from-teal-800/20 to-cyan-700/20';
      default: return 'from-amber-900/20 to-orange-800/20';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400';
      case 'ultra': return 'text-purple-400';
      case 'rare': return 'text-blue-400';
      case 'uncommon': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-4xl w-full bg-gradient-to-br from-stone-900/95 via-amber-900/90 to-stone-900/95 backdrop-blur-md border-2 border-amber-600/50 rounded-2xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800/50 to-orange-800/50 p-6 border-b border-amber-600/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-amber-100">Gerenciar Artwork da Carta</h2>
              <p className="text-amber-200/80 mt-1">
                {card.name} • <span className={getRarityColor(card.rarity)}>{card.rarity}</span> • {card.type}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              title="Fechar"
              aria-label="Fechar gerenciador de artwork"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-amber-100 mb-4">Upload de Artwork</h3>
                
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-amber-600/50 rounded-xl p-8 text-center hover:border-amber-500/70 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="artwork-upload"
                  />
                  <label
                    htmlFor="artwork-upload"
                    className="cursor-pointer block"
                  >
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-amber-900/30 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-amber-100 font-medium">Clique para selecionar uma imagem</p>
                        <p className="text-amber-200/60 text-sm mt-1">
                          PNG, JPG, JPEG até 5MB
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <motion.div
                    className="mt-4 p-4 bg-amber-900/30 rounded-lg border border-amber-600/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-amber-100">Fazendo upload...</span>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSave}
                    disabled={!artworkUrl || isUploading}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Artwork
                  </button>
                  
                  {artworkUrl && (
                    <button
                      onClick={handleRemoveArtwork}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remover
                    </button>
                  )}
                </div>
              </div>

              {/* Card Information */}
              <div className="bg-black/30 rounded-lg p-4 border border-amber-600/30">
                <h4 className="font-semibold text-amber-100 mb-3">Informações da Carta</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-amber-200/80">Nome:</span>
                    <span className="text-amber-100 font-medium">{card.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-200/80">Tipo:</span>
                    <span className="text-amber-100 font-medium capitalize">{card.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-200/80">Raridade:</span>
                    <span className={`font-medium ${getRarityColor(card.rarity)}`}>
                      {card.rarity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-200/80">Custo Total:</span>
                    <span className="text-amber-100 font-medium">
                      {(card.cost.coins || 0) + (card.cost.food || 0) + (card.cost.materials || 0) + (card.cost.population || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-amber-100">Preview da Carta</h3>
              
              {/* Card Preview */}
              <div className="relative">
                <div className={`w-full max-w-sm mx-auto bg-gradient-to-br ${getCardTypeColor(card.type)} border-2 border-amber-600/50 rounded-xl p-4 shadow-lg`}>
                  {/* Card Header */}
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-bold text-amber-100 mb-2">{card.name}</h4>
                    <p className={`text-sm font-semibold uppercase tracking-wider ${getRarityColor(card.rarity)}`}>
                      {card.rarity} • {card.type}
                    </p>
                  </div>

                  {/* Artwork Area */}
                  <div className="bg-black/30 rounded-lg p-4 mb-4 border border-amber-600/30">
                    <div className="aspect-[4/3] bg-gradient-to-br from-amber-900/20 to-orange-800/20 rounded-lg border-2 border-amber-600/30 flex items-center justify-center overflow-hidden">
                      {artworkUrl ? (
                        <img
                          src={artworkUrl}
                          alt={`Artwork de ${card.name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <Image className="w-12 h-12 text-amber-400/60 mx-auto mb-2" />
                          <p className="text-amber-200/60 text-sm">Sem artwork</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-3">
                    {/* Costs */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {(card.cost.coins || 0) > 0 && (
                        <span className="px-2 py-1 bg-amber-900/50 border border-amber-600/50 text-amber-100 text-xs rounded">
                          💰 {card.cost.coins}
                        </span>
                      )}
                      {(card.cost.food || 0) > 0 && (
                        <span className="px-2 py-1 bg-green-900/50 border border-green-600/50 text-green-100 text-xs rounded">
                          🍎 {card.cost.food}
                        </span>
                      )}
                      {(card.cost.materials || 0) > 0 && (
                        <span className="px-2 py-1 bg-blue-900/50 border border-blue-600/50 text-blue-100 text-xs rounded">
                          🧱 {card.cost.materials}
                        </span>
                      )}
                      {(card.cost.population || 0) > 0 && (
                        <span className="px-2 py-1 bg-purple-900/50 border border-purple-600/50 text-purple-100 text-xs rounded">
                          👥 {card.cost.population}
                        </span>
                      )}
                    </div>

                    {/* Effect */}
                    {card.effect && (
                      <div className="bg-amber-900/30 border border-amber-600/30 rounded-lg p-3">
                        <p className="text-amber-100 text-xs leading-relaxed">
                          {card.effect.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-100 mb-2">📋 Instruções</h4>
                <ul className="text-blue-200/80 text-sm space-y-1">
                  <li>• Use imagens de alta qualidade (mínimo 400x300px)</li>
                  <li>• Formato recomendado: PNG com fundo transparente</li>
                  <li>• Tamanho máximo: 5MB</li>
                  <li>• A imagem será exibida no centro da carta</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CardArtworkManager; 
