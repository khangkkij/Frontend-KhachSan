<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="logo-container">
        <svg class="logo-icon" viewBox="0 0 25 42" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.7918663,0.358365126 L3.39788168,7.44174259 C0.566865006,9.69408886 -0.379795268,12.4788597 0.557900856,15.7960551 C0.68998853,16.2305145 1.09562888,17.7872135 3.12357076,19.2293357 C3.8146334,19.7207684 5.32369333,20.3834223 7.65075054,21.2172976 L7.59773219,21.2525164 L2.63468769,24.5493413 C0.445452254,26.3002124 0.0884951797,28.5083815 1.56381646,31.1738486 C2.83770406,32.8170431 5.20850219,33.2640127 7.09180128,32.5391577 C8.347334,32.0559211 11.4559176,30.0011079 16.4175519,26.3747182 C18.0338572,24.4997857 18.6973423,22.4544883 18.4080071,20.2388261 C17.963753,17.5346866 16.1776345,15.5799961 13.0496516,14.3747546 L10.9194936,13.4715819 L18.6192054,7.984237 L13.7918663,0.358365126 Z" fill="currentColor"></path>
        </svg>
        <span class="logo-text">sneat</span>
      </div>

      <nav class="menu">
        <router-link to="/admin" class="menu-item" exact-active-class="active">
          <i class="bx bx-home-circle icon"></i> Dashboard
        </router-link>

        <div class="menu-header">QUẢN LÝ</div>

        <router-link to="/admin/nhan-su" class="menu-item" active-class="active">
          <i class="bx bx-user icon"></i> Nhân sự
        </router-link>

        <router-link to="/admin/khach-hang" class="menu-item" active-class="active">
          <i class="bx bx-group icon"></i> Khách hàng
        </router-link>

        <router-link to="/admin/phong" class="menu-item" active-class="active">
          <i class="bx bx-building-house icon"></i> Phòng
        </router-link>

        <router-link to="/admin/loai-phong" class="menu-item" active-class="active">
          <i class="bx bx-category icon"></i> Loại phòng
        </router-link>

        <router-link to="/admin/dich-vu" class="menu-item" active-class="active">
          <i class="bx bx-cube icon"></i> Dịch vụ
        </router-link>

        <div class="menu-header">KHUYẾN MÃI</div>
        
        <router-link to="/admin/voucher" class="menu-item" active-class="active">
          <i class="bx bx-gift icon"></i> Voucher
        </router-link>
        
        <router-link to="/admin/sale" class="menu-item" active-class="active">
          <i class="bx bx-purchase-tag-alt icon"></i> Sale
        </router-link>
      </nav>
    </aside>

    <div class="main-wrapper">
      <header class="navbar">
        <div class="search-box">
          <i class="bx bx-search search-icon"></i>
          <input type="text" placeholder="Tìm kiếm dịch vụ, voucher..." />
        </div>
        <div class="user-actions">
          <div class="avatar">
            <img src="https://i.pravatar.cc/150?img=33" alt="Admin" />
          </div>
        </div>
      </header>

      <div class="content-wrapper">
        <div class="container-xxl flex-grow-1 container-p-y">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Logic giữ nguyên
</script>

<style scoped>
/* Reset cơ bản */
:root {
  --primary-color: #696cff;
  --bg-body: #f5f5f9;
  --bg-card: #ffffff;
  --text-main: #566a7f;
  --text-light: #a1acb8;
  --border-radius: 0.75rem;
  --shadow-sm: 0 2px 6px 0 rgba(67, 89, 113, 0.12);
}

.dashboard-layout {
  display: flex;
  height: 100vh;
  background-color: #f5f5f9;
  font-family: 'Public Sans', sans-serif, Arial;
  color: #566a7f;
  overflow: hidden;
}

/* --- SIDEBAR --- */
.sidebar {
  width: 260px;
  background: #ffffff;
  box-shadow: 0 0.125rem 0.25rem rgba(161, 172, 184, 0.4);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  height: 100%;
  flex-shrink: 0;
}

.logo-container {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  gap: 10px;
  color: #696cff;
  font-weight: 700;
  font-size: 1.5rem;
  margin-top: 10px;
}

.logo-icon {
  width: 25px;
}

.menu {
  flex: 1;
  padding: 0.5rem;
  overflow-y: auto;
}

/* Style cho từng item menu */
.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  margin-bottom: 4px;
  color: #566a7f;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease-in-out; /* Thêm transition mượt hơn */
  font-size: 0.95rem;
}

.menu-item:hover {
  background: rgba(67, 89, 113, 0.04);
  color: #696cff; /* Hover đổi màu chữ một chút cho đẹp */
}

/* --- CLASS QUAN TRỌNG: KHI ĐƯỢC CHỌN (ACTIVE) --- */
/* Class này sẽ tự động được thêm vào router-link khi đúng đường dẫn */
.menu-item.active {
  background: rgba(105, 108, 255, 0.16) !important; /* Màu nền tím nhạt */
  color: #696cff !important; /* Màu chữ tím đậm */
  font-weight: 600;
  position: relative; /* Để có thể thêm hiệu ứng nếu muốn sau này */
}
/* Thêm vạch nhỏ bên phải để giống template xịn (tuỳ chọn) */
.menu-item.active::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: #696cff;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  display: none; /* Bỏ comment dòng này nếu muốn hiện vạch */
}

.menu-header {
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 0 16px;
  font-size: 0.75rem;
  font-weight: bold;
  color: #a1acb8;
  text-transform: uppercase;
}

.icon {
  font-size: 1.2rem;
  width: 20px;
  text-align: center;
}

/* --- MAIN WRAPPER --- */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.navbar {
  margin: 1rem 1.5rem 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  padding: 0 1.5rem;
  min-height: 64px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 0.375rem 0.25rem rgba(161, 172, 184, 0.15);
  z-index: 10;
  flex-shrink: 0;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a1acb8;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  color: #566a7f;
  width: 300px;
  font-size: 0.95rem;
}

.avatar img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #d9dee3;
  cursor: pointer;
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.container-p-y {
  padding-top: 0.5rem;
  padding-bottom: 1.5rem;
}
</style>