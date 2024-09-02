import { FC, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Location from './Location';
import ImageGallery from './ImageGalery';
import { Divider, LinearProgress, Rating } from '@mui/material';
import ReviewsSection from './ReviewsSection';
import PerksList from './PerksList';
import WriteReviewSection from './WriteReviewSection';
import { firestore } from '../../firebase/firebase';
import { useParams } from 'react-router-dom';
import Venue from '../../models/Venue';
import { doc, getDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { getVenueReviews, setReview } from '../../firebase/services/ReviewsService';
import { useAuth } from '../../contexts/authContext';
import UserReview from '../../models/UserReview';
import MapComponent from '../venue/MapComponent';
import { getUserById } from '../../firebase/services/UserService';
import { useTranslation } from 'react-i18next';
import ChatBox from './ChatBox';
import UserDetails from '../../models/UserDetails';
import OwnerControls from './OwnerControls';
import EditImagesModal from './EditImagesModal';
import OwnerInfo from './OwnerInfo';
import UserChat from '../../models/UserChat';
import {
  appendMessages,
  appendUserChat,
  createMessage,
  createUserChat,
  getMessages,
  getUserChats,
  updateUserChat,
} from '../../firebase/services/MessagesService';
import Message from '../../models/Message';
import {
  appendImages,
  deleteImagesFromStorage,
  removeImages,
  subscribeToVenue,
  updateVenueImages,
  uploadImagesToStorage,
} from '../../firebase/services/VenuesService';
import _ from 'lodash';
import { bg } from 'date-fns/locale/bg';
import { enGB } from 'date-fns/locale/en-GB';

const OverviewPage: FC<OverviewPageProps> = () => {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [openImagesModal, setOpenImagesModal] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [venueOwner, setVenueOwner] = useState<UserDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);

  const { t } = useTranslation();
  const { currentUser, currentUserDetails } = useAuth();
  const { venueId } = useParams();

  const averageRating = useMemo(() => {
    return reviews.length > 0 ? _.meanBy(reviews, 'rating') : null;
  }, [reviews]);

  const userLocale = useMemo(() => {
    return currentUserDetails?.language === 'en' ? enGB : bg;
  }, [currentUserDetails]);

  useEffect(() => {
    if (venueId !== undefined) {
      const unSub = subscribeToVenue(venueId, setVenue);

      return () => {
        unSub();
      };
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
    let reviews: UserReview[] = [];
    if (venueId) {
      reviews = await getVenueReviews(venueId);
    }
    setReviews(reviews);
  }, [venueId]);

  useEffect(() => {
    refetchReviews();
  }, [refetchReviews]);

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
        const user = await getUserById(venue.userId);
        setVenueOwner(user);
      }
    };

    fetchOwner();
  }, [venue]);

  const handleUploadImages = async (files: File[]) => {
    if (venueId) {
      try {
        const imageUrls = await uploadImagesToStorage(files, venueId);
        await appendImages(venueId, imageUrls);
        console.log('Array added to images successfully!');
      } catch (error) {
        console.error('Error adding array to images:', error);
      }
    }
  };

  const handleImagesUpdate = async (images: string[], imagesToDelete: string[]) => {
    if (venueId) {
      try {
        const filteredImages = images.filter((image) => !imagesToDelete.includes(image));

        await removeImages(venueId, imagesToDelete);
        await updateVenueImages(venueId, filteredImages);
        await deleteImagesFromStorage(imagesToDelete);
        console.log('Images updated successfully');
      } catch (error) {
        console.error('Error updating images: ', error);
      }
    }
  };

  const handleSendMessage = async (text: string, sender: UserDetails, receiver: UserDetails) => {
    const combinedId = sender.id > receiver.id ? sender.id + receiver.id : receiver.id + sender.id;

    const messages = await getMessages(combinedId);
    const senderUserChats = await getUserChats(sender.id);
    const receiverUserChats = await getUserChats(receiver.id);

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

    if (senderUserChats === null) {
      await createUserChat(sender.id, senderChat);
    } else {
      if (senderUserChats.find((chat: UserChat) => chat.chatId === combinedId)) {
        const updatedChats = senderUserChats.map((chat: UserChat) =>
          chat.chatId === combinedId ? { ...chat, ...receiverChat } : chat
        );

        await updateUserChat(sender.id, updatedChats);
      } else {
        await appendUserChat(sender.id, senderChat);
      }
    }

    if (receiverUserChats === null) {
      await createUserChat(receiver.id, receiverChat);
    } else {
      if (receiverUserChats.find((chat: UserChat) => chat.chatId === combinedId)) {
        const updatedChats = receiverUserChats.map((chat: UserChat) =>
          chat.chatId === combinedId ? { ...chat, ...receiverChat } : chat
        );

        await updateUserChat(receiver.id, updatedChats);
      } else {
        await appendUserChat(receiver.id, receiverChat);
      }
    }

    if (messages === null) {
      await createMessage(combinedId, sender.id, text);
    } else {
      await appendMessages(combinedId, sender.id, text);
    }
  };

  if (venue === null || venueId === undefined) return <LinearProgress />;

  return (
    <div className="bg-white backdrop-blur-md bg-opacity-50 shadow-lg shadow-gray-700 p-4 relative">
      <EditImagesModal
        images={venue.images}
        open={openImagesModal}
        onClose={() => setOpenImagesModal(false)}
        onSave={(images: string[], imagesToDelete: string[]) =>
          handleImagesUpdate(images, imagesToDelete)
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
          locale={userLocale}
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
          <div className="mb-4 bg-white rounded-md w-fit px-2 border border-solid border-gray-400">
            {venue.venueTypes.map((venueType) => t(venueType)).join(', ')}
          </div>
          {typeof averageRating === 'number' && <Rating value={averageRating} readOnly />}
          <div className="flex max-xl:flex-col gap-2 h-full w-full">
            <ImageGallery images={venue.images as string[]} />
            <div className="flex flex-col max-xl:flex-row max-sm:flex-col gap-2 min-w-72">
              {venue.userId === currentUser?.uid && (
                <OwnerControls
                  venueId={venueId}
                  onOpen={() => setOpenImagesModal(true)}
                  onImagesAdded={handleUploadImages}
                />
              )}
              {venueOwner && venue.userId !== currentUser?.uid && (
                <div className="flex-1">
                  <OwnerInfo owner={venueOwner} onChatOpen={() => setIsChatOpen(true)} />
                </div>
              )}

              <div className="flex-1">
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
        </div>
        <Divider />
        <PerksList perksList={venue.perks} />
        {venue.description && (
          <div className="my-5 flex flex-col gap-2 bg-white p-3">
            <div className="text-lg font-bold">
              {t('about')} <span className="text-sky-900">{venue.name}</span>
            </div>
            <Divider className="bg-[#006989]" />
            <div>{venue.description}</div>
          </div>
        )}
        <Divider className="mb-5" />
        {currentUser && venue.userId !== currentUser.uid && !hasReviewed && (
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
