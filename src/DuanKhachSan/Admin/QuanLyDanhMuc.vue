<template>
  <div class="container-fluid py-4 bg-light-gray min-vh-100">
    <!-- Header chung -->
    <div class="mb-4">
      <h2 class="fw-extra-bold mb-1">Quản lý Danh mục</h2>
      <p class="text-muted mb-0">
        Thiết lập các loại phòng và tiện ích trong hệ thống
      </p>
    </div>

    <!-- Tabs -->
    <ul class="nav nav-pills mb-4 gap-2">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'loaiphong' }"
          @click="activeTab = 'loaiphong'"
        >
          <i class="bi bi-house-door me-1"></i> Loại phòng
        </button>
      </li>

      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'tienich' }"
          @click="activeTab = 'tienich'"
        >
          <i class="bi bi-stars me-1"></i> Tiện ích
        </button>
      </li>
    </ul>

    <!-- Nội dung -->
    <TabLoaiPhong v-if="activeTab === 'loaiphong'" />
    <TabTienIch v-if="activeTab === 'tienich'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TabLoaiPhong from './TabLoaiPhong.vue'
import TabTienIch from './TabTienIch.vue'

const activeTab = ref('loaiphong')
</script>
