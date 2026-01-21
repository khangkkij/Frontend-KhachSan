<template>
    <div class="profile-sidebar text-center">
        <img src="/assets/images/info-icon-01.png" class="user-avatar" alt="User">
        <h5 class="fw-bold mb-1">{{ user?.name || 'Khách hàng' }}</h5>
        <p class="text-muted small mb-4">Thành viên hạng Vàng</p>

        <nav class="nav flex-column text-start profile-nav">
            <router-link to="/profile" class="nav-link" :class="{ active: currentPage === 'profile' }">
                <i class="fa fa-user-circle"></i> Thông tin cá nhân
            </router-link>

            <router-link to="/history" class="nav-link" :class="{ active: currentPage === 'history' }">
                <i class="fa fa-file-invoice"></i> Lịch sử đặt phòng
            </router-link>

            <router-link to="/voucher" class="nav-link" :class="{ active: currentPage === 'voucher' }">
                <i class="fa fa-ticket-alt"></i> Kho voucher
            </router-link>

            <router-link to="/saved" class="nav-link" :class="{ active: currentPage === 'saved' }">
                <i class="fa fa-heart"></i> Phòng đã lưu
            </router-link>

            <hr>

            <a href="#" @click.prevent="handleLogout" class="nav-link text-danger">
                <i class="fa fa-sign-out-alt"></i> Đăng xuất
            </a>
        </nav>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

// Nhận dữ liệu từ component cha truyền vào
const props = defineProps({
    user: {
        type: Object,
        default: () => ({ name: 'Khách hàng' })
    },
    currentPage: {
        type: String,
        required: true // Bắt buộc phải truyền tên trang để highlight menu
    }
});

const router = useRouter();

// --- XỬ LÝ ĐĂNG XUẤT ---
const handleLogout = () => {
    const confirm = window.confirm("Bạn có chắc muốn đăng xuất khỏi hệ thống?");
    if (confirm) {
        // 1. Xóa thông tin lưu trữ (Token, User info...)
        localStorage.removeItem('token'); 
        localStorage.removeItem('user_info');
        
        // 2. Thông báo & Chuyển trang
        alert("Đã đăng xuất thành công!");
        router.push('/dang-nhap'); // Chuyển về trang đăng nhập
    }
};
</script>

<style scoped>
/* CSS cho Sidebar */
.profile-sidebar {
    background: #fff;
    border-radius: 20px;
    padding: 30px 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.user-avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    border: 3px solid #f35525;
    object-fit: cover;
    margin-bottom: 15px;
}

.profile-nav .nav-link {
    font-size: 15px;
    color: #555;
    padding: 12px 20px;
    border-radius: 10px;
    margin-bottom: 8px;
    transition: 0.3s;
    display: flex;
    align-items: center;
}

.profile-nav .nav-link:hover {
    background-color: #fff0ec;
    color: #f35525;
}

/* Class active sẽ được Vue tự động thêm dựa vào prop currentPage */
.profile-nav .nav-link.active {
    background-color: #f35525;
    color: #fff !important;
}

.profile-nav .nav-link i {
    margin-right: 10px;
    width: 20px;
    text-align: center;
}

.text-danger {
    color: #dc3545 !important;
}
</style>