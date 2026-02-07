<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

// ===== STATE =====
const loaiPhongs = ref([])
const keyword = ref('')
const showModal = ref(false)
const isEdit = ref(false)
const editingId = ref(null)
const errors = reactive({
  tenLoai: ''
})

const form = reactive({
  tenLoai: '',
  moTa: ''
})

// ===== LOAD DATA =====
const loadLoaiPhong = async () => {
  const res = await axios.get(`${API}/api/LoaiPhong`)
  loaiPhongs.value = res.data
}

onMounted(loadLoaiPhong)

// ===== SEARCH =====
const filteredLoaiPhong = computed(() => {
  if (!keyword.value) return loaiPhongs.value
  return loaiPhongs.value.filter(lp =>
    lp.tenLoai.toLowerCase().includes(keyword.value.toLowerCase())
  )
})

// ===== MODAL =====
const openAddModal = () => {
  isEdit.value = false
  form.tenLoai = ''
  form.moTa = ''
  showModal.value = true
}

const openEditModal = (lp) => {
  isEdit.value = true
  editingId.value = lp.maLp
  form.tenLoai = lp.tenLoai
  form.moTa = lp.moTa
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}
const validateForm = () => {
  errors.tenLoai = ''

  if (!form.tenLoai.trim()) {
    errors.tenLoai = 'Tên loại phòng không được để trống'
    return false
  }

  if (form.tenLoai.length < 3) {
    errors.tenLoai = 'Tên loại phòng phải từ 3 ký tự trở lên'
    return false
  }

  return true
}

