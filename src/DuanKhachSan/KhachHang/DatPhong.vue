<template>
    <div class="booking-page">
        <div class="booking-header">
            <div class="container d-flex justify-content-between align-items-center py-2">
                <div class="d-flex align-items-center">
                    <h4 class="text-orange fw-bold m-0">Luxury Booking</h4>
                </div>

                <div class="step-container d-none d-md-flex">
                    <div class="step-item active"><span class="step-num">1</span> Thông tin khách hàng</div>
                    <div class="step-item"><span class="step-num">2</span> Chi tiết thanh toán</div>
                    <div class="step-item"><span class="step-num">3</span> Xác nhận!</div>
                </div>
            </div>
        </div>

        <div class="countdown-banner">
            <i class="fa fa-clock text-danger me-2"></i>
            Chúng tôi đang giữ giá cho quý khách...
            <span class="text-danger fw-bold">{{ timerDisplay }}</span>
        </div>

        <div class="container mt-4 mb-5">
            <div class="row">
                <div class="col-lg-8">
                    <div class="card mb-3 shadow-sm">
                        <div class="card-body">
                            <h5 class="fw-bold mb-4">Ai là khách chính?</h5>
                            <div class="row g-3">
                                <div class="col-md-12 mb-3">
                                    <div class="p-3 bg-light border rounded d-flex align-items-center">
                                        <i class="fa fa-user-circle fa-2x me-3 text-orange"></i>
                                        <div>
                                            Xin chào <strong>{{ formData.name || 'Quý khách' }}</strong>!
                                            (Không phải bạn?
                                            <a href="#" class="text-orange" @click.prevent="handleSwitchUser">Thoát</a>)
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label fw-bold">Họ tên khách</label>
                                    <input type="text" class="form-control" v-model="formData.name">
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label fw-bold">Email</label>
                                    <input type="email" class="form-control" v-model="formData.email">
                                    <small class="text-muted">Chúng tôi sẽ gửi xác nhận đặt phòng qua email này.</small>
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label fw-bold">Số điện thoại</label>
                                    <input type="tel" class="form-control" v-model="formData.phone"
                                        placeholder="Nhập số điện thoại...">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Ngày nhận phòng</label>
                                    <input type="date" class="form-control" v-model="bookingRoom.checkIn" :min="minCheckinDate" :max="maxCheckinDate" @focus="ensureCheckinToday">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Ngày trả phòng</label>
                                    <input type="date" class="form-control" v-model="bookingRoom.checkOut" :min="minCheckoutDate" :max="maxCheckoutDate">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card mb-3 shadow-sm">
                        <div class="card-body">
                            <h5 class="fw-bold mb-3">Yêu cầu đặc biệt</h5>
                            <p class="text-muted small">Phụ thuộc vào tình trạng thực tế của khách sạn.</p>
                            <div class="row">
                                <div class="col-md-6 border-end">
                                    <p class="fw-bold small">Quy định hút thuốc:</p>
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="radio" name="smoke" id="r1" checked>
                                        <label class="form-check-label" for="r1"><i class="fa fa-ban me-2"></i>Phòng
                                            không hút thuốc</label>
                                    </div>
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="radio" name="smoke" id="r2">
                                        <label class="form-check-label" for="r2"><i class="fa fa-smoking me-2"></i>Phòng
                                            hút thuốc</label>
                                    </div>
                                </div>
                                <div class="col-md-6 ps-md-4">
                                    <p class="fw-bold small">Chọn loại giường:</p>
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="radio" name="bed" id="b1" checked>
                                        <label class="form-check-label" for="b1"><i class="fa fa-bed me-2"></i>Giường
                                            lớn (1 King)</label>
                                    </div>
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="radio" name="bed" id="b2">
                                        <label class="form-check-label" for="b2"><i class="fa fa-bed me-2"></i>2 Giường
                                            đơn</label>
                                    </div>
                                </div>
                            </div>

                            <hr class="my-4">

                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Số người lớn</label>
                                    <select class="form-select" v-model.number="guest.adults">
                                        <option :value="1">1 người lớn</option>
                                        <option :value="2">2 người lớn</option>
                                    </select>
                                    <small class="text-muted">Tối đa 2 người lớn.</small>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Số trẻ em</label>
                                    <select class="form-select" v-model.number="guest.children">
                                        <option :value="0">0 trẻ em</option>
                                        <option :value="1">1 trẻ em</option>
                                        <option :value="2">2 trẻ em</option>
                                    </select>
                                    <small class="text-muted">Tối đa 2 trẻ em (≤ 10 tuổi).</small>
                                </div>

                                <div class="col-12" v-if="guest.children > 0">
                                    <div class="fw-bold mb-2">Tuổi trẻ em</div>
                                    <div class="row g-2">
                                        <div class="col-6 col-md-4" v-for="(age, idx) in guest.childAges" :key="idx">
                                            <label class="form-label small">Trẻ em {{ idx + 1 }}</label>
                                            <select class="form-select" v-model.number="guest.childAges[idx]">
                                                <option v-for="n in 11" :key="n - 1" :value="n - 1">
                                                    {{ n - 1 }} tuổi
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card mb-4 shadow-sm">
                        <div class="card-header-custom">Quyền lợi phòng miễn phí</div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-6 mb-3"><i class="fa fa-coffee me-2 text-orange"></i>Bữa sáng</div>
                                <div class="col-6 mb-3"><span class="benefit-tag">BAO GỒM</span></div>
                                <div class="col-6 mb-3"><i class="fa fa-wifi me-2 text-orange"></i>WiFi miễn phí</div>
                                <div class="col-6 mb-3"><span class="benefit-tag">BAO GỒM</span></div>
                                <div class="col-6 mb-3"><i class="fa fa-parking me-2 text-orange"></i>Bãi đậu xe</div>
                                <div class="col-6 mb-3"><span class="benefit-tag">BAO GỒM</span></div>
                            </div>
                        </div>
                    </div>

                    <button type="button" @click="handleBooking" class="btn btn-lg w-100 py-3 fw-bold shadow btn-next">
                        KẾ TIẾP: BƯỚC CUỐI CÙNG <br>
                        <small class="fw-normal" style="font-size: 14px;">Có liền xác nhận đặt phòng!</small>
                    </button>
                </div>

                <div class="col-lg-4">
                    <div class="card mb-3 shadow-sm">
                        <div class="row g-0">
                            <div class="col-4">
                                <img
                                    v-if="bookingRoom.image"
                                    :src="bookingRoom.image"
                                    class="img-fluid rounded-start h-100 object-fit-cover"
                                    alt="Hotel"
                                >
                                <div v-else class="room-image-placeholder">
                                    Chưa có ảnh
                                </div>
                            </div>
                            <div class="col-8">
                                <div class="card-body p-2">
                                    <h6 class="fw-bold mb-1">{{ bookingRoom.name || '---' }}</h6>
                                    <div class="small text-muted" v-if="bookingRoom.variantName">
                                        {{ bookingRoom.variantName }}
                                    </div>
                                    <div class="small mt-1" v-if="bookingRoom.pricePerNight">
                                        <span class="text-muted">Giá / đêm:</span>
                                        <span class="fw-bold text-orange">{{ formatCurrency(bookingRoom.pricePerNight) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card p-3 mb-3 shadow-sm">
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label fw-bold">Thêm phòng</label>
                                <input
                                    type="number"
                                    class="form-control"
                                    v-model.number="bookingRoom.quantity"
                                    placeholder="Thêm phòng"
                                    min="0"
                                    :max="bookingRoom.soPhongCon ?? 0"
                                >
                                <small class="text-muted" v-if="bookingRoom.soPhongCon">
                                    Phòng trống: {{ bookingRoom.soPhongCon }}
                                </small>
                            </div>
                            <div class="col-12">
                                <label class="form-label fw-bold">Loại phòng</label>
                                <select class="form-select" v-model="bookingRoom.roomType">
                                    <option v-if="roomTypeOptions.length === 0" disabled value="">
                                        ---
                                    </option>
                                    <option v-for="type in roomTypeOptions" :key="type" :value="type">
                                        {{ type }}
                                    </option>
                                </select>
                                <div class="room-table mt-3" v-if="roomsByType.length">
                                    <div class="fw-bold mb-2">Danh sách phòng theo loại</div>
                                    <table class="table table-sm mb-0">
                                        <thead>
                                            <tr>
                                                <th>Loại phòng</th>
                                                <th>Giá/đêm</th>
                                                <th>Còn</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="room in roomsByType" :key="room.maBienThePhong">
                                                <td>{{ room.tenBienThe }}</td>
                                                <td>{{ room.pricePerNight ? formatCurrency(room.pricePerNight) : '---' }}</td>
                                                <td>{{ room.soPhongCon ?? '---' }}</td>
                                                <td class="text-end">
                                                    <button type="button" class="btn btn-sm btn-outline-orange" @click="addRoomFromItem(room.raw)">
                                                        Thêm
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="mt-3" v-if="selectedRooms.length">
                                    <div class="fw-bold mb-2">Phòng đã chọn</div>
                                    <div class="selected-room-item border rounded p-2 mb-2 d-flex justify-content-between align-items-center"
                                        v-for="item in selectedRooms" :key="item.maBienThePhong">
                                        <div>
                                            <div class="fw-bold">{{ item.tenLoai }} · {{ item.tenBienThe }}</div>
                                            <div class="small text-muted">{{ formatCurrency(item.pricePerNight) }} / đêm</div>
                                        </div>
                                        <div class="d-flex align-items-center gap-2">
                                            <button type="button" class="btn btn-sm btn-outline-secondary" @click="decreaseRoom(item)">-</button>
                                            <span class="fw-bold">{{ item.quantity }}</span>
                                            <button type="button" class="btn btn-sm btn-outline-secondary" @click="increaseRoom(item)">+</button>
                                            <button type="button" class="btn btn-sm btn-outline-danger" @click="removeRoom(item)">Xóa</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card p-3 mb-3 shadow-sm">
                        <div class="d-flex justify-content-between align-items-center text-center">
                            <div>
                                <small class="text-muted">Nhận phòng</small>
                                <div class="fw-bold text-orange">{{ bookingRoom.checkIn || '---' }}</div>
                            </div>
                            <i class="fa fa-arrow-right text-muted"></i>
                            <div>
                                <small class="text-muted">Trả phòng</small>
                                <div class="fw-bold text-orange">{{ bookingRoom.checkOut || '---' }}</div>
                            </div>
                            <div class="border-start ps-3">
                                <div class="fw-bold">{{ bookingRoom.nights ?? '---' }}</div>
                                <small class="text-muted">đêm</small>
                            </div>
                        </div>
                    </div>

                    <div class="card shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="h5 fw-bold">Tổng cộng</span>
                                <span class="price-final">
                                    {{ totalAmount ? formatCurrency(totalAmount) : '---' }}
                                </span>
                            </div>
                            <div class="text-end small text-muted mt-1" v-if="totalAmount">
                                Dựa trên {{ bookingRoom.nights }} đêm · {{ totalRoomCount || 1 }} phòng
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'; // <--- BƯỚC 1: Thêm dòng này
import axios from 'axios';

// <--- BƯỚC 2: Khai báo router để dùng
const router = useRouter(); 
const API = import.meta.env.VITE_API_URL;

const bookingRoom = ref({
    name: '',
    roomType: '',
    variantName: '',
    image: '',
    maBienThePhong: null,
    pricePerNight: null,
    soPhongCon: null,
    quantity: 1,
    checkIn: '',
    checkOut: '',
    nights: null
});
const fallbackImage = '/assets/images/property-01.jpg';
const selectedRooms = ref([]);

const formatDateInput = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const maxCheckoutDate = computed(() => {
    const today = new Date();
    const max = new Date(today);
    max.setMonth(today.getMonth() + 8);
    return formatDateInput(max);
});

const minCheckinDate = computed(() => {
    const today = new Date();
    return formatDateInput(today);
});

const maxCheckinDate = computed(() => {
    const today = new Date();
    const max = new Date(today);
    max.setMonth(today.getMonth() + 8);
    return formatDateInput(max);
});

const minCheckoutDate = computed(() => {
    const today = new Date();
    if (!bookingRoom.value.checkIn) {
        return formatDateInput(today);
    }
    const checkInDate = new Date(bookingRoom.value.checkIn);
    if (Number.isNaN(checkInDate.getTime())) {
        return formatDateInput(today);
    }
    const min = new Date(checkInDate);
    min.setDate(checkInDate.getDate() + 1);
    return formatDateInput(min);
});

const ensureCheckinToday = () => {
    if (!bookingRoom.value.checkIn) {
        bookingRoom.value.checkIn = minCheckinDate.value;
    }
};

const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + ' ₫';
};

const roomTypes = ref([]);
const roomList = ref([]);

const bookingItems = computed(() => {
    const items = selectedRooms.value
        .filter((item) => item && item.maBienThePhong && item.pricePerNight && item.quantity)
        .map((item) => ({
            maBienThePhong: item.maBienThePhong,
            pricePerNight: Number(item.pricePerNight || 0),
            quantity: Number(item.quantity || 0),
            tenLoai: item.tenLoai,
            tenBienThe: item.tenBienThe
        }));
    if (items.length > 0) {
        return items;
    }
    const currentId = bookingRoom.value.maBienThePhong;
    const currentPrice = Number(bookingRoom.value.pricePerNight || 0);
    const currentQty = Number(bookingRoom.value.quantity || 0);
    if (currentId && currentPrice > 0 && currentQty > 0) {
        return [{
            maBienThePhong: currentId,
            pricePerNight: currentPrice,
            quantity: currentQty,
            tenLoai: bookingRoom.value.roomType || bookingRoom.value.name,
            tenBienThe: bookingRoom.value.variantName || ''
        }];
    }
    return [];
});

const totalAmount = computed(() => {
    if (!bookingRoom.value.nights) return null;
    const nights = Number(bookingRoom.value.nights || 0);
    if (!nights) return null;
    return bookingItems.value.reduce((sum, item) => {
        return sum + item.pricePerNight * item.quantity * nights;
    }, 0);
});

const totalRoomCount = computed(() => {
    return bookingItems.value.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
});

const roomTypeOptions = computed(() => {
    if (roomTypes.value.length > 0) return roomTypes.value;
    const type = bookingRoom.value.roomType || bookingRoom.value.name;
    return type ? [type] : [];
});

const roomsByType = computed(() => {
    const type = bookingRoom.value.roomType;
    if (!type || roomList.value.length === 0) return [];
    return roomList.value
        .filter((item) => (getField(item, 'tenLoai', 'TenLoai') === type))
        .map((item) => mapRoomItem(item));
});

const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return null;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
    const diffMs = end - start;
    const nights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : null;
};

