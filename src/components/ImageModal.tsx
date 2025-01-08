import React from "react";

interface ModalProps {
  isOpen: boolean;
  image: {
    id: string;
    author: string;
    download_url: string;
    width: number;
    height: number;
  } | null;
  onClose: () => void;
}

const ImageModal: React.FC<ModalProps> = ({ isOpen, image, onClose }) => {
  if (!isOpen || !image) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white p-4 rounded-lg max-w-lg w-full relative">
        <button
          className="absolute top-2 right-2 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
          onClick={onClose}
        >
          ✖
        </button>
        <img
          src={image.download_url}
          alt={image.author}
          className="w-full h-auto rounded-lg"
        />
        <div className="mt-4">
          <h2 className="text-xl font-bold">{image.author}</h2>
          <p>Dimensões: {image.width}x{image.height}</p>
          <p>ID: {image.id}</p>
          <a
            href={image.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Abrir imagem original
          </a>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
