//handling error for async function
const asyncHandler=require('express-async-handler')

// importing User model from models
const User=require('../models/userModel')


// importing generateToken function 
const generateToken=require("../config/generateToken")


// registerUser Logic 
const registerUser=asyncHandler(async(req,res)=>{
    const {name,email,password,cpassword}=req.body;

    if(!name||!email||!password||!cpassword){
        res.status(400);
        throw new Error("Please Enter all the Fields")
    }
    
    const userExist= await User.findOne({email})


   if(userExist){
    res.status(400)
    throw new Error("user already exist ")
   }

   const user=await new User({
    name,email,password,cpassword,
   })

   const saveUser=await user.save();


    if(saveUser){
        res.status(201).json({
            _id:saveUser._id,
            name:saveUser.name,
            email:saveUser.email,
            password:saveUser.password,
            cpassword:saveUser.cpassword,
            pic:saveUser.pic,
            token:generateToken(saveUser._id),
        })
            }
        else{
            res.status(400);
            throw new Error("Failed to create the user")
        }
    }
)


//User authentication Logic
const authUser=asyncHandler(async(req,res)=>{

  const {email,password}=req.body

  const user=await User.findOne({email})

  if(user && ( (user.password==password)))
  {
    res.json({
      _id:user._id,
      name:user.name,
      email:user.email,
      pic:user.pic,
      token:generateToken(user._id),
    })
  }
  else{
    res.status(400)
    throw new Error("Invalid Email or Password")
  }
})

// /api/user?search=owais

const allUsers =asyncHandler(async (req,res)=>{

  //ya to name ho ya email ho is query ke naam se
  const keyword =req.query.search?{
    $or:[
      {name:{$regex:req.query.search, $options:"i"}},
      {email:{$regex:req.query.search, $options:"i"}}
    ] 
   }:{}

   const user= await User.find(keyword)
   res.send(user)

  
})

module.exports={registerUser,authUser,allUsers}