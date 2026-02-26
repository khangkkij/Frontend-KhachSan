<script setup>
import {reactive, ref, computed, onMounted, watch } from 'vue'
import axios from 'axios';
const API = import.meta.env.VITE_API_URL
const variants = ref([])
const isEditingPrice = ref(false)
const editingIndex = ref(null)
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
  giaCuoiTuan: 0,
  giaHienTai: 0,
  priceRanges: [],
  tienIchIds: [],
  images: []
})
const tempPrice = reactive({
  maThietLapGia: 0,
  loaiGia: 'Lễ',
  moTa: '',
  ngayBatDau: '',
  ngayKetThuc: '',
  gia: 0
})
const priceErrors = reactive({})
function addPriceRange() {

  // reset lỗi
  priceErrors.moTa = ''
  priceErrors.gia = ''
  priceErrors.ngayBatDau = ''
  priceErrors.ngayKetThuc = ''

  // ===== VALIDATE =====

  if (!tempPrice.moTa.trim()) {
    priceErrors.moTa = 'Mô tả không được để trống'
  }

  if (!tempPrice.gia || tempPrice.gia <= 0) {
    priceErrors.gia = 'Giá phải lớn hơn 0'
  }

  if (!tempPrice.ngayBatDau) {
    priceErrors.ngayBatDau = 'Vui lòng chọn ngày bắt đầu'
  }

  if (!tempPrice.ngayKetThuc) {
    priceErrors.ngayKetThuc = 'Vui lòng chọn ngày kết thúc'
  }

  if (
    tempPrice.ngayBatDau &&
    tempPrice.ngayKetThuc &&
    new Date(tempPrice.ngayKetThuc) < new Date(tempPrice.ngayBatDau)
  ) {
    priceErrors.ngayKetThuc = 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu'
  }

  // nếu có lỗi thì dừng
  if (Object.values(priceErrors).some(e => e)) return

  // ===== LƯU =====
  if (editingIndex.value !== null) {
    form.priceRanges[editingIndex.value] = { ...tempPrice }
  } else {
    form.priceRanges.push({ ...tempPrice })
  }

  resetTempPrice()
  closePriceModal()
}
function resetTempPrice() {
  tempPrice.maThietLapGia=0
  tempPrice.loaiGia = 'Lễ'
  tempPrice.moTa = ''
  tempPrice.ngayBatDau = ''
  tempPrice.ngayKetThuc = ''
  tempPrice.gia = 0
  tempPrice.macDinh = false

  isEditingPrice.value = false
  editingIndex.value = null
}
function removePriceRange(index) {
  form.priceRanges.splice(index, 1)
}
function editPriceRange(index) {
  const p = form.priceRanges[index]

  tempPrice.maThietLapGia = p.maThietLapGia || 0
  tempPrice.loaiGia = p.loaiGia
  tempPrice.moTa = p.moTa
  tempPrice.ngayBatDau = p.ngayBatDau
  tempPrice.ngayKetThuc = p.ngayKetThuc
  tempPrice.gia = p.gia
  tempPrice.macDinh = p.macDinh ?? false

  editingIndex.value = index
  isEditingPrice.value = true

  new bootstrap.Modal(document.getElementById('priceRangeModal')).show()
}
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
const openPriceModal = () => {
  const modal = new bootstrap.Modal(
    document.getElementById('priceRangeModal')
  )
  modal.show()
}

const closePriceModal = () => {
  const modalEl = document.getElementById('priceRangeModal')
  bootstrap.Modal.getInstance(modalEl)?.hide()
}
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
  files.forEach(file => {
    previewImages.value.push(URL.createObjectURL(file))
    form.images.push(file)
  })
  e.target.value = ''
}
const removeImage = (index) => {
  const img = previewImages.value[index]

  if (img.isOld) {
    removedImages.value.push(img.url)
  }

  previewImages.value.splice(index, 1)

  if (!img.isOld) {
    form.images.splice(index, 1)
  }
}

const errors = reactive({})

