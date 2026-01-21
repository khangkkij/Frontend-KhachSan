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
                <div class="coupon-box mb-3">
                    <div class="coupon-icon"><i class="fa fa-gift"></i></div>
                    <div>
                        <div class="fw-bold">Đã giảm 121.020 ₫</div>
                        <div class="small text-muted">Mã giảm giá Luxury đã áp dụng</div>
                    </div>
                </div>

                <div class="card p-3 border-0 shadow-sm">
                    <div class="badge bg-danger mb-3 py-2 w-100">GIẢM 27% HÔM NAY</div>
                    
                    <div class="d-flex justify-content-between mb-2">
                        <span>Giá gốc</span>
                        <span class="text-decoration-line-through text-muted">1.300.000 ₫</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Giá niêm yết</span>
                        <span>1.072.500 ₫</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2 fw-bold text-orange">
                        <span>Mã giảm giá</span>
                        <span>- 121.020 ₫</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Phí dịch vụ</span>
                        <span>Miễn phí</span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="h5 fw-bold">Tổng tiền</span>
                        <span class="h4 fw-bold mb-0 text-orange">951.480 ₫</span>
                    </div>
                    <p class="text-end small text-muted mt-2">Đã bao gồm VAT & Phí dịch vụ</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// State quản lý
const paymentOption = ref('later'); // Mặc định là trả sau
const cardInfo = ref({
    name: 'PHAM VAN A',
    number: '',
    expiry: '',
    cvc: ''
});

// Hàm xử lý thanh toán
const confirmPayment = () => {
    // 1. Validate đơn giản
    if (!cardInfo.value.name || !cardInfo.value.number) {
        alert("Vui lòng nhập thông tin thẻ để đảm bảo giữ phòng!");
        return;
    }

    // 2. Xử lý logic
    if (paymentOption.value === 'later') {
        alert("Đặt phòng thành công! Bạn sẽ thanh toán tại khách sạn.");
    } else {
        alert("Thanh toán thành công! Vé điện tử đã gửi về email.");
    }

    // 3. Chuyển hướng sang trang Xác nhận (Sẽ làm sau)
    // router.push('/booking-success');
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