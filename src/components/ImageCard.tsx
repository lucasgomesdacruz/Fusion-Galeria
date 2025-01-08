import React from "react";

interface ImageProps {
  id: string;
  author: string;
  download_url: string;
  onFavoriteToggle: (id: string) => void;
  isFavorite: boolean;
  onClick: () => void;
}

const ImageCard: React.FC<ImageProps> = ({
  id,
  author,
  download_url,
  onFavoriteToggle,
  isFavorite,
  onClick,
}) => (
  <div className="border rounded-lg overflow-hidden relative">
    <img
      src={download_url}
      alt={author}
      className="w-full h-48 object-cover cursor-pointer"
      onClick={onClick}
    />
    <div className="p-2 text-center">
      <p className="text-sm text-gray-700">Autor: {author}</p>
      <button
        className={`absolute top-2 right-2 p-2 rounded-full ${
          isFavorite ? "bg-red-500 text-white" : "bg-gray-200 text-black"
        }`}
        onClick={() => onFavoriteToggle(id)}
      >
        {isFavorite ? "💖" : "🤍"}
      </button>
    </div>
  </div>
);

export default ImageCard;
