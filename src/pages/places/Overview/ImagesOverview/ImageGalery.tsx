import { FC, useState } from 'react';
import clsx from 'clsx';
import FsLightbox from 'fslightbox-react';

const ImageGallery: FC<ImageGalleryProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(2);
  const [toggler, setToggler] = useState(false);
  const maxDisplayImages = 6;
  const displayImages = images.slice(0, maxDisplayImages);
  const moreImagesCount = images.length - maxDisplayImages;

  return (
    <>
      <div className="w-full max-w-7xl mx-auto  aspect-[16/10]">
        <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className={clsx(
                'relative overflow-hidden rounded-lg shadow-lg',
                'hover:opacity-90 cursor-pointer',
                index === 0 ? 'col-span-2 row-span-2' : '',
                images.length === 1 ? 'col-span-3' : ''
              )}
              onClick={() => {
                setCurrentImageIndex(index);
                setToggler(!toggler);
              }}
            >
              <img className="object-cover w-full h-full" src={image} alt={`image-${index}`} />
              {index === maxDisplayImages - 1 && moreImagesCount > 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex justify-center items-center text-white text-2xl font-bold">
                  +{moreImagesCount}
                </div>
              )}
            </div>
          ))}
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

export default ImageGallery;

interface ImageGalleryProps {
  images: string[];
}
