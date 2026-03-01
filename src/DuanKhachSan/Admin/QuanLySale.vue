<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import Swal from 'sweetalert2'; 
import api from '../Service/api';
import notify from '../Service/notify'; 

// --- CẤU HÌNH API --- 
const API_SALE = `/api/Sale`;
const API_ROOMS = `${import.meta.env.VITE_API_URL}/api/DanhSachPhong`;

// --- STATE ---
const searchQuery = ref('');
const flashSales = ref([]);
const availableRooms = ref([]); 
const selectedSale = ref(null);

// State cho Modal Sửa/Chi tiết
const tempSelectedIds = ref([]); 
const tempDiscountMap = ref({});

// State cho Modal Tạo mới
const newSale = reactive({
    ngayBatDau: '',
    ngayKetThuc: '',
    selectedIds: [], 
    discountMap: {} 
});

// --- LOGIC TÌM KIẾM ---
const filteredFlashSales = computed(() => {
    if (!searchQuery.value) {
        return flashSales.value;
    }
    const query = searchQuery.value.toLowerCase();
    return flashSales.value.filter(sale => {
        const idMatch = sale.flashsaleid?.toString().toLowerCase().includes(query);       
        const countMatch = sale.tongSoPhong?.toString().includes(query);
        return idMatch || countMatch;
    });
});

// --- LOAD DATA ---
const fetchSale = async () => {
    try {
        const response = await api.get(API_SALE);
        flashSales.value = response.data;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu Flash Sale:', error);
    }
};

const fetchRooms = async () => {
    try {
        const response = await api.get(API_ROOMS);
        availableRooms.value = response.data.danhSach.map(r => ({
            id: r.maBienThePhong, 
            name: r.tenBienThe,
            price: r.giaGoc || 0 
        }));
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu phòng:', error);
    }
};

onMounted(() => {
    fetchSale();
    fetchRooms();
});

// --- HELPER FUNCTIONS ---
const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleString('vi-VN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit' }) : '---';
const formatCurrency = (val) => {
    if (!val || isNaN(val)) return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0);
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};
const getStatusBadge = (status) => {
    if (status === null) return { class: 'badge bg-label-warning', text: 'Sắp diễn ra' };
    if (status === false) return { class: 'badge bg-label-secondary', text: 'Đã kết thúc' };
    return { class: 'badge bg-label-success', text: 'Đang hoạt động' };
};

// --- VALIDATE HELPER ---
const validateSaleDates = (startDate, endDate, currentSaleId = null) => {
   if (!startDate || !endDate) {
        notify.error('Vui lòng chọn đầy đủ thời gian bắt đầu và kết thúc!');
        return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
        notify.error('Thời gian kết thúc phải lớn hơn thời gian bắt đầu!');
        return false;
    }

    const isOverlap = flashSales.value.some(sale => {

        if (currentSaleId && sale.flashsaleid === currentSaleId) {
            return false;
        }
        if (sale.trangThai === false) {
            return false; 
        }

        const existingStart = new Date(sale.ngayBatDau);
        const existingEnd = new Date(sale.ngayKetThuc);

        return start < existingEnd && existingStart < end;
    });

    if (isOverlap) {
        notify.error('Thời gian này đã trùng với một đợt sale khác ĐANG HOẠT ĐỘNG. Vui lòng chọn lịch khác!');
        return false;
    }

    return true;
};

//  OPEN CREATE MODAL
const openCreateModal = () => {
    newSale.ngayBatDau = '';
    newSale.ngayKetThuc = '';
    newSale.selectedIds = [];
    newSale.discountMap = {};
    const modal = new bootstrap.Modal(document.getElementById('createSaleModal'));
    modal.show();
}

