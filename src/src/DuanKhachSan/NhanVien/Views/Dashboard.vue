<template>
  <div class="staff-dashboard">
    <div class="stats-grid">
      <div class="card stat-card">
        <div class="stat-icon bg-label-primary"><i class='bx bx-log-in'></i></div>
        <div>
          <h4 class="stat-number">12</h4>
          <span class="stat-label">Check-in hôm nay</span>
        </div>
      </div>
      
      <div class="card stat-card">
        <div class="stat-icon bg-label-danger"><i class='bx bx-log-out'></i></div>
        <div>
          <h4 class="stat-number">5</h4>
          <span class="stat-label">Check-out hôm nay</span>
        </div>
      </div>

      <div class="card stat-card">
        <div class="stat-icon bg-label-success"><i class='bx bx-home-alt'></i></div>
        <div>
          <h4 class="stat-number">18/30</h4>
          <span class="stat-label text-success">60% Công suất</span>
        </div>
      </div>

      <div class="card stat-card">
        <div class="stat-icon bg-label-warning"><i class='bx bx-bell'></i></div>
        <div>
          <h4 class="stat-number">3</h4>
          <span class="stat-label text-danger">Yêu cầu cần xử lý</span>
        </div>
      </div>
    </div>

    <div class="content-grid">
      
      <div class="card main-card">
        <div class="card-header">
          <h5 class="card-title">Lịch trình hôm nay (24/01/2026)</h5>
          <div class="tabs">
            <button class="btn-tab active">Sắp đến (12)</button>
            <button class="btn-tab">Sắp đi (5)</button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table">
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
              <tr v-for="item in bookings" :key="item.id">
                <td class="fw-bold">{{ item.room }}</td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <div class="avatar-xs bg-label-secondary">{{ item.name.charAt(0) }}</div>
                    {{ item.name }}
                  </div>
                </td>
                <td>{{ item.time }}</td>
                <td><span class="badge" :class="item.statusClass">{{ item.status }}</span></td>
                <td><button class="btn-icon"><i class='bx bx-dots-vertical-rounded'></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card side-card">
        <div class="card-header">
          <h5 class="card-title">Hoạt động gần đây</h5>
        </div>
        <div class="activity-list">
          <div class="activity-item" v-for="act in activities" :key="act.id">
            <div class="act-content">
              <h6 class="act-title">{{ act.title }}</h6>
              <small class="act-time">{{ act.time }}</small>
            </div>
            <button class="btn btn-sm" :class="act.btnClass">{{ act.btnText }}</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const bookings = ref([
  { id: 1, room: '101', name: 'Nguyễn Văn A', time: '14:00', status: 'Đã cọc', statusClass: 'bg-label-success' },
  { id: 2, room: '205', name: 'Trần Thị B', time: '14:30', status: 'Chờ khách', statusClass: 'bg-label-warning' },
  { id: 3, room: 'VIP1', name: 'Lê C', time: '15:00', status: 'Chờ khách', statusClass: 'bg-label-warning' },
  { id: 4, room: '304', name: 'Phạm D', time: '16:00', status: 'Chờ khách', statusClass: 'bg-label-warning' },
]);

const activities = ref([
  { id: 1, title: 'Phòng 202 gọi dọn phòng', time: '5 phút trước', btnText: 'Nhận', btnClass: 'btn-outline-secondary' },
  { id: 2, title: 'P.105 gọi 2 Mì bò', time: '12 phút trước', btnText: 'Xử lý', btnClass: 'btn-primary' },
  { id: 3, title: 'Khách P.301 quá giờ', time: 'Check-out trễ 30p', btnText: 'Chi tiết', btnClass: 'btn-outline-danger' },
]);
</script>

<style scoped>
/* CSS chuẩn Sneat */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
.content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }

.card { background: #fff; border-radius: 0.75rem; box-shadow: 0 2px 6px 0 rgba(67, 89, 113, 0.12); padding: 1.5rem; }
.stat-card { display: flex; align-items: center; gap: 1rem; }
.stat-icon { width: 42px; height: 42px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
.stat-number { margin: 0; font-size: 1.5rem; font-weight: 600; color: #566a7f; }
.stat-label { font-size: 0.85rem; color: #a1acb8; }

.bg-label-primary { background: #e7e7ff; color: #696cff; }
.bg-label-danger { background: #ffe0db; color: #ff3e1d; }
.bg-label-success { background: #e8fadf; color: #71dd37; }
.bg-label-warning { background: #fff2d6; color: #ffab00; }
.bg-label-secondary { background: #ebeef0; color: #8592a3; }

.text-success { color: #71dd37; }
.text-danger { color: #ff3e1d; }

.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.card-title { margin: 0; color: #566a7f; font-weight: 600; }

.tabs { display: flex; gap: 10px; }
.btn-tab { border: none; background: none; padding: 5px 10px; color: #a1acb8; font-weight: 600; cursor: pointer; border-radius: 4px; }
.btn-tab.active { background: #696cff; color: #fff; }

.table { width: 100%; border-collapse: collapse; }
.table th { text-align: left; color: #a1acb8; font-size: 0.75rem; text-transform: uppercase; padding: 10px 0; }
.table td { padding: 10px 0; color: #697a8d; border-top: 1px solid #ebeef0; }
.avatar-xs { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold; }
.badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
.btn-icon { border: none; background: none; color: #696cff; cursor: pointer; }

.activity-list { display: flex; flex-direction: column; gap: 1rem; }
.activity-item { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid #ebeef0; }
.activity-item:last-child { border-bottom: none; }
.act-title { margin: 0; font-size: 0.9rem; color: #566a7f; }
.act-time { font-size: 0.75rem; color: #a1acb8; }
.btn { padding: 6px 12px; border-radius: 4px; border: none; cursor: pointer; font-size: 0.85rem; font-weight: 500; transition: 0.2s; }
.btn-primary { background: #696cff; color: #fff; }
.btn-outline-secondary { border: 1px solid #8592a3; color: #8592a3; background: #fff; }
.btn-outline-danger { border: 1px solid #ff3e1d; color: #ff3e1d; background: #fff; }
</style>