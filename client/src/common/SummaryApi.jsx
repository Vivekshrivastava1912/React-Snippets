import ForgotPassword from "../pages/ForgotPassword"

// Isse 5173 se badal kar 8000 kar dein
export const baseURL = "http://localhost:8000"

const SummaryApi = {
    register: {
        url: '/api/user/register',
        method: "post"
    },
    login: {
        url: '/api/user/login',
        method: "post"
    },

    ForgotPassword: {
        url: '/api/user/forget-password',
        method: "put"
    },

  
  
}

export default SummaryApi