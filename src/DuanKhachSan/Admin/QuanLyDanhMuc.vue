<template>
  <div class="container-fluid py-4 bg-corporate min-vh-100">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold text-dark mb-1">Quản lý Danh mục</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item small text-muted">Hệ thống</li>
              <li class="breadcrumb-item small text-muted active">Cấu hình chung</li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="corporate-tabs mb-4">
        <button
          class="tab-item"
          :class="{ active: activeTab === 'loaiphong' }"
          @click="activeTab = 'loaiphong'"
        >
          <i class="bi bi-house-door me-2"></i>Loại phòng
        </button>
        <button
          class="tab-item"
          :class="{ active: activeTab === 'tienich' }"
          @click="activeTab = 'tienich'"
        >
          <i class="bi bi-stars me-2"></i>Tiện ích
        </button>
      </div>

      <div class="content-wrapper animate__animated animate__fadeIn">
        <TabLoaiPhong v-if="activeTab === 'loaiphong'" />
        <TabTienIch v-if="activeTab === 'tienich'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TabLoaiPhong from './TabLoaiPhong.vue'
import TabTienIch from './TabTienIch.vue'

const activeTab = ref('loaiphong')
</script>

<style scoped>
.bg-corporate { background-color: #f8f9fa; }

.corporate-tabs {
  display: flex;
  gap: 30px;
  border-bottom: 2px solid #dee2e6;
}

.tab-item {
  padding: 12px 5px;
  border: none;
  background: none;
  color: #6c757d;
  font-weight: 600;
  position: relative;
  transition: all 0.3s;
}

.tab-item.active {
  color: #0d6efd;
}

.tab-item.active::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #0d6efd;
}

.tab-item:hover { color: #0d6efd; }
</style>