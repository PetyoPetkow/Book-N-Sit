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
          console.log(doc.data(), 'asdasdas');
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

  const handleSendMessage = async () => {
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
    <div className="backdrop-blur-md bg-black bg-opacity-50 rounded-lg p-10 mt-10">
      <div className="fixed bottom-6 right-20 max-w-full " style={{ zIndex: 9999 }}>
        {isChatOpen ? (
          <div className="w-80 h-[400px] rounded-lg border border-solid border-gray-200 shadow-lg flex flex-col">
            <div
              className="h-12 bg-[#4F709C] text-white text-lg flex items-center justify-center relative rounded-t-lg rounded-x-lg"
              onClick={() => {
                setIsChatOpen(!isChatOpen);
              }}
            >
              <ChatOutlinedIcon className="absolute left-0 ml-3" />
              <span className="absolute left-1/2 transform -translate-x-1/2">
                {owner?.username}
              </span>
              <IconButton
                className="absolute right-0 mr-2"
                onClick={() => {
                  setIsChatOpen(!isChatOpen);
                }}
              >
                {isChatOpen && <RemoveIcon className="text-white" />}
              </IconButton>
            </div>
            <div className="flex-1 p-2 overflow-auto justify-end bg-white">
              {messages === null ? (
                <div>There are still no messages.</div>
              ) : (
                messages.map((m) => (
                  <div
                    className={clsx(
                      'flex gap-5 items-end',
                      m.senderId === currentUser?.uid
                        ? 'justify-start mr-20 '
                        : 'justify-end ml-20 '
                    )}
                  >
                    <Avatar
                      className={clsx(
                        m.senderId === currentUser?.uid
                          ? 'order-first left-0'
                          : 'order-last right-0'
                      )}
                    />
                    <div
                      className={clsx(
                        m.senderId === currentUser?.uid
                          ? 'bg-blue-200 rounded-br-xl'
                          : 'bg-red-200 rounded-bl-xl',
                        'p-2 rounded-t-xl'
                      )}
                    >
                      {m.text}
                    </div>
                  </div>
                ))
              )}
            </div>
            <Divider />
            <div className="p-2 h-fit flex items-center gap-2 bg-white">
              <TextField
                className="flex-1"
                InputProps={{
                  disableUnderline: true,
                }}
                variant="standard"
                multiline
                maxRows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <IconButton className="aspect-square" onClick={handleSendMessage}>
                <SendOutlinedIcon />
              </IconButton>
            </div>
          </div>
        ) : (
          <div
            className="h-12 w-12 rounded-full rounded-bl-none bg-[#A2D5F2] text-white font-bold flex items-center justify-center relative"
            onClick={() => {
              setIsChatOpen(!isChatOpen);
              handleOpenChat();
            }}
          >
            <ChatOutlinedIcon />
          </div>
        )}
      </div>

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
              <div className="font-extrabold font-sans text-4xl rounded-lg p-2 text-white  underline decoration-white ">
                {venue.name}
              </div>
              {currentUser?.uid === venue.userId && (
                <div className="flex gap-2 h-10">
                  <Button
                    className="bg-white "
                    component="label"
                    role={undefined}
                    variant="outlined"
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
                    className="bg-white"
                    variant="outlined"
                    onClick={() => setOpenImagesModal(true)}
                  >
                    Edit images
                  </Button>
                  <Button
                    className="bg-white"
                    variant="outlined"
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
              className="bg-[#F3F7EC] w-fit pr-3 my-2 py-0 rounded-full"
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
                <div className="flex-1">
                  <OwnerInfo />
                </div>

                <MapComponent
                  lat={venue.coordinates[0]}
                  lng={venue.coordinates[1]}
                  setCoordinates={() => {}}
                  draggable={false}
                  height={250}
                />
              </div>
            </div>
          </div>
          <Divider />
          <PerksList perksList={venue.perks} />
          <div className="my-5 bg-white p-3 rounded-md">
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
          <ReviewsSection reviews={reviews} />
        </div>
      )}
    </div>
  );
};

interface OverviewPageProps {}

export default OverviewPage;
