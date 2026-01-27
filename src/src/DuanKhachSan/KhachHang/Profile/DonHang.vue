<template>
    <div class="history-page">
        <div class="page-heading header-text">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <h3>Lịch Sử Đặt Phòng</h3>
                        <span class="breadcrumb">
                            <router-link to="/">Trang chủ</router-link> / Đơn hàng
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="container my-5">
            <div class="row">
                <div class="col-lg-4 mb-4">
                    <ProfileSidebar :user="{ name: 'Nguyễn Tấn Thành' }" activePage="history" />
                </div>

                <div class="col-lg-8">
                    <div class="main-card">
                        <h4 class="section-title">Danh Sách Đặt Phòng</h4>
                        <div class="table-responsive">
                            <table class="table table-custom table-hover">
                                <thead>
                                    <tr>
                                        <th>Mã Đơn</th>
                                        <th>Tên Phòng</th>
                                        <th>Ngày Check-in</th>
                                        <th>Tổng Tiền</th>
                                        <th class="text-center">Trạng Thái</th>
                                        <th class="text-end" style="min-width: 150px;">Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="order in orders" :key="order.id">
                                        <td><strong>{{ order.code }}</strong></td>
                                        <td>{{ order.name }}</td>
                                        <td>{{ order.date }}</td>
                                        <td class="fw-bold">{{ order.price }}</td>
                                        <td class="text-center">
                                            <span :class="getStatusBadge(order.status).class">
                                                {{ getStatusBadge(order.status).text }}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="action-group">
                                                <button v-if="order.status === 'pending'" class="btn-action btn-cancel"
                                                    @click="openCancelModal(order)">
                                                    <i class="fa fa-times"></i> Hủy
                                                </button>

                                                <router-link :to="'/order-detail/' + order.id"
                                                    class="btn-action btn-detail">
                                                    <i class="fa fa-eye"></i> Xem
                                                </router-link>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showModal" class="modal-backdrop fade show"></div>
        <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="border-radius: 15px; border: none;">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title fw-bold text-danger">Xác Nhận Hủy Đơn {{ selectedOrder?.code }}</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="mb-3 text-muted">Vui lòng chọn lý do hủy đơn:</p>

                        <div v-for="reason in reasons" :key="reason.id" class="reason-option">
                            <input class="form-check-input" type="radio" :value="reason.text" v-model="cancelReason"
                                :id="reason.id">
                            <label class="form-check-label w-100" :for="reason.id">{{ reason.text }}</label>
                        </div>

                        <p v-if="errorMsg" class="text-danger small mt-2">
                            <i class="fa fa-exclamation-circle"></i> {{ errorMsg }}
                        </p>
                    </div>
                    <div class="modal-footer border-0 pt-0">
                        <button type="button" class="btn btn-light rounded-pill px-4" @click="closeModal">Đóng</button>
                        <button type="button" class="btn btn-danger rounded-pill px-4" @click="confirmCancel">Xác Nhận
                            Hủy</button>
                    </div>
                </div>
            </div>
        </div>

        <div :class="['custom-toast', { show: showToast }]">
            <i class="fa fa-check-circle"></i> Đã hủy đơn hàng thành công!
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';
// 1. Import Component Sidebar
import ProfileSidebar from './ProfileSidebar.vue';

// Dữ liệu Đơn hàng
const orders = ref([
    { id: 1, code: '#BK001', name: 'Luxury Villa Da Lat', date: '20/10/2023', price: '5.000.000đ', status: 'completed' },
    { id: 2, code: '#BK002', name: 'Sea View Apartment', date: '15/11/2023', price: '3.200.000đ', status: 'pending' },
    { id: 3, code: '#BK003', name: 'Mountain Cabin', date: '01/12/2023', price: '1.500.000đ', status: 'cancelled' },
]);

// Lý do hủy
const reasons = [
    { id: 'r1', text: 'Thay đổi kế hoạch di chuyển' },
    { id: 'r2', text: 'Tìm được chỗ khác giá tốt hơn' },
    { id: 'r3', text: 'Lý do cá nhân / Sức khỏe' },
    { id: 'r4', text: 'Khác' }
];

// State quản lý Modal & Toast
const showModal = ref(false);
const showToast = ref(false);
const selectedOrder = ref(null);
const cancelReason = ref('');
const errorMsg = ref('');

// Helper: Badge trạng thái
const getStatusBadge = (status) => {
    switch (status) {
        case 'completed': return { class: 'badge-status bg-success-light', text: 'Hoàn thành' };
        case 'pending': return { class: 'badge-status bg-warning-light', text: 'Đang xử lý' };
        case 'cancelled': return { class: 'badge-status bg-danger-light', text: 'Đã hủy' };
        default: return { class: 'badge-status bg-secondary', text: 'Không rõ' };
    }
};

// Các hàm xử lý Modal
const openCancelModal = (order) => {
    selectedOrder.value = order;
    cancelReason.value = '';
    errorMsg.value = '';
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const confirmCancel = () => {
    if (!cancelReason.value) {
        errorMsg.value = 'Vui lòng chọn một lý do để tiếp tục.';
        return;
    }
    if (selectedOrder.value) {
        selectedOrder.value.status = 'cancelled';
    }
    closeModal();
    showToast.value = true;
    setTimeout(() => { showToast.value = false; }, 3000);
};
</script>

<style scoped>
/* Biến màu */
.text-danger {
    color: #dc3545 !important;
}

.bg-success-light {
    background: #d4edda;
    color: #155724;
}

.bg-warning-light {
    background: #fff3cd;
    color: #856404;
}

.bg-danger-light {
    background: #f8d7da;
    color: #721c24;
}

/* ĐÃ XÓA CSS SIDEBAR VÌ ĐÃ CÓ TRONG COMPONENT */

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

/* Table Styles */
.table-custom tbody td {
    vertical-align: middle;
    padding: 15px;
    font-size: 14px;
    border-bottom: 1px solid #f0f0f0;
}

.table-custom thead th {
    background-color: #f1f1f1;
    border: none;
    font-weight: 600;
    font-size: 14px;
    padding: 15px;
    white-space: nowrap;
}

.badge-status {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    display: inline-block;
    min-width: 100px;
    text-align: center;
}

/* Buttons */
.action-group {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    align-items: center;
}

.btn-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 34px;
    padding: 0 12px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.2s ease;
    text-decoration: none;
    border: 1px solid transparent;
    cursor: pointer;
}

.btn-detail {
    color: #0d6efd;
    background-color: #f0f7ff;
    border-color: #cce5ff;
}

.btn-detail:hover {
    background-color: #0d6efd;
    color: #fff;
}

.btn-cancel {
    color: #dc3545;
    background-color: #fff5f5;
    border-color: #f5c2c7;
}

.btn-cancel:hover {
    background-color: #dc3545;
    color: #fff;
}

/* Modal Styles */
.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.5);
}

.reason-option {
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 12px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: 0.2s;
    display: flex;
    align-items: center;
}

.reason-option:hover {
    background: #f9f9f9;
    border-color: #ddd;
}

.form-check-input {
    margin-right: 12px;
    cursor: pointer;
}

.form-check-input:checked+label {
    font-weight: 600;
    color: #dc3545;
}

.reason-option:has(.form-check-input:checked) {
    border-color: #dc3545;
    background: #fff5f5;
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
    font-size: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transition: opacity 0.5s, bottom 0.5s;
}

.custom-toast.show {
    visibility: visible;
    opacity: 1;
    bottom: 50px;
}
</style>