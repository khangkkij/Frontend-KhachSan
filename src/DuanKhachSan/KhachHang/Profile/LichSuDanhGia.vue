<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import ProfileSidebar from '@/DuanKhachSan/KhachHang/Profile/ProfileSidebar.vue';

// --- TRẠNG THÁI (STATE) ---
const currentTab = ref('pending');
const pendingReviews = ref([]);
const completedReviews = ref([]);

// Phân trang
const itemsPerPage = 5;
const pendingPage = ref(1);
const completedPage = ref(1);

// Biến điều khiển Modal và dữ liệu đánh giá
const showModal = ref(false);
const selectedItem = ref(null);
const userRating = ref(5);
const userComment = ref('');
const selectedFile = ref(null);

const BASE_URL = 'https://localhost:7023';

// --- HÀM TRỢ GIÚP ---
const getReviewUrl = (path) => path ? `${BASE_URL}/uploads/reviews/${path}` : '';

const formatDate = (dateString) => {
    if (!dateString) return 'Đang cập nhật...';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Ngày không hợp lệ' : date.toLocaleString('vi-VN');
};

// --- LOGIC PHÂN TRANG (COMPUTED) ---
const paginatedPending = computed(() => {
    const start = (pendingPage.value - 1) * itemsPerPage;
    return pendingReviews.value.slice(start, start + itemsPerPage);
});

const paginatedCompleted = computed(() => {
    const start = (completedPage.value - 1) * itemsPerPage;
    return completedReviews.value.slice(start, start + itemsPerPage);
});

const totalPendingPages = computed(() => Math.ceil(pendingReviews.value.length / itemsPerPage));
const totalCompletedPages = computed(() => Math.ceil(completedReviews.value.length / itemsPerPage));

// --- API CALLS ---
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
const changeTab = (tab) => {
    currentTab.value = tab;
    pendingPage.value = 1;
    completedPage.value = 1;
};

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
            formData.append('fileAnh', selectedFile.value);
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

