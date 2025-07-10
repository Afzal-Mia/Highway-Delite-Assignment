import React, { useContext, useState } from 'react'
import { GlobalContext } from '../context/globalContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [signUp, setSignUp] = useState(true);
    const { user, otpField, setOtpField, signUpInitiator, signUpVerification, signInInitiator, signInVerification,} = useContext(GlobalContext);
    const [inputOtp, setInputOtp] = useState({
        otp: ''
    });
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        email: '',
    });

    // State to hold validation errors
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleOtpChange = (e) => {
        const { id, value } = e.target;
        setInputOtp((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    }

    // Validate form data
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required.';
            isValid = false;
        }

        // data validation 
        if (!formData.dob.trim()) {
            newErrors.dob = 'Date is required.';
            isValid = false;
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid.';
            isValid = false;
        }



        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSignUp = (e) => {
        console.log("Handle Sign up is running!");
        e.preventDefault();
        if (validateForm()) {
            console.log('Form data submitted:', formData);
            signUpInitiator(formData);
            setOtpField(true);
        } else {
            toast.error("Form Validation Error");
        }
    };

    const handleSignUpVerify = (e) => {
        console.log("Sign Up verification is running");
        e.preventDefault();
        let isValid = true;
        let newErrors = {}
        if (!inputOtp.otp.trim()) {
            newErrors.otp = 'OTP is required.';
            isValid = false;
        } else if (!/^\d{6}$/.test(inputOtp.otp)) {
            newErrors.otp = 'OTP must be a 6-digit number.';
            isValid = false;
        }
        const verifiableData = {
            otp: inputOtp.otp,
            tokenForVerification: localStorage.getItem("signUpVerificationToken")
        }
        console.log("Verifiable data", verifiableData);
        signUpVerification(verifiableData);
        setFormData({
            name: '',
            email: '',
            dob: '',
        })
        navigate('/dashboard');
        setOtpField(false);
    }

    const handleSignIn = (e) => {
        let isValid = true
        let newErrors = {}
        e.preventDefault();
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid.';
            isValid = false;
        }
        const signInObject = {
            email: formData.email,
        }
        signInInitiator(signInObject);
        setOtpField(true);

    };

    const handleSignInVerify = (e) => {
        e.preventDefault();
        const signData = {
            otp: inputOtp.otp,
            tokenForVerification: localStorage.getItem("signInVerificationToken")
        }
        console.log("signing Data", signData);
        signInVerification(signData);
        setOtpField(false);
        formData.email = '';
        navigate('/dashboard');

    }
    return (<>
     <div className="w-full min-h-screen mx-auto flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4">
  {/* Left Column n */}
  <div className="w-full sm:w-1/2 max-w-[600px] flex flex-col items-center justify-center gap-1 px-4">
    {/* Logo */}
    <div className="flex items-center justify-center gap-2 mt-4">
      <img src="/top.png" alt="logo-image" className="h-8 w-8 object-cover" />
      <span className="font-medium text-lg">HD</span>
    </div>

    {/* Heading */}
    <h3 className="font-bold text-2xl">{signUp ? "Sign Up" : "Sign In"}</h3>
    <p className="text-gray-400 text-sm">Sign {signUp ? "up" : "in"} to enjoy the features of HD</p>

    {/* Form */}
    <form
      onSubmit={signUp ? (otpField ? handleSignUpVerify : handleSignUp) : (otpField ? handleSignInVerify : handleSignIn)}
      className="w-full space-y-4"
    >
      {/* Name */}
      {signUp && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            id="name"
            className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>
      )}

      {/* DOB */}
      {signUp && (
        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">DOB (YYYY-MM-DD)</label>
          <input
            type="date"
            id="dob"
            className={`w-full px-4 py-2 border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            value={formData.dob}
            onChange={handleChange}
          />
          {errors.dob && <p className="text-sm text-red-500 mt-1">{errors.dob}</p>}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          id="email"
          className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>

      {/* OTP */}
      {otpField && (
        <>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
            <input
              type="text"
              id="otp"
              maxLength="6"
              className={`w-full px-4 py-2 border ${errors.otp ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter 6-digit OTP"
              value={inputOtp.otp}
              onChange={handleOtpChange}
            />
            {errors.otp && <p className="text-sm text-red-500 mt-1">{errors.otp}</p>}
            <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 mt-2">Resend OTP</a>
          </div>

          <div className="flex items-center">
            <input
              id="keepLoggedIn"
              name="keepLoggedIn"
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              defaultChecked
            />
            <label htmlFor="keepLoggedIn" className="ml-2 block text-sm text-gray-900">
              Keep me logged in
            </label>
          </div>
        </>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
      >
        {otpField ? (signUp ? "Sign up" : "Sign in") : "Get OTP"}
      </button>
    </form>

    {/* Toggle Link */}
    <div className="text-xs text-center mb-4">
      <p className="text-gray-500">
        {signUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          onClick={() => setSignUp((prev) => !prev)}
          className="text-blue-400 underline hover:cursor-pointer"
        >
          {signUp ? "Sign In" : "Sign Up"}
        </span>
      </p>
    </div>
  </div>

  {/* Right Column */}
<div className="hidden sm:flex sm:w-1/2 h-[100vh] overflow-hidden rounded-l-sm shadow-lg">
  <img
    src="/right-column.png"
    alt="Right column illustration"
    className="w-full h-full object-cover "
  />
</div>


</div>

    </>
    )
}

export default Home;