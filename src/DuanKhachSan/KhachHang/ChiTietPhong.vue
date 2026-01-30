<script setup>
import axios from 'axios';
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute();
const roomId = route.params.id;
const API = import.meta.env.VITE_API_URL
const room = ref(null)
const loading = ref(true)
const imageOpacity = ref(1)
const bienThePhong = ref([])
const currentImage = ref('')
const selectedVariantId = ref(null)
const bienTheNgauNhien=ref([])
const tienIch=ref([])
const iconMap = {
  'wifi-icon': 'fa-wifi',
  'pool-icon': 'fa-person-swimming',
  'food-icon': 'fa-utensils',
  'parking-icon': 'fa-square-parking',
  'tv-icon': 'fa-tv'
}

const selectedVariant = computed(() => {
  return bienThePhong.value?.find(
    bt => bt.maBienThePhong === selectedVariantId.value
  )
})
function chonBienThe(bt) {
  if (bt.soPhongCon === 0) return
  selectedVariantId.value = bt.maBienThePhong
}
const changeImage = (img) => {
  imageOpacity.value = 0
  setTimeout(() => {
    currentImage.value = `${API}/${img}`
    imageOpacity.value = 1
  }, 150)
}
onMounted(async() => {
  const res=await axios.get(`${API}/api/ChiTietPhong/${roomId}`)
  room.value=res.data.chiTiet
  bienTheNgauNhien.value=res.data.bienTheNgauNhien
  tienIch.value=res.data.chiTiet.tienIch
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
  initSelectedVariant(roomId)
})
const canBook = computed(() => {
  return selectedVariant.value
    && selectedVariant.value.soPhongCon > 0
})
const initSelectedVariant = (roomId) => {
  if (!bienThePhong.value.length) return

  const exist = bienThePhong.value.find(
    bt => bt.maBienThePhong == roomId
  )

  if (exist) {
    selectedVariantId.value = exist.maBienThePhong
  } else {
    selectedVariantId.value = bienThePhong.value[0].maBienThePhong
  }
}
watch(
  () => route.params.id,
  async (newId) => {
    loading.value = true
    const res = await axios.get(`${API}/api/ChiTietPhong/${newId}`)
    room.value = res.data.chiTiet
    bienTheNgauNhien.value = res.data.bienTheNgauNhien
    tienIch.value = res.data.chiTiet.tienIch
    bienThePhong.value = res.data?.bienTheKhac ?? []

    if (bienThePhong.value.length > 0) {
      selectedVariantId.value = bienThePhong.value[0].maBienThePhong
    }
    initSelectedVariant(newId)
    loading.value = false
  }
)
watch(selectedVariant, (val) => {
  if (val?.danhSachAnh?.length) {
    currentImage.value = `${API}/${val.danhSachAnh[0]}`
  } else {
    currentImage.value = '' // optional fallback
  }
})
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
                :src="`${API}/${img}`"
                class="thumbnail-img"
                :class="{ active: currentImage.includes(img) }"
                @click="changeImage(img)"
              />
            </div>

            <div class="room-detail-container p-4 bg-white shadow-lg rounded-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold">
                  <i class="bi bi-tag-fill me-1"></i> {{ room.tenLoai }}
                </span>
                <span v-if="selectedVariant" class="status-indicator" :class="selectedVariant.soPhongCon > 0 ? 'text-success' : 'text-danger'">
                  <i class="bi bi-circle-fill fs-xs me-1"></i>
                  Còn&nbsp;<strong>{{selectedVariant.soPhongCon}}</strong> &nbsp;phòng trống
                </span>
              </div>

              <div class="main-header mb-4">
                <h2 class="fw-bold text-dark mb-1" v-if="selectedVariant">
                  {{ selectedVariant.tenBienThe }}, hướng {{ selectedVariant.huongNhin }}
                </h2>
                <p class="text-muted" v-if="selectedVariant">
                  <i class="bi bi-geo-alt-fill me-1"></i> Hướng nhìn: {{ selectedVariant.huongNhin }}
                </p>
              </div>

              <div class="row g-4">
                <div class="col-lg-8">
                  <section class="mb-4">
                    <h5 class="section-title">Mô tả chi tiết</h5>
                    <p class="room-description text-secondary leading-relaxed">
                      {{ room.moTa }}
                    </p>
                  </section>

                  <section class="amenities-section">
                    <h5 class="section-title">Tiện ích đi kèm</h5>
                    <div class="amenity-grid mt-3">
                      <div
                        v-for="ti in tienIch"
                        :key="ti.maTi"
                        class="amenity-item"
                      >
                        <div class="icon-wrapper">
                          <i class="fa-solid" :class="iconMap[ti.icon] || 'fa-check'"></i>
                        </div>
                        <span>{{ ti.tenTienIch }}</span>
                      </div>
                    </div>
                  </section>
                </div>

                <div class="col-lg-4">
                  <div class="info-card p-4 rounded-4 bg-light border-0">
                    <h5 class="fw-bold mb-3">Thông tin phòng</h5>
                    
                    <div class="info-item d-flex align-items-center mb-3">
                      <i class="bi bi-people fs-4 me-3 text-primary"></i>
                      <div>
                        <small class="text-muted d-block">Sức chứa</small>
                        <span class="fw-medium text-dark">{{ selectedVariant?.soNguoiToiDa }} người lớn</span>
                      </div>
                    </div>

                    <div class="info-item d-flex align-items-center mb-3">
                      <i class="bi bi-luggage fs-4 me-3 text-primary"></i>
                      <div>
                        <small class="text-muted d-block">Loại giường</small>
                        <span class="fw-medium text-dark">{{ selectedVariant?.loaiGiuong }}</span>
                      </div>
                    </div>

                    <div class="info-item d-flex align-items-center mb-3">
                      <i class="bi bi-compass fs-4 me-3 text-primary"></i>
                      <div>
                        <small class="text-muted d-block">View</small>
                        <span class="fw-medium text-dark">{{ selectedVariant?.huongNhin }}</span>
                      </div>
                    </div>

                    <div class="note-box mt-4 p-3 rounded-3 bg-warning-subtle border-start border-warning border-4">
                      <p class="small text-dark mb-0">
                        <strong>Lưu ý:</strong> Giá chưa bao gồm VAT. Vui lòng thanh toán trước 50% để giữ chỗ.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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

            <div class="variant-box mt-4 border-0 rounded-4 shadow-sm bg-white">
              <h5 class="px-4 pt-4 mb-3 fw-bold text-dark border-start border-primary border-4 ps-3">
                Tùy chọn phòng
              </h5>

              <!-- LIST SCROLL -->
              <div class="variant-list px-4 pb-3">
                <div
                  v-for="bt in bienThePhong"
                  :key="bt.maBienThePhong"
                  class="variant-card p-3 rounded-3 transition-all mb-3"
                  :class="{
                    'active-variant': selectedVariantId === bt.maBienThePhong,
                    'disabled-variant': bt.soPhongCon === 0
                  }"
                  @click="chonBienThe(bt)"
                >
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 class="fw-bold mb-2">{{ bt.tenBienThe }}</h6>

                      <div class="d-flex gap-3 mb-2 text-secondary small">
                        <span><i class="bi bi-people me-1"></i>{{ bt.soNguoiToiDa }} người</span>
                        <span><i class="bi bi-layers me-1"></i>{{ bt.dienTich }} m²</span>
                      </div>

                      <div v-if="bt.soPhongCon > 0" class="text-success small">
                        ● Còn {{ bt.soPhongCon }} phòng
                      </div>
                      <div v-else class="text-danger small">
                        ● Hết phòng
                      </div>
                    </div>

                    <input
                      type="radio"
                      class="form-check-input mt-1"
                      :checked="selectedVariantId === bt.maBienThePhong"
                      :disabled="bt.soPhongCon === 0"
                    />
                  </div>

                  <div class="mt-3 d-flex justify-content-between align-items-end">
                    <div>
                      <div
                        v-if="bt.phanTramGiam > 0"
                        class="small text-decoration-line-through text-muted"
                      >
                        {{ bt.gia.toLocaleString('vi-VN') }}₫
                      </div>

                      <div class="fw-bold text-primary fs-4">
                        {{ (bt.gia * (100 - bt.phanTramGiam) / 100).toLocaleString('vi-VN') }}₫
                        <span class="fs-6 fw-normal text-muted">/ đêm</span>
                      </div>
                    </div>

                    <span
                      v-if="bt.phanTramGiam > 0"
                      class="badge rounded-pill bg-danger-soft text-danger px-3 py-2"
                    >
                      -{{ bt.phanTramGiam }}%
                    </span>
                  </div>
                </div>
              </div>

              <!-- FOOTER STICKY -->
              <div class="variant-footer">
                <router-link
                  :to="canBook 
                    ? { path: '/booking', query: { variantId: selectedVariantId } } 
                    : ''"
                  class="btn btn-lg w-100 fw-bold btn-orange-gradient py-3 rounded-3"
                  :class="{ 'disabled opacity-50 pointer-events-none': !canBook }"
                >
                  <span v-if="canBook">XÁC NHẬN ĐẶT PHÒNG</span>
                  <span v-else>HẾT PHÒNG</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="related-rooms section mt-5">
  <div class="container">
    <div class="row">
      <div class="col-lg-12">
        <div class="section-heading d-flex justify-content-between align-items-center mb-4">
          <h2 class="fw-bold">Phòng khách sạn tương tự</h2>
          <router-link to="/danh-sach-phong" class="text-primary text-decoration-none">
            Xem tất cả <i class="fa fa-arrow-right ms-1"></i>
          </router-link>
        </div>
      </div>
    </div>

    <div class="row properties-box">
      <div 
        v-for="roomItem in bienTheNgauNhien" 
        :key="roomItem.maBienThePhong" 
        class="col-lg-4 col-md-6 align-self-center mb-30 properties-items"
      >
        <div class="item card-phong-tuong-tu">
          <div class="thumb">
            <span v-if="roomItem.phanTramGiam > 0" class="sale-badge">
              -{{ roomItem.phanTramGiam }}%
            </span>
            <router-link :to="`/phong/${roomItem.maBienThePhong}`">
              <img :src="`${API}/${roomItem.anhDaiDien}`" />
            </router-link>
          </div>

          <div class="d-flex justify-content-between align-items-start">
            <span class="category">{{ roomItem.tenLoai }}</span>
            <div class="text-end">
              <div
                class="text-muted text-decoration-line-through small"
                :style="{ visibility: roomItem.phanTramGiam > 0 ? 'visible' : 'hidden' }"
              >
                {{ Number(roomItem.giaGoc).toLocaleString("vi-VN") }} VNĐ
              </div>
              <div
                class="fw-bold"
                :style="roomItem.phanTramGiam > 0 ? { color: '#dc3545' } : {}"
              >
                {{
                  roomItem.phanTramGiam > 0
                    ? Number((roomItem.giaGoc * (100 - roomItem.phanTramGiam)) / 100).toLocaleString("vi-VN")
                    : Number(roomItem.giaGoc).toLocaleString("vi-VN")
                }}
                VNĐ / đêm
              </div>
            </div>
          </div>

          <h4 class="mt-2">
            <router-link :to="`/phong/${roomItem.maBienThePhong}`">
              {{ roomItem.tenBienThe }}
            </router-link>
          </h4>

          <div class="room-info-row">
            <div style="margin-left: 30px;">Số người tối đa: <span>{{ roomItem.soNguoiToiDa }}</span></div>
            <div style="margin-right: 100px;">Diện tích: <span>{{ roomItem.dienTich }} m²</span></div>
          </div>

          <div class="room-info-row mt-1">
            <div style="margin-left: 30px;">Phòng trống: <span>{{ roomItem.soPhongCon }}</span></div>
          </div>


          <div class="main-button mt-3">
            <router-link
              :to="roomItem.soPhongCon > 0 ? `/phong/${roomItem.maBienThePhong}` : ''"
              class="btn-book"
              :class="{ disabled: roomItem.soPhongCon === 0 }"
              :aria-disabled="roomItem.soPhongCon === 0"
              @click.prevent="roomItem.soPhongCon === 0"
            >
              {{ roomItem.soPhongCon > 0 ? 'Đặt phòng' : 'Hết phòng' }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
      </div>
</template>

<style scoped>
/* Phông chữ & Khoảng cách */
.room-detail-container {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
}

.section-title {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 3px;
  background: #0d6efd;
  border-radius: 2px;
}

/* Grid Tiện ích */
.amenity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.amenity-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  transition: all 0.2s;
}

