<template>
  <div class="customer-manager">
    <div class="card mb-4">
      <div class="card-body d-flex justify-content-between align-items-center row gap-3 gap-md-0">
        <div class="col-md-4">
          <h5 class="card-title mb-0">Quản lý Khách hàng</h5>
        </div>
        <div class="col-md-8">
          <div class="d-flex align-items-center justify-content-md-end gap-3">
            <div class="input-group input-group-merge" style="max-width: 320px;">
              <span class="input-group-text"><i class="bx bx-search"></i></span>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm theo tên, email, SĐT..."
                v-model="searchQuery"
              />
            </div>
            <button class="btn btn-primary" @click="openModal('add')">
              <i class="bx bx-plus me-1"></i> Thêm khách hàng
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
              <th>Khách hàng</th>
              <th>Liên hệ</th>
              <th>CCCD</th>
              <th>Giới tính</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Tác vụ</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="customer in filteredCustomers" :key="customer.maKh">
              <td><strong>#{{ customer.maKh }}</strong></td>

              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar avatar-sm me-3">
                    <img
                      v-if="customer.hinhAnh"
                      :src="customer.hinhAnh"
                      alt="Avatar"
                      class="rounded-circle"
                      style="object-fit: cover;"
                    />
                    <span v-else class="avatar-initial rounded-circle bg-label-primary">
                      {{ getInitials(customer.hoVaTen) }}
                    </span>
                  </div>
                  <span class="fw-medium">{{ customer.hoVaTen || '---' }}</span>
                </div>
              </td>

              <td>
                <div class="d-flex flex-column">
                  <span class="fw-semibold"><i class="bx bx-envelope me-1"></i>{{ customer.email || '---' }}</span>
                  <small class="text-muted" v-if="customer.sdt"><i class="bx bx-phone me-1"></i>{{ customer.sdt }}</small>
                  <small class="text-muted fst-italic" v-else>(Chưa có SĐT)</small>
                </div>
              </td>

              <td>{{ customer.cccd || '---' }}</td>

              <td>{{ customer.gioiTinh || '---' }}</td>

              <td>{{ formatDate(customer.ngayTao) }}</td>

              <td>
                <span class="badge status-badge" :class="getStatusClass(customer.trangThai)">
                  {{ getStatusLabel(customer.trangThai) }}
                </span>
              </td>

              <td>
                <button class="btn btn-sm btn-icon btn-outline-secondary me-2" @click="openModal('edit', customer)">
                  <i class="bx bx-edit-alt"></i>
                </button>
                <button class="btn btn-sm btn-icon btn-outline-danger" @click="confirmDelete(customer)">
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
            <h5 class="modal-title">{{ isEditMode ? 'Cập nhật khách hàng' : 'Thêm khách hàng mới' }}</h5>
            <button type="button" class="btn-close-custom" @click="closeModal"><i class="bx bx-x"></i></button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="handleSave">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Họ và tên <span class="text-danger">*</span></label>
                  <input v-model="formData.hoVaTen" type="text" class="form-control" @input="errors.hoVaTen = ''">
                  <small class="text-danger" v-if="errors.hoVaTen">{{ errors.hoVaTen }}</small>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <input v-model="formData.email" type="email" class="form-control" @input="errors.email = ''">
                  <small class="text-danger" v-if="errors.email">{{ errors.email }}</small>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Số điện thoại</label>
                  <input v-model="formData.sdt" type="text" class="form-control" @input="errors.sdt = ''">
                  <small class="text-danger" v-if="errors.sdt">{{ errors.sdt }}</small>
                </div>

                <div class="col-md-6">
                  <label class="form-label">CCCD</label>
                  <input v-model="formData.cccd" type="text" class="form-control" @input="errors.cccd = ''">
                  <small class="text-danger" v-if="errors.cccd">{{ errors.cccd }}</small>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Giới tính</label>
                  <select v-model="formData.gioiTinh" class="form-select" @change="errors.gioiTinh = ''">
                    <option value="">Chọn</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                  <small class="text-danger" v-if="errors.gioiTinh">{{ errors.gioiTinh }}</small>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Mật khẩu</label>
                  <input
                    v-model="formData.matKhau"
                    type="password"
                    class="form-control"
                    :placeholder="isEditMode ? 'Để trống nếu không đổi' : 'Nhập mật khẩu...'"
                    @input="errors.matKhau = ''"
                  >
                  <small class="text-danger" v-if="errors.matKhau">{{ errors.matKhau }}</small>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Ngày tạo</label>
                  <input v-model="formData.ngayTao" type="date" class="form-control" @change="errors.ngayTao = ''">
                  <small class="text-danger" v-if="errors.ngayTao">{{ errors.ngayTao }}</small>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Trạng thái</label>
                  <select v-model="formData.trangThai" class="form-select" @change="errors.trangThai = ''">
                    <option :value="true">Hoạt động</option>
                    <option :value="false">Tạm khóa</option>
                  </select>
                  <small class="text-danger" v-if="errors.trangThai">{{ errors.trangThai }}</small>
                </div>

                <div class="col-12">
                  <label class="form-label">Ảnh đại diện</label>
                  <input type="file" class="form-control" accept="image/*" @change="handleImageChange">
                  <small class="text-muted d-block mt-1">Chọn ảnh từ máy (jpg, png, ...)</small>
                  <small class="text-danger" v-if="errors.hinhAnh">{{ errors.hinhAnh }}</small>
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

