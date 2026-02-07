<template>
  <div class="page-container">

    <div class="card card-custom mb-4 border-0 shadow-sm">
      <div class="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <h5 class="card-title fw-bold text-dark mb-0 d-flex align-items-center">
            <span class="badge bg-gradient-primary p-2 rounded-3 me-2 shadow-sm">
              <i class='bx bx-receipt fs-4 text-white'></i>
            </span>
            Quản lý Hóa đơn
          </h5>
          <small class="text-muted ms-1">Quản lý doanh thu và lịch sử thanh toán</small>
        </div>

        <div class="d-flex align-items-center gap-3 flex-wrap">
  <div class="input-group input-group-merge shadow-sm custom-input-group date-filter-group" style="width: 210px;">
    <span class="input-group-text bg-white border-end-0 text-primary">
      <i class='bx bx-calendar'></i>
    </span>
    <input type="date" 
           class="form-control border-start-0 ps-1 text-dark" 
           v-model="filterDate" />
    <button v-if="filterDate" 
            class="btn btn-outline-secondary border-0 btn-reset-date" 
            @click="resetDate" 
            title="Xóa bộ lọc ngày">
      <i class='bx bx-refresh fs-4'></i>
    </button>
  </div>

  <div class="input-group input-group-merge shadow-sm custom-input-group" style="width: 250px;">
    <span class="input-group-text bg-white border-end-0 text-primary"><i class="bx bx-search"></i></span>
    <input type="text" class="form-control border-start-0 ps-1 text-dark" placeholder="Tìm tên, mã HĐ..." v-model="searchQuery" />
  </div>

  <button class="btn btn-gradient-success shadow-md d-flex align-items-center fw-bold px-4 rounded-pill" @click="exportToExcel">
    <i class="bx bx-export me-2"></i> Xuất Excel
  </button>
