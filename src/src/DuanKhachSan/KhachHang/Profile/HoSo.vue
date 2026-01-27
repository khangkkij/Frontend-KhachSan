<template>
    <div class="profile-page">
        <div class="page-heading header-text">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <h3>Hồ Sơ Cá Nhân</h3>
                        <span class="breadcrumb">
                            <router-link to="/">Trang chủ</router-link> / Tài khoản
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="container my-5">
            <div class="row">
                <div class="col-lg-4 mb-4">
                    <ProfileSidebar :user="userData" activePage="profile" />
                </div>

                <div class="col-lg-8">
                    <div class="main-card">
                        <h4 class="section-title">Cập Nhật Thông Tin</h4>

                        <form @submit.prevent="handleUpdate">
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <label class="form-label">Họ và tên</label>
                                    <input type="text" v-model="userData.name" class="form-control">
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Số điện thoại</label>
                                    <input type="text" v-model="userData.phone" class="form-control"
                                        placeholder="09xx xxx xxx">
                                </div>

                                <div class="col-lg-12">
                                    <label class="form-label">Địa chỉ Email</label>
                                    <input type="email" v-model="userData.email" class="form-control bg-light" readonly>
                                    <small class="text-muted">Không thể thay đổi email đăng nhập.</small>
                                </div>

                                <div class="col-lg-12">
                                    <label class="form-label">Địa chỉ liên hệ</label>
                                    <input type="text" v-model="userData.address" class="form-control"
                                        placeholder="Nhập địa chỉ cư trú...">
                                </div>

                                <div class="col-lg-12 mt-4 text-end">
                                    <button type="submit" class="btn-update shadow">
                                        <i class="fa fa-save me-1"></i> Lưu thay đổi
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
// 1. Import Component Sidebar (nằm cùng thư mục)
import ProfileSidebar from './ProfileSidebar.vue';

// Dữ liệu người dùng
const userData = ref({
    name: 'Nguyễn Tấn Thành',
    phone: '0912 345 678',
    email: 'thanh@example.com',
    address: ''
});

// Hàm xử lý cập nhật
const handleUpdate = () => {
    // Gọi API cập nhật lên server ở đây
    console.log("Dữ liệu mới:", userData.value);
    alert("Cập nhật thông tin thành công!");
};

// LƯU Ý: Đã XÓA hàm handleLogout ở đây vì Component Sidebar đã tự xử lý rồi
</script>

<style scoped>
/* CHỈ GIỮ LẠI CSS CHO FORM VÀ MAIN CARD */
/* Đã xóa CSS của Sidebar để tránh trùng lặp */

.main-card {
    background: #fff;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    min-height: 500px;
}

.section-title {
    font-size: 20px;
    margin-bottom: 30px;
    position: relative;
    padding-bottom: 10px;
    border-bottom: 3px solid #eee;
    display: inline-block;
}

.section-title::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -3px;
    width: 50px;
    height: 3px;
    background: #f35525;
}

/* Form Input Custom */
.form-label {
    font-weight: 600;
    color: #555;
    margin-bottom: 8px;
    font-size: 14px;
}

.form-control {
    border-radius: 10px;
    padding: 12px 15px;
    border: 1px solid #eee;
    background: #fdfdfd;
    color: #333;
    font-size: 15px;
}

.form-control:focus {
    box-shadow: none;
    border-color: #f35525;
    background: #fff;
}

/* Nút Lưu */
.btn-update {
    background: #f35525;
    color: #fff;
    padding: 12px 40px;
    border-radius: 30px;
    font-weight: 600;
    text-transform: uppercase;
    border: none;
    transition: 0.3s;
    font-size: 14px;
}

.btn-update:hover {
    background-color: #d14015;
    box-shadow: 0 5px 15px rgba(243, 85, 37, 0.3);
}
</style>