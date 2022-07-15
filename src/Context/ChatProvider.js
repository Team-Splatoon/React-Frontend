import { useState, useEffect, useContext, createContext } from 'react'
import { useNavigate } from 'react-router'

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(undefined)
  const navigate = useNavigate()

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('chat-app-user'))
    setUser(userInfo)

    if (!userInfo) {
      navigate('/login')
    }
  }, [])

  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  )
}

export const ChatState = () => {
  return useContext(ChatContext)
}

export default ChatProvider