// ===== SAVE =====
const saveLoaiPhong = async () => {
  if (!validateForm()) return

  try {
    if (isEdit.value) {
      await axios.put(`${API}/api/LoaiPhong/${editingId.value}`, {
        tenLoai: form.tenLoai,
        moTa: form.moTa
      })
      alert("Sửa thành công!")
    } else {
      await axios.post(`${API}/api/LoaiPhong`, {
        tenLoai: form.tenLoai,
        moTa: form.moTa
      })
      alert("Thêm loại phòng thành công!")
    }
  } catch (err) {
    console.log('ERROR DATA:', err.response?.data)
    alert(JSON.stringify(err.response?.data))
  }
  await loadLoaiPhong()
  closeModal()
}
const deleteLoaiPhong = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa loại phòng này?')) return

  try {
    await axios.delete(`${API}/api/LoaiPhong/${id}`)
    alert('Xóa loại phòng thành công!')
    await loadLoaiPhong()
  } catch (err) {
    const msg =
      err.response?.data ||
      'Xóa thất bại, vui lòng thử lại'

    alert(msg)
  }
}
</script>
<template>
  <div class="admin-container animate__animated animate__fadeIn">
    <div class="glass-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-bold text-gradient mb-1">Hệ thống Loại Phòng</h3>
        <p class="text-muted small mb-0"><i class="bi bi-info-circle me-1"></i>Quản lý cấu trúc phòng lưu trú của khách sạn</p>
      </div>
      <button class="btn btn-main" @click="openAddModal">
        <i class="bi bi-plus-circle-fill me-2"></i>Thêm loại phòng
      </button>
    </div>

    <div class="search-box mb-4">
      <div class="input-group">
        <span class="input-group-text border-0 bg-transparent ps-3"><i class="bi bi-search text-primary"></i></span>
        <input v-model="keyword" type="text" class="form-control border-0 bg-transparent py-2" placeholder="Tìm tên phòng...">
      </div>
    </div>

    <div class="custom-card">
      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th class="border-0 ps-4">ID</th>
              <th class="border-0">Tên loại phòng</th>
              <th class="border-0">Mô tả chi tiết</th>
              <th class="border-0 text-end pe-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lp in filteredLoaiPhong" :key="lp.maLp" class="table-row-item">
              <td class="ps-4"><span class="id-badge">#{{ lp.maLp }}</span></td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar-icon me-3">{{ lp.tenLoai.charAt(0) }}</div>
                  <span class="fw-semibold">{{ lp.tenLoai }}</span>
                </div>
              </td>
              <td class="text-muted small">{{ lp.moTa || 'Chưa có mô tả...' }}</td>
              <td class="text-end pe-4">
                <div class="action-btns">
                  <button class="btn btn-edit me-2" @click="openEditModal(lp)"><i class="bi bi-pencil-fill"></i></button>
                  <button class="btn btn-delete" @click="deleteLoaiPhong(lp.maLp)"><i class="bi bi-trash3-fill"></i></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredLoaiPhong.length === 0" class="empty-state">
          <i class="bi bi-folder2-open display-4 opacity-25"></i>
          <p class="mt-2">Không tìm thấy dữ liệu phù hợp</p>
        </div>
      </div>
    </div>

    <Transition name="zoom">
      <div v-if="showModal" class="custom-modal-overlay" @click.self="closeModal">
        <div class="custom-modal-content">
          <div class="modal-header-gradient">
            <h5 class="mb-0 text-white fw-bold">
              {{ isEdit ? 'Cập nhật Loại Phòng' : 'Thêm Loại Phòng Mới' }}
            </h5>
            <button class="btn-close btn-close-white" @click="closeModal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="form-group-custom mb-3">
              <label><i class="bi bi-tag-fill me-2"></i>Tên loại phòng</label>
              <input v-model="form.tenLoai" type="text" class="form-control custom-input" :class="{'is-invalid': errors.tenLoai}" placeholder="Ví dụ: Deluxe Suite">
              <div class="invalid-feedback">{{ errors.tenLoai }}</div>
            </div>
            <div class="form-group-custom">
              <label><i class="bi bi-chat-left-text-fill me-2"></i>Mô tả</label>
              <textarea v-model="form.moTa" class="form-control custom-input" rows="4" placeholder="Nhập mô tả chi tiết..."></textarea>
            </div>
          </div>
          <div class="modal-footer border-0 p-4 pt-0">
            <button class="btn btn-light-custom me-2" @click="closeModal">Hủy bỏ</button>
            <button class="btn btn-main px-4" @click="saveLoaiPhong">
              {{ isEdit ? 'Lưu thay đổi' : 'Tạo ngay' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
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
/* Base System */
.admin-container {
  font-family: 'Inter', sans-serif;
  color: #2d3748;
  padding: 1rem;
}

.text-gradient {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Glass & Card Design */
.glass-header {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.custom-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

/* Search Box */
.search-box {
  background: white;
  border-radius: 100px;
  padding: 0.25rem 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  max-width: 400px;
}

/* Button & Action Styles */
.btn-main {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 24px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-main:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(79, 70, 229, 0.3);
  color: white;
}

.btn-edit { background: #fffbeb; color: #d97706; border: none; border-radius: 8px; width: 35px; height: 35px; }
.btn-delete { background: #fef2f2; color: #dc2626; border: none; border-radius: 8px; width: 35px; height: 35px; }

/* Table Items */
.table-row-item {
  transition: background 0.2s;
  border-bottom: 1px solid #f8fafc;
}
.table-row-item:hover { background-color: #f8fafc; }
.id-badge { background: #f1f5f9; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 12px; }

/* Utility Card Specifics */
.utility-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f0f0f0;
}
.utility-card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
.card-status { position: absolute; top: 15px; right: 15px; width: 10px; height: 10px; border-radius: 50%; }
.card-status.active { background: #10b981; box-shadow: 0 0 10px #10b981; }
.icon-container { height: 80px; display: flex; align-items: center; justify-content: center; background: #f8fafc; border-radius: 15px; }
.ti-icon-img { max-height: 60px; filter: drop-shadow(0 5px 5px rgba(0,0,0,0.1)); }

/* Modal Custom System */
.custom-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(5px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.custom-modal-content {
  background: white;
  width: 500px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
.modal-header-gradient {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Form Styling */
.form-group-custom label { font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 6px; display: block; }
.custom-input { background: #f1f5f9; border: 1px solid transparent; border-radius: 12px; padding: 12px; transition: all 0.2s; }
.custom-input:focus { background: white; border-color: #4f46e5; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); outline: none; }

/* Transitions */
.zoom-enter-active, .zoom-leave-active { transition: all 0.3s ease; }
.zoom-enter-from { opacity: 0; transform: scale(0.9); }
.zoom-leave-to { opacity: 0; transform: scale(0.9); }
</style>