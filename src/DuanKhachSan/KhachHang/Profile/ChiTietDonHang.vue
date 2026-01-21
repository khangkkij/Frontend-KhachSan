<template>
    <div class="order-detail-page">
        <div class="page-heading header-text">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <h3>Chi Tiết Đơn Hàng</h3>
                        <span class="breadcrumb">
                            <router-link to="/">Trang chủ</router-link> /
                            <router-link to="/history">Lịch sử</router-link> / Chi tiết
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="container my-5">
            <div class="row">
                <div class="col-lg-4 mb-4">
                    <ProfileSidebar :user="user" activePage="history" />
                </div>

                <div class="col-lg-8">
                    <div class="main-card">
                        <div class="d-flex justify-content-between align-items-center order-header">
                            <div>
                                <h4 class="mb-1">Đơn hàng {{ order.code }}</h4>
                                <p class="text-muted small mb-0">Ngày đặt: {{ order.createdDate }}</p>
                            </div>
                            <span :class="getStatusBadge(order.status).class">
                                {{ getStatusBadge(order.status).text }}
                            </span>
                        </div>

                        <h5 class="mb-3 section-sub-title">Thông Tin Khách Hàng</h5>
                        <div class="row mb-4">
                            <div class="col-md-4 info-group">
                                <label>Họ tên</label>
                                <p>{{ user.name }}</p>
                            </div>
                            <div class="col-md-4 info-group">
                                <label>Số điện thoại</label>
                                <p>{{ user.phone }}</p>
                            </div>
                            <div class="col-md-4 info-group">
                                <label>Email</label>
                                <p>{{ user.email }}</p>
                            </div>
                        </div>

                        <h5 class="mb-3 section-sub-title">Chi Tiết Phòng</h5>
                        <div class="room-preview">
                            <img :src="order.roomImage" alt="Room">
                            <div class="room-info">
                                <h6>{{ order.roomName }}</h6>
                                <p class="small text-muted mb-1"><i class="fa fa-map-marker-alt"></i> {{ order.location
                                    }}</p>
                                <p class="small mb-0"><strong>{{ order.guests }}</strong> Khách - <strong>{{
                                        order.bedrooms }}</strong> Phòng ngủ</p>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="p-3 bg-light rounded-3 h-100">
                                    <h6 class="mb-3 fw-bold">Thời Gian Lưu Trú</h6>
                                    <div class="d-flex justify-content-between mb-2">
                                        <span>Check-in:</span>
                                        <strong>{{ order.checkIn }}</strong>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <span>Check-out:</span>
                                        <strong>{{ order.checkOut }}</strong>
                                    </div>
                                    <hr>
                                    <div class="text-center text-muted small">{{ order.totalNights }} Đêm</div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="table-responsive">
                                    <table class="table table-borderless payment-table mb-0">
                                        <tbody>
                                            <tr>
                                                <th>Giá phòng ({{ order.totalNights }} đêm)</th>
                                                <td>{{ order.roomPrice }}</td>
                                            </tr>
                                            <tr>
                                                <th>Phí dịch vụ</th>
                                                <td>{{ order.serviceFee }}</td>
                                            </tr>
                                            <tr>
                                                <th>Voucher</th>
                                                <td class="text-success">{{ order.discount }}</td>
                                            </tr>
                                            <tr class="total-row border-top">
                                                <th>TỔNG CỘNG</th>
                                                <td>{{ order.totalPrice }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div class="mt-5 text-end">
                            <router-link to="/history" class="btn-back">
                                <i class="fa fa-arrow-left"></i> Quay lại
                            </router-link>
                            <a href="#" class="btn-support">
                                <i class="fa fa-headset"></i> Hỗ trợ
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ProfileSidebar from './ProfileSidebar.vue';

const route = useRoute();
const orderId = route.params.id;

// Dữ liệu User
const user = ref({
    name: 'Nguyễn Tấn Thành',
    phone: '0987 654 321',
    email: 'thanh@example.com'
});

// Dữ liệu Đơn hàng
const order = ref({
    id: 1,
    code: '#BK001',
    createdDate: '15/10/2023 - 14:30 PM',
    status: 'completed',
    roomName: 'Luxury Villa Da Lat - View Đồi Thông',
    roomImage: '/assets/images/property-01.jpg',
    location: 'Phường 10, TP. Đà Lạt',
    guests: 2,
    bedrooms: 1,
    checkIn: '20/10/2023',
    checkOut: '22/10/2023',
    totalNights: 2,
    roomPrice: '4.500.000đ',
    serviceFee: '500.000đ',
    discount: '-0đ',
    totalPrice: '5.000.000đ'
});

// Helper: Badge trạng thái
const getStatusBadge = (status) => {
    switch (status) {
        case 'completed': return { class: 'order-status bg-success-light', text: 'Hoàn thành' };
        case 'pending': return { class: 'order-status bg-warning-light', text: 'Đang xử lý' };
        case 'cancelled': return { class: 'order-status bg-danger-light', text: 'Đã hủy' };
        default: return { class: 'order-status bg-secondary', text: 'Không rõ' };
    }
};

onMounted(() => {
    if (orderId == 2) {
        order.value.code = '#BK002';
        order.value.roomName = 'Sea View Apartment';
        order.value.status = 'pending';
        order.value.totalPrice = '3.200.000đ';
    }
});
</script>

<style scoped>
/* Biến màu */
.text-orange { color: #f35525 !important; }
.bg-success-light { background: #d4edda; color: #155724; }
.bg-warning-light { background: #fff3cd; color: #856404; }
.bg-danger-light { background: #f8d7da; color: #721c24; }

/* Main Card */
.main-card {
    background: #fff;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    min-height: 600px;
}

/* Detail Styles */
.order-header {
    border-bottom: 2px dashed #eee;
    padding-bottom: 20px;
    margin-bottom: 20px;
}

.order-status {
    padding: 5px 15px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 13px;
}

.section-sub-title {
    font-size: 16px;
    font-weight: 700;
    color: #333;
    margin-top: 10px;
}

.info-group label {
    font-size: 13px;
    color: #888;
    margin-bottom: 4px;
    display: block;
}

.info-group p {
    font-weight: 600;
    color: #333;
    font-size: 15px;
}

/* Room Preview Box */
.room-preview {
    display: flex;
    gap: 20px;
    background: #f9f9f9;
    padding: 15px;
    border-radius: 15px;
    margin-bottom: 30px;
    align-items: center;
}

.room-preview img {
    width: 100px;
    height: 80px;
    object-fit: cover;
    border-radius: 10px;
}

.room-info h6 {
    margin: 0 0 5px 0;
    font-size: 16px;
    font-weight: 700;
    color: #f35525;
}

/* Payment Table */
.payment-table th {
    color: #888;
    font-weight: 500;
    font-size: 14px;
}

.payment-table td {
    font-weight: 600;
    color: #333;
    text-align: right;
}

.total-row td {
    font-size: 18px;
    color: #f35525;
    font-weight: 800;
    padding-top: 15px;
}

/* Buttons */
.btn-back {
    background: #eee;
    color: #333;
    border: none;
    padding: 10px 25px;
    border-radius: 30px;
    font-weight: 600;
    margin-right: 10px;
    text-decoration: none;
    display: inline-block;
    transition: 0.3s;
}
.btn-back:hover { background: #e2e2e2; color: #000; }

.btn-support {
    background: #f35525;
    color: #fff;
    border: none;
    padding: 10px 25px;
    border-radius: 30px;
    font-weight: 600;
    text-decoration: none;
    display: inline-block;
    transition: 0.3s;
}
.btn-support:hover {
    background: #d14015;
    color: #fff;
    box-shadow: 0 5px 15px rgba(243, 85, 37, 0.3);
}
</style>