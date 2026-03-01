<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <div class="card mb-4 border-0 shadow-sm">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label class="form-label fw-bold small">KHOẢNG THỜI GIAN</label>
            <div class="input-group">
              <input type="date" v-model="filter.fromDate" class="form-control" />
              <span class="input-group-text">→</span>
              <input type="date" v-model="filter.toDate" class="form-control" />
            </div>
          </div>
          <div class="col-md-3">
            <label class="form-label fw-bold small">TRẠNG THÁI ĐƠN</label>
            <select v-model="filter.status" class="form-select border-primary-subtle">
              <option value="all">Tất cả trạng thái</option>
              <option value="ChoNhanPhong">Chờ nhận phòng</option>
              <option value="DaThanhToan">Hoàn thành</option> <option value="DangO">Đang ở</option>
              <option value="Huy">Đã hủy</option>
            </select>
          </div>
          <div class="col-md-5">
            <label class="form-label fw-bold small">TÌM MÃ ĐƠN/HD</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bx bx-search"></i></span>
              <input type="text" v-model="searchQuery" class="form-control" placeholder="BK19 hoặc HD5" />
              <button class="btn btn-primary px-3" @click="fetchData">TÌM</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-4 mb-3">
        <div class="card bg-primary text-white border-0 shadow-sm">
          <div class="card-body d-flex justify-content-between">
            <div><p class="mb-1 opacity-75">Doanh Thu Thực Tế</p><h3 class="fw-bold mb-0">{{ formatCurrency(stats.summary.totalRevenue) }}</h3></div>
            <i class="bx bx-wallet fs-1 opacity-25"></i>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card bg-info text-white border-0 shadow-sm">
          <div class="card-body d-flex justify-content-between">
            <div><p class="mb-1 opacity-75">Số Lượng Đơn</p><h3 class="fw-bold mb-0">{{ stats.summary.totalOrders }} đơn</h3></div>
            <i class="bx bx-shopping-bag fs-1 opacity-25"></i>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card bg-success text-white border-0 shadow-sm text-center">
          <div class="card-body"><p class="mb-1 opacity-75">Tăng Trưởng Hệ Thống</p><h3 class="fw-bold mb-0">+15.8%</h3></div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-lg-8">
        <div class="card h-100 border-0 shadow-sm">
          <h5 class="card-header fw-bold border-bottom">Doanh Thu Theo Tháng</h5>
          <div class="card-body">
            <apexchart v-if="renderChart" type="bar" height="350" :options="revOptions" :series="revSeries"></apexchart>
            <div v-else class="text-center py-5 text-muted">Đang tải biểu đồ...</div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card h-100 border-0 shadow-sm">
          <h5 class="card-header fw-bold border-bottom">Thị Phần Loại Phòng</h5>
          <div class="card-body d-flex flex-column align-items-center justify-content-center">
            <apexchart v-if="renderChart" type="donut" width="100%" :options="donutOptions" :series="donutSeries"></apexchart>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="table-responsive text-nowrap">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Mã Đơn / HD</th>
              <th>Khách Hàng</th>
              <th>Ngày Đặt</th>
              <th>Số Tiền</th>
              <th class="text-center">Trạng Thái</th>
              <th class="text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in stats.recentOrders" :key="order.maDatPhong">
              <td><span class="fw-bold">#BK{{ order.maDatPhong }}</span><div v-if="order.maHd" class="small text-muted">Mã HD: {{ order.maHd }}</div></td>
              <td>{{ order.tenKhach }}</td>
              <td>{{ new Date(order.ngayDat).toLocaleDateString('vi-VN') }}</td>
              <td class="text-primary fw-bold">{{ formatCurrency(order.tongTien) }}</td>
              <td class="text-center">
                <span :class="getStatusBadge(order.trangThai)">{{ getStatusText(order.trangThai) }}</span>
              </td>
              <td class="text-center">
                <button class="btn btn-sm btn-icon btn-outline-primary" @click="viewDetail(order.maDatPhong)"><i class="bx bx-show-alt"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content animate__animated animate__fadeInDown">
        <div class="modal-header border-bottom pb-3">
          <h5 class="fw-bold mb-0">Chi Tiết #BK{{ selectedOrder.maDatPhong }}</h5>
          <button class="btn-close" @click="showModal = false"></button>
        </div>
        <div class="modal-body py-4" v-if="selectedOrder.maDatPhong">
          <div class="row g-4">
            <div class="col-md-6 border-end">
              <h6 class="fw-bold text-primary mb-3">Khách Hàng</h6>
              <p class="mb-1"><strong>Họ tên:</strong> {{ selectedOrder.hoVaTen }}</p>
              <p class="mb-0"><strong>SĐT:</strong> {{ selectedOrder.sdt }}</p>
            </div>
            <div class="col-md-6">
              <h6 class="fw-bold text-success mb-3">Thông Tin Phòng</h6>
              <p class="mb-1"><strong>Loại:</strong> {{ selectedOrder.tenLoai }}</p>
              <p class="mb-0"><strong>Số đêm:</strong> {{ selectedOrder.soDem }}</p>
            </div>
            <div class="col-12 bg-light p-3 rounded mt-3 text-center">
              <div class="row">
                <div class="col-4"><small class="d-block">Gốc</small><strong>{{ formatCurrency(selectedOrder.tongTienGoc) }}</strong></div>
                <div class="col-4 text-danger"><small class="d-block">Giảm</small><strong>-{{ formatCurrency(selectedOrder.soTienGiam) }}</strong></div>
                <div class="col-4 text-primary"><small class="d-block">Tổng thu</small><strong class="fs-5">{{ formatCurrency(selectedOrder.tongTienPhaiTra) }}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import axios from 'axios';
