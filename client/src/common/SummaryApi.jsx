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
    forgotPassword: {
        url: '/api/user/forget-password',
        method: "put"
    },
    verifyOtp: {
        url: '/api/user/verify-forgot-password-otp',
        method: "put"
    },
    resetPassword: {
        url: '/api/user/reset-password',
        method: "put"
    },
    refreshToken: {
        url: '/api/user/refresh-token',
        method: "post"
    },
    userDetails: {
        url: '/api/user/user-details',
        method: "get"
    },
    logout: {
        url: '/api/user/logout',
        method: 'get'
    },
    allUsers: {
        url: '/api/user/all-users',
        method: 'get'
    },
    deleteUser: {
        url: '/api/user/delete-user',
        method: 'delete'
    },
    saveCode: {
        url: '/api/usercode/add-user-code',
        method: 'post'
    },
    getUserCodes: {
        url: '/api/usercode/get-user-codes',
        method: 'get'
    },
    getCodesForUser: {
        url: '/api/usercode/get-codes-for-user',
        method: 'get'
    },
    allComponentsAdmin: {
        url: '/api/usercode/all-components-admin',
        method: 'get'
    },
    deleteComponentAdmin: {
        url: '/api/usercode/delete-component-admin',
        method: 'delete'
    },
    aiGeneration: {
        url: '/api/ai/grok',
        method: 'post'
    }
}

export default SummaryApi