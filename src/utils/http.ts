import axios from 'axios'

axios.interceptors.request.use(
  (config:any)=>{
    if(localStorage.getItem('token')){
      
      config.headers.Authorization = localStorage.getItem('token')
    }
    return config;
},(error)=>{
  
  console.log(error);
  
})

axios.interceptors.response.use(
  (response)=>{
    return response
},(error)=>{
  const {status} = error.response
  if(status === 401) {
    localStorage.removeItem('token')
    
  }
    return Promise.reject(error)
})

export default axios