const normalizeQuantity = () => {
    const max = bookingRoom.value.soPhongCon == null ? null : Number(bookingRoom.value.soPhongCon);
    const qty = Number(bookingRoom.value.quantity || 0);
    if (max === 0) {
        bookingRoom.value.quantity = 0;
        return;
    }
    if (qty < 1) {
        bookingRoom.value.quantity = 1;
    } else if (max != null && max > 0 && qty > max) {
        bookingRoom.value.quantity = max;
    }
};

const persistBookingRoom = () => {
    localStorage.setItem('booking_room', JSON.stringify(bookingRoom.value));
};

const persistSelectedRooms = () => {
    localStorage.setItem('booking_rooms', JSON.stringify(selectedRooms.value));
};

const ensureUserId = async () => {
    const stored = JSON.parse(localStorage.getItem('user_info') || '{}');
    const existingId = stored?.id ?? stored?.maKh ?? stored?.MaKh ?? null;
    if (existingId) return existingId;
    try {
        const res = await axios.get(`${API}/api/KhachHang/profile`, { withCredentials: true });
        const data = res?.data || {};
        const maKh = data.maKh ?? data.MaKh ?? null;
        if (maKh) {
            localStorage.setItem('user_info', JSON.stringify({
                ...stored,
                id: maKh,
                maKh: maKh,
                name: data.hoVaTen ?? stored?.name,
                email: data.email ?? stored?.email,
                avatar: data.hinhAnh ?? stored?.avatar
            }));
            return maKh;
        }
    } catch (error) {
        console.warn('Không lấy được mã khách hàng:', error);
    }
    return null;
};