//  CREATE NEW SALE 
const handleCreate = async () => {
    // Validate thời gian và trùng lặp
    if (!validateSaleDates(newSale.ngayBatDau, newSale.ngayKetThuc)) {
        return;
    }

    const validDetails = newSale.selectedIds.map(id => ({
        maBienThePhong: id,
        phanTramGiam: parseInt(newSale.discountMap[id] || 0)
    })).filter(d => d.phanTramGiam > 0);

    // Bắt lỗi nếu chưa chọn phòng hoặc điền % giảm
    if (validDetails.length === 0) {
        notify.error('Vui lòng chọn ít nhất 1 loại phòng và nhập % giảm giá hợp lệ!');
        return;
    }

    const payload = {
        ngayBatDau: newSale.ngayBatDau,
        ngayKetThuc: newSale.ngayKetThuc,
        trangThai: true,
        saleDetails: validDetails
    };

    try {
        await api.post(API_SALE, payload);
        
        notify.success('Tạo chiến dịch thành công');
        
        fetchSale(); 
        const modalEl = document.getElementById('createSaleModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
    } catch (error) {
        console.error(error);
    }
}

const openDetailModal = async (id) => {
    try {
        const response = await api.get(`${API_SALE}/${id}`);
        const data = response.data;
 
        if (data.chiTietSales && data.chiTietSales.length > 0) {
            data.chiTietSales = data.chiTietSales.map(detail => {
                const roomMatch = availableRooms.value.find(r => r.name === detail.tenBienThe);
                return {
                    ...detail,
                    maBienThePhong: detail.maBienThePhong || (roomMatch ? roomMatch.id : null),
                    giaGoc: detail.giaGoc || (roomMatch ? roomMatch.price : 0)
                };
            });
        }

        selectedSale.value = data; 
        
        tempSelectedIds.value = [];
        tempDiscountMap.value = {};
        
        const modal = new bootstrap.Modal(document.getElementById('detailSaleModal'));
        modal.show();
    } catch (error) {
        console.error(error);
        notify.error('Không thể tải chi tiết!');
    }
};

// ADD ROOMS TO DETAIL
const addRoomsToDetail = () => {
    if (!selectedSale.value.chiTietSales) {
        selectedSale.value.chiTietSales = [];
    }

    let addedCount = 0;
    tempSelectedIds.value.forEach(roomId => {
        const isExist = selectedSale.value.chiTietSales.some(d => d.maBienThePhong === roomId);
        
        if(!isExist) {
            const room = availableRooms.value.find(r => r.id === roomId);
            const discount = tempDiscountMap.value[roomId];
            
            if(room && discount > 0) {
                const priceOrigin = Number(room.price);
                const priceDiscounted = priceOrigin * (1 - parseInt(discount)/100);

                selectedSale.value.chiTietSales.push({
                    maBienThePhong: room.id,
                    tenBienThe: room.name, 
                    giaGoc: priceOrigin, 
                    phanTramGiam: parseInt(discount),
                    giaSauGiam: priceDiscounted 
                });
                addedCount++;
            }
        }
    });

    if (addedCount > 0) {
        tempSelectedIds.value = [];
        tempDiscountMap.value = {};
        notify.success('Đã thêm phòng vào danh sách!');
    } else {
        notify.info('Vui lòng chọn phòng chưa có trong danh sách và nhập % giảm.');
    }
}

const removeRoomFromDetail = (index) => {
    selectedSale.value.chiTietSales.splice(index, 1);
}

// UPDATE SALE
const handleUpdate = async () => {
    if (!selectedSale.value) return;

    // Validate thời gian (truyền thêm ID hiện tại để bỏ qua check trùng với chính nó)
    if (!validateSaleDates(selectedSale.value.ngayBatDau, selectedSale.value.ngayKetThuc, selectedSale.value.flashsaleid)) {
        return;
    }
    
    if (!selectedSale.value.chiTietSales || selectedSale.value.chiTietSales.length === 0) {
        notify.error('Danh sách phòng áp dụng không được để trống');
        return;
    }

    const invalidRooms = selectedSale.value.chiTietSales.some(x => !x.maBienThePhong);
    if(invalidRooms) {
        notify.error('Lỗi dữ liệu: Không tìm thấy ID phòng. Tải lại trang!');
        return;
    }

    const payload = {
        ngayBatDau: selectedSale.value.ngayBatDau,
        ngayKetThuc: selectedSale.value.ngayKetThuc,
        trangThai: selectedSale.value.trangThai,
        saleDetails: selectedSale.value.chiTietSales.map(item => ({
            maBienThePhong: item.maBienThePhong,
            phanTramGiam: item.phanTramGiam
        }))
    };

    try {
        const id = selectedSale.value.flashsaleid;
        await api.put(`${API_SALE}/${id}`, payload);

        notify.success('Cập nhật thành công!');
        fetchSale();
        
        const modalEl = document.getElementById('detailSaleModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

    } catch (error) {
        console.error(error);
    }
}

// DELETE SALE
const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: 'Bạn có muốn xóa không ?',
        text: "Hành động này sẽ xóa chương trình khuyến mãi và các chi tiết liên quan.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#c5a47e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa ngay',
        cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
        try {
            await api.delete(`${API_SALE}/${id}`);
            notify.success('Đã xóa thành công!');
            fetchSale();
        } catch (error) {
            console.error("Lỗi xóa:", error);
        }
    }
}
</script>

