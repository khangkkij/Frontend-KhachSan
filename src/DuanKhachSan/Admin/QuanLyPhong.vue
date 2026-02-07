<script setup>
import {reactive, ref, computed, onMounted, watch } from 'vue'
import axios from 'axios';
const API = import.meta.env.VITE_API_URL
const variants = ref([])
const dashboard = ref({
  tongBienThe: 0,
  tongPhong: 0,
  tongPhongTrong: 0,
  dangCoKhach: 0
})
const form = reactive({
  maLp: '',
  tenBienThe: '',
  loaiGiuong: '',
  huongNhin: '',
  soNguoiLon: 2,
  soTreEm:2,
  dienTich: 30,
  giaNiemYet: 0,
  tienIchIds: [],
  images: []
})
const formPhong = reactive({
  soPhong: '',
  maBienThePhong: null,
  trangThai: 0
})
const roomToDelete = ref({
  maPhong: null,
  soPhong: '',
  variantId: null
})
const roomEditing = ref({
  maPhong: null,
  soPhong: '',
  trangThai: 0
})
const roomDetail = ref(null)

const openRoomDetail = async (maPhong) => {
  const res = await axios.get(
    `${API}/api/admin/QuanLyPhong/${maPhong}/detail`
  )
  roomDetail.value = res.data
}

const previewImages = ref([])
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const handleUploadImages = (e) => {
  const files = Array.from(e.target.files)
  delete errors.images
  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.images = 'Chỉ chấp nhận ảnh JPG, PNG, WEBP'
      return
    }
  }
  previewImages.value = files.map(f => URL.createObjectURL(f))
  form.images = files
}
const removeImage = (index) => {
  form.images.splice(index, 1)
  previewImages.value.splice(index, 1)
}

const errors = reactive({})

const validateForm = () => {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!form.maLp) errors.maLp = 'Vui lòng chọn loại phòng'
  if (!form.tenBienThe.trim()) errors.tenBienThe = 'Tên biến thể không được để trống'
  if (!form.loaiGiuong) errors.loaiGiuong = 'Vui lòng chọn loại giường'
  if (!form.huongNhin) errors.huongNhin = 'Vui lòng chọn hướng nhìn'

  if (!form.soNguoiLon || form.soNguoiLon < 1)
    errors.soNguoiLon = 'Số người lớn phải ≥ 1'

  if (!form.dienTich || form.dienTich < 10)
    errors.dienTich = 'Diện tích tối thiểu 10m²'

  if (!form.giaNiemYet || form.giaNiemYet <= 0)
    errors.giaNiemYet = 'Giá niêm yết phải > 0'

  if (!isEditMode.value && form.images.length === 0) {
    errors.images = 'Vui lòng tải lên ít nhất 1 hình ảnh'
  }
  return Object.keys(errors).length === 0
}

 const roomStatus = (status) => {
  switch (status) {
    case 1:
      return { text: 'Còn trống', class: 'ready' }
    case 2:
      return { text: 'Đang thuê', class: 'occupied' }
    case 3:
      return { text: 'Bảo trì', class: 'repairing' }
    default:
      return { text: 'Không rõ', class: 'unknown' }
  }
}
const submitVariant = async () => {
  if (!validateForm()) {
    alert('Vui lòng kiểm tra lại thông tin!')
    return
  }
  const fd = new FormData()

  fd.append('MaLp', form.maLp)
  fd.append('TenBienThe', form.tenBienThe)
  fd.append('LoaiGiuong', form.loaiGiuong)
  fd.append('HuongNhin', form.huongNhin)
  fd.append('SoNguoiLon', form.soNguoiLon)
  fd.append('SoTreEm', form.soTreEm)
  fd.append('DienTich', form.dienTich)
  fd.append('GiaNiemYet', form.giaNiemYet)

  form.tienIchIds.forEach(id => fd.append('TienIchIds', id))
  form.images.forEach(file => fd.append('Images', file))

  try {
    if (isEditMode.value) {
      await axios.put(
        `${API}/api/admin/QuanLyPhongBienThe/${selectedVariant.value.maBienThePhong}`,
        fd
      )
      alert('Cập nhật biến thể thành công!')
    } else {
      await axios.post(
        `${API}/api/admin/QuanLyPhongBienThe`,
        fd
      )
      alert('Tạo biến thể thành công!')
      closeCreateModal()
    }
  } catch (err) {
    console.error(err)
    const msg =
    err.response?.data ||'Có lỗi xảy ra, vui lòng thử lại!'
    alert(msg)
  }
  await loadVariants()
}
const submitPhong = async () => {
  try {
    await axios.post(`${API}/api/admin/QuanLyPhong`, {
      soPhong: formPhong.soPhong,
      maBienThePhong: formPhong.maBienThePhong,
      trangThai: formPhong.trangThai
    })

    alert('Thêm phòng thành công!')
    closeAddRoomModal()
    await loadVariants()
  } catch (err) {
    alert(err.response?.data || 'Lỗi khi thêm phòng')
  }
}

