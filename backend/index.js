import express from "express"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import cors from 'cors'
const app = express();
import sendOTP from './utils/otpEmailSender.js'

dotenv.config();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 1400;//port 
// connecting mongoDB DataBase
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DataBase is Connected successfully");
    })
    .catch((e) => {
        console.log(e.message);
    })

// userMOdel
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dob: {
        type:String,
        required: true
    }
})
const User = mongoose.model("User", userSchema);


const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },

})
const Note = mongoose.model("Note", noteSchema);

const otpGenerator = () => {
    return Math.floor(100000 + Math.random() * 900000)
}
// sendOTP('Afzal',"mohammedafzal1213@gmail.com",otpGenerator());
app.post("/auth/sign-up", async (req, res) => {
    try {
        const { name, email, dob } = req.body;//all input will be string
        const userExisting = await User.findOne({ email })
        if (userExisting) {
           return res.status(501).json({ message: "User Already Exists", success: false })
        }
        console.log("sign up inputs",req.body);
        const userData = {
            name,
            email,
            dob,
        }
        const otp = otpGenerator();
        const token = jwt.sign({ user: userData, otp }, process.env.jwt_secret, { expiresIn: "5m" })
        sendOTP(name, email, otp);
        res.status(200).json({ success: true, message: "Verify Your Email Otp Has been sent",token});
    }
    catch (e) {
        res.status(501).json({ message: `Error at registration:${e.message}`, success: false })
    }
})

app.post("/auth/sign-up/verification",async(req,res)=>{
    try{
        console.log("req body for sign in verification",req.body);
    const {otp,tokenForVerification}=req.body;
    const decode=jwt.verify(tokenForVerification,process.env.jwt_secret);
    console.log(decode);
    if(parseInt(otp)!=decode.otp){
        res.status(400).json({success:false,message:"Invalid OTP Or expired"});
    }
    const userExisted= await User.findOne({ email: decode.user.email });
    if(userExisted){
        return res.status(406).json({success:false,message:"Already exists User"});
    }
    console.log("checking Dob",decode.user.dob);
    const user=new User({
        name:decode.user.name,
        dob:decode.user.dob,
        email:decode.user.email,
    })
    await user.save();

    const token =jwt.sign({id:user._id},process.env.jwt_secret,{expiresIn:"15d"});
    res.status(200).json({success:true,message:"User Registered Successfully",user,token});
}
catch(e){
    res.status(500).json({success:true,message:`something went wrong ${e.message}`})
}

})
// generate for set up

app.post("/auth/sign-in",async(req,res)=>{
    try {
        const {email}=req.body;
        const userExists=await User.findOne({email});
        if(!userExists){
            return res.status(406).json({success:false,message:"No User found with this email"})
        }
        const otp=otpGenerator();
        const token =jwt.sign({user:userExists,otp},process.env.jwt_secret ,{expiresIn:"5m"})
        sendOTP(userExists.name,email,otp);
        res.status(200).json({success:true,message:"An Otp has been sent ,Verify",token});
    } catch (error) {
        res.status(500).json({success:true,message:"Something went wrong sign in"})
    }

})

app.post("/auth/sign-in/verification",async(req,res)=>{
    try {
        const {tokenForVerification ,otp}=req.body;
        const decode =jwt.verify(tokenForVerification,process.env.jwt_secret);
        console.log("verificationTokenDecoded",decode);
        if(parseInt(otp)!=decode.otp){
            return res.status(401).json({success:false,message:"Otp is invalid or Expired"});
        }
        const token=jwt.sign({id:decode.user._id},process.env.jwt_secret,{expiresIn:"15d"});
        res.status(200).json({success:true,message:"Signed in Successfully",token,user:decode.user})
    } catch (error) {
        res.status(500).json({success:true,message:`${error.message}`})
    }
})

const auth= (req, res, next) => {
  try {
    const token= req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.jwt_secret);
    req.userId = decoded.id;

    next(); 
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized or invalid token" });
  }
};

app.post("/add-note", auth, async (req, res) => {
    try {
      const { content } = req.body;
        const note = new Note({
            userId: req.userId,
            content
        });
        
        await note.save();
        res.status(201).json({ success: true, message: "Note has been saved!" });
    } catch (error) {
    res.status(500).json({
      success: false,
      message: `Something went wrong adding note: ${error.message}`
    });
  }
});

app.get("/get-notes", auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId });

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong fetching notes: " + error.message
    });
  }
});
app.delete("/delete/:id",auth,async(req,res)=>{
    const {id}=req.params;
    const deletedNote = await Note.findByIdAndDelete(id);
    res.status(200).json({success:true,message:"Note has been delete",deletedNote})
})



app.get("/", (req, res) => {
    res.send("Server.js is working properly");
})
// app listening route
app.listen(PORT, (req, res) => {
    console.log(`Server is running on PORT:http://localhost:${PORT}`);
})