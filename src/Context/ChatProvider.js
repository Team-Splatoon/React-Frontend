import { useState, useEffect, useContext, createContext } from 'react'
import { useNavigate } from 'react-router'

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined)
  return (
    <ChatContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </ChatContext.Provider>
  )
}

export const ChatState = () => {
  return useContext(ChatContext)
}

export default ChatProvider
