import { FC, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import Location from './Location';
import ImageGallery from './ImagesOverview/ImageGalery';
import { Divider } from '@mui/material';
import ReviewsSection from './Reviews/ReviewsSection';
import PerksList from './Perks/PerksList';
import WriteReviewSection from './Reviews/WriteReviewSection';
import { firestore, storage } from '../../../firebase/firebase';
import { useNavigate, useParams } from 'react-router-dom';
import Venue from '../../../global/models/Venue';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { getVenueReviews, setReview } from '../../../firebase/services/ReviewsService';
import { useAuth } from '../../../contexts/authContext';
import Review from '../../../global/models/Review';
import { uploadImages } from '../../../firebase/queries/AddVenueQueries';
import MapComponent from '../Venue/MapComponent';
import { getUserById } from '../../../firebase/services/UserService';
import { uniqueId } from 'lodash';
import { deleteObject, ref } from 'firebase/storage';
import { useTranslation } from 'react-i18next';
import ChatBox from './ChatBox';
import UserDetails from '../../../global/models/users/UserDetails';
import OwnerControls from './OwnerControls';
import EditImagesModal from './EditImagesModal';
import OwnerInfo from './Owner/OwnerInfo';
import UserChat from '../../../global/models/messages/UserChat';
import {
  appendMessages,
  appendUserChat,
  createMessage,
  createUserChat,
  removeUserChat,
  updateUserChat,
} from '../../../firebase/services/MessagesService';
import Message from '../../../global/models/messages/Message';
import { getVenueById } from '../../../firebase/services/VenuesService';

const OverviewPage: FC<OverviewPageProps> = () => {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [openImagesModal, setOpenImagesModal] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [venueOwner, setVenueOwner] = useState<UserDetails>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);

  const { t } = useTranslation();
  const { currentUser, currentUserDetails } = useAuth();
  const { venueId } = useParams();

  useEffect(() => {
    if (venueId) {
      const fetchVenue = async () => {
        const venue = await getVenueById(venueId);
        setVenue(venue);
      };

      fetchVenue();
      refetchReviews();
    }
  }, [venueId]);

  useEffect(() => {
    const checkDocumentExists = async () => {
      if (currentUser && venue) {
        const docRef = doc(firestore, 'reviews', `${venue.id}_${currentUser.uid}`);
        const docSnap = await getDoc(docRef);
        setHasReviewed(docSnap.exists());
      } else {
        setHasReviewed(false);
      }
    };

    checkDocumentExists();
  }, [currentUser, venue, firestore]);

  const refetchReviews = useCallback(async () => {
    let reviews: Review[] = [];
    if (venueId) {
      reviews = await getVenueReviews(venueId);
    }
    setReviews(reviews);
  }, [venueId]);

  const onFinishReviewClick = (rating: number, comment: string) => {
    if (currentUser && venueId) {
      setReview(currentUser.uid, venueId, rating, comment).then(() => {
        setRating(null);
        setComment('');
        refetchReviews();
      });
    }
  };

  useEffect(() => {
    if (venueOwner && currentUserDetails) {
      const unSub = onSnapshot(
        doc(
          firestore,
          'messages',
          currentUserDetails.id > venueOwner.id
            ? currentUserDetails.id + venueOwner.id
            : venueOwner.id + currentUserDetails.id
        ),
        (doc) => {
          doc.exists() && setMessages(doc.data().messages);
        }
      );

      return () => {
        unSub();
      };
    }
  }, [venueOwner, currentUserDetails]);

  useEffect(() => {
    const fetchOwner = async () => {
      if (venue) {
        const user = (await getUserById(venue.userId)) as UserDetails;
        setVenueOwner(user);
      }
    };

    fetchOwner();
  }, [venue]);

  async function addArrayToImages(files: FileList) {
    if (venueId) {
      try {
        const imageUrls = await uploadImages(files, venueId);
        const venueRef = doc(firestore, 'venues', venueId);
        // Use arrayUnion to add each element of newImagesArray to the 'images' array
        imageUrls &&
          (await updateDoc(venueRef, {
            images: arrayUnion(...imageUrls), // Spread operator to add each item separately
          }));
        console.log('Array added to images successfully!');
      } catch (error) {
        console.error('Error adding array to images:', error);
      }
    }
  }

  const handleImagesSave = async (images: string[], imagesToDelete: string[]) => {
    if (venueId) {
      try {
        const venueRef = doc(firestore, 'venues', venueId);

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

  const handleSendMessage = async (text: string, sender: UserDetails, receiver: UserDetails) => {
    const combinedId = sender.id > receiver.id ? sender.id + receiver.id : receiver.id + sender.id;

    const chatPair = await getDoc(doc(firestore, 'messages', combinedId));
    const senderUserChatsRes = await getDoc(doc(firestore, 'userChats', sender.id));
    const receiverUserChatsRes = await getDoc(doc(firestore, 'userChats', receiver.id));

    const senderChat: UserChat = {
      chatId: combinedId,
      userId: receiver.id,
      lastSenderId: sender.id,
      lastMessage: text,
      date: Timestamp.now(),
    };

    const receiverChat: UserChat = {
      chatId: combinedId,
      userId: sender.id,
      lastSenderId: sender.id,
      lastMessage: text,
      date: Timestamp.now(),
    };

    if (!senderUserChatsRes.exists()) {
      await createUserChat(sender.id, senderChat);
    } else {
      if (senderUserChatsRes.data().chats.find((c: UserChat) => c.chatId === combinedId)) {
        const chats = senderUserChatsRes.data().chats || [];

        const updatedChats = chats.map((chat: UserChat) =>
          chat.chatId === combinedId ? { ...chat, ...receiverChat } : chat
        );

        await updateUserChat(sender.id, updatedChats);
      } else {
        await appendUserChat(sender.id, senderChat);
      }
    }

    if (!receiverUserChatsRes.exists()) {
      await createUserChat(receiver.id, receiverChat);
    } else {
      if (receiverUserChatsRes.data().chats.find((c: any) => c.chatId === combinedId)) {
        const chats = receiverUserChatsRes.data().chats || [];

        const updatedChats = chats.map((chat: UserChat) =>
          chat.chatId === combinedId ? { ...chat, ...receiverChat } : chat
        );

        await updateUserChat(receiver.id, updatedChats);
      } else {
        await appendUserChat(receiver.id, receiverChat);
      }
    }

    if (!chatPair.exists()) {
      await createMessage(combinedId, sender.id, text);
    } else {
      await appendMessages(combinedId, sender.id, text);
    }
  };

  if (venue === null || venueId === undefined) return <></>;

  return (
    <div className="bg-white backdrop-blur-md bg-opacity-50 shadow-lg shadow-gray-700 p-4 relative">
      <EditImagesModal
        images={venue.images}
        venueId={venueId}
        open={openImagesModal}
        onClose={() => setOpenImagesModal(false)}
        onSave={(images: string[], imagesToDelete: string[]) =>
          handleImagesSave(images, imagesToDelete)
        }
      />

      {currentUserDetails && venueOwner && (
        <ChatBox
          isOpen={isChatOpen}
          senderUser={currentUserDetails}
          receiverUser={venueOwner}
          messages={messages}
          onOpen={() => setIsChatOpen(true)}
          onClose={() => setIsChatOpen(false)}
          onMessageSent={handleSendMessage}
        />
      )}

      <div className="flex flex-col gap-3 pb-10">
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
              {venue.userId === currentUser?.uid && (
                <OwnerControls
                  images={venue.images}
                  open={openImagesModal}
                  venueId={venueId}
                  onClose={() => setOpenImagesModal(false)}
                  onOpen={() => setOpenImagesModal(true)}
                  onSave={(images: string[], imagesToDelete: string[]) =>
                    handleImagesSave(images, imagesToDelete)
                  }
                  onImagesAdded={addArrayToImages}
                />
              )}
              {venueOwner && venue.userId !== currentUser?.uid && (
                <div className="flex-1">
                  <OwnerInfo owner={venueOwner} onChatOpen={() => setIsChatOpen(true)} />
                </div>
              )}
              {/* <RatingDisplay reviews={reviews} /> */}

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
        {venue.description && (
          <div className="my-5 flex flex-col gap-2 bg-white p-3">
            <div className="text-lg font-bold">
              About <span className="text-sky-900">{venue.name}</span>
            </div>
            <Divider className="bg-[#006989]" />
            <div>{venue.description}</div>
          </div>
        )}
        <Divider className="mb-5" />
        {currentUser && venue.userId !== currentUser.uid && hasReviewed && (
          <>
            <WriteReviewSection
              rating={rating}
              comment={comment}
              onRatingChanged={(event: SyntheticEvent<Element, Event>, rating: number | null) =>
                setRating(rating)
              }
              onCommentChange={setComment}
              postReview={onFinishReviewClick}
            />
            <Divider />
          </>
        )}

        <ReviewsSection reviews={reviews} />
      </div>
    </div>
  );
};

interface OverviewPageProps {}

export default OverviewPage;
