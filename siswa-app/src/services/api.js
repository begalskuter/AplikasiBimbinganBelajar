import axios from 'axios'

const api = axios.create({
    baseURL: 'https://synau-backend-579679620696.us-central1.run.app/api',
    headers: { 'Content-Type': 'application/json' }
})

// Auto attach token setiap request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export default api
