import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { IoEyeOutline, IoEyeOffOutline, IoArrowBack } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [data, setData] = useState({
    email: location?.state?.email || "",
    newPassword: "",
    confirmPassword: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (!location?.state?.email) {
      toast.error("Please verify OTP first")
      navigate("/forgotpassword")
    }
  }, [location, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((preve) => {
      return { ...preve, [name]: value }
    })
  }

  const valideValue = Object.values(data).every(el => el)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and confirm password must be same")
      return
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data
      })

      if (response.data.error) {
        toast.error(response.data.message)
      }

      if (response.data.success) {
        toast.success(response.data.message)
        setData({ email: "", newPassword: "", confirmPassword: "" })
        navigate("/")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <section className='fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
      <div className='bg-black w-full max-w-md p-8 rounded-md border border-white/10 relative'>
        <button 
          onClick={() => navigate("/verifyotp")} 
          className='absolute top-6 left-6 text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm'
        >
          <IoArrowBack size={18} /> Back
        </button>

        <div className='text-center mb-10 mt-6'>
          <h2 className='text-3xl font-bold text-white tracking-tight mb-1'>Reset</h2>
          <p className='text-gray-500 text-xs uppercase tracking-widest'>New Password</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-1.5'>
            <label htmlFor='newPassword' class='block text-xs font-medium text-gray-400 ml-1'>New Password</label>
            <div className='relative flex items-center'>
              <input
                type={showPassword ? "text" : "password"} id='newPassword' name='newPassword'
                value={data.newPassword} onChange={handleChange}
                className='w-full px-4 py-3 rounded-sm bg-white/5 border border-white/10 text-white focus:border-white/30 outline-none transition-all'
                placeholder='••••••••'
              />
              <div onClick={() => setShowPassword(prev => !prev)} className='absolute right-3 cursor-pointer text-gray-500 hover:text-white'>
                {showPassword ? <IoEyeOutline size={18} /> : <IoEyeOffOutline size={18} />}
              </div>
            </div>
          </div>

          <div className='space-y-1.5'>
            <label htmlFor='confirmPassword' class='block text-xs font-medium text-gray-400 ml-1'>Confirm Password</label>
            <div className='relative flex items-center'>
              <input
                type={showConfirmPassword ? "text" : "password"} id='confirmPassword' name='confirmPassword'
                value={data.confirmPassword} onChange={handleChange}
                className='w-full px-4 py-3 rounded-sm bg-white/5 border border-white/10 text-white focus:border-white/30 outline-none transition-all'
                placeholder='••••••••'
              />
              <div onClick={() => setShowConfirmPassword(prev => !prev)} className='absolute right-3 cursor-pointer text-gray-500 hover:text-white'>
                {showConfirmPassword ? <IoEyeOutline size={18} /> : <IoEyeOffOutline size={18} />}
              </div>
            </div>
          </div>

          <button 
            disabled={!valideValue} 
            className={`w-full py-3 rounded-sm font-bold text-sm uppercase tracking-wider transition-all mt-4
              ${valideValue ? "bg-white text-black hover:bg-gray-200" : "bg-white/10 text-white/30 cursor-not-allowed"}`}
          >
            Update
          </button>
        </form>
      </div>
    </section>
  )
}

export default ResetPassword