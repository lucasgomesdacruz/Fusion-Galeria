import React, { useEffect, useState } from "react";
import ImageCard from "./components/ImageCard";
import ImageModal from "./components/ImageModal";
import { useFavorites } from "./components/Filters";
import Header from "./components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const handleFavoriteToggle = (imageId: string) => {
    const isCurrentlyFavorite = isFavorite(imageId);
    toggleFavorite(imageId);

    if (isCurrentlyFavorite) {
      toast.info("Imagem desfavoritada!");
    } else {
      toast.success("Imagem adicionada aos favoritos!");
    }
  };

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
    return <div className="text-center text-xl text-gray-500">Carregando...</div>;
  }

  return (
    <>
      <Header />
      <main className="h-[100%] container mx-auto p-6 bg-blue-100">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Galeria de Imagens</h1>

        <div className="mb-6 text-center">
          <input
            type="text"
            placeholder="Buscar por autor"
            className="p-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        <div className="text-center mb-6">
          <button
            onClick={() => setShowFavorites((prev) => !prev)}
            className="bg-teal-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-teal-600 transition-colors duration-200"
          >
            {showFavorites ? "Mostrar Todas" : "Mostrar Favoritos"}
          </button>
        </div>

        {noFavoriteImages ? (
          <div className="text-center text-lg text-gray-700">
            Não há imagens favoritas.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <ImageCard
                key={image.id}
                {...image}
                onFavoriteToggle={() => handleFavoriteToggle(image.id)}
                isFavorite={isFavorite(image.id)}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        )}

        {!showFavorites && (
          <div className="text-center mt-6">
            <button
              onClick={loadMoreImages}
              className="bg-indigo-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-600 transition-colors duration-200"
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

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
