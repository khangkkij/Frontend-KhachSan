<template>
  <div class="payment-page">
    <div class="bg-white border-bottom py-3 mb-4">
        <div class="container d-flex justify-content-center align-items-center">
            <div class="step-item"><span class="step-num">1</span> Thông tin khách</div>
            <div class="progress-line"></div>
            <div class="step-item active"><span class="step-num">2</span> Thanh toán</div>
            <div class="progress-line"></div>
            <div class="step-item"><span class="step-num">3</span> Xác nhận</div>
        </div>
    </div>

    <div class="container mb-5">
        <div class="row">
            <div class="col-lg-8">
                <div class="card p-4 mb-3 shadow-sm border-0">
                    <h5 class="fw-bold mb-3">Chọn cách thanh toán</h5>
                    
                    <div 
                        class="payment-box p-3 mb-2 border" 
                        :class="{ active: paymentOption === 'later' }"
                        @click="paymentOption = 'later'"
                    >
                        <div class="form-check">
                            <input class="form-check-input" type="radio" value="later" v-model="paymentOption">
                            <label class="form-check-label fw-bold">Thanh toán sau (Vào ngày nhận phòng)</label>
                            <p class="small mb-0 text-orange">
                                <i class="fa fa-check"></i> KHÔNG SỢ RỦI RO! Bạn chưa cần trả tiền hôm nay.
                            </p>
                        </div>
                    </div>

                    <div 
                        class="payment-box p-3 border"
                        :class="{ active: paymentOption === 'now' }"
                        @click="paymentOption = 'now'"
                    >
                        <div class="form-check">
                            <input class="form-check-input" type="radio" value="now" v-model="paymentOption">
                            <label class="form-check-label fw-bold">Thanh toán ngay (Visa/MasterCard/Paypal)</label>
                            <div class="mt-2">
                                <i class="fab fa-cc-visa fa-lg me-2 text-primary"></i>
                                <i class="fab fa-cc-mastercard fa-lg me-2 text-danger"></i>
                                <i class="fab fa-cc-paypal fa-lg text-info"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card p-4 mb-3 shadow-sm border-0">
                    <h5 class="fw-bold mb-3">Thông tin thẻ tín dụng</h5>
                    <p class="small text-muted"><i class="fa fa-lock text-orange"></i> Mọi dữ liệu được mã hóa bảo mật 100%.</p>
                    
                    <div class="row g-4">
                        <div class="col-md-7">
                            <div class="mb-3">
                                <label class="form-label small fw-bold">Tên trên thẻ *</label>
                                <input type="text" class="form-control" v-model="cardInfo.name" placeholder="VD: NGUYEN VAN A">
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-bold">Số thẻ *</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fa fa-credit-card"></i></span>
                                    <input type="text" class="form-control" v-model="cardInfo.number" placeholder="0000 0000 0000 0000" maxlength="19">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    <label class="form-label small fw-bold">Ngày hết hạn *</label>
                                    <input type="text" class="form-control" v-model="cardInfo.expiry" placeholder="MM/YY" maxlength="5">
                                </div>
                                <div class="col-6">
                                    <label class="form-label small fw-bold">Mã CVC *</label>
                                    <input type="password" class="form-control" v-model="cardInfo.cvc" placeholder="123" maxlength="3">
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-5">
                            <div class="card-visual text-white">
                                <div class="d-flex justify-content-between mb-4">
                                    <div class="chip"></div>
                                    <i class="fab fa-cc-visa fa-2x"></i>
                                </div>
                                <div class="h5 mb-3 text-shadow">{{ cardInfo.number || '**** **** **** ****' }}</div>
                                <div class="d-flex justify-content-between mt-2">
                                    <small class="text-uppercase">{{ cardInfo.name || 'YOUR NAME' }}</small>
                                    <small>{{ cardInfo.expiry || 'MM/YY' }}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flight-promo card mb-4 border-0 shadow-sm">
                    <div class="row g-0 align-items-center">
                        <div class="col-3 text-center p-3 d-none d-sm-block">
                             <i class="fa fa-plane fa-3x text-orange"></i>
                        </div>
                        <div class="col-9 content">
                            <h6 class="fw-bold">Bạn cần vé máy bay đi Thanh Hóa?</h6>
                            <p class="fw-bold mb-1 text-orange">Giảm thêm 8% nếu đặt kèm ngay bây giờ!</p>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="flightCheck">
                                <label class="form-check-label small" for="flightCheck">Tôi quan tâm đến ưu đãi này</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-4">
                    <button @click="confirmPayment" class="btn-pay w-100 shadow d-block text-center text-decoration-none">
                        <i class="fa fa-lock me-2"></i> 
                        {{ paymentOption === 'later' ? 'ĐẶT TRƯỚC & TRẢ SAU' : 'THANH TOÁN NGAY' }}
                    </button>
                    <p class="text-center mt-2 small text-orange">
                        <i class="fa fa-shield-alt"></i> KHÔNG SỢ RỦI RO - Hủy phòng miễn phí trước 24h
                    </p>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="card p-3 border-0 shadow-sm">
                    <div class="d-flex justify-content-between mb-2">
                        <span>Tổng tiền phòng</span>
                        <span>{{ tongTienDisplay }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Phí dịch vụ</span>
                        <span>Miễn phí</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2 fw-bold text-orange" v-if="paymentOption === 'later'">
                        <span>Đặt cọc (30%)</span>
                        <span>{{ datCocDisplay }}</span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="h5 fw-bold">Tổng tiền</span>
                        <span class="h4 fw-bold mb-0 text-orange">{{ tongTienDisplay }}</span>
                    </div>
                    <p class="text-end small text-muted mt-2">Đã bao gồm VAT & Phí dịch vụ</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const apiBase = import.meta.env.VITE_API_URL;

// State quản lý
const paymentOption = ref('later'); // Mặc định là trả sau
const cardInfo = ref({
    name: 'PHAM VAN A',
    number: '',
    expiry: '',
    cvc: ''
});

const isSubmitting = ref(false);

const parseNumber = (value) => {
    if (value === undefined || value === null) return null;
    const normalized = String(value).replace(/[^0-9.-]/g, '');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const getPaymentInfo = () => {
    try {
        return JSON.parse(localStorage.getItem('payment_info') || '{}');
    } catch {
        return {};
    }
};

const paymentInfo = getPaymentInfo();
const maDatPhong = computed(() => parseNumber(route.query.maDatPhong) ?? parseNumber(paymentInfo.maDatPhong));
const soTien = computed(() => parseNumber(route.query.soTien) ?? parseNumber(paymentInfo.soTien));
const tongTienDisplay = computed(() => soTien.value ? Number(soTien.value).toLocaleString('vi-VN') + ' ₫' : '0 ₫');
const datCocDisplay = computed(() => {
    if (!soTien.value) return '0 ₫';
    return Math.round(soTien.value * 0.3).toLocaleString('vi-VN') + ' ₫';
});

const confirmPayment = async () => {
    if (isSubmitting.value) return;

    const maDatPhongValue = maDatPhong.value;
    const soTienValue = soTien.value;

    if (!maDatPhongValue || !soTienValue) {
        alert("Thiếu thông tin thanh toán. Vui lòng quay lại bước đặt phòng!");
        return;
    }

    if (paymentOption.value === 'now') {
        if (!cardInfo.value.name || !cardInfo.value.number) {
            alert("Vui lòng nhập thông tin thẻ để thanh toán!");
            return;
        }
    }

    const soTienDatCoc = Math.round(soTienValue * 0.3);

    try {
        isSubmitting.value = true;

        const xacNhanResponse = await axios.post(
            `${apiBase}/api/DatPhong/xac-nhan/${maDatPhongValue}`
        );

        const maHd = xacNhanResponse?.data?.maHd;

        if (paymentOption.value === 'later') {
            await axios.post(
                `${apiBase}/api/ThanhToan/dat-coc`,
                {
                    MaDatPhong: maDatPhongValue,
                    SoTien: soTienDatCoc,
                    HinhThucThanhToan: 'TaiQuay'
                }
            );

            alert("Đặt cọc thành công! Bạn sẽ thanh toán phần còn lại tại khách sạn.");
        } else {
            const thanhToanResponse = await axios.post(
                `${apiBase}/api/ThanhToan/thanh-toan`,
                {
                    MaHd: maHd,
                    SoTien: soTienValue,
                    HinhThucThanhToan: 'TheTinDung'
                }
            );

            const maTt = thanhToanResponse?.data?.maTt;
            if (maTt) {
                await axios.put(`${apiBase}/api/ThanhToan/xac-nhan/${maTt}`);
            }

            alert("Thanh toán thành công! Vé điện tử đã gửi về email.");
        }

        router.push({
            path: '/xac-nhan-dat-phong',
            query: { maDatPhong: maDatPhongValue }
        });
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            alert(`Lỗi hệ thống (${status}): ${error.response.data || 'Thử lại sau'}`);
        } else {
            console.error("Lỗi kết nối:", error);
            alert("Không thể kết nối đến Server. Hãy kiểm tra đường truyền!");
        }
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<style scoped>
/* Biến màu (đã thay bằng giá trị cụ thể để chạy độc lập) */
.text-orange { color: #f35525 !important; }
.bg-orange { background-color: #f35525 !important; }

.payment-page {
    background-color: #f8f7f9;
    min-height: 100vh;
}

/* Thanh tiến trình */
.step-item { display: flex; align-items: center; color: #999; font-weight: 600; margin: 0 10px; position: relative; font-size: 14px; }
.step-item.active { color: #f35525; }
.step-num { background: #eee; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 8px; font-size: 12px; }
.step-item.active .step-num { background: #f35525; color: white; }
.progress-line { flex-grow: 1; height: 2px; background: #ddd; max-width: 50px; margin: 0 5px; }

/* Hộp chọn thanh toán */
.payment-box { 
    cursor: pointer; 
    border-radius: 8px; 
    transition: all 0.2s;
}
.payment-box:hover { border-color: #f35525 !important; }
.payment-box.active { 
    border-color: #f35525 !important; 
    background-color: #fff4e6; 
}

/* Thẻ Visual (Mô phỏng) */
.card-visual { 
    background: linear-gradient(135deg, #1e1e1e 0%, #444 100%); 
    border-radius: 12px; 
    height: 180px; 
    padding: 20px; 
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}
.chip { width: 40px; height: 30px; background: #c0c0c0; border-radius: 5px; background: linear-gradient(135deg, #d4af37 0%, #f0e68c 100%); }
.text-shadow { text-shadow: 1px 1px 2px rgba(0,0,0,0.5); font-family: 'Courier New', monospace; letter-spacing: 2px; }

/* Coupon & Promo */
.coupon-box { border: 2px dashed #f35525; border-radius: 8px; background: #fff4e6; display: flex; align-items: center; padding: 15px; }
.coupon-icon { font-size: 2rem; color: #f35525; margin-right: 15px; }

.flight-promo .content { background: #fff4e6; padding: 15px; height: 100%; border-radius: 0 8px 8px 0; }

/* Button */
.btn-pay { 
    background-color: #f35525; 
    color: white; 
    border: none; 
    padding: 15px; 
    font-weight: bold; 
    font-size: 1.1rem; 
    border-radius: 8px; 
    transition: all 0.3s;
}
.btn-pay:hover { 
    background-color: #d14013; 
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(243, 85, 37, 0.4);
}
</style>