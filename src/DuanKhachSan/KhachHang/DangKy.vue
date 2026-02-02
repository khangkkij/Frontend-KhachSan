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
                                            :class="{ 'is-invalid': errors.fullName }" placeholder="Nguyễn Văn A">
                                        <span class="error-text" v-if="errors.fullName">{{ errors.fullName }}</span>
                                    </fieldset>
                                </div>

                                <div class="col-lg-12 mb-3">
                                    <fieldset>
                                        <label class="form-label">Email (*)</label>
                                        <input type="email" v-model="email" class="form-control"
                                            :class="{ 'is-invalid': errors.email }" placeholder="name@example.com">
                                        <span class="error-text" v-if="errors.email">{{ errors.email }}</span>
                                    </fieldset>
                                </div>

                                <div class="col-lg-6 mb-3">
                                    <fieldset>
                                        <label class="form-label">Số điện thoại (*)</label>
                                        <input type="tel" v-model="phone" class="form-control"
                                            :class="{ 'is-invalid': errors.phone }" placeholder="09xxxxxxx">
                                        <span class="error-text" v-if="errors.phone">{{ errors.phone }}</span>
                                    </fieldset>
                                </div>

                                <div class="col-lg-6 mb-3">
                                    <fieldset>
                                        <label class="form-label">Giới tính (*)</label>
                                        <select v-model="gender" class="form-control form-select"
                                            :class="{ 'is-invalid': errors.gender }">
                                            <option value="" disabled selected>Chọn giới tính</option>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                            <option value="Khác">Khác</option>
                                        </select>
                                        <span class="error-text" v-if="errors.gender">{{ errors.gender }}</span>
                                    </fieldset>
                                </div>

                                <div class="col-lg-12 mb-3">
                                    <fieldset>
                                        <label class="form-label">Căn cước công dân (*)</label>
                                        <input type="text" v-model="cccd" class="form-control"
                                            :class="{ 'is-invalid': errors.cccd }" placeholder="Số CCCD (12 chữ số)">
                                        <span class="error-text" v-if="errors.cccd">{{ errors.cccd }}</span>
                                    </fieldset>
                                </div>

                                <div class="col-lg-6 mb-3">
                                    <fieldset>
                                        <label class="form-label">Mật khẩu (*)</label>
                                        <input type="password" v-model="password" class="form-control"
                                            :class="{ 'is-invalid': errors.password }" placeholder="******">
                                        <span class="error-text" v-if="errors.password">{{ errors.password }}</span>
                                    </fieldset>
                                </div>

                                <div class="col-lg-6 mb-3">
                                    <fieldset>
                                        <label class="form-label">Nhập lại mật khẩu (*)</label>
                                        <input type="password" v-model="confirmPassword" class="form-control"
                                            :class="{ 'is-invalid': errors.confirmPassword }" placeholder="******">
                                        <span class="error-text" v-if="errors.confirmPassword">{{ errors.confirmPassword
                                        }}</span>
                                    </fieldset>
                                </div>

                                <div class="col-lg-12 mb-4">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="agreeTerms"
                                            id="agreeTerms">
                                        <label class="form-check-label" for="agreeTerms">
                                            Tôi đồng ý với <a href="#" class="text-orange">Điều khoản & Chính sách</a>
                                        </label>
                                    </div>
                                    <span class="error-text" v-if="errors.agreeTerms">{{ errors.agreeTerms }}</span>
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
import axios from 'axios';
import Swal from 'sweetalert2';
export default {
    name: 'DangKy',
    data() {
        return {
            fullName: '',
            email: '',
            phone: '',
            gender: '',
            cccd: '',
            password: '',
            confirmPassword: '',
            agreeTerms: false,
            errors: {} // Chứa thông tin lỗi
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
        validateForm() {
            this.errors = {}; // Reset lỗi

            // Validate Họ tên
            const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
            if (!this.fullName.trim()) {
                this.errors.fullName = "Vui lòng nhập họ tên.";
            } else if (!nameRegex.test(this.fullName)) {
                this.errors.fullName = "Tên không được chứa số hoặc ký tự đặc biệt.";
            }

            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!this.email) {
                this.errors.email = "Email không được để trống.";
            } else if (!this.email || !emailRegex.test(this.email)) {
                this.errors.email = "Email không hợp lệ (Ví dụ: abc@gmail.com).";
            }

            // Validate Số điện thoại (VN)
            const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
            if (!this.phone) {
                this.errors.phone = "Số điện thoại không được để trống.";
            } else if (!phoneRegex.test(this.phone)) {
                this.errors.phone = "Số điện thoại không hợp lệ.";
            }

            // Validate Giới tính
            if (!this.gender) {
                this.errors.gender = "Vui lòng chọn giới tính.";
            }

            // Validate CCCD (12 số)

            if (!this.cccd) {
                this.errors.cccd = "Vui lòng nhập số CCCD.";
            } else if (!/^\d{12}$/.test(this.cccd)) {
                this.errors.cccd = "CCCD phải bao gồm đúng 12 chữ số.";
            }

            // Validate Mật khẩu
            if (this.password.length < 6) {
                this.errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
            }

            // Validate Nhập lại mật khẩu
            if (this.confirmPassword !== this.password) {
                this.errors.confirmPassword = "Mật khẩu xác nhận không khớp.";
            }

            // Validate Điều khoản
            if (!this.agreeTerms) {
                this.errors.agreeTerms = "Bạn phải đồng ý với điều khoản.";
            }

            return Object.keys(this.errors).length === 0;
        },

        async handleRegister() {
            if (!this.validateForm()) return;

            try {
                const registerData = {
                    HoVaTen: this.fullName,
                    Email: this.email,
                    MatKhau: this.password,
                    Sdt: this.phone,
                    GioiTinh: this.gender,
                    Cccd: this.cccd
                };

                const apiUrl = `${import.meta.env.VITE_API_URL}/api/Login/register`;

                // Hiện thông báo đang xử lý
                Swal.fire({
                    title: 'Đang xử lý...',
                    didOpen: () => { Swal.showLoading() }
                });

                const response = await axios.post(apiUrl, registerData);

                if (response.status === 200) {
                    // THAY THẾ alert thành công
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công!',
                        text: 'Mã xác thực đã được gửi vào Gmail của bạn. Vui lòng kiểm tra!',
                        confirmButtonColor: '#f35525'
                    }).then(() => {
                        this.$router.push({
                            path: '/xac-thuc-gmail',
                            query: { email: this.email }
                        });
                    });
                }

            } catch (error) {
                // THAY THẾ alert lỗi
                const msg = error.response?.data?.message || "Không thể kết nối đến Server!";
                Swal.fire({
                    icon: 'error',
                    title: 'Đăng ký thất bại',
                    text: msg,
                    confirmButtonColor: '#1e1e1e'
                });
            }
        }
    }
}
</script>

<style scoped>
/* CSS Gốc của bạn */
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

.form-control {
    background-color: #f4f4f4;
    border: 1px solid transparent;
    height: 45px;
    padding-left: 15px;
    font-size: 14px;
    border-radius: 5px;
    transition: all 0.3s;
}

/* Hiệu ứng khi có lỗi */
.form-control.is-invalid {
    border: 1px solid #ff4d4d !important;
    background-color: #fff5f5;
}

.error-text {
    color: #ff4d4d;
    font-size: 12px;
    margin-top: 4px;
    display: block;
    font-weight: 500;
}

.orange-button {
    background-color: #1e1e1e;
    color: #fff;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 500;
    padding: 12px 20px;
    border-radius: 25px;
    cursor: pointer;
}

.orange-button:hover {
    background-color: #f35525;
}

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
</style>