const getField = (item, ...keys) => {
    for (const key of keys) {
        if (item?.[key] !== undefined && item?.[key] !== null) return item[key];
    }
    return null;
};

const mapRoomItem = (item) => {
    const giaGoc = getField(item, 'giaGoc', 'GiaGoc');
    const phanTramGiam = getField(item, 'phanTramGiam', 'PhanTramGiam') || 0;
    const pricePerNight = giaGoc != null
        ? (phanTramGiam > 0
            ? Number(giaGoc) * (100 - Number(phanTramGiam)) / 100
            : Number(giaGoc))
        : null;
    return {
        raw: item,
        maBienThePhong: getField(item, 'maBienThePhong', 'MaBienThePhong'),
        tenBienThe: getField(item, 'tenBienThe', 'TenBienThe') || '---',
        tenLoai: getField(item, 'tenLoai', 'TenLoai') || '',
        pricePerNight,
        soPhongCon: getField(item, 'soPhongCon', 'SoPhongCon')
    };
};

const applyRoomFromItem = (item) => {
    if (!item) return;
    const tenLoai = getField(item, 'tenLoai', 'TenLoai');
    const tenBienThe = getField(item, 'tenBienThe', 'TenBienThe');
    const giaGoc = getField(item, 'giaGoc', 'GiaGoc');
    const phanTramGiam = getField(item, 'phanTramGiam', 'PhanTramGiam') || 0;
    const soPhongCon = getField(item, 'soPhongCon', 'SoPhongCon');
    const anhDaiDien = getField(item, 'anhDaiDien', 'AnhDaiDien');
    const maBienThePhong = getField(item, 'maBienThePhong', 'MaBienThePhong');

    bookingRoom.value.name = tenLoai || bookingRoom.value.name;
    bookingRoom.value.roomType = tenLoai || bookingRoom.value.roomType;
    bookingRoom.value.variantName = tenBienThe || bookingRoom.value.variantName;
    bookingRoom.value.maBienThePhong = maBienThePhong ?? bookingRoom.value.maBienThePhong;
    if (giaGoc != null) {
        bookingRoom.value.pricePerNight = phanTramGiam > 0
            ? Number(giaGoc) * (100 - Number(phanTramGiam)) / 100
            : Number(giaGoc);
    }
    if (anhDaiDien) {
        bookingRoom.value.image = `${API}/images/${anhDaiDien}`;
    }
    if (soPhongCon != null) {
        bookingRoom.value.soPhongCon = soPhongCon;
    }
};

