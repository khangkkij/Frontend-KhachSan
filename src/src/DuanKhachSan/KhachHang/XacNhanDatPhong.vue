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
      <div class="row">
        <div class="col-lg-8">
          <div class="card p-4 shadow-sm border-0">
            <h5 class="fw-bold mb-3">Xác nhận đặt phòng</h5>
            <p v-if="loading" class="text-muted">Đang tải hóa đơn...</p>
            <p v-else-if="errorMessage" class="text-danger">{{ errorMessage }}</p>

            <div v-else class="invoice-box">
              <div class="d-flex justify-content-between mb-2">
                <span>Mã đặt phòng</span>
                <span class="fw-bold">#{{ invoice.maDatPhong }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Mã hóa đơn</span>
                <span class="fw-bold">#{{ invoice.maHd }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Ngày tạo</span>
                <span>{{ formatDate(invoice.ngayTao) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Nhận phòng</span>
                <span>{{ formatDate(invoice.ngayNhan) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Trả phòng</span>
                <span>{{ formatDate(invoice.ngayTra) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Số đêm</span>
                <span>{{ invoice.soDem }}</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between mb-2">
                <span>Giá / đêm</span>
                <span>{{ formatCurrency(invoice.giaDat) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Tổng tiền</span>
                <span class="fw-bold text-orange">{{ formatCurrency(invoice.tongTienPhaiTra) }}</span>
              </div>

              <div class="d-flex flex-wrap gap-2 mt-3">
                <button class="btn-export" @click="exportInvoice">
                  Xuất hóa đơn
                </button>
                <button class="btn-confirm" @click="goHome">
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4" v-if="!loading && !errorMessage">
          <div class="card mb-3 shadow-sm">
            <div class="row g-0">
              <div class="col-4">
                <img :src="roomImage" class="img-fluid rounded-start h-100 object-fit-cover" alt="Phòng đã chọn">
              </div>
              <div class="col-8">
                <div class="card-body p-2">
                  <h6 class="fw-bold mb-1">{{ invoice.tenLoai || 'Phòng' }}</h6>
                  <div class="small text-muted">{{ invoice.tenBienThe || '' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const apiBase = import.meta.env.VITE_API_URL;

const loading = ref(true);
const errorMessage = ref('');
const invoice = ref({});

const roomImage = computed(() => {
  if (invoice.value?.anhDaiDien) {
    return `${apiBase}/images/${invoice.value.anhDaiDien}`;
  }
  return '/assets/images/property-01.jpg';
});

const formatCurrency = (value) => {
  if (!value) return '0 ₫';
  return Number(value).toLocaleString('vi-VN') + ' ₫';
};

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleDateString('vi-VN');
};

const exportInvoice = () => {
  window.print();
};

const goHome = () => {
  router.push('/');
};

onMounted(async () => {
  const maDatPhong = Number(route.query.maDatPhong || 0);
  if (!maDatPhong) {
    errorMessage.value = 'Không tìm thấy mã đặt phòng.';
    loading.value = false;
    return;
  }

  try {
    const response = await axios.get(`${apiBase}/api/DatPhong/hoa-don/${maDatPhong}`);
    invoice.value = response.data;
  } catch (error) {
    if (error.response) {
      errorMessage.value = error.response.data || 'Không thể tải hóa đơn';
    } else {
      errorMessage.value = 'Không thể kết nối đến Server';
    }
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.confirm-page {
  background-color: #f8f7f9;
  min-height: 100vh;
}

.step-item { display: flex; align-items: center; color: #999; font-weight: 600; margin: 0 10px; position: relative; font-size: 14px; }
.step-item.active { color: #f35525; }
.step-num { background: #eee; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; margin-right: 8px; font-size: 12px; }
.step-item.active .step-num { background: #f35525; color: white; }
.progress-line { flex-grow: 1; height: 2px; background: #ddd; max-width: 50px; margin: 0 5px; }

.text-orange { color: #f35525 !important; }

.btn-export {
  background-color: #f35525;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
}

.btn-confirm {
  background-color: #fff;
  color: #f35525;
  border: 1px solid #f35525;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
}
</style>