const validateForm = () => {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!form.maLp)
    errors.maLp = 'Vui lòng chọn hạng phòng'

  if (!form.tenBienThe.trim())
    errors.tenBienThe = 'Tên loại phòng không được để trống'

  if (!form.loaiGiuong)
    errors.loaiGiuong = 'Vui lòng chọn loại giường'

  if (!form.huongNhin)
    errors.huongNhin = 'Vui lòng chọn hướng nhìn'

  if (!form.soNguoiLon || form.soNguoiLon < 1)
    errors.soNguoiLon = 'Số người lớn phải ≥ 1'

  if (!form.dienTich || form.dienTich < 10)
    errors.dienTich = 'Diện tích tối thiểu 10m²'

  // ===== VALIDATE GIÁ =====

  if (!form.giaNiemYet || form.giaNiemYet <= 0) {
    errors.giaNiemYet = 'Giá niêm yết phải lớn hơn 0'
  }

  if (form.giaCuoiTuan && form.giaCuoiTuan < form.giaNiemYet) {
    errors.giaCuoiTuan = 'Giá cuối tuần không được nhỏ hơn giá niêm yết'
  }

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
  fd.append('GiaCuoiTuan', form.giaCuoiTuan)
  removedImages.value.forEach(url =>
    fd.append('RemovedImages', url)
  )
  form.priceRanges.forEach((p, index) => {
    fd.append(`PriceRanges[${index}].MaThietLapGia`, p.maThietLapGia || 0)
    fd.append(`PriceRanges[${index}].LoaiGia`, p.loaiGia)
    fd.append(`PriceRanges[${index}].MoTa`, p.moTa)
    fd.append(`PriceRanges[${index}].NgayBatDau`, p.ngayBatDau)
    fd.append(`PriceRanges[${index}].NgayKetThuc`, p.ngayKetThuc)
    fd.append(`PriceRanges[${index}].Gia`, p.gia)
    fd.append(`PriceRanges[${index}].MacDinh`, p.macDinh ?? false)
  })
  for (let pair of fd.entries()) {
    console.log(pair[0] + ':', pair[1])
  }
  
  form.tienIchIds.forEach(id => fd.append('TienIchIds', id))
  form.images.forEach(file => fd.append('Images', file))

  try {
    if (isEditMode.value) {
      await axios.put(
        `${API}/api/admin/QuanLyPhongBienThe/${selectedVariant.value.maBienThePhong}`,
        fd
      )
      alert('Cập nhật loại phòng thành công!')
    } else {
      await axios.post(
        `${API}/api/admin/QuanLyPhongBienThe`,
        fd
      )
      alert('Tạo loại phòng thành công!')
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
    priceRanges: [],
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
const removedImages = ref([])
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
      giaCuoiTuan: data.giaCuoiTuan,
      giaHienTai: data.giaHienTai,
      giaDangApDungId: data.giaDangApDungId,
      priceRanges: data.priceRanges?.map(p => ({
        maThietLapGia: p.maThietLap ?? p.maThietLapGia ?? 0,
        loaiGia: p.loaiGia,
        moTa: p.moTa,
        ngayBatDau: p.ngayBatDau,
        ngayKetThuc: p.ngayKetThuc,
        gia: p.gia,
        macDinh: p.macDinh ?? false
      })) || [],
      tienIchIds: data.tienIchIds,
      images: [] // reset file upload
    })
    previewImages.value = (data.imageUrls ?? []).map(url => ({
      url,
      isOld: true
    }))

    selectedVariant.value = v
  } catch (err) {
    console.error(err)
    alert('Không tải được dữ liệu loại phòng')
  }
}
const dangDungGiaThuong = computed(() => {
  return form.giaHienTai === form.giaNiemYet
})

