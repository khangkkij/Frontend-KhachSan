<template>
  <div class="room-detail-wrapper">
    <div class="page-heading header-text">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <span class="breadcrumb">
              <router-link to="/">Trang chủ</router-link> /
              <router-link to="/danh-sach-phong">Phòng nghỉ</router-link> / Chi tiết
            </span>
            <h3>{{ room.name }}</h3>
          </div>
        </div>
      </div>
    </div>

    <div class="single-property section">
      <div class="container">
        <div class="row">

          <div class="col-lg-8">
            <div class="main-image">
              <img :src="currentImage" alt="Room Detail" class="main-room-image" :style="{ opacity: imageOpacity }" />
              <span class="badge-variant" v-if="selectedVariant.key !== 'base'">
                {{ selectedVariant.label.split('(')[0] }}
              </span>
            </div>

            <div class="main-content">
              <span class="category">{{ room.category }}</span>
              <h4>Thông tin chi tiết</h4>
              <p>{{ room.description }}</p>

              <br>
              <p><strong>Lưu ý:</strong> Giá trên chưa bao gồm thuế VAT và phí dịch vụ. Quý khách vui lòng thanh toán
                trước 50% khi đặt phòng.</p>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="info-table">
              <ul>
                <li>
                  <img src="/assets/images/info-icon-01.png" style="max-width: 52px;">
                  <h4>
                    <strong>{{ room.area }}</strong> m²
                    <br><span>Diện tích</span>
                  </h4>
                </li>
                <li>
                  <img src="/assets/images/info-icon-02.png" style="max-width: 52px;">
                  <h4>Hợp đồng<br><span>Sẵn sàng</span></h4>
                </li>
                <li>
                  <img src="/assets/images/info-icon-03.png" style="max-width: 52px;">
                  <h4>Thanh toán<br><span>Linh hoạt</span></h4>
                </li>
              </ul>
            </div>

            <div class="variant-box mt-4 p-4 border rounded bg-light" style="border: 1px solid #eee;">
              <h5 class="mb-3 fw-bold">Tùy chọn gói phòng:</h5>

              <div class="mb-3">
                <label class="form-label text-muted" style="font-size: 14px;">Chọn dịch vụ:</label>
                <select class="form-select" v-model="selectedVariant">
                  <option v-for="v in variants" :key="v.key" :value="v">
                    {{ v.label }}
                  </option>
                </select>
              </div>

              <div class="total-price mb-4">
                <label class="text-muted" style="font-size: 14px;">Tổng giá / đêm:</label>
                <h3 class="text-danger fw-bold">
                  {{ formattedPrice }}
                </h3>
              </div>

              <div class="main-button">
                <router-link to="/booking" style="width:100%; text-align:center; display:block;">
                  Xác nhận đặt phòng
                </router-link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Lấy ID từ URL (để biết đang xem phòng nào)
const route = useRoute();
const roomId = route.params.id; // Ví dụ: 1, 2, 3...

// Dữ liệu phòng
const room = ref({
  name: 'Villa Modern Luxury',
  category: 'Luxury Suite',
  description: 'Căn hộ cao cấp với đầy đủ tiện nghi, tọa lạc tại vị trí đắc địa với tầm nhìn rộng mở. Hệ thống nội thất hiện đại theo tiêu chuẩn 5 sao. Không gian thoáng đãng, yên tĩnh, thích hợp cho việc nghỉ dưỡng.',
  totalRooms: 8,
  area: 250
})

// Dữ liệu Biến thể (Variants)
const variants = ref([
  {
    key: 'base',
    label: 'Gói Tiêu chuẩn (2.000.000₫)',
    price: 2000000,
    image: '/assets/images/property-01.jpg'
  },
  {
    key: 'sea',
    label: 'Hướng biển (+500.000₫)',
    price: 2500000,
    image: '/assets/images/property-02.jpg'
  },
  {
    key: 'vip',
    label: 'Gói VIP (+1.500.000₫)',
    price: 3500000,
    image: '/assets/images/property-03.jpg'
  }
])

// State quản lý lựa chọn
const selectedVariant = ref(variants.value[0])
const currentImage = ref(selectedVariant.value.image)
const imageOpacity = ref(1)

// Hiệu ứng mờ ảnh khi đổi gói
watch(selectedVariant, (v) => {
  imageOpacity.value = 0.5
  setTimeout(() => {
    currentImage.value = v.image
    imageOpacity.value = 1
  }, 200)
})

// Format giá tiền
const formattedPrice = computed(() =>
  selectedVariant.value.price.toLocaleString('vi-VN') + '₫'
)

onMounted(() => {
  // Logic giả lập: Nếu ID = 2 thì đổi tên phòng (Demo)
  if (roomId == 2) {
    room.value.name = "Biệt thự View Biển – 105";
    room.value.area = 450;
  }
})
</script>

<style scoped>
/* CSS cho ảnh chính */
.main-image {
  width: 100%;
  min-height: 400px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  position: relative;
}

.main-room-image {
  width: 100%;
  height: auto;
  min-height: 400px;
  object-fit: cover;
  /* Đã sửa thành cover để ảnh full khung đẹp hơn */
  transition: opacity 0.3s ease;
}

/* Badge hiển thị gói */
.badge-variant {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f35525;
  color: #fff;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

/* Tùy chỉnh Select Box */
.form-select:focus {
  border-color: #f35525;
  box-shadow: 0 0 0 0.25rem rgba(243, 85, 37, 0.25);
}

/* Khung Variant Box */
.variant-box {
  background: #fff;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.05);
}

.text-danger {
  color: #f35525 !important;
  /* Đổi màu đỏ thành màu cam chủ đạo của web */
}
</style>