import VueApexCharts from "vue3-apexcharts";

const apexchart = VueApexCharts;
const API = import.meta.env.VITE_API_URL;

const searchQuery = ref('');
const renderChart = ref(false);
const showModal = ref(false);
const selectedOrder = ref({});
const filter = ref({ fromDate: '2026-01-01', toDate: new Date().toISOString().substr(0, 10), status: 'all' });
const stats = ref({ summary: { totalRevenue: 0, totalOrders: 0 }, revenueChart: [], roomTypeStats: [], recentOrders: [] });

// WATCH: Tự động tải lại dữ liệu khi thay đổi bất kỳ bộ lọc nào
watch([filter, searchQuery], () => fetchData(), { deep: true });

const formatCurrency = (v) => Number(v || 0).toLocaleString('vi-VN') + ' ₫';

// --- MAPPING TRẠNG THÁI CHUẨN SQL ---
const getStatusBadge = (s) => {
    const status = (s || '').toLowerCase().trim();
    if (status.includes('huy')) return 'badge bg-label-danger';
    if (status.includes('dathanhtoan') || status.includes('traphong')) return 'badge bg-label-success';
    if (status.includes('chonhanphong')) return 'badge bg-label-warning';
    if (status.includes('dango')) return 'badge bg-label-primary';
    return 'badge bg-label-secondary';
};

const getStatusText = (s) => {
    const status = (s || '').toLowerCase().trim();
    if (status.includes('huy')) return 'Đã hủy';
    // Đổi hiển thị sang Hoàn thành
    if (status.includes('dathanhtoan') || status.includes('traphong')) return 'Hoàn thành';
    if (status.includes('chonhanphong')) return 'Chờ nhận phòng';
    if (status.includes('dango')) return 'Đang ở';
    return 'Đang xử lý';
};

const viewDetail = async (id) => {
  try {
    // SỬA TẠI ĐÂY: Gọi API ThongKe thay vì DatPhong để lấy đúng cấu trúc dữ liệu cho Modal
    const res = await axios.get(`${API}/api/ThongKe/order-detail/${id}`, { withCredentials: true });
    
    // Gán dữ liệu trả về vào selectedOrder
    selectedOrder.value = res.data; 
    
    // Mở Modal
    showModal.value = true;
  } catch (e) { 
    console.error(e);
    alert("Không thể tải chi tiết đơn hàng này."); 
  }
};

const fetchData = async () => {
  renderChart.value = false; // Tạm tắt để ép re-render biểu đồ
  try {
    const res = await axios.get(`${API}/api/ThongKe/dashboard`, { params: { ...filter.value, searchCode: searchQuery.value } });
    stats.value = res.data;
    await nextTick(); // Chờ Vue cập nhật DOM rồi mới vẽ biểu đồ
    if (stats.value.revenueChart.length > 0) renderChart.value = true;
  } catch (e) { console.error(e); }
};

// Cấu hình Biểu đồ
const revSeries = computed(() => [{ name: 'Doanh thu', data: stats.value.revenueChart.map(x => x.total) }]);
const revOptions = computed(() => ({ chart: { type: 'bar', toolbar: { show: false } }, xaxis: { categories: stats.value.revenueChart.map(x => x.label) }, colors: ['#696cff'], plotOptions: { bar: { borderRadius: 5, columnWidth: '40%' } } }));
const donutSeries = computed(() => stats.value.roomTypeStats.map(x => x.count));
const donutOptions = computed(() => ({ labels: stats.value.roomTypeStats.map(x => x.label), colors: ['#696cff', '#03c3ec', '#71dd37', '#ffab00'] }));

onMounted(fetchData);
</script>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1090; display: flex; align-items: center; justify-content: center; }
.modal-content { background: #fff; width: 90%; max-width: 650px; border-radius: 12px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.badge { padding: 8px 12px; font-weight: 600; font-size: 11px; border-radius: 5px; }
.bg-label-success { background-color: #e8fadf; color: #71dd37; }
.bg-label-danger { background-color: #ffe5e5; color: #ff3e1d; }
.bg-label-warning { background-color: #fff2d6; color: #ffab00; }
.bg-label-primary { background-color: #e7e7ff; color: #696cff; }
.bg-label-secondary { background-color: #ebeef0; color: #8592a3; }
.btn-icon { width: 32px; height: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center; }
</style>