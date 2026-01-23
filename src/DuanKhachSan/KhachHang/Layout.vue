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

                            <li>
                                <router-link to="/dang-nhap">
                                    <i class="fa fa-user"></i> Tài khoản
                                </router-link>
                            </li>
                        </ul>

                        <a class='menu-trigger'>
                            <span>Menu</span>
                        </a>
                    </nav>
                </div>
            </div>
        </div>
    </header>

    <div style="min-height: 600px;"> <router-view></router-view>
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
                                <p>Trải nghiệm kỳ nghỉ đẳng cấp quốc tế với hệ thống phòng ốc sang trọng và dịch vụ tận tâm. Chúng tôi mang đến cho bạn cảm giác như đang ở nhà.</p>
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
                                <li><router-link to="/contact">Liên hệ</router-link></li>
                                <li><router-link to="/policy">Chính sách</router-link></li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-4 col-md-6 mb-50">
                        <div class="footer-widget">
                            <div class="footer-widget-heading">
                                <h3>Đăng Ký Nhận Tin</h3>
                            </div>
                            <div class="footer-text mb-25">
                                <p>Đừng bỏ lỡ những ưu đãi mới nhất của chúng tôi, hãy nhập email ngay bên dưới.</p>
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
export default {
    name: 'KhachHangLayout',
    mounted() {
        // Logic JS cho Menu Mobile
        if ($('.menu-trigger').length) {
            $(".menu-trigger").off('click');

            $(".menu-trigger").on('click', function () {
                $(this).toggleClass('active');
                $('.header-area .nav').slideToggle(200);
            });
        }
    }
}
</script>

<style scoped>
/* Màu chủ đạo */
.text-orange { color: #f35525 !important; }

/* Footer Main */
.footer-section {
    background: #151414;
    position: relative;
    margin-top: 50px;
}

.footer-content {
    position: relative;
    z-index: 2;
}

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

/* Màu Social Icon */
.facebook-bg { background: #3B5998; }
.twitter-bg { background: #55ACEE; }
.google-bg { background: #DD4B39; }

.footer-social-icon a:hover { transform: translateY(-5px); }

/* Widget Heading */
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

/* Danh sách link */
.footer-widget ul {
    margin: 0px;
    padding: 0px;
}

.footer-widget ul li {
    display: inline-block;
    width: 50%; /* Chia thành 2 cột */
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

/* Form đăng ký */
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
.subscribe-form input:focus { outline: none; border-color: #f35525; }

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
.subscribe-form button:hover { background: #d14015; }

.subscribe-form button i {
    color: #fff;
    font-size: 22px;
    transform: rotate(-6deg);
}

/* Copyright Area */
.copyright-area {
    background: #202020;
    padding: 25px 0;
}

.copyright-text p {
    margin: 0;
    font-size: 14px;
    color: #878787;
}

.copyright-text p a {
    color: #f35525;
    text-decoration: none;
    font-weight: 600;
}

.footer-menu ul {
    margin: 0;
    padding: 0;
}

.footer-menu ul li {
    display: inline-block;
    margin-left: 20px;
}

.footer-menu ul li a {
    font-size: 14px;
    color: #878787;
    text-decoration: none;
    transition: .3s;
}

.footer-menu ul li a:hover { color: #f35525; }

.contact-info p { color: #878787; font-size: 14px; margin-bottom: 8px; }
</style>