<template>
  <div class="luxury-container container-xxl flex-grow-1 container-p-y">
    
    <div class="d-flex justify-content-between align-items-center mb-4 pt-2">
      <div>
        <h4 class="fw-bold luxury-title mb-1">Quản Lý Sale</h4>
        <small class="text-muted">Danh sách các chương trình khuyến mãi đặc biệt</small>
      </div>
      <button class="btn btn-gold shadow-sm" @click="openCreateModal">
        <i class='bx bx-plus me-1'></i> Tạo chiến dịch mới
      </button>
    </div>

    <div class="card luxury-card">
      <div class="card-header bg-white border-bottom-0 d-flex gap-3 py-3">
        <div class="input-group input-group-merge luxury-search" style="max-width: 300px;">
          <span class="input-group-text border-0 ps-3 bg-transparent"><i class="bx bx-search text-muted"></i></span>
          <input type="text" class="form-control border-0 bg-transparent shadow-none" placeholder="Tìm kiếm mã sale..." v-model="searchQuery" />
        </div>
        <div class="ms-auto d-flex gap-2">
           <select class="form-select border-0 bg-light" style="width: 150px;">
             <option selected>Tất cả</option>
             <option value="1">Đang diễn ra</option>
             <option value="2">Sắp tới</option>
           </select>
        </div>
      </div>

      <div class="table-responsive text-nowrap">
        <table class="table table-hover luxury-table align-middle">
          <thead class="table-light">
            <tr>
              <th class="ps-4">Mã Sale</th>
              <th>Thời gian áp dụng</th>
              <th class="text-center">Số phòng áp dụng</th>
              <th class="text-center">Trạng thái</th>
              <th class="text-end pe-4">Hành động</th>
            </tr>
          </thead>
          <tbody class="table-border-bottom-0">
            <tr v-for="sale in filteredFlashSales" :key="sale.flashsaleid">
              <td class="ps-4">
                <div class="d-flex align-items-center">
                    <strong>#{{ sale.flashsaleid }}</strong>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="fw-semibold text-dark">{{ formatDate(sale.ngayBatDau) }}</span>
                  <small class="text-muted"><i class='bx bx-right-arrow-alt'></i> {{ formatDate(sale.ngayKetThuc) }}</small>
                </div>
              </td>
              <td class="text-center">
                 <span class="badge bg-label-dark">{{  sale.tongSoPhong }} loại phòng</span>
              </td>
              <td class="text-center">
                <span :class="getStatusBadge(sale.trangThai).class">
                  {{ getStatusBadge(sale.trangThai).text }}
                </span>
              </td>
              <td class="text-end pe-4">
                <button class="btn btn-sm btn-icon btn-outline-secondary me-1" @click="openDetailModal(sale.flashsaleid)" title="Xem chi tiết/Sửa">
                    <i class='bx bx-edit-alt'></i>
                </button>
                <button class="btn btn-sm btn-icon btn-outline-danger" @click="handleDelete(sale.flashsaleid)" title="Xóa">
                    <i class='bx bx-trash'></i>
                </button>
              </td>
            </tr>
            <tr v-if="filteredFlashSales.length === 0 && searchQuery">
                <td colspan="5" class="text-center py-4 text-muted">
                    Không tìm thấy kết quả nào phù hợp với "{{ searchQuery }}"
                </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer bg-white border-top-0 d-flex justify-content-end py-3">
      </div>
    </div>

    <div class="modal fade" id="detailSaleModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content luxury-modal" v-if="selectedSale">
          <div class="modal-header border-bottom-0 pb-0">
            <div>
                 <h5 class="modal-title fw-bold text-gold">Cập nhật Flash Sale #{{ selectedSale.flashsaleid }}</h5>
                 <small class="text-muted">Điều chỉnh thời gian và mức giảm giá từng phòng</small>
            </div>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body pt-4">
            <div class="row g-3 mb-4">
                <div class="col-md-5">
                    <label class="form-label small text-uppercase fw-bold text-muted">Ngày bắt đầu</label>
                    <input type="datetime-local" class="form-control" v-model="selectedSale.ngayBatDau">
                </div>
                <div class="col-md-5">
                    <label class="form-label small text-uppercase fw-bold text-muted">Ngày kết thúc</label>
                    <input type="datetime-local" class="form-control" 
                           v-model="selectedSale.ngayKetThuc" 
                           :min="selectedSale.ngayBatDau">
                </div>
                <div class="col-md-2 d-flex flex-column align-items-center justify-content-end">
                   <label class="form-label small text-uppercase fw-bold text-muted mb-2">Trạng thái</label>
                   <div class="form-check form-switch mb-2">
                       <input class="form-check-input custom-switch" type="checkbox" v-model="selectedSale.trangThai">
                   </div>
            </div>
           </div>

            <hr class="text-muted opacity-25">

            <label class="form-label fw-bold text-gold mb-2"><i class='bx bx-list-plus'></i> Thêm phòng & Thiết lập giảm giá</label>
            <div class="bg-light rounded-3 p-3 mb-4 border">
                <div class="d-flex mb-2 px-2 text-muted small fw-bold text-uppercase">
                    <div class="flex-grow-1">Tên loại phòng</div>
                    <div style="width: 120px;" class="text-end">Mức giảm (%)</div>
                </div>
                
                <div style="max-height: 200px; overflow-y: auto;" class="pe-2">
                    <div v-for="room in availableRooms" :key="room.id" class="card mb-2 shadow-sm border-0">
                        <div class="card-body p-2 d-flex align-items-center">
                            <div class="form-check flex-grow-1 mb-0 d-flex align-items-center">
                                <input class="form-check-input me-2" type="checkbox" :value="room.id" :id="'edit_room_'+room.id" v-model="tempSelectedIds">
                                <label class="form-check-label w-100 cursor-pointer" :for="'edit_room_'+room.id">
                                    <span class="fw-semibold text-dark">{{ room.name }}</span><br>
                                </label>
                            </div>
                            <div style="width: 100px;">
                                <input type="number" 
                                       class="form-control form-control-sm text-end fw-bold text-gold" 
                                       placeholder="%" 
                                       v-model="tempDiscountMap[room.id]"
                                       :disabled="!tempSelectedIds.includes(room.id)">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="d-flex justify-content-end mt-3">
                      <button class="btn btn-dark btn-sm" @click="addRoomsToDetail">
                         <i class='bx bx-plus'></i> Thêm phòng đã chọn
                      </button>
                </div>
            </div>

            <div class="table-responsive border rounded-3">
               <table class="table table-hover align-middle mb-0">
                  <thead class="bg-light">
                      <tr>
                          <th class="small text-uppercase text-muted ps-3">Tên phòng</th>
                          <th class="small text-uppercase text-muted text-end">Giá gốc</th>
                          <th class="small text-uppercase text-muted text-center">Giảm giá</th>
                          <th class="small text-uppercase text-muted text-end">Sau giảm</th>
                          <th></th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(item, index) in selectedSale.chiTietSales" :key="index">
                          <td class="ps-3 fw-semibold">{{ item.tenBienThe }}</td>
                          <td class="text-end text-muted text-decoration-line-through">{{ formatCurrency(item.giaGoc) }}</td>
                          <td class="text-center"><span class="badge bg-gold text-white">-{{ item.phanTramGiam }}%</span></td>
                          <td class="text-end text-danger fw-bold">{{ formatCurrency(item.giaSauGiam) }}</td>
                          <td class="text-end pe-3"><i class='bx bx-trash text-muted cursor-pointer hover-danger fs-5' @click="removeRoomFromDetail(index)"></i></td>
                      </tr>
                      <tr v-if="!selectedSale.chiTietSales || selectedSale.chiTietSales.length === 0">
                           <td colspan="5" class="text-center text-muted py-3">Chưa có phòng nào trong danh sách</td>
                      </tr>
                  </tbody>
               </table>
            </div>
          </div>
          <div class="modal-footer border-top-0">
             <button class="btn btn-light" data-bs-dismiss="modal">Đóng</button>
             <button class="btn btn-gold" @click="handleUpdate">Lưu thay đổi</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="createSaleModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content luxury-modal">
            <div class="modal-header border-bottom-0">
                <h5 class="modal-title fw-bold">Tạo Flash Sale Mới</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label class="form-label">Thời gian bắt đầu</label>
                            <input type="datetime-local" class="form-control" v-model="newSale.ngayBatDau">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Thời gian kết thúc</label>
                            <input type="datetime-local" class="form-control" 
                                   v-model="newSale.ngayKetThuc" 
                                   :min="newSale.ngayBatDau">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold text-gold">Chọn phòng và Nhập % giảm giá :</label>
                        <div class="border rounded p-3 bg-light" style="max-height: 250px; overflow-y: auto;">
                            
                            <div class="d-flex mb-2 px-2 text-muted small fw-bold">
                                <div class="flex-grow-1">PHÒNG</div>
                                <div style="width: 100px;" class="text-end">% GIẢM</div>
                            </div>

                            <div v-for="room in availableRooms" :key="room.id" class="d-flex align-items-center mb-2 bg-white p-2 rounded border">
                                <div class="form-check flex-grow-1 mb-0">
                                    <input class="form-check-input" type="checkbox" :value="room.id" :id="'new_room_'+room.id" v-model="newSale.selectedIds">
                                    <label class="form-check-label w-100 cursor-pointer" :for="'new_room_'+room.id">
                                        <span class="fw-bold">{{ room.name }}</span>
                                    </label>
                                </div>
                                <div style="width: 100px;">
                                    <input type="number" 
                                           class="form-control form-control-sm text-end" 
                                           placeholder="%" 
                                           v-model="newSale.discountMap[room.id]"
                                           :disabled="!newSale.selectedIds.includes(room.id)">
                                </div>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-top-0">
                <button class="btn btn-light" data-bs-dismiss="modal">Hủy</button>
                <button class="btn btn-gold px-4" @click="handleCreate">Xác nhận tạo</button>
            </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
