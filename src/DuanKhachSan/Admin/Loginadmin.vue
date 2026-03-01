<template>
    <div class="hotel-viewport">

        <!-- ══ Panel Trái – Branding ══ -->
        <div class="brand-panel">
            <div class="brand-decor">
                <div class="decor-circle c1"></div>
                <div class="decor-circle c2"></div>
                <div class="decor-lines"></div>
            </div>

            <div class="brand-top">
                <div class="hotel-crest">
                    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                        <rect x="1" y="1" width="50" height="50" rx="6" stroke="rgba(255,255,255,0.3)"
                            stroke-width="1" />
                        <path d="M26 8 L32 20 L46 20 L35 29 L39 43 L26 34 L13 43 L17 29 L6 20 L20 20 Z" fill="none"
                            stroke="rgba(255,255,255,0.9)" stroke-width="1.4" stroke-linejoin="round" />
                        <circle cx="26" cy="26" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.6)"
                            stroke-width="1" />
                    </svg>
                </div>

                <h1 class="brand-name">HOTEL<br>LUXURY</h1>

                <div class="brand-sep">
                    <span class="sep-line"></span>
                    <span class="diamond">◆</span>
                    <span class="sep-line"></span>
                </div>

                <p class="brand-sub">Excellence in Hospitality</p>
            </div>

            <div class="brand-features">
                <div class="feature-item">
                    <span class="feat-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </span>
                    <span>Quản lý đặt phòng &amp; check-in</span>
                </div>
                <div class="feature-item">
                    <span class="feat-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </span>
                    <span>Hệ thống nhân sự</span>
                </div>
                <div class="feature-item">
                    <span class="feat-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                    </span>
                    <span>Báo cáo &amp; doanh thu</span>
                </div>
                <div class="feature-item">
                    <span class="feat-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </span>
                    <span>Kiểm soát dịch vụ</span>
                </div>
            </div>

            <div class="brand-foot">
                <div class="foot-line"></div>
                <p>Internal Management Portal &copy; 2024</p>
            </div>
        </div>

        <!-- ══ Panel Phải – Form ══ -->
        <div class="form-panel">
            <div class="form-wrap" :class="{ 'shake-anim': isError }">

                <div class="form-header">
                    <div class="admin-chip">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        CỔNG QUẢN TRỊ
                    </div>
                    <h2 class="form-title">Đăng Nhập<br>Hệ Thống</h2>
                    <p class="form-desc">Vui lòng xác thực danh tính để tiếp tục quản lý</p>
                </div>

                <form @submit.prevent="handleLogin" autocomplete="off">

                    <div class="field-group" :class="{ active: focusedField === 'username' }">
                        <label class="field-label">TÀI KHOẢN</label>
                        <div class="field-wrap" @focusin="focusedField = 'username'" @focusout="focusedField = ''">
                            <span class="field-ico">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <input v-model="loginForm.username" type="text" placeholder="Nhập tên đăng nhập"
                                class="field-input" />
                        </div>
                    </div>

                    <div class="field-group" :class="{ active: focusedField === 'password' }">
                        <div class="field-label-row">
                            <label class="field-label">MẬT KHẨU</label>
                            <router-link to="/forgot-password" class="forgot-link">Quên mật khẩu?</router-link>
                        </div>
                        <div class="field-wrap" @focusin="focusedField = 'password'" @focusout="focusedField = ''">
                            <span class="field-ico">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </span>
                            <input v-model="loginForm.password" :type="showPassword ? 'text' : 'password'"
                                placeholder="Nhập mật khẩu" class="field-input" />
                            <button type="button" @click="showPassword = !showPassword" class="eye-btn">
                                <svg v-if="!showPassword" width="17" height="17" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path
                                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="options-row">
                        <label class="remember-label" @click="rememberMe = !rememberMe">
                            <span class="checkbox-wrap" :class="{ checked: rememberMe }">
                                <svg v-if="rememberMe" width="11" height="11" viewBox="0 0 24 24" fill="none"
                                    stroke="white" stroke-width="3.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </span>
                            Duy trì đăng nhập
                        </label>
                        <span class="secure-tag">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e"
                                stroke-width="2.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            SSL bảo mật
                        </span>
                    </div>

                    <button type="submit" class="btn-submit" :disabled="isLoading">
                        <span v-if="isLoading" class="btn-loading">
                            <span class="spinner"></span>
                            Đang xác thực...
                        </span>
                        <span v-else class="btn-text">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.2">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                            XÁC THỰC &amp; ĐĂNG NHẬP
                        </span>
                    </button>
                </form>

                <div class="form-foot">
                    <router-link to="/dang-nhap" class="back-link">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Quay lại trang khách
                    </router-link>
                    <span class="ver-tag">v3.0.1</span>
                </div>

            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter();
const API = import.meta.env.VITE_API_URL || 'https://localhost:7023';

