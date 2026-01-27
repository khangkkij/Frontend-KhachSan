<template>
  <div class="service-manager">
    <h4 class="page-title mb-4">Danh sách Dịch vụ</h4>
    
    <div class="row">
        <div class="service-card" v-for="item in services" :key="item.id">
            <div class="img-container">
                <img :src="item.img" alt="food">
            </div>
            <div class="card-body">
                <h5 class="service-name">{{ item.name }}</h5>
                <p class="service-price">{{ formatPrice(item.price) }}</p>
                <button class="btn btn-outline-primary w-100">
                    <i class='bx bx-plus'></i> Thêm vào đơn
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const services = ref([
    { id: 1, name: 'Mì bò trứng', price: 45000, img: 'https://via.placeholder.com/300x200' },
    { id: 2, name: 'Cơm chiên dương châu', price: 50000, img: 'https://via.placeholder.com/300x200' },
    { id: 3, name: 'Pepsi', price: 15000, img: 'https://via.placeholder.com/300x200' },
    { id: 4, name: 'Khăn lạnh', price: 5000, img: 'https://via.placeholder.com/300x200' },
]);

const formatPrice = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
</script>

<style scoped>
.page-title { color: #566a7f; margin-top: 0; }
.mb-4 { margin-bottom: 1.5rem; }
.row { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }

.service-card { background: #fff; border-radius: 0.75rem; box-shadow: 0 2px 6px rgba(67,89,113,0.12); overflow: hidden; transition: transform 0.2s; }
.service-card:hover { transform: translateY(-3px); }

.img-container { height: 140px; overflow: hidden; }
.img-container img { width: 100%; height: 100%; object-fit: cover; }

.card-body { padding: 1rem; text-align: center; }
.service-name { margin: 0 0 0.5rem 0; font-size: 1rem; color: #566a7f; }
.service-price { color: #71dd37; font-weight: bold; margin-bottom: 1rem; }

.btn { padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; font-weight: 500; transition: 0.2s; }
.btn-outline-primary { border: 1px solid #696cff; color: #696cff; background: #fff; }
.btn-outline-primary:hover { background: #696cff; color: #fff; }
.w-100 { width: 100%; }
</style>