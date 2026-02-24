<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ProfileSidebar from '@/DuanKhachSan/KhachHang/Profile/ProfileSidebar.vue'

const currentTab = ref('pending');
const pendingReviews = ref([]);
const completedReviews = ref([]);

// Biến điều khiển Modal và dữ liệu đánh giá
const showModal = ref(false);
const selectedItem = ref(null);
const userRating = ref(5); // Mức độ hài lòng mặc định là 5 sao
const userComment = ref('');
const selectedFile = ref(null);

const BASE_URL = 'https://localhost:7023';

// --- HÀM TRỢ GIÚP ---
const getRoomUrl = (path) => path ? `${BASE_URL}/uploads/rooms/${path}` : 'https://via.placeholder.com/80';
const getReviewUrl = (path) => path ? `${BASE_URL}/uploads/reviews/${path}` : '';

// Hàm format ngày để tránh lỗi "Invalid Date"
const formatDate = (dateString) => {
    if (!dateString) return 'Đang cập nhật...';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Ngày không hợp lệ' : date.toLocaleString('vi-VN');
};

const fetchReviews = async () => {
    try {
        const [resPending, resCompleted] = await Promise.all([
            axios.get(`${BASE_URL}/api/DanhGia/cho-danh-gia`, { withCredentials: true }),
            axios.get(`${BASE_URL}/api/DanhGia/da-danh-gia`, { withCredentials: true })
        ]);
        pendingReviews.value = resPending.data;
        completedReviews.value = resCompleted.data;
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
};

onMounted(fetchReviews);

// --- XỬ LÝ SỰ KIỆN ---
const openReviewModal = (item) => {
    selectedItem.value = item;
    userRating.value = 5;
    userComment.value = '';
    selectedFile.value = null;
    showModal.value = true;
};

const onFileChange = (e) => {
    selectedFile.value = e.target.files[0];
};

const submitReview = async () => {
    if (!userComment.value.trim()) {
        alert("Vui lòng nhập nội dung đánh giá");
        return;
    }

    try {
        const formData = new FormData();
        formData.append('MaDatPhong', selectedItem.value.maDatPhong);
        formData.append('SoSao', userRating.value);
        formData.append('NoiDung', userComment.value);

        if (selectedFile.value) {
            formData.append('fileAnh', selectedFile.value); // Tên key phải khớp với backend
        }

        const res = await axios.post(`${BASE_URL}/api/DanhGia/gui-danh-gia`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data.success) {
            alert(res.data.message);
            showModal.value = false;
            fetchReviews();
        }
    } catch (error) {
        alert(error.response?.data || "Lỗi khi gửi đánh giá");
    }
};
</script>

<template>
    <div class="container mt-5 mb-5">
        <div class="row">
            <div class="col-lg-3">
                <ProfileSidebar />
            </div>

            <div class="col-lg-9">
                <div class="main-card shadow-sm border-0">
                    <h4 class="mb-4 fw-bold">Đánh giá của tôi</h4>

                    <div class="shopee-tabs-container mb-4">
                        <div class="shopee-tab-item" :class="{ active: currentTab === 'pending' }"
                            @click="currentTab = 'pending'">
                            Chưa đánh giá
                        </div>
                        <div class="shopee-tab-item" :class="{ active: currentTab === 'completed' }"
                            @click="currentTab = 'completed'">
                            Đã đánh giá
                        </div>
                    </div>

                    <div v-if="currentTab === 'pending'">
                        <div v-if="pendingReviews.length === 0" class="text-center py-5 text-muted">Không có phòng chờ
                            đánh giá.</div>
                        <div v-for="item in pendingReviews" :key="item.maDatPhong"
                            class="review-card d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-1 fw-bold">{{ item.tenBienThe }}</h6>
                                <p class="text-muted small mb-0">{{ item.loaiGiuong }} | {{ item.huongNhin }}</p>
                            </div>
                            <button class="btn btn-review" @click="openReviewModal(item)">Viết đánh giá</button>
                        </div>
                    </div>

                    <div v-else-if="currentTab === 'completed'">
                        <div v-if="completedReviews.length === 0" class="text-center py-5 text-muted">Bạn chưa có đánh
                            giá nào.</div>
                        <div v-for="item in completedReviews" :key="item.maDg" class="review-card">
                            <h6 class="fw-bold">{{ item.tenPhong }}</h6>
                            <div class="stars mb-1 text-warning">
                                <i v-for="n in 5" :key="n" class="fa"
                                    :class="n <= item.soSao ? 'fa-star' : 'fa-star-o'"></i>
                            </div>
                            <p class="mb-2">{{ item.noiDung }}</p>
                            <img v-if="item.hinhAnh" :src="getReviewUrl(item.hinhAnh)" class="review-img-preview" />
                            <small class="text-muted d-block mt-2 italic">Đã đánh giá vào: {{
                                formatDate(item.ngayDanhGia) }}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
        <div class="modal-content-custom">
            <h5 class="fw-bold border-bottom pb-3">Đánh giá dịch vụ</h5>
            <div class="my-4 text-center">
                <label class="form-label d-block fw-bold mb-3">Mức độ hài lòng:</label>
                <div class="star-rating-input">
                    <i v-for="n in 5" :key="n" class="fa fa-2x mx-1"
                        :class="n <= userRating ? 'fa-star text-warning' : 'fa-star text-secondary'"
                        @click="userRating = n" style="cursor: pointer;">
                    </i>
                </div>
                <p class="mt-2 fw-bold text-warning">
                    {{ userRating === 1 ? 'Tệ' : userRating === 2 ? 'Không hài lòng' : userRating === 3 ? 'Bình thường'
                        : userRating === 4 ? 'Hài lòng' : 'Tuyệt vời' }}
                </p>
            </div>
            <div class="mb-3 text-start">
                <label class="form-label fw-bold">Nội dung đánh giá:</label>
                <textarea class="form-control" rows="3" v-model="userComment"
                    placeholder="Chia sẻ trải nghiệm của bạn..."></textarea>
            </div>
            <div class="mb-3 text-start">
                <label class="form-label fw-bold">Ảnh thực tế:</label>
                <input type="file" class="form-control" @change="onFileChange" accept="image/*" />
            </div>
            <div class="d-flex justify-content-end gap-2 mt-4">
                <button class="btn btn-secondary" @click="showModal = false">Đóng</button>
                <button class="btn btn-review-submit px-4 shadow-sm" @click="submitReview">Gửi đánh giá</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* CSS đồng bộ Sneat/Shopee style */
.main-card {
    background: #fff;
    padding: 25px;
    border-radius: 8px;
    min-height: 500px;
}

.shopee-tabs-container {
    display: flex;
    border-bottom: 1px solid #eee;
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

.review-card {
    padding: 20px 0;
    border-bottom: 1px solid #f8f8f8;
}

.review-img-preview {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #ddd;
}

.btn-review {
    background: #f35525;
    color: white;
    border: none;
    padding: 6px 15px;
    border-radius: 4px;
}

.btn-review-submit {
    background: #f35525;
    color: white;
    border: none;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-content-custom {
    background: #fff;
    padding: 30px;
    border-radius: 12px;
    width: 480px;
    text-align: center;
}

.text-secondary {
    color: #dcdcdc !important;
}

/* Màu xám cho sao chưa chọn */
.italic {
    font-style: italic;
}
</style>