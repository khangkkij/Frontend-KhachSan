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
                    <div class="main-card-luxury">
                        <h4 class="section-title mb-4 fw-bold">Danh Sách Đặt Phòng</h4>

                        <div class="table-responsive">
                            <table class="table table-custom-luxury align-middle">
                                <thead>
                                    <tr>
                                        <th>Mã Đơn</th>
                                        <th>Tên Phòng</th>
                                        <th>Ngày Nhận</th>
                                        <th>Tổng Tiền</th>
                                        <th class="text-center">Trạng Thái</th>
                                        <th class="text-end">Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="order in orders" :key="order.id">
                                        <td><span class="order-code">{{ order.code }}</span></td>
                                        <td>
                                            <div class="text-truncate" style="max-width: 170px; font-weight: 500;">
                                                {{ order.name }}
                                            </div>
                                        </td>
                                        <td>{{ order.date }}</td>
                                        <td class="fw-bold text-dark">{{ order.price }}</td>
                                        <td class="text-center">
                                            <span :class="['badge-luxury', getStatusBadge(order.statusKey).class]">
                                                {{ getStatusBadge(order.statusKey).text }}
                                            </span>
                                        </td>
                                        <td class="text-end">
                                            <div class="action-buttons-group">
                                                <router-link :to="'/order-detail/' + order.id"
                                                    class="btn-action btn-view">
                                                    <i class="fa fa-eye"></i> Xem
                                                </router-link>

                                                <button v-if="order.statusKey === 'ready'"
                                                    @click="openCancelModal(order)" class="btn-action btn-cancel-order">
                                                    <i class="fa fa-times-circle"></i> Hủy
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr v-if="!isLoading && orders.length === 0">
                                        <td colspan="6" class="text-center py-5 text-muted">
                                            Không có đơn đặt phòng nào.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div v-if="isLoading" class="text-center py-3">
                            <i class="fa fa-spinner fa-spin"></i> Đang tải dữ liệu...
                        </div>
                        <div v-if="loadError" class="text-danger text-center mt-2">{{ loadError }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showModal" class="modal-luxury-overlay">
            <div class="modal-luxury-content animate__animated animate__zoomIn">
                <div class="modal-luxury-header">
                    <h5 class="m-0 fw-bold text-danger">
                        <i class="fa fa-university me-2"></i>Thông Tin Hoàn Tiền Cọc
                    </h5>
                    <button class="btn-close-custom" @click="closeModal">&times;</button>
                </div>
                <div class="modal-luxury-body">
                    <div class="alert alert-light border mb-4 shadow-sm" style="font-size: 14px;">
                        Số tiền hoàn cọc sẽ được tính dựa trên thời điểm hủy đơn so với ngày nhận phòng thực tế.
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Tên chủ tài khoản</label>
                        <input v-model="bankInfo.accountName" type="text" class="form-control"
                            placeholder="NGUYEN VAN A">
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Số tài khoản</label>
                        <input v-model="bankInfo.accountNumber" type="text" class="form-control"
                            placeholder="Nhập số tài khoản">
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Ngân hàng</label>
                        <input v-model="bankInfo.bankName" type="text" class="form-control"
                            placeholder="Ví dụ: MB Bank, Vietcombank...">
                    </div>
                </div>
                <div class="modal-luxury-footer">
                    <button class="btn btn-light me-2" @click="closeModal">Đóng</button>
                    <button class="btn btn-danger px-4" @click="handleConfirmCancel" :disabled="isSubmitting">
                        <span v-if="isSubmitting"><i class="fa fa-spinner fa-spin me-2"></i>Đang xử lý</span>
                        <span v-else>Xác nhận hủy đơn</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ProfileSidebar from './ProfileSidebar.vue';
import Swal from 'sweetalert2';

const API = import.meta.env.VITE_API_URL;
const user = ref({ name: 'Khách hàng' });
const orders = ref([]);
const isLoading = ref(false);
const loadError = ref('');

// State cho Modal Hủy đơn
const showModal = ref(false);
const isSubmitting = ref(false);
const selectedOrder = ref(null);
const bankInfo = ref({ accountName: '', accountNumber: '', bankName: '' });

const formatCurrency = (v) => Number(v || 0).toLocaleString('vi-VN') + 'đ';
const formatDate = (v) => v ? new Date(v).toLocaleDateString('vi-VN') : '---';

const mapStatusKey = (status) => {
    // Chuyển về chữ thường, xóa khoảng trắng để so sánh chính xác
    const s = (status || '').toString().toLowerCase().trim();

    // 1. Kiểm tra trạng thái Hủy (Khớp với "Đã hủy" trong DB của bạn)
    if (s === 'Đã hủy' || s.toLowerCase().includes('huy')) return 'cancelled';

    // 2. Kiểm tra trạng thái Hoàn thành (Khớp với "TraPhong" trong DB của bạn)
    if (s.includes('traphong') || s.includes('thanh toan')) return 'completed';

    // 3. Kiểm tra trạng thái Đang ở
    if (s.includes('dango')) return 'staying';

    // 4. Kiểm tra trạng thái Chờ nhận phòng
    if (s.includes('chonhanphong')) return 'ready';

    // 5. Mặc định là Đang xử lý (ChoXacNhan)
    return 'pending';
};

const getStatusBadge = (key) => {
    switch (key) {
        case 'ready': return { class: 'bg-info-soft', text: 'Chờ nhận phòng' };
        case 'staying': return { class: 'bg-primary-soft', text: 'Đang ở' };
        case 'completed': return { class: 'bg-success-soft', text: 'Hoàn thành' };
        case 'pending': return { class: 'bg-warning-soft', text: 'Đang xử lý' };
        case 'cancelled': return { class: 'bg-danger-soft', text: 'Đã hủy' };
        default: return { class: 'bg-secondary-soft', text: 'Không rõ' };
    }
};

const fetchProfile = async () => {
    try {
        const res = await axios.get(`${API}/api/KhachHang/profile`, { withCredentials: true });
        user.value = { name: res.data?.hoVaTen || 'Khách hàng' };
    } catch (err) { console.error('Lỗi profile:', err); }
};

const fetchOrders = async () => {
    isLoading.value = true;
    try {
        const res = await axios.get(`${API}/api/DatPhong/lich-su`, { withCredentials: true });
        orders.value = (res.data || []).map(i => ({
            id: i.maDatPhong,
            code: `#BK${i.maDatPhong}`,
            name: i.tenPhong || 'Phòng',
            date: formatDate(i.ngayNhan),
            price: formatCurrency(i.tongTien),
            statusKey: mapStatusKey(i.trangThai)
        }));
    } catch (err) { loadError.value = 'Lỗi tải lịch sử đặt phòng.'; }
    finally { isLoading.value = false; }
};

const openCancelModal = (order) => {
    selectedOrder.value = order;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    bankInfo.value = { accountName: '', accountNumber: '', bankName: '' };
};

const handleConfirmCancel = async () => {
    if (!bankInfo.value.accountName || !bankInfo.value.accountNumber || !bankInfo.value.bankName) {
        Swal.fire('Thông báo', 'Vui lòng nhập đủ thông tin ngân hàng!', 'warning');
        return;
    }
    isSubmitting.value = true;
    try {
        // Gửi POST đến API xử lý bảng HUYDATPHONG
        const res = await axios.post(
            `${API}/api/HuyDatPhong/ThucHienHuy?maDatPhong=${selectedOrder.value.id}`,
            {
                accountName: bankInfo.value.accountName,
                accountNumber: bankInfo.value.accountNumber,
                bankName: bankInfo.value.bankName
            },
            { withCredentials: true }
        );

        if (res.data.success) {
            Swal.fire({
                title: 'Thành công',
                text: `Đã gửi yêu cầu hủy. Tiền hoàn cọc dự kiến: ${formatCurrency(res.data.amount)}.`,
                icon: 'success'
            });
            closeModal();
            fetchOrders();
        }
    } catch (err) {
        const msg = err.response?.data?.message || 'Không thể hủy đơn vào lúc này.';
        Swal.fire('Lỗi', msg, 'error');
    }
    finally { isSubmitting.value = false; }
};

onMounted(() => {
    fetchProfile();
    fetchOrders();
});
</script>

<style scoped>
.main-card-luxury {
    background: #fff;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
}

.section-title {
    font-size: 1.4rem;
    color: #2c3e50;
    position: relative;
    padding-bottom: 10px;
}

.section-title::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 45px;
    height: 3px;
    background: #f35525;
}

