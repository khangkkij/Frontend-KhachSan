<template>
  <div class="page-container">
    <div class="card card-custom mb-4">
      <div class="card-body d-flex flex-wrap gap-3 justify-content-between align-items-center">
        <div>
          <h5 class="card-title fw-bold text-primary mb-1">
            <i class="bx bx-log-in-circle me-2"></i>Check-in (Nhận phòng)
          </h5>
          <small class="text-muted">Ghi nhận khách vào ở và đảm bảo phòng đã được gán</small>
        </div>
        <div class="d-flex align-items-center gap-3">
          <div class="input-group input-group-custom">
            <span class="input-group-text"><i class="bx bx-search"></i></span>
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Nhập SĐT, mã đặt phòng, tên khách..."
              :disabled="isWalkIn"
            />
          </div>
          <div class="form-check form-switch">
            <input
              id="walkInSwitch"
              class="form-check-input"
              type="checkbox"
              v-model="isWalkIn"
            />
            <label class="form-check-label" for="walkInSwitch">Walk-in</label>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-7">
        <div class="card card-custom mb-4">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold mb-0">1. Tìm kiếm Booking</h6>
              <span class="badge bg-label-info" v-if="!isWalkIn">
                {{ filteredBookings.length }} kết quả
              </span>
            </div>

            <div v-if="isWalkIn" class="empty-state">
              <i class="bx bx-user-plus"></i>
              <div>
                <div class="fw-semibold">Khách vãng lai (Walk-in)</div>
                <small class="text-muted">Nhập thông tin khách mới ở bước dưới</small>
              </div>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Mã đặt phòng</th>
                    <th>Khách hàng</th>
                    <th>Ngày ở</th>
                    <th>Trạng thái</th>
                    <th class="text-end">Chọn</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="booking in filteredBookings" :key="booking.maDatPhong">
                    <td class="fw-bold text-primary">#{{ booking.maDatPhong }}</td>
                    <td>
                      <div class="fw-semibold">{{ booking.tenKhach || 'Chưa có tên' }}</div>
                      <small class="text-muted">{{ booking.sdt || 'Chưa có SĐT' }}</small>
                    </td>
                    <td>
                      <div>{{ formatDate(booking.ngayNhan) }} - {{ formatDate(booking.ngayTra) }}</div>
                      <small class="text-muted">Cần gán: {{ booking.soPhongCanGan }}</small>
                    </td>
                    <td>
                      <span class="badge bg-label-warning">Chờ nhận phòng</span>
                    </td>
                    <td class="text-end">
                      <button class="btn btn-sm btn-primary" @click="selectBooking(booking)">
                        Chọn
                      </button>
                    </td>
                  </tr>
                  <tr v-if="filteredBookings.length === 0">
                    <td colspan="5" class="text-center text-muted py-4">
                      Không tìm thấy booking phù hợp
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card card-custom">
          <div class="card-body">
          <h6 class="fw-bold mb-3">2. Tạo mới / Cập nhật thông tin khách</h6>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Họ tên</label>
                <input v-model="guestForm.name" type="text" class="form-control" placeholder="Nguyễn Văn A" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Số điện thoại</label>
                <input v-model="guestForm.phone" type="text" class="form-control" placeholder="09xx xxx xxx" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input v-model="guestForm.email" type="email" class="form-control" placeholder="email@example.com" />
              </div>
              <div class="col-md-6">
                <label class="form-label">CCCD/Passport</label>
                <input v-model="guestForm.idNumber" type="text" class="form-control" placeholder="0123456789" />
              </div>
            <div class="col-md-6">
              <label class="form-label">Giới tính</label>
              <select v-model="guestForm.gender" class="form-select">
                <option value="">Chọn</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div class="col-md-6" v-if="isWalkIn">
              <label class="form-label">Ngày nhận</label>
              <input v-model="walkInDates.ngayNhan" type="date" class="form-control" />
            </div>
            <div class="col-md-6" v-if="isWalkIn">
              <label class="form-label">Ngày trả</label>
              <input v-model="walkInDates.ngayTra" type="date" class="form-control" />
            </div>
              <div class="col-12">
                <label class="form-label">Ghi chú</label>
                <textarea v-model="guestForm.note" rows="2" class="form-control" placeholder="Yêu cầu đặc biệt..."></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="card card-custom mb-4">
          <div class="card-body">
            <h6 class="fw-bold mb-3">3. Quét giấy tờ (Scan ID)</h6>
            <input type="file" class="form-control" accept="image/*" @change="handleFileChange" />
            <div v-if="idImageUrl" class="preview mt-3">
              <img :src="idImageUrl" alt="ID Preview" />
            </div>
            <small class="text-muted d-block mt-2">Nâng cao: chụp ảnh và lưu vào hồ sơ.</small>
          </div>
        </div>

        <div class="card card-custom mb-4">
          <div class="card-body">
          <h6 class="fw-bold mb-3">4. Gán phòng</h6>
          <template v-if="!isWalkIn">
            <div v-if="assignmentSlots.length" class="d-flex flex-column gap-3">
              <div
                v-for="slot in assignmentSlots"
                :key="slot.key"
                class="info-box"
              >
                <label class="form-label fw-semibold mb-2">
                  {{ slot.label }}
                </label>
                <select class="form-select" v-model="assignedRoomsBySlot[slot.key]">
                  <option :value="null">Chọn phòng phù hợp</option>
                  <option
                    v-for="room in getRoomOptionsForSlot(slot.key)"
                    :key="getRoomId(room)"
                    :value="getRoomId(room)"
                  >
                    Phòng {{ room.soPhong || room.number }} - {{ room.tenBienThe || room.type || room.maBienThePhong }}
                  </option>
                </select>
              </div>
            </div>
            <div v-else class="text-muted">Booking này không còn chi tiết chờ gán phòng.</div>
          </template>
          <template v-else>
            <select class="form-select" v-model="selectedRoomId">
              <option :value="null">Chọn phòng phù hợp</option>
            <option
              v-for="room in availableRooms"
              :key="room.maPhong || room.id"
              :value="room.maPhong || room.id"
            >
              Phòng {{ room.soPhong || room.number }} - {{ room.tenBienThe || room.type || room.maBienThePhong }}
            </option>
            </select>
            <div v-if="selectedRoom" class="mt-3 info-box">
            <div class="fw-semibold">Phòng {{ selectedRoom.soPhong || selectedRoom.number }}</div>
            <small class="text-muted">
              Loại: {{ selectedRoom.tenBienThe || selectedRoom.type || selectedRoom.maBienThePhong }}
            </small>
            </div>
          </template>
          </div>
        </div>

        <div class="card card-custom mb-4">
          <div class="card-body">
            <h6 class="fw-bold mb-3">5. Thu tiền cọc (Deposit)</h6>
            <div class="input-group mb-3">
              <span class="input-group-text">VND</span>
              <input v-model="depositAmount" type="text" inputmode="numeric" class="form-control" placeholder="Nhập số tiền cọc" />
            </div>
            <div class="d-flex gap-3">
              <div class="form-check">
                <input class="form-check-input" type="radio" id="depositCash" value="cash" v-model="depositMethod" />
                <label class="form-check-label" for="depositCash">Tiền mặt</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" id="depositCard" value="card" v-model="depositMethod" />
                <label class="form-check-label" for="depositCard">Giữ thẻ tín dụng</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" id="depositVnpay" value="vnpay" v-model="depositMethod" />
                <label class="form-check-label" for="depositVnpay">VNPay (QR)</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" id="depositMomo" value="momo" v-model="depositMethod" />
                <label class="form-check-label" for="depositMomo">MoMo</label>
              </div>
            </div>
          </div>
        </div>

        <div class="card card-custom">
          <div class="card-body">
            <h6 class="fw-bold mb-3">6. Xác nhận Check-in</h6>
            <div class="summary">
              <div class="d-flex justify-content-between">
                <span>Khách:</span>
                <span class="fw-semibold">{{ guestForm.name || 'Chưa nhập' }}</span>
              </div>
              <div class="d-flex justify-content-between">
  <span>Phòng:</span>
  <span class="fw-semibold">
    <template v-if="isWalkIn">
      {{ selectedRoom ? (selectedRoom.soPhong || selectedRoom.number) : 'Chưa chọn' }}
      {{ selectedRoom ? ' - ' + (selectedRoom.tenBienThe || selectedRoom.type) : '' }}
    </template>
    <template v-else>
      {{ selectedRoomsSummary.length ? selectedRoomsSummary.join(', ') : 'Chưa chọn' }}
    </template>
  </span>
