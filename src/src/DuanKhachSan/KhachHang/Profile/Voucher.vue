<template>
    <div class="voucher-page">
        <div class="page-heading header-text">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <h3>Kho Voucher</h3>
                        <span class="breadcrumb">
                            <router-link to="/">Trang chủ</router-link> / Voucher
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="container my-5">
            <div class="row">
                <div class="col-lg-4 mb-4">
                    <ProfileSidebar :user="user" activePage="voucher" />
                </div>

                <div class="col-lg-8">
                    <div class="main-card">
                        <h4 class="section-title">Voucher Của Bạn</h4>

                        <div class="row g-4">
                            <div class="col-lg-12" v-for="voucher in vouchers" :key="voucher.id">
                                <div class="voucher-card">
                                    <div class="voucher-left">
                                        <h5 class="voucher-amount">{{ voucher.title }}</h5>
                                        <p class="mb-1 fw-bold">{{ voucher.desc }}</p>
                                        <p class="small text-muted mb-2">
                                            <i class="fa fa-clock"></i> HSD: {{ voucher.expiry }}
                                        </p>
                                        <span class="voucher-code" @click="copyCode(voucher.code)">
                                            CODE: {{ voucher.code }} <i class="fa fa-copy ms-1"></i>
                                        </span>
                                    </div>

                                    <div class="voucher-right">
                                        <button class="btn-use" @click="useVoucher(voucher.code)">
                                            Dùng Ngay
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div v-if="vouchers.length === 0" class="text-center text-muted py-5">
                                <i class="fa fa-ticket-alt fa-3x mb-3"></i>
                                <p>Bạn chưa có voucher nào.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// 1. Import Component Sidebar
import ProfileSidebar from './ProfileSidebar.vue';

const router = useRouter();

// Dữ liệu User
const user = ref({
    name: 'Nguyễn Tấn Thành'
});

// Danh sách Voucher
const vouchers = ref([
    {
        id: 1,
        title: 'GIẢM 20%',
        desc: 'Cho đơn từ 5 triệu',
        expiry: '30/12/2026',
        code: 'SALE20'
    },
    {
        id: 2,
        title: 'GIẢM 500K',
        desc: 'Khách hàng mới',
        expiry: '15/11/2026',
        code: 'WELCOME'
    },
    {
        id: 3,
        title: 'FREE BREAKFAST',
        desc: 'Miễn phí bữa sáng',
        expiry: '01/05/2026',
        code: 'YUMMY'
    }
]);

// Hàm Copy mã
const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Đã sao chép mã: ${code}`);
};

// Hàm Dùng ngay
const useVoucher = (code) => {
    // Có thể lưu mã vào localStorage để tự điền khi thanh toán
    // localStorage.setItem('apply_voucher', code);
    alert(`Đã áp dụng mã ${code}. Đang chuyển đến trang đặt phòng...`);
    router.push('/danh-sach-phong');
};
</script>

<style scoped>
/* Màu chủ đạo */
.text-orange {
    color: #f35525 !important;
}

/* Main Card */
.main-card {
    background: #fff;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    min-height: 600px;
}

.section-title {
    font-size: 20px;
    margin-bottom: 30px;
    border-bottom: 3px solid #eee;
    display: inline-block;
    position: relative;
    padding-bottom: 10px;
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

/* --- STYLE VOUCHER --- */
.voucher-card {
    border: 2px dashed #ddd;
    /* Viền nét đứt */
    border-radius: 15px;
    padding: 20px;
    background: #fff;
    position: relative;
    transition: 0.3s;
    display: flex;
    align-items: center;
}

.voucher-card:hover {
    border-color: #f35525;
    background: #fffbf9;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.voucher-left {
    flex: 1;
    border-right: 2px dashed #eee;
    padding-right: 15px;
}

.voucher-right {
    width: 100px;
    text-align: center;
    padding-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.voucher-amount {
    font-size: 24px;
    color: #f35525;
    font-weight: 800;
    margin-bottom: 5px;
}

.voucher-code {
    background: #eee;
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: bold;
    font-size: 13px;
    color: #555;
    cursor: pointer;
    display: inline-block;
}

.voucher-code:hover {
    background: #e0e0e0;
    color: #000;
}

.btn-use {
    background: #f35525;
    color: white;
    border: none;
    font-size: 12px;
    padding: 8px 15px;
    border-radius: 20px;
    margin-top: 10px;
    transition: 0.3s;
}

.btn-use:hover {
    background: #d14015;
    transform: translateY(-2px);
}
</style>