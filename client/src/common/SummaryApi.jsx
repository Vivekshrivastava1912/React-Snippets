import ForgotPassword from "../pages/ForgotPassword"


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
    refreshToken: {
        url: '/api/user/refresh-token',
        method: "post"
    }
}

export default SummaryApi