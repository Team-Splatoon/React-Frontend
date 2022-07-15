import { Button } from '@chakra-ui/button'
import { useDisclosure } from '@chakra-ui/hooks'
import { Input } from '@chakra-ui/input'
import { Box, Text } from '@chakra-ui/layout'
import styled from 'styled-components'
import { Menu, MenuButton, Tooltip } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import axios from 'axios'
import { useToast } from '@chakra-ui/toast'
import { Spinner } from '@chakra-ui/spinner'

import { ChatState } from '../../Context/ChatProvider'

function SideDrawer() {
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Container>
      <Box
        d='flex'
        justifyContent='space-between'
        alignItems='center'
        bg='white'
        w='100%'
        p='5px 10px 5px 10px'
        borderWidth='5px'
      >
        <Tooltip label='Search Users to chat' hasArrow placement='bottom-end'>
          <Button variant='ghost' onClick={onOpen}>
            <i className='fas fa-search'></i>
            <Text d={{ base: 'none', md: 'flex' }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize='2xl' fontFamily='Work sans'>
          NUSCourseChat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon />
            </MenuButton>
          </Menu>
        </div>
      </Box>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: top;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
`

export default SideDrawer
