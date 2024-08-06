import { FC, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import Location from './Location';
import ImageGallery from './ImagesOverview/ImageGalery';
import RatingDisplay from './Rating/RatingDisplay';
import { Button, Divider, IconButton, Modal } from '@mui/material';
import ReviewsSection from './Reviews/ReviewsSection';
import PerksList from './Perks/PerksList';
import PropertyDescription from './PropertyDescription/PropertyDescription';
import WriteReviewSection from './Reviews/WriteReviewSection';
import { firestore } from '../../../firebase/firebase';
import { useNavigate, useParams } from 'react-router-dom';
import Venue from '../../../global/models/Venue';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import OwnerInfo from './Owner/OwnerInfo';
import { getVenueReviews, setReview } from '../../../firebase/services/ReviewsService';
import { useAuth } from '../../../contexts/authContext';
import Review from '../../../global/models/Review';
import CloseIcon from '@mui/icons-material/Close';
import InputFileUpload from '../Venue/Images/UploadImages';
import { uploadImages } from '../../../firebase/queries/AddVenueQueries';
import { ref } from 'firebase/storage';
import styled from '@emotion/styled';
import EditImages from '../Venue/Images/EditImages';

const OverviewPage: FC<OverviewPageProps> = () => {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [openImagesModal, setOpenImagesModal] = useState<boolean>(false);

  const { currentUser } = useAuth();
  const { venueName } = useParams();
  const navigate = useNavigate();

  const refetchReviews = useCallback(async () => {
    let reviews: Review[] = [];
    if (venue) {
      reviews = await getVenueReviews(venue.name);
    }
    setReviews(reviews);
  }, [venue]);

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const onFinishReviewClick = (rating: number, comment: string) => {
    if (currentUser && venue) {
      setReview(currentUser.uid, venue.name, rating, comment).then(() => {
        setRating(null);
        setComment('');
        refetchReviews();
      });
    }
  };

  useEffect(() => {
    if (venueName) {
      const a = async () => {
        const docRef = doc(firestore, 'venues', venueName);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVenue({ id: docSnap.id, ...(docSnap.data() as Venue) });
        } else {
          console.log('venue with name ... does not exist');
        }
      };

      a();
    }
  }, [venueName]);

  useEffect(() => {
    refetchReviews();
  }, [venue]);

  async function addArrayToImages(docRef: any, newImagesArray: any) {
    try {
      // Use arrayUnion to add each element of newImagesArray to the 'images' array
      await updateDoc(docRef, {
        images: arrayUnion(...newImagesArray), // Spread operator to add each item separately
      });
      console.log('Array added to images successfully!');
    } catch (error) {
      console.error('Error adding array to images:', error);
    }
  }

  return (
    <>
      {venue && (
        <div className="flex flex-col gap-3 pb-10 mt-10">
          <Modal
            open={openImagesModal}
            onClose={() => setOpenImagesModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="bg-white w-[600px] absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg p-5">
              <IconButton
                className="absolute right-1 top-1"
                onClick={() => setOpenImagesModal(false)}
              >
                <CloseIcon />
              </IconButton>
              <div className="text-lg font-bold text-center w-full">Images</div>
              <EditImages
                images={venue.images as string[]}
                venueId={venue.id!}
                onClose={() => setOpenImagesModal(false)}
              />
            </div>
          </Modal>
          <div>
            <div className="flex justify-between">
              <div className="font-bold font-sans text-2xl">{venue.name}</div>
              {currentUser?.uid === venue.userId && (
                <div className="flex gap-2">
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    //startIcon={<CloudUploadIcon />}
                  >
                    Upload Images
                    <VisuallyHiddenInput
                      type="file"
                      multiple
                      onChange={async (event: any) => {
                        const imageUrls = await uploadImages(event.target.files, venue.name);
                        const venueRef = doc(firestore, 'venues', venue.id!);
                        await addArrayToImages(venueRef, imageUrls);
                      }}
                    />
                  </Button>
                  <Button variant="contained" onClick={() => setOpenImagesModal(true)}>
                    Edit images
                  </Button>
                  <Button
                    variant="contained"
                    onClick={(event) => {
                      navigate(`/addVenue/${encodeURI(venue.id!)}`);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>
            <Location
              address={`${venue.address.freeformAddress}, ${venue.address.countrySubdivision}`}
            />
            <div className="mb-4">{venue.venueTypes.join(', ')}</div>
            <div className="flex gap-2 h-[530px] w-full  ">
              <div className="w-3/4">
                <ImageGallery images={venue.images as string[]}></ImageGallery>
              </div>
              <div className="grid grid-rows-2 gap-2 w-1/4 h-full">
                <RatingDisplay reviews={reviews} />
                <OwnerInfo />
              </div>
            </div>
          </div>
          <Divider />
          <PerksList perksList={venue.perks} />
          <div className="my-5">
            <PropertyDescription />
          </div>
          <Divider className="mb-5" />
          <div className="border border-solid border-black h-[530px] w-[855px] grid grid-cols-12 grid-rows-12 gap-1">
            <div className="border border-solid border-green-300 col-span-8 row-span-8"></div>
            <div className="border border-solid border-green-300 col-span-4 row-span-4"></div>
            <div className="border border-solid border-green-300 col-span-4 row-span-4"></div>
            <div className="border border-solid border-green-300 col-span-3 row-span-4"></div>
            <div className="border border-solid border-green-300 col-span-3 row-span-4"></div>
            <div className="border border-solid border-green-300 col-span-3 row-span-4"></div>
            <div className="border border-solid border-green-300 col-span-3 row-span-4"></div>
          </div>
          <div className="border border-solid border-black h-[530px] w-[855px] grid grid-cols-12 grid-rows-8 gap-1">
            <div className="border border-solid border-green-300 col-span-8 row-span-8"></div>
            <div className="border border-solid border-green-300 col-span-4 row-span-4"></div>
            <div className="border border-solid border-green-300 col-span-4 row-span-4"></div>
          </div>
          <div className="border border-solid border-black h-[530px] w-[855px] grid grid-cols-12 grid-rows-12 gap-1">
            <div className="border border-solid border-green-300 col-span-9 row-span-9"></div>
            <div className="border border-solid border-green-300 col-span-3 row-span-3"></div>
            <div className="border border-solid border-green-300 col-span-3 row-span-3"></div>
            <div className="border border-solid border-green-300 col-span-3 row-span-3"></div>
            <div className="border border-solid border-green-300 col-span-3 row-span-3"></div>
            <div className="border border-solid border-green-300 col-span-3 row-span-3"></div>
            <div className="border border-solid border-green-300 col-span-3 row-span-3"></div>
            <div className="border border-solid border-green-300 col-span-3 row-span-3"></div>
          </div>
          <div className="border border-solid border-black h-[530px] w-[855px] grid grid-cols-12 grid-rows-12 gap-1">
            <div className="border border-solid border-green-300 col-span-9 row-span-12"></div>
            <div className="border border-solid border-green-300 col-span-3 row-span-3"></div>
            <div className="border border-solid border-green-300 col-span-3 row-span-3"></div>
            <div className="border border-solid border-green-300 col-span-3 row-span-3"></div>
            <div className="border border-solid border-green-300 col-span-3 row-span-3"></div>
          </div>
          <WriteReviewSection
            rating={rating}
            comment={comment}
            onRatingChanged={(event: SyntheticEvent<Element, Event>, rating: number | null) =>
              setRating(rating)
            }
            onCommentChange={setComment}
            postReview={onFinishReviewClick}
          />
          <ReviewsSection reviews={reviews} />
        </div>
      )}
    </>
  );
};

interface OverviewPageProps {}

export default OverviewPage;
