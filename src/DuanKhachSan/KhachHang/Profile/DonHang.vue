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
                    <ProfileSidebar :user="{ name: user.name }" currentPage="history" />
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
                                            <span :class="getStatusBadge(order.statusKey).class">
                                                {{ getStatusBadge(order.statusKey).text }}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="action-group">
                                                <router-link :to="'/order-detail/' + order.id"
                                                    class="btn-action btn-detail">
                                                    <i class="fa fa-eye"></i> Xem
                                                </router-link>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="!isLoading && orders.length === 0">
                                        <td colspan="6" class="text-center text-muted py-4">
                                            Không có lịch sử đặt phòng
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-if="isLoading" class="text-muted mt-3">Đang tải dữ liệu...</div>
                        <div v-if="loadError" class="text-danger mt-2">{{ loadError }}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
// 1. Import Component Sidebar
import ProfileSidebar from './ProfileSidebar.vue';

const API = import.meta.env.VITE_API_URL;
const user = ref({ name: 'Khách hàng' });
const orders = ref([]);
const isLoading = ref(false);
const loadError = ref('');

const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString('vi-VN') + 'đ';
};

const formatDate = (value) => {
    if (!value) return '---';
    return new Date(value).toLocaleDateString('vi-VN');
};

const mapStatusKey = (status) => {
    const s = (status || '').toString().toLowerCase().trim();
    if (s.includes('huy')) return 'cancelled';
    if (s.includes('traphong') || s.includes('da thanh toan') || s.includes('dathanhtoan')) return 'completed';
    if (s.includes('dango') || s.includes('dang o')) return 'staying';
    if (s.includes('chonhanphong') || s.includes('cho nhan phong')) return 'ready';
    if (s.includes('choxacnhan') || s.includes('cho xac nhan')) return 'pending';
    return 'pending';
};

// Helper: Badge trạng thái
const getStatusBadge = (statusKey) => {
    switch (statusKey) {
        case 'ready': return { class: 'badge-status bg-info-light', text: 'Chờ nhận phòng' };
        case 'staying': return { class: 'badge-status bg-primary-light', text: 'Đang ở' };
        case 'completed': return { class: 'badge-status bg-success-light', text: 'Hoàn thành' };
        case 'pending': return { class: 'badge-status bg-warning-light', text: 'Đang xử lý' };
        case 'cancelled': return { class: 'badge-status bg-danger-light', text: 'Đã hủy' };
        default: return { class: 'badge-status bg-secondary', text: 'Không rõ' };
    }
};

const fetchProfile = async () => {
    try {
        const res = await axios.get(`${API}/api/KhachHang/profile`, { withCredentials: true });
        user.value = { name: res.data?.hoVaTen || 'Khách hàng' };
    } catch (err) {
        console.error('Lỗi fetch profile:', err);
    }
};

const fetchOrders = async () => {
    isLoading.value = true;
    loadError.value = '';
    try {
        const res = await axios.get(`${API}/api/DatPhong/lich-su`, { withCredentials: true });
        const data = Array.isArray(res.data) ? res.data : [];
        orders.value = data.map((item) => ({
            id: item.maDatPhong,
            code: `#BK${item.maDatPhong}`,
            name: item.tenPhong || 'Phòng',
            date: formatDate(item.ngayNhan),
            price: formatCurrency(item.tongTien),
            statusKey: mapStatusKey(item.trangThai),
            statusRaw: item.trangThai
        }));
    } catch (err) {
        loadError.value = err.response?.data || 'Không tải được lịch sử đặt phòng.';
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchProfile();
    fetchOrders();
});
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

.bg-info-light {
    background: #cff4fc;
    color: #055160;
}

.bg-primary-light {
    background: #cfe2ff;
    color: #084298;
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