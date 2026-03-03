<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import Swal from 'sweetalert2';
import axios from 'axios';
import * as bootstrap from 'bootstrap'; 
import signalrService from '../Service/signalrService'; 

// URL API 
const API_URL = `${import.meta.env.VITE_API_URL}/api/DichVu`; 
const API_IMG_URL = `${import.meta.env.VITE_API_URL}/anhDichVu/`; 

const searchQuery = ref('');
const filterStatus = ref('all');
const services = ref([]); 

const selectedFile = ref(null); 
const previewImage = ref(null); 

// Object Thêm mới
const newService = reactive({
    tenDichVu: '',
    gia: '',
    hinhAnh: '',
    trangThai: true
});

// Object Sửa
const selectedService = ref({
    maDichVu: 0,
    tenDichVu: '',
    gia: 0,
    hinhAnh: '',
    trangThai: true
});

// --- LOGIC REAL-TIME ---
const reloadDataFromSignalR = async () => {
    // Khi có tín hiệu từ SignalR, tự động load lại danh sách
    await fetchServices();
};

onMounted(() => {
    fetchServices();
    // 2. ĐĂNG KÝ LISTENER KHI VÀO TRANG
    signalrService.registerListener(reloadDataFromSignalR);
});

onUnmounted(() => {
    // 3. HỦY LISTENER KHI RỜI TRANG
    signalrService.removeListener(reloadDataFromSignalR);
});

// --- XỬ LÝ ẢNH ---
const getDisplayImage = (imgName) => {
    if (!imgName) return 'https://via.placeholder.com/150';
    if (imgName.startsWith('blob:') || imgName.startsWith('http')) return imgName;
    return API_IMG_URL + imgName;
};

const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file;
        previewImage.value = URL.createObjectURL(file);
    }
};

// --- API ACTIONS ---

// 1. Lấy danh sách
const fetchServices = async () => {
    try {
        const response = await axios.get(API_URL);
        services.value = response.data;
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
    }
};

