<template>
    <div class="register-page section" style="margin-top: 100px; margin-bottom: 50px;">
        <div class="container">
            <div class="row g-0 register-container">

                <div class="col-lg-6 col-md-12 register-form-col">
                    <div class="register-wrapper">
                        <div class="text-center mb-4">
                            <h2 class="text-uppercase text-orange">Đăng Ký Thành Viên</h2>
                            <p class="text-muted">Điền thông tin để tham gia cùng chúng tôi</p>
                        </div>

                        <form id="register-form" @submit.prevent="handleRegister">
                            <div class="row">
                                <div class="col-lg-12 mb-3">
                                    <fieldset>
                                        <label class="form-label">Họ và Tên (*)</label>
                                        <input type="text" v-model="fullName" class="form-control"
                                            placeholder="Nguyễn Văn A" required>
                                    </fieldset>
                                </div>

                                <div class="col-lg-12 mb-3">
                                    <fieldset>
                                        <label class="form-label">Email (*)</label>
                                        <input type="email" v-model="email" class="form-control"
                                            placeholder="name@example.com" required>
                                    </fieldset>
                                </div>

                                <div class="col-lg-6 mb-3">
                                    <fieldset>
                                        <label class="form-label">Số điện thoại (*)</label>
                                        <input type="tel" v-model="phone" class="form-control" placeholder="09xxxxxxx"
                                            required>
                                    </fieldset>
                                </div>

                                <div class="col-lg-6 mb-3">
                                    <fieldset>
                                        <label class="form-label">Giới tính (*)</label>
                                        <select v-model="gender" class="form-control form-select" required>
                                            <option value="" disabled selected>Chọn giới tính</option>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                            <option value="Khác">Khác</option>
                                        </select>
                                    </fieldset>
                                </div>

                                <div class="col-lg-12 mb-3">
                                    <fieldset>
                                        <label class="form-label">Căn cước công dân (*)</label>
                                        <input type="text" v-model="cccd" class="form-control"
                                            placeholder="Số CCCD/CMND" required>
                                    </fieldset>
                                </div>

                                <div class="col-lg-6 mb-3">
                                    <fieldset>
                                        <label class="form-label">Mật khẩu (*)</label>
                                        <input type="password" v-model="password" class="form-control"
                                            placeholder="******" required>
                                    </fieldset>
                                </div>

                                <div class="col-lg-6 mb-3">
                                    <fieldset>
                                        <label class="form-label">Nhập lại mật khẩu (*)</label>
                                        <input type="password" v-model="confirmPassword" class="form-control"
                                            placeholder="******" required>
                                    </fieldset>
                                </div>

                                <div class="col-lg-12 mb-4">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="agreeTerms"
                                            id="agreeTerms" required>
                                        <label class="form-check-label" for="agreeTerms">
                                            Tôi đồng ý với <a href="#" class="text-orange">Điều khoản & Chính sách</a>
                                        </label>
                                    </div>
                                </div>

                                <div class="col-lg-12">
                                    <button type="submit" class="orange-button w-100 border-0">Đăng Ký Tài
                                        Khoản</button>
                                </div>

                                <div class="col-lg-12 text-center mt-4">
                                    <p class="mb-0">Đã có tài khoản?
                                        <router-link to="/dang-nhap" class="text-dark fw-bold">Đăng nhập
                                            ngay</router-link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="col-lg-6 col-md-12 d-none d-lg-block">
                    <div id="carouselRegister" class="carousel slide carousel-fade h-100" data-bs-ride="carousel"
                        data-bs-interval="3500">
                        <div class="welcome-overlay">
                            <h3>Trở thành thành viên<br>Luxury Club</h3>
                            <p>Nhận ưu đãi độc quyền & trải nghiệm tuyệt vời</p>
                        </div>
                        <div class="carousel-inner h-100">
                            <div class="carousel-item active h-100">
                                <img src="/assets/images/property-01.jpg" class="d-block w-100 h-100 fit-cover"
                                    alt="Luxury Villa">
                            </div>
                            <div class="carousel-item h-100">
                                <img src="/assets/images/property-02.jpg" class="d-block w-100 h-100 fit-cover"
                                    alt="Luxury Pool">
                            </div>
                            <div class="carousel-item h-100">
                                <img src="/assets/images/property-03.jpg" class="d-block w-100 h-100 fit-cover"
                                    alt="Luxury Room">
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
/* global $ */
import axios from 'axios'; // Đừng quên import axios

