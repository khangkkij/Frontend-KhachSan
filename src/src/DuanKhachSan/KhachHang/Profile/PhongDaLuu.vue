<template>
    <div class="saved-rooms-page">
        <div class="page-heading header-text">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <h3>Phòng Đã Lưu</h3>
                        <span class="breadcrumb">
                            <router-link to="/">Trang chủ</router-link> / Yêu thích
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="container my-5">
            <div class="row">
                <div class="col-lg-4 mb-4">
                    <ProfileSidebar :user="user" activePage="saved" />
                </div>

                <div class="col-lg-8">
                    <div class="main-card">
                        <h4 class="section-title">Danh Sách Yêu Thích</h4>

                        <div class="row">
                            <div class="col-md-6" v-for="room in savedRooms" :key="room.id">
                                <div class="saved-room-item">
                                    <router-link :to="'/phong/' + room.id">
                                        <img :src="room.image" class="room-img" :alt="room.name">
                                    </router-link>

                                    <div class="room-body">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <span class="room-price">{{ room.price }}</span>
                                            <button class="btn-remove" @click="removeRoom(room.id)">
                                                <i class="fa fa-trash"></i> Xóa
                                            </button>
                                        </div>

                                        <router-link :to="'/phong/' + room.id" class="room-title">
                                            {{ room.name }}
                                        </router-link>
                                        <p class="room-address">
                                            <i class="fa fa-map-marker-alt text-muted"></i> {{ room.address }}
                                        </p>

                                        <router-link :to="'/phong/' + room.id"
                                            class="btn btn-sm btn-dark w-100 rounded-pill">
                                            Đặt Ngay
                                        </router-link>
                                    </div>
                                </div>
                            </div>

                            <div v-if="savedRooms.length === 0" class="col-12 text-center py-5">
                                <div class="text-muted">
                                    <i class="fa fa-heart-broken fa-3x mb-3"></i>
                                    <p>Bạn chưa lưu phòng nào vào danh sách yêu thích.</p>
                                    <router-link to="/danh-sach-phong" class="btn btn-outline-danger rounded-pill mt-2">
                                        Khám phá ngay
                                    </router-link>
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
import { ref } from 'vue';
// 1. Import Component Sidebar
import ProfileSidebar from './ProfileSidebar.vue';

// Dữ liệu User
const user = ref({
    name: 'Nguyễn Tấn Thành'
});

// Danh sách phòng đã lưu (Giả lập)
const savedRooms = ref([
    {
        id: 1,
        name: 'Biệt Thự Vườn Đà Lạt',
        price: '2.500.000đ',
        address: 'Phường 10, Đà Lạt',
        image: '/assets/images/property-01.jpg'
    },
    {
        id: 2,
        name: 'Căn Hộ View Biển',
        price: '4.200.000đ',
        address: 'Bãi Sau, Vũng Tàu',
        image: '/assets/images/property-02.jpg'
    },
    {
        id: 3,
        name: 'Penthouse Landmark 81',
        price: '5.500.000đ',
        address: 'Bình Thạnh, TP.HCM',
        image: '/assets/images/property-03.jpg'
    }
]);

// Hàm xóa phòng khỏi danh sách
const removeRoom = (id) => {
    const confirm = window.confirm("Bạn có chắc muốn xóa phòng này khỏi danh sách yêu thích?");
    if (confirm) {
        savedRooms.value = savedRooms.value.filter(room => room.id !== id);
    }
};
</script>

<style scoped>
/* Màu chủ đạo */
.text-orange {
    color: #f35525 !important;
}

/* Main Card */
.main-card {
    background: #fff;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    min-height: 600px;
}

.section-title {
    font-size: 20px;
    margin-bottom: 30px;
    border-bottom: 3px solid #eee;
    display: inline-block;
    position: relative;
    padding-bottom: 10px;
}

.section-title::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -3px;
    width: 50px;
    height: 3px;
    background: #f35525;
}

/* --- CSS RIÊNG CHO SAVED ROOMS --- */
.saved-room-item {
    border: 1px solid #eee;
    border-radius: 15px;
    overflow: hidden;
    transition: 0.3s;
    margin-bottom: 25px;
    background: #fff;
}

.saved-room-item:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
    border-color: #f35525;
}

.room-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
}

.room-body {
    padding: 20px;
}

.room-price {
    color: #f35525;
    font-weight: 700;
    font-size: 18px;
}

.room-title {
    font-size: 16px;
    margin: 10px 0;
    display: block;
    color: #1e1e1e;
    font-weight: 600;
    text-decoration: none;
}

.room-title:hover {
    color: #f35525;
}

.room-address {
    font-size: 13px;
    color: #777;
    margin-bottom: 15px;
}

.btn-remove {
    font-size: 13px;
    color: #dc3545;
    background: none;
    border: none;
    padding: 0;
    text-decoration: underline;
    cursor: pointer;
}

.btn-remove:hover {
    color: #a71d2a;
}
</style>