</div>
      </div>
    </div>

    <div class="card card-custom border-0 shadow-sm">
      <div class="table-responsive text-nowrap rounded-3 p-3">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light-gray rounded-3">
            <tr>
              <th class="ps-4 text-uppercase text-secondary fs-7 fw-bolder">Mã HĐ</th>
              <th class="text-uppercase text-secondary fs-7 fw-bolder">Khách hàng</th>
              <th class="text-uppercase text-secondary fs-7 fw-bolder">Ngày lập</th>
              <th class="text-uppercase text-secondary fs-7 fw-bolder">Nhân viên</th>
              <th class="text-uppercase text-secondary fs-7 fw-bolder">Hình thức</th>
              <th class="text-uppercase text-secondary fs-7 fw-bolder">Tổng tiền</th>
              <th class="text-uppercase text-secondary fs-7 fw-bolder">Trạng thái</th>
              <th class="text-center text-uppercase text-secondary fs-7 fw-bolder">Tác vụ</th>
            </tr>
          </thead>
          
          <tbody class="table-border-bottom-0">
            <tr v-if="isLoading">
                <td colspan="8" class="text-center py-5">
                    <div class="spinner-border text-primary mb-2" role="status"></div>
                    <div class="text-muted small">Đang tải dữ liệu...</div>
                </td>
            </tr>
            
            <tr v-else-if="filteredInvoices.length === 0">
                <td colspan="8" class="text-center py-5">
                    <div class="d-flex flex-column align-items-center">
                        <i class='bx bx-data fs-1 text-muted mb-2'></i>
                        <span class="text-muted">Không tìm thấy dữ liệu</span>
                    </div>
                </td>
            </tr>

            <tr v-else v-for="invoice in filteredInvoices" :key="invoice.maHD">
              <td class="ps-4">
                <span class="badge bg-label-primary fw-bold rounded-pill px-3">#{{ invoice.maHD }}</span>
              </td>

              <td>
                <div class="d-flex flex-column">
                  <span class="fw-bold text-dark">{{ invoice.tenKhachHang }}</span>
                  <div class="d-flex align-items-center mt-1">
                     <i class='bx bx-phone text-muted me-1' style="font-size: 12px;"></i>
                     <small class="text-muted">{{ invoice.sdt || '---' }}</small>
                  </div>
                </div>
              </td>

              <td>
                <div class="d-flex flex-column">
                    <span class="text-dark fw-medium">{{ formatDate(invoice.ngayTao) }}</span>
                    <small class="text-muted" style="font-size: 11px;">{{ formatTime(invoice.ngayTao) }}</small>
                </div>
              </td>

              <td>
                <div class="d-flex align-items-center">
                    <div class="avatar-wrapper me-2">
                        <img v-if="invoice.hinhAnhNhanVien" 
                             :src="getFullImageUrl(invoice.hinhAnhNhanVien)" 
                             @error="handleImageError($event)"
                             class="avatar-img" />
                        <div v-else class="avatar-initial-circle">
                            <img  
                             :src="getDefaultAvatar()" 
                             class="avatar-img" />
                        </div>
                    </div>
                    <div class="d-flex flex-column">
                        <span class="text-dark fw-bold" style="font-size: 0.9rem;">{{ invoice.tenNhanVien }}</span>
                        <span class="badge-custom mt-1" :class="getRoleColorClass(invoice.chucVuNhanVien)">
                            {{ invoice.chucVuNhanVien }}
                        </span>
                    </div>
                </div>
              </td>

              <td>
                 <span class="badge rounded-pill" :class="getPaymentMethodClass(invoice.loaiThanhToan, false)">
                    {{ formatPaymentMethod(invoice.loaiThanhToan) }}
                 </span>
              </td>

              <td><span class="fw-bold text-primary">{{ formatCurrency(invoice.tongTienPhaiTra) }}</span></td>

              <td>
                <span class="badge rounded-pill" :class="getStatusBadgeClass(invoice.trangThai)">
                  {{ formatStatusText(invoice.trangThai) }}
                </span>
              </td>

              <td class="text-center">
                <div class="d-flex justify-content-center gap-2">
                    <button class="btn btn-icon btn-soft-primary shadow-sm" @click="openInvoiceDetail(invoice)" title="Xem chi tiết">
                        <i class="bx bx-show-alt fs-5"></i>
                    </button>
                    <button class="btn btn-icon btn-soft-dark shadow-sm" @click="directPrint(invoice)" title="In hóa đơn">
                        <i class="bx bx-printer fs-5"></i>
                    </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop-custom" @click.self="closeModal">
      <div class="modal-dialog-custom">
        <div class="modal-content border-0 shadow-lg">

          <div class="modal-header border-bottom px-4 py-3 bg-white rounded-top">
            <h5 class="modal-title fw-bold text-primary d-flex align-items-center">
              <i class='bx bx-file me-2'></i> Chi tiết hóa đơn
            </h5>
            <button type="button" class="btn-close-custom" @click="closeModal">
              <i class='bx bx-x fs-3'></i>
            </button>
          </div>

          <div class="modal-body p-0 bg-light-gray modal-body-scroll">
            <div id="invoice-print-area" class="invoice-paper shadow-sm mx-auto">
              
              <div class="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h3 class="fw-bold text-primary text-uppercase mb-1 brand-title" style="letter-spacing: 2px;">LUXURY HOTEL</h3>
                  <p class="text-dark small mb-0">123 Đường Biển, TP. Đà Nẵng</p>
                  <p class="text-dark small mb-0">Hotline: 0905 123 456</p>
                </div>
                <div class="text-end">
                  <div class="badge bg-gradient-primary fs-6 mb-2 text-white print-badge shadow-sm">HÓA ĐƠN</div>
                  <p class="mb-0 text-dark fw-bold fs-5">Mã hóa đơn: #{{ selectedInvoice?.maHD }}</p>
                  <p class="mb-0 small text-muted">Ngày lập: {{ formatDate(selectedInvoice?.ngayTao) }}</p>
                </div>
              </div>

              <hr class="border-dashed my-4">

              <div class="row mb-4">
                <div class="col-6">
                  <label class="text-uppercase text-secondary fw-bold small mb-2">Khách hàng</label>
                  <h6 class="text-dark fw-bold mb-1">{{ selectedInvoice?.tenKhachHang }}</h6>
                  <p class="text-dark small mb-0"><i class='bx bx-phone me-1'></i>{{ selectedInvoice?.sdt || '---' }}</p>
                </div>
                <div class="col-6 text-end">
                  <label class="text-uppercase text-secondary fw-bold small mb-2">Nhân viên lập</label>
                  <h6 class="text-dark mb-1">{{ selectedInvoice?.tenNhanVien }}</h6>
                  <small class="text-muted d-block mb-2">{{ selectedInvoice?.chucVuNhanVien }}</small>
                  
                  <div>
                     <span class="badge shadow-sm px-3 py-2 fs-6" 
                           :class="getPaymentMethodClass(selectedInvoice?.loaiThanhToan, true)">
                        {{ formatPaymentMethod(selectedInvoice?.loaiThanhToan) }}
                     </span>
                  </div>
                </div>
              </div>

              <div class="mb-4" v-if="selectedInvoice?.chiTietPhong?.length">
                <h6 class="fw-bold text-dark small border-bottom border-2 border-primary pb-2 mb-3 d-flex align-items-center">
                    <i class='bx bx-building-house me-2 text-primary'></i> CHI TIẾT PHÒNG
                </h6>
                <table class="table table-sm table-borderless mb-0">
                  <thead class="bg-light rounded">
                    <tr>
                      <th class="ps-2 text-dark text-uppercase small fw-bold">Phòng / Loại</th>
                      <th class="text-center text-dark text-uppercase small fw-bold">Số đêm</th>
                      <th class="text-end text-dark text-uppercase small fw-bold">Đơn giá</th>
                      <th class="text-end pe-2 text-dark text-uppercase small fw-bold">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(room, index) in selectedInvoice.chiTietPhong" :key="'room-'+index">
                      <td class="ps-2 align-middle">
                        <span class="fw-bold text-dark fs-6">Phòng {{ room.soPhong }}</span>
                        <br>
                        <small class="text-muted fst-italic">{{ room.loaiPhong }}</small>
                      </td>
                      <td class="text-center text-dark align-middle fw-medium">{{ room.soDem }}</td>
                      <td class="text-end text-dark align-middle">{{ formatCurrency(room.donGia) }}</td>
                      <td class="text-end pe-2 fw-bold text-dark align-middle">{{ formatCurrency(room.thanhTien) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="mb-4" v-if="selectedInvoice?.dichVu?.length">
                <h6 class="fw-bold text-dark small border-bottom border-2 border-primary pb-2 mb-3 mt-4 d-flex align-items-center">
                    <i class='bx bx-coffee me-2 text-primary'></i> DỊCH VỤ SỬ DỤNG
                </h6>
                <table class="table table-sm table-borderless mb-0">
                  <thead class="bg-light rounded">
                    <tr>
                      <th class="ps-2 text-dark text-uppercase small fw-bold">Tên dịch vụ</th>
                      <th class="text-center text-dark text-uppercase small fw-bold">SL</th>
                      <th class="text-end text-dark text-uppercase small fw-bold">Đơn giá</th>
                      <th class="text-end pe-2 text-dark text-uppercase small fw-bold">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(sv, index) in selectedInvoice.dichVu" :key="'sv-'+index">
                      <td class="ps-2 text-dark align-middle fw-medium">{{ sv.tenDV }}</td>
                      <td class="text-center text-dark align-middle">{{ sv.soLuong }}</td>
                      <td class="text-end text-dark align-middle">{{ formatCurrency(sv.donGia) }}</td>
                      <td class="text-end pe-2 fw-bold text-dark align-middle">{{ formatCurrency(sv.thanhTien) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div v-if="(!selectedInvoice?.chiTietPhong?.length) && (!selectedInvoice?.dichVu?.length)" class="text-center py-4 bg-light rounded mt-3">
                 <p class="text-muted fst-italic mb-0">Không có thông tin chi tiết.</p>
              </div>

              <hr class="my-4 border-dashed">

              <div class="row justify-content-end">
                <div class="col-md-6">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted">Tổng tiền gốc:</span>
                    <span class="text-dark fw-bold">{{ formatCurrency(selectedInvoice?.tongTienGoc) }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2" v-if="selectedInvoice?.soTienGiam > 0">
                    <span class="text-danger">Giảm giá:</span>
                    <span class="text-danger fw-bold">- {{ formatCurrency(selectedInvoice?.soTienGiam) }}</span>
                  </div>
                  <div class="d-flex justify-content-between border-top border-dark pt-3 mt-2 align-items-center">
                    <span class="fw-bolder text-dark fs-5 text-uppercase">Thanh toán:</span>
                    <span class="fw-bolder text-primary fs-3 total-price">{{ formatCurrency(selectedInvoice?.tongTienPhaiTra) }}</span>
                  </div>
                </div>
              </div>

              <div class="text-center mt-5 pt-3 border-top">
                <p class="fw-bold text-dark mb-1">CẢM ƠN QUÝ KHÁCH!</p>
                <p class="text-muted fst-italic small">Hẹn gặp lại quý khách tại Luxury Hotel.</p>
              </div>

            </div>
          </div>

          <div class="modal-footer px-4 py-3 bg-white border-top d-flex justify-content-end gap-2 rounded-bottom">
            <button type="button" class="btn btn-label-secondary px-4 fw-bold rounded-pill" @click="closeModal">
                Đóng
            </button>
            <button type="button" class="btn btn-gradient-primary px-4 d-flex align-items-center shadow-md fw-bold rounded-pill" @click="printInvoice">
              <i class='bx bx-printer me-2'></i> In ngay
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const API_URL = import.meta.env.VITE_API_URL; 
const IMG_URL = `${API_URL}/images/NhanVien/`;

const invoices = ref([]); 
const isLoading = ref(true);
const searchQuery = ref('');
const filterDate = ref('');
const showModal = ref(false);
const selectedInvoice = ref(null);

const fetchInvoices = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${API_URL}/api/admin/HoaDon`);
    // Dữ liệu đã được map đúng từ Backend mới
    invoices.value = response.data;
  } catch (error) { console.error(error); } 
  finally { isLoading.value = false; }
};

onMounted(() => fetchInvoices());

const filteredInvoices = computed(() => {
  let result = invoices.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(i => (i.tenKhachHang && i.tenKhachHang.toLowerCase().includes(q)) || (i.maHD && i.maHD.toString().includes(q)));
  }
  if (filterDate.value) result = result.filter(i => i.ngayTao && i.ngayTao.startsWith(filterDate.value));
  return result;
});

// --- LOGIC MODAL & IN ---
const openInvoiceDetail = (invoice) => { selectedInvoice.value = invoice; showModal.value = true; };
const closeModal = () => { showModal.value = false; selectedInvoice.value = null; };
const printInvoice = () => { window.focus(); window.print(); };
const directPrint = async (invoice) => {
    selectedInvoice.value = invoice; showModal.value = true;
    await nextTick();
    setTimeout(() => { window.print(); }, 500);
};

// --- FORMATTERS ---
const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '';
const formatTime = (d) => d ? new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';
const getInitials = (name) => name ? name.split(' ').pop().charAt(0).toUpperCase() : '?';

// --- LOGIC ẢNH NHÂN VIÊN ---
const getFullImageUrl = (imgName) => {
  if (!imgName) return '';
  if (imgName.startsWith('http')) return imgName;
  return `${IMG_URL}${imgName}`;
};
const getDefaultAvatar = () => `${API_URL}/images/avtDefault.jpg`;

// --- LOGIC MÀU CHỨC VỤ (Đồng bộ trang Nhân sự) ---
const getRoleColorClass = (roleName) => {
    if (!roleName) return 'role-default';
    const r = roleName.toLowerCase();
    if (r.includes('quản lý')) return 'role-manager';
    if (r.includes('lễ tân')) return 'role-reception';
    if (r.includes('buồng phòng')) return 'role-housekeeping';
    if (r.includes('bảo vệ')) return 'role-security';
    return 'role-default';
};

const getStatusBadgeClass = (status) => {
    if (!status) return 'bg-label-secondary text-secondary';
    const s = status.toLowerCase(); 
    if (s.includes('dathanhtoan') || s.includes('hoàn thành') || s.includes('đã thanh toán')) return 'bg-label-success text-success';
    if (s.includes('cho') || s.includes('chờ')) return 'bg-label-warning text-warning';
    return 'bg-label-danger text-danger';
};

const formatStatusText = (status) => {
    if (!status) return 'Không xác định';
    const s = status.toLowerCase();
    if (s.includes('dathanhtoan')) return 'Đã thanh toán';
    if (s.includes('ChoXacNhan')) return 'Chờ thanh toán';
    return status;
};

const formatPaymentMethod = (type) => {
    if (!type) return 'Không xác định';
    const t = type.toLowerCase();
    if (t.includes('datcoc')) return 'Đặt cọc';
    if (t.includes('thanhtoan')) return 'Thanh toán';
    return type;
};

const getPaymentMethodClass = (type, isSolid = false) => {
    if (!type) return isSolid ? 'bg-secondary text-white' : 'bg-label-secondary text-secondary';
    const t = type.toLowerCase();
    if (t.includes('datcoc')) return isSolid ? 'bg-warning text-dark' : 'bg-label-warning text-warning';
    if (t.includes('thanhtoan')) return isSolid ? 'bg-success text-white' : 'bg-label-success text-success';
    return isSolid ? 'bg-info text-white' : 'bg-label-info text-info';
};

const exportToExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Hóa Đơn');
  worksheet.columns = [
    { header: 'Mã HĐ', key: 'maHD', width: 10 },
    { header: 'Khách hàng', key: 'tenKhachHang', width: 25 },
    { header: 'Tổng tiền', key: 'tongTienPhaiTra', width: 20 },
    { header: 'Trạng thái', key: 'trangThai', width: 15 }
  ];
  filteredInvoices.value.forEach(item => worksheet.addRow(item));
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `BaoCao_HoaDon.xlsx`);
};

// Thêm hàm này vào khu vực Logic lọc dữ liệu
const resetDate = () => {
    filterDate.value = '';
};

// Bạn cũng có thể tạo một hàm reset toàn bộ nếu muốn
const resetAllFilters = () => {
    filterDate.value = '';
    searchQuery.value = '';
};
</script>

<style scoped>
/* GENERIC */
.page-container { color: #566a7f; font-family: 'Public Sans', sans-serif; }
.card-custom { border-radius: 12px; }
.custom-input-group { border-radius: 8px; overflow: hidden; }

/* GRADIENT BUTTONS */
.btn-gradient-primary { background: linear-gradient(135deg, #696cff 0%, #4346e6 100%); color: white; border: none; transition: 0.3s; }
.btn-gradient-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(105, 108, 255, 0.4); color: white; }
.bg-gradient-primary { background: linear-gradient(135deg, #696cff 0%, #4346e6 100%); }
.btn-gradient-success { background: linear-gradient(135deg, #20bf6b 0%, #0fb9b1 100%); color: white; border: none; transition: 0.3s; }
.btn-gradient-success:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(32, 191, 107, 0.4); color: white; }

/* AVATAR & BADGES (Đồng bộ QuanLyNhanSu.vue) */
.avatar-wrapper { width: 38px; height: 38px; flex-shrink: 0; position: relative; }
.avatar-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.avatar-initial-circle { width: 100%; height: 100%; border-radius: 50%; background: #e7e7ff; color: #696cff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.85rem; }

.badge-custom { padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; text-transform: uppercase; width: fit-content; }
.role-manager { background-color: #e7e7ff; color: #696cff; }
.role-reception { background-color: #d7f5fc; color: #03c3ec; }
.role-housekeeping { background-color: #fff2d6; color: #ffab00; }
.role-security { background-color: #ebeef0; color: #8592a3; }
.role-default { background-color: #f5f5f9; color: #8592a3; }

/* SOFT BUTTONS */
.btn-soft-primary { background: rgba(105, 108, 255, 0.15); color: #696cff; border: none; border-radius: 50%; width: 38px; height: 38px; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
.btn-soft-primary:hover { background: #696cff; color: white; transform: scale(1.1); }
.btn-soft-dark { background: rgba(86, 106, 127, 0.15); color: #566a7f; border: none; border-radius: 50%; width: 38px; height: 38px; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
.btn-soft-dark:hover { background: #566a7f; color: white; transform: scale(1.1); }

/* STATUS BADGES */
.bg-light-gray { background-color: #f5f5f9; }
.bg-label-primary { background-color: #e7e7ff; color: #696cff; }
.bg-label-success { background-color: #e8fadf; } .text-success { color: #71dd37 !important; }
.bg-label-warning { background-color: #fff2d6; } .text-warning { color: #ffab00 !important; }
.bg-label-danger { background-color: #ffe0db; } .text-danger { color: #ff3e1d !important; }

/* MODAL & RESPONSIVE FIXES */
.modal-backdrop-custom {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(4px);
    display: flex; justify-content: center; align-items: flex-start; /* Fix kẹt khi màn hình nhỏ */
    overflow-y: auto; padding: 20px; z-index: 1050;
}
.modal-dialog-custom {
    width: 100%; max-width: 800px; margin-top: auto; margin-bottom: auto;
    background: #fff; border-radius: 16px; animation: slideUp 0.3s ease;
    display: flex; flex-direction: column; overflow: hidden;
}
.modal-body-scroll { flex: 1; max-height: 75vh; overflow-y: auto; -webkit-overflow-scrolling: touch; }

/* TỜ HÓA ĐƠN */
.invoice-paper { background: #fff; padding: 40px; color: #333; width: 100%; box-sizing: border-box; }
.border-dashed { border-top: 2px dashed #d9dee3; }
.btn-close-custom { background: none; border: none; color: #aaa; transition: 0.2s; }
.btn-close-custom:hover { color: #ff3e1d; transform: rotate(90deg); }

@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 576px) {
    .invoice-paper { padding: 20px 15px; }
    .brand-title { font-size: 1.2rem !important; }
    .total-price { font-size: 1.5rem !important; }
}

/* Tối ưu bộ lọc ngày */
.date-filter-group {
    background-color: #fff;
    transition: all 0.2s ease;
}

.date-filter-group:focus-within {
    border-color: #696cff;
    box-shadow: 0 0 0 0.2rem rgba(105, 108, 255, 0.1) !important;
}

.btn-reset-date {
    background: transparent;
    color: #a1acb8;
    padding-left: 5px;
    padding-right: 10px;
    transition: 0.3s;
}

.btn-reset-date:hover {
    color: #ff3e1d; /* Chuyển sang màu đỏ khi hover để báo hiệu xóa */
    background: transparent;
    transform: rotate(-90deg); /* Hiệu ứng xoay nhẹ khi hover cho sinh động */
}

/* Đảm bảo ô date không hiện biểu tượng lịch mặc định quá to lấn át nút reset */
input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.6;
}
</style>

<style>
@media print {
    /* 1. Cấu hình lề giấy in */
    @page { 
        margin: 15mm; /* Tạo khoảng trống an toàn 4 cạnh giấy */
    }

    body { 
        margin: 0; 
        background: white !important; 
    }
    
    /* 2. ẨN TRIỆT ĐỂ: Header, Footer của Modal và các nút bấm */
    .sidebar, 
    .navbar, 
    .modal-header, 
    .modal-footer, 
    .modal-footer button, /* Ẩn cụ thể các button trong footer */
    .btn-close-custom, 
    .btn-icon, 
    .card-custom,
    .page-container > *:not(.modal-backdrop-custom) {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    /* 3. RESET KHUNG CHỨA: Loại bỏ các lớp nền xám và bóng đổ */
    .dashboard-layout, 
    .main-wrapper, 
    .content-wrapper, 
    .container-xxl, 
    .modal-backdrop-custom, 
    .modal-dialog-custom, 
    .modal-content {
        display: block !important; 
        margin: 0 !important; 
        padding: 0 !important;
        width: 100% !important; 
        height: auto !important; 
        background: white !important; 
        box-shadow: none !important; 
        border: none !important;
    }

    /* Cho phép nội dung hiển thị đầy đủ không bị cắt trang */
    .modal-body { 
        padding: 0 !important; 
    }
    
    .modal-body-scroll { 
        overflow: visible !important; 
        max-height: none !important; /* Bỏ giới hạn chiều cao khi in */
    }

    /* 4. TỜ HÓA ĐƠN: Căn chỉnh padding cho đẹp */
    #invoice-print-area {
        display: block !important;
        width: 100% !important; 
        max-width: 100% !important; 
        padding: 10mm 5mm !important; /* Thêm padding nội bộ để nội dung lùi vào trong */
        margin: 0 auto !important; 
        position: static !important;
        background: white !important;
    }

    /* Giữ nguyên màu sắc của các Badge/Text khi in */
    * { 
        -webkit-print-color-adjust: exact !important; 
        print-color-adjust: exact !important; 
    }
}
</style>