const addRoomFromItem = (item) => {
    const mapped = mapRoomItem(item);
    if (!mapped.maBienThePhong || !mapped.pricePerNight) return;
    const existing = selectedRooms.value.find((x) => x.maBienThePhong === mapped.maBienThePhong);
    const max = mapped.soPhongCon != null ? Number(mapped.soPhongCon) : null;
    if (existing) {
        const nextQty = Number(existing.quantity || 0) + 1;
        existing.quantity = max != null ? Math.min(nextQty, max) : nextQty;
    } else {
        selectedRooms.value.push({
            maBienThePhong: mapped.maBienThePhong,
            tenLoai: mapped.tenLoai || bookingRoom.value.roomType || bookingRoom.value.name,
            tenBienThe: mapped.tenBienThe || '',
            pricePerNight: mapped.pricePerNight,
            soPhongCon: mapped.soPhongCon,
            quantity: 1
        });
    }
    persistSelectedRooms();
};

const increaseRoom = (item) => {
    if (!item) return;
    const max = item.soPhongCon != null ? Number(item.soPhongCon) : null;
    const nextQty = Number(item.quantity || 0) + 1;
    item.quantity = max != null ? Math.min(nextQty, max) : nextQty;
    persistSelectedRooms();
};

const decreaseRoom = (item) => {
    if (!item) return;
    const nextQty = Number(item.quantity || 0) - 1;
    item.quantity = Math.max(nextQty, 1);
    persistSelectedRooms();
};

