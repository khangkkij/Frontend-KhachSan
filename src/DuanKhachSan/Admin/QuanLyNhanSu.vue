<template>
  <div class="staff-manager-container">

    <div class="card card-custom mb-4">
      <div class="card-body d-flex justify-content-between align-items-center row gap-3 gap-md-0">
        <div class="col-md-4">
          <h5 class="card-title fw-bold text-primary mb-0">
            <i class='bx bx-user-pin me-2'></i>Quản lý Nhân sự
          </h5>
        </div>
        <div class="col-md-8">
          <div class="d-flex align-items-center justify-content-md-end gap-3">

            <div class="input-group input-group-custom flex-grow-1" style="max-width: 300px;">
              <span class="input-group-text"><i class="bx bx-search"></i></span>
              <input type="text" class="form-control" placeholder="Tìm kiếm..." v-model="searchQuery" />
            </div>

            <button class="btn btn-primary btn-add-new shadow-sm" @click="openModal('add')">
              <i class="bx bx-plus me-1"></i> Thêm nhân sự
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card card-custom">
      <div class="table-responsive text-nowrap">

        <div v-if="isLoading" class="loading-state">
          <div class="spinner-border text-primary" role="status"></div>
          <p>Đang tải dữ liệu...</p>
        </div>

        <table v-else class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th class="ps-4">Nhân sự</th>
              <th>Tài khoản</th>
              <th>Chức vụ</th>
              <th>Ngày vào làm</th>
              <th>Trạng thái</th>
              <th class="text-center">Tác vụ</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="staff in filteredStaff" :key="staff.maNv">

              <td class="ps-4">
                <div class="d-flex align-items-center">
                  <div class="avatar-wrapper me-3">
                    <img v-if="staff.hinhAnh" :src="getFullImageUrl(staff.hinhAnh)" @error="handleImageError"
                      alt="Avatar" class="avatar-img" />
                    <img v-else :src="getDefaultImageUrl()" alt="Avatar" class="avatar-img" />
                    <!-- <div v-else class="avatar-initial" :class="getRoleColorClass(staff.maChucVu)">
                      {{ getInitials(staff.hoTenNv) }}
                    </div> -->
                  </div>
                  <div class="d-flex flex-column">
                    <span class="fw-bold text-heading">{{ staff.hoTenNv }}</span>
                    <small class="text-muted">ID: #{{ staff.maNv }}</small>
                  </div>
                </div>
              </td>

              <td>
                <div class="d-flex flex-column">
                  <span class="fw-semibold text-primary"><i class='bx bx-user-circle me-1'></i>{{ staff.tenDangNhap
                  }}</span>
                  <small class="text-muted" v-if="staff.email">{{ staff.email }}</small>
                  <small class="text-muted fst-italic" v-else>(Chưa có email)</small>
                </div>
              </td>

              <td>
                <span class="badge-custom" :class="getRoleColorClass(staff.maChucVu)">
                  {{ getRoleName(staff.maChucVu) }}
                </span>
              </td>

              <td>
                <span class="text-muted"><i class='bx bx-calendar me-1'></i>{{ formatDate(staff.ngayVaoLam) }}</span>
              </td>

              <td>
                <span class="badge-status" :class="getStatusClass(staff.trangThai)">
                  <span class="dot"></span> {{ staff.trangThai }}
                </span>
              </td>

              <td class="text-center">
                <button class="btn-icon btn-edit me-2" @click="openModal('edit', staff)" title="Sửa">
                  <i class="bx bx-edit-alt"></i>
                </button>


                <button v-if="staff.trangThai == `Hoạt động`" class="btn-icon btn-lock me-2" @click="toggleLock(staff)"
                  title="Khóa/Mở khóa">
                  <i class="bx bx-lock-alt"></i>
                </button>
                <button v-else class="btn-icon btn-lock me-2" @click="toggleLock(staff)" title="Khóa/Mở khóa">
                  <i class="bx bx-lock-open-alt"></i>
                </button>

                <button class="btn-icon btn-delete" @click="confirmDelete(staff)" title="Xóa">
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
          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              <i class='bx' :class="isEditMode ? 'bx-edit' : 'bx-user-plus'"></i>
              {{ isEditMode ? 'Cập nhật hồ sơ' : 'Thêm nhân sự mới' }}
            </h5>
            <button type="button" class="btn-close-custom" @click="closeModal"><i class='bx bx-x'></i></button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="handleSave">

              <div class="text-center mb-4">
                <div class="position-relative d-inline-block">
                  <img :src="previewImage || (formData.hinhAnh ? IMG_URL + formData.hinhAnh : getDefaultImageUrl())"
                    @error="handleImageError" class="rounded-circle border shadow-sm object-fit-cover"
                    style="width: 120px; height: 120px;" alt="Avatar" />
                  <label for="fileInput" class="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0"
                    style="width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center;">
                    <i class='bx bx-camera'></i>
                  </label>
                  <input id="fileInput" type="file" class="d-none" accept="image/*" @change="handleFileChange" />
                </div>
              </div>

              <div class="row g-3">

                <div class="col-12">
                  <label class="form-label">Họ và tên <span class="text-danger">*</span></label>
                  <input v-model="formData.hoTenNv" type="text" class="form-control"
                    :class="{ 'is-invalid': errors.hoTenNv }" required placeholder="Nhập họ tên nhân sự">
                  <div v-if="errors.hoTenNv" class="invalid-feedback">{{ errors.hoTenNv }}</div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Tên đăng nhập <span class="text-danger">*</span></label>
                  <input v-model="formData.tenDangNhap" type="text" class="form-control"
                    :class="{ 'is-invalid': errors.tenDangNhap }" required :disabled="isEditMode">
                  <div v-if="errors.tenDangNhap" class="invalid-feedback">{{ errors.tenDangNhap }}</div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Mật khẩu</label>
                  <input v-model="formData.matKhau" type="password" class="form-control"
                    :class="{ 'is-invalid': errors.matKhau }"
                    :placeholder="isEditMode ? 'Để trống nếu không đổi' : 'Nhập mật khẩu'">
                  <div v-if="errors.matKhau" class="invalid-feedback">{{ errors.matKhau }}</div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <input v-model="formData.email" type="email" class="form-control" placeholder="example@mail.com">
                </div>

                <div class="col-md-6">
                  <label class="form-label">Năm sinh</label>
                  <input v-model="formData.namSinh" type="number" class="form-control"
                    :class="{ 'is-invalid': errors.namSinh }" placeholder="VD: 2000">
                  <div v-if="errors.namSinh" class="invalid-feedback">{{ errors.namSinh }}</div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Giới tính</label>
                  <select v-model="formData.gioiTinh" class="form-select" :class="{ 'is-invalid': errors.gioiTinh }">
                    <option disabled :value="null">-- Chọn --</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                  <div v-if="errors.gioiTinh" class="invalid-feedback">{{ errors.gioiTinh }}</div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Chức vụ</label>
                  <select v-model="formData.maChucVu" class="form-select" :class="{ 'is-invalid': errors.maChucVu }">
                    <option :value="null" disabled>-- Chọn chức vụ --</option>
                    <option v-for="role in RoleList" :key="role.maChucVu" :value="role.maChucVu">
                      {{ role.tenChucVu }}
                    </option>
                  </select>
                  <div v-if="errors.maChucVu" class="invalid-feedback">{{ errors.maChucVu }}</div>
                </div>

                <div class="col-md-12">
                  <label class="form-label">Trạng thái</label>
                  <select v-model="formData.trangThai" class="form-select">
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Bị khoá">Bị khoá</option>
                  </select>
                </div>

                <div class="col-12">
                  <label class="form-label">Địa chỉ thường trú</label>
                  <textarea v-model="formData.diaChi" class="form-control" rows="2"
                    placeholder="Số nhà, đường, phường/xã..."></textarea>
                </div>

              </div>

              <div class="mt-4 text-end border-top pt-3">
                <button type="button" class="btn btn-label-secondary me-2" @click="closeModal">Hủy</button>
                <button type="submit" class="btn btn-primary px-4" :disabled="isSubmitting">
                  {{ isSubmitting ? 'Đang lưu...' : 'Lưu lại' }}
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

