<template>
  <div class="voucher-page" style="margin-top: 100px; padding-bottom: 80px; min-height: 90vh;">
    <div class="voucher-hero mb-5 py-5 text-center">
      <div class="container animate__animated animate__fadeIn">
        <span class="badge rounded-pill luxury-badge px-4 py-2 mb-3 fw-800 text-uppercase ls-2 shadow">Ưu đãi độc quyền</span>
        <h1 class="display-3 fw-900 ls-1 mb-3 hero-title">KHO VOUCHER KHÁCH SẠN LUXURY</h1>
        <p class="hero-subtitle mx-auto fw-600" style="max-width: 750px;">
          Khám phá những đặc quyền nghỉ dưỡng dành riêng cho bạn. Thu thập ngay các mã giảm giá giới hạn để tận hưởng kỳ nghỉ đẳng cấp với chi phí tối ưu nhất.
        </p>
      </div>
    </div>

    <div class="container">
      <div class="content-wrapper">
        <div v-if="loading" class="text-center py-5">
          <div class="luxury-loader mx-auto mb-3"></div>
          <p class="text-muted fw-600">Đang tìm kiếm ưu đãi tốt nhất cho bạn...</p>
        </div>

        <div v-else>
          <div v-if="!isLoggedIn" class="empty-state text-center py-5 shadow-sm rounded-4 bg-white border animate__animated animate__fadeIn">
            <div class="empty-icon mb-4">
              <i class="fa fa-user-lock text-orange fs-1"></i>
            </div>
            <h3 class="fw-800 text-dark">Dành Riêng Cho Thành Viên</h3>
            <p class="text-muted mb-4 mx-auto fw-500" style="max-width: 450px;">
              Vui lòng đăng nhập tài khoản thành viên để có thể xem và thu thập các mã giảm giá đặc biệt từ Luxury Hotel.
            </p>
            <router-link to="/dang-nhap" class="btn btn-luxury-gradient px-5 py-3 rounded-pill fw-800 shadow-lg text-white">
              ĐĂNG NHẬP NGAY
            </router-link>
          </div>

          <div v-else-if="vouchers.length === 0" class="empty-state text-center py-5 shadow-sm rounded-4 bg-white border animate__animated animate__fadeIn">
            <div class="empty-icon mb-4">
              <i class="fa fa-ticket-alt text-muted fs-1"></i>
            </div>
            <h3 class="fw-800 text-dark">Hiện tại chưa có mã mới!</h3>
            <p class="text-muted fw-500">Tất cả mã giảm giá đã được sử dụng hết hoặc đã hết hạn. Hẹn gặp lại bạn vào chương trình ưu đãi lần sau.</p>
          </div>

          <div v-else class="row g-4 animate__animated animate__fadeInUp">
            <div class="col-xl-6 col-lg-12" v-for="v in vouchers" :key="v.maCode || v.MaCode">
              <div class="voucher-card h-100">
                <div class="v-left d-flex flex-column justify-content-center align-items-center">
                  <div class="v-value">
                    <span class="v-num fw-900">{{ v.phanTramGiam || v.PhanTramGiam ? (v.phanTramGiam || v.PhanTramGiam) : formatK(v.soTienGiam || v.SoTienGiam) }}</span>
                    <span class="v-unit fw-800">{{ v.phanTramGiam || v.PhanTramGiam ? '%' : '' }}</span>
                  </div>
                  <div class="v-type text-uppercase fw-800 ls-1">{{ v.phanTramGiam || v.PhanTramGiam ? 'Giảm' : 'OFF' }}</div>
                  <div class="scallop-divider"></div>
                </div>

                <div class="v-right p-4 flex-grow-1 d-flex flex-column justify-content-between">
                  <div class="v-info">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <span class="v-code-badge fw-800">{{ v.maCode || v.MaCode }}</span>
                      <span class="v-status-dot active fw-700">Đang diễn ra</span>
                    </div>
                    <h5 class="fw-800 text-dark v-title mb-2">{{ v.moTa || v.MoTa }}</h5>
                    <div class="v-condition fw-600">
                      <i class="fa fa-info-circle me-1 text-orange"></i> Đơn tối thiểu: {{ formatPrice(v.giaToiThieu || v.GiaToiThieu) }}
                    </div>
                  </div>

                  <div class="v-footer d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                    <div class="v-expiry d-flex align-items-center">
                      <div class="v-icon-clock me-2">
                        <i class="far fa-clock"></i>
                      </div>
                      <div class="small">
                        <div class="text-muted lh-1 mb-1 fw-600">Hạn sử dụng:</div>
                        <div class="fw-800 text-dark">{{ formatDate(v.ngayKetThuc || v.NgayKetThuc) }}</div>
                      </div>
                    </div>
                    <button class="btn btn-collect rounded-pill px-4 py-2 fw-800 shadow-sm" @click="collect(v.maCode || v.MaCode)">
                      LƯU MÃ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pagination-wrapper mt-5" v-if="totalPages > 1">
            <nav>
              <ul class="pagination-luxury justify-content-center">
                <li :class="{ disabled: currentPage === 1 }">
                  <button @click="changePage(currentPage - 1)"><i class="fa fa-chevron-left"></i></button>
                </li>
                <li v-for="p in totalPages" :key="p" :class="{ active: currentPage === p }">
                  <button @click="changePage(p)" class="fw-800">{{ p }}</button>
                </li>
                <li :class="{ disabled: currentPage === totalPages }">
                  <button @click="changePage(currentPage + 1)"><i class="fa fa-chevron-right"></i></button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const vouchers = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = ref(6);
const loading = ref(true);

const API_URL = import.meta.env.VITE_API_URL;