const submitEditRoom = async () => {
  try {
    await axios.put(
      `${API}/api/admin/QuanLyPhong/${roomEditing.value.maPhong}`,
      {
        trangThai: roomEditing.value.trangThai
      }
    )

    // cập nhật lại UI local (khỏi load lại toàn trang)
    const variant = variants.value.find(v =>
      v.phongs.some(p => p.maPhong === roomEditing.value.maPhong)
    )

    if (variant) {
      const room = variant.phongs.find(
        p => p.maPhong === roomEditing.value.maPhong
      )
      if (room) {
        room.trangThai = roomEditing.value.trangThai
      }
    }
    alert('Cập nhật phòng thành công!')
    closeEditRoomModal()
    await loadVariants()
  } catch (err) {
    console.error(err)
    alert(err.response?.data || 'Lỗi khi thêm phòng')
  }
  await loadVariants()
}

const loadVariants = async () => {
  const res = await axios.get(`${API}/api/admin/QuanLyPhongBienThe`);
  dashboard.value=res.data.dashboard
  variants.value = res.data.data.map(x => ({
  ...x,
  id: x.maBienThePhong
}))
}
onMounted(async () => {
  await loadVariants()
  fetchData()
})

const selectedVariant = ref({})
const isEditMode = ref(false)

/* ====== ACTIONS ====== */
const openCreateModal = () => {
  isEditMode.value = false
  Object.assign(form, {
    maLp: '',
    tenBienThe: '',
    loaiGiuong: '',
    huongNhin: '',
    soNguoiLon: 2,
    soTreEm: 2,
    dienTich: 30,
    giaNiemYet: 0,
    tienIchIds: [],
    hinhAnhs: []
  })
  previewImages.value = []
}
const closeCreateModal = () => {
  const modalEl = document.getElementById('variantModal')
  const modal = bootstrap.Modal.getInstance(modalEl)
  modal?.hide()
}
const closeAddRoomModal = () => {
  const modalEl = document.getElementById('addRoomModal')
  const modal = bootstrap.Modal.getInstance(modalEl)
  modal?.hide()
}
const closeEditRoomModal = () => {
  const modalEl = document.getElementById('editRoomModal')
  bootstrap.Modal.getInstance(modalEl)?.hide()
}
const openEditModal = async (v) => {
  isEditMode.value = true

  try {
    const res = await axios.get(
      `${API}/api/admin/QuanLyPhongBienThe/${v.maBienThePhong}`
    )

    const data = res.data

    Object.assign(form, {
      maLp: data.maLp,
      tenBienThe: data.tenBienThe,
      loaiGiuong: data.loaiGiuong ?? '',
      huongNhin: data.huongNhin ?? '',
      soNguoiLon: data.soNguoiLon,
      soTreEm: data.soTreEm,
      dienTich: data.dienTich,
      giaNiemYet: data.giaNiemYet,
      tienIchIds: data.tienIchIds,
      images: [] // reset file upload
    })

    // 🔥 HIỆN ẢNH CŨ
    previewImages.value = data.imageUrls ?? []

    selectedVariant.value = v
  } catch (err) {
    console.error(err)
    alert('Không tải được dữ liệu biến thể')
  }
}
const openAddRoom = (maBienThePhong) => {
  formPhong.soPhong = ''
  formPhong.trangThai = 0
  formPhong.maBienThePhong = maBienThePhong
}
const getVariantName = (id) =>
  variants.value.find(v => v.maBienThePhong === id)?.tenBienThe || ''
/* ====== STATE QUẢN LÝ ====== */
const variantToDelete = ref(null)

/* ====== ACTIONS ====== */
const prepareDelete = (id) => {
  variantToDelete.value = id
}

const confirmDelete = async () => {
  if (!variantToDelete.value) return

  try {
    await axios.delete(
      `${API}/api/admin/QuanLyPhongBienThe/${variantToDelete.value}`
    )

    // Xóa khỏi danh sách sau khi DB xóa thành công
    variants.value = variants.value.filter(
      v => v.maBienThePhong !== variantToDelete.value
    )

    variantToDelete.value = null

    alert('Xóa biến thể phòng thành công!')
  } catch (err) {
    console.error(err)
    alert('Xóa thất bại! Biến thể đang được sử dụng.')
  }
}


// Mở modal sửa phòng
const openEditRoom = (variantId, room) => {
  roomEditing.value = {
    maPhong: room.maPhong,
    soPhong: room.soPhong,
    trangThai: room.trangThai
  }
}