.table-custom-luxury thead th {
    font-size: 14px;
    color: #7f8c8d;
    padding: 15px;
    background-color: #fafafa;
    border: none;
}

.table-custom-luxury tbody td {
    padding: 15px;
    font-size: 14.5px;
    border-bottom: 1px solid #f1f1f1;
}

.order-code {
    color: #f35525;
    font-weight: 700;
    font-size: 15px;
}

.badge-luxury {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    min-width: 120px;
    text-align: center;
    display: inline-block;
}

.bg-info-soft {
    background: #e3f2fd;
    color: #1976d2;
}

.bg-primary-soft {
    background: #e8eaf6;
    color: #3f51b5;
}

.bg-success-soft {
    background: #e8f5e9;
    color: #2e7d32;
}

.bg-warning-soft {
    background: #fffde7;
    color: #f9a825;
}

.bg-danger-soft {
    background: #ffebee;
    color: #c62828;
}

.bg-secondary-soft {
    background: #f5f5f5;
    color: #757575;
}

.action-buttons-group {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.btn-action {
    padding: 7px 15px;
    font-size: 13.5px;
    font-weight: 500;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: 0.2s;
}

.btn-view {
    background: #2c3e50;
    color: #fff !important;
}

.btn-cancel-order {
    background: #fff;
    color: #dc3545;
    border: 1px solid #f5c2c7;
}

.modal-luxury-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(2px);
}

.modal-luxury-content {
    background: #fff;
    width: 100%;
    max-width: 450px;
    border-radius: 15px;
    overflow: hidden;
}

.modal-luxury-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-luxury-body {
    padding: 25px;
}

.modal-luxury-footer {
    padding: 15px 20px;
    background: #f8f9fa;
    text-align: right;
}

.form-control {
    border-radius: 8px;
    padding: 10px;
    font-size: 14.5px;
    border: 1px solid #ddd;
}

.btn-close-custom {
    border: none;
    background: none;
    font-size: 24px;
    color: #aaa;
    cursor: pointer;
}
</style>