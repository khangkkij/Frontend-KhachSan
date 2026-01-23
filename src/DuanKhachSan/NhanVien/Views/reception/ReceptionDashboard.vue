<template>
  <div>
    <div class="row mb-4">
      
      <div class="col-md-6 col-lg-3 mb-4 mb-lg-0">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-2">
              <div class="avatar me-2">
                <span class="avatar-initial rounded bg-label-primary"><i class='bx bx-log-in'></i></span>
              </div>
              <h5 class="card-title mb-0">Check-in</h5>
            </div>
            <h3 class="mb-1">12</h3>
            <small class="text-muted">Khách đặt đến hôm nay</small>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3 mb-4 mb-lg-0">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-2">
              <div class="avatar me-2">
                <span class="avatar-initial rounded bg-label-danger"><i class='bx bx-log-out'></i></span>
              </div>
              <h5 class="card-title mb-0">Check-out</h5>
            </div>
            <h3 class="mb-1">5</h3>
            <small class="text-muted">Phòng cần trả hôm nay</small>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3 mb-4 mb-lg-0">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-2">
              <div class="avatar me-2">
                <span class="avatar-initial rounded bg-label-success"><i class='bx bx-home-smile'></i></span>
              </div>
              <h5 class="card-title mb-0">Đang ở</h5>
            </div>
            <h3 class="mb-1">18/30</h3>
            <small class="text-success fw-semibold"><i class='bx bx-up-arrow-alt'></i> 60% Công suất</small>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-2">
              <div class="avatar me-2">
                <span class="avatar-initial rounded bg-label-warning"><i class='bx bx-bell'></i></span>
              </div>
              <h5 class="card-title mb-0">Yêu cầu</h5>
            </div>
            <h3 class="mb-1">3</h3>
            <small class="text-danger">Cần xử lý ngay</small>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      
      <div class="col-md-8 mb-4">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Lịch trình hôm nay (24/01/2026)</h5>
            <ul class="nav nav-pills" role="tablist">
              <li class="nav-item">
                <button 
                  class="nav-link btn-sm" 
                  :class="{ active: currentTab === 'checkin' }"
                  @click="currentTab = 'checkin'"
                >
                  Sắp đến (12)
                </button>
              </li>
              <li class="nav-item">
                <button 
                  class="nav-link btn-sm" 
                  :class="{ active: currentTab === 'checkout' }"
                  @click="currentTab = 'checkout'"
                >
                  Sắp đi (5)
                </button>
              </li>
            </ul>
          </div>
          
          <div class="table-responsive text-nowrap">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Phòng</th>
                  <th>Khách hàng</th>
                  <th>Giờ</th>
                  <th>Trạng thái</th>
                  <th>Tác vụ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in activeList" :key="index">
                  <td><strong>{{ item.room }}</strong></td>
                  <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar avatar-xs me-2">
                            <span class="avatar-initial rounded-circle bg-label-secondary">{{ item.guest.charAt(0) }}</span>
                        </div>
                        {{ item.guest }}
                    </div>
                  </td>
                  <td><i class='bx bx-time-five me-1 text-muted'></i> {{ item.time }}</td>
                  <td>
                    <span class="badge" :class="item.statusColor">{{ item.status }}</span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-icon btn-outline-primary">
                        <i class='bx bx-dots-vertical-rounded'></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="activeList.length === 0" class="text-center py-4 text-muted">
                Không có dữ liệu.
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title m-0 me-2">Hoạt động gần đây</h5>
          </div>
          <div class="card-body">
            <ul class="p-0 m-0">
              
              <li class="d-flex mb-4 pb-1">
                <div class="avatar flex-shrink-0 me-3">
                  <span class="avatar-initial rounded bg-label-info"><i class='bx bx-broom'></i></span>
                </div>
                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                  <div class="me-2">
                    <h6 class="mb-0">Phòng 202 gọi dọn phòng</h6>
                    <small class="text-muted">5 phút trước</small>
                  </div>
                  <button class="btn btn-sm btn-outline-secondary">Nhận</button>
                </div>
              </li>

              <li class="d-flex mb-4 pb-1">
                <div class="avatar flex-shrink-0 me-3">
                  <span class="avatar-initial rounded bg-label-warning"><i class='bx bx-bowl-rice'></i></span>
                </div>
                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                  <div class="me-2">
                    <h6 class="mb-0">P.105 gọi 2 Mì bò</h6>
                    <small class="text-muted">12 phút trước</small>
                  </div>
                  <button class="btn btn-sm btn-primary">Xử lý</button>
                </div>
              </li>

              <li class="d-flex mb-4 pb-1">
                <div class="avatar flex-shrink-0 me-3">
                  <span class="avatar-initial rounded bg-label-danger"><i class='bx bx-error'></i></span>
                </div>
                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                  <div class="me-2">
                    <h6 class="mb-0">Khách P.301 quá giờ</h6>
                    <small class="text-muted">Check-out trễ 30p</small>
                  </div>
                </div>
              </li>

            </ul>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// --- State quản lý Tabs ---