.icon-wrapper {
  width: 32px;
  height: 32px;
  background: #e9ecef;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #198754; /* Success color */
}

/* Card thông tin bên phải */
.info-card {
  position: sticky;
  top: 20px;
}

.status-indicator {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.fs-xs {
  font-size: 0.6rem;
}

.room-description {
  white-space: pre-line; /* Giữ các dòng xuống hàng từ database */
  text-align: justify;
}
.amenities-list .badge {
  font-size: 15px;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.25s ease;
}

.amenities-list .badge:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
}

.amenities-list .badge i {
  font-size: 14px;
}

/* Copy style từ trang danh sách phòng */
.properties-box .item h4 {
  margin-top: 6px;
  margin-bottom: 8px;
}
.room-info-row {
  margin-top: 6px;
  padding-top: 4px;
}

.main-button {
  margin-top: 18px;
}

.properties-box .item {
  padding: 14px 18px 20px; /* trên | trái-phải | dưới */
}
.category {
  margin-top: 12px;
}

.properties-items {
  display: flex;
}

.properties-items .item {
  flex: 1;
}

.room-info-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #4a4a4a;
}

.room-info-row span {
  font-weight: 600;
}

.properties-box .item {
  background: #fff;
  border-radius: 22px;        /* bo tròn hơn */
  padding: 18px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  height: 100%;
  position: relative;
  overflow: hidden;           /* ⭐ QUAN TRỌNG */
}

