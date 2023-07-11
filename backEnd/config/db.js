const mongoose =require('mongoose')


const connectDB= async()=>{
    DB=process.env.DATA_BASE
    try{

       const conn = await  mongoose.connect(DB,{useUnifiedTopology: true,useNewUrlParser: true})
    
       console.log(`MongoDB connected: ${conn.connection.host}`)
    }
    catch(error){
        console.log(`Error: ${error.message}`)
    }
}

module.exports=connectDB