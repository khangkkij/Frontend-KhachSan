<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL   // https://localhost:7023

const tienIchs = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const currentId = ref(null)
const keyword = ref('')
const baseUrl = API + '/'
const errors = ref({
  tenTienIch: '',
  loaiTienIch: '',
  icon: ''
})

const form = ref({
  tenTienIch: '',
  loaiTienIch: '',
  trangThai: true
})
const loaiTienIchOptions = [
  'Ẩm thực',
  'Kết nối',
  'Giải trí',
  'Thể thao',
  'Thư giãn – chăm sóc sức khỏe',
  'Dịch vụ phòng',
  'Tiện ích cho gia đình & trẻ em',
  'Tiện ích công việc',
  'An ninh – an toàn',
  'Khác'
]

const file = ref(null)
const validateForm = () => {
  let isValid = true

  // reset lỗi
  errors.value = {
    tenTienIch: '',
    loaiTienIch: '',
    icon: ''
  }

  if (!form.value.tenTienIch.trim()) {
    errors.value.tenTienIch = 'Tên tiện ích không được để trống'
    isValid = false
  }

  if (!form.value.loaiTienIch.trim()) {
    errors.value.loaiTienIch = 'Vui lòng nhập loại tiện ích'
    isValid = false
  }

  // khi thêm mới thì bắt buộc có icon
  if (!isEdit.value && !file.value) {
    errors.value.icon = 'Vui lòng chọn icon'
    isValid = false
  }

  return isValid
}

// ====================== LOAD ======================
const loadData = async () => {
  const res = await axios.get(`${API}/api/TienIch`)
  tienIchs.value = res.data
}

// ====================== OPEN MODAL ======================
const openAdd = () => {
  isEdit.value = false
  currentId.value = null
  resetForm()
  showModal.value = true
}

const openEdit = (ti) => {
  isEdit.value = true
  currentId.value = ti.maTi
  form.value = {
    tenTienIch: ti.tenTienIch,
    loaiTienIch: ti.loaiTienIch,
    trangThai: ti.trangThai
  }
  file.value = null
  showModal.value = true
}

const resetForm = () => {
  errors.value = {
  tenTienIch: '',
  loaiTienIch: '',
  icon: ''
}
  form.value = {
    tenTienIch: '',
    loaiTienIch: '',
    trangThai: true
  }
  file.value = null
}

// ====================== FILE ======================
const onFileChange = (e) => {
  file.value = e.target.files[0]
}

// ====================== SAVE ======================
const save = async () => {
  if (!validateForm()) return 
  const fd = new FormData()
  fd.append('TenTienIch', form.value.tenTienIch)
  fd.append('LoaiTienIch', form.value.loaiTienIch)
  fd.append('TrangThai', form.value.trangThai)

  if (file.value) {
    fd.append('Icon', file.value)
  }

  if (isEdit.value) {
    await axios.put(`${API}/api/TienIch/${currentId.value}`, fd)
  } else {
    await axios.post(`${API}/api/TienIch`, fd)
  }

  showModal.value = false
  await loadData()
}
const filteredTienIchs = computed(() => {
  if (!keyword.value) return tienIchs.value

  const kw = keyword.value.toLowerCase()

  return tienIchs.value.filter(ti =>
    ti.tenTienIch.toLowerCase().includes(kw) ||
    ti.loaiTienIch.toLowerCase().includes(kw)
  )
})

// ====================== DELETE ======================
const confirmDelete = async (ti) => {
  if (!confirm(`Xóa tiện ích "${ti.tenTienIch}"?`)) return
  try {
    await axios.delete(`${API}/api/TienIch/${ti.maTi}`)
    await loadData()
  } catch (err) {
    alert(err.response?.data?.message || 'Xóa thất bại')
  }
}

// ====================== INIT ======================
onMounted(loadData)
const showDetail = ref(false)
const detailData = ref(null)