export default {
    name: 'DangKy',
    data() {
        return {
            fullName: '',
            email: '',
            phone: '',
            gender: '', // Mới thêm
            cccd: '',   // Mới thêm
            password: '',
            confirmPassword: '',
            agreeTerms: false
        }
    },
    mounted() {
        if ($('.menu-trigger').length) {
            $(".menu-trigger").on('click', function () {
                $(this).toggleClass('active');
                $('.header-area .nav').slideToggle(200);
            });
        }
    },
    methods: {
        async handleRegister() {
            // 1. Kiểm tra mật khẩu khớp
            if (this.password !== this.confirmPassword) {
                alert("Mật khẩu nhập lại không khớp!");
                return;
            }
            // 2. Kiểm tra điều khoản
            if (!this.agreeTerms) {
                alert("Bạn cần đồng ý với điều khoản!");
                return;
            }
            // 3. Kiểm tra độ dài mật khẩu (Frontend check nhanh)
            if (this.password.length < 6) {
                alert("Mật khẩu phải có ít nhất 6 ký tự!");
                return;
            }

            try {
                // 4. Chuẩn bị dữ liệu gửi đi
                // Tên trường (Key) phải KHỚP CHÍNH XÁC với Class 'RegisterRequest' trong C#
                const registerData = {
                    HoVaTen: this.fullName,
                    Email: this.email,
                    MatKhau: this.password,
                    Sdt: this.phone,
                    GioiTinh: this.gender,
                    Cccd: this.cccd
                };

                // 5. Gọi API
                // Dùng biến môi trường hoặc link cứng nếu bạn chưa sửa file .env
                // const apiUrl = `${import.meta.env.VITE_API_URL}/api/Login/register`;
                const apiUrl = `${import.meta.env.VITE_API_URL}/api/Login/register`;

                const response = await axios.post(apiUrl, registerData);

                if (response.status === 200) {
                    alert("Đăng ký thành công! Hãy đăng nhập ngay.");
                    this.$router.push('/dang-nhap');
                }

            } catch (error) {
                if (error.response) {
                    // Lỗi từ Server trả về (ví dụ: Email trùng)
                    const msg = error.response.data.message || JSON.stringify(error.response.data);
                    alert("Đăng ký thất bại: " + msg);
                } else {
                    console.error(error);
                    alert("Không thể kết nối đến Server!");
                }
            }
        }
    }
}
</script>

<style scoped>
/* CSS giữ nguyên, chỉ thay đổi vị trí HTML */
.register-container {
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    min-height: 600px;
}

.register-form-col {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
}

.register-wrapper {
    width: 100%;
    max-width: 500px;
}

.text-orange {
    color: #f35525;
    font-weight: 700;
}

.text-orange:hover {
    text-decoration: underline;
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

/* Style cho thẻ select giống input */
.form-select {
    background-color: #f4f4f4;
    border: none;
    height: 45px;
    padding-left: 15px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
}

.form-label {
    font-weight: 500;
    font-size: 13px;
    color: #333;
    margin-bottom: 5px;
}

.orange-button {
    background-color: #1e1e1e;
    color: #fff;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 500;
    padding: 12px 20px;
    border-radius: 25px;
    transition: all .3s;
}

.orange-button:hover {
    background-color: #f35525;
}

/* Slider Style */
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

.carousel-item::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
}
</style>