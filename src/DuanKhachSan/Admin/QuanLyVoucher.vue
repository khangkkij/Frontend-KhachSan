<template>
  <div class="admin-voucher-container p-4">
    <div class="card header-card shadow-sm border-0 p-4 mb-4 animate__animated animate__fadeInDown">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h4 class="fw-800 text-orange mb-1 text-uppercase ls-1">
            <i class="fa fa-ticket-alt me-2"></i>Hệ Thống Quản Lý Voucher
          </h4>
          <p class="text-muted small mb-0 fw-600">Thiết lập và theo dõi các chương trình ưu đãi của Luxury Hotel</p>
        </div>
        <button class="btn btn-luxury-gradient rounded-pill px-4 py-2 shadow fw-800" @click="openModal()">
          <i class="fa fa-plus-circle me-2"></i>Tạo Voucher Mới
        </button>
      </div>
    </div>

    <div class="card filter-card shadow-sm border-0 p-4 mb-4 animate__animated animate__fadeIn">
      <div class="row g-3">
        <div class="col-md-4">
          <label class="small fw-700 text-muted mb-2 text-uppercase ls-1">Tìm kiếm thông minh</label>
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0"><i class="fa fa-search text-muted"></i></span>
            <input type="text" v-model="filters.search" class="form-control border-start-0 shadow-none fw-600" placeholder="Mã code hoặc mô tả...">
          </div>
        </div>
        <div class="col-md-3">
          <label class="small fw-700 text-muted mb-2 text-uppercase ls-1">Trạng thái kho</label>
          <select v-model="filters.status" class="form-select shadow-none fw-600">
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Tạm dừng</option>
            <option value="expired">Đã hết hạn</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="small fw-700 text-muted mb-2 text-uppercase ls-1">Phân loại ưu đãi</label>
          <select v-model="filters.type" class="form-select shadow-none fw-600">
            <option value="all">Tất cả loại giảm</option>
            <option value="percent">Giảm theo %</option>
            <option value="cash">Giảm tiền mặt</option>
          </select>
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <button class="btn btn-outline-secondary w-100 rounded-pill fw-700 border-2" @click="resetFilters">
            Làm mới
          </button>
        </div>
      </div>
    </div>

    <div class="card table-card shadow-lg border-0 overflow-hidden animate__animated animate__fadeInUp">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0 custom-table">
          <thead class="table-luxury">
            <tr>
              <th class="ps-4">Mã Code</th>
              <th>Loại Giảm</th>
              <th>Giá Trị Ưu Đãi</th>
              <th>Sử Dụng / Tổng</th>
              <th>Thời Hạn Hiệu Lực</th>
              <th>Trạng Thái</th>
              <th class="text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedVouchers.length === 0">
              <td colspan="7" class="text-center py-5 text-muted fw-600">
                <i class="fa fa-folder-open d-block mb-2 fs-2 opacity-50"></i>
                Không tìm thấy dữ liệu voucher phù hợp.
              </td>
            </tr>
            <tr v-for="v in paginatedVouchers" :key="v.maCode || v.MaCode">
              <td class="ps-4">
                <span class="badge bg-soft-orange text-orange border-0 fw-800 px-3 py-2 text-uppercase">
                  {{ v.maCode || v.MaCode }}
                </span>
              </td>
              <td class="fw-600 text-muted">{{ (v.phanTramGiam || v.PhanTramGiam) > 0 ? 'Phần trăm' : 'Tiền mặt' }}</td>
              <td>
                <span class="text-success fw-900 fs-5">
                  {{ (v.phanTramGiam || v.PhanTramGiam) > 0 ? (v.phanTramGiam || v.PhanTramGiam) + '%' : formatCurrency(v.soTienGiam || v.SoTienGiam) }}
                </span>
              </td>
              <td>
                <div class="d-flex flex-column" style="width: 120px;">
                  <div class="d-flex justify-content-between mb-1">
                    <small class="fw-800 text-dark">{{ v.soLuongDaDung || v.SoLuongDaDung || 0 }}</small>
                    <small class="text-muted fw-600">/ {{ v.soLuong || v.SoLuong }}</small>
                  </div>
                  <div class="progress" style="height: 6px; border-radius: 10px;">
                    <div class="progress-bar luxury-progress" :style="{ width: calculatePercent(v) + '%' }"></div>
                  </div>
                </div>
              </td>
              <td>
                <div class="small fw-600">
                  <div class="text-muted"><i class="far fa-calendar-check me-1"></i>Từ: {{ formatDate(v.ngayBatDau || v.NgayBatDau) }}</div>
                  <div :class="isExpired(v) ? 'text-danger fw-800' : 'text-dark'"><i class="far fa-calendar-times me-1"></i>Đến: {{ formatDate(v.ngayKetThuc || v.NgayKetThuc) }}</div>
                </div>
              </td>
              <td>
                <span :class="getStatusClass(v)" class="fw-700">
                  {{ getStatusText(v) }}
                </span>
              </td>
              <td class="text-center">
                <div class="btn-group">
                  <button class="btn btn-icon btn-view" @click="openModal(v, 'view')" title="Xem chi tiết">
                    <i class="fa fa-eye"></i>
                  </button>
                  <button class="btn btn-icon btn-edit" @click="openModal(v, 'edit')" title="Chỉnh sửa">
                    <i class="fa fa-edit"></i>
                  </button>
                  <button class="btn btn-icon btn-delete" @click="deleteVoucher(v.maCode || v.MaCode)" title="Xóa">
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-4 border-top d-flex justify-content-between align-items-center bg-white">
        <div class="fw-700 text-muted small">Hiển thị {{ paginatedVouchers.length }} / {{ filteredVouchers.length }} kết quả</div>
        <nav v-if="totalPages > 1">
          <ul class="pagination-luxury d-flex list-unstyled mb-0 gap-2">
            <li :class="{ disabled: currentPage === 1 }">
              <button class="page-btn" @click.prevent="currentPage--"><i class="fa fa-chevron-left"></i></button>
            </li>
            <li v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
              <button class="page-btn" @click.prevent="currentPage = page">{{ page }}</button>
            </li>
            <li :class="{ disabled: currentPage === totalPages }">
              <button class="page-btn" @click.prevent="currentPage++"><i class="fa fa-chevron-right"></i></button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-card p-4 shadow-2xl animate__animated animate__zoomIn">
        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <h5 class="fw-900 mb-0 text-uppercase text-dark ls-1">
            {{ modalMode === 'view' ? 'Chi tiết Voucher' : (modalMode === 'edit' ? 'Cập nhật Voucher' : 'Thiết lập Voucher mới') }}
          </h5>
          <button class="btn-close shadow-none" @click="showModal = false"></button>
        </div>
        
        <form @submit.prevent="saveVoucher" class="row g-4">
          <div class="col-md-6">
            <label class="form-label small fw-800 text-muted">MÃ CODE (DUY NHẤT)</label>
            <input type="text" v-model="form.maCode" class="form-control shadow-none modal-input" 
              :class="{'is-invalid': errors.maCode}" :disabled="modalMode !== 'add'" 
              placeholder="VD: VIP2026" style="text-transform: uppercase;">
            <div class="invalid-feedback fw-700">{{ errors.maCode }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-800 text-muted">SỐ LƯỢNG PHÁT HÀNH</label>
            <input type="number" v-model.number="form.soLuong" class="form-control shadow-none modal-input" 
              :class="{'is-invalid': errors.soLuong}" :max="MAX_QTY" :disabled="modalMode === 'view'">
            <div class="invalid-feedback fw-700">{{ errors.soLuong }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-800 text-success">GIẢM THEO % (0-100)</label>
            <input type="number" v-model.number="form.phanTramGiam" @input="clearCash"
              class="form-control shadow-none modal-input text-success fw-800" 
              min="0" max="100" :disabled="modalMode === 'view'">
            <div class="invalid-feedback fw-700">{{ errors.phanTramGiam }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-800 text-primary">GIẢM TIỀN MẶT (VNĐ)</label>
            <input type="number" v-model.number="form.soTienGiam" @input="clearPercent"
              class="form-control shadow-none modal-input text-primary fw-800" :disabled="modalMode === 'view'">
            <div class="invalid-feedback fw-700">{{ errors.soTienGiam }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-800 text-muted">GIÁ ĐƠN TỐI THIỂU</label>
            <input type="number" v-model.number="form.giaToiThieu" class="form-control shadow-none modal-input" :disabled="modalMode === 'view'">
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-800 text-muted">TRẠNG THÁI HOẠT ĐỘNG</label>
            <select v-model="form.trangThai" class="form-select shadow-none modal-input fw-700" :disabled="modalMode === 'view'">
              <option :value="true">Đang hoạt động</option>
              <option :value="false">Tạm dừng</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-800 text-muted">NGÀY BẮT ĐẦU</label>
            <input type="date" v-model="form.ngayBatDau" class="form-control shadow-none modal-input fw-700" 
              :class="{'is-invalid': errors.ngayBatDau}" :disabled="modalMode === 'view'">
            <div class="invalid-feedback fw-700">{{ errors.ngayBatDau }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-800 text-muted">NGÀY KẾT THÚC</label>
            <input type="date" v-model="form.ngayKetThuc" class="form-control shadow-none modal-input fw-700" 
              :class="{'is-invalid': errors.ngayKetThuc}" :disabled="modalMode === 'view'">
            <div class="invalid-feedback fw-700">{{ errors.ngayKetThuc }}</div>
          </div>
          <div class="col-12">
            <label class="form-label small fw-800 text-muted">MÔ TẢ CHI TIẾT & ĐIỀU KIỆN</label>
            <textarea v-model="form.moTa" class="form-control shadow-none modal-input" rows="3" 
              placeholder="Nhập mô tả hoặc điều kiện áp dụng..." :disabled="modalMode === 'view'"></textarea>
          </div>
          
          <div class="col-12 text-center text-danger small fw-900 py-2" v-if="errors.discount">
            <i class="fa fa-exclamation-triangle me-1"></i> {{ errors.discount }}
          </div>
          
          <div class="col-12 mt-4 d-flex justify-content-end gap-2 border-top pt-3">
            <button type="button" class="btn btn-outline-secondary rounded-pill px-4 fw-800 border-2" @click="showModal = false">
              {{ modalMode === 'view' ? 'Đóng cửa sổ' : 'Hủy bỏ' }}
            </button>
            <button v-if="modalMode !== 'view'" type="submit" class="btn btn-luxury-gradient rounded-pill px-5 shadow fw-800">
              {{ modalMode === 'edit' ? 'Cập nhật ngay' : 'Xác nhận lưu' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const MAX_QTY = 10000;
const MAX_MONEY = 10000000;

// Data State
const vouchers = ref([]);
const showModal = ref(false);
const modalMode = ref('add'); // 'add', 'edit', 'view'
const form = ref({});
const errors = ref({});

// Filters & Pagination State
const filters = ref({ search: '', status: 'all', type: 'all' });
const currentPage = ref(1);
const itemsPerPage = ref(10);

// CRUD Logic
const loadVouchers = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/admin/Voucher`, { withCredentials: true });
    vouchers.value = res.data;
  } catch (e) { console.error("Lỗi khi tải dữ liệu:", e); }
};

const clearCash = () => { if (form.value.phanTramGiam > 0) form.value.soTienGiam = 0; };
const clearPercent = () => { if (form.value.soTienGiam > 0) form.value.phanTramGiam = 0; };

const validate = () => {
  errors.value = {};
  let ok = true;
  const noAccentRegex = /^[A-Za-z0-9]+$/;

  if (!form.value.maCode) { errors.value.maCode = "Mã không được trống"; ok = false; }
  else if (!noAccentRegex.test(form.value.maCode)) { errors.value.maCode = "Mã không chứa dấu/khoảng trắng"; ok = false; }
  
  if (form.value.soLuong <= 0 || form.value.soLuong > MAX_QTY) { errors.value.soLuong = `Số lượng 1 - ${MAX_QTY}`; ok = false; }
  if (form.value.phanTramGiam > 100) { errors.value.phanTramGiam = "Tối đa 100%"; ok = false; }
  if (form.value.soTienGiam > MAX_MONEY) { errors.value.soTienGiam = "Quá giới hạn 10 triệu"; ok = false; }
  if (!form.value.phanTramGiam && !form.value.soTienGiam) { errors.value.discount = "Nhập Phần trăm hoặc Tiền mặt"; ok = false; }
  
  if (!form.value.ngayBatDau || !form.value.ngayKetThuc) { errors.value.ngayKetThuc = "Chọn thời hạn"; ok = false; }
  else if (new Date(form.value.ngayKetThuc) < new Date(form.value.ngayBatDau)) {
    errors.value.ngayKetThuc = "Ngày kết thúc phải sau ngày bắt đầu"; ok = false;
  }
  return ok;
};

const saveVoucher = async () => {
  if (!validate()) return;
  try {
    const dataToSend = { ...form.value, maCode: form.value.maCode.toUpperCase().trim() };
    const url = modalMode.value === 'edit' ? `${API_URL}/api/admin/Voucher/${dataToSend.maCode}` : `${API_URL}/api/admin/Voucher`;
    const method = modalMode.value === 'edit' ? 'put' : 'post';
    await axios[method](url, dataToSend, { withCredentials: true });
    showModal.value = false;
    loadVouchers();
    alert("Thao tác thành công!");
  } catch (e) { alert(e.response?.data?.message || "Lỗi hệ thống"); }
};

const deleteVoucher = async (code) => {
  if (confirm(`Bạn có chắc muốn xóa voucher ${code}?`)) {
    try {
      await axios.delete(`${API_URL}/api/admin/Voucher/${code}`, { withCredentials: true });
      loadVouchers();
    } catch (e) { alert(e.response?.data?.message || "Không thể xóa"); }
  }
};

const openModal = (item = null, mode = 'add') => {
  modalMode.value = item ? mode : 'add';
  errors.value = {};
  if (item) {
    form.value = { 
      ...item, 
      maCode: item.maCode || item.MaCode,
      moTa: item.moTa || item.MoTa,
      phanTramGiam: item.phanTramGiam || item.PhanTramGiam || 0,
      soTienGiam: item.soTienGiam || item.SoTienGiam || 0,
      giaToiThieu: item.giaToiThieu || item.GiaToiThieu || 0,
      soLuong: item.soLuong || item.SoLuong || 0,
      soLuongDaDung: item.soLuongDaDung || item.SoLuongDaDung || 0,
      trangThai: item.trangThai ?? item.TrangThai ?? true,
      ngayBatDau: (item.ngayBatDau || item.NgayBatDau)?.split('T')[0],
      ngayKetThuc: (item.ngayKetThuc || item.NgayKetThuc)?.split('T')[0]
    };
  } else {
    form.value = { maCode: '', phanTramGiam: 0, soTienGiam: 0, giaToiThieu: 0, soLuong: 100, trangThai: true, ngayBatDau: new Date().toISOString().split('T')[0], ngayKetThuc: '' };
  }
  showModal.value = true;
};

// Filtering Logic
const resetFilters = () => { filters.value = { search: '', status: 'all', type: 'all' }; currentPage.value = 1; };

const filteredVouchers = computed(() => {
  return vouchers.value.filter(v => {
    const code = (v.maCode || v.MaCode || '').toLowerCase();
    const desc = (v.moTa || v.MoTa || '').toLowerCase();
    const isTrangThai = v.trangThai ?? v.TrangThai;
    const ngayKT = new Date(v.ngayKetThuc || v.NgayKetThuc);
    const today = new Date(); today.setHours(0,0,0,0);

    const matchSearch = code.includes(filters.value.search.toLowerCase()) || desc.includes(filters.value.search.toLowerCase());
    
    let matchStatus = true;
    if (filters.value.status === 'active') matchStatus = isTrangThai === true && ngayKT >= today;
    else if (filters.value.status === 'inactive') matchStatus = isTrangThai === false;
    else if (filters.value.status === 'expired') matchStatus = ngayKT < today;

    let matchType = true;
    if (filters.value.type === 'percent') matchType = (v.phanTramGiam || v.PhanTramGiam) > 0;
    else if (filters.value.type === 'cash') matchType = (v.soTienGiam || v.SoTienGiam) > 0;

    return matchSearch && matchStatus && matchType;
  });
});

const totalPages = computed(() => Math.ceil(filteredVouchers.value.length / itemsPerPage.value));
const paginatedVouchers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredVouchers.value.slice(start, start + itemsPerPage.value);
});

watch(filters, () => { currentPage.value = 1; }, { deep: true });

// Helpers
const isExpired = (v) => new Date(v.ngayKetThuc || v.NgayKetThuc) < new Date().setHours(0,0,0,0);
const getStatusText = (v) => isExpired(v) ? 'Hết hạn' : (v.trangThai ?? v.TrangThai) ? 'Đang chạy' : 'Tạm dừng';
const getStatusClass = (v) => `badge rounded-pill px-3 ${isExpired(v) ? 'bg-danger' : (v.trangThai ?? v.TrangThai) ? 'bg-success' : 'bg-secondary'}`;
const calculatePercent = (v) => Math.min(100, Math.round(((v.soLuongDaDung || v.SoLuongDaDung || 0) / (v.soLuong || v.SoLuong || 1)) * 100));
const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '---';

onMounted(loadVouchers);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');

.admin-voucher-container {
  font-family: 'Montserrat', sans-serif;
  background-color: #f4f7f6;
  min-height: 100vh;
}

/* Typography & Colors */
.text-orange { color: #f35525 !important; }
.fw-800 { font-weight: 800; }
.fw-900 { font-weight: 900; }
.ls-1 { letter-spacing: 0.5px; }

/* Luxury Components */
.header-card, .filter-card, .table-card {
  border-radius: 16px;
}

.btn-luxury-gradient {
  background: linear-gradient(135deg, #f35525 0%, #ca3c12 100%);
  color: white;
  border: none;
  transition: 0.3s all;
}
.btn-luxury-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(243, 85, 37, 0.4);
}

/* Table Styling */
.table-luxury {
  background: #212529;
  color: white;
}
.table-luxury th {
  padding: 1rem;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.custom-table tbody tr {
  transition: 0.2s;
}
.custom-table tbody tr:hover {
  background-color: #fffaf9 !important;
}

.bg-soft-orange { background-color: #fff0eb; }
.luxury-progress { background: linear-gradient(90deg, #f35525 0%, #ffc107 100%); border-radius: 10px; }

/* Buttons */
.btn-icon {
  width: 35px;
  height: 35px;
  border-radius: 8px;
  border: none;
  margin: 0 3px;
  transition: 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}
.btn-view { color: #0dcaf0; }
.btn-edit { color: #0d6efd; }
.btn-delete { color: #dc3545; }
.btn-icon:hover { transform: scale(1.1); background: #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }

/* Pagination */
.page-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: white;
  font-weight: 800;
  color: #6c757d;
  transition: 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.pagination-luxury li.active .page-btn {
  background: #f35525;
  color: white;
  transform: scale(1.1);
}
.page-btn:hover:not(.active) { background: #1a1a1a; color: white; }

/* Modal */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1050;
  backdrop-filter: blur(5px);
}
.modal-card { background: white; width: 100%; max-width: 700px; border-radius: 20px; max-height: 95vh; overflow-y: auto; }
.modal-input {
  border-radius: 12px;
  padding: 12px;
  border: 2px solid #f1f1f1;
}
.modal-input:focus {
  border-color: #f35525;
  box-shadow: 0 0 0 0.25rem rgba(243, 85, 37, 0.1);
}
</style>