const openDetail = async (ti) => {
  const res = await axios.get(`${API}/api/TienIch/${ti.maTi}/chitiet`)
  detailData.value = res.data
  showDetail.value = true
}
</script>
<template>
  <div class="admin-container animate__animated animate__fadeIn">
    <div class="glass-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-bold text-gradient mb-1">Quản lý Tiện ích</h3>
        <p class="text-muted small mb-0">
          <i class="bi bi-stars me-1 text-warning"></i> Cấu hình các dịch vụ và tiện nghi đi kèm phòng
        </p>
      </div>
      <button class="btn btn-main shadow-sm" @click="openAdd">
        <i class="bi bi-plus-circle-fill me-2"></i>Thêm tiện ích mới
      </button>
    </div>

    <div class="search-box mb-4">
      <div class="input-group">
        <span class="input-group-text border-0 bg-transparent ps-3"><i class="bi bi-search text-primary"></i></span>
        <input v-model="keyword" type="text" class="form-control border-0 bg-transparent py-2" placeholder="Tìm tên tiện ích...">
      </div>
    </div>

    <div class="row g-4">
      <div v-for="ti in filteredTienIchs" :key="ti.maTi" class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
        <div class="utility-card h-100">
          <div class="card-status-dot" :class="ti.trangThai ? 'bg-success' : 'bg-secondary'"></div>
          
          <div class="ti-icon-wrapper">
            <img v-if="ti.icon" :src="baseUrl + ti.icon" class="ti-img" alt="utility-icon" />
            <div v-else class="ti-no-icon">
              <i class="bi bi-box-seam"></i>
            </div>
          </div>

          <div class="ti-content p-3 text-center">
            <h6 class="fw-bold text-dark text-truncate mb-1">{{ ti.tenTienIch }}</h6>
            <div class="small text-muted mb-3">{{ ti.loaiTienIch }}</div>
            
            <div class="badge-pill mb-3" :class="ti.trangThai ? 'pill-success' : 'pill-gray'">
              {{ ti.trangThai ? 'Đang hoạt động' : 'Đang ẩn' }}
            </div>

            <div class="ti-actions d-flex justify-content-center gap-2 border-top pt-3">
              <button class="btn-circle btn-view" v-tooltip="'Xem chi tiết'" @click="openDetail(ti)">
                <i class="bi bi-eye-fill"></i>
              </button>
              <button class="btn-circle btn-edit" v-tooltip="'Chỉnh sửa'" @click="openEdit(ti)">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn-circle btn-delete" v-tooltip="'Xóa'" @click="confirmDelete(ti)">
                <i class="bi bi-trash3-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredTienIchs.length === 0" class="text-center text-muted py-5">
        <i class="bi bi-inbox fs-1 d-block mb-2"></i>
        Không tìm thấy tiện ích phù hợp
      </div>


      <div v-if="tienIchs.length === 0" class="col-12 text-center py-5">
        <div class="empty-box p-5 rounded-4 bg-white shadow-sm border">
          <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" style="width: 100px; opacity: 0.2">
          <p class="text-muted mt-3 fw-medium">Chưa có tiện ích nào trong danh sách</p>
        </div>
      </div>
    </div>

    <Transition name="modal-zoom">
      <div v-if="showModal" class="custom-modal-overlay" @click.self="showModal = false">
        <div class="custom-modal-content">
          <div class="modal-header-gradient">
            <h5 class="mb-0 text-white fw-bold">
              {{ isEdit ? 'Cập nhật tiện ích' : 'Thêm tiện ích mới' }}
            </h5>
            <button class="btn-close btn-close-white" @click="showModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3 custom-form-group">
              <label class="form-label fw-bold">Tên tiện ích <span class="text-danger">*</span></label>
              <input v-model="form.tenTienIch" class="form-control" :class="{'is-invalid': errors.tenTienIch}" placeholder="Ví dụ: Wifi, Hồ bơi...">
              <div class="invalid-feedback">{{ errors.tenTienIch }}</div>
            </div>

            <div class="mb-3 custom-form-group">
              <label class="form-label fw-bold">Loại tiện ích</label>
              <select
                v-model="form.loaiTienIch"
                class="form-select"
                :class="{ 'is-invalid': errors.loaiTienIch }"
              >
                <option value="">-- Chọn loại tiện ích --</option>
                <option
                  v-for="(loai, index) in loaiTienIchOptions"
                  :key="index"
                  :value="loai"
                >
                  {{ loai }}
                </option>
              </select>
              <div class="invalid-feedback">{{ errors.loaiTienIch }}</div>
            </div>

            <div class="row g-3">
              <div class="col-6">
                <label class="form-label fw-bold">Trạng thái</label>
                <select v-model="form.trangThai" class="form-select">
                  <option :value="true">Hoạt động</option>
                  <option :value="false">Ẩn</option>
                </select>
              </div>
              <div class="col-6">
                <label class="form-label fw-bold">Biểu tượng (Icon)</label>
                <input type="file" class="form-control" @change="onFileChange">
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 p-4 pt-0">
            <button class="btn btn-secondary-custom flex-grow-1" @click="showModal = false">Hủy</button>
            <button class="btn btn-main flex-grow-1" @click="save">Lưu lại</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal-zoom">
      <div v-if="showDetail" class="custom-modal-overlay" @click.self="showDetail = false">
        <div class="custom-modal-content detail-modal">
          <div class="modal-header-gradient bg-detail">
            <h5 class="mb-0 text-white fw-bold">Chi tiết tiện ích</h5>
            <button class="btn-close btn-close-white" @click="showDetail = false"></button>
          </div>
          <div class="modal-body p-4">
            <div class="d-flex align-items-center mb-4 p-3 bg-light rounded-3">
              <div class="detail-icon-box me-3">
                <img v-if="detailData.icon" :src="baseUrl + detailData.icon" style="width: 40px">
                <i v-else class="bi bi-box-seam fs-3 text-primary"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0">{{ detailData.tenTienIch }}</h5>
                <span class="text-muted small">Mã: #{{ detailData.maTi }}</span>
              </div>
            </div>

            <label class="fw-bold text-dark mb-2">
              <i class="bi bi-house-check-fill me-2 text-primary"></i>Biến thể phòng đang áp dụng:
            </label>
            
            <div class="variant-list">
              <ul v-if="detailData.dsBienTheLienQuan && detailData.dsBienTheLienQuan.length" class="list-group border-0">
                <li v-for="(bt, i) in detailData.dsBienTheLienQuan" :key="i" class="list-group-item variant-item border-0 mb-2 rounded-3 shadow-sm">
                  <i class="bi bi-check2-circle text-success me-2"></i> {{ bt }}
                </li>
              </ul>
              <div v-else class="alert alert-light border shadow-sm text-center py-4 rounded-4">
                <i class="bi bi-info-circle-fill text-muted d-block fs-3 mb-2"></i>
                <span class="text-muted small">Tiện ích này chưa được gán cho bất kỳ biến thể phòng nào.</span>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 p-4 pt-0">
            <button class="btn btn-main w-100" @click="showDetail = false">Đóng cửa sổ</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Container bao quanh thanh search */