const currentTab = ref('checkin'); // 'checkin' hoặc 'checkout'

// --- Mock Data ---
const checkInList = [
    { room: '101', guest: 'Nguyễn Văn A', time: '14:00', status: 'Đã cọc', statusColor: 'bg-label-success' },
    { room: '205', guest: 'Trần Thị B', time: '14:30', status: 'Chờ đến', statusColor: 'bg-label-warning' },
    { room: 'VIP1', guest: 'Lê C', time: '15:00', status: 'Chờ đến', statusColor: 'bg-label-warning' },
    { room: '304', guest: 'Phạm D', time: '16:00', status: 'Chờ đến', statusColor: 'bg-label-warning' },
];

const checkOutList = [
    { room: '102', guest: 'Hoàng E', time: '11:30', status: 'Đang chuẩn bị', statusColor: 'bg-label-info' },
    { room: '401', guest: 'Võ F', time: '12:00', status: 'Quá giờ', statusColor: 'bg-label-danger' },
];

// --- Computed ---
const activeList = computed(() => {
    return currentTab.value === 'checkin' ? checkInList : checkOutList;
});

</script>

<style scoped>
/* ==============================================
   1. UTILITIES & COLORS (Màu sắc chuẩn Sneat)
   ============================================== */
:root {
  --bs-primary: #696cff;
  --bs-secondary: #8592a3;
  --bs-success: #71dd37;
  --bs-info: #03c3ec;
  --bs-warning: #ffab00;
  --bs-danger: #ff3e1d;
}

/* Text colors */
.text-primary { color: #696cff !important; }
.text-secondary { color: #8592a3 !important; }
.text-success { color: #71dd37 !important; }
.text-danger { color: #ff3e1d !important; }
.text-warning { color: #ffab00 !important; }
.text-info { color: #03c3ec !important; }
.text-muted { color: #a1acb8 !important; }

/* BG Label (Màu nền nhạt pastel đặc trưng của Sneat) */
.bg-label-primary { background-color: #e7e7ff !important; color: #696cff !important; }
.bg-label-secondary { background-color: #ebeef0 !important; color: #8592a3 !important; }
.bg-label-success { background-color: #e8fadf !important; color: #71dd37 !important; }
.bg-label-danger { background-color: #ffe0db !important; color: #ff3e1d !important; }
.bg-label-warning { background-color: #fff2d6 !important; color: #ffab00 !important; }
.bg-label-info { background-color: #d7f5fc !important; color: #03c3ec !important; }

/* ==============================================
   2. CARDS & LAYOUT
   ============================================== */
.card {
  background-clip: padding-box;
  box-shadow: 0 2px 6px 0 rgba(67, 89, 113, 0.12); /* Đổ bóng nhẹ */
  border: none;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}

.card:hover {
  box-shadow: 0 8px 15px 0 rgba(67, 89, 113, 0.15); /* Hover nổi lên */
}

.card-header {
  background-color: transparent;
  border-bottom: none;
  padding: 1.5rem 1.5rem;
}

.card-body {
  padding: 1.5rem 1.5rem;
}

.card-title {
  color: #566a7f;
  font-weight: 600;
}

/* ==============================================
   3. AVATARS (Icon tròn)
   ============================================== */
.avatar {
  position: relative;
  width: 2.375rem;
  height: 2.375rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

.avatar-initial {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
}

.rounded {
  border-radius: 0.375rem !important;
}

.rounded-circle {
  border-radius: 50% !important;
}

.avatar-xs {
  width: 1.6rem;
  height: 1.6rem;
  font-size: 0.75rem;
}

/* ==============================================
   4. TABLE & LISTS
   ============================================== */
.table th {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 1px;
  font-weight: 600;
  color: #566a7f;
}

.table td {
  vertical-align: middle;
  color: #697a8d;
  font-size: 0.9375rem;
}

.table-hover tbody tr:hover {
  background-color: rgba(67, 89, 113, 0.04);
}

/* Badge trong bảng */
.badge {
  text-transform: uppercase;
  line-height: 0.75;
  padding: 0.4rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.75rem;
}

/* List group (Hoạt động gần đây) */
ul {
  list-style: none;
  padding-left: 0;
}

/* ==============================================
   5. NAVIGATION TABS
   ============================================== */
.nav-pills .nav-link {
  color: #566a7f;
  font-weight: 500;
  border-radius: 0.375rem;
  padding: 0.4375rem 1rem;
}

.nav-pills .nav-link.active {
  background-color: #696cff;
  color: #fff;
  box-shadow: 0 2px 4px 0 rgba(105, 108, 255, 0.4);
}

/* Nút bấm nhỏ */
.btn-icon {
    padding: 0.4rem;
    line-height: 0;
    border-radius: 0.375rem;
}
</style>