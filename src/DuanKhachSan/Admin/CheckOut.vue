<template>
  <div class="page-container">
    <div class="card card-custom mb-4">
      <div class="card-body d-flex flex-wrap gap-3 justify-content-between align-items-center">
        <div>
          <h5 class="card-title fw-bold text-primary mb-1">
            <i class="bx bx-log-out-circle me-2"></i>Check-out (Trả phòng)
          </h5>
          <small class="text-muted">Tính toán chính xác tổng tiền và chốt hóa đơn</small>
        </div>
        <div class="input-group input-group-custom">
          <span class="input-group-text"><i class="bx bx-search"></i></span>
          <input
            v-model="roomSearch"
            type="text"
            class="form-control"
            placeholder="Tìm số phòng, tên khách..."
          />
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-7">
        <div class="card card-custom mb-4">
          <div class="card-body">
            <h6 class="fw-bold mb-3">1. Truy xuất phòng đang ở</h6>
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Phòng</th>
                    <th>Khách hàng</th>
                    <th>Ngày vào</th>
                    <th>Ngày ra dự kiến</th>
                    <th class="text-end">Chọn</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="room in filteredOccupiedRooms" :key="room.maPhong">
                    <td class="fw-bold">#{{ room.soPhong }}</td>
                    <td>
                      <div class="fw-semibold">{{ room.tenKhach || 'Chưa có tên' }}</div>
                      <small class="text-muted">{{ room.sdt || 'Chưa có SĐT' }}</small>
                    </td>
                    <td>{{ formatDate(room.ngayNhan) }}</td>
                    <td>{{ formatDate(room.ngayTra) }}</td>
                    <td class="text-end">
                      <button class="btn btn-sm btn-primary" @click="selectRoom(room)">
                        Chọn
                      </button>
                    </td>
                  </tr>
                  <tr v-if="filteredOccupiedRooms.length === 0">
                    <td colspan="5" class="text-center text-muted py-4">
                      Không có phòng phù hợp
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card card-custom">
          <div class="card-body">
            <h6 class="fw-bold mb-3">2. Cập nhật dịch vụ phụ</h6>
            <div v-if="checkoutDetail" class="service-list">
              <div
                v-for="(service, index) in checkoutDetail.dichVu"
                :key="index"
                class="service-item"
              >
                <div>
                  <div class="fw-semibold">{{ service.tenDichVu }}</div>
                  <small class="text-muted">x{{ service.soLuong }} · {{ formatCurrency(service.donGia) }}</small>
                </div>
                <div class="fw-semibold">{{ formatCurrency(service.thanhTien) }}</div>
              </div>
              <div class="mt-3">
                <div class="fw-semibold mb-2">Thêm dịch vụ phát sinh</div>
                <div v-for="(item, idx) in extraServices" :key="idx" class="extra-service-row">
                  <select v-model="item.maDichVu" class="form-select">
                    <option :value="null">Chọn dịch vụ</option>
                    <option
                      v-for="service in serviceCatalog"
                      :key="service.maDichVu"
                      :value="service.maDichVu"
                    >
                      {{ service.tenDichVu }} ({{ formatCurrency(service.gia) }})
                    </option>
                  </select>
                  <input v-model.number="item.soLuong" type="number" min="1" class="form-control qty-input" />
                  <button class="btn btn-outline-danger" @click="removeExtraService(idx)">Xóa</button>
                </div>
                <button class="btn btn-outline-primary mt-2" @click="addExtraService">
                  <i class="bx bx-plus"></i> Thêm dịch vụ
                </button>
              </div>
            </div>
            <div v-else class="empty-state">
              <i class="bx bx-bed"></i>
              <div>
                <div class="fw-semibold">Chọn phòng để xem dịch vụ</div>
                <small class="text-muted">Danh sách dịch vụ sẽ hiển thị ở đây</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="card card-custom mb-4">
          <div class="card-body">
            <h6 class="fw-bold mb-3">3. Tính phụ thu giờ</h6>
            <div class="d-flex align-items-center gap-2">
              <label class="form-label mb-0">Giờ trả thực tế</label>
              <input v-model="actualCheckoutTime" type="time" class="form-control time-input" />
            </div>
            <div class="mt-2 text-muted small">
              Hệ thống tự tính phụ thu nếu trả phòng sau 12:00 (30% giá phòng).
            </div>
            <div class="mt-3 d-flex justify-content-between">
              <span>Phụ thu trễ</span>
              <span class="fw-semibold text-danger">{{ formatCurrency(lateFee) }}</span>
            </div>
            <div class="mt-3">
              <label class="form-label">Phụ thu khác</label>
              <div class="input-group">
                <span class="input-group-text">VND</span>
                <input v-model.number="extraFee" type="number" class="form-control" min="0" />
              </div>
            </div>
          </div>
        </div>

        <div class="card card-custom mb-4">
          <div class="card-body">
            <h6 class="fw-bold mb-3">4. Áp dụng Voucher</h6>
            <div class="input-group mb-2">
              <input v-model="voucherCode" type="text" class="form-control" placeholder="Nhập mã voucher..." />
              <button class="btn btn-outline-primary" @click="applyVoucher">Check</button>
            </div>
            <div v-if="voucherMessage" class="small text-muted">{{ voucherMessage }}</div>
          </div>
        </div>

        <div class="card card-custom">
          <div class="card-body">
            <h6 class="fw-bold mb-3">5. Chốt hóa đơn</h6>
            <div class="summary">
              <div class="d-flex justify-content-between">
                <span>Tiền phòng</span>
                <span class="fw-semibold">{{ formatCurrency(roomTotal) }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>Dịch vụ</span>
                <span class="fw-semibold">{{ formatCurrency(serviceTotal) }}</span>
              </div>
              <div class="d-flex justify-content-between text-danger">
                <span>Phụ thu</span>
                <span class="fw-semibold">{{ formatCurrency(totalSurcharge) }}</span>
              </div>
              <div class="d-flex justify-content-between text-success" v-if="voucherDiscount > 0">
                <span>Voucher</span>
                <span class="fw-semibold">-{{ formatCurrency(voucherDiscount) }}</span>
              </div>
              <div class="d-flex justify-content-between text-primary" v-if="depositAmount > 0">
                <span>Đặt cọc</span>
                <span class="fw-semibold">-{{ formatCurrency(depositAmount) }}</span>
              </div>
              <div class="divider"></div>
              <div class="d-flex justify-content-between total-row">
                <span>Thành tiền</span>
                <span>{{ formatCurrency(grandTotal) }}</span>
              </div>
              <div class="d-flex justify-content-between text-danger" v-if="refundAmount > 0">
                <span>Hoàn tiền lại khách</span>
                <span class="fw-semibold">{{ formatCurrency(refundAmount) }}</span>
              </div>
            </div>

            <div class="mt-3">
              <label class="form-label">Phương thức thanh toán</label>
              <select v-model="paymentMethod" class="form-select">
                <option value="cash">Tiền mặt</option>
                <option value="card">Thẻ</option>
                <option value="vnpay">VNPay (QR)</option>
                <option value="momo">MoMo</option>
              </select>
            </div>

            <button class="btn btn-primary w-100 mt-3" @click="finalizeCheckout">
              Thanh toán & In hóa đơn
            </button>
            <div v-if="checkoutMessage" class="alert alert-success mt-3 mb-0">
              {{ checkoutMessage }}
            </div>
            <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0">
              {{ errorMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const roomSearch = ref('');
const selectedRoomId = ref(null);
const actualCheckoutTime = ref('12:00');
const extraFee = ref(0);
const voucherCode = ref('');
const voucherMessage = ref('');
const paymentMethod = ref('cash');
const checkoutMessage = ref('');
const errorMessage = ref('');

const occupiedRooms = ref([]);
const checkoutDetail = ref(null);
const serviceCatalog = ref([]);
const extraServices = ref([{ maDichVu: null, soLuong: 1 }]);
const voucherDiscount = ref(0);

const API_BASE = import.meta.env.VITE_API_URL;
const API_OCCUPIED = `${API_BASE}/api/admin/CheckInOut/rooms-occupied`;
const API_CHECKOUT_DETAIL = `${API_BASE}/api/admin/CheckInOut/checkout-detail`;
const API_CHECKOUT = `${API_BASE}/api/admin/CheckInOut/check-out`;
const API_SERVICES = `${API_BASE}/api/admin/DichVu`;
const API_PREVIEW_VOUCHER = `${API_BASE}/api/admin/CheckInOut/preview-voucher`;
const API_CHECKOUT_PAYMENT = `${API_BASE}/api/admin/CheckInOut/checkout-payment`;

const fetchOccupiedRooms = async () => {
  try {
    const res = await axios.get(API_OCCUPIED);
    occupiedRooms.value = res.data || [];
  } catch (error) {
    console.error(error);
  }
};

const fetchServices = async () => {
  try {
    const res = await axios.get(API_SERVICES);
    serviceCatalog.value = res.data || [];
  } catch (error) {
    console.error(error);
  }
};

const fetchCheckoutDetail = async (maDatPhong) => {
  if (!maDatPhong) return;
  try {
    const res = await axios.get(`${API_CHECKOUT_DETAIL}/${maDatPhong}`);
    checkoutDetail.value = {
      ...res.data,
      dichVu: res.data?.dichVu || []
    };
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await fetchOccupiedRooms();
  await fetchServices();
});

const filteredOccupiedRooms = computed(() => {
  if (!roomSearch.value) return occupiedRooms.value;
  const q = roomSearch.value.toLowerCase();
  return occupiedRooms.value.filter(
    (r) =>
      (r.soPhong && r.soPhong.toLowerCase().includes(q)) ||
      (r.tenKhach && r.tenKhach.toLowerCase().includes(q)) ||
      (r.sdt && r.sdt.toLowerCase().includes(q))
  );
});

const selectedRoom = computed(() =>
  occupiedRooms.value.find((r) => r.maPhong === selectedRoomId.value)
);

const roomTotal = computed(() => {
  if (!checkoutDetail.value) return 0;
  const checkIn = new Date(checkoutDetail.value.ngayNhan);
  const now = new Date();
  const [hours, minutes] = (actualCheckoutTime.value || '12:00').split(':').map(Number);
  if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
    now.setHours(hours, minutes, 0, 0);
  }
  const diffDays = Math.max(1, Math.ceil((now.setHours(0, 0, 0, 0) - checkIn.setHours(0, 0, 0, 0)) / 86400000));
  return diffDays * (checkoutDetail.value.giaDat || 0);
});

const serviceTotal = computed(() => {
  if (!checkoutDetail.value) return 0;
  const used = checkoutDetail.value.dichVu?.reduce((sum, s) => sum + (s.thanhTien || 0), 0) || 0;
  const extra = extraServices.value.reduce((sum, s) => {
    const service = serviceCatalog.value.find((x) => x.maDichVu === s.maDichVu);
    return sum + (service?.gia || 0) * (s.soLuong || 0);
  }, 0);
  return used + extra;
});

const lateFee = computed(() => {
  const rate = checkoutDetail.value?.giaDat || 0;
  return actualCheckoutTime.value > '12:00' ? Math.round(rate * 0.3) : 0;
});
const totalSurcharge = computed(() => lateFee.value + (extraFee.value || 0));

const grandTotal = computed(() => {
  const total =
    roomTotal.value +
    serviceTotal.value +
    totalSurcharge.value -
    (voucherDiscount.value || 0) -
    (depositAmount.value || 0);
  return total > 0 ? total : 0;
});

const refundAmount = computed(() => {
  const total =
    roomTotal.value +
    serviceTotal.value +
    totalSurcharge.value -
    (voucherDiscount.value || 0) -
    (depositAmount.value || 0);
  return total < 0 ? Math.abs(total) : 0;
});

const selectRoom = (room) => {
  selectedRoomId.value = room.maPhong;
  checkoutDetail.value = null;
  voucherDiscount.value = 0;
  voucherMessage.value = '';
  extraServices.value = [{ maDichVu: null, soLuong: 1 }];
  checkoutMessage.value = '';
  errorMessage.value = '';
  fetchCheckoutDetail(room.maDatPhong);
};

const applyVoucher = () => {
  const code = voucherCode.value.trim().toUpperCase();
  if (!code) {
    voucherDiscount.value = 0;
    voucherMessage.value = 'Vui lòng nhập mã voucher.';
    return;
  }
  if (!checkoutDetail.value) {
    voucherDiscount.value = 0;
    voucherMessage.value = 'Vui lòng chọn phòng.';
    return;
  }
  axios
    .post(API_PREVIEW_VOUCHER, { voucherCode: code, tongTienGoc: roomTotal.value + serviceTotal.value + totalSurcharge.value })
    .then((res) => {
      voucherDiscount.value = res.data?.soTienGiam || 0;
      voucherMessage.value = res.data?.message || 'Đã kiểm tra voucher.';
    })
    .catch((error) => {
      voucherDiscount.value = 0;
      voucherMessage.value = error.response?.data || error.message;
    });
};

const finalizeCheckout = () => {
  if (!selectedRoom.value || !checkoutDetail.value) {
    errorMessage.value = 'Vui lòng chọn phòng cần trả.';
    return;
  }
  errorMessage.value = '';
  const now = new Date();
  const [hours, minutes] = (actualCheckoutTime.value || '12:00').split(':').map(Number);
  if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
    now.setHours(hours, minutes, 0, 0);
  }

  const payload = {
    maDatPhong: selectedRoom.value.maDatPhong,
    maPhong: selectedRoom.value.maPhong,
    extraFee: extraFee.value || 0,
    thoiGianTraThucTe: now.toISOString(),
    voucherCode: voucherCode.value || null,
    hinhThucThanhToan: paymentMethod.value,
    extraServices: extraServices.value
      .filter((s) => s.maDichVu && s.soLuong > 0)
      .map((s) => ({ maDichVu: s.maDichVu, soLuong: s.soLuong }))
  };
  axios
    .post(API_CHECKOUT, payload)
    .then(async (res) => {
      checkoutMessage.value = res.data?.message || 'Check-out thành công.';
      fetchOccupiedRooms();

      if (paymentMethod.value === 'vnpay' || paymentMethod.value === 'momo') {
        const amount = res.data?.tongTienPhaiTra ?? grandTotal.value;
        if (amount <= 0) {
          return;
        }
        try {
          const payRes = await axios.post(API_CHECKOUT_PAYMENT, {
            maDatPhong: selectedRoom.value.maDatPhong,
            soTien: amount,
            hinhThucThanhToan: paymentMethod.value
          });
          const redirectUrl = payRes.data?.redirectUrl;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        } catch (err) {
          errorMessage.value = err.response?.data || err.message;
        }
      }
    })
    .catch((error) => {
      errorMessage.value = error.response?.data || error.message;
    });
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('vi-VN') : '');

const depositAmount = computed(() => checkoutDetail.value?.tienCoc || 0);

const addExtraService = () => {
  extraServices.value.push({ maDichVu: null, soLuong: 1 });
};

const removeExtraService = (index) => {
  extraServices.value.splice(index, 1);
};
</script>

<style scoped>
.page-container {
  color: #566a7f;
  font-family: 'Public Sans', sans-serif;
}

.card-custom {
  border: none;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 2px 6px 0 rgba(67, 89, 113, 0.12);
}

.input-group-custom {
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #d9dee3;
}

.input-group-custom .input-group-text {
  background: #fff;
  border: none;
  color: #b4bdc6;
}

.input-group-custom .form-control {
  border: none;
  box-shadow: none;
}

.summary {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.95rem;
}

.divider {
  border-top: 1px dashed #d9dee3;
  margin: 4px 0;
}

.total-row {
  font-size: 1.1rem;
  font-weight: 700;
  color: #696cff;
}

.service-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.service-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 0.75rem;
  background: #f5f5f9;
}

.extra-service-row {
  display: grid;
  grid-template-columns: 1fr 100px 80px;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.qty-input {
  max-width: 100px;
}

.time-input {
  max-width: 120px;
}

.empty-state {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px dashed #d9dee3;
  border-radius: 0.75rem;
  background: #f5f5f9;
}

.empty-state i {
  font-size: 24px;
  color: #696cff;
}
</style>