.properties-box .item:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.properties-box .item .thumb {
  overflow: hidden;
  height: 240px;
  border-radius: 18px;        /* bo giống mẫu */
  position: relative;
}

.properties-box .item .thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sale-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: #ff5a2c;
  color: #fff;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px; /* tròn pill */
  box-shadow: 0 8px 16px rgba(255, 90, 44, 0.4);
  z-index: 3;
}

.room-info-list {
  list-style: none;
  padding: 0;
  margin: 15px 0;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.room-info-list li {
  font-size: 14px;
  color: #4a4a4a;
  margin-bottom: 8px;
}

.room-info-list li span {
  font-weight: 00;
  float: right;
}

.properties-box .item h4 a {
  font-size: 19px;
  font-weight: 700;
  color: #1e1e1e;
  text-decoration: none;
  transition: all 0.3s;
}

.properties-box .item h4 a:hover {
  color: #f35525;
}

.category {
  background-color: #fbd9cf;
  color: black;
  padding: 4px 12px;
  border-radius: 5px;
  font-weight: 500;
  font-size: 14px;
}
.variant-box {
  max-height: 75vh;
  display: flex;
  flex-direction: column;
}

/* list scroll */
.variant-list {
  overflow-y: auto;
  flex: 1;
}

/* footer dính đáy */
.variant-footer {
  position: sticky;
  bottom: 0;
  background: #fff;
  padding: 16px;
  border-top: 1px solid #eee;
  box-shadow: 0 -8px 20px rgba(0, 0, 0, 0.08);
  z-index: 10;
}
.btn-orange-gradient {
  /* Dải màu cam từ đậm sang nhạt hơn một chút */
  background: linear-gradient(135deg, #f35525 0%, #ff7a4d 100%);
  border: none;
  color: white !important;
  transition: all 0.3s ease;
  text-transform: uppercase; /* Viết hoa để nhìn mạnh mẽ hơn */
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-orange-gradient:hover:not(.disabled) {
  /* Khi rê chuột vào: hơi sáng lên và nổi khối hơn */
  background: linear-gradient(135deg, #ff7a4d 0%, #f35525 100%);
  box-shadow: 0 8px 20px rgba(243, 85, 37, 0.35);
  transform: translateY(-2px);
}

.btn-orange-gradient:active:not(.disabled) {
  /* Khi nhấn vào: lún xuống nhẹ */
  transform: translateY(1px);
}

/* Hiệu ứng khi chưa chọn phòng */
.disabled {
  background: #ccc !important;
  cursor: not-allowed;
  box-shadow: none !important;
}
.transition-all {
  transition: all 0.25s ease-in-out;
}

.pointer {
  cursor: pointer;
}

/* Card Style */
.variant-card {
  background: #f8f9fa;
  border-color: #e9ecef !important;
  position: relative;
}

.variant-card:hover:not(.disabled-variant) {
  border-color: #0d6efd !important;
  background: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Active State */
.active-variant {
  border-color: #0d6efd !important;
  background: #f0f7ff !important;
  box-shadow: 0 0 0 1px #0d6efd;
}

/* Stock Status */
.stock-status {
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  display: inline-block;
}
.green-dot { background-color: #28a745; box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2); }
.red-dot { background-color: #dc3545; }

.price-old { color: #adb5bd; }
.bg-danger-soft { background-color: #fff5f5; border: 1px solid #feb2b2; }

/* Nút đặt phòng */
.btn-booking {
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #0d6efd 0%, #0052cc 100%);
  border: none;
  color: white !important;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-booking:hover {
  filter: brightness(1.1);
  transform: scale(1.01);
}

.disabled-variant {
  opacity: 0.6;
  filter: grayscale(0.5);
  cursor: not-allowed;
}

/* Radio Button bự hơn cho dễ bấm */
.form-check-input {
  width: 1.3em;
  height: 1.3em;
  cursor: pointer;
}
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