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
                          :class="{ active: paymentOption === 'deposit' }"
                          @click="paymentOption = 'deposit'"
                      >
                          <div class="form-check">
                              <input class="form-check-input" type="radio" value="deposit" v-model="paymentOption">
                              <label class="form-check-label fw-bold">Đặt cọc 30% (Giữ phòng)</label>
                              <p class="small mb-0 text-orange">
                                  <i class="fa fa-check"></i> Thanh toán trước {{ formatCurrency(depositAmount) }} để giữ phòng.
                              </p>
                          </div>
                      </div>
  
                      <div 
                          class="payment-box p-3 border"
                          :class="{ active: paymentOption === 'full' }"
                          @click="paymentOption = 'full'"
                      >
                          <div class="form-check">
                              <input class="form-check-input" type="radio" value="full" v-model="paymentOption">
                              <label class="form-check-label fw-bold">Thanh toán ngay 100%</label>
                              <p class="small mb-0 text-orange">
                                  <i class="fa fa-check"></i> Thanh toán toàn bộ {{ formatCurrency(totalAmount) }} ngay bây giờ.
                              </p>
                          </div>
                      </div>
                  </div>
  
                  <div class="card p-4 mb-3 shadow-sm border-0">
                      <h5 class="fw-bold mb-3">Phương thức thanh toán</h5>
                      <div class="row g-3 mb-3">
                          <div class="col-md-4">
                              <div class="payment-method" :class="{ active: paymentMethod === 'vnpay' }" @click="paymentMethod = 'vnpay'">
                                  <input class="form-check-input me-2" type="radio" value="vnpay" v-model="paymentMethod">
                                  <span>VNPay</span>
                              </div>
                          </div>
                          <div class="col-md-4">
                              <div class="payment-method" :class="{ active: paymentMethod === 'momo' }" @click="paymentMethod = 'momo'">
                                  <input class="form-check-input me-2" type="radio" value="momo" v-model="paymentMethod">
                                  <span>Momo</span>
                              </div>
                          </div>
                          <div class="col-md-4">
                              <div class="payment-method" :class="{ active: paymentMethod === 'visa' }" @click="paymentMethod = 'visa'">
                                  <input class="form-check-input me-2" type="radio" value="visa" v-model="paymentMethod">
                                  <span>Visa / MasterCard</span>
                              </div>
                          </div>
                      </div>
  
                      <div v-if="paymentMethod === 'visa'" class="animate__animated animate__fadeIn">
                          <h6 class="fw-bold mb-3">Thông tin thẻ</h6>
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
                                      <div class="d-flex justify-content-between mt-2 text-uppercase">
                                          <small>{{ cardInfo.name || 'YOUR NAME' }}</small>
                                          <small>{{ cardInfo.expiry || 'MM/YY' }}</small>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
  
                  <div class="mb-4">
                      <button @click="confirmPayment" class="btn-pay w-100 shadow border-0">
                          <i class="fa fa-lock me-2"></i> 
                          {{ paymentOption === 'deposit' ? 'THANH TOÁN ĐẶT CỌC 30%' : 'THANH TOÁN 100% NGAY' }}
                      </button>
                      <p class="text-center mt-2 small text-orange">
                          <i class="fa fa-shield-alt"></i> KHÔNG SỢ RỦI RO - Hủy phòng miễn phí trước 24h
                      </p>
                  </div>
              </div>
  
              <div class="col-lg-4">
                  <div class="card p-3 mb-3 border-0 shadow-sm">
                      <h6 class="fw-bold mb-3"><i class="fa fa-ticket-alt text-orange me-2"></i>Mã giảm giá Luxury</h6>
                      <div class="input-group mb-2">
                          <input type="text" class="form-control" v-model="voucherInput" placeholder="Nhập mã ưu đãi..." :disabled="appliedVoucher">
                          <button class="btn btn-outline-orange" type="button" @click="applyVoucher" v-if="!appliedVoucher">Áp dụng</button>
                          <button class="btn btn-outline-danger" type="button" @click="removeVoucher" v-else>Hủy</button>
                      </div>
                      <div v-if="!appliedVoucher" class="text-end">
                          <a href="javascript:void(0)" class="small text-orange fw-bold text-decoration-none" @click="openVoucherModal">
                              <i class="fa fa-layer-group me-1"></i>Hoặc chọn từ kho của bạn
                          </a>
                      </div>
  
                      <div v-if="voucherMessage" :class="['small mt-1', appliedVoucher ? 'text-success' : 'text-danger']">
                          <i :class="appliedVoucher ? 'fa fa-check-circle' : 'fa fa-exclamation-circle'"></i> {{ voucherMessage }}
                      </div>
                      <div v-if="appliedVoucher" class="applied-info p-2 mt-2 border rounded bg-light small">
                          <div class="fw-bold text-dark">{{ appliedVoucher.maCode }}</div>
                          <div class="text-muted">{{ appliedVoucher.moTa }}</div>
                      </div>
                  </div>
  
                  <div class="card p-3 border-0 shadow-sm billing-card">
                      <div class="badge bg-danger mb-3 py-2 w-100 fw-bold">ƯU ĐÃI ĐẶT PHÒNG HÔM NAY</div>
                      <div class="d-flex justify-content-between mb-2">
                          <span>Giá niêm yết ({{ bookingRoom.nights }} đêm)</span>
                          <span>{{ formatCurrency(baseAmount) }}</span>
                      </div>
                      <div class="d-flex justify-content-between mb-2 fw-bold text-orange" v-if="discountValue > 0">
                          <span>Mã giảm giá đã áp dụng</span>
                          <span>- {{ formatCurrency(discountValue) }}</span>
                      </div>
                      <div class="d-flex justify-content-between mb-2">
                          <span>Phí dịch vụ & VAT</span>
                          <span class="text-success">Bao gồm</span>
                      </div>
                      <hr>
                      <div class="d-flex justify-content-between align-items-center">
                          <span class="h5 fw-bold">Tổng tiền</span>
                          <span class="h4 fw-bold mb-0 text-orange">{{ formatCurrency(totalAmount) }}</span>
                      </div>
                      <div class="payment-summary-box mt-3 p-3 bg-light border-start border-orange border-4">
                          <div class="d-flex justify-content-between">
                              <span class="fw-bold small">{{ paymentOption === 'deposit' ? 'Tiền đặt cọc (30%)' : 'Thanh toán ngay (100%)' }}</span>
                              <span class="fw-bold text-orange">{{ formatCurrency(currentPayAmount) }}</span>
                          </div>
                          <div class="small text-muted mt-1" v-if="paymentOption === 'deposit'">
                              Số tiền còn lại ({{ formatCurrency(remainingAmount) }}) thanh toán tại quầy.
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  
      <div v-if="showVoucherModal" class="voucher-modal-overlay">
          <div class="voucher-modal-content animate__animated animate__fadeInUp">
              <div class="d-flex justify-content-between align-items-center mb-4 px-3 border-bottom pb-3">
                  <h5 class="fw-bold mb-0">Kho Voucher Của Bạn</h5>
                  <button class="btn-close" @click="showVoucherModal = false"></button>
              </div>
              
              <div class="voucher-list px-2">
                  <div v-if="myVouchers.length === 0" class="text-center py-5">
                      <i class="fa fa-ticket-alt fa-3x text-muted opacity-25 mb-3"></i>
                      <p class="text-muted">Kho voucher của bạn đang trống.</p>
                  </div>
                  
                  <div v-for="v in myVouchers" :key="v.maCode" 
                       class="voucher-item-select mb-3 d-flex border rounded-3 overflow-hidden"
                       :class="{ 'disabled-voucher': baseAmount < v.giaToiThieu || v.isExpired }"
                       @click="selectVoucher(v)">
                      <div class="v-select-left bg-orange text-white p-3 d-flex flex-column justify-content-center align-items-center">
                          <span class="fw-bold fs-4">{{ v.phanTramGiam ? v.phanTramGiam + '%' : formatK(v.soTienGiam) }}</span>
                          <small class="fw-bold">GIẢM</small>
                      </div>
                      <div class="v-select-right p-3 flex-grow-1 bg-white">
                          <div class="fw-bold text-dark">{{ v.maCode }}</div>
                          <p class="small text-muted mb-1 text-truncate-2">{{ v.moTa }}</p>
                          <div class="mt-2 d-flex justify-content-between align-items-center">
                              <small :class="baseAmount >= v.giaToiThieu ? 'text-success' : 'text-danger'" class="fw-bold">
                                  Đơn tối thiểu: {{ formatCurrency(v.giaToiThieu) }}
                              </small>
                              <span v-if="baseAmount >= v.giaToiThieu && !v.isExpired" class="badge bg-success">Chọn dùng</span>
                              <span v-else-if="v.isExpired" class="badge bg-secondary">Hết hạn</span>
                              <span v-else class="badge bg-danger">Chưa đủ ĐK</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  const API = import.meta.env.VITE_API_URL;
  
  // State quản lý
  const paymentOption = ref('deposit'); 
  const paymentMethod = ref('vnpay');
  const cardInfo = ref({ name: 'PHAM VAN A', number: '', expiry: '', cvc: '' });
  const bookingRoom = ref({ pricePerNight: null, nights: null, quantity: 1 });
  
  // State Voucher
  const voucherInput = ref('');
  const appliedVoucher = ref(null);
  const voucherMessage = ref('');
  const myVouchers = ref([]);
  const showVoucherModal = ref(false);
  
  // Logic tiền phòng
  const baseAmount = computed(() => {
      const price = Number(bookingRoom.value.pricePerNight || 0);
      const nights = Number(bookingRoom.value.nights || 0);
      const qty = Number(bookingRoom.value.quantity || 1);
      return price * nights * qty;
  });
  
  const discountValue = computed(() => {
      if (!appliedVoucher.value) return 0;
      const v = appliedVoucher.value;
      let discount = v.phanTramGiam ? (baseAmount.value * v.phanTramGiam / 100) : v.soTienGiam;
      return Math.min(discount, baseAmount.value);
  });
  
  const totalAmount = computed(() => Math.max(0, baseAmount.value - discountValue.value));
  const currentPayAmount = computed(() => paymentOption.value === 'deposit' ? Math.round(totalAmount.value * 0.3) : totalAmount.value);
  const depositAmount = computed(() => Math.round(totalAmount.value * 0.3));
  const remainingAmount = computed(() => totalAmount.value - currentPayAmount.value);
  
  const formatCurrency = (amount) => Number(amount || 0).toLocaleString('vi-VN') + ' ₫';
  const formatK = (v) => v >= 1000 ? (v / 1000) + 'K' : v;
  
  // API Kho Voucher
  const fetchMyVouchers = async () => {
      try {
          const res = await axios.get(`${API}/api/Voucher/my-vouchers`, { withCredentials: true });
          myVouchers.value = res.data.items;
      } catch (error) { console.error("Lỗi tải kho voucher"); }
  };
  
  const openVoucherModal = () => { fetchMyVouchers(); showVoucherModal.value = true; };
  
  const selectVoucher = (v) => {
      if (v.isExpired || (v.giaToiThieu && baseAmount.value < v.giaToiThieu)) return;
      appliedVoucher.value = v;
      voucherInput.value = v.maCode;
      voucherMessage.value = "Áp dụng thành công từ kho!";
      showVoucherModal.value = false;
  };
  
  const applyVoucher = async () => {
      if (!voucherInput.value) return;
      try {
          const res = await axios.get(`${API}/api/Voucher/check/${voucherInput.value}`);
          if (res.data.giaToiThieu && baseAmount.value < res.data.giaToiThieu) {
              voucherMessage.value = "Chưa đạt đơn hàng tối thiểu";
              return;
          }
          appliedVoucher.value = res.data;
          voucherMessage.value = "Áp dụng thành công!";
      } catch (error) { voucherMessage.value = "Mã không hợp lệ"; }
  };
  
  const removeVoucher = () => { appliedVoucher.value = null; voucherInput.value = ''; voucherMessage.value = ''; };
  
  const confirmPayment = async () => {
      const maDatPhong = localStorage.getItem('maDatPhong');
      if (!maDatPhong) return alert("Thiếu thông tin đặt phòng");
      
      try {
          const endpoint = paymentOption.value === 'deposit' ? 'dat-coc' : 'thanh-toan';
          await axios.post(`${API}/api/ThanhToan/${endpoint}`, {
              MaDatPhong: Number(maDatPhong),
              SoTien: Number(currentPayAmount.value),
              HinhThucThanhToan: paymentMethod.value,
              MaCode: appliedVoucher.value?.maCode || null // Gửi kèm mã Voucher về Backend
          });
          const paymentSnapshot = {
              option: paymentOption.value,
              method: paymentMethod.value,
              totalAmount: Number(totalAmount.value || 0),
              depositAmount: Number(depositAmount.value || 0),
              remainingAmount: Number(remainingAmount.value || 0),
              paidAmount: Number(currentPayAmount.value || 0),
              createdAt: new Date().toISOString()
          };
          localStorage.setItem('booking_payment', JSON.stringify(paymentSnapshot));
          router.push('/xac-nhan-dat-phong');
      } catch (error) { alert("Thanh toán thất bại"); }
  };
  
  onMounted(() => {
      const raw = localStorage.getItem('booking_room');
      if (raw) {
          const data = JSON.parse(raw);
          bookingRoom.value = { pricePerNight: data.pricePerNight, nights: data.nights, quantity: data.quantity || 1 };
      }
  });
  </script>
  
  <style scoped>
  .text-orange { color: #f35525 !important; }
  .bg-orange { background-color: #f35525 !important; }
  .payment-page { background-color: #f8f7f9; min-height: 100vh; }
  .step-item { display: flex; align-items: center; color: #999; font-weight: 600; font-size: 14px; }
  .step-item.active { color: #f35525; }
  .step-num { background: #eee; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 8px; }
  .step-item.active .step-num { background: #f35525; color: white; }
  .progress-line { flex-grow: 1; height: 2px; background: #ddd; max-width: 50px; margin: 0 10px; }
  .payment-box { cursor: pointer; border-radius: 8px; transition: 0.2s; }
  .payment-box.active { border-color: #f35525 !important; background-color: #fff4e6; }
  .payment-method { display: flex; align-items: center; border: 1px solid #eee; border-radius: 8px; padding: 12px; cursor: pointer; background: #fff; }
  .payment-method.active { border-color: #f35525 !important; background-color: #fff4e6; }
  .card-visual { background: linear-gradient(135deg, #1e1e1e 0%, #444 100%); border-radius: 15px; height: 180px; padding: 25px; box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
  .chip { width: 45px; height: 35px; border-radius: 5px; background: linear-gradient(135deg, #d4af37 0%, #f0e68c 100%); }
  .btn-pay { background-color: #f35525; color: white; padding: 16px; font-weight: bold; font-size: 1.1rem; border-radius: 8px; cursor: pointer; width: 100%; transition: 0.3s; }
  .btn-pay:hover { background-color: #d14013; transform: translateY(-2px); }
  .btn-outline-orange { border-color: #f35525; color: #f35525; }
  .btn-outline-orange:hover { background-color: #f35525; color: white; }
  
  /* Voucher Modal */
  .voucher-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: flex-end; justify-content: center; }
  .voucher-modal-content { background: white; width: 100%; max-width: 500px; border-radius: 20px 20px 0 0; padding: 20px; max-height: 80vh; overflow-y: auto; }
  .voucher-item-select { cursor: pointer; transition: 0.2s; }
  .voucher-item-select:hover:not(.disabled-voucher) { border-color: #f35525; transform: scale(1.02); }
  .v-select-left { width: 100px; position: relative; }
  .disabled-voucher { opacity: 0.5; cursor: not-allowed; }
  .billing-card { position: sticky; top: 20px; }
  .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  </style>