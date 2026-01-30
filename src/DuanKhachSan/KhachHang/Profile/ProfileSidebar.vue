<template>
    <div class="profile-sidebar text-center shadow-sm">
        <div class="avatar-container mb-3 position-relative d-inline-block">
            <img :src="displayAvatar" 
                 @error="handleImgError"
                 class="user-avatar shadow-sm border border-3 border-orange-light" 
                 alt="User Avatar">
        </div>
        
        <h5 class="fw-bold text-dark mb-1">{{ user?.name || 'Khách hàng' }}</h5>
        <p class="text-muted small mb-4">Thành viên hạng Vàng</p>

        <nav class="nav flex-column text-start profile-nav">
            <router-link to="/profile" class="nav-link" :class="{ active: currentPage === 'profile' }">
                <i class="fa fa-user-circle"></i> Thông tin cá nhân
            </router-link>
            
            <router-link to="/history" class="nav-link" :class="{ active: currentPage === 'history' }">
                <i class="fa fa-file-invoice"></i> Lịch sử đặt phòng
            </router-link>
            
            <router-link to="/my-voucher" class="nav-link" :class="{ active: currentPage === 'my-voucher' }">
                <i class="fa fa-ticket-alt"></i> Kho voucher
            </router-link>
            
            <router-link to="/saved" class="nav-link" :class="{ active: currentPage === 'saved' }">
                <i class="fa fa-heart"></i> Phòng đã lưu
            </router-link>
            
            <hr class="my-3 opacity-10">
            
            <a href="#" @click.prevent="handleLogout" class="nav-link text-danger">
                <i class="fa fa-sign-out-alt"></i> Đăng xuất
            </a>
        </nav>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    user: { 
        type: Object, 
        default: () => ({ name: 'Khách hàng', avatar: '' }) 
    },
    currentPage: { 
        type: String, 
        required: true 
    }
});

const router = useRouter();

// Lấy domain gốc (ví dụ: http://localhost:5000)
const API_URL_ROOT = import.meta.env.VITE_API_URL.replace('/api', '');

// Biến reactive để hứng tên file ảnh mới khi có sự kiện upload
const liveAvatarFileName = ref(null);

// Hàm lắng nghe tín hiệu từ trang HoSo.vue
const handleAvatarUpdate = (event) => {
    if (event.detail && event.detail.avatar) {
        // Gán tên file mới (ví dụ: user_1.png)
        liveAvatarFileName.value = event.detail.avatar;
    }
};

// Theo dõi props để đồng bộ khi chuyển trang
watch(() => props.user?.avatar, (newVal) => {
    if (newVal) liveAvatarFileName.value = null; 
});

onMounted(() => {
    window.addEventListener('user-avatar-updated', handleAvatarUpdate);
});

onUnmounted(() => {
    window.removeEventListener('user-avatar-updated', handleAvatarUpdate);
});

/**
 * LOGIC HIỂN THỊ ẢNH (QUAN TRỌNG NHẤT)
 */
const displayAvatar = computed(() => {
    // Tạo timestamp để ép trình duyệt không dùng cache ảnh cũ
    const timestamp = `t=${new Date().getTime()}`;
    let fileName = '';

    // 1. Ưu tiên: Tên file vừa upload xong (qua Event)
    if (liveAvatarFileName.value) {
        fileName = liveAvatarFileName.value;
    }
    // 2. Ưu tiên: Tên file từ props (trang cha truyền xuống)
    else if (props.user?.avatar) {
        fileName = props.user.avatar;
    }
    // 3. Dự phòng: Tên file từ LocalStorage
    else {
        const localInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
        fileName = localInfo.avatar || '';
    }

    // Nếu không có tên file, dùng ảnh mặc định
    if (!fileName) return '/assets/images/info-icon-01.png';

    // Xử lý đường dẫn: 
    // Nếu fileName đã chứa đường dẫn đầy đủ thì dùng luôn, 
    // Nếu chỉ là tên file thì nối với bí danh /USER_IMG/ đã cấu hình ở Backend
    const pureFileName = fileName.split('/').pop();
    const finalPath = `${API_URL_ROOT}/USER_IMG/${pureFileName}`;

    return `${finalPath}?${timestamp}`;
});

const handleImgError = (e) => {
    e.target.src = '/assets/images/info-icon-01.png';
};

const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất khỏi hệ thống?")) {
        localStorage.removeItem('token'); 
        localStorage.removeItem('user_info');
        router.push('/dang-nhap');
    }
};
</script>

<style scoped>
.profile-sidebar { 
    background: #fff; 
    border-radius: 20px; 
    padding: 30px 20px; 
    transition: 0.3s; 
    height: 100%;
}

.user-avatar { 
    width: 100px; 
    height: 100px; 
    border-radius: 50%; 
    border: 3px solid #f35525; 
    object-fit: cover; 
    background: #f8f9fa;
    display: block;
    margin: 0 auto;
}

.border-orange-light { border-color: #fff0ec !important; }

.profile-nav .nav-link { 
    font-size: 15px; 
    color: #555; 
    padding: 12px 20px; 
    border-radius: 10px; 
    margin-bottom: 5px; 
    transition: 0.3s; 
    display: flex; 
    align-items: center; 
    text-decoration: none;
    font-weight: 500;
}

.profile-nav .nav-link:hover { 
    background-color: #fff0ec; 
    color: #f35525; 
}

.profile-nav .nav-link.active { 
    background-color: #f35525; 
    color: #fff !important; 
    box-shadow: 0 4px 12px rgba(243, 85, 37, 0.2);
}

.profile-nav .nav-link i { 
    margin-right: 12px; 
    width: 20px; 
    text-align: center; 
    font-size: 1.1rem;
}

.text-danger { color: #dc3545 !important; }
.text-danger:hover { background-color: #fff1f2 !important; }

hr { border-top: 1px solid #eee; margin: 20px 0; }
</style>