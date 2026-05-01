import React, { useState, useRef, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyOtp = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef([])

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgotpassword")
    }
  }, [location, navigate])

  const handleChange = (index, value) => {
    if (isNaN(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const valideValue = otp.every(el => el !== "")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fullOtp = otp.join("")

    try {
      const response = await Axios({
        ...SummaryApi.verifyOtp,
        data: {
          otp: fullOtp,
          email: location?.state?.email
        }
      })

      if (response.data.error) {
        toast.error(response.data.message)
      }

      if (response.data.success) {
        toast.success(response.data.message)
        setOtp(["", "", "", "", "", ""])
        navigate("/resetpassword", { state: { email: location?.state?.email } })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP")
    }
  }

  return (
    <section className='fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
      <div className='bg-black w-full max-w-md p-8 rounded-md border border-white/10 relative'>
        <button 
          onClick={() => navigate("/forgotpassword")} 
          className='absolute top-6 left-6 text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm'
        >
          <IoArrowBack size={18} /> Back
        </button>
        
        <div className='text-center mb-10 mt-6'>
          <h2 className='text-3xl font-bold text-white tracking-tight mb-1'>Verify</h2>
          <p className='text-gray-500 text-xs uppercase tracking-widest'>6-digit code</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-10'>
          <div className='flex justify-center gap-3'>
            {otp.map((data, index) => (
              <input
                key={index} type="text" inputMode="numeric" maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                value={data} onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className='w-10 h-14 sm:w-12 sm:h-16 text-center text-xl font-bold rounded-sm bg-white/5 border border-white/10 text-white focus:border-white/30 outline-none transition-all'
              />
            ))}
          </div>

          <button 
            disabled={!valideValue} 
            className={`w-full py-3 rounded-sm font-bold text-sm uppercase tracking-wider transition-all
              ${valideValue ? "bg-white text-black hover:bg-gray-200" : "bg-white/10 text-white/30 cursor-not-allowed"}`}
          >
            Verify
          </button>
        </form>
      </div>
    </section>
  )
}

export default VerifyOtp