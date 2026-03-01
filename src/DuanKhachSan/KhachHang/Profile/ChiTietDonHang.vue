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
                    <ProfileSidebar :user="user" currentPage="history" />
                </div>

                <div class="col-lg-8">
                    <div v-if="!isLoading" class="main-card">
                        <div class="d-flex justify-content-between align-items-center order-header">
                            <div>
                                <h4 class="mb-1">Đơn hàng {{ order.code }}</h4>
                                <p class="text-muted small mb-0">Ngày đặt: {{ order.createdDate }}</p>
                            </div>
                            <span :class="getStatusBadge(order.statusKey).class">
                                {{ getStatusBadge(order.statusKey).text }}
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
                            <img :src="order.roomImage || fallbackImage" alt="Room">
                            <div class="room-info">
                                <h6>{{ order.roomName }}</h6>
                                <p class="small text-muted mb-1">
                                    <i class="fa fa-bed"></i> {{ order.roomType }}
                                </p>
                                <p class="small mb-0">
                                    Thời gian: <strong>{{ order.totalNights }} đêm</strong>
                                </p>
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
                                    <div class="text-center text-muted small">Cảm ơn bạn đã lựa chọn Luxury Hotel</div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="table-responsive">
                                    <table class="table table-borderless payment-table mb-0">
                                        <tbody>
                                            <tr>
                                                <th>Tiền phòng ({{ order.totalNights }} đêm)</th>
                                                <td>{{ order.roomPrice }}</td>
                                            </tr>

                                            <tr v-for="(dv, index) in order.dichVus" :key="index" class="service-row">
                                                <th>
                                                    <i class="fa fa-concierge-bell me-2 small text-muted"></i>
                                                    {{ dv.tenDichVu }} (x{{ dv.soLuong }})
                                                </th>
                                                <td>{{ formatCurrency(dv.thanhTien) }}</td>
                                            </tr>

                                            <tr v-if="order.voucherCode" class="voucher-row">
                                                <th>
                                                    Voucher
                                                    <span class="badge badge-voucher ms-1">
                                                        {{ order.voucherCode }}
                                                        <span v-if="order.percent && order.percent > 0">({{
                                                            order.percent }}%)</span>
                                                    </span>
                                                </th>
                                                <td class="text-success fw-bold">-{{ order.discount }}</td>
                                            </tr>
                                            <tr class="total-row border-top">
                                                <th class="pt-3">TỔNG CỘNG</th>
                                                <td class="pt-3 text-orange">{{ order.totalPrice }}</td>
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
                            <a href="tel:0909123456" class="btn-support">
                                <i class="fa fa-headset"></i> Hỗ trợ
                            </a>
                        </div>
                    </div>

                    <div v-if="isLoading" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="mt-2">Đang tải chi tiết đơn hàng...</p>
                    </div>
                    <div v-if="loadError" class="alert alert-danger mt-3">{{ loadError }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import ProfileSidebar from './ProfileSidebar.vue';

const route = useRoute();
const orderId = route.params.id;
const API = import.meta.env.VITE_API_URL;
const fallbackImage = '/assets/images/property-01.jpg';

const user = ref({ name: '', phone: '', email: '' });
const order = ref({
    code: '',
    createdDate: '',
    statusKey: '',
    roomName: '',
    roomType: '',
    roomImage: '',
    checkIn: '',
    checkOut: '',
    totalNights: 0,
    roomPrice: '0đ',
    dichVus: [],
    voucherCode: '',
    percent: 0,
    discount: '0đ',
    totalPrice: '0đ'
});

const isLoading = ref(false);
const loadError = ref('');

// Format tiền tệ Việt Nam
const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString('vi-VN') + 'đ';
};