const removeRoom = (item) => {
    if (!item) return;
    selectedRooms.value = selectedRooms.value.filter((x) => x.maBienThePhong !== item.maBienThePhong);
    persistSelectedRooms();
};

// Dữ liệu form
const formData = ref({
    name: '',
    email: '',
    phone: ''
});

const guest = ref({
    adults: 1,
    children: 0,
    childAges: []
});

const normalizeGuest = () => {
    const adults = Number(guest.value.adults || 1);
    const children = Number(guest.value.children || 0);
    guest.value.adults = Math.min(2, Math.max(1, adults));
    guest.value.children = Math.min(2, Math.max(0, children));
    if (!Array.isArray(guest.value.childAges)) {
        guest.value.childAges = [];
    }
    if (guest.value.childAges.length > guest.value.children) {
        guest.value.childAges = guest.value.childAges.slice(0, guest.value.children);
    }
    while (guest.value.childAges.length < guest.value.children) {
        guest.value.childAges.push(0);
    }
    guest.value.childAges = guest.value.childAges.map((age) => {
        const parsed = Number(age || 0);
        return Math.min(10, Math.max(0, parsed));
    });
};

const persistGuest = () => {
    localStorage.setItem('booking_guest', JSON.stringify(guest.value));
};

// Xử lý Timer đếm ngược
const timerDisplay = ref("20:00");
let totalSeconds = 1200;
let interval = null;