const loginForm = ref({ username: '', password: '' });
const showPassword = ref(false);
const isLoading = ref(false);
const rememberMe = ref(false);
const focusedField = ref('');

const isError = ref(false); // Trạng thái lỗi để kích hoạt hiệu ứng rung

const handleLogin = async () => {
    // Bắt lỗi để trống ngay tại Frontend
    if (!loginForm.value.username.trim() || !loginForm.value.password.trim()) {
        isError.value = true;
        setTimeout(() => isError.value = false, 500);
        return Swal.fire({
            icon: 'warning',
            title: 'Thông báo',
            text: 'Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu!',
            confirmButtonColor: '#0c2461'
        });
    }

    isLoading.value = true;
    isError.value = false;

    try {
        const res = await axios.post(`${API}/api/LoginAdmin/login`, {
            username: loginForm.value.username,
            password: loginForm.value.password,
        }, { withCredentials: true });

        if (res.data.success) {
            // Lưu thông tin đăng nhập
            localStorage.setItem('userRole', res.data.role);
            localStorage.setItem('userName', res.data.name);
            localStorage.setItem('isLoggedIn', 'true');

            await Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: res.data.message,
                timer: 1500,
                showConfirmButton: false
            });

            // Điều hướng trang
            if (res.data.role === 'Admin') router.push('/admin');
            else router.push('/NhanVien/dashboard');
        }
    } catch (err) {
        isError.value = true;
        setTimeout(() => isError.value = false, 500);

        Swal.fire({
            icon: 'error',
            title: 'Lỗi xác thực',
            text: err.response?.data?.message || 'Sai tài khoản/mật khẩu',
            confirmButtonColor: '#ef4444'
        });
    } finally {
        // Luôn tắt loading để tránh kẹt preloader
        isLoading.value = false;
    }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
</style>

<style scoped>
/* ═══════════════════════
   RESET
═══════════════════════ */
*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* ═══════════════════════
   LAYOUT
═══════════════════════ */
.hotel-viewport {
    font-family: 'DM Sans', sans-serif;
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background: #ffffff;
}

/* ═══════════════════════
   PANEL TRÁI
═══════════════════════ */
.brand-panel {
    position: relative;
    width: 42%;
    min-width: 340px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 52px 48px;
    overflow: hidden;
    /* Màu xanh gradient */
    background-color: #0c2461;
    background-image: linear-gradient(155deg, #061543 0%, #0c2461 40%, #1d4ed8 100%);
    animation: slideInLeft 0.65s cubic-bezier(.4, 0, .2, 1) both;
}

/* Trang trí vòng tròn */
.brand-decor {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
}

.decor-circle {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.07);
}

.c1 {
    width: 500px;
    height: 500px;
    top: -200px;
    right: -160px;
}

.c2 {
    width: 300px;
    height: 300px;
    bottom: -100px;
    left: -80px;
}

.decor-lines {
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(-45deg,
            transparent,
            transparent 48px,
            rgba(255, 255, 255, 0.018) 48px,
            rgba(255, 255, 255, 0.018) 49px);
}

/* Nội dung brand */
.brand-top {
    position: relative;
    z-index: 1;
}

.hotel-crest {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 68px;
    height: 68px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.22);
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 28px;
}

.brand-name {
    font-family: 'Playfair Display', 'Cormorant Garamond', serif;
    font-size: 50px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 6px;
    line-height: 1.1;
    margin-bottom: 24px;
}

.brand-sep {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
}

.sep-line {
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.18);
    display: block;
}

.diamond {
    color: rgba(255, 255, 255, 0.4);
    font-size: 8px;
}

.brand-sub {
    font-size: 11.5px;
    letter-spacing: 3.5px;
    color: rgba(255, 255, 255, 0.42);
    text-transform: uppercase;
    font-weight: 400;
}

/* Feature list */
.brand-features {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 13.5px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.62);
    letter-spacing: 0.2px;
}

.feat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    flex-shrink: 0;
}

/* Footer brand */
.brand-foot {
    position: relative;
    z-index: 1;
}

.foot-line {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin-bottom: 16px;
}

.brand-foot p {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.25);
    letter-spacing: 0.4px;
}

/* ═══════════════════════
   PANEL PHẢI
═══════════════════════ */
.form-panel {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    background-image:
        linear-gradient(rgba(26, 86, 219, 0.028) 1px, transparent 1px),
        linear-gradient(90deg, rgba(26, 86, 219, 0.028) 1px, transparent 1px);
    background-size: 36px 36px;
    animation: slideInRight 0.65s cubic-bezier(.4, 0, .2, 1) 0.07s both;
}

.form-wrap {
    width: 100%;
    max-width: 440px;
    padding: 0 36px;
}

/* Header form */
.admin-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 14px;
    border-radius: 100px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 2px;
    margin-bottom: 20px;
}

.form-title {
    font-family: 'Playfair Display', 'Cormorant Garamond', serif;
    font-size: 40px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.2;
    letter-spacing: 0px;
    margin-bottom: 10px;
}

