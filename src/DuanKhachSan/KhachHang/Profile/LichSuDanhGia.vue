<template>
    <div class="review-history-page">
        <div class="page-heading header-text">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12 text-center">
                        <h3 class="fw-bold">Đánh Giá Của Tôi</h3>
                    </div>
                </div>
            </div>
        </div>

        <div class="container my-5">
            <div class="row">
                <div class="col-lg-4 mb-4">
                    <ProfileSidebar :user="{ name: 'Nguyễn Tấn Thành' }" activePage="reviews" />
                </div>

                <div class="col-lg-8">
                    <div class="shopee-tabs-container">
                        <div class="shopee-tab-item" :class="{ active: currentTab === 'pending' }"
                            @click="currentTab = 'pending'">
                            Chưa đánh giá
                        </div>
                        <div class="shopee-tab-item" :class="{ active: currentTab === 'completed' }"
                            @click="currentTab = 'completed'">
                            Đã đánh giá
                        </div>
                    </div>

                    <div class="main-card mt-3">
                        <div v-if="filteredReviews.length > 0">
                            <div v-for="item in filteredReviews" :key="item.id" class="review-card">
                                <div class="d-flex align-items-start">
                                    <img :src="item.roomImage" class="room-img-thumb" alt="Room">
                                    
                                    <div class="flex-grow-1 ms-3">
                                        <div class="d-flex justify-content-between">
                                            <h6 class="fw-bold mb-1">{{ item.roomName }}</h6>
                                            <span class="text-muted small">{{ item.date }}</span>
                                        </div>
                                        <p class="text-muted small mb-2">Phân loại: {{ item.roomType }}</p>

                                        <div v-if="currentTab === 'completed'" class="review-content">
                                            <div class="stars mb-1">
                                                <i v-for="n in 5" :key="n" class="fa fa-star" 
                                                   :class="{ 'text-warning': n <= item.rating, 'text-light-gray': n > item.rating }"></i>
                                            </div>
                                            <p class="review-text italic">"{{ item.comment }}"</p>
                                        </div>

                                        <div v-else class="mt-2 text-end">
                                            <button class="btn-review" @click="openReviewModal(item)">
                                                Viết đánh giá
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-else class="text-center py-5">
                            <i class="fa fa-comment-slash fa-3x text-light mb-3"></i>
                            <p class="text-muted">Không có đánh giá nào ở mục này.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showModal" class="modal-backdrop fade show"></div>
        <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content custom-modal">
                    <div class="modal-header">
                        <h5 class="modal-title fw-bold">Đánh giá sản phẩm</h5>
                        <button type="button" class="btn-close" @click="showModal = false"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p class="mb-2">Bạn cảm thấy phòng như thế nào?</p>
                        <div class="star-rating-input mb-3">
                            <i v-for="n in 5" :key="n" class="fa fa-star fa-2x cursor-pointer"
                               :class="n <= userRating ? 'text-warning' : 'text-secondary'"
                               @click="userRating = n"></i>
                        </div>
                        <textarea v-model="userComment" class="form-control" rows="4" placeholder="Chia sẻ trải nghiệm của bạn về phòng nhé..."></textarea>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-light rounded-pill px-4" @click="showModal = false">Trở lại</button>
                        <button class="btn btn-orange rounded-pill px-4" @click="submitReview">Gửi đánh giá</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProfileSidebar from './ProfileSidebar.vue';

// 1. Quản lý Tab
const currentTab = ref('pending');

// 2. Dữ liệu mẫu
const reviews = ref([
    { 
        id: 101, roomName: 'Luxury Villa Da Lat', roomType: 'Villa Nguyên Căn', 
        date: '20/10/2023', status: 'completed', rating: 5, 
        comment: 'Phòng cực đẹp, view săn mây tuyệt vời!', 
        roomImage: 'https://via.placeholder.com/100' 
    },
    { 
        id: 102, roomName: 'Sea View Apartment', roomType: 'Căn hộ 2 giường', 
        date: '15/11/2023', status: 'pending', rating: 0, 
        comment: '', 
        roomImage: 'https://via.placeholder.com/100' 
    }
]);

// 3. Logic lọc
const filteredReviews = computed(() => {
    return reviews.value.filter(r => r.status === currentTab.value);
});

// 4. Logic Modal đánh giá
const showModal = ref(false);
const selectedItem = ref(null);
const userRating = ref(5);
const userComment = ref('');

const openReviewModal = (item) => {
    selectedItem.value = item;
    showModal.value = true;
};

const submitReview = () => {
    // Logic gửi đánh giá (giả lập)
    if (selectedItem.value) {
        selectedItem.value.status = 'completed';
        selectedItem.value.rating = userRating.value;
        selectedItem.value.comment = userComment.value;
    }
    showModal.value = false;
    userComment.value = '';
    userRating.value = 5;
};
</script>

<style scoped>
/* TAB STYLE (Đồng bộ với DonHang.vue) */
.shopee-tabs-container {
    display: flex;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.shopee-tab-item {
    flex: 1;
    text-align: center;
    padding: 15px 0;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    font-weight: 500;
}
.shopee-tab-item.active {
    color: #f35525;
    border-bottom-color: #f35525;
}

/* REVIEW CARD */
.main-card {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
}
.review-card {
    padding: 20px 0;
    border-bottom: 1px solid #f0f0f0;
}
.review-card:last-child { border-bottom: none; }

.room-img-thumb {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
}

.review-text {
    font-style: italic;
    color: #555;
    background: #f9f9f9;
    padding: 10px;
    border-radius: 4px;
    font-size: 14px;
}

/* BUTTONS */
.btn-review {
    background: #f35525;
    color: #fff;
    border: none;
    padding: 6px 18px;
    border-radius: 4px;
    font-size: 13px;
    transition: 0.3s;
}
.btn-review:hover { opacity: 0.8; }
.btn-orange { background: #f35525; color: #fff; }

/* RATING */
.text-light-gray { color: #e0e0e0; }
.cursor-pointer { cursor: pointer; }

/* MODAL */
.custom-modal { border-radius: 12px; border: none; }
</style>