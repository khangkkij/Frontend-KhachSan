<template>
    <div class="booking-page">
        <div class="booking-header">
            <div class="container d-flex justify-content-between align-items-center py-2">
                <div class="d-flex align-items-center">
                    <h4 class="text-orange fw-bold m-0">Luxury Booking</h4>
                </div>

                <div class="step-container d-none d-md-flex">
                    <div class="step-item active"><span class="step-num">1</span> Thông tin khách hàng</div>
                    <div class="step-item"><span class="step-num">2</span> Chi tiết thanh toán</div>
                    <div class="step-item"><span class="step-num">3</span> Xác nhận!</div>
                </div>
            </div>
        </div>

        <div class="countdown-banner">
            <i class="fa fa-clock text-danger me-2"></i>
            Chúng tôi đang giữ giá cho quý khách...
            <span class="text-danger fw-bold">{{ timerDisplay }}</span>
        </div>

        <div class="container mt-4 mb-5">
            <div class="row">
                <div class="col-lg-8">
                    <div class="card mb-3 shadow-sm">
                        <div class="card-body">
                            <h5 class="fw-bold mb-4">Ai là khách chính?</h5>
                            <div class="row g-3">
                                <div class="col-md-12 mb-3">
                                    <div class="p-3 bg-light border rounded d-flex align-items-center">
                                        <i class="fa fa-user-circle fa-2x me-3 text-orange"></i>
                                        <div>Xin chào <strong>{{ formData.name }}</strong>! (Không phải bạn? <a href="#"
                                                class="text-orange">Thoát</a>)</div>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label fw-bold">Họ tên khách</label>
                                    <input type="text" class="form-control" v-model="formData.name">
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label fw-bold">Email</label>
                                    <input type="email" class="form-control" v-model="formData.email">
                                    <small class="text-muted">Chúng tôi sẽ gửi xác nhận đặt phòng qua email này.</small>
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label fw-bold">Số điện thoại</label>
                                    <input type="tel" class="form-control" v-model="formData.phone"
                                        placeholder="Nhập số điện thoại...">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card mb-3 shadow-sm">
                        <div class="card-body">
                            <h5 class="fw-bold mb-3">Yêu cầu đặc biệt</h5>
                            <p class="text-muted small">Phụ thuộc vào tình trạng thực tế của khách sạn.</p>
                            <div class="row">
                                <div class="col-md-6 border-end">
                                    <p class="fw-bold small">Quy định hút thuốc:</p>
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="radio" name="smoke" id="r1" checked>
                                        <label class="form-check-label" for="r1"><i class="fa fa-ban me-2"></i>Phòng
                                            không hút thuốc</label>
                                    </div>
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="radio" name="smoke" id="r2">
                                        <label class="form-check-label" for="r2"><i class="fa fa-smoking me-2"></i>Phòng
                                            hút thuốc</label>
                                    </div>
                                </div>
                                <div class="col-md-6 ps-md-4">
                                    <p class="fw-bold small">Chọn loại giường:</p>
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="radio" name="bed" id="b1" checked>
                                        <label class="form-check-label" for="b1"><i class="fa fa-bed me-2"></i>Giường
                                            lớn (1 King)</label>
                                    </div>
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="radio" name="bed" id="b2">
                                        <label class="form-check-label" for="b2"><i class="fa fa-bed me-2"></i>2 Giường
                                            đơn</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card mb-4 shadow-sm">
                        <div class="card-header-custom">Quyền lợi phòng miễn phí</div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-6 mb-3"><i class="fa fa-coffee me-2 text-orange"></i>Bữa sáng</div>
                                <div class="col-6 mb-3"><span class="benefit-tag">BAO GỒM</span></div>
                                <div class="col-6 mb-3"><i class="fa fa-wifi me-2 text-orange"></i>WiFi miễn phí</div>
                                <div class="col-6 mb-3"><span class="benefit-tag">BAO GỒM</span></div>
                                <div class="col-6 mb-3"><i class="fa fa-parking me-2 text-orange"></i>Bãi đậu xe</div>
                                <div class="col-6 mb-3"><span class="benefit-tag">BAO GỒM</span></div>
                            </div>
                        </div>
                    </div>

                    <button type="button" @click="handleBooking" class="btn btn-lg w-100 py-3 fw-bold shadow btn-next">
                        KẾ TIẾP: BƯỚC CUỐI CÙNG <br>
                        <small class="fw-normal" style="font-size: 14px;">Có liền xác nhận đặt phòng!</small>
                    </button>
                </div>

                <div class="col-lg-4">
                    <div class="card mb-3 shadow-sm">
                        <div class="row g-0">
                            <div class="col-4">
                                <img :src="bookingImage"
                                    class="img-fluid rounded-start h-100 object-fit-cover" alt="Phòng đã chọn">
                            </div>
                            <div class="col-8">
                                <div class="card-body p-2">
                                    <h6 class="fw-bold mb-1">{{ bookingTitle }}</h6>
                                    <div class="small text-muted" v-if="bookingSubTitle">{{ bookingSubTitle }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card p-3 mb-3 shadow-sm">
                        <div class="d-flex justify-content-between align-items-center text-center">
                            <div>
                                <small class="text-muted">Nhận phòng</small>
                                <input type="date" class="form-control mt-2" v-model="ngayNhan">
                            </div>
                            <i class="fa fa-arrow-right text-muted"></i>
                            <div>
                                <small class="text-muted">Trả phòng</small>
                                <input type="date" class="form-control mt-2" v-model="ngayTra">
                            </div>
                            <div class="border-start ps-3">
                                <div class="fw-bold">{{ soDem }}</div>
                                <small class="text-muted">đêm</small>
                            </div>
                        </div>
                    </div>

                    <div class="card shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between mb-2">
                                <span>Giá / đêm</span>
                                <span>{{ formatCurrency(giaMotDem) }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Số đêm</span>
                                <span>{{ soDem }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Phí dịch vụ</span>
                                <span>Miễn phí</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="h5 fw-bold">Tổng cộng</span>
                                <span class="price-final">{{ formatCurrency(tongTien) }}</span>
                            </div>
                            <div class="text-end small text-muted mt-1">Đã bao gồm: Phí dịch vụ, Thuế VAT</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const apiBase = import.meta.env.VITE_API_URL;

// Dữ liệu form
const formData = ref({
    name: 'Phạm Văn A',
    email: 'email@example.com',
    phone: ''
});

const maBienThePhong = ref(Number(route.query.maBienThePhong || 0));
const giaMotDem = ref(Number(route.query.gia || 0));
const bookingInfo = ref({
    tenLoai: 'Phòng',
    tenBienThe: '',
    anhDaiDien: ''
});

const bookingTitle = computed(() => bookingInfo.value.tenLoai || 'Phòng');
const bookingSubTitle = computed(() => bookingInfo.value.tenBienThe || '');
const bookingImage = computed(() => {
    if (bookingInfo.value.anhDaiDien) {
        return `${apiBase}/images/${bookingInfo.value.anhDaiDien}`;
    }
    return '/assets/images/property-01.jpg';
});

const today = new Date();
const formatDateInput = (date) => date.toISOString().split('T')[0];
const ngayNhan = ref(formatDateInput(new Date(today.getTime() + 24 * 60 * 60 * 1000)));
const ngayTra = ref(formatDateInput(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)));

const soDem = computed(() => {
    const start = new Date(ngayNhan.value);
    const end = new Date(ngayTra.value);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.round(diff) : 0;
});

const tongTien = computed(() => {
    return giaMotDem.value * soDem.value;
});

const formatCurrency = (value) => {
    if (!value || value <= 0) return '0 ₫';
    return Number(value).toLocaleString('vi-VN') + ' ₫';
};

// Xử lý Timer đếm ngược
const timerDisplay = ref("20:00");
let totalSeconds = 1200;
let interval = null;

const startTimer = () => {
    interval = setInterval(() => {
        if(totalSeconds <= 0) {
            clearInterval(interval);
            return;
        }
        totalSeconds--;
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        timerDisplay.value = `${m}:${s}`;
    }, 1000);
};

// Xử lý đặt phòng (ĐÂY LÀ ĐOẠN BẠN CẦN SỬA)
const handleBooking = async () => {
    if (!formData.value.name || !formData.value.phone) {
        alert("Vui lòng nhập đầy đủ họ tên và số điện thoại!");
        return;
    }

    if (!maBienThePhong.value || !giaMotDem.value) {
        alert("Thiếu thông tin phòng. Vui lòng quay lại chọn phòng!");
        return;
    }

    if (soDem.value <= 0) {
        alert("Ngày trả phòng phải sau ngày nhận phòng!");
        return;
    }

    let maKh = null;
    try {
        const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
        maKh = userInfo?.id || null;
    } catch {
        maKh = null;
    }

    try {
        const response = await axios.post(
            `${apiBase}/api/DatPhong/tao`,
            {
                MaKh: maKh,
                MaBienThePhong: maBienThePhong.value,
                NgayNhan: ngayNhan.value,
                NgayTra: ngayTra.value,
                GiaDat: giaMotDem.value
            }
        );

        const result = response.data;
        const paymentInfo = {
            maDatPhong: result.maDatPhong,
            soTien: result.tongTien
        };
        localStorage.setItem('payment_info', JSON.stringify(paymentInfo));

        router.push({
            path: '/payment',
            query: {
                maDatPhong: result.maDatPhong,
                soTien: result.tongTien
            }
        });
    } catch (error) {
        if (error.response) {
            alert(error.response.data || "Không thể tạo đặt phòng");
        } else {
            console.error("Lỗi kết nối:", error);
            alert("Không thể kết nối đến Server. Hãy kiểm tra đường truyền!");
        }
    }
};

onMounted(() => {
    startTimer();
    try {
        const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
        if (userInfo?.name) formData.value.name = userInfo.name;
        if (userInfo?.email) formData.value.email = userInfo.email;
        if (userInfo?.phone) formData.value.phone = userInfo.phone;
    } catch {
        // ignore localStorage errors
    }

    try {
        const info = JSON.parse(localStorage.getItem('booking_info') || '{}');
        if (info?.tenLoai) bookingInfo.value.tenLoai = info.tenLoai;
        if (info?.tenBienThe) bookingInfo.value.tenBienThe = info.tenBienThe;
        if (info?.anhDaiDien) bookingInfo.value.anhDaiDien = info.anhDaiDien;
    } catch {
        // ignore localStorage errors
    }
});

onUnmounted(() => {
    if(interval) clearInterval(interval);
});
</script>

<style scoped>
/* CSS Tùy chỉnh từ file gốc */
.booking-page {
    background-color: #f8f7f9;
    min-height: 100vh;
    padding-bottom: 50px;
}

/* Header riêng cho booking */
.booking-header {
    background: white;
    border-bottom: 1px solid #ddd;
}

.text-orange {
    color: #f35525 !important;
}

.bg-orange {
    background-color: #f35525 !important;
    color: #fff;
}

.step-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.step-item {
    display: flex;
    align-items: center;
    color: #999;
    font-weight: 600;
    margin: 0 15px;
    font-size: 14px;
}

.step-item.active {
    color: #f35525;
    border-bottom: 2px solid #f35525;
    padding-bottom: 2px;
}

.step-num {
    background: #eee;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    font-size: 12px;
}

.step-item.active .step-num {
    background: #f35525;
    color: white;
}

.countdown-banner {
    background: #fff4e6;
    color: #333;
    padding: 10px;
    border-bottom: 1px solid #ffd4a3;
    text-align: center;
    font-weight: 500;
    font-size: 14px;
}

.card {
    border: none;
    border-radius: 8px;
    margin-bottom: 15px;
}

.card-header-custom {
    background: #fff4e6;
    padding: 12px 20px;
    border-radius: 8px 8px 0 0;
    font-weight: bold;
    color: #333;
}

.benefit-tag {
    background: #ffe6d4;
    color: #f35525;
    padding: 4px 12px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 11px;
}

.price-final {
    color: #f35525;
    font-size: 22px;
    font-weight: bold;
}

.strike-price {
    text-decoration: line-through;
    color: #888;
    font-size: 14px;
}

.btn-next {
    background-color: #f35525;
    border-color: #f35525;
    color: white;
    transition: all 0.3s;
}

.btn-next:hover {
    background-color: #d14013;
    transform: translateY(-2px);
}

.object-fit-cover {
    object-fit: cover;
}
</style>