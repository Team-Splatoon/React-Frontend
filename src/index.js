import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import ChatProvider from './Context/ChatProvider'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <ChatProvider>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </ChatProvider>
)
