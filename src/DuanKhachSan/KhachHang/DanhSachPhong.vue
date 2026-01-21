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
            <a href="javascript:void(0)" :class="{ is_active: filter === '*' }" @click="filter = '*'">Tất cả</a>
          </li>
          <li>
            <a href="javascript:void(0)" :class="{ is_active: filter === 'Phòng Deluxe' }" @click="filter = 'Phòng Deluxe'">Deluxe</a>
          </li>
          <li>
            <a href="javascript:void(0)" :class="{ is_active: filter === 'Biệt thự' }" @click="filter = 'Biệt thự'">Biệt thự</a>
          </li>
          <li>
            <a href="javascript:void(0)" :class="{ is_active: filter === 'Penthouse' }" @click="filter = 'Penthouse'">Penthouse</a>
          </li>
        </ul>

        <div class="row properties-box">
          <div v-for="room in filteredRooms" :key="room.id" class="col-lg-4 col-md-6 align-self-center mb-30 properties-items">
            <div class="item">
              <div class="thumb">
                <router-link :to="'/phong/' + room.id">
                    <img :src="room.image" :alt="room.name" />
                </router-link>
              </div>
              
              <span class="category">{{ room.type }}</span>
              <h6>{{ room.price }} VNĐ</h6>
              
              <h4>
                <router-link :to="'/phong/' + room.id">{{ room.name }}</router-link>
              </h4>
              
              <ul>
                <li>Số người: <span>{{ room.maxPeople }}</span></li>
                <li>Phòng ngủ: <span>{{ room.bedrooms }}</span></li>
                <li>Diện tích: <span>{{ room.area }}m2</span></li>
                <li>Tầng: <span>{{ room.floor }}</span></li>
                <li>Đậu xe: <span>{{ room.parking }}</span></li>
              </ul>
              
              <div class="main-button">
                 <router-link :to="'/phong/' + room.id">Đặt lịch xem</router-link>
              </div>
            </div>
          </div>
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

<script setup>
import { ref, computed } from 'vue'

// State quản lý bộ lọc
const filter = ref('*')

// Dữ liệu giả lập (Sau này sẽ lấy từ API)
const rooms = ref([
  {
    id: 1,
    name: 'Phòng Deluxe – 202',
    type: 'Phòng Deluxe',
    price: '1.200.000',
    maxPeople: 2,
    image: '/assets/images/property-01.jpg',
    area: 250,
    bedrooms: 2,
    bathrooms: 2,
    floor: '2',
    parking: '2 xe'
  },
  {
    id: 2,
    name: 'Biệt thự View Biển – 105',
    type: 'Biệt thự',
    price: '2.500.000',
    maxPeople: 6,
    image: '/assets/images/property-02.jpg',
    area: 450,
    bedrooms: 4,
    bathrooms: 3,
    floor: '1',
    parking: '4 xe'
  },
  {
    id: 3,
    name: 'Penthouse Hoàng Gia',
    type: 'Penthouse',
    price: '5.000.000',
    maxPeople: 8,
    image: '/assets/images/property-03.jpg',
    area: 320,
    bedrooms: 5,
    bathrooms: 5,
    floor: '26',
    parking: 'VIP'
  },
  {
    id: 4,
    name: 'Căn Hộ Cao Cấp – 404',
    type: 'Phòng Deluxe',
    price: '1.800.000',
    maxPeople: 3,
    image: '/assets/images/property-04.jpg',
    area: 120,
    bedrooms: 2,
    bathrooms: 1,
    floor: '4',
    parking: '1 xe'
  },
  {
    id: 5,
    name: 'Biệt thự Vườn – 007',
    type: 'Biệt thự',
    price: '3.200.000',
    maxPeople: 5,
    image: '/assets/images/property-05.jpg',
    area: 500,
    bedrooms: 3,
    bathrooms: 3,
    floor: 'Trệt',
    parking: '2 xe'
  },
  {
    id: 6,
    name: 'Penthouse Sky View',
    type: 'Penthouse',
    price: '6.500.000',
    maxPeople: 10,
    image: '/assets/images/property-06.jpg',
    area: 400,
    bedrooms: 6,
    bathrooms: 6,
    floor: '30',
    parking: 'VIP'
  }
]);

// Logic lọc phòng
const filteredRooms = computed(() => {
  if (filter.value === '*') {
    return rooms.value;
  }
  return rooms.value.filter(room => room.type === filter.value);
})
</script>

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
</style>