// --- CONFIG ---
const API_URL = `${import.meta.env.VITE_API_URL}/api/admin`; // Thay port của bạn




// --- STATE ---
const staffList = ref([]);
const RoleList = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const searchQuery = ref('');
const showModal = ref(false);
const isEditMode = ref(false);

const selectedFile = ref(null);
const previewImage = ref(null);


const formData = reactive({
  maNv: 0,
  hoTenNv: '',
  tenDangNhap: '',
  matKhau: '',
  maChucVu: null,
  trangThai: 'Hoạt động',
  hinhAnh: '',
  email: '',
  namSinh: '',
  gioiTinh: 'Nam',
  diaChi: ''
});

// --- API FETCH ---
const fetchStaff = async () => {
  try {
    isLoading.value = true;
    const res = await axios.get(API_URL + '/NhanVien');
    staffList.value = res.data;
    const roleRes = await axios.get(API_URL + '/ChucVu');
    RoleList.value = roleRes.data;
  } catch (e) { console.error(e); }
  finally { isLoading.value = false; }
};
onMounted(fetchStaff);

// --- LOGIC ---
const filteredStaff = computed(() => {
  if (!searchQuery.value) return staffList.value;
  const q = searchQuery.value.toLowerCase();
  return staffList.value.filter(s => s.hoTenNv && s.hoTenNv.toLowerCase().includes(q));
});

