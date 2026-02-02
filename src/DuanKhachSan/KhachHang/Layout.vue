<template>
    <header class="header-area header-sticky text-center header-sticky-active"
        style="background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <nav class="main-nav">
                        <a href="/" class="logo">
                            <h1>Luxury</h1>
                        </a>

                        <ul class="nav">
                            <li><router-link to="/">Trang chủ</router-link></li>
                            <li><router-link to="/danh-sach-phong">Danh sách phòng</router-link></li>
                            <li><router-link to="/voucher">Voucher</router-link></li>

                            <li v-if="!isLoggedIn">
                                <router-link to="/dang-nhap">
                                    <i class="fa fa-user"></i> Đăng nhập
                                </router-link>
                            </li>

                            <template v-else>
                                <li>
                                    <router-link to="/ProfileSidebar" style="color: #f35525; font-weight: bold;">
                                        <i class="fa fa-user-circle"></i> {{ user.name }}
                                    </router-link>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" @click="handleLogout" class="logout-btn">
                                        <i class="fa fa-sign-out-alt"></i> Đăng xuất
                                    </a>
                                </li>
                            </template>

                        </ul>

                        <a class='menu-trigger'>
                            <span>Menu</span>
                        </a>
                    </nav>
                </div>
            </div>
        </div>
    </header>

    <div style="min-height: 600px;">
        <router-view></router-view>
    </div>

    <footer class="footer-section">
        <div class="container">
            <div class="footer-content pt-5 pb-5">
                <div class="row">
                    <div class="col-xl-4 col-lg-4 mb-50">
                        <div class="footer-widget">
                            <div class="footer-logo">
                                <h3 class="fw-bold text-white">LUXURY <span class="text-orange">HOTEL</span></h3>
                            </div>
                            <div class="footer-text">
                                <p>Trải nghiệm kỳ nghỉ đẳng cấp quốc tế với hệ thống phòng ốc sang trọng và dịch vụ tận
                                    tâm.
                                </p>
                            </div>
                            <div class="footer-social-icon">
                                <span>Theo dõi ngay</span>
                                <a href="#"><i class="fab fa-facebook-f facebook-bg"></i></a>
                                <a href="#"><i class="fab fa-twitter twitter-bg"></i></a>
                                <a href="#"><i class="fab fa-google-plus-g google-bg"></i></a>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-4 col-md-6 mb-30">
                        <div class="footer-widget">
                            <div class="footer-widget-heading">
                                <h3>Liên Kết Nhanh</h3>
                            </div>
                            <ul>
                                <li><router-link to="/">Trang chủ</router-link></li>
                                <li><router-link to="/about">Về chúng tôi</router-link></li>
                                <li><router-link to="/rooms">Danh sách phòng</router-link></li>
                                <li><router-link to="/services">Dịch vụ</router-link></li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-4 col-md-6 mb-50">
                        <div class="footer-widget">
                            <div class="footer-widget-heading">
                                <h3>Đăng Ký Nhận Tin</h3>
                            </div>
                            <div class="subscribe-form">
                                <form action="#">
                                    <input type="text" placeholder="Địa chỉ Email">
                                    <button><i class="fab fa-telegram-plane"></i></button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