.search-box {
  background: white;
  border-radius: 100px; /* Bo tròn hoàn toàn */
  padding: 0.25rem 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  max-width: 400px;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

/* Hiệu ứng khi người dùng click vào ô search */
.search-box:focus-within {
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.1);
  border-color: #4f46e5;
  transform: translateY(-1px);
}

/* Tinh chỉnh input bên trong */
.search-box .form-control {
  box-shadow: none !important; /* Loại bỏ bóng mặc định của Bootstrap */
  font-size: 0.95rem;
  color: #4a5568;
}

.search-box .form-control::placeholder {
  color: #a0aec0;
  font-size: 0.9rem;
}

/* Tinh chỉnh icon */
.search-box .input-group-text {
  font-size: 1.1rem;
}
/* Đồng bộ CSS với TabLoaiPhong */
.admin-container {
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 1rem;
}

.text-gradient {
  background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass-header {
  background: white;
  padding: 1.5rem;
  border-radius: 1.25rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
}

/* Utility Card Styling */
.utility-card {
  background: white;
  border-radius: 1.25rem;
  border: 1px solid #f0f2f5;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.utility-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
}

.card-status-dot {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid white;
}

.ti-icon-wrapper {
  background: #f8fafc;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ti-img {
  max-height: 70px;
  object-fit: contain;
}

.ti-no-icon {
  font-size: 40px;
  color: #cbd5e1;
}

/* Badge System */
.badge-pill {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.pill-success { background: #ecfdf5; color: #10b981; }
.pill-gray { background: #f1f5f9; color: #64748b; }

/* Buttons Custom */
.btn-main {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 600;
  border: none;
  transition: 0.3s;
}
.btn-main:hover { background: #312e81; transform: translateY(-2px); }

.btn-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: 0.2s;
}
.btn-view { background: #e0f2fe; color: #0284c7; }
.btn-edit { background: #fef3c7; color: #d97706; }
.btn-delete { background: #fee2e2; color: #dc2626; }
.btn-circle:hover { transform: scale(1.1); filter: brightness(0.95); }

/* Modal Custom System */
.custom-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-modal-content {
  background: white;
  width: 450px;
  max-width: 90%;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
}

.modal-header-gradient {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bg-detail { background: linear-gradient(135deg, #0f172a 0%, #334155 100%); }

.variant-item {
  background: #f8fafc;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

/* Form Styles */
.form-control, .form-select {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  padding: 10px 14px;
  border-radius: 10px;
}
.form-control:focus {
  background: white;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

/* Modal Transition */
.modal-zoom-enter-active, .modal-zoom-leave-active {
  transition: all 0.3s ease-out;
}
.modal-zoom-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
.modal-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>