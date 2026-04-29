import axios from "axios";
import SummaryApi, { baseURL } from '../common/SummaryApi';

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

Axios.interceptors.request.use(
    async (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


Axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        let originRequest = error.config;

    
        if (error.response && error.response.status === 401 && !originRequest._retry) {
            originRequest._retry = true; // Retry flag set karna

            try {
               
                const newAccesstoken = await refreshAccessToken();
                
                if (newAccesstoken) {
                   
                    return Axios(originRequest); 
                }
            } catch (refreshError) {
               
            }
        }
        return Promise.reject(error);
    }
);

const refreshAccessToken = async () => {
    try {
     
        const response = await axios({
            ...SummaryApi.refreshToken, 
            baseURL: baseURL,
            withCredentials: true
        });

        return response.data.data.accessToken;
    } catch (error) {
        console.log("Refresh token expired or invalid", error);
        return null;
    }
}

export default Axios;