const dangDungGiaCuoiTuan = computed(() => {
  return form.giaHienTai === form.giaCuoiTuan
})
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

    alert('Xóa loại phòng thành công!')
  } catch (err) {
    console.error(err)
    alert('Xóa thất bại! loại phòng đang được sử dụng.')
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

const openedVariants = ref([])

const toggleRooms = (id) => {
  const index = openedVariants.value.indexOf(id)

  if (index > -1) {
    openedVariants.value.splice(index, 1)
  } else {
    openedVariants.value.push(id)
  }
}

const isCollapsed = (id) => !openedVariants.value.includes(id)
const formatPrice = (val) => val?.toLocaleString('vi-VN')
</script>

<template>
  <div class="admin-container p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-0">Quản lý Phòng</h4>
        <small class="text-secondary">Loại phòng, tiện ích & bảng giá</small>
      </div>
      <button
        class="btn btn-success fw-bold"
        @click="openCreateModal"
        data-bs-toggle="modal"
        data-bs-target="#variantModal"
      >
        <i class='bx bx-plus me-1'></i> Thêm loại phòng
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
              <div class="stat-label">Loại phòng</div>
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
            placeholder="Tìm kiếm loại phòng..."
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
              <span class="room-price">{{ formatPrice(v.giaHienTai) }} đ <small class="text-muted fw-normal">/đêm</small></span>
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
                <span class="holiday-name">{{ giaHienTai }}</span>
                <span class="holiday-val text-warning fw-bold">{{ formatPrice(v.giaHienTai) }} đ</span>
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

    <div class="modal fade" id="variantModal" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content border-0 shadow-lg">

      <!-- HEADER -->
      <div class="modal-header bg-dark-blue text-white py-3">
        <h5 class="modal-title fs-6">
          <i class='bx bx-bed me-2'></i>
          {{ isEditMode ? 'Chỉnh sửa loại phòng' : 'Tạo loại phòng mới' }}
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>

      <!-- BODY -->
      <div class="modal-body p-4">
        <div class="row g-3">

          <!-- Loại phòng -->
          <div class="col-md-6">
            <label class="form-label small fw-bold">Loại hạng phòng *</label>
            <select class="form-select custom-input" :class="{ 'is-invalid': errors.maLp }" v-model="form.maLp">
              <option value="">Chọn loại hạng phòng...</option>
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
            <label class="form-label small fw-bold">Tên loại phòng *</label>
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
            <!-- GIÁ THƯỜNG -->
            <label class="form-label small fw-bold d-flex justify-content-between">
              Giá niêm yết (VNĐ)
              <span 
                v-if="isEditMode"
                class="badge"
                :class="dangDungGiaThuong ? 'bg-success' : 'bg-secondary'"
              >
                {{ dangDungGiaThuong ? 'Đang dùng' : 'Không dùng' }}
              </span>
            </label>

            <input type="number"
                  class="form-control custom-input fw-bold text-orange"
                  :class="{ 'is-invalid': errors.giaNiemYet }"
                  v-model.number="form.giaNiemYet">

            <div class="invalid-feedback">
              {{ errors.giaNiemYet }}
            </div>

            <!-- GIÁ CUỐI TUẦN -->
            <label class="form-label small fw-bold mt-3 d-flex justify-content-between">
              Giá cuối tuần (VNĐ)
              <span 
                v-if="isEditMode"
                class="badge"
                :class="dangDungGiaCuoiTuan ? 'bg-success' : 'bg-secondary'"
              >
                {{ dangDungGiaCuoiTuan ? 'Đang dùng' : 'Không dùng' }}
              </span>
            </label>

            <input type="number"
                  class="form-control custom-input fw-bold text-orange"
                  :class="{ 'is-invalid': errors.giaCuoiTuan }"
                  v-model.number="form.giaCuoiTuan">

            <div class="invalid-feedback">
              {{ errors.giaCuoiTuan }}
            </div>
          </div>
          <div class="col-12 mt-4">
            <div class="p-3 border rounded bg-light">

              <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="form-label small fw-bold mb-0">
                  Khoảng giá đặc biệt
                </label>

                <button type="button"
                        class="btn btn-sm btn-outline-danger"
                        @click="openPriceModal">
                  + Thêm khoảng giá
                </button>
              </div>

              <!-- Danh sách đã thêm -->
              <div v-if="form.priceRanges.length === 0"
                  class="text-muted small">
                Chưa có khoảng giá nào
              </div>

              <div v-for="(p, i) in form.priceRanges"
                  :key="i"
                  class="border rounded p-2 mb-2 bg-white">

                <div class="fw-bold">
                  Loại giá: {{ p.loaiGia }}
                </div>

                <div class="small text-muted">
                  Bắt đầu: {{ p.ngayBatDau }} → {{ p.ngayKetThuc }}
                </div>
                <div class="small text-muted">
                  Mô tả: {{ p.moTa }}
                </div>
                <div class="small text-muted">
                  Giá: {{ p.gia }}
                </div>
                <span 
                  class="badge"
                  :class="p.maThietLapGia === form.giaDangApDungId 
                            ? 'bg-success' 
                            : 'bg-secondary'"
                >
                  {{ p.maThietLapGia === form.giaDangApDungId 
                      ? 'Đang dùng' 
                      : 'Không dùng' }}
                </span><br>
                <button class="btn btn-sm btn-warning mt-1 me-2"
                        @click="editPriceRange(i)">
                  Sửa
                </button>
                <button class="btn btn-sm btn-danger mt-1"
                        @click="removePriceRange(i)">
                  Xóa
                </button>
              </div>

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
                :src="img.url"
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
              <label class="form-label small fw-bold text-muted">Loại phòng</label>
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
<div class="modal fade" id="priceRangeModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content shadow-lg border-0 rounded-4">

      <div class="modal-header">
        <h5 class="modal-title">Thêm khoảng giá</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">

        <div class="mb-3">
          <label>Loại giá</label>
          <input 
            type="text" 
            class="form-control" 
            v-model="tempPrice.loaiGia"
            readonly
          >
        </div>

        <div class="mb-3">
          <label>Mô tả</label>
          <input type="text"
                class="form-control"
                :class="{ 'is-invalid': priceErrors.moTa }"
                v-model="tempPrice.moTa">
          <div class="invalid-feedback">
            {{ priceErrors.moTa }}
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <label>Từ ngày</label>
            <input type="date"
                  class="form-control"
                  :class="{ 'is-invalid': priceErrors.ngayBatDau }"
                  v-model="tempPrice.ngayBatDau">
            <div class="invalid-feedback">
              {{ priceErrors.ngayBatDau }}
            </div>
          </div>

          <div class="col-md-6">
            <label>Đến ngày</label>
            <input type="date"
                  class="form-control"
                  :class="{ 'is-invalid': priceErrors.ngayKetThuc }"
                  v-model="tempPrice.ngayKetThuc">
            <div class="invalid-feedback">
              {{ priceErrors.ngayKetThuc }}
            </div>
          </div>
        </div>
        <div class="mt-3">
          <label>Giá</label>
          <input type="text"
                class="form-control"
                :class="{ 'is-invalid': priceErrors.gia }"
                v-model="tempPrice.gia">
          <div class="invalid-feedback">
            {{ priceErrors.gia }}
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
        <button class="btn btn-primary" @click="addPriceRange">
          {{ isEditingPrice ? 'Cập nhật' : 'Tiếp tục' }}
        </button>
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
          Bạn có chắc chắn muốn xóa loại phòng này? Hành động này không thể hoàn tác và sẽ xóa tất cả các phòng thuộc loại phòng này.
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
/* ============================= */
/* FIX TRÀN NGANG TOÀN TRANG */
/* ============================= */
html, body {
  overflow-x: hidden;
}

/* ============================= */
/* TAB LOẠI PHÒNG CUỘN NGANG */
/* ============================= */
.d-flex.gap-2.mb-4 {
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 10px;
  -webkit-overflow-scrolling: touch;
}

.btn-tab {
  flex: 0 0 auto;
}

/* ============================= */
/* FIX CARD KHÔNG BỂ MOBILE */
/* ============================= */
.room-variant-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  height: auto; /* 🔥 bỏ height:100% gây bể */
}

