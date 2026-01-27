<script setup>
import axios from 'axios';
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute();
const router = useRouter();
const roomId = route.params.id;
const API = import.meta.env.VITE_API_URL
const room = ref(null)
const loading = ref(true)
const imageOpacity = ref(1)
const bienThePhong = ref([])
const currentImage = ref('')
const selectedVariantId = ref(null)
const selectedVariant = computed(() => {
  return bienThePhong.value?.find(
    bt => bt.maBienThePhong === selectedVariantId.value
  )
})
const changeImage = (img) => {
  imageOpacity.value = 0
  setTimeout(() => {
    currentImage.value = `${API}/images/${img}`
    imageOpacity.value = 1
  }, 150)
}
onMounted(async() => {
  const res=await axios.get(`${API}/api/ChiTietPhong/${roomId}`)
  room.value=res.data.chiTiet
  bienThePhong.value = res.data?.bienTheKhac ?? []
  if (bienThePhong.value.length > 0) {
    selectedVariantId.value = bienThePhong.value[0].maBienThePhong
  }
  const exist = bienThePhong.value.find(
    bt => bt.maBienThePhong == roomId
  )
  if (exist) {
    selectedVariantId.value = exist.maBienThePhong
  } else if (bienThePhong.value.length > 0) {
    selectedVariantId.value = bienThePhong.value[0].maBienThePhong
  }
})
watch(selectedVariantId, () => {
  if (selectedVariant.value?.danhSachAnh?.length > 0) {
    currentImage.value = `${API}/images/${selectedVariant.value.danhSachAnh[0]}`
  }
})

const goBooking = () => {
  if (!selectedVariant.value) {
    alert('Vui lòng chọn biến thể phòng.');
    return;
  }

  try {
    const bookingInfo = {
      tenLoai: room.value?.tenLoai || 'Phòng',
      tenBienThe: selectedVariant.value?.tenBienThe || '',
      anhDaiDien: selectedVariant.value?.danhSachAnh?.[0] || ''
    };
    localStorage.setItem('booking_info', JSON.stringify(bookingInfo));
  } catch {
    // ignore localStorage errors
  }

  router.push({
    path: '/booking',
    query: {
      maBienThePhong: selectedVariant.value.maBienThePhong,
      gia: selectedVariant.value.gia
    }
  });
};
</script>
<template>
  <div class="room-detail-wrapper" v-if="room">
    <div class="page-heading header-text">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <span class="breadcrumb">
              <router-link to="/">Trang chủ</router-link> /
              <router-link to="/danh-sach-phong">Phòng nghỉ</router-link> / Chi tiết
            </span>
            <h3>{{ room.tenLoai }}</h3>
          </div>
        </div>
      </div>
    </div>

    <div class="single-property section">
      <div class="container">
        <div class="row">

          <div class="col-lg-8">
            <div class="main-image">
              <img
                :src="currentImage"
                alt="Room Detail"
                class="main-room-image"
                :style="{ opacity: imageOpacity }"
              />
            </div>
            <div class="thumbnail-list mt-3" v-if="selectedVariant?.danhSachAnh?.length">
              <img
                v-for="(img, index) in selectedVariant.danhSachAnh"
                :key="index"
                :src="`${API}/images/${img}`"
                class="thumbnail-img"
                :class="{ active: currentImage.includes(img) }"
                @click="changeImage(img)"
              />
            </div>

            <span v-if="selectedVariant">Số lượng phòng trống: {{ selectedVariant.soPhongCon }}</span>
            <div class="main-content">
              <span class="category">{{ room.tenLoai }}</span>
              <h4 v-if="selectedVariant">{{ selectedVariant.tenBienThe }}</h4>
              <h4>Thông tin chi tiết</h4>
              <p>{{ room.moTa }}</p>
              <p v-if="selectedVariant">Số người tối đa: {{ selectedVariant.soNguoiToiDa }}</p>
              <p v-if="selectedVariant">Loại giường: {{ selectedVariant.loaiGiuong }}</p>
              <p>Hướng nhìn: {{ room.huongNhin }}</p>
              <div class="amenities-list mt-4">
                <h5>Tiện ích đi kèm:</h5>
                <div class="d-flex flex-wrap gap-3">
                  <span v-for="ti in room.tienIch" :key="ti.maTi" class="badge bg-light text-dark border p-2">
                    <i class="fa fa-check text-success me-1"></i> {{ ti.tenTienIch }}
                  </span>
                </div>
              </div>

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
                    <strong v-if="selectedVariant">{{ selectedVariant.dienTich }}</strong> m²
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
                <label class="form-label text-muted" style="font-size: 14px;">
                  Chọn biến thể phòng:
                </label>

                <select class="form-select" v-model="selectedVariantId">
                  <option 
                    v-for="bt in bienThePhong" 
                    :key="bt.maBienThePhong"
                    :value="bt.maBienThePhong"
                  >
                    {{ bt.tenBienThe }} – {{ bt.gia?.toLocaleString('vi-VN') }} ₫ / đêm
                  </option>
                </select>
              </div>

              <div class="price-box" v-if="selectedVariant">
                <label class="text-muted" style="font-size: 14px;">Tổng giá / đêm:</label>

                <div
                  v-if="selectedVariant.phanTramGiam > 0"
                  class="text-muted text-decoration-line-through"
                >
                  {{ selectedVariant.gia.toLocaleString('vi-VN') }}₫
                </div>

                <span
                  v-if="selectedVariant.phanTramGiam > 0"
                  class="badge bg-success"
                >
                  Giảm {{ selectedVariant.phanTramGiam }}%
                </span>

                <h3 class="text-danger fw-bold">
                  {{
                      selectedVariant.phanTramGiam > 0
                        ? Number(selectedVariant.gia * (100 - selectedVariant.phanTramGiam) / 100).toLocaleString('vi-VN')
                        : Number(selectedVariant.gia).toLocaleString('vi-VN')
                  }}₫ / đêm
                </h3>
              </div>


              <div class="main-button">
                <button type="button" @click="goBooking" style="width:100%; text-align:center; display:block;">
                  Xác nhận đặt phòng
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

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
.thumbnail-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.thumbnail-img {
  width: 90px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0.6;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.thumbnail-img:hover {
  opacity: 1;
}

.thumbnail-img.active {
  opacity: 1;
  border-color: #f35525;
}
.single-property {
  padding: 60px 0;
}

.main-content p {
  line-height: 1.7;
  color: #555;
}
.main-image {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

.main-button button {
  background-color: #f35525;
  color: #fff;
  border: none;
  padding: 12px 16px;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.main-button button:hover {
  background-color: #d84a1f;
}

.main-image:hover .main-room-image {
  transform: scale(1.02);
}

.main-room-image {
  transition: opacity 0.3s ease, transform 0.4s ease;
}
.thumbnail-list {
  margin-top: 15px;
}

.thumbnail-img {
  box-shadow: 0 5px 15px rgba(0,0,0,0.12);
}

.thumbnail-img.active {
  transform: scale(1.05);
}
.variant-box {
  border-radius: 16px;
  padding: 24px;
  background: #fff;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
  position: sticky;
  top: 100px;
}
.price-box {
  padding: 15px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fff5f0, #ffffff);
  border: 1px dashed #f35525;
}

.price-box h3 {
  margin-top: 8px;
}
.main-button{
  padding: 14px 0;
}
.main-button a {
  display: block;
  text-align: center;
  border-radius: 30px;
  background: linear-gradient(135deg, #f35525, #ff7a4d);
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.main-button a:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(243, 85, 37, 0.45);
}

</style>