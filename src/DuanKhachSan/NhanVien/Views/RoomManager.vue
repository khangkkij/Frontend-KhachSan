<template>
  <div class="room-manager">
    <div class="toolbar">
      <h4 class="page-title">Sơ đồ phòng</h4>
      <div class="filters">
        <span class="badge bg-label-success">Trống: {{ countEmpty }}</span>
        <span class="badge bg-label-danger">Có khách: {{ countOccupied }}</span>
      </div>
    </div>

    <div class="room-grid">
      <div class="card room-card" v-for="room in rooms" :key="room.id" :class="getStatusBorder(room.status)">
        <div class="card-body">
          <div class="room-header">
            <div>
              <h5 class="room-number">P.{{ room.number }}</h5>
              <small class="text-muted">{{ room.type }}</small>
            </div>
            <span class="badge" :class="getStatusBadge(room.status)">{{ getStatusText(room.status) }}</span>
          </div>

          <div class="room-content">
            <div v-if="room.status === 0" class="empty-state">
              <i class='bx bx-hotel'></i>
              <span>Sẵn sàng</span>
            </div>
            <div v-else-if="room.status === 1">
              <div class="guest-info"><i class='bx bx-user'></i> {{ room.guest }}</div>
              <div class="time-info"><i class='bx bx-time'></i> {{ room.checkInTime }}</div>
            </div>
            <div v-else class="dirty-state">
              <i class='bx bx-broom'></i> Đang dọn...
            </div>
          </div>

          <div class="room-actions">
            <button v-if="room.status === 0" class="btn btn-primary w-100" @click="openModal(room, 'checkin')">Nhận phòng</button>
            
            <div v-if="room.status === 1" class="d-flex gap-2">
              <button class="btn btn-outline-primary flex-1" @click="openModal(room, 'service')">Dịch vụ</button>
              <button class="btn btn-outline-danger flex-1" @click="openModal(room, 'checkout')">Trả phòng</button>
            </div>
            
            <button v-if="room.status === 2" class="btn btn-secondary w-100" @click="cleanRoom(room)">Xong</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">
          <h5>{{ modalTitle }} - P.{{ selectedRoom?.number }}</h5>
          <button @click="showModal = false" class="btn-close"><i class='bx bx-x'></i></button>
        </div>
        
        <div class="modal-body">
          <div v-if="modalAction === 'checkin'">
            <label>Tên khách hàng</label>
            <input type="text" class="form-control" placeholder="Nhập tên khách...">
            <label class="mt-2">CMND/CCCD</label>
            <input type="text" class="form-control">
          </div>

          <div v-if="modalAction === 'service'">
             <p>Chọn món thêm vào phòng:</p>
             <div class="service-select">
                <div class="service-item"><span>Nước suối</span> <button class="btn-xs">+</button></div>
                <div class="service-item"><span>Mì bò</span> <button class="btn-xs">+</button></div>
             </div>
          </div>

          <div v-if="modalAction === 'checkout'">
            <div class="bill-summary">
              <div class="bill-row"><span>Tiền phòng:</span> <strong>500.000đ</strong></div>
              <div class="bill-row"><span>Dịch vụ:</span> <strong>120.000đ</strong></div>
              <div class="bill-total"><span>Tổng cộng:</span> <strong class="text-danger">620.000đ</strong></div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showModal = false">Hủy</button>
          <button class="btn btn-primary" @click="handleConfirm">Xác nhận</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const rooms = ref([
  { id: 1, number: '101', type: 'Đơn', status: 0 },
  { id: 2, number: '102', type: 'Đôi', status: 1, guest: 'Nguyễn Văn A', checkInTime: '14:00' },
  { id: 3, number: '103', type: 'VIP', status: 2 },
  { id: 4, number: '104', type: 'Đơn', status: 0 },
]);

const showModal = ref(false);
const selectedRoom = ref(null);
const modalAction = ref('');