</div>
              <div class="d-flex justify-content-between">
                <span>Tiền cọc:</span>
                <span class="fw-semibold">{{ formatCurrency(normalizedDepositAmount) }}</span>
              </div>
            </div>
            <button class="btn btn-primary w-100 mt-3" @click="confirmCheckIn">
              {{ isSubmitting ? 'Đang xử lý...' : 'Hoàn tất & giao chìa khóa' }}
            </button>
            <div v-if="actionMessage" class="alert alert-success mt-3 mb-0">
              {{ actionMessage }}
            </div>
            <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0">
              {{ errorMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import axios from 'axios';

const searchQuery = ref('');
const isWalkIn = ref(false);
const selectedBooking = ref(null);
const selectedRoomId = ref(null);
const selectedDetailId = ref(null);
const depositAmount = ref(0);
const assignedRoomsBySlot = reactive({});

const depositMethod = ref('cash');
const idImageUrl = ref('');
const actionMessage = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);

const guestForm = reactive({
  name: '',
  phone: '',
  email: '',
  idNumber: '',
  gender: '',
  note: ''
});

const walkInDates = reactive({
  ngayNhan: '',
  ngayTra: ''
});

const bookings = ref([]);
const walkInRooms = ref([]);

const API_BASE = import.meta.env.VITE_API_URL;
const API_BOOKINGS = `${API_BASE}/api/admin/CheckInOut/bookings-ready`;
const API_CHECKIN = `${API_BASE}/api/admin/CheckInOut/check-in`;
const API_WALKIN = `${API_BASE}/api/admin/CheckInOut/walk-in`;
const API_ROOMS_AVAILABLE = `${API_BASE}/api/admin/CheckInOut/rooms-available`;
const API_CHECKIN_PAYMENT = `${API_BASE}/api/admin/CheckInOut/checkin-payment`;

const fetchBookings = async () => {
  try {
    const res = await axios.get(API_BOOKINGS);
    bookings.value = res.data || [];
  } catch (error) {
    console.error(error);
  }
};

const fetchAvailableRooms = async () => {
  try {
    const res = await axios.get(API_ROOMS_AVAILABLE);
    walkInRooms.value = res.data || [];
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await fetchBookings();
});

const filteredBookings = computed(() => {
  if (!searchQuery.value) return bookings.value;
  const q = searchQuery.value.toLowerCase();
  return bookings.value.filter(
    (b) =>
      String(b.maDatPhong).includes(q) ||
      (b.tenKhach && b.tenKhach.toLowerCase().includes(q)) ||
      (b.sdt && b.sdt.toLowerCase().includes(q))
  );
});

const pendingDetails = computed(() =>
  selectedBooking.value?.chiTietDatPhongs?.filter((ct) => !ct.maPhong) || []
);
const assignmentSlots = computed(() => {
  if (isWalkIn.value || !selectedBooking.value) return [];

  if (pendingDetails.value.length > 0) {
    return pendingDetails.value.map((detail, index) => ({
      key: String(detail.maCtdp ?? `detail-${index}`),
      maCtdp: detail.maCtdp ?? null,
      label: `Chi tiết ${detail.maCtdp ?? index + 1} · ${formatDate(detail.ngayNhan)} - ${formatDate(detail.ngayTra)}`
    }));
  }

  const needed = Number(selectedBooking.value?.soPhongCanGan || 0);
  return Array.from({ length: needed }, (_, index) => ({
    key: `slot-${index + 1}`,
    maCtdp: null,
    label: `Phòng cần gán #${index + 1}`
  }));
});

const availableRooms = computed(() => {
  if (isWalkIn.value) {
    return walkInRooms.value;
  }
  return selectedBooking.value?.phongTrong || [];
});

const selectedRoom = computed(() =>
  availableRooms.value.find((r) =>
    String(r.id) === String(selectedRoomId.value) || String(r.maPhong) === String(selectedRoomId.value)
  )
);
const getRoomId = (room) => room?.maPhong ?? room?.id ?? null;
const getRoomById = (roomId) =>
  availableRooms.value.find((r) => String(getRoomId(r)) === String(roomId));
const getRoomOptionsForSlot = (slotKey) => {
  const current = assignedRoomsBySlot[slotKey];
  const used = new Set(
    Object.entries(assignedRoomsBySlot)
      .filter(([key, value]) => key !== String(slotKey) && value != null)
      .map(([, value]) => String(value))
  );
  return availableRooms.value.filter((room) => {
    const id = String(getRoomId(room));
    return id === String(current) || !used.has(id);
  });
};
const selectedRoomsSummary = computed(() =>
  assignmentSlots.value
    .map((slot) => {
      const room = getRoomById(assignedRoomsBySlot[slot.key]);
      if (!room) return null;
      const roomNo = room.soPhong || room.number;
      const roomType = room.tenBienThe || room.type || room.maBienThePhong;
      return roomType ? `${roomNo} - ${roomType}` : `${roomNo}`;
    })
    .filter(Boolean)
);

const getBookingDepositAmount = (booking) => {
  if (!booking) return 0;

  const directCandidates = [
    booking.daThanhToan,
    booking.DaThanhToan,
    booking.tienCoc,
    booking.TienCoc,
    booking.soTienCoc,
    booking.SoTienCoc,
    booking.depositAmount,
    booking.DepositAmount
  ];

  for (const value of directCandidates) {
    const parsed = normalizeAmount(value);
    if (parsed > 0) return parsed;
  }

  if (Array.isArray(booking.thanhToans) && booking.thanhToans.length) {
    const paid = booking.thanhToans.reduce((sum, item) => {
      const status = String(item?.trangThai ?? item?.TrangThai ?? '').toLowerCase();
      const amount = normalizeAmount(item?.soTien ?? item?.SoTien);
      if (status === 'dathanhtoan' || status === 'dathanhcong') {
        return sum + amount;
      }
      return sum;
    }, 0);
    if (paid > 0) return paid;
  }

  const estimatedTotal = normalizeAmount(booking.tongTienDuKien ?? booking.TongTienDuKien);
  if (estimatedTotal > 0) {
    return Math.round(estimatedTotal * 0.3);
  }

  return 0;
};

const selectBooking = (booking) => {
  selectedBooking.value = booking;
  Object.keys(assignedRoomsBySlot).forEach((key) => delete assignedRoomsBySlot[key]);
  guestForm.name = booking.tenKhach || '';
  guestForm.phone = booking.sdt || '';
  guestForm.email = '';
  guestForm.idNumber = '';
  guestForm.gender = '';
  guestForm.note = '';
  actionMessage.value = '';
  errorMessage.value = '';
  depositAmount.value = getBookingDepositAmount(booking);
  selectedRoomId.value = null;
  selectedDetailId.value = booking.chiTietDatPhongs?.find((ct) => !ct.maPhong)?.maCtdp || null;
};

const handleFileChange = (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    idImageUrl.value = '';
    return;
  }
  idImageUrl.value = URL.createObjectURL(file);
};

