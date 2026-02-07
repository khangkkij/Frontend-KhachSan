<script setup>
import { ref, computed, onMounted } from "vue";
import { watch } from "vue"
import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();
const API = import.meta.env.VITE_API_URL;
const filter = ref("*");
const dsPhong = ref([]);
const loading = ref(true);
const currentPage = ref(1)
const pageSize = 9
const keyword = ref("")
const minPrice = ref(null)
const maxPrice = ref(null)
const onlyAvailable = ref(false)
const sale=ref(null)
const bedType = ref("*")
const guests = ref(null)
const kid = ref(null)
const minArea = ref(null)
const loaiPhong = ref([])

onMounted(async () => {
  const q = route.query

  if (q.keyword) keyword.value = q.keyword
  if (q.minPrice) minPrice.value = Number(q.minPrice)
  if (q.maxPrice) maxPrice.value = Number(q.maxPrice)
  if (q.onlyAvailable === 'true') onlyAvailable.value = true
  if (q.kid) kid.value = Number(q.kid)
  if (q.guests) guests.value = Number(q.guests)
  if (q.minArea) minArea.value = Number(q.minArea)

  try {
    const res = await axios.get(`${API}/api/DanhSachPhong`)
    dsPhong.value = res.data.danhSach
    loaiPhong.value = res.data.loaiPhong
  } catch (err) {
    console.error("Lỗi Load phòng: ", err)
  } finally {
    loading.value = false
  }
})


const totalPages = computed(() => {
  if (!Array.isArray(filteredRooms.value)) return 1
  return Math.ceil(filteredRooms.value.length / pageSize)
})

// dữ liệu hiển thị theo trang
const pagedRooms = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRooms.value.slice(start, start + pageSize)
})

// danh sách trang có dấu ...
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    // ít trang → hiện hết
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)

    if (current > 4) pages.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 3) pages.push('...')

    pages.push(total)
  }

  return pages
})
const goPage = (page) => {
  if (page === '...' || page < 1 || page > totalPages.value) return
  currentPage.value = page
}
const getFinalPrice = (room) => {
  if (room.phanTramGiam > 0) {
    return room.giaGoc * (100 - room.phanTramGiam) / 100
  }
  return room.giaGoc
}
const filteredRooms = computed(() => {
  let result = [...dsPhong.value]
  if (filter.value !== "*") {
    result = result.filter(r => r.tenLoai === filter.value)
  }
  if (keyword.value.trim()) {
    const key = keyword.value.toLowerCase()
    result = result.filter(r =>
      r.tenBienThe?.toLowerCase().includes(key) ||
      r.tenLoai?.toLowerCase().includes(key)
    )
  }
  if (minPrice.value !== null) {
  result = result.filter(r => getFinalPrice(r) >= minPrice.value)
  }

  if (maxPrice.value !== null) {
    result = result.filter(r => getFinalPrice(r) <= maxPrice.value)
  }

  if (onlyAvailable.value) {
    result = result.filter(r => r.soPhongCon > 0)
  }
  if (guests.value !== null) {
    result = result.filter(r => r.soNguoiLon >= guests.value)
  }
  if (kid.value !== null) {
    result = result.filter(r => r.soTreEm >= kid.value)
  }
  if (minArea.value !== null) {
    result = result.filter(r => r.dienTich >= minArea.value)
  }

  return result
})
watch(
  [filter, keyword, minPrice, maxPrice, onlyAvailable, bedType, guests, minArea],
  () => currentPage.value = 1
)
</script>
<template>
  <div>
    <div class="page-heading header-text">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <span class="breadcrumb">
              <router-link to="/">Trang chủ</router-link> / Danh sách phòng
            </span>
            <h3>Các Căn Phòng Tốt Nhất</h3>
          </div>
        </div>
      </div>
    </div>

    <div class="section properties">
      <div class="container">
        <div class="filter-wrapper p-4 bg-white shadow-sm rounded-4 mb-4">
          <div class="row g-3 align-items-end">
            <div class="col-lg-5 col-md-12">
              <label class="form-label fw-bold small text-muted">TÌM KIẾM PHÒNG</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-search"></i></span>
                <input 
                  v-model="keyword" 
                  type="text" 
                  class="form-control bg-light border-start-0 ps-0" 
                  placeholder="Nhập tên phòng hoặc loại phòng..."
                />
              </div>
            </div>

            <div class="col-lg-4 col-md-8">
              <label class="form-label fw-bold small text-muted">KHOẢNG GIÁ (VNĐ)</label>
              <div class="input-group">
                <input v-model.number="minPrice" type="number" class="form-control bg-light" placeholder="Từ">
                <span class="input-group-text bg-light border-start-0 border-end-0">→</span>
                <input v-model.number="maxPrice" type="number" class="form-control bg-light" placeholder="Đến">
              </div>
            </div>

            <div class="col-lg-3 col-md-4 d-flex align-items-center justify-content-lg-end">
              <div class="form-check form-switch custom-switch">
                <input v-model="onlyAvailable" class="form-check-input" type="checkbox" id="available">
                <label class="form-check-label fw-medium" for="available">Phòng còn trống</label>
              </div>
            </div>
          </div>

          <hr class="my-4 text-muted opacity-25">

          <div class="row g-3">
            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text bg-transparent border-0 ps-0"><i class="bi bi-people"></i></span>
                <input 
                  v-model.number="kid" 
                  type="number" 
                  min="1" 
                  class="form-control border-0 border-bottom rounded-0 shadow-none" 
                  placeholder="Số lượng trẻ em"
                />
              </div>
            </div>

            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text bg-transparent border-0 ps-0"><i class="bi bi-people"></i></span>
                <input 
                  v-model.number="guests" 
                  type="number" 
                  min="1" 
                  class="form-control border-0 border-bottom rounded-0 shadow-none" 
                  placeholder="Số lượng người lớn"
                />
              </div>
            </div>

            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text bg-transparent border-0 ps-0"><i class="bi bi-layers"></i></span>
                <input 
                  v-model.number="minArea" 
                  type="number" 
                  class="form-control border-0 border-bottom rounded-0 shadow-none" 
                  placeholder="Diện tích từ (m²)"
                />
              </div>
            </div>
          </div>
        </div>

        <ul class="properties-filter">
  <!-- TẤT CẢ -->
  <li>
    <a
      href="javascript:void(0)"
      :class="{ is_active: filter === '*' }"
      @click="filter = '*'"
    >
      Tất cả
    </a>
  </li>

  <!-- LOẠI PHÒNG ĐỘNG -->
  <li
    v-for="lp in loaiPhong"
    :key="lp.maLp"
  >
    <a
      href="javascript:void(0)"
      :class="{ is_active: filter === lp.tenLoai }"
      @click="filter = lp.tenLoai"
    >
      {{ lp.tenLoai.replace('Phòng ', '') }}
    </a>
  </li>