const countEmpty = computed(() => rooms.value.filter(r => r.status === 0).length);
const countOccupied = computed(() => rooms.value.filter(r => r.status === 1).length);

const getStatusBadge = (s) => s === 0 ? 'bg-label-success' : (s === 1 ? 'bg-label-danger' : 'bg-label-secondary');
const getStatusBorder = (s) => s === 0 ? 'border-success' : (s === 1 ? 'border-danger' : 'border-secondary');
const getStatusText = (s) => s === 0 ? 'Trống' : (s === 1 ? 'Có khách' : 'Đang dọn');

const openModal = (room, action) => {
  selectedRoom.value = room;
  modalAction.value = action;
  showModal.value = true;
};

const modalTitle = computed(() => {
  if (modalAction.value === 'checkin') return 'Nhận phòng';
  if (modalAction.value === 'checkout') return 'Thanh toán';
  return 'Thêm dịch vụ';
});

const handleConfirm = () => {
  // Logic cập nhật state giả lập
  if (modalAction.value === 'checkin') {
    selectedRoom.value.status = 1;
    selectedRoom.value.guest = 'Khách Mới';
  } else if (modalAction.value === 'checkout') {
    selectedRoom.value.status = 2;
  }
  showModal.value = false;
};

const cleanRoom = (room) => room.status = 0;
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.page-title { margin: 0; color: #566a7f; }
.room-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; }

.room-card { background: #fff; border-radius: 0.75rem; box-shadow: 0 2px 6px rgba(67,89,113,0.12); padding: 1.5rem; border-top: 4px solid transparent; transition: transform 0.2s; }
.room-card:hover { transform: translateY(-3px); box-shadow: 0 8px 15px rgba(67,89,113,0.15); }
.border-success { border-color: #71dd37; }
.border-danger { border-color: #ff3e1d; }
.border-secondary { border-color: #8592a3; }

.room-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
.room-number { margin: 0; color: #566a7f; }
.badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
.bg-label-success { background: #e8fadf; color: #71dd37; }
.bg-label-danger { background: #ffe0db; color: #ff3e1d; }
.bg-label-secondary { background: #ebeef0; color: #8592a3; }

.room-content { min-height: 60px; color: #697a8d; font-size: 0.9rem; margin-bottom: 1rem; }
.empty-state, .dirty-state { display: flex; flex-direction: column; align-items: center; color: #a1acb8; gap: 5px; }
.guest-info, .time-info { display: flex; align-items: center; gap: 5px; margin-bottom: 4px; }

.btn { padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; font-weight: 500; }
.btn-primary { background: #696cff; color: #fff; }
.btn-secondary { background: #8592a3; color: #fff; }
.btn-outline-primary { border: 1px solid #696cff; color: #696cff; background: #fff; }
.btn-outline-danger { border: 1px solid #ff3e1d; color: #ff3e1d; background: #fff; }
.w-100 { width: 100%; }
.d-flex { display: flex; }
.gap-2 { gap: 0.5rem; }
.flex-1 { flex: 1; }

/* Modal Styles */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.modal-card { background: #fff; width: 400px; border-radius: 0.75rem; overflow: hidden; }
.modal-header { padding: 1rem; background: #f5f5f9; display: flex; justify-content: space-between; align-items: center; font-weight: 600; }
.modal-body { padding: 1.5rem; }
.modal-footer { padding: 1rem; background: #f5f5f9; display: flex; justify-content: flex-end; gap: 10px; }
.form-control { width: 100%; padding: 8px; border: 1px solid #d9dee3; border-radius: 6px; margin-top: 5px; box-sizing: border-box; }
.btn-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; }
.service-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #d9dee3; }
.bill-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
.bill-total { display: flex; justify-content: space-between; margin-top: 10px; border-top: 1px solid #d9dee3; padding-top: 10px; font-size: 1.1rem; }
.text-danger { color: #ff3e1d; }
</style>