import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { io } from 'socket.io-client'
import Logout from './Logout'
import ChatInput from './ChatInput'
import axios from 'axios'
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes'
import { v4 as uuidv4 } from 'uuid'
import { ChatState } from '../Context/ChatProvider'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'

export default function ChatContainer({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([])
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const scrollRef = useRef()
  const { currentUser, setCurrentUser, selectedChat, setSelectedChat } =
    ChatState()

  const ENDPOINT = "http://localhost:4000"
  const socket = io(ENDPOINT)

  // const user = JSON.parse(localStorage.getItem('chat-app-user'))
  // setCurrentUser(user)

  useEffect(() => {
    async function getCurrent() {
      console.log(socket)
      if (selectedChat && currentUser) {
        console.log(selectedChat)
        console.log(currentUser)
        const { data } = await axios.post(getAllMessagesRoute, {
          from: currentUser._id,
          to: selectedChat._id,
        })
        setMessages(data)
        socket.emit("join chat", selectedChat._id)
        //console.log(data)
      }
      //console.log(selectedChat, currentUser)
    }
    getCurrent()
  }, [selectedChat, arrivalMessage, currentUser])

  useEffect(() => {
    if (currentUser) {
      socket.emit("setup", currentUser);
      // socket.on("connected", () => setSocketConnected(true));
      console.log(socket)
    }
  }, [currentUser]);

  const handleSendMsg = async (msg) => {
    //console.log(getSender(currentUser, selectedChat.users)._id)
    console.log(socket)
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: selectedChat._id,
      message: msg,
      time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      chat: selectedChat,
    })
    socket.emit("send-msg", {
      to: selectedChat._id,
      from: currentUser._id,
      message: msg,
      time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      chat: selectedChat,
    })

    const msgs = [...messages]
    msgs.push({ fromSelf: true, message: msg, time: msg.time})
    setMessages(msgs)
  }

  useEffect(() => {
    if (socket) {
      socket.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg, time: msg.time })
      })
    }
  }, [])

  useEffect(() => {
    // console.log(arrivalMessage)
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
  }, [arrivalMessage])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: 'smooth' })
  }, [messages])

  const getSender = (currUser, users) => {
    return users[0]._id === currUser._id ? users[1] : users[0]
  }

  return (
    <>
      {selectedChat &&
        (!selectedChat.isGroupChat ? (
          <Container>
            <div className='chat-header'>
              <div className='user-details'>
                <div className='avatar'>
                  <img
                    src={`data:image/svg+xml;base64,${
                      getSender(currentUser, selectedChat.users).avatarImage
                    }`}
                    alt='avatar'
                  />
                </div>
                <div className='username'>
                  <h3>{getSender(currentUser, selectedChat.users).username}</h3>
                </div>
              </div>
              <Logout />
            </div>
            <div className='chat-messages'>
              {messages.map((message) => {
                return (
                  <div ref={scrollRef} key={uuidv4()}>
                    <div
                      className={`message ${
                        message.fromSelf ? 'sended' : 'received'
                      }`}
                    >
                      <div className='content'>
                        <p>{message.message}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
          </Container>
        ) : (
          <Container>
            {/* {
              <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
              />
            } */}
            <div className='chat-header'>
              <div className='user-details'>
                <div className='username'>
                  <h3>{selectedChat.chatName.toUpperCase()}</h3>
                </div>
              </div>
              <Logout />
            </div>
            <div className='chat-messages'>
              {messages.map((message) => {
                return (
                  <div ref={scrollRef} key={uuidv4()}>
                    <div
                      className={`message ${
                        message.fromSelf ? 'sended' : 'received'
                      }`}
                    >
                      <div className='content'>
                        <p>{message.message}</p>
                      </div>
                      <div className="message-meta">
                        <p id="time">{message.time}</p>
                        <p id="author">{message.from}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
          </Container>
        ))}
    </>
  )
}

const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 0.5rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4d04ff21;
      }
      .message-meta {
         justify-content: flex-end;
         margin-left: 5px;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
      .message-meta {
        justify-content: flex-start;
        margin-right: 5px;
      }
    }
  }
`