const confirmCheckIn = async () => {
  actionMessage.value = '';
  errorMessage.value = '';
  if (isWalkIn.value) {
    if (!selectedRoomId.value) {
      errorMessage.value = 'Vui lòng chọn phòng.';
      return;
    }
    if (!guestForm.name || !guestForm.phone) {
      errorMessage.value = 'Vui lòng nhập họ tên và số điện thoại.';
      return;
    }
    if (!walkInDates.ngayNhan || !walkInDates.ngayTra) {
      errorMessage.value = 'Vui lòng chọn ngày nhận và ngày trả.';
      return;
    }
    isSubmitting.value = true;
    try {
      const payload = {
        hoVaTen: guestForm.name,
        email: guestForm.email || null,
        cccd: guestForm.idNumber || null,
        sdt: guestForm.phone || null,
        gioiTinh: guestForm.gender || null,
        maPhong: selectedRoomId.value,
        ngayNhan: walkInDates.ngayNhan,
        ngayTra: walkInDates.ngayTra,
        depositAmount: normalizedDepositAmount.value,
        depositMethod: depositMethod.value,
        ghiChu: guestForm.note || null
      };
      const res = await axios.post(API_WALKIN, payload);
      actionMessage.value = res.data?.message || 'Check-in walk-in thành công.';
      if (normalizedDepositAmount.value > 0 && (depositMethod.value === 'vnpay' || depositMethod.value === 'momo')) {
        const payRes = await axios.post(API_CHECKIN_PAYMENT, {
          maDatPhong: res.data?.maDatPhong,
          soTien: normalizedDepositAmount.value,
          hinhThucThanhToan: depositMethod.value
        });
        const redirectUrl = payRes.data?.redirectUrl;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      }
      await fetchBookings();
      await fetchAvailableRooms();
    } catch (error) {
      errorMessage.value = error.response?.data || error.message;
    } finally {
      isSubmitting.value = false;
    }
    return;
  }

  if (!selectedBooking.value) {
    errorMessage.value = 'Vui lòng chọn booking.';
    return;
  }
  const missingSlots = assignmentSlots.value.filter((slot) => !assignedRoomsBySlot[slot.key]);
  if (missingSlots.length > 0) {
    errorMessage.value = `Vui lòng chọn đủ phòng cho ${missingSlots.length} mục gán phòng.`;
    return;
  }
  const chosenRoomIds = assignmentSlots.value.map((slot) => String(assignedRoomsBySlot[slot.key]));
  if (new Set(chosenRoomIds).size !== chosenRoomIds.length) {
    errorMessage.value = 'Mỗi chi tiết đặt phòng cần gán một phòng khác nhau.';
    return;
  }
  isSubmitting.value = true;
  try {
    for (let i = 0; i < assignmentSlots.value.length; i += 1) {
      const slot = assignmentSlots.value[i];
      const payload = {
        maDatPhong: selectedBooking.value.maDatPhong,
        maPhong: assignedRoomsBySlot[slot.key],
        maCtdp: slot.maCtdp,
        depositAmount: i === 0 ? normalizedDepositAmount.value : 0,
        depositMethod: depositMethod.value
      };
      await axios.post(API_CHECKIN, payload);
    }
    actionMessage.value = `Check-in thành công ${assignmentSlots.value.length} phòng.`;
    if (normalizedDepositAmount.value > 0 && (depositMethod.value === 'vnpay' || depositMethod.value === 'momo')) {
      const payRes = await axios.post(API_CHECKIN_PAYMENT, {
        maDatPhong: selectedBooking.value.maDatPhong,
        soTien: normalizedDepositAmount.value,
        hinhThucThanhToan: depositMethod.value
      });
      const redirectUrl = payRes.data?.redirectUrl;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }
    await fetchBookings();
  } catch (error) {
    errorMessage.value = error.response?.data || error.message;
  } finally {
    isSubmitting.value = false;
  }
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
const formatDate = (value) => (value ? new Date(value).toLocaleDateString('vi-VN') : '');
const normalizeAmount = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  const cleaned = String(value ?? '').replace(/[^\d-]/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};
const normalizedDepositAmount = computed(() => normalizeAmount(depositAmount.value));

watch(isWalkIn, (val) => {
  if (val) {
    selectedBooking.value = null;
    Object.keys(assignedRoomsBySlot).forEach((key) => delete assignedRoomsBySlot[key]);
    searchQuery.value = '';
    selectedDetailId.value = null;
    selectedRoomId.value = null;
    depositAmount.value = 0;
    fetchAvailableRooms();
    guestForm.name = '';
    guestForm.phone = '';
    guestForm.email = '';
    guestForm.idNumber = '';
    guestForm.gender = '';
    guestForm.note = '';
    walkInDates.ngayNhan = '';
    walkInDates.ngayTra = '';
  }
  actionMessage.value = '';
  errorMessage.value = '';
});
</script>

<style scoped>
.page-container {
  color: #566a7f;
  font-family: 'Public Sans', sans-serif;
}

.card-custom {
  border: none;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 2px 6px 0 rgba(67, 89, 113, 0.12);
}

.input-group-custom {
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #d9dee3;
}

.input-group-custom .input-group-text {
  background: #fff;
  border: none;
  color: #b4bdc6;
}

.input-group-custom .form-control {
  border: none;
  box-shadow: none;
}

.preview {
  border: 1px dashed #d9dee3;
  border-radius: 0.75rem;
  padding: 12px;
  text-align: center;
  background: #f9fafb;
}

.preview img {
  max-width: 100%;
  max-height: 220px;
  object-fit: contain;
}

.info-box {
  background: #f5f5f9;
  border-radius: 0.75rem;
  padding: 12px;
}

.summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-state {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px dashed #d9dee3;
  border-radius: 0.75rem;
  background: #f5f5f9;
}

.empty-state i {
  font-size: 24px;
  color: #696cff;
}
</style>
