<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '../Service/api';
import notify from '../Service/notify';

const rooms = ref([]);
const orders = ref([]);
const menuItems = ref([]); 

const showModal = ref(false);
const searchQuery = ref("");
const cart = ref([]);

const currentView = ref('rooms');
const selectedRoomId = ref("");

const API_IMG__URL = `${import.meta.env.VITE_API_URL}/anhDichVu/`;

const isEditingMode = ref(false);
const editOrders = ref([]);
const selectedEditOrders = ref([]); 
const batchStatusAction = ref("");  


const kanbanSearchQuery = ref("");

const tableSearchQuery = ref("");
const tableStatusFilter = ref("");
const tableCurrentPage = ref(1);
const tableItemsPerPage = ref(5); 

const callService = async () => {
  try {
    let response = await api.get('/api/DichVu/quan-ly-dat-dich-vu');
    if (response.status === 200) {
      const dataFromServer = response.data;
      let newRooms = [];
      let newOrders = [];

      dataFromServer.forEach(phong => {
        newRooms.push({
          id: phong.maCtdp,
          name: phong.soPhong,
          type: `${phong.tenLoai} - ${phong.tenBienThe}`,
          guest: phong.tenKhach,
          items: phong.dichVus.length
        });
        phong.dichVus.forEach(dv => {
          newOrders.push({
            id: dv.maSd,
            roomId: phong.maCtdp,
            roomName: phong.soPhong,       
            roomType: phong.tenLoai,       
            roomVariant: phong.tenBienThe, 
            name: dv.tenDichVu,
            qty: dv.soLuong,
            price: dv.soLuong > 0 ? (dv.thanhTien / dv.soLuong) : 0,
            status: dv.trangThai || 0,
            time: dv.thoiGianDaDat || dv.ngaySuDung
          });
        });
      });

      rooms.value = newRooms;
      orders.value = newOrders;

      if (!selectedRoomId.value) {
        selectedRoomId.value = "";
      }
    }
  } catch (error) {
    console.error("Lỗi lấy danh sách phòng:", error);
    if (notify) notify.error("Gọi dữ liệu thất bại. Vui lòng thử lại.");
  }
};

const fetchServicesMenu = async () => {
  try {
    const response = await api.get('/api/DichVu');
    if (response.status === 200) {
      menuItems.value = response.data.map(item => {
        return {
          id: item.maDichVu,
          name: item.tenDichVu,
          price: item.gia,
          image: API_IMG__URL + item.hinhAnh
        };
      });
    }
  } catch (error) {
    console.error("Lỗi lấy danh sách dịch vụ:", error);
  }
};

