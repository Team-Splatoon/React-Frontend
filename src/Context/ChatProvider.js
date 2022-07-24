import { useState, useEffect, useContext, createContext } from 'react'
import { useNavigate } from 'react-router'

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState()
  const [selectedChat, setSelectedChat] = useState()
  const [chats, setChats] = useState([])
  const [notification, setNotification] = useState([])
  return (
    <ChatContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const ChatState = () => {
  return useContext(ChatContext)
}

export default ChatProvider
