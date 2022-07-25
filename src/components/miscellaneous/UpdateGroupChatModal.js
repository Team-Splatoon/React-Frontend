import { ViewIcon } from '@chakra-ui/icons'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import UserListItem from '../UserAvatar/UserListItem'
import {
  renameGroupChatRoute,
  addpplGroupChatRoute,
  removepplGroupChatRoute,
  allUsersRoute,
} from '../../utils/APIRoutes'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState('')
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameloading, setRenameLoading] = useState(false)
  const toast = useToast()
  const [updateAgain, setUpdateAgain] = useState(false)
  const { selectedChat, setSelectedChat, currentUser } = ChatState()

  const handleSearch = async (query) => {
    setSearch(query)
    if (!query) {
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.get(`${allUsersRoute}?search=${search}`, {
        params: { user: { _id: currentUser._id } },
      })
      setLoading(false)
      setSearchResult(data)
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      })
    }
  }

  const handleRename = async () => {
    if (!groupChatName) return

    try {
      setRenameLoading(true)

      const { data } = await axios.put(renameGroupChatRoute, {
        chatId: selectedChat._id,
        chatName: groupChatName.toUpperCase(),
      })
      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameLoading(false)
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      setRenameLoading(false)
    }
    setGroupChatName('')
  }

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: 'User Already in group!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      return
    }

    if (selectedChat.groupAdmin._id !== currentUser._id) {
      toast({
        title: 'Only admins can add someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      return
    }

    try {
      setLoading(true)

      const { data } = await axios.put(addpplGroupChatRoute, {
        chatId: selectedChat._id,
        userId: user1._id,
      })

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      setLoading(false)
    }
  }

  const handleRemove = async (user1) => {
    if (
      selectedChat.groupAdmin._id !== currentUser._id &&
      user1._id !== currentUser._id
    ) {
      toast({
        title: 'Only admins can remove someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      return
    }
    if (
      selectedChat.groupAdmin._id === currentUser._id &&
      user1._id === currentUser._id
    ) {
      toast({
        title: 'Admins cannot remove themselves!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      return
    }

    try {
      setLoading(true)

      const { data } = await axios.put(removepplGroupChatRoute, {
        chatId: selectedChat._id,
        userId: user1._id,
      })
      console.log(data)

      user1._id === currentUser._id ? setSelectedChat() : setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
      setUpdateAgain(!updateAgain)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      setLoading(false)
    }
  }

  return (
    <>
      <IconButton d={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal onClose={onClose} isOpen={isOpen} isCentered='true'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work sans'
            display='flex'
            justifyContent='center'
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDir='column' alignItems='center'>
            <Box w='100%' display='flex' flexWrap='wrap' pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display='flex'>
              <Input
                placeholder='Chat Name'
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant='solid'
                colorScheme='teal'
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder='Add User to group'
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size='lg' />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(currentUser)} colorScheme='red'>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default UpdateGroupChatModal
