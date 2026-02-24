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
              <p class="mt-2 text-muted">Đang tải các ưu đãi...</p>
            </div>

            <div v-else-if="roomList.length === 0" class="text-center py-5">
              <p class="text-muted">Hiện chưa có ưu đãi nào.</p>
            </div>

            <div v-else class="row">
              
              <div class="nav-wrapper">
                <ul class="nav nav-tabs" role="tablist">
                  <li class="nav-item" role="presentation" v-for="(room, index) in roomList" :key="room.maLp">
                    <button 
                      class="nav-link" 
                      :class="{ active: activeIndex === index }"
                      type="button" 
                      role="tab"
                      @click="activeIndex = index"
                    >
                      {{ room.tenLoai }}
                    </button>
                  </li>
                </ul>
              </div>

              <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" role="tabpanel">
                  <div class="row">
                    
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
        <span class="label"><i class="fa fa-bed"></i> Loại giường</span>
        <span class="value">{{ currentRoom.loaiGiuong || 'King Size' }}</span>
      </li>
      <li>
        <span class="label"><i class="fa fa-user"></i> Sức chứa</span>
        <span class="value">{{ currentRoom.soNguoi || 2 }} người</span>
      </li>
      <li class="price-row">
        <span class="label">Giá từ</span>
        <span class="value price">{{ formatCurrency(currentRoom.giaThamKhao) }}</span>
      </li>
    </ul>
  </div>
                    </div>

                    <div class="col-lg-6">
                      <img 
                        :src="getImageUrl(currentRoom.hinhAnh)" 
                        alt="Room Image" 
                        class="img-fluid rounded shadow-sm"
                        style="width: 100%; height: 350px; object-fit: cover;"
                        @error="handleImageError"
                      >
                    </div>

                    <div class="col-lg-3">
                      <h4>{{ currentRoom.tenBienThe || currentRoom.tenLoai }}</h4>
                      <p class="description-truncate">{{ currentRoom.moTa }}</p>
                      
                      <div class="icon-button">
                        <router-link :to="`/phong/${currentRoom.maLp}`">
                          <i class="fa fa-calendar"></i> Đặt lịch xem / Đặt ngay
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

// --- CONFIG ---
const API_URL = import.meta.env.VITE_API_URL; 
// Giả sử API lấy danh sách loại phòng nổi bật:
const ENDPOINT = `${API_URL}/api/BestDeals`; 

// --- STATE ---
const roomList = ref([]);
const isLoading = ref(true);
const activeIndex = ref(0);

// --- FETCH DATA ---
const fetchRooms = async () => {
  isLoading.value = true;
  try {
    // Gọi API thật
    // Lưu ý: Bạn cần đảm bảo Backend trả về List LoaiPhong hoặc LoaiPhongBienthe
    const response = await axios.get(ENDPOINT);
    
    if (response.data && response.data.length > 0) {
        roomList.value = response.data.map(item => ({
            // Map dữ liệu từ API C# (PascalCase) sang Javascript (camelCase) cho dễ dùng
            maLp: item.maLp || item.MaLp,
            tenLoai: item.tenLoai || item.TenLoai,
            
            // Các thông số chi tiết (Có thể lấy từ bảng LoaiPhongBienthe nếu bạn join bảng)
            dienTich: item.dienTich || item.DienTich || 0,
            huongNhin: item.huongNhin || item.HuongNhin,
            loaiGiuong: item.loaiGiuong || item.LoaiGiuong,
            giaThamKhao: item.gia || item.Gia || 0,
            
            // Hình ảnh & Mô tả
            hinhAnh: item.hinhAnh || item.HinhAnh || '', // URL ảnh
            moTa: item.moTa || item.MoTa || 'Đang cập nhật mô tả...'
        }));
    }
  } catch (error) {
    console.error("Lỗi tải Best Deals:", error);
    // Có thể fallback về mảng rỗng hoặc hiện thông báo
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchRooms();
});

// --- COMPUTED ---
// Lấy phòng đang được Active dựa trên Tab index
const currentRoom = computed(() => {
    return roomList.value[activeIndex.value] || {};
});

// --- HELPER FUNCTIONS ---
const formatCurrency = (val) => {
    if (!val) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

const getImageUrl = (path) => {
    if (!path) return '/assets/images/deal-01.jpg'; // Ảnh mặc định nếu null
    if (path.startsWith('http')) return path;
    // Nếu lưu đường dẫn tương đối, ghép với API URL
    return `${API_URL}/${path}`; 
};

const handleImageError = (e) => {
    e.target.src = '/assets/images/no-image.jpg'; // Ảnh fallback khi lỗi
};

</script>

<style scoped>
.description-truncate {
    display: -webkit-box;
    -webkit-line-clamp: 4; /* Giới hạn 4 dòng mô tả */
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 20px;
}

.nav-tabs .nav-link {
    cursor: pointer;
    font-weight: 600;
    color: #fff;
    border: none;
    border-bottom: 3px solid transparent;
}

.nav-tabs .nav-link:hover {
    color: #fff;
    border-bottom: 3px solid #f35525;
    background: transparent;
}

.nav-tabs .nav-link.active {
    color: #fff; /* Màu cam chủ đạo */
    border-bottom: 3px solid #f35525;
    background: transparent;
    box-shadow: none;
}

/* --- 2. Style cho Card thông tin --- */
.info-card {
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05); /* Bóng mờ, rộng và tinh tế hơn */
  border: 1px solid rgba(0,0,0,0.02);
}

.room-details {
  list-style: none;
  padding: 0;
  margin: 0;
}

.room-details li {
  display: flex;
  justify-content: space-between; /* Đẩy Label sang trái, Value sang phải */
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px dashed #e5e5e5; /* Đường kẻ nét đứt nhìn nhẹ nhàng hơn nét liền */
}

.room-details li:last-child {
  border-bottom: none; /* Bỏ gạch chân dòng cuối */
  padding-bottom: 0;
  padding-top: 20px; /* Tách biệt giá tiền ra một chút */
}

/* Label (Tên thuộc tính) */
.room-details .label {
  color: #7a7a7a; /* Màu xám ghi sang trọng */
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px; /* Khoảng cách giữa icon và chữ */
}

.room-details .label i {
  color: #f35525; /* Icon màu cam nhấn nhá */
  width: 20px; /* Cố định chiều rộng icon để thẳng hàng */
}

/* Value (Giá trị) */
.room-details .value {
  color: #222; /* Màu đen đậm cho dễ đọc */
  font-weight: 700;
  font-size: 15px;
  text-align: right;
}

/* Riêng phần Giá tiền */
.room-details .price {
  color: #f35525;
  font-size: 20px; /* To hơn hẳn */
  font-weight: 800;
  letter-spacing: -0.5px;
}
</style>