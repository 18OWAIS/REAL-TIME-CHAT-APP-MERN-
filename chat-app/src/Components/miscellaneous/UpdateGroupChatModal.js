import { Box, Button, FormControl, IconButton, Input, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const {selectedChat,setSelectedChat,user}=ChatState()

const toast=useToast();

const handleRemove = async (user1) => {
  if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
    toast({
      title: "Only admins can remove someone!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.put(
      `/api/chat/groupremove`,
      {
        chatId: selectedChat._id,
        userId: user1._id,
      },
      config
    );
   
   if(user1._id === user._id){ 
    setSelectedChat()
    }
    else{
    setSelectedChat(data);
    }

    setFetchAgain(!fetchAgain);
    fetchMessages();
    setLoading(false);
    // window.location.reload(true)
  } catch (error) {
    toast({
      title: "Error Occured!",
      description: error.response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
  }
  setGroupChatName("");
};



const handleRename= async ()=>{

  if(!groupChatName)
  return 

  try{
    setRenameLoading(true)

    const config={
      headers:{
        Authorization:`Bearer ${user.token}`
      }
    };

    const {data} = await axios.put('/api/chat/rename',
    {
      chatId:selectedChat._id,
      chatName:groupChatName,
    },
    config
    )

setSelectedChat(data)
setFetchAgain(!fetchAgain)
setRenameLoading(false)
  }

catch(error)
{
  toast({
    title:"Error Occured",
    description:error.response.data.message,
    status:"error",
    duration:'5000',
    isClosable:true,
    position:"bottom"
  })
}
}



const handleSearch = async (query) => {
  setSearch(query);
  if (!query) {
    return;
  }

  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.get(`/api/user/register?search=${search}`, config);
    console.log(data);
    setLoading(false);
    setSearchResult(data);
  } catch (error) {
    toast({
      title: "Error Occured!",
      description: "Failed to Load the Search Results",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};


const handleAddUser = async (user1) => {
  if (selectedChat.users.find((u) => u._id === user1._id)) {
    toast({
      title: "User Already in group!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  if (selectedChat.groupAdmin._id !== user._id) {
    toast({
      title: "Only admins can add someone!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.put(
      `/api/chat/groupadd`,
      {
        chatId: selectedChat._id,
        userId: user1._id,
      },
      config
    );

    setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setLoading(false);
  } catch (error) {
    toast({
      title: "Error Occured!",
      description: error.response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
  }
  setGroupChatName("");
};


useEffect(()=>{

},[])

return (
<>        
    <IconButton display={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen}/>

    <Modal isOpen={isOpen} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{selectedChat.chatName}</ModalHeader>
      <ModalCloseButton onClick={onClose}/>
      <ModalBody>
       <Box
       w='100%'
       display='flex'
       flexWrap='wrap'
       pb={3}
       >
        {selectedChat.users.map((u)=>(
          <UserBadgeItem
              key={u._id}
              user={u}
              admin={selectedChat.groupAdmin}
              handleFunction={() => handleRemove(u)}
            />
        ))
        }
       </Box>
       <FormControl>
        <Input
        placeholder='Chat Name'
        mb={3}
        value={groupChatName}
        onChange={(e)=>setGroupChatName(e.target.value)}
        />
        <Button
        variant='solid'
        colorScheme='teal'
        ml={1}
        isLoading={renameLoading}
        onClick={handleRename}
        >
          Update
        </Button>
         </FormControl>
       
       <FormControl>
          <Input
          placeholder='Add User To Group'
          mb={1}
          onChange={(e)=>handleSearch(e.target.value)}
          />
          
            {loading ? (
            <Spinner size='lg'/>
          ) : (
            searchResult
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
          )}
    
        </FormControl>



      </ModalBody>

      <ModalFooter>
      <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
</>
  )
}

export default UpdateGroupChatModal