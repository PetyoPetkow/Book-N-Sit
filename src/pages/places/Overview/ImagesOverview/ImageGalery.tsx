import { FC, useState } from 'react';
import clsx from 'clsx';
import FsLightbox from 'fslightbox-react';

const ImageGallery: FC<ImageGalleryProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(2);
  const [toggler, setToggler] = useState(false);

  const handleImageClick = (imageIndex: number) => {
    setCurrentImageIndex(imageIndex);
    setToggler(!toggler);
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto  aspect-[16/10]">
        <div className="grid grid-cols-12 grid-rows-12 gap-2 h-full">
          <ImageDisplay images={images} handleImageClick={handleImageClick} />
        </div>
      </div>
      <FsLightbox
        toggler={toggler}
        sourceIndex={currentImageIndex}
        sources={images}
        type={'image'}
      />
    </>
  );
};

const ImageDisplay = ({
  images,
  handleImageClick,
}: {
  images: string[];
  handleImageClick: (index: number) => void;
}) => {
  if (images.length === 1) {
    return <Single image={images[0]} onClick={() => handleImageClick(0)} />;
  } else if (images.length < 6) {
    return <Middle images={images} onClick={handleImageClick} />;
  } else {
    return <Many images={images} onClick={handleImageClick} />;
  }
};

const Single = ({ image, onClick }: { image: string; onClick: () => void }) => {
  return (
    <div className="rounded-lg shadow-lg" onClick={onClick}>
      <img className="object-cover w-full h-full" src={image} />
    </div>
  );
};

const Middle = ({ images, onClick }: { images: string[]; onClick: (index: number) => void }) => {
  return (
    <>
      {images.map((image, index) => {
        return (
          <div
            className={clsx(
              'rounded-lg shadow-lg',
              index === 0 ? 'col-span-9 row-span-12' : 'col-span-3 row-span-3'
            )}
            onClick={() => onClick(index)}
          >
            <img className="object-cover w-full h-full" src={image} />
          </div>
        );
      })}
    </>
  );
};

const Many = ({ images, onClick }: { images: string[]; onClick: (index: number) => void }) => {
  return (
    <>
      {images.map((image, index) => {
        return (
          <div
            className={clsx(
              'rounded-lg shadow-lg',
              index === 0
                ? 'col-span-8 row-span-8'
                : index === 1 || index === 2
                  ? 'col-span-4 row-span-4'
                  : 'col-span-3 row-span-4'
            )}
            onClick={() => onClick(index)}
          >
            <img className="object-cover w-full h-full" src={image} />
          </div>
        );
      })}
    </>
  );
};

export default ImageGallery;

interface ImageGalleryProps {
  images: string[];
}
