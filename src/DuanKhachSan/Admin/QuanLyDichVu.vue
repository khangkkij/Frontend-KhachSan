<template>
  <div class="service-manager">
    
    <div class="card mb-4">
      <div class="card-body d-flex justify-content-between align-items-center row gap-3 gap-md-0">
        <div class="col-md-4">
          <h5 class="card-title mb-0">Quản lý Dịch vụ & Menu</h5>
        </div>
        <div class="col-md-8">
          <div class="d-flex align-items-center justify-content-md-end gap-3">
            <div class="input-group input-group-merge" style="max-width: 300px;">
              <span class="input-group-text"><i class="bx bx-search"></i></span>
              <input type="text" class="form-control" placeholder="Tìm tên dịch vụ..." v-model="searchQuery" />
            </div>
            <button class="btn btn-primary" @click="openModal('add')">
              <i class="bx bx-plus me-1"></i> Thêm dịch vụ
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="table-responsive text-nowrap">
        
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
        </div>

        <table v-else class="table table-hover">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên Dịch vụ</th>
              <th>Danh mục</th>
              <th>Đơn giá</th>
              <th>Trạng thái</th>
              <th>Tác vụ</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="item in filteredServices" :key="item.maDichVu">
              
              <td>
                <div class="avatar avatar-lg">
                    <img v-if="item.hinhAnh" :src="item.hinhAnh" alt="Service" class="rounded" style="object-fit: cover;" />
                    <span v-else class="avatar-initial rounded bg-label-secondary">
                        <i class='bx bx-image-alt'></i>
                    </span>
                </div>
              </td>

              <td>
                <strong>{{ item.tenDichVu }}</strong>
                <div class="small text-muted text-truncate" style="max-width: 200px;">
                    {{ item.moTa || 'Không có mô tả' }}
                </div>
              </td>

              <td>
                <span class="badge bg-label-info">{{ item.loaiDichVu }}</span>
              </td>

              <td>
                <span class="fw-bold text-primary">{{ formatCurrency(item.donGia) }}</span>
              </td>

              <td>
                <span class="badge" :class="item.trangThai ? 'bg-label-success' : 'bg-label-secondary'">
                  {{ item.trangThai ? 'Đang kinh doanh' : 'Ngưng phục vụ' }}
                </span>
              </td>

              <td>
                <button class="btn btn-sm btn-icon btn-outline-secondary me-2" @click="openModal('edit', item)">
                  <i class="bx bx-edit-alt"></i>
                </button>
                <button class="btn btn-sm btn-icon btn-outline-danger" @click="confirmDelete(item)">
                  <i class="bx bx-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop-custom">
      <div class="modal-dialog-custom">
        <div class="modal-content">
          <div class="modal-header bg-body-tertiary">
            <h5 class="modal-title">{{ isEditMode ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới' }}</h5>
            <button type="button" class="btn-close-custom" @click="closeModal"><i class='bx bx-x'></i></button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="handleSave">
              <div class="row g-3">
                
                <div class="col-12">
                  <label class="form-label">Tên dịch vụ <span class="text-danger">*</span></label>
                  <input v-model="formData.tenDichVu" type="text" class="form-control" required placeholder="Ví dụ: Mì bò trứng, Giặt ủi...">
                </div>

                <div class="col-md-6">
                  <label class="form-label">Danh mục</label>
                  <select v-model="formData.loaiDichVu" class="form-select">
                    <option value="Đồ ăn">Đồ ăn</option>
                    <option value="Nước uống">Nước uống</option>
                    <option value="Tiện ích">Tiện ích (Giặt, Thuê xe...)</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                
                <div class="col-md-6">
                  <label class="form-label">Đơn giá (VNĐ) <span class="text-danger">*</span></label>
                  <input v-model.number="formData.donGia" type="number" class="form-control" required min="0">
                </div>

                <div class="col-12">
                     <label class="form-label">Link Hình ảnh</label>
                     <div class="input-group">
                        <span class="input-group-text"><i class='bx bx-link'></i></span>
                        <input v-model="formData.hinhAnh" type="text" class="form-control" placeholder="https://...">
                     </div>
                     <div v-if="formData.hinhAnh" class="mt-2 text-center">
                        <img :src="formData.hinhAnh" alt="Preview" class="rounded border p-1" style="height: 80px; object-fit: cover;">
                     </div>
                </div>

                <div class="col-12">
                    <label class="form-label">Mô tả chi tiết</label>
                    <textarea v-model="formData.moTa" class="form-control" rows="3"></textarea>
                </div>

                <div class="col-12">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="statusSwitch" v-model="formData.trangThai">
                        <label class="form-check-label" for="statusSwitch">
                            {{ formData.trangThai ? 'Đang kinh doanh (Hiện trên menu)' : 'Tạm ngưng phục vụ' }}
                        </label>
                    </div>
                </div>

              </div>

              <div class="mt-4 d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-outline-secondary" @click="closeModal">Đóng</button>
                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Đang lưu...' : 'Lưu thông tin' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import axios from 'axios';

// --- CẤU HÌNH API (Lưu ý thay Port cho đúng) ---
const API_URL = `${import.meta.env.VITE_API_URL}/api/admin/DichVu`;

const serviceList = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const searchQuery = ref('');
const showModal = ref(false);
const isEditMode = ref(false);

// Form Data Model
const formData = reactive({
  maDichVu: 0,
  tenDichVu: '',
  loaiDichVu: 'Đồ ăn',
  donGia: 0,
  hinhAnh: '',
  moTa: '',
  trangThai: true // true: Đang bán, false: Ngưng
});

// --- API FETCH ---
const fetchServices = async () => {
    try {
        isLoading.value = true;
        const response = await axios.get(API_URL);
        serviceList.value = response.data;
    } catch (error) {
        console.error("Lỗi tải dịch vụ:", error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => { fetchServices(); });

// --- FILTER ---
const filteredServices = computed(() => {
  if (!searchQuery.value) return serviceList.value;
  const lowerQuery = searchQuery.value.toLowerCase();
  return serviceList.value.filter(s => 
    s.tenDichVu.toLowerCase().includes(lowerQuery)
  );
});

// --- CRUD ACTIONS ---
const handleSave = async () => {
    isSubmitting.value = true;
    try {
        const payload = { ...formData };
        
        if (isEditMode.value) {
            // PUT
            await axios.put(`${API_URL}/${payload.maDichVu}`, payload);
            alert("Cập nhật thành công!");
        } else {
            // POST
            delete payload.maDichVu; // Để Server tự sinh ID
            await axios.post(API_URL, payload);
            alert("Thêm mới thành công!");
        }
        await fetchServices();
        closeModal();
    } catch (error) {
        console.error("Lỗi lưu:", error);
        alert("Có lỗi xảy ra: " + (error.response?.data?.message || error.message));
    } finally {
        isSubmitting.value = false;
    }
};

const confirmDelete = async (item) => {
    if(confirm(`Bạn có chắc muốn xóa dịch vụ "${item.tenDichVu}"?`)) {
        try {
            await axios.delete(`${API_URL}/${item.maDichVu}`);
            alert("Đã xóa!");
            fetchServices();
        } catch (error) {
             alert("Lỗi khi xóa (Có thể dịch vụ đã có trong hóa đơn cũ)!");
        }
    }
};

// --- HELPER UI ---
const openModal = (mode, item = null) => {
  isEditMode.value = mode === 'edit';
  if (isEditMode.value && item) {
    Object.assign(formData, item);
  } else {
    // Reset form
    formData.maDichVu = 0;
    formData.tenDichVu = '';
    formData.loaiDichVu = 'Đồ ăn';
    formData.donGia = 0;
    formData.hinhAnh = '';
    formData.moTa = '';
    formData.trangThai = true;
  }
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; };

const formatCurrency = (value) => {
    if (!value) return '0 đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
</script>

<style scoped>
/* CSS Modal Custom */
.modal-backdrop-custom { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1050; animation: fadeIn 0.2s; }
.modal-dialog-custom { background: #fff; width: 100%; max-width: 600px; border-radius: 0.5rem; box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15); animation: slideIn 0.2s; }
@keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal-header { padding: 1rem 1.5rem; border-bottom: 1px solid #d9dee3; display: flex; justify-content: space-between; align-items: center; }
.modal-body { padding: 1.5rem; }
.btn-close-custom { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #a1acb8; }
.avatar-lg { width: 3.5rem; height: 3.5rem; }
</style>