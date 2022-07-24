import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Logo from '../assets/logo.svg'
import { ChatState } from '../Context/ChatProvider'
import axios from 'axios'
import ChatLoading from './ChatLoading'
import { useToast } from '@chakra-ui/toast'
import { allUsersRoute, fetchAllChatsRoute } from '../utils/APIRoutes'
import GroupChatModal from './miscellaneous/GroupChatModal'

export default function Contacts({ fetchAgain, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined)
  const [currentUserImage, setCurrentUserImage] = useState(undefined)
  const [currentSelected, setCurrentSelected] = useState(undefined)
  const { selectedChat, setSelectedChat, currentUser, chats, setChats } =
    ChatState()
  const toast = useToast()

  const fetchChats = async () => {
    try {
      // const config = {
      //   headers: {
      //     // Authorization: `Bearer ${currentUser.token}`,
      //   },
      // }
      const user = await JSON.parse(localStorage.getItem('chat-app-user'))
      //console.log(user)
      const { data } = await axios.get(fetchAllChatsRoute, {
        params: { user: { _id: currentUser._id } },
      })
      console.log(data)
      setChats(data)
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      })
    }
  }

  useEffect(() => {
    fetchChats()
  }, [fetchAgain])

  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.username)
      setCurrentUserImage(currentUser.avatarImage)
    }
  }, [])
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index)
    changeChat(contact)
  }

  const getSender = (currUser, users) => {
    //console.log(users[0]._id === currUser._id ? users[1] : users[0])
    return users[0]._id === currUser._id ? users[1] : users[0]
  }

  // const getAvatarImage = (userId) => {
  //   await axios.get(allUsersRoute, {
  //   params: { user: { _id: userId } },
  // })

  return (
    <>
      {currentUserName && currentUserImage && (
        <Container>
          <div className='brand'>
            <h3>NUSCourseChat</h3>
          </div>

          <div className='contacts'>
            {chats ? (
              chats.map((contact, index) => {
                //console.log(chats)
                //console.log(contact)
                return (
                  <div
                    key={index}
                    className={`contact ${
                      index === currentSelected ? 'selected' : ''
                    }`}
                    onClick={() => changeCurrentChat(index, contact)}
                  >
                    {!contact.isGroupChat ? (
                      <>
                        <div className='avatar'>
                          <img
                            src={`data:image/svg+xml;base64,${
                              getSender(currentUser, contact.users).avatarImage
                            }`}
                            // src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                            alt='avatar'
                          />
                        </div>
                        <div className='username'>
                          <h3>
                            {getSender(currentUser, contact.users).username}
                          </h3>
                        </div>
                      </>
                    ) : (
                      <div className='username'>
                        <h3>{contact.chatName}</h3>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <ChatLoading />
            )}
          </div>

          <div className='current-user'>
            <div className='avatar'>
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt='avatar'
              />
            </div>
            <div className='username'>
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  )
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff39;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
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
    .selected {
      background-color: #9a86f3;
    }
  }
  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
  .create-group {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`