/* ============================= */
/* FIX IMAGE */
/* ============================= */
.room-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #f5f5f5;
}

/* ============================= */
/* FIX ROOM LIST SCROLL */
/* ============================= */
.room-list-scroll {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 6px;
}

/* ============================= */
/* MOBILE RESPONSIVE */
/* ============================= */
@media (max-width: 768px) {

  /* Card spacing đẹp hơn */
  .card-body-content {
    padding: 15px;
  }

  /* Ảnh nhỏ lại */
  .room-preview-icon {
    height: 140px;
  }

  /* Giá nhỏ lại */
  .room-price {
    font-size: 16px;
  }

  /* Stat card gọn lại */
  .stat-card {
    padding: 12px;
    gap: 10px;
  }

  .stat-value {
    font-size: 16px;
  }

  /* Modal không tràn */
  .modal-dialog {
    margin: 0.5rem;
    max-width: calc(100% - 1rem) !important;
  }

  /* 🔥 FIX HOVER KHÔNG HIỆN NÚT TRÊN MOBILE */
  .room-actions-hidden {
    opacity: 1 !important;
    transform: none !important;
  }

  /* Nút bấm to hơn cho tay */
  .btn-room-edit,
  .btn-room-delete {
    width: 32px;
    height: 32px;
  }

}

