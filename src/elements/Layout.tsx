import { Box, Flex } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const Layout = () => {
  return (
    <Flex direction='column' minH='100vh'>
      <Box as='header' position='relative' boxShadow='3px 3px 10px gray' zIndex={10} p={5} style={{backgroundColor: "white"}}>
        <Navbar />
      </Box>
      <Outlet />
      <Box as='footer' mt='auto'>
        <Footer mw={350} mx='auto' px={{ base: 0, sm: 4 }} />
      </Box>
    </Flex>
  )
}

export default Layout