const handleSave = async () => {
  if (!validateForm()) {
    console.log("Validation Failed:", errors);
    return;
  }
  isSubmitting.value = true;
  try {
    const formPayload = new FormData();

    formPayload.append('HoTenNv', formData.hoTenNv);
    formPayload.append('TenDangNhap', formData.tenDangNhap);
    formPayload.append('MaChucVu', formData.maChucVu || ''); // Handle null
    formPayload.append('TrangThai', formData.trangThai);
    formPayload.append('Email', formData.email || '');
    formPayload.append('DiaChi', formData.diaChi || '');
    if (formData.gioiTinh) formPayload.append('GioiTinh', formData.gioiTinh);
    if (formData.namSinh) formPayload.append('NamSinh', formData.namSinh);

    // Append Mật khẩu (chỉ nếu có nhập)
    if (formData.matKhau) formPayload.append('MatKhau', formData.matKhau);

    // Append File ảnh
    if (selectedFile.value) {
      formPayload.append('HinhAnh', selectedFile.value);
    }

    // Gửi request (Code cũ giữ nguyên)
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    if (isEditMode.value) {
      await axios.put(`${API_URL}/NhanVien/${formData.maNv}`, formPayload, config);
    } else {
      await axios.post(`${API_URL}/NhanVien`, formPayload, config);
    }

    alert("Thành công!");
    closeModal();
    await fetchStaff(); // Nhớ gọi hàm load lại danh sách

  } catch (e) {
    console.error(e);
    alert("Lỗi: " + (e.response?.data?.message || e.message));
  } finally {
    isSubmitting.value = false;
  }
};

const openModal = (mode, staff) => {
  isEditMode.value = mode === 'edit';

  // Reset file tạm
  selectedFile.value = null;
  previewImage.value = null;
  Object.keys(errors).forEach(key => errors[key] = '');


  if (mode === 'edit' && staff) {
    Object.assign(formData, staff);
    formData.matKhau = '';
  } else {
    // Reset form

    Object.keys(formData).forEach(k => formData[k] = null);
    formData.trangThai = 'Hoạt động';
  }
  showModal.value = true;
};
const closeModal = () => showModal.value = false;