// Chuẩn bị xóa phòng
const prepareDeleteRoom = (variantId, maPhong) => {
  const variant = variants.value.find(v => v.maBienThePhong === variantId)
  const room = variant?.phongs.find(r => r.maPhong === maPhong)

  roomToDelete.value = {
    maPhong,
    soPhong: room?.soPhong,
    variantId
  }
}
const confirmDeleteRoom = async () => {
  if (!roomToDelete.value.maPhong) return

  try {
    await axios.delete(
      `${API}/api/admin/QuanLyPhong/${roomToDelete.value.maPhong}`
    )

    //xóa cục bộ
    const variant = variants.value.find(
      v => v.maBienThePhong === roomToDelete.value.variantId
    )
    if (variant) {
      variant.phongs = variant.phongs.filter(
        r => r.maPhong !== roomToDelete.value.maPhong
      )
    }

    roomToDelete.value = { maPhong: null, soPhong: '', variantId: null }

    alert('Xóa phòng thành công')
  } catch (err) {
    console.error(err)
    alert('Không thể xóa phòng (đang có dữ liệu liên quan)')
  }
  loadVariants()
}
const keyword = ref('')
const selectedLoaiPhong = ref(null)
const pagination = ref({
  page: 1,
  pageSize: 9,
  totalPages: 0,
  totalItems: 0
})

const fetchData = async () => {
  const res = await axios.get(
    `${API}/api/admin/QuanLyPhongBienThe`,
    {
      params: {
        keyword: keyword.value || null,
        loaiPhongId: selectedLoaiPhong.value,
        maLp: activeLoaiPhong.value,
        page: pagination.value.page,
        pageSize: pagination.value.pageSize
      }
    }
  )

  dashboard.value = res.data.dashboard
  variants.value = res.data.data.map(x => ({
    ...x,
    id: x.maBienThePhong
  }))
  pagination.value.totalPages = res.data.pagination.totalPages
  pagination.value.totalItems = res.data.pagination.totalItems
}
const goToPage = (page) => {
  if (page === '...' || page < 1 || page > pagination.value.totalPages) return
  pagination.value.page = page
  fetchData()
}

const goFirst = () => goToPage(1)
const goLast = () => goToPage(pagination.value.totalPages)
const goPrev = () => goToPage(pagination.value.page - 1)
const goNext = () => goToPage(pagination.value.page + 1)

const pagesToShow = computed(() => {
  const pages = []
  const total = pagination.value.totalPages
  const current = pagination.value.page

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total)
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages
})

const activeLoaiPhong = ref(null) // null = tất cả
let searchTimeout = null

watch([keyword, selectedLoaiPhong, activeLoaiPhong], () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    fetchData()
  }, 300)
})

const collapsedVariants = ref([])
const toggleRooms = (id) => {
  const index = collapsedVariants.value.indexOf(id)

  if (index > -1) {
    collapsedVariants.value.splice(index, 1)
  } else {
    collapsedVariants.value.push(id)
  }
}
const isCollapsed = (id) => collapsedVariants.value.includes(id)
const formatPrice = (val) => val?.toLocaleString('vi-VN')
</script>

