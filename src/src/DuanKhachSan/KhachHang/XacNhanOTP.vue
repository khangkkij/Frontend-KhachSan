<template>
    <div class="login-page section" style="margin-top: 100px; margin-bottom: 50px;">
        <div class="container">
            <div class="row g-0 login-container">

                <div class="col-lg-6 col-md-12 login-form-col">
                    <div class="login-wrapper">
                        <div class="text-center mb-3">
                            <h2 class="text-uppercase text-orange">Đặt Lại Mật Khẩu</h2>
                            <p class="text-muted" style="font-size: 13px;">
                                Mã xác thực đã gửi đến <strong>admin@example.com</strong>
                            </p>
                        </div>

                        <form @submit.prevent="handleResetPassword">
                            <div class="row">
                                <div class="col-lg-12 mb-3">
                                    <fieldset>
                                        <label class="form-label">Mã OTP (6 số)</label>
                                        <input type="text" v-model="otp" class="form-control text-center otp-input"
                                            placeholder="000000" maxlength="6" required>
                                    </fieldset>
                                </div>

                                <div class="col-lg-12 mb-3">
                                    <fieldset>
                                        <label class="form-label">Mật khẩu mới</label>
                                        <input type="password" v-model="newPassword" class="form-control"
                                            placeholder="Nhập mật khẩu mới..." required>
                                    </fieldset>
                                </div>

                                <div class="col-lg-12 mb-4">
                                    <fieldset>
                                        <label class="form-label">Nhập lại mật khẩu</label>
                                        <input type="password" v-model="confirmPassword" class="form-control"
                                            placeholder="Nhập lại lần nữa..." required>
                                    </fieldset>
                                </div>

                                <div class="col-lg-12">
                                    <button type="submit" class="orange-button w-100 border-0">
                                        Đổi Mật Khẩu & Đăng Nhập
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
                            </div>
                        </form>
                    </div>
                </div>

                <div class="col-lg-6 col-md-12 d-none d-lg-block">
                    <div class="carousel slide h-100">
                        <div class="welcome-overlay">
                            <h3>Thiết Lập Mật Khẩu Mới</h3>
                            <p class="TieuDe">Hãy sử dụng mật khẩu mạnh để bảo vệ tài khoản</p>
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
export default {
    name: 'XacNhanOTP',
    data() {
        return {
            otp: '',
            newPassword: '',
            confirmPassword: '',
            countdown: 60,
            timer: null
        }
    },
    mounted() {
        this.startTimer();
    },
    methods: {
        startTimer() {
            this.countdown = 60;
            if (this.timer) clearInterval(this.timer);
            this.timer = setInterval(() => {
                if (this.countdown > 0) this.countdown--;
                else clearInterval(this.timer);
            }, 1000);
        },
        handleResetPassword() {
            // 1. Kiểm tra OTP
            if (this.otp.length < 6) {
                alert("Mã OTP không hợp lệ (phải đủ 6 số)!");
                return;
            }
            // 2. Kiểm tra mật khẩu khớp nhau
            if (this.newPassword !== this.confirmPassword) {
                alert("Mật khẩu nhập lại không khớp!");
                return;
            }
            // 3. Giả lập gửi lên server
            console.log("Dữ liệu đổi pass:", {
                otp: this.otp,
                newPass: this.newPassword
            });

            alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            // Chuyển về trang đăng nhập
            this.$router.push('/dang-nhap');
        },
        resendOtp() {
            alert("Mã mới đã được gửi vào email!");
            this.startTimer();
        }
    },
    beforeUnmount() {
        if (this.timer) clearInterval(this.timer);
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