<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';

// Nhận roomId từ cha
const props = defineProps({
  roomId: {
    type: [String, Number],
    required: true
  }
});

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7023';

// State
const reviews = ref([]);
const currentPage = ref(1);
const itemsPerPage = 3; // Số review mỗi trang
const isLoading = ref(false);
const errorMessage = ref('');
const currentFilter = ref('all'); // State lưu trạng thái lọc: 'all', 5, 4, 3, 2, 1

// --- HÀM GỌI API ---
const fetchReviews = async () => {
  errorMessage.value = '';
  if (!props.roomId) return;

  isLoading.value = true;
  try {
    const res = await axios.get(`${API_URL}/api/DanhGia/GetByRoom/${props.roomId}`);
    reviews.value = res.data || [];
  } catch (error) {
    console.error("Lỗi API:", error);
    errorMessage.value = "Không thể tải đánh giá.";
    reviews.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => { fetchReviews(); });

watch(() => props.roomId, () => {
  currentFilter.value = 'all'; // Reset bộ lọc khi đổi phòng
  currentPage.value = 1;
  fetchReviews();
});

// --- HELPER FUNCTIONS ---
const getAvatarUrl = (avatarName, userName) => {
  if (!avatarName) {
    const encodedName = encodeURIComponent(userName || 'K');
    return `https://ui-avatars.com/api/?name=${encodedName}&background=f35525&color=fff&size=128`;
  }
  if (avatarName.startsWith('http')) return avatarName;
  return `${API_URL}/images/${avatarName}`;
};

const getReviewImageUrl = (imgName) => {
  if (!imgName) return null;
  return `${API_URL}/uploads/reviews/${imgName}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (e) { return dateString; }
};

const starPercentage = computed(() => {
  const rating = parseFloat(averageRating.value) || 0;
  return `${(rating / 5) * 100}%`;
});
// --- LOGIC LỌC & PHÂN TRANG MỚI ---

// 1. Danh sách đã lọc theo sao
const filteredReviews = computed(() => {
  if (currentFilter.value === 'all') {
    return reviews.value;
  }
  return reviews.value.filter(r => (r.soSao || 0) === currentFilter.value);
});

// 2. Tính toán phân trang dựa trên danh sách ĐÃ LỌC
const totalPages = computed(() => Math.ceil(filteredReviews.value.length / itemsPerPage));

const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredReviews.value.slice(start, end);
});

// 3. Tính điểm trung bình (trên tổng tất cả review, không ảnh hưởng bởi bộ lọc)
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const sum = reviews.value.reduce((acc, curr) => acc + (curr.soSao || 0), 0);
  return (sum / reviews.value.length).toFixed(1);
});

// Hàm đổi bộ lọc
const setFilter = (star) => {
  currentFilter.value = star;
  currentPage.value = 1; // Reset về trang 1 khi đổi bộ lọc
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
};
</script>

<template>
  <div class="review-section mt-5" id="reviews">
    <div class="container">
      <div class="section-heading mb-4">
        <h2 class="fw-bold">Đánh giá & Nhận xét</h2>
        <div class="heading-line"></div>
      </div>

      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-orange" role="status"><span class="visually-hidden">Loading...</span></div>
      </div>

      <div v-else>

        <div class="filter-box bg-light p-4 rounded-4 mb-4 border border-light-subtle">
          <div class="row align-items-center">
            <div class="col-md-3 text-center border-end-md">
              <div class="d-flex flex-column align-items-center justify-content-center h-100">

                <h1 class="display-4 fw-bold text-orange mb-0">
                  {{ averageRating }}<span class="fs-4 text-muted">/5</span>
                </h1>

                <div class="star-rating-container mb-2">
                  <div class="stars-back">
                    <i v-for="n in 5" :key="n" class="fa fa-star"></i>
                  </div>
                  <div class="stars-front" :style="{ width: starPercentage }">
                    <i v-for="n in 5" :key="n" class="fa fa-star"></i>
                  </div>
                </div>
                <small class="text-muted">({{ reviews.length }} đánh giá)</small>
              </div>
            </div>

            <div class="col-md-9 ps-md-5 mt-3 mt-md-0">
              <h6 class="fw-bold mb-3 text-dark">Lọc theo số sao:</h6>
              <div class="d-flex flex-wrap gap-2">
                <button class="btn filter-btn px-4 py-2 rounded-pill" :class="{ 'active': currentFilter === 'all' }"
                  @click="setFilter('all')">
                  Tất cả
                </button>

                <button v-for="star in [5, 4, 3, 2, 1]" :key="star" class="btn filter-btn px-3 py-2 rounded-pill"
                  :class="{ 'active': currentFilter === star }" @click="setFilter(star)">
                  {{ star }} Sao
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="review-list-wrapper">

          <div v-if="filteredReviews.length === 0" class="text-center py-5 text-muted">
            <i class="fa fa-search fs-1 mb-3 opacity-50"></i>
            <p>Không tìm thấy đánh giá nào phù hợp với bộ lọc.</p>
          </div>

          <div v-else>
            <div v-for="review in paginatedReviews" :key="review.maDg"
              class="review-item bg-white p-4 rounded-4 shadow-sm mb-3 border position-relative">
              <div class="d-flex justify-content-between align-items-start">
                <div class="d-flex gap-3">
                  <div class="avatar-wrapper">
                    <img :src="getAvatarUrl(review.avatar, review.tenKhachHang)" class="rounded-circle shadow-sm"
                      width="50" height="50" style="object-fit: cover;">
                  </div>
                  <div>
                    <h6 class="fw-bold mb-1 text-dark">{{ review.tenKhachHang }}</h6>
                    <div class="rating-stars small">
                      <i v-for="n in 5" :key="n" class="fa fa-star"
                        :class="n <= (review.soSao || 0) ? 'text-orange' : 'text-muted-light'"></i>
                    </div>
                  </div>
                </div>
                <small class="text-muted bg-light px-3 py-1 rounded-pill">
                  {{ formatDate(review.ngayDanhGia) }}
                </small>
              </div>

              <div class="review-content mt-3 text-secondary">
                {{ review.noiDung }}
              </div>

              <div v-if="review.hinhAnh" class="review-images mt-3">
                <img :src="getReviewImageUrl(review.hinhAnh)" class="img-thumbnail rounded-3"
                  style="max-width: 200px; cursor: pointer;"
                  @click="window.open(getReviewImageUrl(review.hinhAnh), '_blank')" alt="Ảnh đánh giá">
              </div>

              <div v-if="review.phanHoi"
                class="hotel-reply mt-4 ms-4 p-3 bg-light rounded-3 border-start border-3 border-primary">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <div class="fw-bold text-primary small">
                    <i class="fa fa-reply me-1"></i> Phản hồi từ khách sạn
                  </div>
                  <small v-if="review.ngayPhanHoi" class="text-muted fst-italic">
                    {{ formatDate(review.ngayPhanHoi) }}
                  </small>
                </div>
                <div class="small text-dark">{{ review.phanHoi }}</div>
              </div>
            </div>
          </div>

          <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
            <nav>
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link rounded-circle mx-1 border-0" @click="changePage(currentPage - 1)"><i
                      class="fa fa-angle-left"></i></button>
                </li>
                <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                  <button class="page-link rounded-circle mx-1 border-0 fw-bold" @click="changePage(page)">{{ page
                  }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link rounded-circle mx-1 border-0" @click="changePage(currentPage + 1)"><i
                      class="fa fa-angle-right"></i></button>
                </li>
              </ul>
            </nav>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Màu chủ đạo */
.text-orange {
  color: #f35525 !important;
}

.bg-orange {
  background-color: #f35525 !important;
}

.text-muted-light {
  color: #e9ecef;
}

.heading-line {
  width: 60px;
  height: 3px;
  background-color: #f35525;
  margin-top: 10px;
}

/* Filter Box Style */
.filter-box {
  background-color: #f8f9fa;
  /* Màu nền nhẹ */
}

.border-end-md {
  border-right: 1px solid #dee2e6;
}

@media (max-width: 768px) {
  .border-end-md {
    border-right: none;
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 20px;
  }
}

/* Nút bộ lọc */
.filter-btn {
  background-color: white;
  border: 1px solid #dee2e6;
  color: #6c757d;
  font-weight: 500;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: #f35525;
  color: #f35525;
  background-color: #fff5f2;
}

.filter-btn.active {
  background-color: #f35525;
  /* Active màu cam */
  color: white;
  border-color: #f35525;
  box-shadow: 0 4px 10px rgba(243, 85, 37, 0.3);
}

/* Review Item */
.review-item {
  transition: transform 0.2s;
}

.review-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
}

/* Pagination */
.page-link {
  color: #333;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.page-item.active .page-link {
  background-color: #f35525;
  color: white;
}

/* --- THÊM CSS MỚI CHO SAO --- */
.star-rating-container {
  position: relative;
  display: inline-block;
  font-size: 1.25rem;
  /* Điều chỉnh kích thước sao ở đây */
  line-height: 1;
}

/* Lớp sao nền (xám nhạt) */
.stars-back {
  color: #e9ecef;
  /* Màu xám */
}

/* Lớp sao chính (cam) */
.stars-front {
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  overflow: hidden;
  /* Cắt phần thừa */
  color: #f35525;
  /* Màu cam chủ đạo */
  transition: width 0.5s ease;
  /* Hiệu ứng mượt khi load */
}

/* Đảm bảo các icon sao nằm ngang hàng ngay ngắn */
.stars-back i,
.stars-front i {
  margin: 0 2px;
  /* Khoảng cách giữa các ngôi sao */
}
.review-images img {
    transition: transform 0.3s ease;
    border: 1px solid #eee;
}

.review-images img:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.hotel-reply {
    position: relative;
    background-color: #f1f8ff !important; /* Đổi màu nền phản hồi nhẹ nhàng hơn */
}

.border-primary {
    border-color: #f35525 !important; /* Sử dụng màu cam chủ đạo của bạn cho border phản hồi */
}

.text-primary {
    color: #f35525 !important;
}
/* --------------------------- */
</style>