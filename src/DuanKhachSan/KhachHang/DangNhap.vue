<template>
    <div class="login-page section" style="margin-top: 100px; margin-bottom: 50px;">
        <div class="container">
            <div class="row g-0 login-container">

                <div class="col-lg-6 col-md-12 login-form-col">
                    <div class="login-wrapper">
                        <div class="text-center mb-4">
                            <h2 class="text-uppercase text-orange">Đăng Nhập</h2>
                            <p class="text-muted">Truy cập vào hệ thống khách sạn Luxury</p>
                        </div>

                        <form id="login-form" @submit.prevent="handleLogin">
                            <div class="row">
                                <div class="col-lg-12 mb-3">
                                    <fieldset>
                                        <label for="email" class="form-label">Địa chỉ Email</label>
                                        <input type="email" v-model="email" id="email" class="form-control"
                                            placeholder="Nhập email của bạn..." required>
                                    </fieldset>
                                </div>

                                <div class="col-lg-12 mb-3">
                                    <fieldset>
                                        <label for="password" class="form-label">Mật khẩu</label>
                                        <input type="password" v-model="password" id="password" class="form-control"
                                            placeholder="Nhập mật khẩu..." required>
                                    </fieldset>
                                </div>

                                <div class="col-lg-12 d-flex justify-content-between align-items-center mb-4">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="rememberMe"
                                            id="rememberMe">
                                        <label class="form-check-label" for="rememberMe">Ghi nhớ đăng nhập</label>
                                    </div>
                                    <router-link to="/quen-mat-khau" class="forgot-pass">Quên mật khẩu?</router-link>
                                </div>

                                <div class="col-lg-12">
                                    <button type="submit" class="orange-button w-100 border-0">Đăng Nhập Ngay</button>
                                </div>

                                <div class="col-lg-12 text-center my-3">
                                    <span class="text-muted" style="font-size: 13px;">Hoặc đăng nhập bằng</span>
                                </div>

                                <div class="col-lg-12 mb-2">
                                    <button type="button" class="social-button google-btn w-100" @click="loginGoogle">
                                        <i class="fab fa-google"></i> Google
                                    </button>
                                </div>
                                <div class="col-lg-12">
                                    <button type="button" class="social-button facebook-btn w-100"
                                        @click="loginFacebook">
                                        <i class="fab fa-facebook-f"></i> Facebook
                                    </button>
                                </div>
                                <div class="col-lg-12 text-center mt-4">
                                    <p class="mb-0">Bạn chưa có tài khoản?
                                        <router-link to="/dang-ky" class="text-dark fw-bold">Đăng ký mới</router-link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="col-lg-6 col-md-12 d-none d-lg-block">
                    <div id="carouselExampleFade" class="carousel slide carousel-fade h-100" data-bs-ride="carousel"
                        data-bs-interval="3000">

                        <div class="welcome-overlay">
                            <h3>Chào mừng đến với<br>Luxury Hotel</h3>
                            <p class="TieuDe">Trải nghiệm đẳng cấp thượng lưu</p>
                        </div>

                        <div class="carousel-inner h-100">
                            <div class="carousel-item active h-100">
                                <img src="/assets/images/deal-01.jpg" class="d-block w-100 h-100 fit-cover"
                                    alt="Luxury Hotel 1">
                            </div>
                            <div class="carousel-item h-100">
                                <img src="/assets/images/deal-02.jpg" class="d-block w-100 h-100 fit-cover"
                                    alt="Luxury Hotel 2">
                            </div>
                            <div class="carousel-item h-100">
                                <img src="/assets/images/deal-03.jpg" class="d-block w-100 h-100 fit-cover"
                                    alt="Luxury Hotel 3">
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DangNhap',
    data() {
        return {
            email: '',
            password: '',
            rememberMe: false
        }
    },
    methods: {
        handleLogin() {
            console.log("Đăng nhập thường:", this.email, this.password);
            alert(`Đang đăng nhập với email: ${this.email}`);
        },
        loginGoogle() {
            alert("Tính năng Đăng nhập Google đang được phát triển!");
        },
        loginFacebook() {
            alert("Tính năng Đăng nhập Facebook đang được phát triển!");
        }
    }
}
</script>

<style scoped>
/* CSS Gốc */
.login-container {
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    min-height: 550px;
}

.login-form-col {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
}

.login-wrapper {
    width: 100%;
    max-width: 400px;
}

.text-orange {
    color: #f35525;
    font-weight: 700;
}

.form-control {
    background-color: #f4f4f4;
    border: none;
    height: 45px;
    padding-left: 15px;
    font-size: 14px;
    border-radius: 5px;
}

.form-control:focus {
    background-color: #fff;
    border: 1px solid #f35525;
    box-shadow: none;
}

.form-label {
    font-weight: 500;
    font-size: 14px;
    color: #333;
}

.forgot-pass {
    font-size: 13px;
    color: #f35525;
    font-weight: 500;
}

/* --- CHỈNH SỬA MÀU NÚT --- */
.orange-button {
    background-color: #f35525;
    /* Mặc định là màu Cam */
    color: #fff;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 500;
    padding: 12px 20px;
    border-radius: 25px;
    transition: all .3s;
}

.orange-button:hover {
    background-color: #ca3c12;
    /* Khi hover: Màu cam đậm hơn (không phải đen) */
    box-shadow: 0px 5px 15px rgba(243, 85, 37, 0.3);
    /* Thêm chút bóng đổ màu cam cho đẹp */
}

/* Slider & Overlay */
.fit-cover {
    object-fit: cover;
}

.welcome-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    text-align: center;
    color: #fff;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
    width: 100%;
}

.welcome-overlay h3 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 10px;
}

.TieuDe {
    color: rgb(255, 255, 255);
}

.welcome-overlay p {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 1px;
}

.carousel-item::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
}

/* Nút Mạng xã hội */
.social-button {
    border: none;
    height: 45px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.google-btn {
    background-color: #fff;
    color: #db4437;
    border: 1px solid #db4437;
}

.google-btn:hover {
    background-color: #db4437;
    color: #fff;
}

.facebook-btn {
    background-color: #3b5998;
    color: #fff;
}

.facebook-btn:hover {
    background-color: #2d4373;
}
</style>