/* ============================= */
/* HOVER DESKTOP */
/* ============================= */
.room-item-row {
  position: relative;
  transition: all 0.2s;
}

.room-item-row:hover {
  background: #f1f5f9 !important;
}

.room-actions-hidden {
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.2s ease;
  display: flex;
  gap: 4px;
}

.room-item-row:hover .room-actions-hidden {
  opacity: 1;
  transform: translateX(0);
}

/* ============================= */
/* BUTTON STYLE GIỮ NGUYÊN */
/* ============================= */
.btn-room-edit {
  background: #e0f2fe;
  color: #0369a1;
  border: none;
  border-radius: 4px;
}

.btn-room-delete {
  background: #fee2e2;
  color: #b91c1c;
  border: none;
  border-radius: 4px;
}
/* 1. Cho phép thanh Tab loại phòng cuộn ngang trên mobile thay vì xuống dòng */
.d-flex.gap-2.mb-4 {
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 10px;
  -webkit-overflow-scrolling: touch; /* Cuộn mượt trên mobile */
}

.btn-tab {
  flex: 0 0 auto; /* Ngăn các tab bị co lại */
}

/* 2. Điều chỉnh kích thước Modal để không bị tràn màn hình nhỏ */
@media (max-width: 576px) {
  .modal-dialog {
    margin: 0.5rem;
    max-width: calc(100% - 1rem) !important;
  }
  
  .stat-card {
    padding: 12px;
    gap: 10px;
  }
  
  .stat-value {
    font-size: 16px;
  }
  
  .room-price {
    font-size: 16px;
  }
}

/* 3. Tối ưu lại Room Card trên màn hình nhỏ */
.room-variant-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.room-preview-icon {
  height: 160px; /* Tăng chiều cao ảnh một chút để dễ nhìn trên mobile */
}

/* 4. Đảm bảo ảnh không bị méo */
.room-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Chuyển từ contain sang cover để ảnh đầy khung hình đẹp hơn */
}

/* 5. Cải thiện trải nghiệm bấm nút trên mobile (Touch Target) */
.btn-room-edit, .btn-room-delete, .btn-room-view {
  width: 32px;  /* Tăng nhẹ kích thước để dễ bấm bằng tay */
  height: 32px;
}

/* 6. Fix lỗi Modal bị khuất khi bàn phím ảo hiện lên trên Android */
.modal-content {
  max-height: 90vh;
  overflow-y: auto;
}
#priceRangeModal {
  z-index: 5000;
}
#variantModal{
  z-index:2000;
}
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