<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const loaiPhongs = ref([])
const keyword = ref('')
const showModal = ref(false)
const isEdit = ref(false)
const editingId = ref(null)
const errors = reactive({ tenLoai: '' })
const form = reactive({ tenLoai: '', moTa: '' })

const loadLoaiPhong = async () => {
  const res = await axios.get(`${API}/api/LoaiPhong`)
  loaiPhongs.value = res.data
}
onMounted(loadLoaiPhong)

const filteredLoaiPhong = computed(() => {
  if (!keyword.value) return loaiPhongs.value
  return loaiPhongs.value.filter(lp => lp.tenLoai.toLowerCase().includes(keyword.value.toLowerCase()))
})

const openAddModal = () => {
  isEdit.value = false; form.tenLoai = ''; form.moTa = ''; showModal.value = true;
}
const openEditModal = (lp) => {
  isEdit.value = true; editingId.value = lp.maLp; form.tenLoai = lp.tenLoai; form.moTa = lp.moTa; showModal.value = true;
}
const closeModal = () => showModal.value = false

const validateForm = () => {
  errors.tenLoai = ''
  if (!form.tenLoai.trim()) { errors.tenLoai = 'Tên loại phòng không được để trống'; return false; }
  return true
}

const saveLoaiPhong = async () => {
  if (!validateForm()) return
  try {
    if (isEdit.value) {
      await axios.put(`${API}/api/LoaiPhong/${editingId.value}`, { tenLoai: form.tenLoai, moTa: form.moTa })
    } else {
      await axios.post(`${API}/api/LoaiPhong`, { tenLoai: form.tenLoai, moTa: form.moTa })
    }
    await loadLoaiPhong(); closeModal();
  } catch (err) { alert("Có lỗi xảy ra"); }
}

const deleteLoaiPhong = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa?')) return
  await axios.delete(`${API}/api/LoaiPhong/${id}`)
  await loadLoaiPhong()
}
</script>

<template>
  <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
    <div class="card-header bg-white border-bottom py-3 px-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h5 class="mb-0 fw-bold">Danh sách Loại Phòng</h5>
        </div>
        <div class="col-md-8 d-flex justify-content-end gap-3">
          <div class="search-container">
            <i class="bi bi-search"></i>
            <input v-model="keyword" type="text" class="form-control form-control-sm ps-5" placeholder="Tìm tên loại phòng...">
          </div>
          <button class="btn btn-primary btn-sm px-3 d-flex align-items-center" @click="openAddModal">
            <i class="bi bi-plus-lg me-2"></i> Thêm loại phòng
          </button>
        </div>
      </div>
    </div>

    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light">
            <tr>
              <th class="ps-4 border-0 text-uppercase small fw-bold text-muted" style="width: 100px;">Mã số</th>
              <th class="border-0 text-uppercase small fw-bold text-muted">Tên loại phòng</th>
              <th class="border-0 text-uppercase small fw-bold text-muted">Mô tả chi tiết</th>
              <th class="border-0 text-uppercase small fw-bold text-muted text-end pe-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lp in filteredLoaiPhong" :key="lp.maLp">
              <td class="ps-4 fw-medium text-muted">#{{ lp.maLp }}</td>
              <td><span class="fw-bold text-dark">{{ lp.tenLoai }}</span></td>
              <td class="text-muted small">{{ lp.moTa || 'Không có mô tả' }}</td>
              <td class="text-end pe-4">
                <button class="btn btn-outline-secondary btn-sm me-2 border-0 btn-action" @click="openEditModal(lp)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm border-0 btn-action" @click="deleteLoaiPhong(lp.maLp)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredLoaiPhong.length === 0" class="p-5 text-center text-muted">
          Không tìm thấy dữ liệu nào phù hợp.
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop fade show"></div>
    <div v-if="showModal" class="modal d-block animate__animated animate__fadeInDown">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header bg-dark text-white border-0">
            <h6 class="modal-title fw-bold">{{ isEdit ? 'Cập nhật' : 'Thêm mới' }}</h6>
            <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="small fw-bold text-muted mb-1">TÊN LOẠI PHÒNG</label>
              <input v-model="form.tenLoai" type="text" class="form-control" :class="{'is-invalid': errors.tenLoai}">
              <div class="invalid-feedback">{{ errors.tenLoai }}</div>
            </div>
            <div class="mb-0">
              <label class="small fw-bold text-muted mb-1">MÔ TẢ</label>
              <textarea v-model="form.moTa" class="form-control" rows="3"></textarea>
            </div>
          </div>
          <div class="modal-footer border-0 p-4 pt-0">
            <button class="btn btn-light px-4 border" @click="closeModal">Đóng</button>
            <button class="btn btn-primary px-4" @click="saveLoaiPhong">Xác nhận</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container { position: relative; width: 300px; }
.search-container i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #adb5bd; }
.btn-action { background: #f8f9fa; border-radius: 8px; width: 34px; height: 34px; padding: 0; }
.btn-action:hover { background: #e9ecef; }
.table th { background: #f8f9fa; padding: 15px 10px; }
.table td { padding: 15px 10px; border-bottom: 1px solid #f1f1f1; }
</style>