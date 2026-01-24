<template>
  <div class="staff-manager">
    
    <div class="card mb-4">
      <div class="card-body d-flex justify-content-between align-items-center row gap-3 gap-md-0">
        <div class="col-md-4">
          <h5 class="card-title mb-0">Quản lý Nhân sự</h5>
        </div>
        <div class="col-md-8">
          <div class="d-flex align-items-center justify-content-md-end gap-3">
            <div class="input-group input-group-merge" style="max-width: 300px;">
              <span class="input-group-text"><i class="bx bx-search"></i></span>
              <input type="text" class="form-control" placeholder="Tìm tên nhân viên..." v-model="searchQuery" />
            </div>
            <button class="btn btn-primary" @click="openModal('add')">
              <i class="bx bx-plus me-1"></i> Thêm nhân viên
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
              <th>ID</th>
              <th>Họ và Tên</th>
              <th>Tài khoản / Email</th> <th>Chức vụ</th>
              <th>Ngày vào làm</th>
              <th>Trạng thái</th>
              <th>Tác vụ</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="staff in filteredStaff" :key="staff.maNv">
              
              <td><strong>#{{ staff.maNv }}</strong></td>

              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar avatar-sm me-3">
                    <img v-if="staff.hinhAnh" :src="staff.hinhAnh" alt="Avatar" class="rounded-circle" style="object-fit: cover;" />
                    <span v-else class="avatar-initial rounded-circle bg-label-primary">
                      {{ getInitials(staff.hoTenNv) }}
                    </span>
                  </div>
                  <span class="fw-medium">{{ staff.hoTenNv }}</span>
                </div>
              </td>
              
              <td>
                <div class="d-flex flex-column">
                  <span class="fw-semibold"><i class='bx bx-user'></i> {{ staff.tenDangNhap }}</span>
                  <small class="text-muted" v-if="staff.email">{{ staff.email }}</small>
                  <small class="text-muted fst-italic" v-else>(Chưa có email)</small>
                </div>
              </td>

              <td>
                <span class="badge me-1" :class="getRoleBadge(staff.maChucVu)">
                  {{ getRoleName(staff.maChucVu) }}
                </span>
              </td>

              <td>{{ formatDate(staff.ngayVaoLam) }}</td>

              <td>
                <span class="badge" :class="getStatusClass(staff.trangThai)">
                  {{ staff.trangThai || 'Chưa xác định' }}
                </span>
              </td>

              <td>
                <button class="btn btn-sm btn-icon btn-outline-secondary me-2" @click="openModal('edit', staff)">
                  <i class="bx bx-edit-alt"></i>
                </button>
                <button class="btn btn-sm btn-icon btn-outline-danger" @click="confirmDelete(staff)">
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
            <h5 class="modal-title">{{ isEditMode ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới' }}</h5>
            <button type="button" class="btn-close-custom" @click="closeModal"><i class='bx bx-x'></i></button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="handleSave">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Họ và tên <span class="text-danger">*</span></label>
                  <input v-model="formData.hoTenNv" type="text" class="form-control" required>
                </div>
                
                <div class="col-md-6">
                  <label class="form-label">Tên đăng nhập <span class="text-danger">*</span></label>
                  <input v-model="formData.tenDangNhap" type="text" class="form-control" required :disabled="isEditMode">
                </div>
                <div class="col-md-6">
                   <label class="form-label">Mật khẩu</label>
                   <input v-model="formData.matKhau" type="password" class="form-control" :placeholder="isEditMode ? 'Để trống nếu không đổi' : 'Nhập mật khẩu...'" :required="!isEditMode">
                </div>

                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <input v-model="formData.email" type="email" class="form-control">
                </div>

                <div class="col-md-6">
                  <label class="form-label">Chức vụ</label>
                  <select v-model="formData.maChucVu" class="form-select">
                    <option :value="1">Quản lý</option>
                    <option :value="2">Lễ tân</option>
                    <option :value="3">Buồng phòng</option>
                    <option :value="4">Bảo vệ</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Ngày vào làm</label>
                  <input v-model="formData.ngayVaoLam" type="date" class="form-control">
                </div>

                <div class="col-md-6">
                    <label class="form-label">Trạng thái</label>
                    <select v-model="formData.trangThai" class="form-select">
                        <option value="Đang làm việc">Đang làm việc</option>
                        <option value="Đã nghỉ việc">Đã nghỉ việc</option>
                    </select>
                </div>
                
                <div class="col-12">
                     <label class="form-label">Link Ảnh đại diện</label>
                     <input v-model="formData.hinhAnh" type="text" class="form-control" placeholder="https://...">
                </div>
              </div>

              <div class="mt-4 d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-outline-secondary" @click="closeModal">Đóng</button>
                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Đang xử lý...' : 'Lưu thông tin' }}
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

const API_URL = `${import.meta.env.VITE_API_URL}/api/admin/NhanVien`;

const staffList = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const searchQuery = ref('');
const showModal = ref(false);
const isEditMode = ref(false);

// Form Data chuẩn theo JSON bạn cung cấp
const formData = reactive({
  maNv: 0,
  maChucVu: 2,
  hoTenNv: '',
  gioiTinh: null,   // Thêm cho đủ bộ, dù form chưa dùng
  namSinh: null,    // Thêm cho đủ bộ
  email: '',
  diaChi: null,     // Thêm cho đủ bộ
  hinhAnh: '',
  tenDangNhap: '',
  matKhau: '',
  ngayVaoLam: null,
  trangThai: 'Đang làm việc', // Giá trị mặc định đúng theo JSON
  datphongs: [],    // Mảng rỗng
  maChucVuNavigation: null
});

// --- API ACTIONS ---
const fetchStaff = async () => {
    try {
        isLoading.value = true;
        const response = await axios.get(API_URL);
        staffList.value = response.data;
    } catch (error) {
        console.error("Lỗi:", error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => { fetchStaff(); });

const filteredStaff = computed(() => {
  if (!searchQuery.value) return staffList.value;
  const lowerQuery = searchQuery.value.toLowerCase();
  // Sửa thành hoTenNv (chữ v thường)
  return staffList.value.filter(s => 
    s.hoTenNv && s.hoTenNv.toLowerCase().includes(lowerQuery)
  );
});

const handleSave = async () => {
    isSubmitting.value = true;
    try {
        // Chuẩn bị dữ liệu để gửi đi
        // Clone object để tránh lỗi tham chiếu
        const payload = { ...formData }; 

        if (isEditMode.value) {
            // PUT: Update
            await axios.put(`${API_URL}/${payload.maNv}`, payload);
            alert("Cập nhật thành công!");
        } else {
            // POST: Create
            // Xóa maNv để DB tự tăng (nếu cấu hình Identity)
            delete payload.maNv; 
            await axios.post(API_URL, payload);
            alert("Thêm mới thành công!");
        }
        await fetchStaff();
        closeModal();
    } catch (error) {
        console.error("Lỗi lưu:", error);
        alert("Có lỗi xảy ra!");
    } finally {
        isSubmitting.value = false;
    }
};

const confirmDelete = async (staff) => {
    if(confirm(`Xóa nhân viên ${staff.hoTenNv}?`)) {
        try {
            await axios.delete(`${API_URL}/${staff.maNv}`);
            fetchStaff();
        } catch (error) {
             alert("Lỗi khi xóa!");
        }
    }
};

// --- HELPER FUNCTIONS ---
const openModal = (mode, staff = null) => {
  isEditMode.value = mode === 'edit';
  if (isEditMode.value && staff) {
    Object.assign(formData, staff);
    // Xử lý ngày tháng hiển thị lên input date
    if(staff.ngayVaoLam) formData.ngayVaoLam = staff.ngayVaoLam.split('T')[0];
  } else {
    // Reset form
    Object.keys(formData).forEach(key => {
        if(key === 'maChucVu') formData[key] = 2;
        else if(key === 'trangThai') formData[key] = 'Đang làm việc';
        else if(key === 'datphongs') formData[key] = [];
        else formData[key] = null; // Reset về null hoặc rỗng
    });
    formData.maNv = 0;
    formData.hoTenNv = ''; // Đảm bảo chuỗi rỗng để không lỗi v-model
    formData.tenDangNhap = '';
  }
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; };

// Helper hiển thị chữ cái đầu (Sửa hoTenNv)
const getInitials = (name) => {
    if(!name) return '';
    const parts = name.split(' ');
    return parts.length > 1 ? parts[parts.length - 1][0].toUpperCase() : name[0].toUpperCase();
};

const getRoleName = (id) => {
    const roles = { 1: 'Quản lý', 2: 'Lễ tân', 3: 'Buồng phòng', 4: 'Bảo vệ' };
    return roles[id] || 'Nhân viên';
};

const getRoleBadge = (id) => {
    const map = { 1: 'bg-label-primary', 2: 'bg-label-info', 3: 'bg-label-warning', 4: 'bg-label-secondary' };
    return map[id] || 'bg-label-secondary';
};

// Helper class cho trạng thái tiếng Việt
const getStatusClass = (status) => {
    if (status === 'Đang làm việc') return 'bg-label-success';
    if (status === 'Đã nghỉ việc') return 'bg-label-secondary';
    return 'bg-label-warning';
};

const formatDate = (dateString) => {
    if(!dateString) return '---';
    return new Date(dateString).toLocaleDateString('vi-VN');
}
</script>

<style scoped>
/* Giữ nguyên CSS cũ */
.modal-backdrop-custom { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1050; animation: fadeIn 0.2s; }
.modal-dialog-custom { background: #fff; width: 100%; max-width: 650px; border-radius: 0.5rem; box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15); animation: slideIn 0.2s; }
@keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal-header { padding: 1rem 1.5rem; border-bottom: 1px solid #d9dee3; display: flex; justify-content: space-between; align-items: center; }
.modal-body { padding: 1.5rem; }
.btn-close-custom { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #a1acb8; }
.avatar-initial { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.9rem; }
</style>