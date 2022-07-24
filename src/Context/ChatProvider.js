import { useState, useEffect, useContext, createContext } from 'react'
import { useNavigate } from 'react-router'

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState()
  const [selectedChat, setSelectedChat] = useState()
  const [chats, setChats] = useState([])
  const [currGroupNameList, setCurrGroupNameList] = useState([])
  const [currGroupChatList, setCurrGroupChatList] = useState([])

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
        currGroupChatList,
        setCurrGroupChatList,
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