const API_URL = `${import.meta.env.VITE_API_URL}/api/admin/KhachHang`;

const customers = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const searchQuery = ref('');
const showModal = ref(false);
const isEditMode = ref(false);

const errors = reactive({
  hoVaTen: '',
  email: '',
  sdt: '',
  cccd: '',
  gioiTinh: '',
  matKhau: '',
  ngayTao: '',
  trangThai: '',
  hinhAnh: ''
});

const formData = reactive({
  maKh: 0,
  hoVaTen: '',
  email: '',
  cccd: '',
  sdt: '',
  gioiTinh: '',
  matKhau: '',
  ngayTao: null,
  hinhAnh: '',
  trangThai: true
});

const fetchCustomers = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(API_URL);
    customers.value = response.data;
  } catch (error) {
    console.error('Lỗi:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => { fetchCustomers(); });

const filteredCustomers = computed(() => {
  if (!searchQuery.value) return customers.value;
  const q = searchQuery.value.toLowerCase();
  return customers.value.filter(c =>
    (c.hoVaTen && c.hoVaTen.toLowerCase().includes(q)) ||
    (c.email && c.email.toLowerCase().includes(q)) ||
    (c.sdt && c.sdt.toLowerCase().includes(q)) ||
    (c.cccd && c.cccd.toLowerCase().includes(q))
  );
});

const handleSave = async () => {
  if (!validateForm()) {
    return;
  }
  isSubmitting.value = true;
  try {
    const payload = { ...formData };
    if (isEditMode.value) {
      if (!payload.matKhau) {
        delete payload.matKhau;
      }
      await axios.put(`${API_URL}/${payload.maKh}`, payload);
      alert('Cập nhật thành công!');
    } else {
      delete payload.maKh;
      await axios.post(API_URL, payload);
      alert('Thêm mới thành công!');
    }
    await fetchCustomers();
    closeModal();
  } catch (error) {
    console.error('Lỗi lưu:', error);
    alert('Có lỗi xảy ra!');
  } finally {
    isSubmitting.value = false;
  }
};

const validateForm = () => {
  let isValid = true;
  errors.hoVaTen = '';
  errors.email = '';
  errors.sdt = '';
  errors.cccd = '';
  errors.gioiTinh = '';
  errors.matKhau = '';
  errors.ngayTao = '';
  errors.trangThai = '';
  errors.hinhAnh = '';

  if (!formData.hoVaTen || !formData.hoVaTen.trim()) {
    errors.hoVaTen = 'Vui lòng nhập họ và tên';
    isValid = false;
  }

  if (!formData.email) {
    errors.email = 'Vui lòng nhập email';
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
      isValid = false;
    }
  }

  if (!formData.sdt) {
    errors.sdt = 'Vui lòng nhập số điện thoại';
    isValid = false;
  } else {
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(formData.sdt)) {
      errors.sdt = 'SĐT phải 9-11 chữ số';
      isValid = false;
    }
  }

  if (!formData.cccd) {
    errors.cccd = 'Vui lòng nhập CCCD';
    isValid = false;
  } else {
    const cccdRegex = /^[0-9]{9,12}$/;
    if (!cccdRegex.test(formData.cccd)) {
      errors.cccd = 'CCCD phải 9-12 chữ số';
      isValid = false;
    }
  }

  if (!formData.gioiTinh) {
    errors.gioiTinh = 'Vui lòng chọn giới tính';
    isValid = false;
  }

  if (!isEditMode.value && (!formData.matKhau || formData.matKhau.length < 6)) {
    errors.matKhau = 'Mật khẩu tối thiểu 6 ký tự';
    isValid = false;
  }

  if (!formData.ngayTao) {
    errors.ngayTao = 'Vui lòng chọn ngày tạo';
    isValid = false;
  }

  if (formData.trangThai !== true && formData.trangThai !== false) {
    errors.trangThai = 'Vui lòng chọn trạng thái';
    isValid = false;
  }

  if (!formData.hinhAnh) {
    errors.hinhAnh = 'Vui lòng chọn ảnh đại diện';
    isValid = false;
  }

  return isValid;
};

