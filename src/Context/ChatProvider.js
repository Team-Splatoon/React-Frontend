import { useState, useContext, createContext } from 'react'

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState()
  const [selectedChat, setSelectedChat] = useState()
  const [chats, setChats] = useState([])
  const [currGroupNameList, setCurrGroupNameList] = useState([])
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
        currGroupNameList,
        setCurrGroupNameList,
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