<template>
  <div class="admin-container p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-0">Quản lý Phòng</h4>
        <small class="text-secondary">Biến thể phòng, tiện ích & bảng giá</small>
      </div>
      <button
        class="btn btn-success fw-bold"
        @click="openCreateModal"
        data-bs-toggle="modal"
        data-bs-target="#variantModal"
      >
        <i class='bx bx-plus me-1'></i> Thêm biến thể
      </button>

    </div>

    <div class="row g-3 mb-4">
      <div class="row">
        <!-- Biến thể -->
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon" style="background-color:#f59e0b15;color:#f59e0b">
              <i class="bx bx-grid-alt"></i>
            </div>
            <div>
              <div class="stat-label">Biến thể</div>
              <div class="stat-value">{{ dashboard.tongBienThe }}</div>
            </div>
          </div>
        </div>

        <!-- Tổng phòng -->
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon" style="background-color:#64748b15;color:#64748b">
              <i class="bx bx-bed"></i>
            </div>
            <div>
              <div class="stat-label">Tổng phòng</div>
              <div class="stat-value">{{ dashboard.tongPhong }}</div>
            </div>
          </div>
        </div>

        <!-- Sẵn sàng -->
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon" style="background-color:#10b98115;color:#10b981">
              <i class="bx bx-check-circle"></i>
            </div>
            <div>
              <div class="stat-label">Sẵn sàng</div>
              <div class="stat-value">{{ dashboard.tongPhongTrong }}</div>
            </div>
          </div>
        </div>

        <!-- Đang có khách -->
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon" style="background-color:#f59e0b15;color:#f59e0b">
              <i class="bx bx-user"></i>
            </div>
            <div>
              <div class="stat-label">Đang có khách</div>
              <div class="stat-value">{{ dashboard.dangCoKhach }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="row g-2 mb-4">
      <div class="col-md-4">
        <div class="input-group search-group">
          <span class="input-group-text search-icon">
            <i class='bx bx-search'></i>
          </span>
          <input
            type="text"
            v-model="keyword"
            class="form-control search-input"
            placeholder="Tìm kiếm biến thể phòng..."
          >
        </div>
      </div>
      <div class="col-md-3">
      <select class="form-select" v-model="selectedLoaiPhong">
        <option :value="null">Tất cả loại phòng</option>
        <option
          v-for="lp in dashboard.dsLoaiPhong"
          :key="lp.maLp"
          :value="lp.maLp"
        >
          {{ lp.tenLoai }}
        </option>
      </select>

</div>

    </div>
      <div class="d-flex gap-2 mb-4">
        <!-- Tất cả -->
        <button
          class="btn-tab"
          :class="{ active: activeLoaiPhong === null }"
          @click="activeLoaiPhong = null"
        >
          Tất cả
          <span class="ms-1 opacity-50">{{ dashboard?.TongBienThe }}</span>
        </button>

        <!-- Theo loại -->
        <button
          v-for="lp in dashboard?.dsLoaiPhong"
          :key="lp.MaLp"
          class="btn-tab"
          :class="{ active: activeLoaiPhong === lp.maLp }"
          @click="activeLoaiPhong = lp.maLp"
        >
          {{ lp.tenLoai }}
          <span class="ms-1 opacity-50">{{ lp.soLuong }}</span>
        </button>
      </div>


    <div class="row g-4">
      <div class="col-md-4" v-for="v in variants" :key="v.maBienThePhong">
        <div class="room-variant-card">
          <div class="card-header-dark">
            <span class="badge-type">{{ v.tenLoai }}</span>
            <div class="card-actions">
              <button @click="openEditModal(v)" data-bs-toggle="modal" data-bs-target="#variantModal"><i class='bx bx-pencil'></i></button>
              <button
                @click="prepareDelete(v.maBienThePhong)"
                data-bs-toggle="modal"
                data-bs-target="#deleteConfirmModal"
              >
                <i class='bx bx-trash'></i>
              </button>

            </div>
          </div>
          
          <div class="card-body-content">
            <div class="room-preview-icon">
              <img
                v-if="v.anhDaiDien"
                :src="`${API}/${v.anhDaiDien}`"
                class="room-preview-img"
                alt="Ảnh phòng"
              />
              <i v-else class="bx bx-bed"></i>
            </div>

            
            <h5 class="room-title">{{ v.tenBienThe }}</h5>
            <div class="room-meta">
              <i class='bx bx-fullscreen'></i> {{ v.dienTich }}m² &nbsp; 
              <i class='bx bx-group'></i> {{ v.soNguoiLon }} người lớn&nbsp; 
              <span v-if="Number(v.soTreEm)"><i class='bx bx-child'></i> {{ v.soTreEm }} trẻ em &nbsp;</span>
              <i class='bx bx-show'></i> {{ v.huongNhin }}
            </div>

            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="bed-type"><i class='bx bx-bed me-1'></i> {{ v.loaiGiuong }}</span>
              <span class="room-price">{{ formatPrice(v.giaGoc) }} đ <small class="text-muted fw-normal">/đêm</small></span>
            </div>

            <div class="amenities-list mt-3">
              <div class="section-label">Tiện ích</div>
              <div class="d-flex flex-wrap gap-1">
                <span
                  v-for="ti in v.tienIch"
                  :key="ti.tenTienIch"
                  class="amenity-tag"
                >
                  <i class='bx bx-wifi' v-if="ti.tenTienIch.includes('Wifi')"></i>
                  <i class='bx bx-tv' v-else-if="ti.tenTienIch.includes('TV')"></i>
                  <i class='bx bx-wind' v-else-if="ti.tenTienIch.includes('Điều hòa')"></i>

                  {{ ti.tenTienIch }}
                </span>
              </div>
            </div>


            <div v-if="v.holidayPrice" class="holiday-box mt-3">
              <div class="d-flex justify-content-between align-items-center">
                <span class="holiday-label">HOLIDAY</span>
                <span class="holiday-name">{{ giaGoc }}</span>
                <span class="holiday-val text-warning fw-bold">{{ formatPrice(v.giaGoc) }} đ</span>
              </div>
            </div>

            <div class="room-list-section mt-3">
              <div class="d-flex justify-content-between align-items-center mb-2 list-toggle-header" 
                  @click="toggleRooms(v.maBienThePhong)">
                <strong class="small">
                  Danh sách phòng 
                  <span class="badge bg-light text-dark border ms-1">{{ v.SoPhongCon }}</span>
                </strong>
                <i :class="['bx bx-chevron-down toggle-icon', { 'is-flipped': isCollapsed(v.maBienThePhong) }]"></i>
              </div>

              <div v-show="!isCollapsed(v.maBienThePhong)" class="rooms-container-animate room-list-scroll">
                <div class="room-no-item room-item-row" v-for="r in v.phongs" :key="r.no">
                  <div class="d-flex align-items-center gap-2">
                    <span class="room-number">{{ r.soPhong }}</span>

                    <span
                      @click="toggleRoomStatus(v.maBienThePhong, r.soPhong)"
                      :class="['status-pill', roomStatus(r.trangThai).class]"
                      style="cursor: pointer;"
                    >
                      {{ roomStatus(r.trangThai).text }}
                    </span>
                  </div>

                   
                  <div class="room-actions-hidden">
                    <button
                      class="btn-room-view"
                      @click="openRoomDetail(r.maPhong)"
                      data-bs-toggle="modal"
                      data-bs-target="#roomDetailModal"
                    >
                      <i class="bx bx-show"></i>
                    </button>
                    <button class="btn-room-edit" @click="openEditRoom(v.maBienThePhong, r)" data-bs-toggle="modal" data-bs-target="#editRoomModal">
                      <i class='bx bx-edit-alt'></i>
                    </button>
                    <button
                      class="btn-room-delete"
                      @click="prepareDeleteRoom(v.maBienThePhong, r.maPhong)"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteRoomConfirmModal"
                    >
                      <i class='bx bx-x'></i>
                    </button>
                  </div>
                </div>

                <button
                  class="btn btn-success btn-add-room mt-2"
                  @click="openAddRoom(v.maBienThePhong)"
                  data-bs-toggle="modal"
                  data-bs-target="#addRoomModal"
                >
                  <i class='bx bx-plus'></i> Thêm phòng
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="variantModal" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content border-0 shadow-lg">

      <!-- HEADER -->
      <div class="modal-header bg-dark-blue text-white py-3">
        <h5 class="modal-title fs-6">
          <i class='bx bx-bed me-2'></i>
          {{ isEditMode ? 'Chỉnh sửa biến thể phòng' : 'Tạo biến thể phòng mới' }}
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>

      <!-- BODY -->
      <div class="modal-body p-4">
        <div class="row g-3">

          <!-- Loại phòng -->
          <div class="col-md-6">
            <label class="form-label small fw-bold">Loại phòng *</label>
            <select class="form-select custom-input" :class="{ 'is-invalid': errors.maLp }" v-model="form.maLp">
              <option value="">Chọn loại phòng...</option>
              <option v-for="lp in dashboard.dsLoaiPhong" :key="lp.maLp" :value="lp.maLp">
                {{ lp.tenLoai }}
              </option>
            </select>
            <div class="invalid-feedback">
              {{ errors.maLp }}
            </div>
          </div>

          <!-- Tên biến thể -->
          <div class="col-md-6">
            <label class="form-label small fw-bold">Tên biến thể *</label>
            <input type="text" class="form-control custom-input"
                   v-model="form.tenBienThe"
                   :class="{ 'is-invalid': errors.tenBienThe }"
                   placeholder="VD: Deluxe Ocean View">
            <div class="invalid-feedback">
              {{ errors.tenBienThe }}
            </div>
          </div>

          <!-- Loại giường -->
          <div class="col-md-6">
            <label class="form-label small fw-bold">Loại giường *</label>
            <select class="form-select custom-input" :class="{ 'is-invalid': errors.loaiGiuong }" v-model="form.loaiGiuong">
              <option value="">Chọn loại giường...</option>
              <option value="Giường đơn">Giường đơn</option>
              <option value="Giường đôi">Giường đôi</option>
              <option value="2 giường đơn">2 giường đơn</option>
              <option value="Queen size">Queen size</option>
              <option value="King size">King size</option>
            </select>
            <div class="invalid-feedback">
              {{ errors.loaiGiuong }}
            </div>
          </div>

          <!-- Hướng nhìn -->
          <div class="col-md-6">
            <label class="form-label small fw-bold">Hướng nhìn *</label>
            <select class="form-select custom-input" :class="{ 'is-invalid': errors.huongNhin }" v-model="form.huongNhin">
              <option value="">Chọn hướng nhìn...</option>
              <option value="Hướng biển">Hướng biển</option>
              <option value="Hướng hồ bơi">Hướng hồ bơi</option>
              <option value="Hướng thành phố">Hướng thành phố</option>
              <option value="Hướng vườn">Hướng vườn</option>
              <option value="Hướng núi">Hướng núi</option>
            </select>
            <div class="invalid-feedback">
              {{ errors.huongNhin }}
            </div>
          </div>


          <!-- Số người -->
          <div class="col-md-4">
            <label class="form-label small fw-bold">Số người lớn tối đa</label>
            <input type="number" min="1" class="form-control custom-input" :class="{ 'is-invalid': errors.soNguoiLon }"
                   v-model.number="form.soNguoiLon">
            <div class="invalid-feedback">
              {{ errors.soNguoiLon }}
            </div>
          </div>

          <div class="col-md-4">
            <label class="form-label small fw-bold">Số trẻ em tối đa</label>
            <input type="number" min="1" class="form-control custom-input" :class="{ 'is-invalid': errors.soNguoiLon }"
                   v-model.number="form.soTreEm">
            <div class="invalid-feedback">
              {{ errors.soTreEm }}
            </div>
          </div>

          <!-- Diện tích -->
          <div class="col-md-4">
            <label class="form-label small fw-bold">Diện tích (m²)</label>
            <input type="number" min="10" class="form-control custom-input" :class="{ 'is-invalid': errors.dienTich }"
                   v-model.number="form.dienTich">
            <div class="invalid-feedback">
              {{ errors.dienTich }}
            </div>
          </div>

          <!-- Giá -->
          <div class="col-md-4">
            <label class="form-label small fw-bold">Giá niêm yết (VNĐ)</label>
            <input type="number" class="form-control custom-input fw-bold text-orange" :class="{ 'is-invalid': errors.giaNiemYet }"
                   v-model.number="form.giaNiemYet">
            <div class="invalid-feedback">
              {{ errors.giaNiemYet }}
            </div>
          </div>
        </div>

        <!-- TIỆN ÍCH -->
        <div class="mt-4">
          <label class="form-label small fw-bold mb-2">Tiện ích phòng</label>
          <div class="row g-2">
            <div class="col-md-4"
                v-for="ti in dashboard.dsTienIch"
                :key="ti.maTi">
              <label class="amenity-check-item w-100">
                <input
                  type="checkbox"
                  class="form-check-input me-2"
                  :value="ti.maTi"
                  v-model="form.tienIchIds"
                >
                <i :class="ti.icon"></i>
                <span>{{ ti.tenTienIch }}</span>
              </label>
            </div>
          </div>
        </div>


        <!-- HÌNH ẢNH -->
        <div class="mt-4">
          <label class="form-label small fw-bold">Hình ảnh phòng</label>
          <input type="file"
                 class="form-control"
                 multiple
                 accept="image/*"
                 :class="{ 'is-invalid': errors.images }"
                 @change="handleUploadImages">
          <div class="invalid-feedback d-block">
            {{ errors.images }}
          </div>
          <!-- Preview -->
          <div class="d-flex flex-wrap gap-2 mt-2">
            <div v-for="(img, i) in previewImages" :key="i" class="position-relative">
              <img
                :src="img"
                class="rounded"
                style="width:80px;height:80px;object-fit:cover;"
              >
              <button
                class="btn btn-sm btn-danger position-absolute top-0 end-0"
                @click="removeImage(i)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="modal-footer border-0">
        <button class="btn btn-light px-4" data-bs-dismiss="modal">Hủy</button>
        <button class="btn btn-primary px-4 fw-bold" @click="submitVariant">
          {{ isEditMode ? 'Cập nhật' : 'Tạo mới' }}
        </button>
      </div>

    </div>
  </div>
</div>


    <div class="modal fade" id="addRoomModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered" style="max-width: 400px;">
        <div class="modal-content border-0 shadow">
          <div class="modal-body p-4">
            <div class="d-flex align-items-center mb-3">
               <div class="bg-warning-light p-2 rounded-3 me-2">
                 <i class='bx bx-door-open text-warning fs-4'></i>
               </div>
               <h5 class="modal-title fw-bold">Thêm phòng mới</h5>
            </div>
            
            <div class="mb-3">
              <label class="form-label small fw-bold text-warning">Số phòng</label>
              <input
                v-model="formPhong.soPhong"
                type="text"
                class="form-control custom-input border-warning shadow-sm"
                placeholder="VD: P101, P201..."
              />
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-muted">Biến thể</label>
              <input
                type="text"
                class="form-control bg-light"
                :value="getVariantName(formPhong.maBienThePhong)"
                disabled
              />
            </div>


            <div class="mb-4">
              <label class="form-label small fw-bold text-muted">Trạng thái</label>
              <select
                v-model="formPhong.trangThai"
                class="form-select custom-input bg-light"
              >
                <option :value="1">Sẵn sàng</option>
                <option :value="3">Đang sửa chữa</option>
              </select>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-light flex-grow-1" data-bs-dismiss="modal">Hủy</button>
              <button
                class="btn btn-warning-custom flex-grow-1 text-dark fw-bold"
                @click="submitPhong"
              >
                Thêm phòng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
<div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" style="max-width: 400px;">
    <div class="modal-content border-0 shadow-lg">
      <div class="modal-body p-4 text-center">
        <div class="mb-3 text-danger">
          <i class='bx bx-error-circle' style="font-size: 60px;"></i>
        </div>
        <h5 class="fw-bold">Xác nhận xóa?</h5>
        <p class="text-secondary small">
          Bạn có chắc chắn muốn xóa biến thể phòng này? Hành động này không thể hoàn tác và sẽ xóa tất cả các phòng thuộc biến thể này.
        </p>
        <div class="d-flex gap-2 mt-4">
          <button class="btn btn-light flex-grow-1" data-bs-dismiss="modal">Hủy bỏ</button>
          <button class="btn btn-danger flex-grow-1 fw-bold" @click="confirmDelete" data-bs-dismiss="modal">
            Vâng, Xóa ngay
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="editRoomModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" style="max-width: 350px;">
    <div class="modal-content border-0">
      <div class="modal-body p-4">
        <h6 class="fw-bold mb-3">
          Chỉnh sửa phòng {{ roomEditing.soPhong }}
        </h6>

        <select
          class="form-select custom-input"
          v-model="roomEditing.trangThai"
        >
          <!-- <option :value="0">Sẵn sàng</option> -->
          <option :value="1">Sẵn sàng</option>
          <option :value="3">Đang sửa chữa</option>
        </select>
        <div class="d-flex gap-3" style="padding-top: 5px;">
          <button class="btn btn-light flex-grow-1" data-bs-dismiss="modal">Đóng</button>
          <button
            class="btn btn-primary flex-grow-1 text-white fw-bold"
            @click="submitEditRoom"
          >
            <i class="bx bx-save me-1"></i> Lưu thay đổi
          </button>

        </div>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="deleteRoomConfirmModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" style="max-width: 350px;">
    <div class="modal-content border-0">
      <div class="modal-body p-4 text-center">
        <i class='bx bx-trash text-danger mb-3' style="font-size: 40px;"></i>
        <p class="mb-4">Xóa phòng <strong>{{ roomToDelete.soPhong }}</strong>?</p>
        <div class="d-flex gap-2">
          <button class="btn btn-light flex-grow-1" data-bs-dismiss="modal">Hủy</button>
          <button class="btn btn-danger flex-grow-1" @click="confirmDeleteRoom" data-bs-dismiss="modal">Xóa</button>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="roomDetailModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" style="max-width: 450px;">
    <div class="modal-content border-0 shadow-lg" style="border-radius: 20px; overflow: hidden;">
      
      <div class="modal-header border-0 bg-light px-4 pt-4 pb-0">
        <h5 class="fw-bold mb-0 text-primary">
          <i class="bi bi-door-open-fill me-2"></i>Phòng {{ roomDetail?.soPhong }}
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span class="badge rounded-pill px-3 py-2" 
                  :class="roomDetail?.trangThai === 1 ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'">
              ● {{ roomStatus(roomDetail?.trangThai).text }}
            </span>
          </div>
          <div class="text-end">
            <small class="text-muted d-block">Giá mỗi đêm</small>
            <span class="fw-bold fs-5 text-danger">{{ formatPrice(roomDetail?.gia) }} đ</span>
          </div>
        </div>

        <div class="p-3 bg-light rounded-3 mb-4">
          <div class="d-flex align-items-center mb-2">
            <i class="bi bi-layers me-2 text-secondary"></i>
            <span><strong>Loại phòng:</strong> {{ roomDetail?.tenBienThe }}</span>
          </div>
        </div>

        <div v-if="roomDetail?.khachDangThue" class="card border-0 bg-primary-subtle text-primary-emphasis p-3">
          <h6 class="fw-bold mb-3 d-flex align-items-center">
            <i class="bi bi-person-badge-fill me-2"></i> Khách đang lưu trú
          </h6>
          
          <div class="d-flex flex-column gap-2">
            <div class="d-flex align-items-center">
              <i class="bi bi-person me-2"></i>
              <span>{{ roomDetail.khachDangThue.tenKhach }}</span>
            </div>
            <div class="d-flex align-items-center">
              <i class="bi bi-telephone me-2"></i>
              <span>{{ roomDetail.khachDangThue.dienThoai }}</span>
            </div>
            <div class="d-flex align-items-center mt-2 p-2 bg-white bg-opacity-50 rounded text-dark small">
              <i class="bi bi-calendar-range me-2 text-primary"></i>
              {{ roomDetail.khachDangThue.checkIn }} 
              <i class="bi bi-arrow-right mx-2"></i> 
              {{ roomDetail.khachDangThue.checkOut }}
            </div>
          </div>
        </div>

        <div v-else class="text-center py-4 rounded-3 border border-dashed">
          <i class="bi bi-house-check text-muted fs-1 d-block mb-2"></i>
          <span class="text-muted">Phòng hiện đang sẵn sàng đón khách</span>
        </div>

        <div class="row g-2 mt-4">
          <div class="col-12">
            <button class="btn btn-dark w-100 py-2 fw-semibold" data-bs-dismiss="modal" style="border-radius: 10px;">
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>
  </div>
  <!-- Phân trang -->
  <!-- Basic Pagination -->
  <div class="demo-inline-spacing d-flex justify-content-center pt-2">
    <!-- Basic Pagination -->
    <nav aria-label="Page navigation">
  <ul class="pagination">

    <!-- First -->
    <li class="page-item"
        :class="{ disabled: pagination.page === 1 }">
      <a class="page-link" @click="goFirst">
        <i class="bx bx-chevrons-left"></i>
      </a>
    </li>

    <!-- Prev -->
    <li class="page-item"
        :class="{ disabled: pagination.page === 1 }">
      <a class="page-link" @click="goPrev">
        <i class="bx bx-chevron-left"></i>
      </a>
    </li>

    <!-- Pages -->
    <li v-for="p in pagesToShow"
        :key="p"
        class="page-item"
        :class="{ active: p === pagination.page, disabled: p === '...' }">
      <a class="page-link" @click="goToPage(p)">
        {{ p }}
      </a>
    </li>

    <!-- Next -->
    <li class="page-item"
        :class="{ disabled: pagination.page === pagination.totalPages }">
      <a class="page-link" @click="goNext">
        <i class="bx bx-chevron-right"></i>
      </a>
    </li>

    <!-- Last -->
    <li class="page-item"
        :class="{ disabled: pagination.page === pagination.totalPages }">
      <a class="page-link" @click="goLast">
        <i class="bx bx-chevrons-right"></i>
      </a>
    </li>

  </ul>
</nav>
  </div>
</template>

<style>
/* .room-preview-icon {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
} */
 .room-list-scroll {
  max-height: 300px;      /* chỉnh theo UI */
  overflow-y: auto;
  padding-right: 6px;    /* tránh che nội dung khi có scrollbar */
}
 .search-group {
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(255, 193, 7, 0.15);
  transition: all .25s ease;
}

.search-icon {
  background: #fff;
  border: none;
  padding-left: 14px;
}

.search-icon i {
  font-size: 18px;
  color: #f4b400;
}

.search-input {
  border: none;
  padding: 12px 14px;
  font-size: 14px;
}

.search-input::placeholder {
  color: #aaa;
}

.search-group:focus-within {
  box-shadow: 0 10px 28px rgba(255, 193, 7, 0.35);
  transform: translateY(-1px);
}

.search-group:focus-within .search-icon i {
  color: #ff9800;
}

.btn-primary-custom {
  background-color: #0d6efd;
}
.btn-primary-custom:hover {
  background-color: #0b5ed7;
}

.room-preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;   /* ⭐ quan trọng */
  background-color: #f5f5f5;
}

