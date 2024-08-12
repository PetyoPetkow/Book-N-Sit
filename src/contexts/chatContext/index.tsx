import { createContext, useContext, useReducer } from 'react';
import { useAuth } from '../authContext';
//@ts-ignore
export const ChatContext = createContext();
//@ts-ignore
export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const INITIAL_STATE = {
    chatId: 'null',
    user: {},
  };
  //@ts-ignore
  const chatReducer = (state, action) => {
    switch (action.type) {
      case 'CHANGE_USER':
        return {
          user: action.payload,
          chatId:
            currentUser!.uid > action.payload.uid
              ? currentUser!.uid + action.payload.uid
              : action.payload.uid + currentUser!.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return <ChatContext.Provider value={{ data: state, dispatch }}>{children}</ChatContext.Provider>;
};
