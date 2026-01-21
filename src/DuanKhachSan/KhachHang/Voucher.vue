<template>
    <div class="promo-page">

        <div class="page-heading header-text">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <h3>Săn Mã Giảm Giá</h3>
                        <span class="breadcrumb">
                            <router-link to="/">Trang chủ</router-link> / Ưu đãi
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="container my-5">
            <div class="section-heading text-center mb-5">
                <h6>Ưu Đãi Độc Quyền</h6>
                <h2>Thu Thập Ngay - Bay Giá Rẻ</h2>
            </div>

            <div class="row g-4">
                <div class="col-lg-6" v-for="voucher in promoVouchers" :key="voucher.id">
                    <div class="coupon-card" :class="{ 'saved': voucher.isSaved }">
                        <div class="coupon-left">
                            <div class="discount-text">{{ voucher.discount }}</div>
                            <span class="badge bg-white text-orange mt-2">Voucher HOT</span>
                        </div>

                        <div class="coupon-right">
                            <div>
                                <h5 class="fw-bold mb-1">{{ voucher.title }}</h5>
                                <p class="text-muted small mb-1">{{ voucher.desc }}</p>
                                <div class="expiry-date">
                                    <i class="fa fa-clock me-1"></i> HSD: {{ voucher.expiry }}
                                </div>
                                <div class="progress mt-2" style="height: 5px;">
                                    <div class="progress-bar bg-orange" :style="{ width: voucher.percent + '%' }"></div>
                                </div>
                                <small class="text-orange" v-if="voucher.percent > 80">Sắp hết!</small>
                            </div>

                            <div class="action-area mt-3">
                                <button v-if="!voucher.isSaved" class="btn-collect" @click="saveVoucher(voucher)">
                                    Lưu Mã
                                </button>
                                <button v-else class="btn-use" @click="goToBooking">
                                    Dùng Ngay
                                </button>
                            </div>
                        </div>

                        <div class="circle-top"></div>
                        <div class="circle-bottom"></div>
                    </div>
                </div>
            </div>
        </div>

        <div :class="['custom-toast', { show: showToast }]">
            <i class="fa fa-check-circle"></i> Đã lưu voucher vào kho của bạn!
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showToast = ref(false);

// Dữ liệu các mã khuyến mãi đang chạy
const promoVouchers = ref([
    {
        id: 1,
        discount: '20%',
        title: 'Giảm 20% Đặt Phòng Sớm',
        desc: 'Áp dụng cho đơn đặt trước 30 ngày',
        expiry: '31/12/2026',
        percent: 45, // Thanh tiến độ đã dùng
        isSaved: false
    },
    {
        id: 2,
        discount: '500K',
        title: 'Chào Bạn Mới',
        desc: 'Giảm trực tiếp cho lần đầu đặt phòng',
        expiry: '30/06/2026',
        percent: 90,
        isSaved: false
    },
    {
        id: 3,
        discount: 'VIP',
        title: 'Nâng Hạng Phòng VIP',
        desc: 'Miễn phí nâng hạng view biển',
        expiry: '15/08/2026',
        percent: 20,
        isSaved: false
    },
    {
        id: 4,
        discount: '10%',
        title: 'Ưu Đãi Mùa Hè',
        desc: 'Giảm 10% tối đa 200k',
        expiry: '01/09/2026',
        percent: 60,
        isSaved: false
    }
]);

// Hàm Lưu Voucher
const saveVoucher = (voucher) => {
    // 1. Giả lập gọi API lưu
    voucher.isSaved = true;

    // 2. Hiện thông báo
    showToast.value = true;
    setTimeout(() => { showToast.value = false; }, 3000);
};

// Hàm Dùng Ngay -> Chuyển sang đặt phòng
const goToBooking = () => {
    router.push('/danh-sach-phong');
};
</script>

<style scoped>
.text-orange {
    color: #f35525 !important;
}

.bg-orange {
    background-color: #f35525 !important;
}

/* CSS Card Coupon */
.coupon-card {
    display: flex;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    position: relative;
    transition: 0.3s;
    border: 1px solid #eee;
    height: 100%;
}

.coupon-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(243, 85, 37, 0.15);
}

/* Cột Trái */
.coupon-left {
    background: linear-gradient(135deg, #f35525 0%, #ff7b54 100%);
    width: 130px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    padding: 15px;
    border-right: 2px dashed #fff;
}

.discount-text {
    font-size: 28px;
    font-weight: 800;
    line-height: 1;
}

/* Cột Phải */
.coupon-right {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.expiry-date {
    font-size: 12px;
    color: #888;
    margin-top: 5px;
}

/* Nút Bấm */
.btn-collect {
    background: #f35525;
    color: white;
    border: none;
    padding: 6px 20px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    transition: 0.3s;
}

.btn-collect:hover {
    background: #d14015;
}

.btn-use {
    background: white;
    color: #f35525;
    border: 1px solid #f35525;
    padding: 6px 20px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
}

.btn-use:hover {
    background: #fff0ec;
}

/* Hiệu ứng vé (Hình tròn khuyết) */
.circle-top,
.circle-bottom {
    position: absolute;
    width: 20px;
    height: 20px;
    background: #f8f9fa;
    /* Trùng màu nền web */
    border-radius: 50%;
    left: 120px;
    z-index: 1;
}

.circle-top {
    top: -10px;
}

.circle-bottom {
    bottom: -10px;
}

/* Trạng thái đã lưu */
.coupon-card.saved .coupon-left {
    background: #444;
}

/* Đổi màu xám khi đã lưu */
.coupon-card.saved .btn-collect {
    display: none;
}

/* Toast */
.custom-toast {
    visibility: hidden;
    min-width: 250px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 50px;
    padding: 16px;
    position: fixed;
    z-index: 9999;
    left: 50%;
    bottom: 30px;
    transform: translateX(-50%);
    opacity: 0;
    transition: 0.5s;
}

.custom-toast.show {
    visibility: visible;
    opacity: 1;
    bottom: 50px;
}
</style>