const deleteReview = async (maDg) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
        const res = await axios.delete(`${BASE_URL}/api/DanhGia/xoa-danh-gia/${maDg}`, { withCredentials: true });
        if (res.data.success) {
            alert(res.data.message);
            fetchReviews();
        }
    } catch (error) {
        alert(error.response?.data?.message || "Không thể xóa đánh giá.");
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
                            @click="changeTab('pending')">
                            Chưa đánh giá
                        </div>
                        <div class="shopee-tab-item" :class="{ active: currentTab === 'completed' }"
                            @click="changeTab('completed')">
                            Đã đánh giá
                        </div>
                    </div>

                    <div v-if="currentTab === 'pending'">
                        <div v-if="pendingReviews.length === 0" class="text-center py-5 text-muted">
                            Không có phòng nào đang chờ bạn đánh giá.
                        </div>
                        <div v-for="item in paginatedPending" :key="item.maDatPhong"
                            class="review-card d-flex justify-content-between align-items-center border-bottom py-3">
                            <div>
                                <span class="badge bg-light text-dark mb-1">Mã đặt phòng: #{{ item.maDatPhong }}</span>
                                <h6 class="mb-1 fw-bold">{{ item.tenBienThe }}</h6>
                                <p class="text-muted small mb-0">{{ item.loaiGiuong }} | {{ item.huongNhin }}</p>
                            </div>
                            <button class="btn btn-review" @click="openReviewModal(item)">Viết đánh giá</button>
                        </div>

                        <div v-if="totalPendingPages > 1" class="pagination-container">
                            <button class="btn-page" :disabled="pendingPage === 1" @click="pendingPage--">Trước</button>
                            <span class="page-info">Trang {{ pendingPage }} / {{ totalPendingPages }}</span>
                            <button class="btn-page" :disabled="pendingPage === totalPendingPages"
                                @click="pendingPage++">Sau</button>
                        </div>
                    </div>

                    <div v-else-if="currentTab === 'completed'">
                        <div v-if="completedReviews.length === 0" class="text-center py-5 text-muted">
                            Bạn chưa có đánh giá nào.
                        </div>
                        <div v-for="item in paginatedCompleted" :key="item.maDg"
                            class="review-card position-relative border-bottom py-4">
                            <button class="btn-delete-action" @click="deleteReview(item.maDg)" title="Xóa đánh giá">
                                <i class="fa fa-trash-o"></i> Xóa
                            </button>
                            <div class="mb-1">
                                <small class="text-primary fw-bold">Mã đặt phòng: #{{ item.maDatPhong }}</small>
                            </div>
                            <h6 class="fw-bold pe-5">{{ item.tenPhong }}</h6>
                            <div class="stars mb-1 text-warning">
                                <i v-for="n in 5" :key="n" class="fa"
                                    :class="n <= item.soSao ? 'fa-star' : 'fa-star-o'"></i>
                            </div>
                            <p class="mb-2 text-dark">{{ item.noiDung }}</p>

                            <div v-if="item.phanHoi" class="reply-box mt-3 p-3 rounded border-start border-4">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <strong class="text-orange"><i class="fa fa-comments-o"></i> Phản hồi từ khách
                                        sạn:</strong>
                                    <small class="text-muted italic" v-if="item.ngayPhanHoi">{{
                                        formatDate(item.ngayPhanHoi) }}</small>
                                </div>
                                <p class="mb-0 text-black fw-medium">{{ item.phanHoi }}</p>
                            </div>

                            <div v-if="item.hinhAnh" class="mt-2">
                                <img :src="getReviewUrl(item.hinhAnh)" class="review-img-preview shadow-sm" />
                            </div>
                            <small class="text-muted d-block mt-2 italic">Đã đánh giá vào: {{
                                formatDate(item.ngayDanhGia) }}</small>
                        </div>

                        <div v-if="totalCompletedPages > 1" class="pagination-container">
                            <button class="btn-page" :disabled="completedPage === 1"
                                @click="completedPage--">Trước</button>
                            <span class="page-info">Trang {{ completedPage }} / {{ totalCompletedPages }}</span>
                            <button class="btn-page" :disabled="completedPage === totalCompletedPages"
                                @click="completedPage++">Sau</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
        <div class="modal-content-custom shadow-lg">
            <h5 class="fw-bold border-bottom pb-3">Đánh giá dịch vụ</h5>
            <div class="my-4 text-center">
                <div class="star-rating-input">
                    <i v-for="n in 5" :key="n" class="fa fa-2x mx-1"
                        :class="n <= userRating ? 'fa-star text-warning' : 'fa-star text-secondary'"
                        @click="userRating = n" style="cursor: pointer;"></i>
                </div>
                <p class="mt-2 fw-bold text-warning">{{ userRating === 5 ? 'Tuyệt vời' : 'Hài lòng' }}</p>
            </div>
            <div class="mb-3 text-start">
                <label class="form-label fw-bold">Nội dung:</label>
                <textarea class="form-control" rows="3" v-model="userComment"
                    placeholder="Chia sẻ trải nghiệm..."></textarea>
            </div>
            <div class="mb-3 text-start">
                <label class="form-label fw-bold">Ảnh thực tế:</label>
                <input type="file" class="form-control" @change="onFileChange" accept="image/*" />
            </div>
            <div class="d-flex justify-content-end gap-2 mt-4">
                <button class="btn btn-light border" @click="showModal = false">Hủy</button>
                <button class="btn btn-review px-4" @click="submitReview">Gửi đánh giá</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.main-card {
    background: #fff;
    padding: 25px;
    border-radius: 12px;
    min-height: 600px;
}

.shopee-tabs-container {
    display: flex;
    border-bottom: 2px solid #f0f0f0;
}

.shopee-tab-item {
    flex: 1;
    text-align: center;
    padding: 15px 0;
    cursor: pointer;
    font-weight: 600;
    color: #555;
    border-bottom: 3px solid transparent;
}

.shopee-tab-item.active {
    color: #f35525;
    border-bottom-color: #f35525;
}

.reply-box {
    background-color: #f9f9f9 !important;
    border-color: #f35525 !important;
}

.text-orange {
    color: #f35525 !important;
}

.text-black {
    color: #000000 !important;
    font-size: 0.95rem;
    line-height: 1.5;
}

.pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    gap: 10px;
}

.btn-page {
    padding: 6px 16px;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    transition: 0.3s;
}

.btn-page:hover:not(:disabled) {
    background: #f35525;
    color: #fff;
    border-color: #f35525;
}

.btn-page:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-info {
    font-weight: 500;
    color: #666;
}

.btn-review {
    background: #f35525;
    color: white;
    border: none;
    padding: 7px 18px;
    border-radius: 6px;
}

.btn-delete-action {
    position: absolute;
    top: 20px;
    right: 0;
    background: #fff;
    border: 1px solid #dc3545;
    color: #dc3545;
    padding: 4px 12px;
    border-radius: 4px;
}

.review-img-preview {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-content-custom {
    background: #fff;
    padding: 30px;
    border-radius: 16px;
    width: 500px;
}

.italic {
    font-style: italic;
}
</style>