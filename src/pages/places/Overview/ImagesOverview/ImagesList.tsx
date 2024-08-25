import { FC, useEffect, useRef } from 'react';

const ImagesList: FC<ImagesListProps> = ({ images, currentImageIndex, handleThumbnailClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToCenter = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const thumbnailWidth = 130;
    const containerWidth = container.clientWidth;
    const scrollLeft = thumbnailWidth * index - containerWidth / 2 + thumbnailWidth / 2;
    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToCenter(currentImageIndex);
  }, [currentImageIndex]);

  return (
    <div
      ref={containerRef}
      className="flex items-center mt-3"
      style={{ overflowX: 'hidden', width: '100%', scrollBehavior: 'smooth' }}
    >
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`img-${index}`}
          style={{
            maxWidth: '120px',
            maxHeight: '100px',
            marginRight: '10px',
            opacity: index === currentImageIndex ? 1 : 0.5,
            cursor: 'pointer',
          }}
          onClick={() => handleThumbnailClick(index)}
        />
      ))}
    </div>
  );
};

interface ImagesListProps {
  images: string[];
  currentImageIndex: number;
  handleThumbnailClick: (index: number) => void;
}

export default ImagesList;
