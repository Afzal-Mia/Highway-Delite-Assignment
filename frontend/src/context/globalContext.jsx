import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { serverAPI } from "../main";
import { Navigate } from "react-router-dom";


export const GlobalContext = createContext();
function ContextProvider ({ children }){
  const [user, setUser] = useState(false);
  const [profileName ,setProfileName] =useState('');
  const [otpField, setOtpField] = useState(false);
  
 
 function signUpInitiator(formData){
  fetch(`${serverAPI}/auth/sign-up`,{
    method:"POST",
    headers:{
      'Content-Type': 'application/json',
    },
    body:JSON.stringify(formData)
  })
  .then((res)=>res.json())
  .then((data)=>{
    if(data.success){
      toast.success(data.message);
      console.log("sign up initiation res",data);
      localStorage.setItem('signUpVerificationToken',data.token);
    }
    else{
      toast.error(data.message);
    }
  })
  .catch((e)=>{
    toast.error("Something went in Sign UP");
    console.log(e);
  })
 }

 function signUpVerification(signUpVerificationData){
  fetch(`${serverAPI}/auth/sign-up/verification`,{
    method:"POST",
    headers:{
      'Content-Type': 'application/json',
    },
    body:JSON.stringify(signUpVerificationData)
  })
  .then((res)=>res.json())
  .then((data)=>{
    if(data.success){
      toast.success(data.message);
      console.log("sign up verified res",data);
      setProfileName(data.user.name);
      localStorage.removeItem("signUpVerificationToken");
      localStorage.setItem('token',data.token);
      setUser(true);

    }
    else{
      toast.error(data.message);
    }
    
  })
  .catch((e)=>{
    toast.error("Something went in verification");
    console.log(e);
  })
 }

 function signInInitiator(formData){
  fetch(`${serverAPI}/auth/sign-in`,{
    method:"POST",
    headers:{
      'Content-Type': 'application/json',
    },
    body:JSON.stringify(formData)
  })
  .then((res)=>res.json())
  .then((data)=>{
    if(data.success){
      toast.success(data.message);
      console.log("sign in verified res",data);
      localStorage.setItem("signInVerificationToken",data.token);
    }
    else{
      toast.error(data.message);
    }
    
  })
  .catch((e)=>{
    toast.error("Something went wrong in sign in verify");
    console.log(e);
  })
 }

function signInVerification(signInVerificationData){
  fetch(`${serverAPI}/auth/sign-in/verification`, {
    method:"POST",
    headers:{
      'Content-Type': 'application/json',
    },
    body:JSON.stringify(signInVerificationData)
  })
  .then((res)=>res.json())
  .then((data)=>{
    if(data.success){
      toast.success(data.message);
      console.log("sign in verified res",data);
       setProfileName(data.user.name);
      localStorage.removeItem("signInVerificationToken");
      localStorage.setItem('token',data.token);
      setUser(true);

    }
    else{
      toast.error(data.message);
    }
    
  })
  .catch((e)=>{
    toast.error("Something went sign in verification");
    console.log(e);
  })
 }

useEffect(() => {
  if(localStorage.getItem("token")){
    setUser(true);
  }
  else{
    setUser(false);
  }
}, [])

const value = {
  user,
  signUpInitiator,
  signUpVerification,
  otpField,
  setOtpField,
  signInInitiator,
  signInVerification,
  profileName,

}
return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};
export default ContextProvider;