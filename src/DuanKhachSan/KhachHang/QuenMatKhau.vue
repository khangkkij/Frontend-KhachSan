<template>
    <div class="login-page section" style="margin-top: 100px; margin-bottom: 50px;">
        <div class="container">
            <div class="row g-0 login-container">

                <div class="col-lg-6 col-md-12 login-form-col">
                    <div class="login-wrapper">
                        <div class="text-center mb-4">
                            <h2 class="text-uppercase text-orange">Quên Mật Khẩu?</h2>
                            <p class="text-muted">Đừng lo! Nhập email để lấy lại mật khẩu.</p>
                        </div>

                        <form @submit.prevent="handleReset">
                            <div class="row">
                                <div class="col-lg-12 mb-4">
                                    <fieldset>
                                        <label for="email" class="form-label">Địa chỉ Email đã đăng ký</label>
                                        <input type="email" v-model="email" id="email" class="form-control"
                                            placeholder="Nhập email của bạn..." required>
                                    </fieldset>
                                </div>

                                <div class="col-lg-12">
                                    <button type="submit" class="orange-button w-100 border-0">
                                        <i class="fa fa-paper-plane"></i> Gửi Yêu Cầu
                                    </button>
                                </div>

                                <div class="col-lg-12 text-center mt-4">
                                    <p class="mb-0">Bạn đã nhớ ra mật khẩu?
                                        <router-link to="/dang-nhap" class="text-dark fw-bold">
                                            <i class="fa fa-arrow-left"></i> Quay lại Đăng nhập
                                        </router-link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="col-lg-6 col-md-12 d-none d-lg-block">
                    <div class="carousel slide h-100">
                        <div class="welcome-overlay">
                            <h3>Bảo Mật & An Toàn</h3>
                            <p class="TieuDe">Chúng tôi luôn bảo vệ thông tin của bạn</p>
                        </div>
                        <div class="carousel-inner h-100">
                            <div class="carousel-item active h-100">
                                <img src="/assets/images/property-03.jpg" class="d-block w-100 h-100 fit-cover"
                                    alt="Security">
                            </div>
                        </div>
                        <div class="overlay-orange"></div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    name: 'QuenMatKhau',
    data() {
        return {
            email: ''
        }
    },
    methods: {
        async handleReset() {
            // Hiển thị loading
            Swal.fire({
                title: 'Đang xử lý...',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading() }
            });

            try {
                const apiUrl = `${import.meta.env.VITE_API_URL}/api/Login/forgot-password`;
                // Gửi email qua Query String như Backend yêu cầu
                await axios.post(apiUrl, null, { params: { email: this.email } });

                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Mã xác thực đã được gửi vào Email của bạn!',
                    confirmButtonColor: '#f35525'
                }).then(() => {
                    // Chuyển sang trang nhập OTP và truyền email theo kèm
                    this.$router.push({
                        path: '/xac-nhan-otp',
                        query: { email: this.email }
                    });
                });
            } catch (error) {
                const msg = error.response?.data?.message || "Email không tồn tại trong hệ thống!";
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: msg
                });
            }
        }
    }
}
</script>

<style scoped>
/* Tận dụng lại CSS của trang Đăng nhập để đồng bộ */
.login-container {
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    min-height: 500px;
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
    height: 50px;
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

/* Nút bấm */
.orange-button {
    background-color: #f35525;
    color: #fff;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 600;
    padding: 12px 20px;
    border-radius: 25px;
    transition: all .3s;
}

.orange-button:hover {
    background-color: #ca3c12;
    box-shadow: 0px 5px 15px rgba(243, 85, 37, 0.3);
}

/* Phần ảnh bên phải */
.fit-cover {
    object-fit: cover;
}

.welcome-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 20;
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
    color: #fff;
}

/* Thêm lớp phủ tối màu lên ảnh để chữ dễ đọc */
.overlay-orange {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(30, 30, 30, 0.6) 0%, rgba(243, 85, 37, 0.4) 100%);
    z-index: 10;
}
</style>