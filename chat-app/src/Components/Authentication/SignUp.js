import React from 'react'
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";


const SignUp = () => {

  
  const [show1, setShow1] = useState(false);
     const [show2, setShow2] = useState(false);
     const [loading, setLoading] = useState(false);
     const [user, setUser] = useState({name:"",email:"", password:"", cpassword:"",pic:""});
     
     const toast=useToast()
     
     const navigate = useNavigate() ;
     
     const handleInput=(e)=>{
       var name=e.target.name
       var value=e.target.value
       
       setUser({...user,[name]:value})
      }
      

      const postDetails=(pics)=>{
        setLoading(true)
        if(pics===undefined){
          toast({
            title:"Please Select an Image",
            status:"warning",
            duration:'5000',
            isClosable:true,
            position:"bottom"
          })
          return;
        }
        if(pics.type==='image/jpeg'|| pics.type==='image/png'){
        const data=new FormData()
        data.append("file",pics)
        data.append('upload_preset',"chatApp")
        data.append('cloud_name',"dvzes6ych")
        fetch(" https://api.cloudinary.com/v1_1/dvzes6ych/image/upload",{
          method:"post",
          body:data,
        }).then((res)=>res.json())
        .then((data)=>{
          setUser({...user,pic:data.url.toString()})
        console.log(data)
      })
      .catch((err)=>{
        console.log(err)
        setLoading(false)
        })
      }
        else{
          toast({
            title:"Please Select an Image",
            status:"warning",
            duration:'5000',
            isClosable:true,
            position:"bottom"
          })
          setLoading(false)
          return
        }
      }
      
      const submitHandler = async ()=>{
        setLoading(true)
        const {name,email,password,cpassword}=user;
        if(!name||!email || !password||!cpassword){
          toast({
            title:"Please Fill all the field",
            status:"warning",
            duration:'5000',
            isClosable:true,
            position:"bottom"
          })
          setLoading(false)
          return
         }
         try{
          const config = {
            headers:{
              "Content-type":"application/json"
            }
          }
          const {data}=await axios.post("/api/user/register",{name,email,password,cpassword},config)
          toast({
            title:"Registeration Successfull",
            status:"warning",
            duration:'5000',
            isClosable:true,
            position:"bottom"
          })
          localStorage.setItem('userInfo',JSON.stringify(data))
          setLoading(false)
          console.log("from sugnup ",user)
          navigate('/chats')
         }

         catch(error){
          toast({
            title:"Error Occured",
            description:error.response.data.message,
            status:"error",
            duration:'5000',
            isClosable:true,
            position:"bottom"
          })        
          setLoading(false)
        }
      }
        
        return (
    <>
  <VStack spacing={5}>
  
  <FormControl id='name' isRequired>
    <InputGroup>
  <FormLabel>Name</FormLabel>
  <Input type='text' placeholder='Name' name='name' onChange={handleInput} value={user.name}/>
    </InputGroup>
</FormControl>

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
  
  <FormControl id='cpassword' isRequired>
    <InputGroup>
  <FormLabel>Confirm Password</FormLabel>
  <Input type={show2?'text':'password'} placeholder='Confirm Password' name='cpassword'  onChange={handleInput} value={user.cpassword}/>
  <InputRightElement width="4.5rem">
  <Button h='1.75rem' size='sm' onClick={()=> {setShow2(!show2)
  console.log(show2)}}>{show2?"Hide":"Show"}</Button>
  </InputRightElement>
    </InputGroup>
</FormControl>
  
  <FormControl id='pic' isRequired>
    <InputGroup>
  <FormLabel>Pic</FormLabel>
  <Input placeholder='Pic' type='file' name='pic' p={1.5} accept="image/*"
  onChange={(e)=>postDetails(e.target.files[0])}
  />
    </InputGroup>
</FormControl>

<Button
colorScheme='blue'
width='100%'
color='white'
style={{marginTop:15}}
onClick={submitHandler}
// isLoading={loading}
>
SignUp
</Button>
  
  </VStack>
    </>  
  )
}


export default SignUp
