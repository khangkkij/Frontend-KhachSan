<template>
  <div class="app-brand demo">
  <router-link to="/reception" class="app-brand-link">
    <span class="app-brand-logo demo">
      <svg width="25" viewBox="0 0 25 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <path d="M13.7623752,0.61217528 C13.7623752,0.61217528 17.5501869,3.75474324 17.5501869,7.5425551 C17.5501869,11.3303669 13.9114896,14.6212581 13.9114896,14.6212581 L13.9114896,0.61217528 Z" id="path-1"></path>
          <path d="M5.98379415,14.3468945 C5.98379415,14.3468945 2.19602058,11.2043644 2.19602058,7.41655255 C2.19602058,3.62874068 5.83471804,0.337849474 5.83471804,0.337849474 L5.98379415,14.3468945 Z" id="path-2"></path>
        </defs>
        <g id="g-app-brand" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Brand-Logo" transform="translate(-27.000000, -15.000000)">
            <g id="Icon" transform="translate(27.000000, 15.000000)">
              <g id="Mask" transform="translate(0.000000, 8.000000)">
                <mask id="mask-2" fill="white">
                  <use xlink:href="#path-1"></use>
                </mask>
                <use fill="#696cff" xlink:href="#path-1"></use>
                <g id="Path-3" mask="url(#mask-2)">
                  <use fill="#696cff" xlink:href="#path-2"></use>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </span>
    <span class="app-brand-text demo menu-text fw-bolder ms-2">Sneat Hotel</span>
  </router-link>

  <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
    <i class="bx bx-chevron-left bx-sm align-middle"></i>
  </a>
</div>
  <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
    <ul class="menu-inner py-1">
      
      <li class="menu-item">
        <router-link to="/NhanVien" class="menu-link">
          <i class="menu-icon tf-icons bx bx-home-circle"></i>
          <div>Dashboard</div>
        </router-link>
      </li>

      <li class="menu-item">
        <router-link to="/NhanVien/rooms" class="menu-link">
          <i class="menu-icon tf-icons bx bx-building-house"></i>
          <div>Sơ đồ phòng</div>
        </router-link>
      </li>

      <li class="menu-item">
        <router-link to="/NhanVien/services" class="menu-link">
          <i class="menu-icon tf-icons bx bx-food-menu"></i>
          <div>Dịch vụ</div>
        </router-link>
      </li>

    </ul>
  </aside>
</template>
<style scoped>
/* KHUNG SIDEBAR */
.layout-menu {
  position: fixed; /* Cố định bên trái */
  top: 0;
  bottom: 0;
  left: 0;
  width: 260px; /* Chiều rộng chuẩn Sneat */
  background-color: #ffffff;
  border-right: 1px solid #d9dee3; /* Đường kẻ mờ bên phải */
  z-index: 1000;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
}

/* LOGO */
.app-brand {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  margin-bottom: 0.5rem;
}
.app-brand-text {
  font-size: 1.5rem;
  color: #566a7f;
  text-transform: uppercase;
  letter-spacing: -0.5px;
}

/* MENU LIST */
.menu-inner {
  overflow-y: auto; /* Cho phép cuộn nếu menu dài */
  height: 100%;
  padding: 0.5rem 0;
  list-style: none; /* Bỏ chấm tròn đầu dòng */
  margin: 0;
}

.menu-item {
  margin: 0.1rem 1rem; /* Cách lề 2 bên */
}

/* MENU LINK (Thẻ a) */
.menu-link {
  display: flex;
  align-items: center;
  padding: 0.625rem 1rem;
  color: #697a8d; /* Màu chữ xám */
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.menu-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
  width: 1.5rem; /* Căn đều icon */
  text-align: center;
}

/* TRẠNG THÁI HOVER & ACTIVE */
.menu-link:hover {
  background-color: rgba(67, 89, 113, 0.04);
  color: #696cff; /* Màu tím Sneat */
}

/* Vue Router Active Class (Khi đang ở trang đó) */
.router-link-active {
  background-color: rgba(105, 108, 255, 0.16) !important; /* Nền tím nhạt */
  color: #696cff !important; /* Chữ tím đậm */
  font-weight: 600;
}

</style>