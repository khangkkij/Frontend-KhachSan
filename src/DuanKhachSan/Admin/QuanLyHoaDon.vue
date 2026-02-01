<template>
  <div class="page-container">

    <div class="card card-custom mb-4">
      <div class="card-body d-flex justify-content-between align-items-center row gap-3 gap-md-0">
        <div class="col-md-4">
          <h5 class="card-title fw-bold text-primary mb-0">
            <i class='bx bx-receipt me-2'></i>Quản lý Hóa đơn
          </h5>
        </div>
        <div class="col-md-8">
          <div class="d-flex align-items-center justify-content-md-end gap-3">

            <input type="date" class="form-control" style="max-width: 160px;" />

            <div class="input-group input-group-custom flex-grow-1" style="max-width: 300px;">
              <span class="input-group-text"><i class="bx bx-search"></i></span>
              <input type="text" class="form-control" placeholder="Tìm tên khách, mã HĐ..." v-model="searchQuery" />
            </div>

            <button class="btn btn-primary btn-add-new shadow-sm" @click="exportToExcel">
              <i class="bx bx-export me-1"></i> Xuất báo cáo
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card card-custom">
      <div class="table-responsive text-nowrap">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th class="ps-4">Mã HĐ</th>
              <th>Khách hàng</th>
              <th>Ngày lập</th>
              <th>Người lập</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th class="text-center">Tác vụ</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="invoice in filteredInvoices" :key="invoice.maHD">

              <td class="ps-4">
                <span class="fw-bold text-primary">#{{ invoice.maHD }}</span>
              </td>

              <td>
                <div class="d-flex flex-column">
                  <span class="fw-semibold text-heading">{{ invoice.tenKhachHang }}</span>
                  <small class="text-muted"><i class='bx bx-phone me-1'></i>{{ invoice.sdt }}</small>
                </div>
              </td>

              <td>
                <span class="text-muted">{{ formatDate(invoice.ngayTao) }}</span>
                <br>
                <small class="text-muted fst-italic">{{ formatTime(invoice.ngayTao) }}</small>
              </td>

              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar-xs me-2">
                    <span class="avatar-initial rounded-circle bg-label-primary">{{ getInitials(invoice.tenNhanVien)
                      }}</span>
                  </div>
                  <span>{{ invoice.tenNhanVien }}</span>
                </div>
              </td>

              <td>
                <span class="fw-bold text-success">{{ formatCurrency(invoice.tongTienPhaiTra) }}</span>
              </td>

              <td>
                <span class="badge-status" :class="getStatusClass(invoice.trangThai)">
                  <span class="dot"></span> {{ invoice.trangThai }}
                </span>
              </td>

              <td class="text-center">
                <button class="btn-icon btn-view me-2" @click="openInvoiceDetail(invoice)" title="Xem chi tiết">
                  <i class="bx bx-show"></i>
                </button>

                <button class="btn-icon btn-print" title="In hóa đơn" @click="directPrint(invoice)">
                  <i class="bx bx-printer"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop-custom" @click.self="closeModal">
      <div class="modal-dialog-custom modal-lg">
        <div class="modal-content">

          <div class="modal-header d-flex justify-content-between align-items-center border-bottom px-4 py-3">
            <h5 class="modal-title fw-bold text-primary">
              <i class='bx bx-file-blank me-2'></i>Chi tiết hóa đơn
            </h5>
            <button type="button" class="btn-close-custom" @click="closeModal">
              <i class='bx bx-x'></i>
            </button>
          </div>

          <div class="modal-body bg-body-tertiary p-4">

            <div id="invoice-print-area" class="invoice-paper shadow-sm">

              <div class="d-flex justify-content-between mb-4">
                <div>
                  <h4 class="fw-bold text-dark text-uppercase mb-1">LUXURY HOTEL</h4>
                  <p class="text-muted small mb-0">123 Đường Biển, TP. Đà Nẵng</p>
                  <p class="text-muted small mb-0">Hotline: 0905 123 456</p>
                </div>
                <div class="text-end">
                  <h5 class="fw-bold text-primary mb-1">HÓA ĐƠN THANH TOÁN</h5>
                  <p class="mb-0">Mã HĐ: <span class="fw-bold text-dark">#{{ selectedInvoice?.maHD }}</span></p>
                  <p class="mb-0 small text-muted">{{ formatDate(selectedInvoice?.ngayTao) }}</p>
                </div>
              </div>

              <hr class="border-dashed my-3">

              <div class="row mb-4">
                <div class="col-sm-6">
                  <h6 class="fw-bold text-secondary text-uppercase small mb-2">Khách hàng</h6>
                  <p class="fw-bold text-dark mb-1">{{ selectedInvoice?.tenKhachHang }}</p>
                  <p class="text-muted small mb-0">{{ selectedInvoice?.sdt || 'Không có SĐT' }}</p>
                </div>
                <div class="col-sm-6 text-sm-end">
                  <h6 class="fw-bold text-secondary text-uppercase small mb-2">Thu ngân</h6>
                  <p class="mb-1">{{ selectedInvoice?.tenNhanVien }}</p>
                </div>
              </div>

              <div class="mb-4" v-if="selectedInvoice?.chiTietPhong">
                <h6 class="fw-bold text-primary small border-bottom pb-2 mb-3">CHI TIẾT PHÒNG</h6>
                <table class="table table-borderless table-sm mb-0">
                  <thead class="text-secondary small text-uppercase">
                    <tr>
                      <th>Phòng</th>
                      <th>Loại</th>
                      <th class="text-center">Đêm</th>
                      <th class="text-end">Đơn giá</th>
                      <th class="text-end">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(room, index) in selectedInvoice.chiTietPhong" :key="index">
                      <td class="fw-bold">{{ room.soPhong }}</td>
                      <td class="small text-muted">{{ room.loaiPhong }}</td>
                      <td class="text-center">{{ room.soDem }}</td>
                      <td class="text-end">{{ formatCurrency(room.donGia) }}</td>
                      <td class="text-end fw-medium">{{ formatCurrency(room.thanhTien) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="mb-4" v-if="selectedInvoice?.dichVu && selectedInvoice.dichVu.length > 0">
                <h6 class="fw-bold text-primary small border-bottom pb-2 mb-3">DỊCH VỤ SỬ DỤNG</h6>
                <table class="table table-borderless table-sm mb-0">
                  <thead class="text-secondary small text-uppercase">
                    <tr>
                      <th>Tên dịch vụ</th>
                      <th class="text-center">SL</th>
                      <th class="text-end">Đơn giá</th>
                      <th class="text-end">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(sv, index) in selectedInvoice.dichVu" :key="index">
                      <td>{{ sv.tenDV }}</td>
                      <td class="text-center">{{ sv.soLuong }}</td>
                      <td class="text-end">{{ formatCurrency(sv.donGia) }}</td>
                      <td class="text-end fw-medium">{{ formatCurrency(sv.thanhTien) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <hr class="my-3">

              <div class="row justify-content-end">
                <div class="col-md-5">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted">Tổng tiền gốc:</span>
                    <span class="fw-medium">{{ formatCurrency(selectedInvoice?.tongTienGoc) }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2 text-danger" v-if="selectedInvoice?.soTienGiam > 0">
                    <span>Voucher / Giảm giá:</span>
                    <span>- {{ formatCurrency(selectedInvoice?.soTienGiam) }}</span>
                  </div>
                  <div class="d-flex justify-content-between border-top pt-2 mt-2">
                    <span class="fw-bold text-dark fs-5">TỔNG THANH TOÁN:</span>
                    <span class="fw-bold text-primary fs-5">{{ formatCurrency(selectedInvoice?.tongTienPhaiTra)
                      }}</span>
                  </div>
                </div>
              </div>

              <div class="text-center mt-5 pt-4">
                <p class="text-muted fst-italic small mb-0">Cảm ơn quý khách đã sử dụng dịch vụ!</p>
              </div>

            </div>
          </div>

          <div class="modal-footer px-4 py-3 bg-light border-top">
            <button type="button" class="btn btn-label-secondary" @click="closeModal">Đóng</button>
            <button type="button" class="btn btn-primary" @click="printInvoice">
              <i class='bx bx-printer me-1'></i> In hóa đơn
            </button>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed,nextTick } from 'vue';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// --- MOCK DATA ---
const invoiceList = ref([
  {
    maHD: 'HD00015',
    tenKhachHang: 'Phạm Minh Anh',
    sdt: '0987654321',
    ngayTao: '2024-06-03T10:30:00',
    tenNhanVien: 'Lê Thị Lễ Tân',
    tongTienPhaiTra: 1350000,
    trangThai: 'Hoàn thành'
  },
  {
    maHD: 'HD00016',
    tenKhachHang: 'Trần Văn Bình',
    sdt: '0912345678',
    ngayTao: '2024-06-03T11:15:00',
    tenNhanVien: 'Nguyễn Văn Quản Lý',
    tongTienPhaiTra: 5200000,
    trangThai: 'Chờ thanh toán'
  },
  {
    maHD: 'HD00014',
    tenKhachHang: 'John Doe',
    sdt: '0123999888',
    ngayTao: '2024-06-02T14:20:00',
    tenNhanVien: 'Lê Thị Lễ Tân',
    tongTienPhaiTra: 850000,
    trangThai: 'Đã hủy'
  }
]);

const searchQuery = ref('');
const showModal = ref(false);
const selectedInvoice = ref(null);

// --- LOGIC ---
const filteredInvoices = computed(() => {
  if (!searchQuery.value) return invoiceList.value;
  const q = searchQuery.value.toLowerCase();
  return invoiceList.value.filter(i =>
    i.tenKhachHang.toLowerCase().includes(q) ||
    i.maHD.toLowerCase().includes(q)
  );
});

// --- OPEN MODAL & LOAD DETAIL ---
const openInvoiceDetail = (invoiceMeta) => {
  // Giả lập dữ liệu chi tiết
  selectedInvoice.value = {
    ...invoiceMeta,
    tongTienGoc: invoiceMeta.tongTienPhaiTra + 150000, // Giả lập tiền gốc cao hơn
    soTienGiam: 150000,
    chiTietPhong: [
      { soPhong: '401', loaiPhong: 'Executive Suite', soDem: 2, donGia: 2500000, thanhTien: 5000000 }
    ],
    dichVu: [
      { tenDV: 'Giặt ủi', soLuong: 2, donGia: 50000, thanhTien: 100000 },
      { tenDV: 'Minibar', soLuong: 3, donGia: 15000, thanhTien: 45000 }
    ]
  };

  // Tính toán lại cho khớp (Logic Frontend tạm thời)
  const totalRoom = selectedInvoice.value.chiTietPhong.reduce((sum, i) => sum + i.thanhTien, 0);
  const totalService = selectedInvoice.value.dichVu.reduce((sum, i) => sum + i.thanhTien, 0);
  selectedInvoice.value.tongTienGoc = totalRoom + totalService;
  selectedInvoice.value.tongTienPhaiTra = selectedInvoice.value.tongTienGoc - selectedInvoice.value.soTienGiam;

  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedInvoice.value = null;
};

const printInvoice = () => {
  window.print();
};

// --- FORMATTERS ---
const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '';
const formatTime = (d) => d ? new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';
const getInitials = (name) => name ? name.split(' ').pop()[0].toUpperCase() : '?';

const getStatusClass = (status) => {
  if (status === 'Hoàn thành') return 'status-paid';
  if (status === 'Chờ thanh toán') return 'status-pending';
  return 'status-cancelled';
};

const exportToExcel = async () => {
  // A. Khởi tạo Workbook và Worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Danh sách hóa đơn');

  // B. Định nghĩa Cột (Header & Độ rộng)
  worksheet.columns = [
    { header: 'Mã HĐ', key: 'maHD', width: 15 },
    { header: 'Khách hàng', key: 'tenKhachHang', width: 25 },
    { header: 'SĐT', key: 'sdt', width: 15 },
    { header: 'Ngày lập', key: 'ngayTao', width: 20 },
    { header: 'Người lập', key: 'tenNhanVien', width: 25 },
    { header: 'Tổng tiền', key: 'tongTienPhaiTra', width: 20 },
    { header: 'Trạng thái', key: 'trangThai', width: 20 }
  ];

  // C. Thêm dữ liệu (Rows)
  filteredInvoices.value.forEach(item => {
    worksheet.addRow({
      maHD: item.maHD,
      tenKhachHang: item.tenKhachHang,
      sdt: item.sdt,
      ngayTao: formatDate(item.ngayTao),
      tenNhanVien: item.tenNhanVien,
      tongTienPhaiTra: item.tongTienPhaiTra, // Để số thô để Excel tính toán được
      trangThai: item.trangThai
    });
  });

  // D. TRANG TRÍ (Styling) - Điểm mạnh của ExcelJS
  // 1. Làm đẹp dòng tiêu đề (Header)
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }; // Chữ trắng, đậm
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF696CFF' } // Màu nền tím (theo brand color của bạn)
  };

  // 2. Format cột Tiền tệ (Cột F - index 6)
  worksheet.getColumn(6).numFmt = '#,##0 "₫"'; // Format dạng tiền Việt Nam

  // 3. Căn giữa cột Mã HĐ và Ngày lập
  worksheet.getColumn(1).alignment = { horizontal: 'center' };
  worksheet.getColumn(4).alignment = { horizontal: 'center' };

  // E. Xuất file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Lưu file với tên có ngày tháng
  saveAs(blob, `BaoCao_HoaDon_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

const directPrint = async (invoice) => {
    // 1. Mở modal và nạp dữ liệu (Tái sử dụng hàm cũ)
    openInvoiceDetail(invoice);

    // 2. Đợi Vue vẽ xong HTML của tờ hóa đơn
    await nextTick();

    // 3. Gọi lệnh in ngay lập tức
    window.print();
    
    // Lưu ý: Sau khi in xong (hoặc hủy), Modal vẫn sẽ mở để người dùng thấy lại hóa đơn.
    // Đây là hành vi tốt để họ kiểm tra lại nội dung vừa in.
    closeModal();
};
</script>

<style scoped>
/* =========================================
   STYLE CHUNG & CARD
   ========================================= */
:root {
  --primary: #696cff;
}

.page-container {
  color: #566a7f;
  font-family: 'Public Sans', sans-serif;
}

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

/* BUTTONS */
.btn-add-new {
  background-color: #696cff;
  border-color: #696cff;
  color: #fff;
  box-shadow: 0 0.125rem 0.25rem 0 rgba(105, 108, 255, 0.4);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
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

.btn-view {
  background: #e7e7ff;
  color: #696cff;
}

.btn-print {
  background: #d7f5fc;
  color: #03c3ec;
}

/* TABLE */
.table thead th {
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 600;
  color: #566a7f;
  background-color: #f9fafb;
  border-bottom: 1px solid #d9dee3;
}

.avatar-xs {
  width: 24px;
  height: 24px;
  display: inline-block;
}

.avatar-initial {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #696cff;
  background-color: #e7e7ff;
  font-weight: 600;
  font-size: 10px;
}

/* BADGES */
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

.status-paid {
  color: #71dd37;
}

.status-paid .dot {
  background-color: #71dd37;
  box-shadow: 0 0 0 2px rgba(113, 221, 55, 0.2);
}

.status-pending {
  color: #ffab00;
}

.status-pending .dot {
  background-color: #ffab00;
  box-shadow: 0 0 0 2px rgba(255, 171, 0, 0.2);
}

.status-cancelled {
  color: #ff3e1d;
}

.status-cancelled .dot {
  background-color: #ff3e1d;
  box-shadow: 0 0 0 2px rgba(255, 62, 29, 0.2);
}

/* =========================================
   MODAL CSS (Đã sửa lỗi hiển thị)
   ========================================= */
.modal-backdrop-custom {
  position: fixed;
  /* BẮT BUỘC: Để modal luôn phủ toàn màn hình */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(67, 89, 113, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  /* Z-index cao để đè lên mọi thứ */
}

.modal-dialog-custom {
  background: #fff;
  width: 95%;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  max-height: 90vh;
  /* Giới hạn chiều cao */
  overflow-y: auto;
  /* Cho phép cuộn nếu dài */
}

.modal-lg {
  max-width: 800px;
}

.modal-body {
  padding: 1.5rem;
}

.bg-body-tertiary {
  background-color: #f5f5f9 !important;
}

/* INVOICE PAPER */
.invoice-paper {
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 0.25rem 1rem rgba(161, 172, 184, 0.4);
}

.border-dashed {
  border-top: 1px dashed #d9dee3;
  opacity: 1;
}

.btn-close-custom {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #a1acb8;
  cursor: pointer;
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

/* PRINT MODE */
/* =========================================
   FIX LỖI IN ẤN (PRINT CSS)
   ========================================= */
@media print {

  /* 1. Ẩn tất cả mọi thứ trong body */
  body * {
    visibility: hidden;
  }

  /* 2. Chỉ hiển thị vùng hóa đơn và nội dung bên trong nó */
  #invoice-print-area,
  #invoice-print-area * {
    visibility: visible;
  }

  /* 3. Định vị vùng hóa đơn chiếm trọn trang giấy */
  #invoice-print-area {
    position: fixed;
    /* Quan trọng: Đưa nó ra khỏi luồng trang web */
    left: 0;
    top: 0;
    width: 100vw;
    /* Chiều rộng bằng khổ giấy */
    height: 100vh;
    /* Chiều cao bằng khổ giấy */
    z-index: 9999;
    /* Đè lên tất cả */
    padding: 20px;
    /* Canh lề in */
    background: white;
    /* Nền trắng che các phần tử bên dưới */
    margin: 0;

    /* Bỏ border, shadow khi in cho giống giấy thật */
    border: none;
    box-shadow: none !important;
  }

  /* Ẩn các nút bấm, modal header/footer nếu lỡ dính vào */
  .modal-footer,
  .modal-header,
  .btn-close-custom {
    display: none !important;
  }
}
</style>