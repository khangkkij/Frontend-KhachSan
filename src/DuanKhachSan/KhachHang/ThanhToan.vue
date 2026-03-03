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
                      
                      <div class="payment-box p-3 mb-2 border" :class="{ active: paymentOption === 'deposit' }" @click="paymentOption = 'deposit'">
                          <div class="form-check">
                              <input class="form-check-input" type="radio" value="deposit" v-model="paymentOption">
                              <label class="form-check-label fw-bold">Đặt cọc 30% (Giữ phòng)</label>
                              <p class="small mb-0 text-orange">
                                  <i class="fa fa-check"></i> Thanh toán trước {{ formatCurrency(depositAmount) }} để giữ phòng.
                              </p>
                          </div>
                      </div>
  
                      <div class="payment-box p-3 border" :class="{ active: paymentOption === 'full' }" @click="paymentOption = 'full'">
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
                                  <img class="payment-logo" src="/assets/images/vnpay.svg" alt="VNPay">
                                  <span>VNPay</span>
                              </div>
                          </div>
                          <div class="col-md-4">
                              <div class="payment-method" :class="{ active: paymentMethod === 'momo' }" @click="paymentMethod = 'momo'">
                                  <input class="form-check-input me-2" type="radio" value="momo" v-model="paymentMethod">
                                  <img class="payment-logo" src="/assets/images/momo.svg" alt="MoMo">
                                  <span>MoMo</span>
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
  
      <div v-if="showVoucherModal" class="voucher-modal-overlay" @click.self="showVoucherModal = false">
          <div class="voucher-modal-content animate__animated animate__fadeIn">
              <div class="d-flex justify-content-between align-items-center mb-4 px-2 border-bottom pb-3">
                  <h5 class="fw-bold mb-0 text-dark">Kho Voucher</h5>
                  <button class="btn-close" @click="showVoucherModal = false"></button>
              </div>
              
              <div class="voucher-list px-1">
                  <div v-if="myVouchers.length === 0" class="text-center py-5">
                      <i class="fa fa-ticket-alt fa-3x text-muted opacity-25 mb-3"></i>
                      <p class="text-muted">Kho voucher của bạn đang trống.</p>
                  </div>
                  
                  <div v-for="v in paginatedVouchers" :key="v.maCode" 
                       class="voucher-ticket mb-3"
                       :class="{ 'disabled-voucher': baseAmount < v.giaToiThieu || v.isExpired }"
                       @click="selectVoucher(v)">
                      
                      <div class="ticket-left">
                          <div class="ticket-value">{{ v.phanTramGiam ? v.phanTramGiam + '%' : formatK(v.soTienGiam) }}</div>
                          <div class="ticket-label">GIẢM</div>
                      </div>
  
                      <div class="ticket-right">
                          <div class="d-flex justify-content-between align-items-start">
                              <div class="ticket-code">{{ v.maCode }}</div>
                              <span v-if="baseAmount >= v.giaToiThieu && !v.isExpired" class="badge-use">Sử dụng</span>
                          </div>
                          <p class="ticket-desc text-truncate-2">{{ v.moTa }}</p>
                          <div class="ticket-footer mt-auto">
                              Đơn tối thiểu: <strong>{{ formatCurrency(v.giaToiThieu) }}</strong>
                          </div>
                      </div>
                      
                      <div class="ticket-notch notch-top"></div>
                      <div class="ticket-notch notch-bottom"></div>
                  </div>
              </div>
  
              <div v-if="totalPages > 1" class="pagination-footer d-flex justify-content-center align-items-center mt-3 pt-3 border-top">
                  <button class="btn-page" :disabled="currentPage === 1" @click="currentPage--">
                      <i class="fa fa-chevron-left"></i>
                  </button>
                  <span class="page-info mx-3">Trang <b>{{ currentPage }}</b> / {{ totalPages }}</span>
                  <button class="btn-page" :disabled="currentPage === totalPages" @click="currentPage++">
                      <i class="fa fa-chevron-right"></i>
                  </button>
              </div>
          </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  
  const router = useRouter();
  const route = useRoute();
  const API = import.meta.env.VITE_API_URL;
  
  const paymentOption = ref('deposit'); 
  const paymentMethod = ref('vnpay');
  const bookingRoom = ref({ pricePerNight: null, nights: null, quantity: 1 });
  const bookingRooms = ref([]);
  
  // Voucher States
  const voucherInput = ref('');
  const appliedVoucher = ref(null);
  const voucherMessage = ref('');
  const myVouchers = ref([]);
  const showVoucherModal = ref(false);
  
  // Logic Phân trang
  const currentPage = ref(1);
  const itemsPerPage = 4;
  
  const totalPages = computed(() => Math.ceil(myVouchers.value.length / itemsPerPage));
  const paginatedVouchers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return myVouchers.value.slice(start, start + itemsPerPage);
  });
  
  const baseAmount = computed(() => {
      const nights = Number(bookingRoom.value.nights || 0);
      if (!nights) return 0;
      const rooms = bookingRooms.value.length ? bookingRooms.value : [{
          pricePerNight: Number(bookingRoom.value.pricePerNight || 0),
          quantity: Number(bookingRoom.value.quantity || 1)
      }];
      return rooms.reduce((sum, room) => sum + (Number(room.pricePerNight) * Number(room.quantity) * nights), 0);
  });
  
  const discountValue = computed(() => {
      if (!appliedVoucher.value) return 0;
      const v = appliedVoucher.value;
      // FIX: Đảm bảo lấy đúng trường dữ liệu phanTramGiam/soTienGiam từ API trả về
      const phanTram = v.phanTramGiam || v.PhanTramGiam || 0;
      const tienMat = v.soTienGiam || v.SoTienGiam || 0;

      let discount = phanTram > 0 ? (baseAmount.value * phanTram / 100) : tienMat;
      return Math.min(discount, baseAmount.value);
  });
  
  const totalAmount = computed(() => Math.max(0, baseAmount.value - discountValue.value));
  const currentPayAmount = computed(() => paymentOption.value === 'deposit' ? Math.round(totalAmount.value * 0.3) : totalAmount.value);
  const depositAmount = computed(() => Math.round(totalAmount.value * 0.3));
  const remainingAmount = computed(() => totalAmount.value - currentPayAmount.value);
  
  const formatCurrency = (amount) => Number(amount || 0).toLocaleString('vi-VN') + ' ₫';
  const formatK = (v) => v >= 1000 ? (v / 1000) + 'K' : v;
  
  const fetchMyVouchers = async () => {
    try {
        const res = await axios.get(`${API}/api/Voucher/my-vouchers?pageSize=100`, { withCredentials: true });
        myVouchers.value = res.data.items || [];
        currentPage.value = 1; 
    } catch (error) { 
        console.error("Lỗi tải kho voucher"); 
    }
};
  
  const openVoucherModal = () => { fetchMyVouchers(); showVoucherModal.value = true; };
  
  const selectVoucher = (v) => {
      if (v.isExpired || (v.giaToiThieu && baseAmount.value < v.giaToiThieu)) return;
      appliedVoucher.value = v;
      voucherInput.value = v.maCode;
      voucherMessage.value = "Áp dụng thành công!";
      showVoucherModal.value = false;
  };
  
  // FIX: Cập nhật hàm applyVoucher để gọi endpoint kiểm tra mã không phân trang
  const applyVoucher = async () => {
      if (!voucherInput.value) return;
      voucherMessage.value = "Đang kiểm tra...";
      try {
          // Gọi endpoint kiểm tra mã chuyên dụng (đã tạo ở bước Backend)
          const res = await axios.get(`${API}/api/Voucher/check-voucher/${voucherInput.value.toUpperCase()}`, { withCredentials: true });
          const v = res.data;

          if (v.giaToiThieu && baseAmount.value < v.giaToiThieu) {
              voucherMessage.value = `Đơn tối thiểu ${formatCurrency(v.giaToiThieu)} mới dùng được mã này.`;
              appliedVoucher.value = null;
              return;
          }

          appliedVoucher.value = v;
          voucherMessage.value = "Áp dụng thành công!";
      } catch (error) {
          appliedVoucher.value = null;
          voucherMessage.value = error.response?.data?.message || "Mã không hợp lệ hoặc chưa được lưu trong kho.";
      }
  };
  
  const removeVoucher = () => { appliedVoucher.value = null; voucherInput.value = ''; voucherMessage.value = ''; };
  
  const confirmPayment = async () => {
      const maDatPhong = localStorage.getItem('maDatPhong');
      if (!maDatPhong) return alert("Thiếu thông tin đặt phòng");

      try {
          // Gửi thông tin kèm maCode để Backend cập nhật lại hóa đơn chuẩn xác
          const endpoint = paymentOption.value === 'deposit' ? 'dat-coc' : 'thanh-toan';
          const res = await axios.post(`${API}/api/ThanhToan/${endpoint}`, {
              maDatPhong: Number(maDatPhong),
              soTien: Number(currentPayAmount.value),
              hinhThucThanhToan: paymentMethod.value,
              maCode: appliedVoucher.value?.maCode || null
          }, { withCredentials: true });

          if (res?.data?.redirectUrl) {
              window.location.href = res.data.redirectUrl;
          }
      } catch (error) { 
          Swal.fire('Lỗi', error.response?.data || 'Thanh toán thất bại', 'error'); 
      }
  };
  
  onMounted(() => {
      const raw = localStorage.getItem('booking_room');
      const rawRooms = localStorage.getItem('booking_rooms');
      if (raw) bookingRoom.value = JSON.parse(raw);
      if (rawRooms) bookingRooms.value = JSON.parse(rawRooms);
  });
  </script>
  
  <style scoped>
  /* GIỮ NGUYÊN TOÀN BỘ CSS CỦA BẠN */
  .text-orange { color: #f35525 !important; }
  .bg-orange { background-color: #f35525 !important; }
  .payment-page { background-color: #f8f7f9; min-height: 100vh; }
  .step-item { display: flex; align-items: center; color: #999; font-weight: 600; font-size: 14px; }
  .step-item.active { color: #f35525; }
  .step-num { background: #eee; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 8px; }
  .step-item.active .step-num { background: #f35525; color: white; }
  .progress-line { flex-grow: 1; height: 2px; background: #ddd; max-width: 50px; margin: 0 10px; }
  .payment-box, .payment-method { cursor: pointer; border-radius: 8px; transition: 0.2s; background: #fff; }
  .payment-box.active, .payment-method.active { border-color: #f35525 !important; background-color: #fff4e6; }
  .payment-logo { width: 52px; height: 26px; object-fit: contain; margin-right: 8px; }
  .btn-pay { background-color: #f35525; color: white; padding: 16px; font-weight: bold; border-radius: 8px; cursor: pointer; width: 100%; }
  .btn-outline-orange { border-color: #f35525; color: #f35525; }
  .btn-outline-orange:hover { background-color: #f35525; color: white; }
  
  .voucher-modal-overlay { 
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(0,0,0,0.5); z-index: 2000; 
      display: flex; align-items: center; justify-content: center;
  }
  
  .voucher-modal-content { 
      background: #fff; width: 90%; max-width: 420px; 
      border-radius: 16px; padding: 20px; max-height: 85vh; 
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      display: flex; flex-direction: column;
  }
  
  .voucher-ticket {
      display: flex; position: relative; background: #fff; border: 1px solid #f0f0f0;
      border-radius: 10px; min-height: 100px; cursor: pointer; transition: 0.2s;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05));
      overflow: visible;
  }
  .voucher-ticket:hover:not(.disabled-voucher) { border-color: #f35525; transform: translateY(-2px); }
  
  .ticket-left {
      width: 90px; background: linear-gradient(135deg, #f35525, #ff8a65);
      color: #fff; display: flex; flex-direction: column;
      align-items: center; justify-content: center; border-radius: 10px 0 0 10px;
  }
  .ticket-value { font-size: 1.4rem; font-weight: 800; line-height: 1; }
  .ticket-label { font-size: 0.7rem; font-weight: 600; margin-top: 4px; }
  
  .ticket-right { flex: 1; padding: 12px 15px; display: flex; flex-direction: column; background: #fff; border-radius: 0 10px 10px 0; }
  .ticket-code { font-family: monospace; font-weight: 700; color: #f35525; font-size: 0.9rem; background: #fff4e6; padding: 2px 6px; border-radius: 4px; }
  .badge-use { font-size: 0.65rem; color: #28a745; font-weight: 700; text-transform: uppercase; }
  .ticket-desc { font-size: 0.8rem; color: #666; margin: 6px 0; }
  .ticket-footer { font-size: 0.75rem; color: #999; }
  
  .ticket-notch { position: absolute; width: 14px; height: 14px; background: #fff; border-radius: 50%; left: 83px; z-index: 2; border: 1px solid #f0f0f0; }
  .notch-top { top: -8px; border-top: 0; }
  .notch-bottom { bottom: -8px; border-bottom: 0; }
  
  .disabled-voucher { opacity: 0.5; filter: grayscale(1); cursor: not-allowed; }
  
  .pagination-footer { gap: 10px; }
  .btn-page { border: 1px solid #ddd; background: #fff; color: #666; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
  .btn-page:hover:not(:disabled) { background: #f35525; color: #fff; border-color: #f35525; }
  .btn-page:disabled { opacity: 0.3; cursor: not-allowed; }
  .page-info { font-size: 0.85rem; color: #444; }
  
  .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  </style>