import React, { useEffect, useState } from "react";
import ImageCard from "./components/ImageCard";
import ImageModal from "./components/ImageModal";
import { useFavorites } from "./components/Filters";
import Header from "./components/Header";

interface Image {
  id: string;
  author: string;
  download_url: string;
  width: number;
  height: number;
}

const App: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [filterText, setFilterText] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [showFavorites, setShowFavorites] = useState<boolean>(false); 
  const { toggleFavorite, isFavorite } = useFavorites();

  const fetchImages = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=10`);
      const data: Image[] = await response.json();
      setImages((prevImages) => [
        ...prevImages.filter((image) => !data.some((newImage) => newImage.id === image.id)),
        ...data,
      ]);
    } catch (error) {
      console.error("Erro ao carregar imagens:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(page);
  }, [page]);

  const filteredImages = images.filter((image) => {
    const matchesAuthor = image.author.toLowerCase().includes(filterText.toLowerCase());
    const matchesFavorites = !showFavorites || isFavorite(image.id);
    return matchesAuthor && matchesFavorites;
  });

  const loadMoreImages = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const noFavoriteImages = showFavorites && filteredImages.length === 0;

  if (loading && page === 1) {
    return <div className="text-center text-lg">Carregando...</div>;
  }

  return (
    <>
      <Header />
      <main className="h-[100%] container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Galeria de Imagens</h1>

        <div className="mb-4 text-center">
          <input
            type="text"
            placeholder="Buscar por autor"
            className="p-2 border rounded"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        <div className="text-center mb-4">
          <button
            onClick={() => setShowFavorites((prev) => !prev)}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            {showFavorites ? "Mostrar Todas" : "Mostrar Favoritos"}
          </button>
        </div>

        {noFavoriteImages ? (
          <div className="text-center text-lg text-gray-700">
            Não há imagens favoritas.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <ImageCard
                key={image.id}
                {...image}
                onFavoriteToggle={toggleFavorite}
                isFavorite={isFavorite(image.id)}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        )}

        {!showFavorites && (
          <div className="text-center mt-4">
            <button
              onClick={loadMoreImages}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {loading ? "Carregando..." : "Carregar Mais Imagens"}
            </button>
          </div>
        )}

        <ImageModal
          isOpen={!!selectedImage}
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      </main>
    </>
  );
};

export default App;
