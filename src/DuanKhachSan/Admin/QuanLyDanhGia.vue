<template>
    <div class="review-manager-container">
        <div class="card card-custom mb-4 shadow-sm border-0">
            <div class="card-body d-flex justify-content-between align-items-center row gap-3 gap-md-0">
                <div class="col-md-4">
                    <h5 class="card-title fw-bold text-primary mb-0">
                        <i class='bx bx-star me-2'></i>Quản lý Đánh giá
                    </h5>
                </div>
                <div class="col-md-8 text-md-end">
                    <div class="d-flex align-items-center justify-content-md-end gap-3">
                        <div class="input-group input-group-custom" style="max-width: 300px;">
                            <span class="input-group-text bg-white"><i class="bx bx-search"></i></span>
                            <input type="text" class="form-control" placeholder="Tìm tên khách, phòng..."
                                v-model="searchQuery" @input="resetToFirstPage" />
                        </div>
                        <select class="form-select w-auto shadow-none" v-model="filterStar" @change="resetToFirstPage">
                            <option value="0">Tất cả số sao</option>
                            <option v-for="n in 5" :key="n" :value="n">{{ n }} Sao</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="card card-custom shadow-sm border-0">
            <div class="table-responsive text-nowrap">
                <div v-if="isLoading" class="loading-state text-center py-5">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-2 text-muted">Đang tải danh sách đánh giá...</p>
                </div>

                <table v-else class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th class="ps-4">Khách hàng / Phòng</th>
                            <th>Đánh giá</th>
                            <th>Nội dung</th>
                            <th>Hình ảnh</th>
                            <th>Ngày gửi</th>
                            <th>Ngày Phản hồi</th>
                            <th>Nội dung phản hồi</th>
                            <th class="text-center">Trạng thái</th>
                            <th class="text-center">Tác vụ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in reviews" :key="item.maDg">
                            <td class="ps-4">
                                <div class="d-flex flex-column">
                                    <span class="fw-bold text-heading">{{ item.tenKhachHang }}</span>
                                    <small class="text-primary fw-medium">
                                        <i class='bx bx-door-open me-1'></i>{{ item.tenPhong || 'N/A' }}
                                    </small>
                                </div>
                            </td>
                            <td>
                                <div class="stars-display mb-1 text-warning">
                                    <i v-for="n in 5" :key="n" class='bx'
                                        :class="n <= item.soSao ? 'bxs-star' : 'bx-star'"></i>
                                </div>
                            </td>
                            <td>
                                <div class="text-wrap small" style="max-width: 200px;" :title="item.noiDung">
                                    {{ item.noiDung }}
                                </div>
                            </td>
                            <td>
                                <div v-if="item.hinhAnh" class="review-img-wrapper">
                                    <img :src="getReviewUrl(item.hinhAnh)" class="img-thumbnail-custom shadow-sm" />
                                </div>
                                <span v-else class="text-muted small italic">Không có ảnh</span>
                            </td>
                            <td>
                                <small class="text-muted d-block">{{ formatDate(item.ngayDanhGia) }}</small>
                            </td>
                            <td>
                                <small class="text-muted d-block">{{ formatDate(item.ngayPhanHoi) }}</small>
                            </td>
                            <td>
                                <div class="text-wrap small italic text-primary" style="max-width: 180px;">
                                    {{ item.phanHoi || '(Chưa có)' }}
                                </div>
                            </td>
                            <td class="text-center">
                                <span class="badge-custom" :class="item.phanHoi ? 'role-manager' : 'role-housekeeping'">
                                    {{ item.phanHoi ? 'Đã phản hồi' : 'Chưa phản hồi' }}
                                </span>
                            </td>
                            <td class="text-center">
                                <button class="btn-icon btn-edit me-1" @click="openReplyModal(item)" title="Phản hồi">
                                    <i class='bx bx-reply'></i>
                                </button>
                                <button class="btn-icon btn-delete" @click="confirmDelete(item)" title="Xóa">
                                    <i class="bx bx-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="card-footer border-top bg-white px-4 py-3">
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">
                        Hiển thị {{ (currentPage - 1) * pageSize + 1 }} -
                        {{ Math.min(currentPage * pageSize, totalItems) }} trên tổng số {{ totalItems }}
                    </small>
                    <nav>
                        <ul class="pagination pagination-sm mb-0">
                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                <button class="page-link" @click="changePage(currentPage - 1)">
                                    <i class='bx bx-chevron-left'></i>
                                </button>
                            </li>
                            <li v-for="page in totalPages" :key="page" class="page-item"
                                :class="{ active: currentPage === page }">
                                <button class="page-link" @click="changePage(page)">{{ page }}</button>
                            </li>
                            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                <button class="page-link" @click="changePage(currentPage + 1)">
                                    <i class='bx bx-chevron-right'></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>

        <div v-if="showModal" class="modal-backdrop-custom">
            <div class="modal-dialog-custom shadow-lg">
                <div class="modal-content border-0">
                    <div class="modal-header bg-light">
                        <h5 class="modal-title fw-bold text-primary"><i class='bx bx-reply me-2'></i>Phản hồi đánh giá
                        </h5>
                        <button @click="showModal = false" class="btn-close-custom border-0 bg-transparent">
                            <i class='bx bx-x fs-3'></i>
                        </button>
                    </div>
                    <div class="modal-body p-4">
                        <div
                            class="customer-review-info p-3 bg-lighter rounded mb-4 border-start border-primary border-4 shadow-xs">
                            <p class="mb-1 small fw-bold text-uppercase">Khách hàng: {{ selectedReview?.tenKhachHang }}
                            </p>
                            <p class="mb-0 italic text-muted">"{{ selectedReview?.noiDung }}"</p>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Nội dung phản hồi của bạn:</label>
                            <textarea v-model="replyText" class="form-control" rows="5"
                                placeholder="Nhập nội dung phản hồi tại đây..."></textarea>
                        </div>
                        <div class="text-end pt-2">
                            <button class="btn btn-label-secondary me-2 px-4" @click="showModal = false">Hủy bỏ</button>
                            <button class="btn btn-primary px-4 shadow-sm" @click="submitReply"
                                :disabled="!replyText.trim()">
                                Gửi phản hồi <i class='bx bx-send ms-1'></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/QuanLyDanhGia`;
const IMG_BASE_URL = `${import.meta.env.VITE_API_URL}`;

// --- State Phân trang ---
const reviews = ref([]);
const totalItems = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const isLoading = ref(false);
const searchQuery = ref('');
const filterStar = ref(0);
const showModal = ref(false);
const selectedReview = ref(null);
const replyText = ref('');

const totalPages = computed(() => {
    const total = Math.ceil(totalItems.value / pageSize.value);
    return total > 0 ? total : 1;
});

const fetchReviews = async () => {
    isLoading.value = true;
    try {
        const res = await axios.get(`${API_URL}/danh-sach`, {
            params: {
                page: currentPage.value,
                pageSize: pageSize.value,
                // Gửi thêm search/star nếu Backend hỗ trợ lọc phân trang
                search: searchQuery.value,
                star: filterStar.value
            }
        });

        // CHỈNH SỬA QUAN TRỌNG: Gán lại đúng thuộc tính từ object trả về
        reviews.value = res.data.data;
        totalItems.value = res.data.totalItems;
    } catch (e) {
        console.error("Lỗi khi tải dữ liệu:", e);
    } finally {
        // Luôn tắt loading kể cả khi lỗi
        isLoading.value = false;
    }
};

const changePage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    fetchReviews();
};

const resetToFirstPage = () => {
    currentPage.value = 1;
    fetchReviews();
};

const getReviewUrl = (path) => `${IMG_BASE_URL}/uploads/reviews/${path}`;

const formatDate = (d) => {
    if (!d) return '---';
    const date = new Date(d);
    return isNaN(date.getTime()) ? '---' : date.toLocaleDateString('vi-VN');
};

const openReplyModal = (item) => {
    selectedReview.value = item;
    replyText.value = item.phanHoi || '';
    showModal.value = true;
};

const submitReply = async () => {
    try {
        await axios.put(`${API_URL}/phan-hoi/${selectedReview.value.maDg}`, {
            noiDungPhanHoi: replyText.value
        });
        alert("Đã gửi phản hồi thành công!");
        showModal.value = false;
        fetchReviews();
    } catch (e) {
        alert("Lỗi khi gửi phản hồi!");
    }
};

const confirmDelete = async (item) => {
    if (confirm(`Bạn có chắc muốn xóa đánh giá của ${item.tenKhachHang}?`)) {
        try {
            await axios.delete(`${API_URL}/xoa/${item.maDg}`);
            fetchReviews();
        } catch (e) {
            alert("Lỗi khi thực hiện xóa!");
        }
    }
};

onMounted(fetchReviews);
</script>

<style scoped>
/* Đồng bộ theo Style của trang Quản lý Nhân sự */
.card-custom {
    border-radius: 0.75rem;
    background: #fff;
}

.input-group-custom {
    border-radius: 0.375rem;
    overflow: hidden;
    border: 1px solid #d9dee3;
}

.img-thumbnail-custom {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #ddd;
}

.badge-custom {
    padding: 0.45rem 0.65rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    display: inline-block;
}

.role-manager {
    background-color: #e7e7ff;
    color: #696cff;
}

.role-housekeeping {
    background-color: #fff2d6;
    color: #ffab00;
}

.btn-icon {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
    cursor: pointer;
}

.btn-edit {
    background: #e7e7ff;
    color: #696cff;
}

.btn-delete {
    background: #ffe0db;
    color: #ff3e1d;
}

.modal-backdrop-custom {
    position: fixed;
    inset: 0;
    background: rgba(67, 89, 113, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
}

.modal-dialog-custom {
    background: #fff;
    width: 95%;
    max-width: 550px;
    border-radius: 0.5rem;
    overflow: hidden;
}

.bg-lighter {
    background-color: #f5f5f9;
}

.italic {
    font-style: italic;
}

/* Pagination Styling */
.pagination .page-link {
    color: #696cff;
    border: 1px solid #d9dee3;
    margin: 0 2px;
    border-radius: 4px;
}

.pagination .page-item.active .page-link {
    background-color: #696cff;
    border-color: #696cff;
    color: #fff;
}

.pagination .page-item.disabled .page-link {
    color: #b4bdc6;
    pointer-events: none;
    background-color: #fcfcfd;
}
</style>