const handleImageChange = (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    formData.hinhAnh = reader.result;
    errors.hinhAnh = '';
  };
  reader.readAsDataURL(file);
};

const confirmDelete = async (customer) => {
  if (confirm(`Xóa khách hàng ${customer.hoVaTen || ''}?`)) {
    try {
      await axios.delete(`${API_URL}/${customer.maKh}`);
      fetchCustomers();
    } catch (error) {
      alert('Lỗi khi xóa!');
    }
  }
};

const openModal = (mode, customer = null) => {
  isEditMode.value = mode === 'edit';
  if (isEditMode.value && customer) {
    Object.assign(formData, customer);
    formData.matKhau = '';
    if (customer.ngayTao) formData.ngayTao = customer.ngayTao.split('T')[0];
  } else {
    Object.keys(formData).forEach(key => {
      if (key === 'trangThai') formData[key] = true;
      else formData[key] = '';
    });
    formData.maKh = 0;
    formData.ngayTao = new Date().toISOString().split('T')[0];
  }
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; };

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  return parts.length > 1 ? parts[parts.length - 1][0].toUpperCase() : name[0].toUpperCase();
};

const getStatusLabel = (status) => {
  if (status === true) return 'Hoạt động';
  if (status === false) return 'Tạm khóa';
  return 'Chưa xác định';
};

const getStatusClass = (status) => {
  if (status === true) return 'bg-label-success';
  if (status === false) return 'bg-label-danger';
  return 'bg-label-warning';
};

const formatDate = (dateString) => {
  if (!dateString) return '---';
  return new Date(dateString).toLocaleDateString('vi-VN');
};
</script>

<style scoped>
.modal-backdrop-custom { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1050; animation: fadeIn 0.2s; }
.modal-dialog-custom { background: #fff; width: 100%; max-width: 700px; border-radius: 0.5rem; box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15); animation: slideIn 0.2s; }
@keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal-header { padding: 1rem 1.5rem; border-bottom: 1px solid #d9dee3; display: flex; justify-content: space-between; align-items: center; }
.modal-body { padding: 1.5rem; }
.btn-close-custom { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #a1acb8; }
.avatar-initial { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.9rem; }
.avatar-sm { width: 36px; height: 36px; }
.avatar-sm img { width: 100%; height: 100%; }
.status-badge { font-weight: 600; padding: 6px 10px; }
.badge.bg-label-success { background-color: #e7f7ef !important; color: #1f8b4c !important; }
.badge.bg-label-danger { background-color: #fdeaea !important; color: #d12f2f !important; }
.badge.bg-label-warning { background-color: #fff4e5 !important; color: #b36100 !important; }
</style>