// --- HELPERS UI ---
const getInitials = (name) => name ? name.split(' ').pop()[0].toUpperCase() : '?';
const formatDate = (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '---';
const getRoleName = (id) => {
  const role = RoleList.value.find(r => r.maChucVu === id);
  return role ? role.tenChucVu : 'Không rõ';
};
// Class màu cho Chức vụ & Avatar
const getRoleColorClass = (id) => {
  const map = { 1: 'role-manager', 2: 'role-reception', 3: 'role-housekeeping', 4: 'role-security' };
  return map[id] || 'role-default';
};

// Class màu cho Trạng thái
const getStatusClass = (status) => {
  if (status === 'Hoạt động') return 'status-active';
  return 'status-inactive';
};


// Hàm xử lý đường dẫn ảnh (giữ nguyên logic cũ của bạn hoặc dùng cái này)
const getFullImageUrl = (imgName) => {
  if (!imgName) return '';
  if (imgName.startsWith('http')) return imgName;
  return `${import.meta.env.VITE_API_URL}/images/NhanVien/${imgName}`; // Sửa đường dẫn theo server bạn
};

const getDefaultImageUrl = () => {
  return `${import.meta.env.VITE_API_URL}/images/avtDefault.jpg`;
};

// --- 2. HÀM KHI CHỌN FILE (Gắn vào @change ở trên) ---
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    // Tạo link ảo để xem trước ngay lập tức
    previewImage.value = URL.createObjectURL(file);
  }
};

const confirmDelete = async (staff) => {
  if (confirm(`Bạn có chắc muốn xóa nhân sự: ${staff.hoTenNv} không?`)) {
    try {
      await axios.delete(`${API_URL}/NhanVien/${staff.maNv}`);
      alert("Đã xóa nhân sự thành công!");
    } catch (e) {
      console.error(e);
      alert("Lỗi: " + (e.response?.data?.message || e.message));
    }
    fetchStaff();
  };
};

const toggleLock = async (staff) => {
  try {
    const newStatus = staff.trangThai === 'Hoạt động' ? 'Bị khoá' : 'Hoạt động';
    await axios.put(`${API_URL}/NhanVien/toggle-status/${staff.maNv}`, { trangThai: newStatus });
    alert(`Đã ${newStatus === 'Hoạt động' ? 'mở khóa' : 'khóa'} nhân sự: ${staff.hoTenNv}`);
  } catch (e) {
    console.error(e);
    alert("Lỗi: " + (e.response?.data?.message || e.message));
  }
  fetchStaff();
};

const handleImageError = (event) => {
  // Ngăn vòng lặp vô tận (nếu ảnh mặc định cũng lỗi nốt)
  event.target.onerror = null;

  // Gán lại src thành ảnh mặc định
  event.target.src = getDefaultImageUrl();
};

// --- STATE VALIDATION (MỚI) ---
const errors = reactive({
  hoTenNv: '',
  tenDangNhap: '',
  namSinh: '',
  gioiTinh: '',
  maChucVu: '',
  matKhau: ''
});

