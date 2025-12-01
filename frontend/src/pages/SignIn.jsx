

import bg from "../assets/bg.png"
import { useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react';
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import UserContext, { userDataContext } from '../context/UserContext';
import axios from 'axios';


function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { serverUrl,userData,setUserData } = useContext(userDataContext)
  const handleSignIn = async (e) => {
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signin`, {
        email, password
      }, { withCredentials: true })
      console.log("res" ,result.data);
      
      setUserData(result?.data?.user)

      navigate("/customize")
      setLoading(false)
    } catch (error) {
      console.log(error)
      setUserData(null)
      setLoading(false)
      setErr(error.response.data.message)
    }
  }
  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }} >
      <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]' onSubmit={handleSignIn}>
        <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Sign In to <span className='text-blue-400'>Virtual Assistant</span></h1>

        <input type="email" placeholder='Email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent  text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e) => setEmail(e.target.value)} value={email} />
        <div className='w-full h-[60px] border-2 border-white bg-transparent  text-white rounded-full text-[18px] relative'>
          <input type={showPassword ? "text" : "password"} placeholder='Password' className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]' required onChange={(e) => setPassword(e.target.value)} value={password} />
          {!showPassword && <IoEye className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursor-pointer' onClick={() => setShowPassword(true)} />}
          {showPassword && <IoEyeOff className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursor-pointer' onClick={() => setShowPassword(false)} />}
        </div>
        {err.length > 0 && <p className='text-red-500 text-[17px]'>
          *{err}
        </p>}
        <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold  bg-white rounded-full text-[19px] hover:scale-[90%] transition-all ' disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>

        <p className='text-[white] text-[18px] mt-5' >Don’t have an account? <span className='text-blue-400 cursor-pointer' onClick={() => navigate("/signup")}>Sign Up</span></p>
      </form>
    </div>
  )
}

export default SignIn
