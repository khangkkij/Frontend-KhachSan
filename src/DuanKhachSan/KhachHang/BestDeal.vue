<template>
  <div class="section best-deal">
    <div class="container">
      <div class="row">
        
        <div class="col-lg-4">
          <div class="section-heading">
            <h6>| Ưu đãi tốt nhất</h6>
            <h2>Tìm phòng ưng ý ngay hôm nay!</h2>
          </div>
        </div>

        <div class="col-lg-12">
          <div class="tabs-content">
            
            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status"></div>
              <p class="mt-2 text-muted">Đang tìm kiếm ưu đãi hời nhất...</p>
            </div>

            <div v-else-if="roomList.length === 0" class="text-center py-5">
              <p class="text-muted">Hiện chưa có ưu đãi nào khả dụng.</p>
            </div>

            <div v-else class="row">
              
              <div class="nav-wrapper">
                <ul class="nav nav-tabs" role="tablist">
                  <li class="nav-item" role="presentation" v-for="(room, index) in roomList" :key="room.maLp">
                    <button 
                      class="nav-link" 
                      :class="{ active: activeIndex === index }"
                      type="button" 
                      @click="activeIndex = index"
                    >
                      {{ room.tenLoai }}
                      <span v-if="room.phanTramGiam > 0" class="tab-sale-dot"></span>
                    </button>
                  </li>
                </ul>
              </div>

              <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" role="tabpanel">
                  <div class="row align-items-center">
                    
                    <div class="col-lg-3">
                      <div class="info-card">
                        <ul class="room-details">
                          <li>
                            <span class="label"><i class="fa fa-expand"></i> Diện tích</span>
                            <span class="value">{{ currentRoom.dienTich || 0 }} m²</span>
                          </li>
                          <li>
                            <span class="label"><i class="fa fa-eye"></i> Hướng nhìn</span>
                            <span class="value">{{ currentRoom.huongNhin || 'Thành phố' }}</span>
                          </li>
                          <li>
                            <span class="label"><i class="fa fa-bed"></i> Giường</span>
                            <span class="value">{{ currentRoom.loaiGiuong || 'King Size' }}</span>
                          </li>
                          <li class="price-row">
                            <span class="label">Giá ưu đãi</span>
                            <div class="text-end">
                              <div v-if="currentRoom.phanTramGiam > 0" class="old-price">
                                {{ formatCurrency(currentRoom.giaGoc) }}
                              </div>
                              <span class="value price">{{ formatCurrency(currentRoom.giaThamKhao) }}</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div class="col-lg-6">
                      <div class="image-container position-relative">
                        <div v-if="currentRoom.phanTramGiam > 0" class="sale-badge">
                          GIẢM {{ currentRoom.phanTramGiam }}%
                        </div>
                        
                        <img 
                          :src="getImageUrl(currentRoom.hinhAnh)" 
                          alt="Room Image" 
                          class="img-fluid rounded shadow"
                          style="width: 100%; height: 400px; object-fit: cover;"
                          @error="handleImageError"
                        >
                      </div>
                    </div>

                    <div class="col-lg-3">
                      <h4 class="mb-3">
                        {{ currentRoom.tenBienThe || currentRoom.tenLoai }}
                        <span v-if="currentRoom.phanTramGiam > 0" class="badge bg-danger ms-2 hot-tag">HOT</span>
                      </h4>
                      <p class="description-truncate text-muted">{{ currentRoom.moTa }}</p>
                      
                      <div class="icon-button">
                        <router-link :to="`/phong/${currentRoom.maLp}`">
                          <i class="fa fa-calendar"></i> Xem chi tiết & Đặt phòng
                        </router-link>
                      </div>
                    </div>

                  </div>
                </div>
              </div> 
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; 
const ENDPOINT = `${API_URL}/api/BestDeals`; 

const roomList = ref([]);
const isLoading = ref(true);
const activeIndex = ref(0);

const fetchRooms = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(ENDPOINT);
    
    if (response.data && response.data.length > 0) {
        roomList.value = response.data.map(item => ({
            // Khớp với ViewModel từ C# (HomeController.cs)
            maLp: item.maLp || item.MaLp,
            tenLoai: item.tenLoai || item.TenLoai,
            dienTich: item.dienTich || item.DienTich || 0,
            huongNhin: item.huongNhin || item.HuongNhin,
            loaiGiuong: item.loaiGiuong || item.LoaiGiuong,
            giaThamKhao: item.gia || item.Gia || 0, // Giá sau giảm
            giaGoc: item.giaGoc || item.GiaGoc || 0, // Giá gốc chưa giảm
            phanTramGiam: item.phanTramGiam || item.PhanTramGiam || 0, // Tỷ lệ %
            hinhAnh: item.hinhAnh || item.HinhAnh || '',
            moTa: item.moTa || item.MoTa || 'Đang cập nhật...'
        }));
    }
  } catch (error) {
    console.error("Lỗi tải Best Deals:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchRooms);

const currentRoom = computed(() => roomList.value[activeIndex.value] || {});

const formatCurrency = (val) => {
    if (!val) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const getImageUrl = (path) => {
    if (!path) return '/assets/images/deal-01.jpg';
    return path.startsWith('http') ? path : `${API_URL}/uploads/variants/${path}`; 
};

const handleImageError = (e) => { e.target.src = '/assets/images/no-image.jpg'; };
</script>

<style scoped>
/* --- 1. Hiệu ứng Sale --- */
.sale-badge {
    position: absolute;
    top: 20px;
    left: 20px;
    background: #f35525;
    color: white;
    padding: 8px 16px;
    font-weight: 800;
    border-radius: 4px;
    z-index: 10;
    box-shadow: 0 4px 15px rgba(243, 85, 37, 0.4);
    font-size: 14px;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.old-price {
    text-decoration: line-through;
    color: #999;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: -4px;
}

.hot-tag {
    font-size: 10px;
    vertical-align: middle;
    padding: 4px 8px;
}

.tab-sale-dot {
    height: 8px;
    width: 8px;
    background-color: #f35525;
    border-radius: 50%;
    display: inline-block;
    margin-left: 5px;
}

/* --- 2. Card Info & Price --- */
.info-card {
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
}

.room-details li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed #eee;
}

.price-row {
    border-bottom: none !important;
    padding-top: 15px !important;
}

.value.price {
  color: #f35525;
  font-size: 1.4rem;
  font-weight: 800;
}

/* --- 3. Layout Fixes --- */
.description-truncate {
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.6;
}

.nav-tabs .nav-link.active {
    color: #fff !important;
    border-bottom: 3px solid #f35525 !important;
}
</style>