// --- HÀM VALIDATE LOGIC (MỚI) ---
const validateForm = () => {
  let isValid = true;
  const currentYear = new Date().getFullYear();

  // 1. Reset lỗi cũ
  Object.keys(errors).forEach(key => errors[key] = '');

  // 2. Validate Họ tên (Chấp nhận Tiếng Việt, Ký tự trắng. KHÔNG số, KHÔNG ký tự đặc biệt)
  const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
  if (!formData.hoTenNv) {
    errors.hoTenNv = 'Vui lòng nhập họ và tên';
    isValid = false;
  } else if (!nameRegex.test(formData.hoTenNv)) {
    errors.hoTenNv = 'Họ tên không được chứa số hoặc ký tự đặc biệt';
    isValid = false;
  }

  // 3. Validate Username (Chữ + Số, KHÔNG ký tự đặc biệt, KHÔNG dấu)
  const userRegex = /^[a-zA-Z0-9]+$/;
  if (!formData.tenDangNhap) {
    errors.tenDangNhap = 'Vui lòng nhập tên đăng nhập';
    isValid = false;
  } else if (!userRegex.test(formData.tenDangNhap)) {
    errors.tenDangNhap = 'Tên đăng nhập không được chứa dấu hoặc ký tự đặc biệt';
    isValid = false;
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  if (!isEditMode.value) {
    // TRƯỜNG HỢP 1: THÊM MỚI (Bắt buộc nhập)
    if (!formData.matKhau) {
      errors.matKhau = 'Vui lòng nhập mật khẩu';
      isValid = false;
    } else if (!passwordRegex.test(formData.matKhau)) {
      errors.matKhau = 'Mật khẩu phải từ 6 ký tự, bao gồm cả chữ và số';
      isValid = false;
    }
  } else {
    // TRƯỜNG HỢP 2: CẬP NHẬT (Chỉ check nếu người dùng có nhập vào ô đổi mật khẩu)
    if (formData.matKhau && !passwordRegex.test(formData.matKhau)) {
      errors.matKhau = 'Mật khẩu mới phải từ 6 ký tự, bao gồm cả chữ và số';
      isValid = false;
    }
  }

  // 4. Validate Năm sinh (>= 16 tuổi)
  if (formData.namSinh) {
    if (formData.namSinh < 1900 || formData.namSinh > currentYear) {
      errors.namSinh = 'Năm sinh không hợp lệ';
      isValid = false;
    } else if (currentYear - formData.namSinh < 16) {
      errors.namSinh = `Nhân sự này chưa đủ 16 tuổi (Phải sinh trước năm ${currentYear - 16})`;
      isValid = false;
    }
  }

  // 5. Validate Bắt buộc chọn
  if (!formData.gioiTinh) {
    errors.gioiTinh = 'Vui lòng chọn giới tính';
    isValid = false;
  }
  if (!formData.maChucVu) {
    errors.maChucVu = 'Vui lòng chọn chức vụ';
    isValid = false;
  }

  return isValid;
};


</script>

<style scoped>
/* =========================================
   1. VARIABLES & COLORS (Style Sneat)
   ========================================= */
:root {
  --primary: #696cff;
  --success: #71dd37;
  --warning: #ffab00;
  --info: #03c3ec;
  --secondary: #8592a3;
  --text-color: #566a7f;
  --bg-body: #f5f5f9;
}

.staff-manager-container {
  color: #566a7f;
  font-family: 'Public Sans', sans-serif;
}

/* =========================================
   2. CARD & LAYOUT
   ========================================= */
.card-custom {
  border: none;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 2px 6px 0 rgba(67, 89, 113, 0.12);
}

.input-group-custom {
  border-radius: 0.375rem;
  overflow: hidden;
  border: 1px solid #d9dee3;
}

.input-group-custom .input-group-text {
  background: #fff;
  border: none;
  color: #b4bdc6;
}

.input-group-custom .form-control {
  border: none;
  box-shadow: none;
}

.btn-add-new {
  background-color: #696cff;
  border-color: #696cff;
  box-shadow: 0 0.125rem 0.25rem 0 rgba(105, 108, 255, 0.4);
  font-weight: 500;

  /* --- THÊM CÁC DÒNG NÀY --- */
  white-space: nowrap;
  /* Bắt buộc chữ nằm trên 1 dòng */
  display: inline-flex;
  /* Giúp căn giữa icon và chữ đẹp hơn */
  align-items: center;
  /* Căn giữa theo chiều dọc */
  justify-content: center;
  flex-shrink: 0;
  /* Cấm nút bị co lại khi màn hình bé */
  padding: 0.5rem 1rem;
  /* Căn chỉnh khoảng cách lề cho thoáng */
}

.btn-add-new:hover {
  background-color: #5f61e6;
  transform: translateY(-1px);
}

/* =========================================
   3. AVATAR (HÌNH TRÒN & CHỮ) - KEY UPDATE
   ========================================= */
.avatar-wrapper {
  width: 38px;
  height: 38px;
  position: relative;
  flex-shrink: 0;
}

/* Ảnh thật */
.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  /* Tròn xoe */
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Avatar chữ (khi không có ảnh) */
.avatar-initial {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  /* Tròn xoe */
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.95rem;
  color: #fff;
  /* Chữ trắng */
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(105, 108, 255, 0.2);
}

/* Màu nền avatar theo chức vụ */
.role-manager {
  background: #696cff;
  color: #fff;
}

/* Tím */
.role-reception {
  background: #03c3ec;
  color: #fff;
}

/* Xanh biển */
.role-housekeeping {
  background: #ffab00;
  color: #fff;
}

/* Vàng */
.role-security {
  background: #8592a3;
  color: #fff;
}

/* Xám */
.role-default {
  background: #8592a3;
}

/* =========================================
   4. BADGES (CHỨC VỤ & TRẠNG THÁI) - KEY UPDATE
   ========================================= */
/* Badge chức vụ: Nền nhạt, chữ đậm */
.badge-custom {
  padding: 0.45rem 0.65rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
}

/* Phối màu badge chức vụ (Nền pastel) */
.badge-custom.role-manager {
  background-color: #e7e7ff;
  color: #696cff;
}

.badge-custom.role-reception {
  background-color: #d7f5fc;
  color: #03c3ec;
}

.badge-custom.role-housekeeping {
  background-color: #fff2d6;
  color: #ffab00;
}

.badge-custom.role-security {
  background-color: #ebeef0;
  color: #8592a3;
}

/* Badge Trạng thái */
.badge-status {
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.badge-status .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

/* Active */
.status-active {
  color: #71dd37;
}

.status-active .dot {
  background-color: #71dd37;
  box-shadow: 0 0 0 2px rgba(113, 221, 55, 0.2);
}

/* Inactive */
.status-inactive {
  color: #8592a3;
}

.status-inactive .dot {
  background-color: #8592a3;
}

/* =========================================
   5. TABLE & BUTTONS
   ========================================= */
.table thead th {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 1px;
  font-weight: 600;
  color: #566a7f;
  background-color: #f9fafb;
  border-bottom: 1px solid #d9dee3;
}

.text-heading {
  color: #566a7f;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-edit {
  background: #e7e7ff;
  color: #696cff;
}

.btn-edit:hover {
  background: #696cff;
  color: #fff;
}

.btn-delete {
  background: #ffe0db;
  color: #ff3e1d;
}

.btn-delete:hover {
  background: #ff3e1d;
  color: #fff;
}

.btn-lock {
  background: #fff3e0;
  color: #ff9800;
}

.btn-lock:hover {
  background: #ff9800;
  color: #fff;
}

/* =========================================
   6. MODAL (Tự chế)
   ========================================= */
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(67, 89, 113, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-dialog-custom {
  background: #fff;
  width: 95%;
  max-width: 600px;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.modal-header {
  border-bottom: 1px solid #ebeef0;
  padding: 1.2rem;
}

.modal-body {
  padding: 1.5rem;
}

.btn-close-custom {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #a1acb8;
  cursor: pointer;
}

.form-label {
  font-weight: 500;
  font-size: 0.85rem;
  color: #566a7f;
  margin-bottom: 0.25rem;
}

.form-control,
.form-select {
  border-radius: 0.375rem;
  border: 1px solid #d9dee3;
  padding: 0.5rem 0.8rem;
}

.form-control:focus {
  border-color: #696cff;
  box-shadow: 0 0 0 0.2rem rgba(105, 108, 255, 0.15);
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>