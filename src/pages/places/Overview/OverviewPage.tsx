import {
  FC,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import Location from './Location';
import ImageGallery from './ImagesOverview/ImageGalery';
import RatingDisplay from './Rating/RatingDisplay';
import { Avatar, Button, Divider, IconButton, Modal, TextField } from '@mui/material';
import ReviewsSection from './Reviews/ReviewsSection';
import PerksList from './Perks/PerksList';
import PropertyDescription from './PropertyDescription/PropertyDescription';
import WriteReviewSection from './Reviews/WriteReviewSection';
import { firestore, storage } from '../../../firebase/firebase';
import { useNavigate, useParams } from 'react-router-dom';
import Venue from '../../../global/models/Venue';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import OwnerInfo from './Owner/OwnerInfo';
import { getVenueReviews, setReview } from '../../../firebase/services/ReviewsService';
import { useAuth } from '../../../contexts/authContext';
import Review from '../../../global/models/Review';
import CloseIcon from '@mui/icons-material/Close';
import { uploadImages } from '../../../firebase/queries/AddVenueQueries';
import styled from '@emotion/styled';
import EditImages from '../Venue/Images/EditImages';
import MapComponent from '../Venue/MapComponent';
import Chat from '../../users/chat/Chat';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { getUserById } from '../../../firebase/services/UserService';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { uniqueId } from 'lodash';
import clsx from 'clsx';
import { deleteObject, ref } from 'firebase/storage';
import { useTranslation } from 'react-i18next';
import OpenClosed from './OpenClosed';
import { createPortal } from 'react-dom';
import ChatBox from './ChatBox';

const OverviewPage: FC<OverviewPageProps> = () => {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [openImagesModal, setOpenImagesModal] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [owner, setOwner] = useState<DocumentData>();
  const [text, setText] = useState<string>('');
  const [messages, setMessages] = useState<
    { date: Date; id: string; senderId: string; text: string }[] | null
  >(null);

  const { t } = useTranslation();
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

  useEffect(() => {
    if (venue && currentUser) {
      const unSub = onSnapshot(
        doc(
          firestore,
          'messages',
          currentUser.uid > venue.userId
            ? currentUser.uid + venue.userId
            : venue.userId + currentUser.uid
        ),
        (doc) => {
          doc.exists() && setMessages(doc.data().messages);
        }
      );

      return () => {
        unSub();
      };
    }
  }, [venue, currentUser]);

  useEffect(() => {
    const fetchOwner = async () => {
      if (venue) {
        const user = await getUserById(venue.userId);
        setOwner(user);
      }
    };

    fetchOwner();
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

  const handleOpenChat = async () => {
    if (currentUser && venue) {
      const combinedId =
        currentUser.uid > venue.userId
          ? currentUser.uid + venue.userId
          : venue.userId + currentUser.uid;
      try {
        const messageRef = doc(firestore, 'messages', combinedId);
        const res = await getDoc(messageRef);

        if (!res.exists()) {
          await setDoc(doc(firestore, 'messages', combinedId), { messages: [] });
        }
      } catch (error) {}
    }
    // add userChats update logic here
  };

  const handleImagesSave = async (images: string[], imagesToDelete: string[]) => {
    if (venue) {
      try {
        const venueRef = doc(firestore, 'venues', venue.id!);

        imagesToDelete.map(async (image) => {
          const fileToDeleteRef = ref(storage, image);

          await updateDoc(venueRef, {
            images: arrayRemove(image),
          });

          await deleteObject(fileToDeleteRef)
            .then(() => {
              console.log('file deleted successfully');
            })
            .catch((err) => {
              console.log(err);
            });
        });

        const filteredImages = images.filter((image) => !imagesToDelete.includes(image));

        await updateDoc(venueRef, {
          images: filteredImages,
        });

        console.log('Images updated successfully');
      } catch (error) {
        console.error('Error updating images: ', error);
      }
    }
  };

  const handleSendMessage = async (text: string) => {
    if (currentUser && venue) {
      const combinedId =
        currentUser.uid > venue.userId
          ? currentUser.uid + venue.userId
          : venue.userId + currentUser.uid;

      const messageRes = await getDoc(doc(firestore, 'messages', combinedId));
      const senderUserChatsRes = await getDoc(doc(firestore, 'userChats', currentUser.uid));
      const receiverUserChatsRes = await getDoc(doc(firestore, 'userChats', venue.userId));

      if (!messageRes.exists()) {
        await setDoc(doc(firestore, 'messages', combinedId), { messages: [] });
      }

      if (!senderUserChatsRes.exists()) {
        await setDoc(doc(firestore, 'userChats', currentUser.uid), {
          chats: [
            {
              chatId: combinedId,
              userId: venue.userId,
              lastSenderId: currentUser.uid,
              lastMessage: text,
              date: Timestamp.now(),
            },
          ],
        });
      } else {
        await updateDoc(doc(firestore, 'userChats', currentUser.uid), {
          chats: arrayUnion({
            chatId: combinedId,
            userId: venue.userId,
            lastSenderId: currentUser.uid,
            lastMessage: text,
            date: Timestamp.now(),
          }),
        });
      }

      if (!receiverUserChatsRes.exists()) {
        await setDoc(doc(firestore, 'userChats', venue.userId), {
          chats: [
            {
              chatId: combinedId,
              userId: currentUser.uid,
              lastSenderId: currentUser.uid,
              lastMessage: text,
              date: Timestamp.now(),
            },
          ],
        });
      } else {
        await updateDoc(doc(firestore, 'userChats', venue.userId), {
          chats: arrayUnion({
            chatId: combinedId,
            userId: currentUser.uid,
            lastSenderId: currentUser.uid,
            lastMessage: text,
            date: Timestamp.now(),
          }),
        });
      }

      await updateDoc(doc(firestore, 'messages', combinedId), {
        messages: arrayUnion({
          id: uniqueId(),
          text,
          senderId: currentUser!.uid,
          date: Timestamp.now(),
        }),
      });
    }
  };

  return (
    <div className="bg-white backdrop-blur-md bg-opacity-50 shadow-lg shadow-gray-700 p-4 relative">
      <ChatBox
        isOpen={isChatOpen}
        messages={messages}
        onOpen={() => {
          handleOpenChat();
          setIsChatOpen(true);
        }}
        onClose={() => setIsChatOpen(false)}
        sendMessage={handleSendMessage}
      />
      {venue && (
        <div className="flex flex-col gap-3 pb-10">
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
                onSave={handleImagesSave}
                venueId={venue.id!}
                onClose={() => setOpenImagesModal(false)}
              />
            </div>
          </Modal>
          <div>
            <div className="flex justify-between">
              <div className="font-extrabold font-sans text-6xl rounded-lg p-2 text-sky-950 ">
                {venue.name}
              </div>
            </div>
            <Location
              className="bg-[#F3F7EC] w-fit pr-3 my-2 rounded-full"
              city={venue.city}
              street={venue.street}
            />
            <div className="mb-4 bg-white rounded-md w-fit px-2">
              {venue.venueTypes.map((venueType) => t(venueType)).join(', ')}
            </div>
            <div className="grid grid-cols-4 gap-2 h-full w-full">
              <div className="col-span-3 bg-black bg-opacity-50">
                <ImageGallery images={venue.images as string[]}></ImageGallery>
              </div>
              <div className="col-span-1 flex flex-col gap-2">
                {/* <RatingDisplay reviews={reviews} /> */}

                {currentUser?.uid === venue.userId ? (
                  <div className="flex flex-col gap-2 flex-grow">
                    <Button
                      className="text-white font-bold bg-black bg-opacity-60"
                      variant="outlined"
                      color="secondary"
                      onClick={(event) => {
                        navigate(`/addVenue/${encodeURI(venue.id!)}`);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      className="text-white font-bold bg-black bg-opacity-60"
                      variant="outlined"
                      color="secondary"
                      component="label"
                      role={undefined}
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
                    <Button
                      className="text-white font-bold bg-black bg-opacity-60"
                      variant="outlined"
                      color="secondary"
                      onClick={() => setOpenImagesModal(true)}
                    >
                      Edit images
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1">
                    <OwnerInfo
                      onChatOpen={() => {
                        handleOpenChat();
                        setIsChatOpen(true);
                      }}
                    />
                  </div>
                )}
                <MapComponent
                  lat={venue.coordinates[0]}
                  lng={venue.coordinates[1]}
                  setCoordinates={() => {}}
                  draggable={false}
                  height={currentUser?.uid === venue.userId ? 350 : 250}
                />
              </div>
            </div>
          </div>
          <Divider />
          <PerksList perksList={venue.perks} />
          <div className="my-5 flex flex-col gap-2 bg-white p-3">
            <div className="text-lg font-bold">
              About <span className="text-sky-900">{venue.name}</span>
            </div>
            <Divider className="bg-[#006989]" />
            <PropertyDescription />
          </div>
          <Divider className="mb-5" />
          {currentUser && venue.userId !== currentUser.uid && (
            <WriteReviewSection
              rating={rating}
              comment={comment}
              onRatingChanged={(event: SyntheticEvent<Element, Event>, rating: number | null) =>
                setRating(rating)
              }
              onCommentChange={setComment}
              postReview={onFinishReviewClick}
            />
          )}
          <Divider />
          <ReviewsSection reviews={reviews} />
        </div>
      )}
    </div>
  );
};

interface OverviewPageProps {}

export default OverviewPage;
