import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './component/Header'
import { useDispatch } from 'react-redux'
import Axios from './utils/Axios'
import SummaryApi from './common/SummaryApi'
import { setUserDetails } from './redux/userSlice'

function App() {
  const dispatch = useDispatch()

  const fetchUser = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.userDetails
      })

      if (response.data.success) {
        dispatch(setUserDetails(response.data.data))
      }
    } catch (error) {
      // User not logged in
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <>
      <Header />
      <main className='min-h-[78vh]'>
        <Outlet />
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          style: {
            borderRadius: '12px',
            background: '#000',
            color: '#fff',
            border: '1px solid #222',
            padding: '10px 12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#fff',
              secondary: '#000',
            },
          },
          error: {
            iconTheme: {
              primary: '#fff',
              secondary: '#000',
            },
          },
        }}
      />

    </>
  )
}

export default App