:root { --gold-primary: #c5a47e; --gold-hover: #b08d65; --dark-text: #2c2c2c; }
.luxury-container { font-family: 'Montserrat', sans-serif; }
.luxury-title { font-family: 'Playfair Display', serif; color: #2c2c2c; letter-spacing: 0.5px; }
.luxury-card { border: none; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); overflow: hidden; }
.btn-gold { background-color: #c5a47e; color: white; border: none; padding: 0.5rem 1.2rem; border-radius: 6px; transition: all 0.3s; }
.btn-gold:hover { background-color: #b08d65; color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(197, 164, 126, 0.4); }
.bg-gold { background-color: #c5a47e !important; color: white; }
.text-gold { color: #c5a47e !important; }
.cursor-pointer { cursor: pointer; }
.luxury-search { background-color: #f8f9fa; border-radius: 50px; padding: 2px; border: 1px solid transparent; transition: all 0.3s; }
.luxury-search:focus-within { border-color: #c5a47e; background-color: #fff; box-shadow: 0 0 0 3px rgba(197, 164, 126, 0.1); }
.luxury-table thead th { font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; font-size: 0.75rem; color: #888; border-bottom: 2px solid #f0f0f0; }
.luxury-table tbody tr { transition: background-color 0.2s; }
.luxury-table tbody tr:hover { background-color: #fdfcfb; }
.hover-danger:hover { color: #dc3545 !important; }
.luxury-modal { border: none; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
.badge { padding: 0.5em 0.8em; font-weight: 500; letter-spacing: 0.3px; border-radius: 6px; }
.bg-label-success { background-color: #e8fadf !important; color: #71dd37 !important; }
.bg-label-warning { background-color: #fff2d6 !important; color: #ffab00 !important; }
.bg-label-secondary { background-color: #ebeef0 !important; color: #8592a3 !important; }
.bg-label-dark { background-color: #4a4a4a !important; color: #fff !important; }

.custom-switch {
    width: 2.8em !important;
    height: 1.5em !important;
    cursor: pointer;
}
.custom-switch:checked {
    background-color: #c5a47e !important;
    border-color: #c5a47e !important;
}
</style>