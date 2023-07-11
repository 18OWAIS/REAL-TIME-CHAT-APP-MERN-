const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    cpassword: { type: "String", required: true },
    pic: {
      type: "String",
      required: true,
      default:
        "https://static.vecteezy.com/system/resources/previews/007/226/475/original/user-account-circle-glyph-color-icon-user-profile-picture-userpic-silhouette-symbol-on-white-background-with-no-outline-negative-space-illustration-vector.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestaps: true }
);

const User = mongoose.model('User',userSchema)


// userSchema.methods={matchPassword:async function(enteredPassword){
 
//   return await  bcrypt.compare(enteredPassword,this.password)

// }
// }

// before saving data in userSchema do this or encrypt the password
// userSchema.pre('save', async function(next){
//   if(!this.isModified()){
//     next(); //same as break statement in c++
//   }
//   const salt= bcrypt.genSalt(10);
//   this.password= await bcrypt.hash(this.password,salt)
//   console.log(this.password)
// })

userSchema.pre('save', async function (next) {
  if(this.isModified('password')) {
      this.password = await bcrypt.hash(this.password , 12);
      this.cpassword = await bcrypt.hash(this.cpassword , 12);
  }

  next();
})

module.exports = User;