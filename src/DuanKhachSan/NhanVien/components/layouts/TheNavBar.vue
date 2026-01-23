<template>
  <nav
    class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
    id="layout-navbar"
  >
    <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
      <a class="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
        <i class="bx bx-menu bx-sm"></i>
      </a>
    </div>

    <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
      
      <div class="navbar-nav align-items-center">
        <div class="nav-item d-flex align-items-center">
          <i class="bx bx-search fs-4 lh-0"></i>
          <input
            type="text"
            class="form-control border-0 shadow-none"
            placeholder="Tìm tên khách, số phòng..."
            aria-label="Search..."
            v-model="searchText"
            @input="onSearchInput" 
          />
        </div>
      </div>
      <ul class="navbar-nav flex-row align-items-center ms-auto">
        
        <li class="nav-item navbar-dropdown dropdown-user dropdown">
          <a class="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
            <div class="avatar avatar-online">
              <img src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template-free/assets/img/avatars/1.png" alt class="w-px-40 h-auto rounded-circle" />
            </div>
          </a>
          
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a class="dropdown-item" href="#">
                <div class="d-flex">
                  <div class="flex-shrink-0 me-3">
                    <div class="avatar avatar-online">
                      <img src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template-free/assets/img/avatars/1.png" alt class="w-px-40 h-auto rounded-circle" />
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <span class="fw-semibold d-block">Nguyễn Văn A</span>
                    <small class="text-muted">Lễ tân (Ca 1)</small>
                  </div>
                </div>
              </a>
            </li>
            <li><div class="dropdown-divider"></div></li>
            <li>
              <a class="dropdown-item" href="#">
                <i class="bx bx-user me-2"></i>
                <span class="align-middle">Hồ sơ của tôi</span>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#">
                <i class="bx bx-cog me-2"></i>
                <span class="align-middle">Cài đặt</span>
              </a>
            </li>
            <li><div class="dropdown-divider"></div></li>
            <li>
              <a class="dropdown-item" href="javascript:void(0);">
                <i class="bx bx-power-off me-2"></i>
                <span class="align-middle">Đăng xuất</span>
              </a>
            </li>
          </ul>
        </li>
        </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

// Định nghĩa sự kiện bắn ra cho cha (ReceptionDashboard)
const emit = defineEmits(['search']);

const searchText = ref('');

// Hàm xử lý khi người dùng gõ phím
const onSearchInput = () => {
  // Bắn giá trị text ra ngoài để component cha lọc danh sách
  emit('search', searchText.value);
};
</script>

<style scoped>
/* KHUNG NAVBAR CHÍNH */
.layout-navbar {
  height: 64px;
  margin: 1rem 1.5rem; /* Cách lề trên và 2 bên tạo cảm giác nổi */
  padding: 0 1.5rem;   /* Padding bên trong để nội dung không sát mép */
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 0.375rem 0.25rem rgba(161, 172, 184, 0.15);
  
  /* QUAN TRỌNG: Flexbox để căn chỉnh */
  display: flex;
  align-items: center;
  z-index: 10;
}

/* CONTAINER BÊN TRONG (Chứa Search + User) */
#navbar-collapse {
  display: flex;
  width: 100%; /* Bắt buộc phải 100% để đẩy 2 phần ra xa */
  align-items: center;
  justify-content: space-between; /* Đẩy Search sang trái, User sang phải */
}

/* THANH TÌM KIẾM */
.navbar-nav.align-items-center {
  flex-grow: 1; /* Cho phép vùng tìm kiếm mở rộng nếu cần */
}

.form-control {
  background: transparent;
  border: none;
  padding-left: 10px;
  width: 100%;
}
.form-control:focus {
  box-shadow: none;
}

/* PHẦN TÀI KHOẢN (BÊN PHẢI) */
.navbar-nav.flex-row {
  gap: 15px; /* Khoảng cách giữa các icon nếu có nhiều icon */
  margin-left: auto; /* Đảm bảo luôn dính chặt về bên phải */
}

/* Avatar User */
.avatar {
  cursor: pointer;
  width: 38px;
  height: 38px;
}
.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

/* Mobile Toggle Button */
.layout-menu-toggle {
  margin-right: 1rem;
}
</style>