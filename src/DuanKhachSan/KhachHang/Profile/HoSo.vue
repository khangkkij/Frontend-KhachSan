<template>
    <div class="profile-page" style="margin-top: 120px; margin-bottom: 80px; background-color: #f8f9fa;">
      <div class="container">
        <div class="row g-4">
          
          <div class="col-lg-4 col-md-5">
            <ProfileSidebar :user="{ name: user.hoVaTen, avatar: user.hinhAnh }" currentPage="profile" />
          </div>
  
          <div class="col-lg-8 col-md-7">
            <div class="profile-card shadow-sm p-4 p-md-5 bg-white rounded-4 border-0">
              <h4 class="fw-bold text-dark mb-4 border-bottom pb-3 text-uppercase ls-1">Hồ sơ cá nhân</h4>
  
              <div class="text-center mb-5">
                <div class="avatar-upload-container d-inline-block position-relative">
                  <img :src="previewImage || (user.hinhAnh ? (API_URL_ROOT + '/USER_IMG/' + user.hinhAnh + '?t=' + new Date().getTime()) : '/assets/images/info-icon-01.png')" 
                       class="rounded-circle shadow border border-4 border-white object-fit-cover" 
                       style="width: 140px; height: 140px;" 
                       @error="e => e.target.src='/assets/images/info-icon-01.png'">
                  
                  <label for="avatarInput" class="btn-camera-overlay">
                    <i class="fa fa-camera"></i>
                  </label>
                  <input type="file" id="avatarInput" hidden @change="handleFileChange" accept="image/*">
                </div>
                <p class="small text-muted mt-3 italic">Nhấp vào biểu tượng camera để thay đổi ảnh đại diện</p>
              </div>
  
              <form @submit.prevent="handleUpdate" class="row g-3">
                <div class="col-12 mb-3">
                  <label class="form-label fw-bold small text-muted">EMAIL (KHÔNG THỂ THAY ĐỔI)</label>
                  <input type="email" :value="user.email" class="form-control bg-light opacity-75" disabled>
                </div>
  
                <div class="col-md-12 mb-3">
                  <label class="form-label fw-bold small text-muted">HỌ VÀ TÊN</label>
                  <input type="text" v-model="user.hoVaTen" 
                         class="form-control" 
                         :class="{'is-invalid': errors.HoVaTen}"
                         placeholder="Nhập họ và tên">
                  <div class="invalid-feedback" v-if="errors.HoVaTen">{{ errors.HoVaTen }}</div>
                </div>
  
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold small text-muted">SỐ ĐIỆN THOẠI</label>
                  <input type="text" v-model="user.sdt" 
                         class="form-control" 
                         :class="{'is-invalid': errors.Sdt}"
                         placeholder="Ví dụ: 0987654321">
                  <div class="invalid-feedback" v-if="errors.Sdt">{{ errors.Sdt }}</div>
                </div>
  
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold small text-muted">CCCD / PASSPORT</label>
                  <input type="text" v-model="user.cccd" 
                         class="form-control" 
                         :class="{'is-invalid': errors.Cccd}"
                         placeholder="Nhập 12 số CCCD">
                  <div class="invalid-feedback" v-if="errors.Cccd">{{ errors.Cccd }}</div>
                </div>
  
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold small text-muted">GIỚI TÍNH</label>
                  <select v-model="user.gioiTinh" class="form-select" :class="{'is-invalid': errors.GioiTinh}">
                    <option value="">-- Chọn giới tính --</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                  <div class="invalid-feedback" v-if="errors.GioiTinh">{{ errors.GioiTinh }}</div>
                </div>
  
                <div class="col-12 mt-4 text-end">
                  <button type="submit" class="btn btn-orange px-5 py-2 text-white fw-bold rounded-pill shadow-sm" :disabled="isSaving">
                    <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                    Lưu thay đổi
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
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import ProfileSidebar from './ProfileSidebar.vue'; 
  
  const API_URL = import.meta.env.VITE_API_URL;
  const API_URL_ROOT = API_URL.replace('/api', ''); 
  
  const user = ref({ hoVaTen: '', email: '', sdt: '', cccd: '', gioiTinh: '', hinhAnh: '' });
  const errors = ref({});
  const isSaving = ref(false);
  const previewImage = ref(null);
  
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/KhachHang/profile`, { withCredentials: true });
      user.value = res.data;
    } catch (err) { console.error("Lỗi fetch profile:", err); }
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Hiển thị ảnh tạm thời để UX mượt mà
    previewImage.value = URL.createObjectURL(file);
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const res = await axios.post(`${API_URL}/api/KhachHang/upload-avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      
      // Server trả về tên file (ví dụ: user_1.png)
      const newAvatarFileName = res.data.fileName; 
  
      // 1. Cập nhật state local
      user.value.hinhAnh = newAvatarFileName;
      
      // 2. Cập nhật LocalStorage
      const storage = JSON.parse(localStorage.getItem('user_info') || '{}');
      storage.avatar = newAvatarFileName;
      localStorage.setItem('user_info', JSON.stringify(storage));
      
      // 3. Phát sự kiện toàn cục để Sidebar cập nhật ngay (không cần reload)
      window.dispatchEvent(new CustomEvent('user-avatar-updated', { 
        detail: { avatar: newAvatarFileName } 
      }));
      
      alert("Đã lưu ảnh đại diện mới vào thư mục hệ thống!");
      previewImage.value = null; // Tắt preview, chuyển sang hiển thị ảnh thật từ /USER_IMG/
    } catch (err) {
      alert("Lỗi khi lưu ảnh.");
      previewImage.value = null;
    }
  };
  
  const validateForm = () => {
    const errs = {};
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỵỷỹýỳỹỷỵ\s]+$/;
    const phoneRegex = /^0[0-9]{9}$/;
    const cccdRegex = /^[0-9]{12}$/;
  
    if (!user.value.hoVaTen) errs.HoVaTen = "Họ tên không được để trống";
    else if (user.value.hoVaTen.length < 2) errs.HoVaTen = "Họ tên quá ngắn";
    else if (!nameRegex.test(user.value.hoVaTen)) errs.HoVaTen = "Họ tên không hợp lệ";
  
    if (!user.value.sdt) errs.Sdt = "Số điện thoại không được để trống";
    else if (!phoneRegex.test(user.value.sdt)) errs.Sdt = "SĐT phải có 10 số, bắt đầu bằng 0";
  
    if (!user.value.cccd) errs.Cccd = "Số CCCD không được để trống";
    else if (!cccdRegex.test(user.value.cccd)) errs.Cccd = "CCCD phải đúng 12 số";
  
    if (!user.value.gioiTinh) errs.GioiTinh = "Vui lòng chọn giới tính";
  
    errors.value = errs;
    return Object.keys(errs).length === 0;
  };
  
  const handleUpdate = async () => {
    if (!validateForm()) return;
  
    isSaving.value = true;
    try {
      await axios.put(`${API_URL}/api/KhachHang/update-profile`, {
        HoVaTen: user.value.hoVaTen, 
        Sdt: user.value.sdt,
        GioiTinh: user.value.gioiTinh, 
        Cccd: user.value.cccd
      }, { withCredentials: true });
  
      const storage = JSON.parse(localStorage.getItem('user_info') || '{}');
      storage.name = user.value.hoVaTen;
      localStorage.setItem('user_info', JSON.stringify(storage));
      
      alert("Cập nhật hồ sơ thành công!");
      window.location.reload();
    } catch (err) {
      if (err.response?.data?.errors) errors.value = err.response.data.errors;
      else alert("Lỗi khi cập nhật thông tin.");
    } finally {
      isSaving.value = false;
    }
  };
  
  onMounted(fetchProfile);
  </script>
  
  <style scoped>
  .ls-1 { letter-spacing: 1px; }
  .btn-orange { background-color: #f35525; border: none; transition: 0.3s; }
  .btn-orange:hover { background-color: #ca3c12; transform: translateY(-2px); }
  .btn-camera-overlay {
    position: absolute; bottom: 5px; right: 5px; background: #f35525;
    color: white; width: 38px; height: 38px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.15); transition: 0.3s;
  }
  .italic { font-style: italic; font-size: 0.85rem; }
  .invalid-feedback { display: block; font-size: 0.8rem; margin-top: 4px; color: #dc3545; }
  </style>