import { createApp } from 'vue'

// Giữ nguyên trỏ về file App.vue rỗng để Router tự xử lý
import App from './App.vue';

import router from './DuanKhachSan/router/KhangHang.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

// Font chữ & Icon (Quan trọng để hiện hình, sửa lỗi ô vuông)
import 'boxicons/css/boxicons.css'

// Scrollbar đẹp (Tùy chọn)
import 'perfect-scrollbar/css/perfect-scrollbar.css'

import axios from 'axios';
import signalRService from './DuanKhachSan/Service/signalrService.js';

// Cấu hình mặc định
axios.defaults.withCredentials = true; // Cho phép gửi nhận Cookie

// Biến để tránh việc gọi Refresh Token nhiều lần cùng lúc
let isRefreshing = false;

axios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config; // Lưu lại yêu cầu ban đầu bị lỗi
        
        const isSilent = error.config && error.config.headers && error.config.headers['x-silent'] === '1';
        // Kiểm tra xem lỗi có phải từ API đăng nhập Admin không
        const isLoginAdminAPI = error.config && error.config.url && error.config.url.includes('/api/LoginAdmin/login');
        const isLoginUserAPI = error.config && error.config.url && error.config.url.includes('/api/Login/login');

        // XỬ LÝ LỖI 401 (Hết hạn Token 30 phút)
        if (error.response && error.response.status === 401 && !isSilent && !isLoginAdminAPI && !isLoginUserAPI) {
            
            // Nếu chưa có quá trình làm mới token nào đang diễn ra
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    // Gọi API ngầm để gia hạn Token (CheckSession)
                    // Lưu ý: Dùng đường dẫn API của bạn, ví dụ: /api/Login/check-session
                    await axios.get(`${import.meta.env.VITE_API_URL}/api/Login/check-session`);
                    
                    isRefreshing = false;
                    
                    // Thẻ đã được gia hạn thành công (Cookie mới đã được Set)
                    // Thực hiện lại yêu cầu ban đầu bị lỗi
                    return axios(originalRequest);

                } catch (refreshError) {
                    isRefreshing = false;
                    
                    // Nếu ngay cả Refresh Token (7 ngày) cũng hết hạn hoặc bị xóa 
                    // Thì mới bắt đầu xóa thông tin và logout
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("user_info");
                    localStorage.removeItem("isLoggedIn");

                    if (!window.location.pathname.includes('/admin/login')) {
                        window.location.href = "/dang-nhap";
                    }
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

const app = createApp(App);
app.use(router);
app.mount('#app');

// Khởi động kết nối SignalR
signalRService.startConnection();