// 2. Thêm mới
const handleCreate = async () => {
    if (!newService.tenDichVu || !newService.gia) {
        Swal.fire({ icon: 'error', text: 'Vui lòng nhập tên và giá dịch vụ!' });
        return;
    }

    try {
        const formData = new FormData();
        formData.append('tenDichVu', newService.tenDichVu);
        formData.append('gia', parseFloat(newService.gia));
        formData.append('trangThai', newService.trangThai);
        if (selectedFile.value) {
            formData.append('upLoadImage', selectedFile.value); 
        }

        await axios.post(API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Đóng modal
        const modalEl = document.getElementById('createServiceModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();

        Swal.fire({ icon: 'success', title: 'Thêm thành công!', confirmButtonColor: '#c5a47e' });
        
        // SignalR sẽ lo việc reloadData qua listener, nhưng gọi fetchServices() ở đây cho chắc cũng tốt
        await fetchServices(); 

    } catch (error) {
        console.error(error);
        Swal.fire('Lỗi', 'Không thêm được dịch vụ', 'error');
    }
}

// 3. Cập nhật
const handleUpdate = async () => {
    try {
        const id = selectedService.value.maDichVu;
        const formData = new FormData();
        formData.append('maDichVu', id);
        formData.append('tenDichVu', selectedService.value.tenDichVu);
        formData.append('gia', parseFloat(selectedService.value.gia));
        formData.append('trangThai', selectedService.value.trangThai);

        if (selectedFile.value) {
            formData.append('upLoadImage', selectedFile.value);
        }

        await axios.put(`${API_URL}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        const modalEl = document.getElementById('editServiceModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();

        Swal.fire({ icon: 'success', title: 'Cập nhật thành công!', confirmButtonColor: '#c5a47e' });
        await fetchServices();

    } catch (error) {
        console.error(error);
        Swal.fire('Lỗi', 'Không cập nhật được', 'error');
    }
}

// 4. Xóa
const handleDelete = (id) => {
    Swal.fire({
        title: 'Xóa dịch vụ?',
        text: "Hành động này không thể hoàn tác!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#c5a47e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa ngay',
        cancelButtonText: 'Hủy'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                Swal.fire({ icon: 'success', title: 'Đã xóa!', confirmButtonColor: '#c5a47e' });
                await fetchServices();
            } catch (error) {
                console.error(error);
                Swal.fire('Lỗi', 'Không xóa được dịch vụ', 'error');
            }
        }
    });
}

// --- HELPERS ---
const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const getStatusBadge = (status) => {
    return status === true 
        ? { class: 'badge bg-label-success', text: 'Đang hoạt động' }
        : { class: 'badge bg-label-secondary', text: 'Ngưng hoạt động' };
};

// --- MODAL ACTIONS ---
const openCreateModal = () => {
    newService.tenDichVu = '';
    newService.gia = '';
    newService.hinhAnh = '';
    newService.trangThai = true;
    selectedFile.value = null;
    previewImage.value = null;

    const modal = new bootstrap.Modal(document.getElementById('createServiceModal'));
    modal.show();
}

const openEditModal = (service) => {
    selectedService.value = { ...service };
    selectedFile.value = null;
    previewImage.value = getDisplayImage(service.hinhAnh);

    const modal = new bootstrap.Modal(document.getElementById('editServiceModal'));
    modal.show();
}
</script>

<template>
  <div class="luxury-container container-xxl flex-grow-1 container-p-y">
    
    <div class="d-flex justify-content-between align-items-center mb-4 pt-2">
      <div>
        <h4 class="fw-bold luxury-title mb-1">Quản Lý Dịch Vụ</h4>
        <small class="text-muted">Danh sách các dịch vụ & tiện ích cung cấp</small>
      </div>
      <button class="btn btn-gold shadow-sm" @click="openCreateModal">
        <i class='bx bx-plus me-1'></i> Thêm dịch vụ mới
      </button>
    </div>

    <div class="card luxury-card">
      <div class="card-header bg-white border-bottom-0 d-flex gap-3 py-3">
        <div class="input-group input-group-merge luxury-search" style="max-width: 300px;">
          <span class="input-group-text border-0 ps-3 bg-transparent"><i class="bx bx-search text-muted"></i></span>
          <input type="text" class="form-control border-0 bg-transparent shadow-none" placeholder="Tìm tên dịch vụ..." v-model="searchQuery" />
        </div>
        <div class="ms-auto d-flex gap-2">
           <select class="form-select border-0 bg-light" style="width: 170px;" v-model="filterStatus">
             <option value="all">Tất cả </option>
             <option value="true">Đang hoạt động</option>
             <option value="false">Ngưng hoạt động</option>
           </select>
        </div>
      </div>

      <div class="table-responsive text-nowrap">
        <table class="table table-hover luxury-table align-middle">
          <thead class="table-light">
            <tr>
              <th class="ps-4">Hình ảnh</th>
              <th>Tên dịch vụ</th>
              <th class="text-end">Đơn giá</th>
              <th class="text-center">Trạng thái</th>
              <th class="text-end pe-4">Hành động</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="service in services" :key="service.maDichVu">
              <td class="ps-4">
                <div class="service-img-container shadow-sm">
                    <img :src="getDisplayImage(service.hinhAnh)" class="rounded" style="width: 60px; height: 60px; object-fit: cover;">
                </div>
              </td>

              <td>
                <div class="d-flex flex-column">
                  <span class="fw-bold text-dark fs-6">{{ service.tenDichVu }}</span>
                  <small class="text-muted">Mã DV: #{{ service.maDichVu }}</small>
                </div>
              </td>

              <td class="text-end">
                 <span class="fw-bold text-gold fs-6">{{ formatCurrency(service.gia) }}</span>
              </td>

              <td class="text-center">
                <span :class="getStatusBadge(service.trangThai).class">
                  {{ getStatusBadge(service.trangThai).text }}
                </span>
              </td>

              <td class="text-end pe-4">
                <button class="btn btn-sm btn-icon btn-outline-secondary me-1" @click="openEditModal(service)" title="Chỉnh sửa">
                    <i class='bx bx-edit-alt'></i>
                </button>
                <button class="btn btn-sm btn-icon btn-outline-danger" @click="handleDelete(service.maDichVu)" title="Xóa">
                    <i class='bx bx-trash'></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer bg-white border-top-0 d-flex justify-content-end py-3"></div>
    </div>

    <div class="modal fade" id="createServiceModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content luxury-modal">
            <div class="modal-header border-bottom-0">
                <h5 class="modal-title fw-bold text-dark">Thêm Dịch Vụ Mới</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="mb-3 text-center">
                        <div class="d-flex justify-content-center mb-2">
                             <div class="img-preview-box rounded-3 border d-flex align-items-center justify-content-center bg-light" style="width: 120px; height: 120px; overflow: hidden;">
                                 <img v-if="previewImage" :src="previewImage" class="w-100 h-100" style="object-fit: cover;">
                                 <div v-else class="text-center text-muted">
                                     <i class='bx bx-image-add fs-1'></i>
                                     <div style="font-size: 10px;">Chưa chọn ảnh</div>
                                 </div>
                             </div>
                        </div>
                        <input type="file" class="form-control form-control-sm" accept="image/*" @change="onFileChange">
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">Tên dịch vụ</label>
                        <input type="text" class="form-control" placeholder="Nhập tên dịch vụ" v-model="newService.tenDichVu">
                    </div>

                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Đơn giá (VNĐ)</label>
                            <input type="number" class="form-control" placeholder="0" v-model="newService.gia">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Trạng thái</label>
                            <select class="form-select" v-model="newService.trangThai">
                                <option :value="true">Đang hoạt động</option>
                                <option :value="false">Ngưng hoạt động</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-top-0">
                <button class="btn btn-light" data-bs-dismiss="modal">Hủy</button>
                <button class="btn btn-gold" @click="handleCreate">Xác nhận thêm</button>
            </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="editServiceModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content luxury-modal">
            <div class="modal-header border-bottom-0">
                <h5 class="modal-title fw-bold text-gold">Cập nhật dịch vụ</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="d-flex align-items-center mb-3 p-2 border rounded bg-light">
                        <img :src="previewImage || 'https://via.placeholder.com/80'" class="rounded-3 shadow-sm me-3" width="70" height="70" style="object-fit:cover">
                        <div class="flex-grow-1">
                             <label class="form-label small text-uppercase fw-bold text-muted mb-1">Đổi hình ảnh</label>
                             <input type="file" class="form-control form-control-sm" accept="image/*" @change="onFileChange">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">Tên dịch vụ</label>
                        <input type="text" class="form-control" v-model="selectedService.tenDichVu">
                    </div>
                    
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Đơn giá</label>
                            <div class="input-group">
                                <input type="number" class="form-control text-end fw-bold text-gold" v-model="selectedService.gia">
                                <span class="input-group-text bg-white">đ</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Trạng thái</label>
                            <select class="form-select" v-model="selectedService.trangThai">
                                <option :value="true">Đang hoạt động</option>
                                <option :value="false">Ngưng hoạt động</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-top-0">
                <button class="btn btn-light" data-bs-dismiss="modal">Đóng</button>
                <button class="btn btn-gold" @click="handleUpdate">Lưu thay đổi</button>
            </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* STYLE GIỮ NGUYÊN */
:root { --gold-primary: #c5a47e; --gold-hover: #b08d65; --dark-text: #2c2c2c; }
.luxury-container { font-family: 'Montserrat', sans-serif; }
.luxury-title { font-family: 'Playfair Display', serif; color: #2c2c2c; letter-spacing: 0.5px; }
.luxury-card { border: none; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); overflow: hidden; }
.btn-gold { background-color: #c5a47e; color: white; border: none; padding: 0.5rem 1.2rem; border-radius: 6px; transition: all 0.3s; }
.btn-gold:hover { background-color: #b08d65; color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(197, 164, 126, 0.4); }
.bg-gold { background-color: #c5a47e !important; color: white; }
.text-gold { color: #c5a47e !important; }
.bg-gold-subtle { background-color: rgba(197, 164, 126, 0.15) !important; }
.luxury-search { background-color: #f8f9fa; border-radius: 50px; padding: 2px; border: 1px solid transparent; transition: all 0.3s; }
.luxury-search:focus-within { border-color: #c5a47e; background-color: #fff; box-shadow: 0 0 0 3px rgba(197, 164, 126, 0.1); }
.luxury-table thead th { font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; font-size: 0.75rem; color: #888; border-bottom: 2px solid #f0f0f0; }
.luxury-table tbody tr { transition: background-color 0.2s; }
.luxury-table tbody tr:hover { background-color: #fdfcfb; }
.service-img-container { padding: 3px; background: #fff; border: 1px solid #eee; border-radius: 8px; width: fit-content; }
.luxury-modal { border: none; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
.badge { padding: 0.5em 0.8em; font-weight: 500; letter-spacing: 0.3px; border-radius: 6px; }
.bg-label-success { background-color: #e8fadf !important; color: #71dd37 !important; }
.bg-label-secondary { background-color: #ebeef0 !important; color: #8592a3 !important; }
</style>