const userInfo = computed(() => JSON.parse(localStorage.getItem('user_info') || 'null'));
const isLoggedIn = computed(() => !!userInfo.value);
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value));

const fetchVouchers = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${API_URL}/api/Voucher/available`, {
      params: { page: currentPage.value, pageSize: pageSize.value },
      withCredentials: true
    });
    vouchers.value = res.data.items;
    totalCount.value = res.data.totalCount;
  } catch (error) {
    if (error.response?.status === 401) vouchers.value = [];
  } finally {
    loading.value = false;
  }
};

const changePage = (p) => {
  if (p < 1 || p > totalPages.value) return;
  currentPage.value = p;
  fetchVouchers();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const collect = async (code) => {
  if (!isLoggedIn.value) {
    alert("Vui lòng đăng nhập để thu thập mã giảm giá!");
    router.push('/dang-nhap');
    return;
  }

  try {
    await axios.post(`${API_URL}/api/Voucher/collect/${code}`, {}, { withCredentials: true });
    alert("Lưu mã thành công! Mã đã có trong kho voucher của bạn.");
    fetchVouchers();
  } catch (err) {
    alert(err.response?.data?.message || "Lỗi hệ thống khi lưu mã");
  }
};

const formatK = (v) => v >= 1000 ? (v / 1000) + 'K' : v;
const formatPrice = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '--/--/----';

onMounted(fetchVouchers);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');

/* Font chữ Montserrat đồng nhất */
.voucher-page {
  background-color: #f8f9fa;
  font-family: 'Montserrat', sans-serif;
  color: #2c3e50;
}

/* Hero Section (Slide) - Chữ nổi bật cực mạnh */
.voucher-hero {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  border-bottom: 5px solid #f35525;
  position: relative;
}

.hero-title {
  color: #ffffff;
  /* Đổ bóng chữ đa lớp để nổi bật trên nền ảnh */
  text-shadow: 2px 2px 0px #f35525, 4px 4px 15px rgba(0,0,0,0.8), 0 0 30px rgba(243, 85, 37, 0.4);
  letter-spacing: 2px;
}

.hero-subtitle {
  color: #f1f1f1;
  text-shadow: 2px 2px 8px rgba(0,0,0,1);
  font-size: 1.25rem;
  opacity: 0.95;
}

.luxury-badge { 
  background: #f35525; 
  color: white; 
  border: 2px solid #ffffff;
}

/* Voucher Card Design */
.voucher-card {
  display: flex;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: 1px solid rgba(0,0,0,0.05);
  position: relative;
}

.voucher-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(243, 85, 37, 0.18);
}

.v-left {
  width: 150px;
  min-width: 150px;
  background: linear-gradient(135deg, #f35525 0%, #ca3c12 100%);
  color: white;
  position: relative;
  border-right: 2px dashed #f8f9fa;
}

.v-num { font-size: 2.8rem; line-height: 1; }
.v-unit { font-size: 1.3rem; margin-left: 2px; }
.v-type { font-size: 0.8rem; opacity: 0.9; margin-top: 5px; }

/* Hiệu ứng đục lỗ cuống vé */
.v-left::before, .v-left::after {
  content: "";
  position: absolute;
  width: 24px;
  height: 24px;
  background: #f8f9fa;
  border-radius: 50%;
  right: -13px;
  z-index: 2;
}
.v-left::before { top: -12px; }
.v-left::after { bottom: -12px; }

.v-right { flex-grow: 1; }

.v-code-badge {
  background: #fff0eb;
  color: #f35525;
  padding: 5px 15px;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 1rem;
  border: 1px dashed #f35525;
}

.v-status-dot { font-size: 0.75rem; display: flex; align-items: center; }
.v-status-dot::before {
  content: ""; width: 10px; height: 10px; border-radius: 50%; background: #4caf50; margin-right: 6px;
  animation: pulse 2s infinite;
}

.v-title { font-size: 1.2rem; color: #1e1e1e; }
.v-condition { font-size: 0.85rem; color: #7f8c8d; }

.v-icon-clock {
  width: 38px; height: 38px; background: #fff4f1;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  color: #f35525;
}

.btn-collect {
  background: #1e1e1e;
  color: white;
  border: none;
  transition: 0.3s;
}
.btn-collect:hover {
  background: #f35525;
  transform: scale(1.05);
}

/* Pagination Luxury Style */
.pagination-luxury { display: flex; list-style: none; padding: 0; }
.pagination-luxury li button {
  width: 48px; height: 48px; border-radius: 50%; border: none;
  background: white; margin: 0 6px; font-weight: 800; color: #2c3e50;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: 0.3s;
}
.pagination-luxury li.active button { background: #f35525; color: white; transform: scale(1.1); }
.pagination-luxury li:not(.active):not(.disabled) button:hover { background: #1e1e1e; color: white; }

/* Helpers & Utils */
.fw-800 { font-weight: 800; }
.fw-900 { font-weight: 900; }
.ls-1 { letter-spacing: 1px; }
.ls-2 { letter-spacing: 2px; }

.luxury-loader {
  width: 60px; height: 60px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #f35525;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }

.btn-luxury-gradient {
  background: linear-gradient(90deg, #f35525 0%, #ff8a65 100%);
  color: white; border: none; transition: 0.4s;
}
.btn-luxury-gradient:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(243, 85, 37, 0.3); }

@media (max-width: 576px) {
  .voucher-card { flex-direction: column; }
  .v-left { width: 100%; min-height: 110px; border-right: none; border-bottom: 2px dashed #eee; }
  .v-left::before, .v-left::after { display: none; }
  .hero-title { font-size: 2rem; }
}
</style>