</ul>


        <div class="row properties-box">
          <div
            v-for="room in pagedRooms"
            :key="room.maBienThePhong"
            class="col-lg-4 col-md-6 align-self-center mb-30 properties-items"
          >
            <div class="item">
              <div class="thumb">
                <span v-if="room.phanTramGiam > 0" class="sale-badge">
                  -{{ room.phanTramGiam }}%
                </span>

                <router-link :to="`/phong/${room.maBienThePhong}`">
                  <img :src="`${API}/${room.anhDaiDien}`" />
                </router-link>
              </div>

              <div class="d-flex justify-content-between align-items-start">
                <!-- Bên trái -->
                <span class="category">{{ room.tenLoai }}</span>

                <!-- Bên phải: Giá -->
                <div class="text-end">
                  <!-- GIÁ GỐC (giữ chỗ) -->
                  <div
                    class="text-muted text-decoration-line-through small"
                    :style="{
                      visibility: room.phanTramGiam > 0 ? 'visible' : 'hidden',
                    }"
                  >
                    {{ Number(room.giaGoc).toLocaleString("vi-VN") }} VNĐ
                  </div>

                  <!-- GIÁ SAU GIẢM / GIÁ THƯỜNG -->
                  <div
                    class="fw-bold"
                    :class="room.phanTramGiam > 0 ? 'text-danger' : ''"
                  >
                    {{
                      room.phanTramGiam > 0
                        ? Number(
                            (room.giaGoc * (100 - room.phanTramGiam)) / 100,
                          ).toLocaleString("vi-VN")
                        : Number(room.giaGoc).toLocaleString("vi-VN")
                    }}
                    VNĐ / đêm
                  </div>
                </div>
              </div>

              <h4>
                <router-link :to="`/phong/${room.maBienThePhong}`">
                  {{ room.tenBienThe }}, Hướng {{ room.huongNhin }}
                </router-link>
              </h4>

              <ul>
                <li>
                  Số người tối đa: <span>{{ room.soNguoiToiDa }}</span>
                </li>
                <li>
                  Diện tích: <span>{{ room.dienTich }} m²</span>
                </li>
                <li>
                  Phòng trống: <span>{{ room.soPhongCon }}</span>
                </li>
                <li v-if="room.phanTramGiam > 0">
                  Giảm giá: <span>{{ room.phanTramGiam }}%</span>
                </li>
              </ul>

              <div class="main-button">
                <router-link
                  :to="room.soPhongCon > 0 ? `/phong/${room.maBienThePhong}` : ''"
                  class="btn-book"
                  :class="{ disabled: room.soPhongCon === 0 }"
                  :aria-disabled="room.soPhongCon === 0"
                  @click.prevent="room.soPhongCon === 0"
                >
                  {{ room.soPhongCon > 0 ? 'Đặt phòng' : 'Hết phòng' }}
                </router-link>
              </div>

            </div>
          </div>

          <div v-if="loading">Đang tải dữ liệu...</div>
        </div>

        <div class="row">
          <div class="col-lg-12">
            <ul class="pagination justify-content-center">

              <!-- Previous -->
              <li :class="['page-item', { disabled: currentPage === 1 }]">
                <a class="page-link" href="#" @click.prevent="goPage(currentPage - 1)">
                  &laquo;
                </a>
              </li>

              <!-- Page numbers -->
              <li
                v-for="(page, index) in visiblePages"
                :key="index"
                :class="['page-item', { active: page === currentPage, disabled: page === '...' }]"
              >
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="goPage(page)"
                  
                >
                  {{ page }}
                </a>
              </li>

              <!-- Next -->
              <li :class="['page-item', { disabled: currentPage === totalPages }]">
                <a class="page-link" href="#" @click.prevent="goPage(currentPage + 1)">
                  &raquo;
                </a>
              </li>

            </ul>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styling to make it pop */
