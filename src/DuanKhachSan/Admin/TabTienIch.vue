<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
const tienIchs = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const currentId = ref(null)
const keyword = ref('')
const form = ref({ tenTienIch: '', loaiTienIch: '', trangThai: true, icon: '' })

const loadData = async () => {
  const res = await axios.get(`${API}/api/TienIch`)
  tienIchs.value = res.data
}
onMounted(loadData)

const filteredTienIchs = computed(() => {
  if (!keyword.value) return tienIchs.value
  const kw = keyword.value.toLowerCase()
  return tienIchs.value.filter(ti => ti.tenTienIch.toLowerCase().includes(kw) || ti.loaiTienIch.toLowerCase().includes(kw))
})

const openAdd = () => { isEdit.value = false; resetForm(); showModal.value = true; }
const openEdit = (ti) => {
  isEdit.value = true; currentId.value = ti.maTi
  form.value = { ...ti }; showModal.value = true;
}
const resetForm = () => { form.value = { tenTienIch: '', loaiTienIch: '', trangThai: true, icon: '' } }

const save = async () => {
  const fd = new FormData()
  fd.append('TenTienIch', form.value.tenTienIch)
  fd.append('LoaiTienIch', form.value.loaiTienIch)
  fd.append('TrangThai', form.value.trangThai)
  fd.append('Icon', form.value.icon)

  if (isEdit.value) await axios.put(`${API}/api/TienIch/${currentId.value}`, fd)
  else await axios.post(`${API}/api/TienIch`, fd)
  showModal.value = false; await loadData();
}

const confirmDelete = async (ti) => {
  if (confirm(`Xóa "${ti.tenTienIch}"?`)) { await axios.delete(`${API}/api/TienIch/${ti.maTi}`); await loadData(); }
}
</script>

<template>
  <div class="card border-0 shadow-sm rounded-3 overflow-hidden">
    <div class="card-header bg-white border-bottom py-3 px-4">
      <div class="row align-items-center">
        <div class="col-md-4"><h5 class="mb-0 fw-bold">Quản lý Tiện ích</h5></div>
        <div class="col-md-8 d-flex justify-content-end gap-3">
          <div class="search-container">
            <i class="bi bi-search"></i>
            <input v-model="keyword" type="text" class="form-control form-control-sm ps-5" placeholder="Tìm tên tiện ích...">
          </div>
          <button class="btn btn-primary btn-sm px-3 d-flex align-items-center" @click="openAdd">
            <i class="bi bi-plus-lg me-2"></i> Thêm tiện ích
          </button>
        </div>
      </div>
    </div>

    <div class="card-body p-0">
      <table class="table table-hover align-middle mb-0">
        <thead class="bg-light">
          <tr>
            <th class="ps-4 border-0 text-uppercase small fw-bold text-muted" style="width: 80px;">Hình</th>
            <th class="border-0 text-uppercase small fw-bold text-muted">Tên tiện ích</th>
            <th class="border-0 text-uppercase small fw-bold text-muted">Danh mục</th>
            <th class="border-0 text-uppercase small fw-bold text-muted text-center">Trạng thái</th>
            <th class="border-0 text-uppercase small fw-bold text-muted text-end pe-4">Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ti in filteredTienIchs" :key="ti.maTi">
            <td class="ps-4">
              <div class="icon-preview-sm bg-light rounded border d-flex align-items-center justify-content-center">
                <i :class="['bi', ti.icon ? 'bi-' + ti.icon : 'bi-box']"></i>
              </div>
            </td>
            <td>
              <div class="fw-bold text-dark">{{ ti.tenTienIch }}</div>
              <div class="text-muted extra-small">ID: #{{ ti.maTi }}</div>
            </td>
            <td><span class="badge bg-light text-dark border fw-normal px-2 py-1">{{ ti.loaiTienIch }}</span></td>
            <td class="text-center">
              <span v-if="ti.trangThai" class="dot-status bg-success"></span>
              <span v-else class="dot-status bg-secondary"></span>
              <span class="small ms-2">{{ ti.trangThai ? 'Hoạt động' : 'Đang ẩn' }}</span>
            </td>
            <td class="text-end pe-4">
              <button class="btn btn-outline-secondary btn-sm border-0 btn-action me-2" @click="openEdit(ti)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-danger btn-sm border-0 btn-action" @click="confirmDelete(ti)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="showModal" class="modal-backdrop fade show"></div>
    <div v-if="showModal" class="modal d-block">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header bg-dark text-white">
            <h6 class="modal-title fw-bold">Cấu hình tiện ích</h6>
            <button type="button" class="btn-close btn-close-white" @click="showModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="small fw-bold text-muted mb-1">TÊN TIỆN ÍCH</label>
              <input v-model="form.tenTienIch" type="text" class="form-control">
            </div>
            <div class="row">
               <div class="col-6 mb-3">
                  <label class="small fw-bold text-muted mb-1">LOẠI</label>
                  <select v-model="form.loaiTienIch" class="form-select">
                     <option value="Ẩm thực">Ẩm thực</option>
                     <option value="Giải trí">Giải trí</option>
                     <option value="Khác">Khác</option>
                  </select>
               </div>
               <div class="col-6 mb-3">
                  <label class="small fw-bold text-muted mb-1">ICON (BI-NAME)</label>
                  <input v-model="form.icon" type="text" class="form-control" placeholder="wifi, star...">
               </div>
            </div>
          </div>
          <div class="modal-footer border-0 p-4 pt-0">
            <button class="btn btn-light border px-4" @click="showModal = false">Hủy</button>
            <button class="btn btn-primary px-4" @click="save">Lưu dữ liệu</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container { position: relative; width: 300px; }
.search-container i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #adb5bd; }
.icon-preview-sm { width: 40px; height: 40px; font-size: 20px; color: #0d6efd; }
.btn-action { background: #f8f9fa; border-radius: 8px; width: 34px; height: 34px; padding: 0; }
.dot-status { display: inline-block; width: 8px; height: 8px; border-radius: 50%; }
.extra-small { font-size: 11px; }
.table th { background: #f8f9fa; padding: 15px 10px; }
.table td { padding: 12px 10px; border-bottom: 1px solid #f1f1f1; }
</style>