/* Header điều khiển ẩn hiện */
.list-toggle-header {
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.2s;
}

.list-toggle-header:hover {
  color: #f59e0b; /* Đổi màu nhẹ khi hover để biết nhấn được */
}

/* Icon mũi tên */
.toggle-icon {
  font-size: 18px;
  transition: transform 0.3s ease;
  color: #64748b;
}

/* Xoay icon 180 độ khi đóng */
.toggle-icon.is-flipped {
  transform: rotate(-90deg);
}

/* Animation nhẹ cho danh sách */
.rooms-container-animate {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Style cho số phòng (cũ nhưng cần đảm bảo font-weight) */
.room-number {
  font-weight: 700;
  color: #1e293b;
}
.room-item-row {
  position: relative;
  transition: all 0.2s;
}

.room-item-row:hover {
  background: #f1f5f9 !important; /* Đậm hơn một chút khi hover */
}

/* Ẩn nút mặc định */
.room-actions-hidden {
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.2s ease;
  display: flex;
  gap: 4px;
}

/* Hiện nút khi hover vào dòng */
.room-item-row:hover .room-actions-hidden {
  opacity: 1;
  transform: translateX(0);
}

/* Style cho các nút nhỏ */
.btn-room-edit, .btn-room-delete {
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.btn-room-edit { background: #e0f2fe; color: #0369a1; }
.btn-room-delete { background: #fee2e2; color: #b91c1c; }

/* Trạng thái sửa chữa */
.status-pill.repairing {
  background: #ffedd5;
  color: #9a3412;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
}
.btn-danger {
  background-color: #ef4444;
  border: none;
  border-radius: 10px;
  padding: 10px;
}
.btn-danger:hover {
  background-color: #dc2626;
}
.text-danger {
  color: #ef4444 !important;
}
/* CSS THEO STYLE UI TRONG HÌNH */
body { background-color: #f8fafc; font-family: 'Inter', sans-serif; color: #1e293b; }

.bg-dark-blue { background-color: #1e293b; }
.text-orange { color: #f59e0b; }

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
}
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
.stat-label { font-size: 13px; color: #64748b; }
.stat-value { font-size: 20px; font-weight: 700; }

.btn-warning-custom {
  background-color: #f59e0b;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
}

.btn-tab {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #64748b;
  transition: 0.2s;
}
.btn-tab.active {
  background: #1e293b;
  color: white;
  border-color: #1e293b;
}

/* Room Variant Card */
.room-variant-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  height: 100%;
}
.card-header-dark {
  background: #1e293b;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.badge-type {
  font-size: 11px;
  background: rgba(255,255,255,0.15);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
}
.card-actions button {
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  margin-left: 5px;
  font-size: 14px;
}

.card-body-content { padding: 20px; }
.room-preview-icon {
  background: #f1f5f9;
  height: 120px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  color: #cbd5e1;
  margin-bottom: 15px;
}
.room-title { font-weight: 800; color: #0f172a; margin-bottom: 5px; }
.room-meta { font-size: 12px; color: #64748b; }
.room-price { color: #f59e0b; font-weight: 800; font-size: 18px; }

.amenity-tag {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  color: #475569;
}

.holiday-box {
  background: #fffbeb;
  padding: 12px;
  border-radius: 10px;
}
.holiday-label { font-size: 10px; font-weight: 900; background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; }
.holiday-name { font-size: 12px; color: #475569; flex-grow: 1; margin-left: 8px; }

.room-no-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: 600;
}
.status-pill.ready { background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 6px; font-size: 11px; }

.btn-add-room {
  width: 100%;
  border: 1px dashed #cbd5e1;
  background: white;
  padding: 8px;
  border-radius: 8px;
  font-size: 13px;
  color: #64748b;
}

/* Modal Inputs */
.custom-input {
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  padding: 10px 15px;
  font-size: 14px;
}
.amenity-check-item {
  border: 1px solid #e2e8f0;
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.amenity-check-item.active {
  border-color: #f59e0b;
  background: #fffbeb;
}
.bg-warning-light { background-color: #fff7ed; }
</style>