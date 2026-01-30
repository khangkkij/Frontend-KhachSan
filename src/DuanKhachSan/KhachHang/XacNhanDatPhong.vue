<template>
  <div class="confirm-page">
    <div class="bg-white border-bottom py-3 mb-4">
      <div class="container d-flex justify-content-center align-items-center">
        <div class="step-item"><span class="step-num">1</span> Thông tin khách</div>
        <div class="progress-line"></div>
        <div class="step-item"><span class="step-num">2</span> Thanh toán</div>
        <div class="progress-line"></div>
        <div class="step-item active"><span class="step-num">3</span> Xác nhận</div>
      </div>
    </div>

    <div class="container mb-5">
      <div class="card border-0 shadow-sm p-4 mb-4">
        <div class="d-flex align-items-center gap-3">
          <div class="success-icon"><i class="fa fa-check"></i></div>
          <div>
            <h5 class="fw-bold mb-1">Đặt phòng thành công</h5>
            <div class="text-muted">
              Hóa đơn đã được tạo. Mã hóa đơn: <strong>{{ invoiceCode }}</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm p-4 mb-3">
            <h6 class="fw-bold mb-3">Thông tin khách hàng</h6>
            <div class="row g-3">
              <div class="col-md-6">
                <div class="text-muted small">Họ tên</div>
                <div class="fw-bold">{{ customer.name || '---' }}</div>
              </div>
              <div class="col-md-6">
                <div class="text-muted small">Số điện thoại</div>
                <div class="fw-bold">{{ customer.phone || '---' }}</div>
              </div>
              <div class="col-md-6">
                <div class="text-muted small">Email</div>
                <div class="fw-bold">{{ customer.email || '---' }}</div>
              </div>
              <div class="col-md-6">
                <div class="text-muted small">Ngày tạo hóa đơn</div>
                <div class="fw-bold">{{ createdAtDisplay }}</div>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm p-4">
            <h6 class="fw-bold mb-3">Chi tiết thanh toán</h6>
            <div class="row g-3">
              <div class="col-md-6">
                <div class="text-muted small">Hình thức</div>
                <div class="fw-bold">{{ paymentLabel }}</div>
              </div>
              <div class="col-md-6">
                <div class="text-muted small">Phương thức</div>
                <div class="fw-bold">{{ paymentMethodLabel }}</div>
              </div>
              <div class="col-md-6">
                <div class="text-muted small">Tổng tiền</div>
                <div class="fw-bold">{{ formatCurrency(payment.totalAmount) }}</div>
              </div>
              <div class="col-md-6">
                <div class="text-muted small">Đã thanh toán</div>
                <div class="fw-bold text-orange">{{ formatCurrency(payment.paidAmount) }}</div>
              </div>
              <div class="col-md-6" v-if="payment.option === 'deposit'">
                <div class="text-muted small">Còn lại</div>
                <div class="fw-bold">{{ formatCurrency(payment.remainingAmount) }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm p-3 mb-3">
            <div class="row g-0">
              <div class="col-4">
                <img :src="room.image || fallbackImage" class="img-fluid rounded-start h-100 object-fit-cover" alt="Room">
              </div>
              <div class="col-8">
                <div class="card-body p-2">
                  <h6 class="fw-bold mb-1">{{ room.name || '---' }}</h6>
                  <div class="small text-muted" v-if="room.variantName">
                    {{ room.variantName }}
                  </div>
                  <div class="small mt-1" v-if="room.pricePerNight">
                    <span class="text-muted">Giá / đêm:</span>
                    <span class="fw-bold text-orange">{{ formatCurrency(room.pricePerNight) }}</span>
                  </div>
                  <div class="small mt-1" v-if="room.quantity">
                    <span class="text-muted">Số lượng:</span>
                    <span class="fw-bold">{{ room.quantity }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm p-3">
            <div class="d-flex justify-content-between align-items-center">
              <span class="fw-bold">Tổng cộng</span>
              <span class="fw-bold text-orange">{{ formatCurrency(payment.totalAmount) }}</span>
            </div>
            <div class="text-muted small mt-1" v-if="room.nights">
              Dựa trên {{ room.nights }} đêm · {{ room.quantity || 1 }} phòng
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex gap-2 mt-4">
        <button class="btn btn-success px-4" @click="handleConfirm">
          <i class="fa fa-check me-2"></i> Xác nhận
        </button>
        <button class="btn btn-primary px-4" @click="handlePrint">
          <i class="fa fa-print me-2"></i> In hóa đơn
        </button>
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
const fallbackImage = '/assets/images/property-01.jpg';
const invoiceCode = ref('---');

const room = ref({
  name: '',
  variantName: '',
  image: '',
  pricePerNight: null,
  nights: null,
  quantity: 1
});

const customer = ref({
  name: '',
  email: '',
  phone: ''
});

const payment = ref({
  option: 'deposit',
  method: 'vnpay',
  totalAmount: 0,
  depositAmount: 0,
  remainingAmount: 0,
  paidAmount: 0,
  createdAt: null
});

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString('vi-VN') + ' ₫';
};

const paymentLabel = computed(() => {
  return payment.value.option === 'deposit' ? 'Đặt cọc 30%' : 'Thanh toán 100%';
});

const paymentMethodLabel = computed(() => {
  if (payment.value.method === 'momo') return 'MoMo';
  if (payment.value.method === 'visa') return 'Visa / MasterCard';
  return 'VNPay';
});

const createdAtDisplay = computed(() => {
  if (!payment.value.createdAt) return '---';
  return new Date(payment.value.createdAt).toLocaleString('vi-VN');
});

const handlePrint = () => {
  window.print();
};

const handleConfirm = () => {
  alert('Xác nhận thành công!');
  router.push('/');
};

const fetchInvoice = async (maDatPhong) => {
  try {
    const res = await axios.get(`${API}/api/DatPhong/hoa-don/${maDatPhong}`, {
      withCredentials: true
    });
    const data = res?.data || {};
    if (data.maHd != null) {
      invoiceCode.value = `HD${data.maHd}`;
    }
    if (data.ngayTao) {
      payment.value.createdAt = data.ngayTao;
    }
    if (!payment.value.totalAmount && data.tongTienPhaiTra != null) {
      payment.value.totalAmount = Number(data.tongTienPhaiTra);
    }
    if (!room.value.nights && data.soDem != null) {
      room.value.nights = data.soDem;
    }
  } catch (error) {
    console.warn('Không tải được hóa đơn:', error);
  }
};

onMounted(() => {
  const rawRoom = localStorage.getItem('booking_room');
  const rawCustomer = localStorage.getItem('booking_customer');
  const rawPayment = localStorage.getItem('booking_payment');
  const maDatPhong = localStorage.getItem('maDatPhong');

  if (rawRoom) {
    try {
      Object.assign(room.value, JSON.parse(rawRoom));
    } catch (error) {
      console.warn('Không đọc được dữ liệu phòng:', error);
    }
  }
  if (rawCustomer) {
    try {
      Object.assign(customer.value, JSON.parse(rawCustomer));
    } catch (error) {
      console.warn('Không đọc được dữ liệu khách:', error);
    }
  }
  if (rawPayment) {
    try {
      Object.assign(payment.value, JSON.parse(rawPayment));
    } catch (error) {
      console.warn('Không đọc được dữ liệu thanh toán:', error);
    }
  }
  if (maDatPhong) {
    fetchInvoice(maDatPhong);
  }
});
</script>

<style scoped>
.text-orange { color: #f35525 !important; }
.confirm-page { background-color: #f8f7f9; min-height: 100vh; }

.step-item { display: flex; align-items: center; color: #999; font-weight: 600; margin: 0 10px; position: relative; font-size: 14px; }
.step-item.active { color: #f35525; }
.step-num { background: #eee; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 8px; font-size: 12px; }
.step-item.active .step-num { background: #f35525; color: white; }
.progress-line { flex-grow: 1; height: 2px; background: #ddd; max-width: 50px; margin: 0 5px; }

.success-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #e7f7ef;
  color: #1f8b4c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
</style>
