import React from 'react'
import { useState } from 'react'
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const Login = () => {

  const toast = useToast();

  const navigate=useNavigate()

  const [show1, setShow1] = useState(false);

const [user,setUser]=useState({email:"",password:""})

const handleInput =(e)=>{
    const name = e.target.name
    const value = e.target.value
     setUser({...user,[name]:value})
}

const submitHandler = async () => {
  const {email,password}=user
  // setLoading(true);
  if (!email || !password) {
    toast({
      title: "Please Fill all the Feilds",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    // setLoading(false);
    return;
  }

  // console.log(email, password);
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/user/login",
      { email, password },
      config
    );

    // console.log(JSON.stringify(data));
    toast({
      title: "Login Successful",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
    // setLoading(false);
    navigate("/chats");
  } catch (error) {
    toast({
      title: "Error Occured!",
      description: error.response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    // setLoading(false);
  }
};


  return (
    <>
    <VStack spacing={5}>
  
  <FormControl id='email' isRequired>
    <InputGroup>
  <FormLabel>Email</FormLabel>
  <Input type='email' placeholder='Email' name='email' onChange={handleInput} value={user.email}/>
    </InputGroup>
</FormControl>
  
  <FormControl id='password' isRequired>
<InputGroup>
  <FormLabel>Password</FormLabel>
  <Input type={show1?'text':'password'} placeholder='Password' name='password' onChange={handleInput} value={user.password}/>
<InputRightElement width='4.5rem'>
<Button h='1.75rem' size='sm' onClick={()=> {setShow1(!show1)
console.log(show1)}}>{show1?"Hide":"Show"}</Button>
</InputRightElement>
</InputGroup>
</FormControl>

<Button width='100%' backgroundColor="aquamarine"         onClick={submitHandler}>
Login
</Button>

  </VStack>
  </>
  )
}

export default Login