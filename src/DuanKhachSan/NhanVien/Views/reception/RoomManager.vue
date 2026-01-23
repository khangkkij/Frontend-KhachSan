<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold py-3 mb-0">Sơ đồ phòng (Live)</h4>
        <div>
            <span class="badge bg-label-success me-1">Trống: {{ countEmpty }}</span>
            <span class="badge bg-label-danger">Có khách: {{ countOccupied }}</span>
        </div>
    </div>

    <div class="row g-4">
      <div class="col-md-6 col-lg-3" v-for="room in rooms" :key="room.id">
        
        <div class="card h-100 room-card" :class="getBorderClass(room.trangThai)">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5 class="card-title mb-0">Phòng {{ room.soPhong }}</h5>
                        <small class="text-muted">{{ room.tenLoai }}</small>
                    </div>
                    <span class="badge" :class="getBadgeClass(room.trangThai)">
                        {{ getStatusText(room.trangThai) }}
                    </span>
                </div>

                <div style="min-height: 80px;">
                    <div v-if="room.trangThai === 0" class="text-center text-muted py-2">
                        <i class='bx bx-hotel fs-1 opacity-25'></i>
                        <p class="small mt-1">Sẵn sàng đón khách</p>
                    </div>

                    <div v-else-if="room.trangThai === 1">
                        <div class="d-flex align-items-center mb-1">
                            <i class='bx bx-user me-2 text-primary'></i>
                            <span class="fw-bold">{{ room.khach }}</span>
                        </div>
                        <div class="d-flex align-items-center mb-1">
                            <i class='bx bx-time-five me-2 text-warning'></i>
                            <small>{{ room.ngayNhan }}</small>
                        </div>
                    </div>

                     <div v-else-if="room.trangThai === 2" class="text-center text-warning py-2">
                        <i class='bx bx-broom fs-1 opacity-50'></i>
                        <p class="small mt-1">Đang dọn vệ sinh...</p>
                    </div>
                </div>

                <div class="mt-3 d-grid gap-2">
                    <button v-if="room.trangThai === 0" class="btn btn-primary btn-sm" @click="openAction(room, 'CHECK_IN')">
                        <i class='bx bx-plus me-1'></i> Check-in
                    </button>

                    <div v-if="room.trangThai === 1" class="btn-group">
                        <button class="btn btn-outline-primary btn-sm" @click="openAction(room, 'SERVICE')">
                             Dịch vụ
                        </button>
                        <button class="btn btn-outline-danger btn-sm" @click="openAction(room, 'CHECK_OUT')">
                             Trả phòng
                        </button>
                    </div>

                    <button v-if="room.trangThai === 2" class="btn btn-outline-secondary btn-sm" @click="handleClean(room)">
                        <i class='bx bx-check me-1'></i> Xong
                    </button>
                </div>
            </div>
        </div>
        </div>
    </div>

    <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered" :class="modalSizeClass">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
                <i :class="currentIcon" class="me-2"></i> {{ modalTitle }} - P.{{ selectedRoom?.soPhong }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            
            <div v-if="currentAction === 'CHECK_IN'">
                <label class="form-label">Tên khách hàng</label>
                <input v-model="formData.tenKhach" class="form-control mb-3" placeholder="Nhập tên khách...">
                <label class="form-label">CCCD</label>
                <input v-model="formData.cccd" class="form-control" placeholder="Số CMND/CCCD">
            </div>

            <div v-else-if="currentAction === 'CHECK_OUT'">
                <div class="alert alert-warning">Xác nhận thanh toán và trả phòng?</div>
                <table class="table table-bordered mb-0">
                    <tr><td>Tiền phòng</td><td class="text-end fw-bold">500.000 đ</td></tr>
                    <tr><td>Dịch vụ</td><td class="text-end fw-bold">120.000 đ</td></tr>
                    <tr class="table-active text-danger"><td>TỔNG</td><td class="text-end fw-bold">620.000 đ</td></tr>
                </table>
            </div>

            <div v-else-if="currentAction === 'SERVICE'">
                <p>Chọn món:</p>
                <button class="btn btn-outline-primary me-2">Nước suối (10k)</button>
                <button class="btn btn-outline-primary">Mì gói (15k)</button>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-label-secondary" @click="closeModal">Hủy</button>
            <button type="button" class="btn" :class="confirmBtnClass" @click="handleConfirm">{{ confirmBtnText }}</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';

// --- 1. DỮ LIỆU ---
const rooms = ref([
    { id: 1, soPhong: '101', tenLoai: 'Standard', trangThai: 0, khach: '' },
    { id: 2, soPhong: '102', tenLoai: 'Deluxe', trangThai: 1, khach: 'Nguyễn Văn A', ngayNhan: '14:00 20/11' },
    { id: 3, soPhong: '103', tenLoai: 'VIP', trangThai: 2, khach: '' },
    { id: 4, soPhong: '104', tenLoai: 'Standard', trangThai: 0, khach: '' },
    { id: 5, soPhong: '201', tenLoai: 'Family', trangThai: 1, khach: 'Trần Thị B', ngayNhan: '08:30 21/11' },
]);

// --- 2. HÀM UI (Màu sắc, Text) ---
// Vì bỏ Component con nên phải đưa các hàm xử lý giao diện về đây
const getBadgeClass = (status) => {
    if (status === 0) return 'bg-label-success';
    if (status === 1) return 'bg-label-danger';
    return 'bg-label-secondary';
};

const getBorderClass = (status) => {
    if (status === 0) return 'border-success';
    if (status === 1) return 'border-danger';
    return 'border-secondary';
};

const getStatusText = (status) => {
    if (status === 0) return 'Trống';
    if (status === 1) return 'Có khách';
    return 'Đang dọn';
};

// --- 3. LOGIC MODAL ---
const showModal = ref(false);
const currentAction = ref(''); 
const selectedRoom = ref(null);
const formData = reactive({ tenKhach: '', cccd: '' });

// Computed hiển thị tiêu đề/nút bấm
const modalTitle = computed(() => {
    if(currentAction.value === 'CHECK_IN') return 'Nhận phòng';
    if(currentAction.value === 'CHECK_OUT') return 'Thanh toán';
    return 'Dịch vụ';
});

const currentIcon = computed(() => {
    if(currentAction.value === 'CHECK_IN') return 'bx bx-user-plus';
    if(currentAction.value === 'CHECK_OUT') return 'bx bx-receipt';
    return 'bx bx-food-menu';
});

const confirmBtnText = computed(() => {
    if(currentAction.value === 'CHECK_IN') return 'Xác nhận Check-in';
    if(currentAction.value === 'CHECK_OUT') return 'Thanh toán & Trả';
    return 'Thêm vào đơn';
});

const confirmBtnClass = computed(() => currentAction.value === 'CHECK_OUT' ? 'btn-danger' : 'btn-primary');
const modalSizeClass = computed(() => currentAction.value === 'CHECK_OUT' ? '' : 'modal-sm');

// Thống kê nhanh trên Toolbar
const countEmpty = computed(() => rooms.value.filter(r => r.trangThai === 0).length);
const countOccupied = computed(() => rooms.value.filter(r => r.trangThai === 1).length);

// --- 4. HÀNH ĐỘNG (Actions) ---
const openAction = (room, action) => {
    selectedRoom.value = room;
    currentAction.value = action;
    formData.tenKhach = ''; // Reset form
    formData.cccd = '';
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedRoom.value = null;
};

const handleClean = (room) => {
    // Xử lý dọn xong ngay lập tức
    room.trangThai = 0; 
};

const handleConfirm = () => {
    if (currentAction.value === 'CHECK_IN') {
        selectedRoom.value.trangThai = 1;
        selectedRoom.value.khach = formData.tenKhach;
        selectedRoom.value.ngayNhan = new Date().getHours() + ':' + new Date().getMinutes();
    } else if (currentAction.value === 'CHECK_OUT') {
        selectedRoom.value.trangThai = 2; // Chuyển sang dọn
        selectedRoom.value.khach = '';
    }
    closeModal();
};
</script>

<style scoped>
/* CSS tạo border màu trên đầu card */
.room-card {
    border-top: 4px solid transparent;
    transition: transform 0.2s;
    box-shadow: 0 2px 6px 0 rgba(67, 89, 113, 0.12);
}
.room-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px 0 rgba(67, 89, 113, 0.15);
}
.border-success { border-color: #71dd37 !important; }
.border-danger { border-color: #ff3e1d !important; }
.border-secondary { border-color: #8592a3 !important; }
</style>