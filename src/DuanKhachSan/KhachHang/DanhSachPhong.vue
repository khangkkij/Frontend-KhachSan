<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;
const filter = ref("*");
const dsPhong = ref([]);
const loading = ref(true);
onMounted(async () => {
  try {
    const res = await axios.get(`${API}/api/DanhSachPhong`);
    dsPhong.value = res.data;
    console.log("ds type:", typeof res.data);
    console.log("is array:", Array.isArray(res.data));
    console.log("item đầu tiên:", res.data[0]);
  } catch (err) {
    console.error("Lỗi Load phòng: ", err);
  } finally {
    loading.value = false;
  }
});
// Logic lọc phòng
const filteredRooms = computed(() => {
  if (filter.value === "*") {
    return dsPhong.value;
  }
  return dsPhong.value.filter((room) => room.tenLoai === filter.value);
});
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
        <ul class="properties-filter">
          <li>
            <a
              href="javascript:void(0)"
              :class="{ is_active: filter === '*' }"
              @click="filter = '*'"
              >Tất cả</a
            >
          </li>
          <li>
            <a
              href="javascript:void(0)"
              :class="{ is_active: filter === 'Standard' }"
              @click="filter = 'Standard'"
              >Tiêu chuẩn</a
            >
          </li>
          <li>
            <a
              href="javascript:void(0)"
              :class="{ is_active: filter === 'Deluxe' }"
              @click="filter = 'Deluxe'"
              >Cao cấp</a
            >
          </li>
        </ul>

        <div class="row properties-box">
          <div
            v-for="room in filteredRooms"
            :key="room.maBienThePhong"
            class="col-lg-4 col-md-6 align-self-center mb-30 properties-items"
          >
            <div class="item">
              <div class="thumb">
                <span v-if="room.phanTramGiam > 0" class="sale-badge">
                  -{{ room.phanTramGiam }}%
                </span>

                <router-link :to="`/phong/${room.maBienThePhong}`">
                  <img :src="`${API}/images/${room.anhDaiDien}`" />
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
                  {{ room.tenBienThe }}
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
                <router-link :to="`/phong/${room.maBienThePhong}`">
                  Đặt phòng
                </router-link>
              </div>
            </div>
          </div>

          <div v-if="loading">Đang tải dữ liệu...</div>
        </div>

        <div class="row">
          <div class="col-lg-12">
            <ul class="pagination">
              <li><a href="#">1</a></li>
              <li><a class="is_active" href="#">2</a></li>
              <li><a href="#">3</a></li>
              <li><a href="#">>></a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
