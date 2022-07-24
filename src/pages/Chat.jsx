import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { allUsersRoute, host } from '../utils/APIRoutes'
import Contacts from '../components/Contacts'
import Welcome from '../components/Welcome'
import ChatContainer from '../components/ChatContainer'
import { io } from 'socket.io-client'
import SideDrawer from '../components/miscellaneous/SideDrawer'
import { Box } from '@chakra-ui/layout'
import { ChatState } from '../Context/ChatProvider'

function Chat() {
  //const socket = useRef()
  const ENDPOINT = "http://localhost:4000"
  const socket = io(ENDPOINT)
  const navigate = useNavigate()
  const { currentUser, setCurrentUser, selectedChat, setSelectedChat } =
    ChatState()
  const [isLoaded, setIsLoaded] = useState(false)
  const [fetchAgain, setFetchAgain] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    async function userCheck() {
      if (!localStorage.getItem('chat-app-user')) {
        navigate('/login')
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem('chat-app-user')))
        setIsLoaded(true)
      }
    }
    userCheck()
  }, [])

  // useEffect(() => {
  //   if (currentUser) {
  //     socket.current = io(host)
  //     socket.current.emit('setup', currentUser)
  //   }
  // }, [currentUser])

  // useEffect(() => {
  //   if (currentUser) {
  //     //socket = io(ENDPOINT);
  //     socket.emit("setup", currentUser);
  //     socket.on("connected", () => setSocketConnected(true));
  //     console.log(socket)
  //   }
  // }, [currentUser]);

  useEffect(() => {
    async function imageCheck() {
      if (!JSON.parse(localStorage.getItem('chat-app-user')).isAvatarImageSet) {
        navigate('/setavatar')
      }
      //console.log(currentUser)
      //console.log(JSON.parse(localStorage.getItem('chat-app-user')))
    }
    imageCheck()
  }, [currentUser])

  const handleChatChange = (chat) => {
    setSelectedChat(chat)
  }

  return (
    <>
      <Container>
        {isLoaded && <SideDrawer />}
        <div className='container'>
          {isLoaded && (
            <Contacts fetchAgain={fetchAgain} changeChat={handleChatChange} />
          )}
          {isLoaded && selectedChat === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              //socket={socket}
            />
          )}
        </div>
      </Container>
    </>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`

export default Chat
