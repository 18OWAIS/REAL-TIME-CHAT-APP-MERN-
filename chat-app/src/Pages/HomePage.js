import React from 'react'
import SignUp from '../Components/Authentication/SignUp.js'
import Login from '../Components/Authentication/Login.js'
// import {useState} from 'react'
import {Box,Container,Text} from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

const HomePage = () => {
  
  return (
//     <>
<Container  maxW='xl' centerContent>
  <Box
  display='flex'
  justifyContent='center'
  p={3}
  bg={'white'}
  w='100%'
  m='40px 0 15px 0'
  borderRadius='lg'
  borderWidth='1px'
  >
    <Text fontSize='4xl' fontFamily='Work sans' color='black'>Chatter</Text>
    </Box>

      <Box
        p={3}
        bg={'white'}
        width='100%'
        borderRadius='lg'
        borderWidth='1px'
        color='black'
      >
     <Tabs variant='soft-rounded' colorScheme='green'>
  <TabList mb='1em'>
    <Tab width='50%'>Login</Tab>
    <Tab width='50%'>SignUp</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
    <Login/>
    </TabPanel>
    <TabPanel>
    <SignUp/>
    </TabPanel>
  </TabPanels>
</Tabs>
</Box>
</Container>
    
  )
}

export default HomePage