const startTimer = () => {
    interval = setInterval(() => {
        if(totalSeconds <= 0) {
            clearInterval(interval);
            return;
        }
        totalSeconds--;
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        timerDisplay.value = `${m}:${s}`;
    }, 1000);
};

// Xử lý đặt phòng (ĐÂY LÀ ĐOẠN BẠN CẦN SỬA)
const handleBooking = async () => {
    // 1. Kiểm tra xem đã nhập tên và sđt chưa
    if(!formData.value.name || !formData.value.phone) {
        alert("Vui lòng nhập đầy đủ họ tên và số điện thoại!");
        return;
    }
    
    if (!bookingRoom.value.checkIn || !bookingRoom.value.checkOut || !bookingRoom.value.nights) {
        alert("Vui lòng chọn ngày nhận phòng và trả phòng hợp lệ!");
        return;
    }
    const items = bookingItems.value.filter((item) => item.maBienThePhong && item.pricePerNight && item.quantity);
    if (items.length === 0) {
        alert("Vui lòng chọn ít nhất 1 loại phòng!");
        return;
    }

    // 2. Lưu thông tin khách hàng để hiển thị hóa đơn
    localStorage.setItem('booking_customer', JSON.stringify({
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone
    }));
    normalizeGuest();
    persistGuest();

    // 3. Gọi API tạo đặt phòng (lưu DB + trừ phòng)
    try {
        const userId = await ensureUserId();
        if (!userId) {
            alert("Vui lòng đăng nhập lại để đặt phòng!");
            return;
        }
        const payload = {
            NgayNhan: bookingRoom.value.checkIn,
            NgayTra: bookingRoom.value.checkOut
        };
        if (userId) {
            payload.MaKh = userId;
        }
        if (items.length === 1) {
            payload.MaBienThePhong = items[0].maBienThePhong;
            payload.GiaDat = Number(items[0].pricePerNight);
            payload.SoLuong = Number(items[0].quantity || 1);
        } else {
            payload.Items = items.map((item) => ({
                MaBienThePhong: item.maBienThePhong,
                GiaDat: Number(item.pricePerNight),
                SoLuong: Number(item.quantity || 1)
            }));
            payload.MaBienThePhong = items[0].maBienThePhong;
            payload.GiaDat = Number(items[0].pricePerNight);
            payload.SoLuong = Number(items[0].quantity || 1);
        }
        const res = await axios.post(`${API}/api/DatPhong/tao`, payload, {
            withCredentials: true
        });
        if (res?.data?.maDatPhong) {
            localStorage.setItem('maDatPhong', String(res.data.maDatPhong));
        }
        if (res?.data?.soDem) {
            bookingRoom.value.nights = res.data.soDem;
            persistBookingRoom();
        }
        localStorage.setItem('booking_rooms', JSON.stringify(items));
    } catch (error) {
        const message = error?.response?.data || 'Đặt phòng thất bại!';
        alert(message);
        return;
    }

    // 4. Chuyển hướng sang trang Thanh Toán
    router.push('/payment'); 
};

