import axios from 'axios'
import notify from './notify.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.response.use(
  res => res,
  err => {
    const data = err.response?.data

    // Nếu data là một chuỗi trả về BadRequest
    if (typeof data === 'string') {
      notify.error(data)
    } 
    //  data là object và có property message  trả về BadRequest(new { message = "..." }))
    else if (data?.message) {
      notify.error(data.message)
    }
    // lỗi validation của ASP.NET 
    else if (data?.errors) {
      if (typeof data.errors === 'object' && !Array.isArray(data.errors)) {
        Object.values(data.errors).flat().forEach(e => notify.error(e))
      } 
      //  errors là mảng 
      else if (Array.isArray(data.errors)) {
        data.errors.forEach(e => notify.error(e))
      }
    }
    // không có data trả về
    else {
      notify.error("Đã có lỗi xảy ra, vui lòng thử lại!")
    }

    return Promise.reject(err)
  }
)

export default api
