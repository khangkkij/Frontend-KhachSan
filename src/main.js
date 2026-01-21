import { createApp } from 'vue'

// ❌ DÒNG SAI (Nguyên nhân gây lỗi):
// import App from './DuanKhachSan/KhachHang/Layout.vue'; 
// -> Dòng này làm cho Web có sẵn 1 cái Layout rồi.

// ✅ SỬA THÀNH (Trỏ về file App.vue "rỗng" để Router tự xử lý):
import App from './App.vue';

import router from './DuanKhachSan/router/KhangHang.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const app = createApp(App);
app.use(router);
app.mount('#app')