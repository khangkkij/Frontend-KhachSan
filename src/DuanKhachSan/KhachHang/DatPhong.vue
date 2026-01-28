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
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Ngày nhận phòng</label>
                                    <input type="date" class="form-control" v-model="bookingRoom.checkIn">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Ngày trả phòng</label>
                                    <input type="date" class="form-control" v-model="bookingRoom.checkOut">
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
                                <img :src="bookingRoom.image || fallbackImage"
                                    class="img-fluid rounded-start h-100 object-fit-cover" alt="Hotel">
                            </div>
                            <div class="col-8">
                                <div class="card-body p-2">
                                    <h6 class="fw-bold mb-1">{{ bookingRoom.name || '---' }}</h6>
                                    <div class="small text-muted" v-if="bookingRoom.variantName">
                                        {{ bookingRoom.variantName }}
                                    </div>
                                    <div class="small mt-1" v-if="bookingRoom.pricePerNight">
                                        <span class="text-muted">Giá / đêm:</span>
                                        <span class="fw-bold text-orange">{{ formatCurrency(bookingRoom.pricePerNight) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card p-3 mb-3 shadow-sm">
                        <div class="d-flex justify-content-between align-items-center text-center">
                            <div>
                                <small class="text-muted">Nhận phòng</small>
                                <div class="fw-bold text-orange">{{ bookingRoom.checkIn || '---' }}</div>
                            </div>
                            <i class="fa fa-arrow-right text-muted"></i>
                            <div>
                                <small class="text-muted">Trả phòng</small>
                                <div class="fw-bold text-orange">{{ bookingRoom.checkOut || '---' }}</div>
                            </div>
                            <div class="border-start ps-3">
                                <div class="fw-bold">{{ bookingRoom.nights ?? '---' }}</div>
                                <small class="text-muted">đêm</small>
                            </div>
                        </div>
                    </div>

                    <div class="card shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="h5 fw-bold">Tổng cộng</span>
                                <span class="price-final">
                                    {{ totalAmount ? formatCurrency(totalAmount) : '---' }}
                                </span>
                            </div>
                            <div class="text-end small text-muted mt-1" v-if="totalAmount">
                                Dựa trên {{ bookingRoom.nights }} đêm
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'; // <--- BƯỚC 1: Thêm dòng này
import axios from 'axios';

// <--- BƯỚC 2: Khai báo router để dùng
const router = useRouter(); 
const API = import.meta.env.VITE_API_URL;

const bookingRoom = ref({
    name: '',
    variantName: '',
    image: '',
    maBienThePhong: null,
    pricePerNight: null,
    checkIn: '',
    checkOut: '',
    nights: null
});
const fallbackImage = '/assets/images/property-01.jpg';

const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + ' ₫';
};

const totalAmount = computed(() => {
    if (!bookingRoom.value.pricePerNight || !bookingRoom.value.nights) return null;
    return Number(bookingRoom.value.pricePerNight) * Number(bookingRoom.value.nights);
});

const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return null;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
    const diffMs = end - start;
    const nights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : null;
};

const persistBookingRoom = () => {
    localStorage.setItem('booking_room', JSON.stringify(bookingRoom.value));
};

// Dữ liệu form
const formData = ref({
    name: 'Phạm Văn A',
    email: 'email@example.com',
    phone: ''
});

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
    // 1. Kiểm tra xem đã nhập tên và sđt chưa
    if(!formData.value.name || !formData.value.phone) {
        alert("Vui lòng nhập đầy đủ họ tên và số điện thoại!");
        return;
    }
    
    if (!bookingRoom.value.checkIn || !bookingRoom.value.checkOut || !bookingRoom.value.nights) {
        alert("Vui lòng chọn ngày nhận phòng và trả phòng hợp lệ!");
        return;
    }
    if (!bookingRoom.value.maBienThePhong || !bookingRoom.value.pricePerNight) {
        alert("Thiếu thông tin phòng, vui lòng chọn lại phòng!");
        return;
    }

    // 2. Lưu thông tin khách hàng để hiển thị hóa đơn
    localStorage.setItem('booking_customer', JSON.stringify({
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone
    }));

    // 3. Gọi API tạo đặt phòng (lưu DB + trừ phòng)
    try {
        const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
        const payload = {
            MaKh: userInfo.id ?? null,
            MaBienThePhong: bookingRoom.value.maBienThePhong,
            NgayNhan: bookingRoom.value.checkIn,
            NgayTra: bookingRoom.value.checkOut,
            GiaDat: Number(bookingRoom.value.pricePerNight)
        };
        const res = await axios.post(`${API}/api/DatPhong/tao`, payload);
        if (res?.data?.maDatPhong) {
            localStorage.setItem('maDatPhong', String(res.data.maDatPhong));
        }
        if (res?.data?.soDem) {
            bookingRoom.value.nights = res.data.soDem;
            persistBookingRoom();
        }
    } catch (error) {
        const message = error?.response?.data || 'Đặt phòng thất bại!';
        alert(message);
        return;
    }

    // 4. Chuyển hướng sang trang Thanh Toán
    router.push('/payment'); 
};

onMounted(() => {
    const raw = localStorage.getItem('booking_room');
    if (raw) {
        try {
            Object.assign(bookingRoom.value, JSON.parse(raw));
        } catch (error) {
            console.warn('Không đọc được dữ liệu đặt phòng:', error);
        }
    }
    startTimer();
});

watch(
    () => [bookingRoom.value.checkIn, bookingRoom.value.checkOut],
    () => {
        bookingRoom.value.nights = calculateNights(bookingRoom.value.checkIn, bookingRoom.value.checkOut);
        persistBookingRoom();
    }
);

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