onMounted(() => {
    const raw = localStorage.getItem('booking_room');
    const rawRooms = localStorage.getItem('booking_rooms');
    if (raw) {
        try {
            Object.assign(bookingRoom.value, JSON.parse(raw));
        } catch (error) {
            console.warn('Không đọc được dữ liệu đặt phòng:', error);
        }
    }
    if (rawRooms) {
        try {
            const parsed = JSON.parse(rawRooms);
            if (Array.isArray(parsed)) {
                selectedRooms.value = parsed;
            }
        } catch (error) {
            console.warn('Không đọc được danh sách phòng:', error);
        }
    }
    if (!bookingRoom.value.roomType) {
        bookingRoom.value.roomType = bookingRoom.value.name || '';
    }
    if (!bookingRoom.value.checkIn) {
        bookingRoom.value.checkIn = minCheckinDate.value;
    }
    if (!bookingRoom.value.quantity) {
        bookingRoom.value.quantity = 1;
    }
    normalizeQuantity();
    const rawGuest = localStorage.getItem('booking_guest');
    if (rawGuest) {
        try {
            Object.assign(guest.value, JSON.parse(rawGuest));
        } catch (error) {
            console.warn('Không đọc được dữ liệu khách:', error);
        }
    }
    normalizeGuest();
    if (roomTypes.value.length === 0) {
        axios.get(`${API}/api/DanhSachPhong`)
            .then((res) => {
                const list = Array.isArray(res.data) ? res.data : [];
                roomList.value = list;
                const types = list
                    .map((item) => item.tenLoai || item.TenLoai)
                    .filter(Boolean);
                roomTypes.value = [...new Set(types)];
                if (!bookingRoom.value.roomType && roomTypes.value.length > 0) {
                    bookingRoom.value.roomType = roomTypes.value[0];
                }
            })
            .catch((error) => {
                console.warn('Không tải được danh sách loại phòng:', error);
            });
    }
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    if (userInfo?.name) {
        formData.value.name = userInfo.name;
    }
    if (userInfo?.email) {
        formData.value.email = userInfo.email;
    }
    if (!userInfo?.id && !userInfo?.maKh) {
        ensureUserId();
    }
    startTimer();

    const maBienThe = bookingRoom.value.maBienThePhong;
    if (maBienThe && roomList.value.length === 0) {
        axios.get(`${API}/api/ChiTietPhong/${maBienThe}`)
            .then((res) => {
                const detail = res?.data?.chiTiet || res?.data?.ChiTiet;
                if (!detail) return;
                const tenLoai = detail.tenLoai || detail.TenLoai;
                const tenBienThe = detail.tenBienThe || detail.TenBienThe;
                const giaGoc = detail.giaGoc || detail.GiaGoc;
                const phanTramGiam = detail.phanTramGiam || detail.PhanTramGiam || 0;
                const anhDaiDien = detail.anhDaiDien || detail.AnhDaiDien;
                const danhSachAnh = detail.danhSachAnh || detail.DanhSachAnh || [];
                const soPhongCon = detail.soPhongCon || detail.SoPhongCon;

                if (!bookingRoom.value.name && tenLoai) {
                    bookingRoom.value.name = tenLoai;
                }
                if (!bookingRoom.value.roomType && tenLoai) {
                    bookingRoom.value.roomType = tenLoai;
                }
                if (!bookingRoom.value.variantName && tenBienThe) {
                    bookingRoom.value.variantName = tenBienThe;
                }
                if (!bookingRoom.value.pricePerNight && giaGoc) {
                    const price = phanTramGiam > 0
                        ? Number(giaGoc) * (100 - Number(phanTramGiam)) / 100
                        : Number(giaGoc);
                    bookingRoom.value.pricePerNight = price;
                }
                if (!bookingRoom.value.image) {
                    const img = anhDaiDien || danhSachAnh[0];
                    if (img) {
                        bookingRoom.value.image = `${API}/images/${img}`;
                    }
                }
                if (!bookingRoom.value.soPhongCon && soPhongCon != null) {
                    bookingRoom.value.soPhongCon = soPhongCon;
                }
                persistBookingRoom();
            })
            .catch((error) => {
                console.warn('Không tải được chi tiết phòng:', error);
            });
    }
});