/* global $ */
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    name: 'KhachHangLayout',
    data() {
        return {
            isLoggedIn: false,
            user: {}
        }
    },
    mounted() {
        // 1. "Đón" dữ liệu từ URL do Backend gửi về
        const urlParams = new URLSearchParams(window.location.search);
        const isLoginSuccess = urlParams.get('login_success');
        const nameFromFB = urlParams.get('name');
        const emailFromFB = urlParams.get('email');
        const provider = urlParams.get('provider'); // Lấy provider (google hoặc facebook)

        if (isLoginSuccess === 'true' && nameFromFB && provider) {
            // 2. Tạo object đúng định dạng mà hàm checkLoginStatus() yêu cầu
            const userInfo = {
                name: nameFromFB,
                email: emailFromFB
            };

            // 3. Lưu vào localStorage
            localStorage.setItem('user_info', JSON.stringify(userInfo));
            localStorage.setItem('isLoggedIn', 'true');

            // 4. Xóa tham số trên URL cho sạch đẹp
            window.history.replaceState({}, document.title, "/");

            // 5. Cập nhật trạng thái hiển thị ngay lập tức
            this.isLoggedIn = true;
            this.user.name = nameFromFB;

            // 6. Hiển thị thông báo khác nhau dựa trên provider
            let providerText = "Hệ thống";
            if (provider === 'facebook') providerText = "Facebook";
            else if (provider === 'google') providerText = "Google";

            Swal.fire({
                title: 'Đăng nhập thành công!',
                text: `Xin chào ${nameFromFB}, bạn đã đăng nhập bằng ${providerText}.`,
                icon: 'success',
                confirmButtonColor: '#f35525'
            });
        } else {
            // Nếu không phải từ Facebook/Google về thì kiểm tra dữ liệu cũ đã lưu
            this.checkLoginStatus();
        }
    },
    methods: {
        checkLoginStatus() {
            const userStr = localStorage.getItem('user_info');
            if (userStr) {
                this.isLoggedIn = true;
                this.user = JSON.parse(userStr);
            } else {
                this.isLoggedIn = false;
                this.user = {};
            }
        },
        async handleLogout() {
            if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
                try {
                    // --- SỬA LỖI URL ---
                    // Nếu import.meta.env.VITE_API_URL bị undefined thì dùng luôn link cứng
                    const baseUrl = import.meta.env.VITE_API_URL || 'https://localhost:7023';

                    await axios.post(
                        `${baseUrl}/api/Login/logout`,
                        {},
                        { withCredentials: true }
                    );
                } catch (error) {
                    console.error("Lỗi đăng xuất server:", error);
                    // Dù lỗi server vẫn cho client đăng xuất
                }

                // Xóa dữ liệu Client
                localStorage.removeItem('user_info');
                localStorage.removeItem('isLoggedIn');

                Swal.fire({
                    title: 'Đã đăng xuất!',
                    text: 'Bạn đã đăng xuất thành công.',
                    icon: 'success',
                    confirmButtonColor: '#f35525'
                }).then(() => {
                    window.location.href = '/dang-nhap';
                });
            }
        }
    }
}
</script>
<style scoped>
/* Màu chủ đạo */
.text-orange {
    color: #f35525 !important;
}

/* Thêm style cho nút đăng xuất */
.logout-btn {
    cursor: pointer;
    color: #333;
    font-weight: 500;
}

.logout-btn:hover {
    color: #f35525 !important;
}

/* Các CSS Footer của bạn giữ nguyên bên dưới... */
.footer-section {
    background: #151414;
    position: relative;
    margin-top: 50px;
}

.footer-content {
    position: relative;
    z-index: 2;
}

/* ... (Copy nốt phần CSS cũ của bạn vào đây) ... */
.footer-text p {
    margin-bottom: 14px;
    font-size: 14px;
    color: #7e7e7e;
    line-height: 28px;
}

.footer-social-icon span {
    color: #fff;
    display: block;
    font-size: 20px;
    font-weight: 700;
    font-family: 'Poppins', sans-serif;
    margin-bottom: 20px;
}

.footer-social-icon a {
    color: #fff;
    font-size: 16px;
    margin-right: 15px;
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 50%;
    transition: 0.3s;
}

.facebook-bg {
    background: #3B5998;
}

.twitter-bg {
    background: #55ACEE;
}

.google-bg {
    background: #DD4B39;
}

.footer-social-icon a:hover {
    transform: translateY(-5px);
}

.footer-widget-heading h3 {
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 40px;
    position: relative;
}

.footer-widget-heading h3::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: -15px;
    height: 2px;
    width: 50px;
    background: #f35525;
}

.footer-widget ul {
    margin: 0px;
    padding: 0px;
}

.footer-widget ul li {
    display: inline-block;
    width: 50%;
    margin-bottom: 12px;
}

.footer-widget ul li a {
    color: #878787;
    text-transform: capitalize;
    text-decoration: none;
    transition: .3s;
}

.footer-widget ul li a:hover {
    color: #f35525;
    padding-left: 5px;
}

.subscribe-form {
    position: relative;
    overflow: hidden;
}

.subscribe-form input {
    width: 100%;
    padding: 14px 28px;
    background: #2E2E2E;
    border: 1px solid #2E2E2E;
    color: #fff;
    border-radius: 30px;
}

.subscribe-form input:focus {
    outline: none;
    border-color: #f35525;
}

.subscribe-form button {
    position: absolute;
    right: 0;
    background: #f35525;
    padding: 13px 20px;
    border: 1px solid #f35525;
    top: 0;
    color: #fff;
    border-radius: 0 30px 30px 0;
    cursor: pointer;
    transition: 0.3s;
}

.subscribe-form button:hover {
    background: #d14015;
}

.subscribe-form button i {
    color: #fff;
    font-size: 22px;
    transform: rotate(-6deg);
}
</style>