const filteredMenu = computed(() => {
  return menuItems.value.filter(item => {
    return item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => total + (item.price * item.qty), 0);
});

const selectedRoomData = computed(() => {
  return rooms.value.find(r => r.id === selectedRoomId.value) || null;
});

const currentRoomOrders = computed(() => {
  return orders.value.filter(o => o.roomId === selectedRoomId.value);
});

const currentRoomTotal = computed(() => {
return currentRoomOrders.value
    .filter(o => o.status !== 3) 
    .reduce((total, o) => total + (o.price * o.qty), 0);
});

const switchView = (viewName) => {
  currentView.value = viewName;
};

const selectRoom = (id) => {
  selectedRoomId.value = id;
  if (isEditingMode.value) toggleEditMode();
};

const formatCurrency = (val) => {
  if (val === undefined || val === null) return "0 ₫";
  return val.toLocaleString() + " ₫";
};

const getOrdersByStatus = (status) => {
 let filtered = orders.value.filter(o => o.status === status);
  
  // 1. Logic lọc tìm kiếm
  if (kanbanSearchQuery.value) {
    const query = kanbanSearchQuery.value.toLowerCase();
    filtered = filtered.filter(o => 
      (o.roomName && o.roomName.toString().toLowerCase().includes(query)) || 
      (o.name && o.name.toLowerCase().includes(query))
    );
  }
  
  filtered.sort((a, b) => {

    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();

    if (!isNaN(timeA) && !isNaN(timeB)) {
      return timeB - timeA; 
    }
    

    return b.id - a.id; 
  });

  return filtered;
};

const updateStatus = async (id, newStatus) => {
  try {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('newStatus', newStatus);

    const response = await api.put('/api/DichVu/sua-dich-vu', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.status === 200) {
      const order = orders.value.find(o => o.id === id);
      if (order) order.status = newStatus;
      if (notify) notify.success("Cập nhật trạng thái thành công!");
    }
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    if (notify) notify.error("Cập nhật thất bại!");
  }
};

const openPopup = () => {
  if (!selectedRoomId.value) return alert("Chưa chọn phòng!");
  cart.value = [];
  searchQuery.value = "";
  showModal.value = true;
};

const closePopup = () => {
  showModal.value = false;
};

const addToCart = (item) => {
  const existing = cart.value.find(i => i.id === item.id);
  if (existing) existing.qty++;
  else cart.value.push({ ...item, qty: 1 });
};

const decreaseQty = (index) => {
  if (cart.value[index].qty > 1) cart.value[index].qty--;
  else cart.value.splice(index, 1);
};

const increaseQty = (index) => {
  cart.value[index].qty++;
};

const confirmOrder = async () => {
  if (cart.value.length === 0) return;
  const payload = {
    maCtdp: selectedRoomId.value,
    dichVus: cart.value.map(item => ({
      maDichVu: item.id,
      soLuong: item.qty
    }))
  };

  try {
    const response = await api.post('/api/DichVu/dat-dich-vu', payload);
    if (response.status === 200) {
      if (notify) notify.success("Đặt dịch vụ thành công!");
      closePopup();
      await callService();
    }
  } catch (error) {
    console.error("Lỗi đặt dịch vụ:", error);
    if (notify) notify.error("Đặt dịch vụ thất bại!");
  }
};

// --- LOGIC TÍNH TOÁN LỌC VÀ PHÂN TRANG CHO TABLE ---
const filteredTableOrders = computed(() => {
  let data = isEditingMode.value ? editOrders.value : currentRoomOrders.value;

  if (tableSearchQuery.value) {
    const q = tableSearchQuery.value.toLowerCase();
    data = data.filter(o => o.name.toLowerCase().includes(q));
  }

  if (tableStatusFilter.value !== "") {
    const s = parseInt(tableStatusFilter.value);
    data = data.filter(o => o.status === s);
  }

  return data;
});

const totalTablePages = computed(() => {
  return Math.ceil(filteredTableOrders.value.length / tableItemsPerPage.value) || 1;
});

const paginatedTableOrders = computed(() => {
  const start = (tableCurrentPage.value - 1) * tableItemsPerPage.value;
  const end = start + tableItemsPerPage.value;
  return filteredTableOrders.value.slice(start, end);
});

// Khi thay đổi điều kiện lọc hoặc đổi phòng, reset trang về 1
watch([tableSearchQuery, tableStatusFilter], () => { tableCurrentPage.value = 1; });
watch(selectedRoomId, () => {
  tableCurrentPage.value = 1;
  tableSearchQuery.value = "";
  tableStatusFilter.value = "";
});

// --- LOGIC SỬA HÀNG LOẠT ---
const toggleEditMode = () => {
  if (!isEditingMode.value) {
    editOrders.value = JSON.parse(JSON.stringify(currentRoomOrders.value));
    isEditingMode.value = true;
    selectedEditOrders.value = [];
    batchStatusAction.value = "";
  } else {
    isEditingMode.value = false;
    editOrders.value = [];
    selectedEditOrders.value = [];
  }
};

// Checkbox chọn tất cả (Chỉ áp dụng cho các item ở TRANG HIỆN TẠI)
const selectAllOrders = computed({
  get: () => {
    const editable = paginatedTableOrders.value.filter(o => o.status !== 2 && o.status !== 3);
    return editable.length > 0 && editable.every(o => selectedEditOrders.value.includes(o.id));
  },
  set: (val) => {
    const editable = paginatedTableOrders.value.filter(o => o.status !== 2 && o.status !== 3);
    if (val) {
      const ids = editable.map(o => o.id);
      selectedEditOrders.value = [...new Set([...selectedEditOrders.value, ...ids])];
    } else {
      const ids = editable.map(o => o.id);
      selectedEditOrders.value = selectedEditOrders.value.filter(id => !ids.includes(id));
    }
  }
});

const applyBatchStatus = () => {
  if (batchStatusAction.value === "") return;
  const newStatus = parseInt(batchStatusAction.value);
  editOrders.value.forEach(item => {
    if (selectedEditOrders.value.includes(item.id)) {
      item.status = newStatus;
    }
  });
  if (notify) notify.success("Đã áp dụng trạng thái. Vui lòng bấm 'Lưu thay đổi' để hoàn tất!");
  selectedEditOrders.value = []; 
};

const applyBatchCancel = () => {
  editOrders.value.forEach(item => {
    if (selectedEditOrders.value.includes(item.id)) {
      item.qty = 0;
      item.status = 3; 
    }
  });
  if (notify) notify.success("Đã hủy các món. Vui lòng bấm 'Lưu thay đổi' để hoàn tất!");
  selectedEditOrders.value = [];
};

const cancelItem = (item) => {
  item.qty = 0;
  item.status = 3;
};

const undoItem = (item) => {
  const originalItem = currentRoomOrders.value.find(o => o.id === item.id);
  if (originalItem) {
    item.qty = originalItem.qty;
    item.status = originalItem.status;
  }
};


const saveAllEdits = async () => {
  const changedOrders = editOrders.value.filter(editItem => {
    const originalItem = currentRoomOrders.value.find(o => o.id === editItem.id);
    return originalItem && (originalItem.qty !== editItem.qty || originalItem.status !== editItem.status);
  });

  if (changedOrders.length === 0) {
    toggleEditMode();
    return;
  }

  try {
    const apiRequests = changedOrders.map(item => {
      const formData = new FormData();
      formData.append('id', item.id);
      
      const originalItem = currentRoomOrders.value.find(o => o.id === item.id);
      
      if (originalItem.qty !== item.qty) formData.append('newSoluong', item.qty);
      if (originalItem.status !== item.status) formData.append('newStatus', item.status);

      return api.put('/api/DichVu/sua-dich-vu', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    });

    await Promise.all(apiRequests);

    if (notify) notify.success("Đã lưu toàn bộ thay đổi!");
    toggleEditMode();
    await callService();

  } catch (error) {
    console.error("Lỗi khi lưu hàng loạt:", error);
    if (notify) notify.error("Lưu thất bại. Vui lòng kiểm tra lại!");
  }
};

onMounted(() => {
  callService();
  fetchServicesMenu();
});
</script>

<template>
  <div class="container-xxl flex-grow-1 container-p-y">

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold py-3 mb-0">Quản Lý Dịch Vụ</h4>

      <div class="btn-group" role="group">
        <button type="button" class="btn"
          :class="currentView === 'rooms' ? 'btn-outline-dark active' : 'btn-outline-secondary'"
          @click="switchView('rooms')">
          <i class="fa-solid fa-list me-1"></i> Danh sách phòng
        </button>
        <button type="button" class="btn"
          :class="currentView === 'kitchen' ? 'btn-outline-dark active' : 'btn-outline-secondary'"
          @click="switchView('kitchen')">
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {{ getOrdersByStatus(0).length }}
            <span class="visually-hidden">unread messages</span>
          </span>
          Đơn dịch vụ
        </button>
      </div>
    </div>

    <div v-if="currentView === 'rooms'">
      <h5 class="mb-3 text-muted">PHÒNG ĐANG CÓ KHÁCH ({{ rooms.length }})</h5>

      <div class="row g-4 mb-4">
        <div v-for="room in rooms" :key="room.id" class="col-md-4 col-lg-3">
          <div class="card h-100 cursor-pointer room-card-item"
            :class="{ 'border-primary border-2 shadow-sm': room.id === selectedRoomId }" @click="selectRoom(room.id)">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h3 class="card-title mb-0 text-dark fw-bold">{{ room.name }}</h3>
                <span v-if="room.items > 0" class="badge bg-label-success">Đang sử dụng</span>
              </div>
              <p class="mb-1 text-muted small"><i class="fa-regular fa-user me-1"></i> {{ room.guest }}</p>
              <p class="mb-0 text-muted small"><i class="fa-solid fa-concierge-bell me-1"></i> {{ room.items }} dịch vụ
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="card" v-if="selectedRoomData">
        <div class="card-header d-flex justify-content-between align-items-center border-bottom">
          <div>
            <h5 class="mb-1">Phòng {{ selectedRoomData.name }} - {{ selectedRoomData.type }}</h5>
            <small class="text-muted">
              Khách: <strong>{{ selectedRoomData.guest }}</strong> • Tổng tiền DV:
              <span class="fw-bold text-primary">{{ formatCurrency(currentRoomTotal) }}</span>
            </small>
          </div>
          <button class="btn btn-lg text-black badge bage bg-label-warning " @click="openPopup">
            Thêm dịch vụ
          </button>
        </div>

        <div v-if="showModal" class="modal-backdrop fade show"></div>
        <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
            <div class="modal-content">

              <div class="modal-header border-bottom">
                <h5 class="modal-title fw-bold">
                 Thêm dịch vụ - Phòng {{ selectedRoomData?.name }}
                </h5>
                <button type="button" class="btn-close" @click="closePopup"></button>
              </div>

              <div class="modal-body p-0">
                <div class="row g-0" style="height: 75vh; min-height: 500px; max-height: 800px;">

                  <div class="col-md-8 border-end bg-light d-flex flex-column h-100">
                    <div class="p-3 bg-white border-bottom">
                      <div class="input-group">
                        <span class="input-group-text bg-white border-end-0"><i class="fa-solid fa-search"></i></span>
                        <input type="text" class="form-control border-start-0" placeholder="Tìm tên dịch vụ..."
                          v-model="searchQuery">
                      </div>
                    </div>

                    <div class="p-3 overflow-auto flex-grow-1">
                      <div class="row g-3">
                        <div class="col-md-4 col-sm-6" v-for="item in filteredMenu" :key="item.id">
                          <div class="card h-100 shadow-sm border-0 item-card">
                            <img :src="item.image" class="card-img-top service-img" :alt="item.name"
                              @error="$event.target.src = 'https://placehold.co/200x150?text=Error'">
                            <div class="card-body text-center p-3 d-flex flex-column">
                              <h6 class="card-title fw-bold text-dark small mb-1">{{ item.name }}</h6>
                              <p class="card-text text-primary fw-bold mb-2">{{ formatCurrency(item.price) }}</p>
                              <button class="btn btn-sm btn-outline-primary mt-auto w-100 fw-bold"
                                @click="addToCart(item)">
                                <i class="fa-solid fa-plus me-1"></i> Thêm
                              </button>
                            </div>
                          </div>
                        </div>
                        <div v-if="filteredMenu.length === 0" class="col-12 text-center text-muted mt-5">
                          Không tìm thấy dịch vụ nào phù hợp.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-4 d-flex flex-column bg-white h-100">
                    <div class="p-3 border-bottom bg-label-secondary">
                      <h6 class="mb-0 fw-bold">Đang chọn</h6>
                    </div>

                    <div class="flex-grow-1 overflow-auto p-3">
                      <div v-if="cart.length === 0" class="text-center text-muted mt-5">
                        <i class="fa-solid fa-basket-shopping fs-3 mb-2"></i>
                        <p>Chưa chọn món nào</p>
                      </div>
                      <div v-else class="list-group list-group-flush">
                        <div v-for="(item, index) in cart" :key="index"
                          class="list-group-item px-0 py-2 border-bottom-dashed">
                          <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="fw-bold">{{ item.name }}</span>
                            <span class="text-muted small">{{ formatCurrency(item.price * item.qty) }}</span>
                          </div>
                          <div class="d-flex justify-content-between align-items-center">
                            <div class="input-group input-group-sm" style="width: 100px;">
                              <button class="btn btn-outline-secondary" type="button"
                                @click="decreaseQty(index)">-</button>
                              <input type="text" class="form-control text-center bg-white" :value="item.qty" readonly>
                              <button class="btn btn-outline-secondary" type="button"
                                @click="increaseQty(index)">+</button>
                            </div>
                            <small class="text-muted">{{ formatCurrency(item.price) }}/1</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="p-3 border-top bg-light">
                      <div class="d-flex justify-content-between mb-3">
                        <span class="fw-bold">Tổng cộng:</span>
                        <span class="fw-bold text-danger fs-5">{{ formatCurrency(cartTotal) }}</span>
                      </div>
                      <div class="d-grid gap-2">
                        <button class="btn btn-primary btn-lg" :disabled="cart.length === 0" @click="confirmOrder">
                          Đăt dịch vụ
                        </button>
                        <button class="btn btn-outline-secondary" @click="closePopup">Hủy bỏ</button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="table-responsive p-3 text-nowrap">
          
          <div class="d-flex flex-wrap justify-content-between align-items-center mb-3" v-if="currentRoomOrders.length > 0">
            <div class="d-flex gap-2">
              <div class="input-group input-group-sm shadow-sm bg-white rounded border search-bar-kanban" style="width: 250px;">
                <span class="input-group-text border-0 bg-transparent pe-2">
                  <i class="fa-solid fa-search text-primary"></i>
                </span>
                <input type="text" class="form-control border-0 bg-transparent shadow-none" placeholder="Tìm tên dịch vụ..." v-model="tableSearchQuery">
                <span v-if="tableSearchQuery" class="input-group-text border-0 bg-transparent text-muted cursor-pointer clear-btn" @click="tableSearchQuery = ''">
                  <i class="fa-solid fa-circle-xmark"></i>
                </span>
              </div>

              <select class="form-select form-select-sm shadow-sm border-0 w-auto text-muted" v-model="tableStatusFilter">
                <option value="">Tất cả trạng thái</option>
                <option value="0">Mới đặt</option>
                <option value="1">Đang làm</option>
                <option value="2">Đã giao</option>
                <option value="3">Đã hủy</option>
              </select>
            </div>

            <div>
              <button v-if="!isEditingMode" class="btn btn-sm btn-icon text-muted badge bage bg-label-secondary" @click="toggleEditMode">
                Sửa đơn 
              </button>
              <div v-else>
                <button class="btn btn-sm btn-icon text-dark badge bg-label-secondary me-2" @click="toggleEditMode">Hủy</button>
                <button class="btn btn-sm btn-icon text-white badge bage bg-primary" @click="saveAllEdits">Lưu thay đổi</button>
              </div>
            </div>
          </div>

          <div v-if="isEditingMode && selectedEditOrders.length > 0" class="d-flex align-items-center mb-3 p-2 bg-label-primary rounded shadow-sm border border-primary border-opacity-25">
            <div class="d-flex align-items-center me-auto">
              <span class="fw-bold text-primary ms-2"><i class="fa-solid fa-check-double me-1"></i> Đã chọn {{ selectedEditOrders.length }} món</span>
            </div>
            
            <div class="d-flex align-items-center">
              <select v-model="batchStatusAction" class="form-select form-select-sm w-auto me-2">
                <option value="" disabled>Chọn trạng thái</option>
                <option value="0" disabled>Mới đặt</option>
                <option value="1">Đang làm</option>
                <option value="2">Đã giao</option>
              </select>
              
              <button class="btn btn-sm btn-primary me-3" @click="applyBatchStatus" :disabled="!batchStatusAction">
                 Áp dụng
              </button>
              
              <div class="border-start ps-3 border-secondary border-opacity-25">
                 <button class="btn btn-sm btn-danger" @click="applyBatchCancel">
                   <i class="fa-solid fa-trash me-1"></i> Hủy các món đã chọn
                 </button>
              </div>
            </div>
          </div>

          <table class="table table-hover align-middle" style="border-collapse: separate; border-spacing: 0 8px;">
            <thead>
              <tr class="text-uppercase text-muted bg-white border-bottom" style="font-size: 0.75rem; letter-spacing: 0.5px;">
                <th v-if="isEditingMode" style="width: 40px;" class="text-center border-0">
                  <input class="form-check-input" type="checkbox" v-model="selectAllOrders">
                </th>
                <th class="border-0 fw-bold ps-3">Mã đơn</th>
                <th class="border-0 fw-bold">Dịch vụ</th>
                <th class="border-0 fw-bold">Số lượng</th>
                <th class="border-0 fw-bold">Thành tiền</th>
                <th class="border-0 fw-bold text-center">Trạng thái</th>
                <th class="border-0 fw-bold text-end">Thời gian</th>
                <th v-if="isEditingMode" class="border-0 text-center">Hành động</th> 
              </tr>
            </thead>
            <tbody class="border-top-0">
              <tr v-if="paginatedTableOrders.length === 0">
                <td :colspan="isEditingMode ? 8 : 7" class="text-center py-5 text-muted">
                  Không tìm thấy dịch vụ nào phù hợp.
                </td>
              </tr>

              <template v-if="!isEditingMode">
                <tr v-for="order in paginatedTableOrders" :key="order.id" class="bg-white shadow-sm rounded">
                  <td class="ps-3"><span class="text-primary fw-bold">#{{ order.id }}</span></td>
                  <td class="text-muted fw-bold">{{ order.name }}</td>
                  <td class="text-muted">{{ order.qty }}</td>
                  <td class="fw-bold" :class="order.status === 3 ? 'text-muted text-decoration-line-through' : 'text-dark'">
                    {{ formatCurrency(order.price * order.qty) }}
                  </td>
                  <td class="text-center">
                    <span v-if="order.status === 0" class="badge px-3 py-2 text-uppercase" style="background-color: #fff2d6; color: #ffab00; border: 1px solid #ffab00; font-size: 0.65rem;">
                      Mới đặt <i class="fa-regular fa-clock ms-1"></i>
                    </span>
                    <span v-else-if="order.status === 1" class="badge px-3 py-2 text-uppercase" style="background-color: #e7e7ff; color: #696cff; border: 1px solid #696cff; font-size: 0.65rem;">
                      Đang làm
                    </span>
                    <span v-else-if="order.status === 3" class="badge px-3 py-2 text-uppercase" style="background-color: #f1f1f2; color: #a1aab2; border: 1px solid #d4d8dd; font-size: 0.65rem;">
                      Đã hủy <i class="fa-solid fa-xmark ms-1"></i>
                    </span>
                    <span v-else class="badge px-3 py-2 text-uppercase" style="background-color: #e8fadf; color: #28c76f; border: 1px solid #28c76f; font-size: 0.65rem;">
                      Đã giao <i class="fa-solid fa-check ms-1"></i>
                    </span>
                  </td>
                  <td class="text-end text-muted small pe-3">{{ order.time }}</td>
                </tr>
              </template>

              <template v-else>
                <tr v-for="editItem in paginatedTableOrders" :key="'edit-' + editItem.id" class="bg-white shadow-sm rounded" :class="{'opacity-50': editItem.qty === 0 || editItem.status === 3}">
                  
                  <td class="text-center">
                    <input class="form-check-input cursor-pointer" type="checkbox" 
                           v-model="selectedEditOrders" :value="editItem.id" 
                           :disabled="editItem.status === 2 || editItem.status === 3 || editItem.qty === 0">
                  </td>

                  <td class="ps-3"><span class="text-primary fw-bold">#{{ editItem.id }}</span></td>
                  
                  <td class="fw-bold" :class="{'text-decoration-line-through text-muted': editItem.qty === 0 || editItem.status === 3}">
                    {{ editItem.name }}
                  </td>
                  
                  <td style="width: 140px;">
                    <div v-if="(editItem.status === 0 || editItem.status === 1) && editItem.qty > 0" class="input-group input-group-sm">
                      <button class="btn btn-outline-secondary" @click="editItem.qty > 0 && editItem.qty--">-</button>
                      <input type="number" class="form-control text-center bg-white" v-model="editItem.qty" min="0">
                      <button class="btn btn-outline-secondary" @click="editItem.qty++">+</button>
                    </div>
                    <span v-else class="text-muted">{{ editItem.qty }} <i class="fa-solid fa-lock ms-1"></i></span>
                  </td>
                  
                  <td class="fw-bold" :class="editItem.status === 3 || editItem.qty === 0 ? 'text-muted text-decoration-line-through' : 'text-dark'">
                    {{ formatCurrency(editItem.price * editItem.qty) }}
                  </td>
                  
                  <td style="width: 160px;" class="text-center">
                     <select v-model="editItem.status" class="form-select form-select-sm" 
                             :disabled="editItem.status === 2 || editItem.status === 3 || editItem.qty === 0">
                        <option :value="0">Mới đặt</option>
                        <option :value="1">Đang làm</option>
                        <option :value="2">Đã giao</option>
                        <option :value="3">Đã hủy</option>
                     </select>
                  </td>

                  <td class="text-end text-muted small">{{ editItem.time }}</td>
                  
<td class="text-center pe-3">
  <button 
    v-if="(editItem.status === 0 || editItem.status === 1) && editItem.qty > 0"
    class="btn btn-sm btn-icon text-white bg-danger rounded-circle shadow-sm" style="width: 30px; height: 30px;"
    @click="cancelItem(editItem)"
    title="Xóa món này"
  >
    <i class="fa-solid fa-trash"></i>
  </button>
  
  <button 
    v-else-if="(editItem.qty === 0 || editItem.status === 3) && currentRoomOrders.find(o => o.id === editItem.id)?.status !== 3"
    class="btn btn-sm btn-icon text-white bg-secondary rounded-circle shadow-sm" style="width: 30px; height: 30px;"
    @click="undoItem(editItem)"
    title="Khôi phục lại món"
  >
    <i class="fa-solid fa-rotate-left"></i>
  </button>
</td>

                </tr>
              </template>
            </tbody>
          </table>
          
          <div v-if="totalTablePages > 1" class="d-flex justify-content-between align-items-center mt-3 mb-2">
            <span class="text-muted small">
              Hiển thị {{ paginatedTableOrders.length }} trên tổng số {{ filteredTableOrders.length }} dịch vụ
            </span>
            <ul class="pagination pagination-sm mb-0 shadow-sm">
              <li class="page-item" :class="{ disabled: tableCurrentPage === 1 }">
                <button class="page-link border-0 text-dark" @click="tableCurrentPage > 1 && tableCurrentPage--">
                  <i class="fa-solid fa-chevron-left"></i>
                </button>
              </li>
              <li v-for="p in totalTablePages" :key="p" class="page-item" :class="{ active: p === tableCurrentPage }">
                <button class="page-link border-0" :class="p === tableCurrentPage ? 'bg-primary text-white' : 'text-dark'" @click="tableCurrentPage = p">{{ p }}</button>
              </li>
              <li class="page-item" :class="{ disabled: tableCurrentPage === totalTablePages }">
                <button class="page-link border-0 text-dark" @click="tableCurrentPage < totalTablePages && tableCurrentPage++">
                  <i class="fa-solid fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </div>

          <div v-if="isEditingMode" class="text-muted small mt-2 fst-italic">
            * Đổi số lượng về 0 nếu muốn xóa món. Những món đã giao  sẽ không thể chỉnh sửa.
          </div>
        </div>

      </div>
    </div>

    <div v-else>
      <div class="row mb-4">
        <div class="col-md-5 col-lg-4">
          <div class="input-group input-group-merge shadow-sm bg-white rounded border search-bar-kanban">
            <span class="input-group-text border-0 bg-transparent pe-2">
              <i class="fa-solid fa-search text-primary"></i>
            </span>
            
            <input 
              type="text" 
              class="form-control border-0 bg-transparent shadow-none" 
              placeholder="Tìm số phòng..." 
              v-model="kanbanSearchQuery"
            >
            
            <span 
              v-if="kanbanSearchQuery" 
              class="input-group-text border-0 bg-transparent text-muted cursor-pointer clear-btn" 
              @click="kanbanSearchQuery = ''"
              title="Xóa tìm kiếm"
            >
              <i class="fa-solid fa-circle-xmark"></i>
            </span>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4">
          <div class="card bg-label-secondary border-0 mb-3">
            <div class="card-body p-3 d-flex justify-content-between align-items-center">
              <h6 class="mb-0 text-primary fw-bold">Mới đặt</h6>
              <span class="badge bg-white text-primary shadow-sm">{{ getOrdersByStatus(0).length }}</span>
            </div>
          </div>
          <div class="kanban-column">
            <div v-for="order in getOrdersByStatus(0)" :key="order.id"
              class="card mb-3 shadow-sm border-start border-3 border-primary">
              <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div class="d-flex flex-column text-start">
                     <span class="badge bg-dark mb-1">Phòng {{ order.roomName }}</span>
                     <small class="text-muted text-nowrap" style="font-size: 0.75rem;">{{ order.roomType }} - {{ order.roomVariant }}</small>
                  </div>
                  <small class="text-muted fst-italic ms-1">{{ order.time }}</small>
                </div>
                
                <ul class="list-unstyled mb-2 small">
                  <li><strong>{{ order.qty }}x</strong> {{ order.name }}</li>
                </ul>
                <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                  <span class="fw-bold">{{ formatCurrency(order.price * order.qty) }}</span>
                  <button class="btn btn-sm btn-primary" @click="updateStatus(order.id, 1)">
                    Nhận đơn <i class="fa-solid fa-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card bg-label-warning border-0 mb-3">
            <div class="card-body p-3 d-flex justify-content-between align-items-center">
              <h6 class="mb-0 text-warning fw-bold">Đang làm / Đang giao</h6>
              <span class="badge bg-white text-warning shadow-sm">{{ getOrdersByStatus(1).length }}</span>
            </div>
          </div>
          <div class="kanban-column">
            <div v-for="order in getOrdersByStatus(1)" :key="order.id"
              class="card mb-3 shadow-sm border-start border-3 border-warning">
              <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div class="d-flex flex-column text-start">
                     <span class="badge bg-dark mb-1">Phòng {{ order.roomName }}</span>
                     <small class="text-muted text-nowrap" style="font-size: 0.75rem;">{{ order.roomType }} - {{ order.roomVariant }}</small>
                  </div>
                  <small class="text-muted fst-italic ms-1">{{ order.time }}</small>
                </div>

                <ul class="list-unstyled mb-2 small">
                  <li><strong>{{ order.qty }}x</strong> {{ order.name }}</li>
                </ul>
                <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                  <span class="fw-bold">{{ formatCurrency(order.price * order.qty) }}</span>
                  <button class="btn btn-sm btn-success" @click="updateStatus(order.id, 2)">
                    Xong <i class="fa-solid fa-check ms-1"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card bg-label-success border-0 mb-3">
            <div class="card-body p-3 d-flex justify-content-between align-items-center">
              <h6 class="mb-0 text-success fw-bold">Đã giao</h6>
              <span class="badge bg-white text-success shadow-sm">{{ getOrdersByStatus(2).length }}</span>
            </div>
          </div>
          <div class="kanban-column">
            <div v-for="order in getOrdersByStatus(2)" :key="order.id"
              class="card mb-3 shadow-sm border-start border-3 border-success opacity-75">
              <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div class="d-flex flex-column text-start">
                     <span class="badge bg-dark mb-1">Phòng {{ order.roomName }}</span>
                     <small class="text-muted text-nowrap" style="font-size: 0.75rem;">{{ order.roomType }} - {{ order.roomVariant }}</small>
                  </div>
                  <small class="text-muted fst-italic ms-1">{{ order.time }}</small>
                </div>

                <ul class="list-unstyled mb-2 small">
                  <li><strong>{{ order.qty }}x</strong> {{ order.name }}</li>
                </ul>
                <div class="fw-bold mt-2 pt-2 border-top">
                  {{ formatCurrency(order.price * order.qty) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.room-card-item {
  transition: all 0.2s ease-in-out;
}

.room-card-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15) !important;
}

.bg-label-success {
  background-color: #e8fadf !important;
  color: #71dd37 !important;
  padding: 0.4em 0.6em;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.75rem;
}

.bg-label-primary {
  background-color: #e7e7ff !important;
  color: #696cff !important;
  padding: 0.4em 0.6em;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.75rem;
}

.bg-label-warning {
  background-color: #fff2d6 !important;
  color: #ffab00 !important;
  padding: 0.4em 0.6em;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.75rem;
}

.bg-label-secondary {
  background-color: #f5f5f9 !important;
}

/* THÊM THANH CUỘN (SCROLL) CHO CÁC CỘT KANBAN */
.kanban-column {
  min-height: 200px;
  max-height: calc(100vh - 260px); 
  overflow-y: auto; 
  padding-right: 5px; 
}

.kanban-column::-webkit-scrollbar { width: 6px; }
.kanban-column::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
.kanban-column::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
.kanban-column::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }

/* CSS làm đẹp thanh search Kanban / Table */
.search-bar-kanban {
  transition: all 0.3s ease;
  border-color: rgba(0, 0, 0, 0.08) !important;
}
.search-bar-kanban:focus-within {
  box-shadow: 0 0 0 0.25rem rgba(105, 108, 255, 0.1) !important;
  border-color: #696cff !important;
}
.clear-btn:hover i {
  color: #ff3e1d !important;
  transition: 0.2s;
}
.cursor-pointer { cursor: pointer; }

/* CSS cho Menu Item */
.item-card {
  cursor: pointer;
  transition: all 0.2s;
}
.item-card:hover {
  border: 1px solid #696cff !important;
  transform: scale(1.02);
  background-color: #f8f9fa;
}

.border-bottom-dashed { border-bottom: 1px dashed #dee2e6; }
.modal-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.5); z-index: 1050; }
.modal.show { display: block; z-index: 1055; background: transparent; }
.service-img { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; object-position: center; border-top-left-radius: inherit; border-top-right-radius: inherit; border-bottom: 1px solid #f0f0f0; }
.bg-label-danger { background-color: #ffe0db !important; color: #ff3e1d !important; padding: 0.4em 0.6em; border-radius: 0.25rem; font-weight: 600; font-size: 0.75rem; }
</style>