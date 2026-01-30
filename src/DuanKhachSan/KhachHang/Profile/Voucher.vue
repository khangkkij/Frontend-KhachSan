<template>
    <div class="profile-page" style="margin-top: 120px; margin-bottom: 80px; background-color: #f8f9fa; min-height: 80vh;">
      <div class="container">
        <div class="row g-4">
          
          <div class="col-lg-4 col-md-5">
            <ProfileSidebar :user="sidebarUser" currentPage="my-voucher" />
          </div>
  
          <div class="col-lg-8 col-md-7">
            <div class="profile-card shadow-sm p-4 p-md-5 bg-white rounded-4 border-0">
              <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <h4 class="fw-bold text-dark m-0">Kho voucher của tôi</h4>
                <span class="badge bg-orange-soft text-orange px-3 py-2 rounded-pill small fw-bold">
                  {{ totalCount }} Mã sở hữu
                </span>
              </div>
  
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-orange"></div>
                <p class="mt-2 text-muted">Đang kiểm tra ví của bạn...</p>
              </div>
  
              <div v-else-if="myVouchers.length === 0" class="empty-wallet text-center py-5">
                <div class="mb-3"><i class="fa fa-ticket-alt fa-4x text-muted opacity-25"></i></div>
                <h5 class="fw-bold text-muted">Kho voucher đang trống</h5>
                <p class="text-muted mb-4 small">Bạn chưa lưu mã giảm giá nào từ hệ thống.</p>
                <router-link to="/voucher" class="btn btn-orange px-4 py-2 text-white fw-bold rounded-pill shadow-sm">
                  Săn mã ngay
                </router-link>
              </div>
  
              <div v-else>
                <div class="row g-3">
                  <div class="col-12" v-for="v in myVouchers" :key="v.maCode">
                    <div class="voucher-item d-flex align-items-center p-3 border rounded-3 position-relative overflow-hidden" 
                         :class="{ 'expired-opacity': v.isExpired }">
                      
                      <div class="voucher-icon bg-orange-soft text-orange rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm">
                        <i class="fa fa-gift fs-3"></i>
                      </div>
  
                      <div class="flex-grow-1 pe-3">
                        <div class="d-flex align-items-center gap-2 mb-1">
                          <h6 class="fw-bold text-dark m-0">{{ v.maCode }}</h6>
                          <span v-if="v.isExpired" class="badge bg-danger x-small">Hết hạn</span>
                          <span v-else class="badge bg-success x-small">Khả dụng</span>
                        </div>
                        <p class="text-muted small mb-1 lh-sm">{{ v.moTa }}</p>
                        <div class="small fw-500 text-secondary" style="font-size: 11px;">
                          <i class="far fa-clock me-1"></i>HSD: {{ formatDate(v.ngayKetThuc) }}
                        </div>
                      </div>
  
                      <div class="text-end border-start ps-3" style="min-width: 100px;">
                        <div class="text-orange fw-bold fs-5 mb-1">
                          {{ v.phanTramGiam ? '-' + v.phanTramGiam + '%' : '-' + (v.soTienGiam / 1000) + 'K' }}
                        </div>
                        <button class="btn btn-sm btn-use" 
                                :disabled="v.isExpired"
                                @click="$router.push('/danh-sach-phong')">
                          SỬ DỤNG
                        </button>
                      </div>
  
                      <div class="hole hole-top"></div>
                      <div class="hole hole-bottom"></div>
                    </div>
                  </div>
                </div>
  
                <nav v-if="totalPages > 1" class="mt-5 pt-3">
                  <ul class="pagination pagination-sm justify-content-center gap-2">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <button class="page-link rounded-circle shadow-sm" @click="changePage(currentPage - 1)">
                        <i class="fa fa-chevron-left"></i>
                      </button>
                    </li>
                    <li class="page-item" v-for="p in totalPages" :key="p" :class="{ active: currentPage === p }">
                      <button class="page-link rounded-circle shadow-sm" @click="changePage(p)">{{ p }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                      <button class="page-link rounded-circle shadow-sm" @click="changePage(currentPage + 1)">
                        <i class="fa fa-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
  
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import ProfileSidebar from './ProfileSidebar.vue';
  
  const myVouchers = ref([]);
  const totalCount = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(5);
  const loading = ref(true);
  
  const API_URL = import.meta.env.VITE_API_URL;
  
  // SỬA: Đồng bộ lấy cả Tên và Ảnh từ LocalStorage để Sidebar đổi hình ngay
  const sidebarUser = computed(() => {
    const info = JSON.parse(localStorage.getItem('user_info') || '{}');
    return {
      name: info.name || 'Khách hàng',
      avatar: info.avatar || '' // Lấy avatar để Sidebar hiển thị
    };
  });
  
  const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value));
  
  const userProfile = ref({ hoVaTen: '', hinhAnh: '' });
  
  const fetchUserProfile = async () => {
      try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/KhachHang/profile`, { withCredentials: true });
          userProfile.value = res.data;
      } catch (e) { console.error(e); }
  };
  
  onMounted(() => {
      fetchUserProfile(); // Phải gọi hàm này để Sidebar nhận được ảnh
  });
  
  const fetchMyVouchers = async () => {
    loading.value = true;
    try {
      const res = await axios.get(`${API_URL}/api/Voucher/my-vouchers`, {
        params: { page: currentPage.value, pageSize: pageSize.value },
        withCredentials: true
      });
      myVouchers.value = res.data.items;
      totalCount.value = res.data.totalCount;
    } catch (err) {
      console.error("Lỗi:", err);
    } finally {
      loading.value = false;
    }
  };
  
  const changePage = (p) => {
    if (p < 1 || p > totalPages.value) return;
    currentPage.value = p;
    fetchMyVouchers(); // SỬA: Gọi đúng hàm fetchMyVouchers thay vì fetchVouchers
    window.scrollTo(0, 0);
  };
  
  const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN');
  
  onMounted(fetchMyVouchers);
  </script>
  
  <style scoped>
  /* Giữ nguyên các style Luxury cũ của bạn */
  .text-orange { color: #f35525 !important; }
  .bg-orange-soft { background-color: #fff0ec; }
  .btn-orange { background-color: #f35525; border: none; transition: 0.3s; }
  .btn-orange:hover { background-color: #ca3c12; transform: translateY(-1px); }
  
  .voucher-item {
    background: #fff;
    transition: 0.3s;
    border-left: 5px solid #f35525 !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  }
  .voucher-item:hover { 
    transform: translateX(5px); 
    box-shadow: 0 5px 15px rgba(243, 85, 37, 0.1); 
  }
  
  .expired-opacity { opacity: 0.5; filter: grayscale(1); }
  .voucher-icon { width: 56px; height: 56px; }
  
  .x-small { font-size: 10px; padding: 3px 8px; }
  
  .btn-use {
    border: 1.5px solid #f35525;
    color: #f35525;
    font-weight: 700;
    border-radius: 50px;
    padding: 3px 12px;
    font-size: 11px;
    background: transparent;
    transition: 0.3s;
  }
  .btn-use:hover:not(:disabled) { background: #f35525; color: white; }
  
  .hole {
    position: absolute;
    width: 18px;
    height: 18px;
    background-color: #f8f9fa; 
    border-radius: 50%;
    left: 70px;
    border: 1px solid rgba(0,0,0,0.05);
    z-index: 1;
  }
  .hole-top { top: -10px; }
  .hole-bottom { bottom: -10px; }
  
  .page-link { border: none; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 13px; }
  .page-item.active .page-link { background-color: #f35525; color: white; }
  </style>