.filter-wrapper {
  border: 1px solid #eee;
  transition: all 0.3s ease;
}

.form-control, .form-select {
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
}

.form-control:focus, .form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
  background-color: #fff !important;
}

/* Biến đổi Switch thành dạng hiện đại hơn */
.custom-switch .form-check-input {
  width: 2.5em;
  height: 1.25em;
  cursor: pointer;
}

/* Loại bỏ mũi tên tăng giảm của input number để UI sạch hơn */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-group-text {
  color: #6c757d;
}
/* Fix kích thước ảnh cho đều nhau */
.properties .item .thumb {
  overflow: hidden;
  height: 260px; /* Chiều cao cố định */
}
.properties .item .thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cắt ảnh vừa khung mà không méo */
  transition: all 0.3s;
}
.properties .item:hover .thumb img {
  transform: scale(1.1); /* Phóng to nhẹ khi hover */
}

/* Style cho nút active của bộ lọc */
.properties-filter li a.is_active {
  background-color: #f35525;
  color: #fff;
}
.properties .item {
  background: #fff;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  height: 100%;
}

.properties .item:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}
.sale-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #f35525;
  color: #fff;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 20px;
  box-shadow: 0 6px 12px rgba(243, 85, 37, 0.4);
  z-index: 2;
}
.price-old {
  font-size: 13px;
  color: #999;
}

.price-new {
  font-size: 18px;
  font-weight: 700;
  color: #f35525;
}
.main-button a {
  display: block;
  text-align: center;
  border-radius: 25px;
  background: linear-gradient(135deg, #f35525, #ff7a4d);
  color: #fff;
  transition: all 0.3s ease;
}

.main-button a:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(243, 85, 37, 0.4);
}
.pagination .page-link {
  display: flex;
  align-items: center;        /* căn giữa dọc */
  justify-content: center;    /* căn giữa ngang */

  width: 40px;
  height: 40px;               /* QUAN TRỌNG */
  padding: 0;

  color: #f35525;
  border-radius: 50%;
  border: none;
  font-weight: 500;
  line-height: 1;
}


.pagination .page-item.active .page-link {
  background: linear-gradient(135deg, #f35525, #ff7a4d);
  color: #fff;
  box-shadow: 0 5px 12px rgba(243, 85, 37, 0.4);
}

.pagination .page-item.disabled .page-link {
  color: #ccc;
  pointer-events: none;
  background: none;
}

</style>
