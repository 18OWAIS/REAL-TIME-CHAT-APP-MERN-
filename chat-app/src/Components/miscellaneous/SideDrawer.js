import React, { useState } from 'react'
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Tooltip,useDisclosure, useToast} from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {ChatState} from '../../Context/ChatProvider'
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge from "react-notification-badge";


function SideDrawer() {
const {
  setSelectedChat,
  user,
  notification,
  setNotification,
  chats,
  setChats,
} = ChatState();
  
  const { isOpen, onOpen, onClose } = useDisclosure()

const [search, setSearch]=useState()
const [searchResult, setSearchResult]=useState()
const [loading,setLoading]=useState([])
const [loadingChat,setLoadingChat]=useState()


const navigate=useNavigate()

// useEffect(()=>{
//   console.log(isOpen)
//   // console.log(onOpen)
// },[isOpen,onClose,onOpen])

const logoutHandler = ()=>{
  localStorage.removeItem('userInfo')
  navigate('/')
}

const toast= useToast()

const handleSearch = async ()=>{
  if(!search){
    console.log(searchResult)
  toast({
    title:"Please Enter Something In Search",
    status:"warning",
    duration:'5000',
    isClosable:true,
    position:"bottom"
  })
  return;
}
console.log(search)

try{
setLoading(true)

const config={

  headers:{
    Authorization:`Bearer ${user.token}`
  }
}

const {data}=await axios.get(`/api/user/register?search=${search}`,config)

setLoading(false)
setSearchResult(data)
console.log(searchResult)
}
catch(error){
 
  toast({
    title:"Error Occured",
    status:"Failed to load the search result",
    duration:'5000',
    isClosable:true,
    position:"bottom-left"
  })
}
}


const accessChat=async (userId)=>{
try{
setLoading(true)

const config={
 
  headers:{
    'Content-type':"application/json",
    Authorization:`Bearer ${user.token}`
  }
}

const {data}=await axios.post('/api/chat',{userId},config)

if(!chats.find((c)=>c._id===data._id))setChats([data,...chats])

console.log(chats)
setSelectedChat(data)
setLoadingChat(false)
onClose()
}
catch(error){
  toast({
    title:"Error Fetching The Chat",
    status:"Failed to load the search result",
    duration:'5000',
    isClosable:true,
    position:"bottom"
  })
}

}

  return (
 <>
   <Box
        display="flex"
        // flexDirection='row'
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >

<Tooltip d='block' label='search User To Chat' hasArrow placement ='bottom-end'>
  <Button variant='ghost' onClick={onOpen}>
    <i class='fas fa-search'></i>
    <Text d={{base:'none', md:"flex"}} px='4'>
      Search User
    </Text>
  </Button>
</Tooltip>

<Text fontSize='2xl' fontFamily='work sans' >
Talk-A-Tive
</Text>

<div>

<Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

   <Menu d='block'>
    <MenuButton p={1} >
    <BellIcon fontSize='2xl' m={1}/>
    </MenuButton>
   </Menu>

   <Menu>
    <MenuButton p={1} rightIcon= {<ChevronDownIcon/>}>
    <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic}/>
    </MenuButton>
    <MenuList>
    
      <ProfileModal></ProfileModal>
  
      <MenuItem onClick={logoutHandler}>Logout</MenuItem>
    </MenuList>
   </Menu>

</div>

 </Box>

<Drawer placement='left' onClose={onClose} isOpen={isOpen}>
<DrawerOverlay/>
<DrawerContent>
  <DrawerHeader borderBottomWidth='1px'>
    Search User
  </DrawerHeader>
  <DrawerBody>
    <Box d='flex' pb={2}>
    <Input 
    placeholder='Search By Name Or Email'
    mr={2}
    value={search}
    onChange={(e)=>setSearch(e.target.value)}
    />
    <Button onClick={handleSearch}>
      GO
    </Button>
    </Box>
    {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
  </DrawerBody>
</DrawerContent>
</Drawer>
 </>
  )
}

export default SideDrawer 