<template>
    <div class="login-page section" style="margin-top: 100px; margin-bottom: 50px;">
        <div class="container">
            <div class="row g-0 login-container">

                <div class="col-lg-6 col-md-12 login-form-col">
                    <div class="login-wrapper">
                        <div class="text-center mb-3">
                            <h2 class="text-uppercase text-orange">Xác Thực Gmail</h2>
                            <p class="text-muted" style="font-size: 13px;">
                                Mã xác thực đã được gửi đến email đăng ký của bạn.
                            </p>
                        </div>

                        <form @submit.prevent="verifyEmail">
                            <div class="row">
                                <div class="col-lg-12 mb-3">
                                    <fieldset>
                                        <label class="form-label">Mã OTP (6 số)</label>
                                        <input type="text" v-model="otp" class="form-control text-center otp-input"
                                            placeholder="000000" maxlength="6" required>
                                    </fieldset>
                                </div>
                                <button type="submit" class="orange-button w-100 border-0">
                                    <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                                    Xác thực Gmail
                                </button>
                            </div>

                            <div class="col-lg-12 text-center mt-3">
                                <div v-if="countdown > 0">
                                    <p class="text-muted mb-0" style="font-size: 13px;">Gửi lại mã sau: <span
                                            class="fw-bold text-orange">{{ countdown }}s</span></p>
                                </div>
                                <div v-else>
                                    <a href="#" @click.prevent="resendOtp" class="text-dark fw-bold"
                                        style="font-size: 13px;">Gửi lại mã OTP</a>
                                </div>
                            </div>

                            <div class="col-lg-12 text-center mt-2">
                                <router-link to="/dang-nhap" class="text-muted" style="font-size: 13px;">
                                    <i class="fa fa-arrow-left"></i> Hủy bỏ
                                </router-link>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="col-lg-6 col-md-12 d-none d-lg-block">
                    <div class="carousel slide h-100">
                        <div class="welcome-overlay">
                            <h3>Xác Thực Gmail</h3>
                            <p class="TieuDe">Hãy xác thực email để bảo vệ tài khoản</p>
                        </div>
                        <div class="carousel-inner h-100">
                            <div class="carousel-item active h-100">
                                <img src="/assets/images/property-05.jpg" class="d-block w-100 h-100 fit-cover"
                                    alt="Reset Password">
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
import Swal from 'sweetalert2'; // Chú ý đã thêm import này

export default {
    name: 'XacThucGamil',
    data() {
        return {
            otp: '',
            email: this.$route.query.email,
            isLoading: false, // Trạng thái hiệu ứng nút bấm
            countdown: 0,
            timerId: null
        }
    },
    mounted() {
        // Nếu có email, khóa gửi lại 60s để tránh spam
        if (this.email) {
            this.startCountdown(60);
        }
    },
    beforeUnmount() {
        if (this.timerId) clearInterval(this.timerId);
    },
    methods: {
        startCountdown(seconds) {
            this.countdown = seconds;
            if (this.timerId) clearInterval(this.timerId);
            this.timerId = setInterval(() => {
                if (this.countdown > 0) {
                    this.countdown--;
                } else {
                    clearInterval(this.timerId);
                    this.timerId = null;
                }
            }, 1000);
        },

        async verifyEmail() {
            // Kiểm tra độ dài mã trước khi gửi
            if (this.otp.length < 6) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Thông báo',
                    text: 'Vui lòng nhập đủ 6 số OTP.',
                    confirmButtonColor: '#f35525'
                });
                return;
            }

            this.isLoading = true;
            // Hiển thị trạng thái đang xử lý
            Swal.fire({
                title: 'Đang xác thực...',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading() }
            });

            try {
                const apiUrl = `${import.meta.env.VITE_API_URL}/api/Login/verify-otp`;
                const response = await axios.put(apiUrl, null, {
                    params: {
                        email: this.email,
                        otpKhachNhap: this.otp
                    }
                });

                if (response.status === 200) {
                    // Thay thế alert thành công bằng Swal
                    Swal.fire({
                        icon: 'success',
                        title: 'Xác thực thành công!',
                        text: 'Tài khoản của bạn đã được kích hoạt. Hãy đăng nhập ngay.',
                        confirmButtonColor: '#f35525'
                    }).then(() => {
                        this.$router.push('/dang-nhap');
                    });
                }
            } catch (error) {
                // Thay thế alert lỗi bằng Swal
                const msg = error.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn!";
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi xác thực',
                    text: msg,
                    confirmButtonColor: '#1e1e1e'
                });
            } finally {
                this.isLoading = false;
            }
        },

        async resendOtp() {
            if (this.countdown > 0) {
                Swal.fire({ icon: 'info', title: 'Chờ đã', text: `Vui lòng chờ ${this.countdown}s trước khi gửi lại.` });
                return;
            }

            console.log('resendOtp called, email=', this.email);

            if (!this.email) {
                Swal.fire({ icon: 'warning', title: 'Lỗi', text: 'Email không hợp lệ hoặc không được truyền.' });
                return;
            }

            Swal.fire({
                title: 'Đang gửi lại mã...',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading() }
            });

            try {
                const apiUrl = `${import.meta.env.VITE_API_URL}/api/Login/resend-otp`;
                const response = await axios.post(apiUrl, null, { params: { email: this.email } });
                console.log('resendOtp response', response);

                Swal.fire({
                    icon: 'success',
                    title: 'Đã gửi mã mới!',
                    text: response.data?.message || 'Vui lòng kiểm tra lại hòm thư Gmail của bạn.',
                    timer: 2000,
                    showConfirmButton: false
                });
                this.otp = '';

                // Bật cooldown 60s
                this.startCountdown(60);
            } catch (error) {
                console.log('resendOtp error', error);
                const msg = error.response?.data?.message || error.message || 'Không thể kết nối đến máy chủ để gửi lại mã!';
                Swal.fire({ icon: 'error', title: 'Thất bại', text: msg, confirmButtonColor: '#1e1e1e' });
            }
        }
    }
}
</script>

<style scoped>
/* Style Layout cũ */
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
    padding: 30px;
}

/* Giảm padding chút cho đỡ dài */
.login-wrapper {
    width: 100%;
    max-width: 400px;
}

.text-orange {
    color: #f35525;
    font-weight: 700;
}

.form-label {
    font-weight: 500;
    font-size: 13px;
    color: #333;
    margin-bottom: 5px;
}

/* OTP Input Style */
.otp-input {
    letter-spacing: 5px;
    font-size: 20px;
    font-weight: 700;
    color: #f35525;
    height: 50px;
}

.otp-input::placeholder {
    letter-spacing: 1px;
    font-size: 14px;
    color: #ccc;
    font-weight: 400;
}

/* Password Input Style */
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

/* Button */
.orange-button {
    background-color: #1e1e1e;
    color: #fff;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 600;
    padding: 12px 20px;
    border-radius: 25px;
    transition: all .3s;
}

.orange-button:hover {
    background-color: #f35525;
    box-shadow: 0px 5px 15px rgba(243, 85, 37, 0.3);
}

/* Right Column */
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
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 10px;
}

.TieuDe {
    color: #fff;
}

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