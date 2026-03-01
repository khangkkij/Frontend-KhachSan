import { createApp } from 'vue'

// ❌ DÒNG SAI (Nguyên nhân gây lỗi):
// import App from './DuanKhachSan/KhachHang/Layout.vue'; 
// -> Dòng này làm cho Web có sẵn 1 cái Layout rồi.

// ✅ SỬA THÀNH (Trỏ về file App.vue "rỗng" để Router tự xử lý):
import App from './App.vue';

import router from './DuanKhachSan/router/KhangHang.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

// Font chữ & Icon (Quan trọng để hiện hình, sửa lỗi ô vuông)
import 'boxicons/css/boxicons.css'

// Scrollbar đẹp (Tùy chọn)
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import axios from 'axios';

axios.defaults.withCredentials = true; // Cho phép gửi nhận Cookie

axios.interceptors.response.use(
    response => response,
    error => {
        const isSilent = error.config && error.config.headers && error.config.headers['x-silent'] === '1';
        
        // Kiểm tra xem lỗi có phải từ API đăng nhập Admin không
        const isLoginAdminAPI = error.config && error.config.url && error.config.url.includes('/api/LoginAdmin/login');

        if (error.response && error.response.status === 401 && !isSilent && !isLoginAdminAPI) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user_info");
            localStorage.removeItem("isLoggedIn");

            // Chỉ chuyển hướng nếu KHÔNG phải đang ở trang login Admin
            if (!window.location.pathname.includes('/admin/login')) {
                window.location.href = "/dang-nhap";
            }
        }
        return Promise.reject(error);
    }
);



const app = createApp(App);
app.use(router);
app.mount('#app')