.form-desc {
    font-size: 14px;
    color: #64748b;
    font-weight: 400;
    line-height: 1.55;
    margin-bottom: 38px;
}

/* Trường nhập liệu */
.field-group {
    margin-bottom: 22px;
}

.field-label {
    display: block;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 1.6px;
    color: #475569;
    margin-bottom: 9px;
    transition: color 0.2s;
}

.field-group.active .field-label {
    color: #1d4ed8;
}

.field-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 9px;
}

.field-label-row .field-label {
    margin-bottom: 0;
}

.forgot-link {
    font-size: 12.5px;
    font-weight: 600;
    color: #1d4ed8;
    text-decoration: none;
    transition: opacity 0.2s;
}

.forgot-link:hover {
    opacity: 0.7;
}

.field-wrap {
    display: flex;
    align-items: center;
    height: 52px;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 0 16px;
    transition: border-color 0.22s, box-shadow 0.22s, background 0.22s;
}

.field-group.active .field-wrap {
    background: #ffffff;
    border-color: #1d4ed8;
    box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.08);
}

.field-ico {
    display: flex;
    align-items: center;
    color: #94a3b8;
    flex-shrink: 0;
    transition: color 0.22s;
}

.field-group.active .field-ico {
    color: #1d4ed8;
}

.field-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    padding: 0 12px;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    color: #0f172a;
    height: 100%;
}

.field-input::placeholder {
    color: #94a3b8;
}

.eye-btn {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 4px 2px;
    transition: color 0.2s;
    flex-shrink: 0;
}

.eye-btn:hover {
    color: #1d4ed8;
}

/* Options */
.options-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
}

.remember-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13.5px;
    color: #475569;
    font-weight: 500;
    cursor: pointer;
    user-select: none;
}

.checkbox-wrap {
    width: 20px;
    height: 20px;
    border: 2px solid #cbd5e1;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: #ffffff;
    transition: background 0.18s, border-color 0.18s;
}

.checkbox-wrap.checked {
    background: #1d4ed8;
    border-color: #1d4ed8;
}

.secure-tag {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
}

/* Nút đăng nhập */
.btn-submit {
    width: 100%;
    height: 54px;
    border: none;
    border-radius: 12px;
    /* Gradient xanh navy -> xanh royal */
    background: #0c2461;
    background-image: linear-gradient(135deg, #0c2461 0%, #1d4ed8 100%);
    color: #ffffff;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.28s ease, box-shadow 0.28s ease;
    box-shadow: 0 6px 24px rgba(12, 36, 97, 0.35);
}

.btn-submit::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 55%);
    pointer-events: none;
}

.btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 14px 36px rgba(12, 36, 97, 0.42);
}

.btn-submit:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 14px rgba(12, 36, 97, 0.28);
}

.btn-submit:disabled {
    background: #94a3b8;
    background-image: none;
    box-shadow: none;
    cursor: not-allowed;
}

.btn-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: relative;
    z-index: 1;
}

.btn-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    position: relative;
    z-index: 1;
}

.spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Footer form */
.form-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 28px;
    padding-top: 22px;
    border-top: 1px solid #f1f5f9;
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
    text-decoration: none;
    transition: color 0.2s;
}

.back-link:hover {
    color: #1d4ed8;
}

.ver-tag {
    font-size: 11px;
    color: #cbd5e1;
    font-weight: 500;
}

/* Hiệu ứng rung form khi nhập sai hoặc để trống */
.shake-container {
    animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes shake {

    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
}

/* Đảm bảo preloader có z-index cao nhất để không bị đè */
.js-preloader {
    z-index: 999999 !important;
}

/* ═══════════════════════
   ANIMATIONS
═══════════════════════ */
@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-24px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(24px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* ═══════════════════════
   RESPONSIVE
═══════════════════════ */
@media (max-width: 900px) {
    .brand-panel {
        min-width: unset;
        width: 46%;
        padding: 40px 34px;
    }

    .brand-name {
        font-size: 40px;
    }
}

@media (max-width: 680px) {
    .hotel-viewport {
        flex-direction: column;
    }

    .brand-panel {
        width: 100%;
        flex-direction: row;
        align-items: center;
        padding: 20px 24px;
        gap: 16px;
    }

    .brand-top {
        display: flex;
        align-items: center;
        gap: 16px;
        margin: 0;
    }

    .hotel-crest {
        width: 44px;
        height: 44px;
        margin-bottom: 0;
    }

    .brand-name {
        font-size: 24px;
        letter-spacing: 3px;
        margin-bottom: 0;
    }

    .brand-sep,
    .brand-sub,
    .brand-features,
    .brand-foot {
        display: none;
    }

    .form-panel {
        overflow-y: auto;
    }

    .form-wrap {
        max-width: 100%;
        padding: 28px 20px;
    }

    .form-title {
        font-size: 30px;
    }
}
</style>