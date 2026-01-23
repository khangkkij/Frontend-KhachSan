<template>
  <div class="layout-wrapper layout-content-navbar">
    <div class="layout-container">
      
      <TheSidebar />

      <div class="layout-page">
        
        <TheNavbar />

        <div class="content-wrapper">
          <div class="container-xxl flex-grow-1 container-p-y">
            
            <router-view></router-view>

          </div>
        </div>
        </div>
    </div>

    <div class="layout-overlay layout-menu-toggle"></div>
  </div>
</template>

<script setup>
// Import 2 thành phần cố định
import TheSidebar from '@/DuanKhachSan/NhanVien/components/layouts/TheSidebar.vue'
import TheNavbar from '@/DuanKhachSan/NhanVien/components/layouts/TheNavbar.vue'
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f9; /* Màu nền xám nhạt của toàn trang */
}

/* Container chính bên phải (Chứa Navbar + Content) */
.layout-page {
  flex-grow: 1; /* Chiếm hết phần còn lại */
  margin-left: 260px; /* Đẩy sang phải bằng chiều rộng Sidebar */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: calc(100% - 260px); /* Tính toán chiều rộng */
  transition: all 0.3s ease;
}

/* Nội dung thay đổi (Router View) */
.content-wrapper {
  flex-grow: 1;
  padding: 0 1.5rem 1.5rem 1.5rem; /* Padding cho nội dung */
}
</style>