const handleSwitchUser = () => {
    localStorage.removeItem('user_info');
    router.push('/dang-nhap');
};

watch(
    () => [guest.value.adults, guest.value.children, guest.value.childAges],
    () => {
        normalizeGuest();
        persistGuest();
    },
    { deep: true }
);

watch(
    () => [bookingRoom.value.checkIn, bookingRoom.value.checkOut, bookingRoom.value.quantity, bookingRoom.value.roomType],
    () => {
        if (bookingRoom.value.checkIn) {
            if (bookingRoom.value.checkIn < minCheckinDate.value) {
                bookingRoom.value.checkIn = minCheckinDate.value;
            } else if (bookingRoom.value.checkIn > maxCheckinDate.value) {
                bookingRoom.value.checkIn = maxCheckinDate.value;
            }
        }
        if (bookingRoom.value.checkOut) {
            if (bookingRoom.value.checkOut < minCheckoutDate.value) {
                bookingRoom.value.checkOut = minCheckoutDate.value;
            } else if (bookingRoom.value.checkOut > maxCheckoutDate.value) {
                bookingRoom.value.checkOut = maxCheckoutDate.value;
            }
        }
        bookingRoom.value.nights = calculateNights(bookingRoom.value.checkIn, bookingRoom.value.checkOut);
        normalizeQuantity();
        persistBookingRoom();
    }
);

watch(
    () => bookingRoom.value.roomType,
    (type) => {
        if (!type) return;
        const match = roomList.value.find((item) => getField(item, 'tenLoai', 'TenLoai') === type);
        if (match) {
            applyRoomFromItem(match);
            bookingRoom.value.quantity = 1;
            normalizeQuantity();
            persistBookingRoom();
        }
    }
);

onUnmounted(() => {
    if(interval) clearInterval(interval);
});
</script>

<style scoped>
/* CSS Tùy chỉnh từ file gốc */
.booking-page {
    background-color: #f8f7f9;
    min-height: 100vh;
    padding-bottom: 50px;
}

/* Header riêng cho booking */
.booking-header {
    background: white;
    border-bottom: 1px solid #ddd;
}

.text-orange {
    color: #f35525 !important;
}

.bg-orange {
    background-color: #f35525 !important;
    color: #fff;
}

.step-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.step-item {
    display: flex;
    align-items: center;
    color: #999;
    font-weight: 600;
    margin: 0 15px;
    font-size: 14px;
}

.step-item.active {
    color: #f35525;
    border-bottom: 2px solid #f35525;
    padding-bottom: 2px;
}

.step-num {
    background: #eee;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    font-size: 12px;
}

.step-item.active .step-num {
    background: #f35525;
    color: white;
}

.countdown-banner {
    background: #fff4e6;
    color: #333;
    padding: 10px;
    border-bottom: 1px solid #ffd4a3;
    text-align: center;
    font-weight: 500;
    font-size: 14px;
}

.card {
    border: none;
    border-radius: 8px;
    margin-bottom: 15px;
}

.card-header-custom {
    background: #fff4e6;
    padding: 12px 20px;
    border-radius: 8px 8px 0 0;
    font-weight: bold;
    color: #333;
}

.benefit-tag {
    background: #ffe6d4;
    color: #f35525;
    padding: 4px 12px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 11px;
}

.price-final {
    color: #f35525;
    font-size: 22px;
    font-weight: bold;
}

.strike-price {
    text-decoration: line-through;
    color: #888;
    font-size: 14px;
}

.btn-next {
    background-color: #f35525;
    border-color: #f35525;
    color: white;
    transition: all 0.3s;
}

.btn-next:hover {
    background-color: #d14013;
    transform: translateY(-2px);
}

.object-fit-cover {
    object-fit: cover;
}

.room-table {
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 10px 12px;
    background: #fff;
}

.btn-outline-orange {
    border: 1px solid #f35525;
    color: #f35525;
}

.btn-outline-orange:hover {
    background: #f35525;
    color: #fff;
}

.room-image-placeholder {
    height: 100%;
    min-height: 90px;
    background: #f3f3f3;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 12px;
}
</style>