// Format ngày tháng
const formatDate = (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '---';
const formatDateTime = (value) => value ? new Date(value).toLocaleString('vi-VN') : '---';

// Ánh xạ trạng thái đơn hàng
const mapStatusKey = (status) => {
    const s = (status || '').toString().toLowerCase().trim();
    if (s.includes('huy')) return 'cancelled';
    if (s.includes('traphong') || s.includes('thanh toan')) return 'completed';
    if (s.includes('dango')) return 'staying';
    if (s.includes('chonhanphong')) return 'ready';
    return 'pending'; // Mặc định là ChoXacNhan
};

const getStatusBadge = (statusKey) => {
    const badges = {
        ready: { class: 'order-status bg-info-light', text: 'Chờ nhận phòng' },
        staying: { class: 'order-status bg-primary-light', text: 'Đang ở' },
        completed: { class: 'order-status bg-success-light', text: 'Hoàn thành' },
        pending: { class: 'order-status bg-warning-light', text: 'Đang xử lý' },
        cancelled: { class: 'order-status bg-danger-light', text: 'Đã hủy' }
    };
    return badges[statusKey] || { class: 'order-status bg-secondary', text: 'Không rõ' };
};

const fetchOrderDetail = async () => {
    if (!orderId) return;
    isLoading.value = true;
    try {
        const res = await axios.get(`${API}/api/DatPhong/lich-su/${orderId}`, { withCredentials: true });
        const data = res?.data || {};

        // Gán thông tin khách hàng
        user.value = {
            name: data.hoVaTen || 'Khách hàng',
            phone: data.sdt || 'Chưa cập nhật',
            email: data.email || 'Chưa cập nhật'
        };

        // Gán thông tin đặt phòng và dịch vụ
        order.value = {
            code: `#BK${data.maDatPhong}`,
            createdDate: formatDateTime(data.ngayDat),
            statusKey: mapStatusKey(data.trangThai),
            roomName: data.tenBienThe || 'Phòng nghỉ',
            roomType: data.tenLoai || 'Standard',
            roomImage: data.anhDaiDien ? `${API}/${data.anhDaiDien}` : '',
            checkIn: formatDate(data.ngayNhan),
            checkOut: formatDate(data.ngayTra),
            totalNights: data.soDem || 1,
            roomPrice: formatCurrency(data.giaDat),

            // DỮ LIỆU QUAN TRỌNG: Dịch vụ và Voucher từ API
            dichVus: data.dichVus || [],
            voucherCode: data.maCode || '',
            percent: data.phanTramVoucher || 0,
            discount: formatCurrency(data.soTienGiam || 0),
            totalPrice: formatCurrency(data.tongTienPhaiTra)
        };
    } catch (err) {
        loadError.value = "Không thể tải thông tin chi tiết. Vui lòng thử lại sau.";
        console.error(err);
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchOrderDetail);
</script>

<style scoped>
/* Màu sắc chủ đạo */
.text-orange {
    color: #f35525 !important;
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

.main-card {
    background: #fff;
    border-radius: 20px;
    padding: 35px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.order-header {
    border-bottom: 2px dashed #eee;
    padding-bottom: 20px;
    margin-bottom: 25px;
}

.order-status {
    padding: 6px 16px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 13px;
}

.section-sub-title {
    font-size: 17px;
    font-weight: 700;
    color: #222;
}

.room-preview {
    display: flex;
    gap: 15px;
    background: #f8f9fa;
    padding: 15px;
    border-radius: 12px;
    margin-bottom: 25px;
}

.room-preview img {
    width: 90px;
    height: 70px;
    border-radius: 8px;
    object-fit: cover;
}

.badge-voucher {
    background: #e1f5fe;
    color: #0288d1;
    border: 1px solid #b3e5fc;
    font-size: 10px;
}

.payment-table th {
    font-weight: 500;
    color: #666;
    font-size: 14px;
}

.payment-table td {
    text-align: right;
    font-weight: 700;
    color: #333;
}

.total-row td {
    font-size: 20px;
    font-weight: 800;
}

.btn-back,
.btn-support {
    padding: 10px 25px;
    border-radius: 50px;
    font-weight: 600;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s;
}

.btn-back {
    background: #f1f1f1;
    color: #555;
    margin-right: 10px;
}

.btn-support {
    background: #f35525;
    color: #fff;
}

.btn-support:hover {
    opacity: 0.9;
    transform: translateY(-2px);
}
</style>