<template>
  <div class="villa-agency-wrapper">
    <div v-if="isLoading" id="js-preloader" class="js-preloader">
      <div class="preloader-inner">
        <span class="dot"></span>
        <div class="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <div class="main-banner">
      <div class="owl-carousel owl-banner">
        <div class="item item-1">
          <div class="header-text">
            <span class="category">Deluxe</span>
            <h2>Đặt phòng view đẹp, phong phú, tiện nghi</h2>
          </div>
        </div>
        <div class="item item-2">
          <div class="header-text">
            <span class="category">VIP</span>
            <h2>Đừng bỏ lỡ!<br>Phòng VIP hạng sang</h2>
          </div>
        </div>
        <div class="item item-3">
          <div class="header-text">
            <span class="category">Standard</span>
            <h2>Phòng tiêu chuẩn<br>Dành cho công việc ngắn hạn</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="villa-agency-wrapper">
      <div class="container search-container">
        <div class="filter-wrapper p-4 bg-white shadow-sm rounded-4 mb-4">
          <form @submit.prevent="handleSearch">
            <div class="row g-3 align-items-end">
              <div class="col-lg-5 col-md-12">
                <label class="form-label fw-bold small text-muted">TÌM KIẾM PHÒNG</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0"><i class="bi bi-search"></i></span>
                  <input v-model="keyword" type="text" class="form-control bg-light border-start-0 ps-0"
                    placeholder="Nhập tên phòng hoặc loại phòng..." />
                </div>
              </div>

              <div class="col-lg-4 col-md-8">
                <label class="form-label fw-bold small text-muted">KHOẢNG GIÁ (VNĐ)</label>
                <div class="input-group">
                  <input v-model.number="minPrice" type="number" class="form-control bg-light" placeholder="Từ">
                  <span class="input-group-text bg-light border-start-0 border-end-0">→</span>
                  <input v-model.number="maxPrice" type="number" class="form-control bg-light" placeholder="Đến">
                </div>
              </div>

              <div class="col-lg-3 col-md-4 d-flex align-items-center justify-content-lg-end">
                <div class="form-check form-switch custom-switch">
                  <input v-model="onlyAvailable" class="form-check-input" type="checkbox" id="available">
                  <label class="form-check-label fw-medium" for="available">Phòng còn trống</label>
                </div>
              </div>
            </div>

            <hr class="my-4 text-muted opacity-25">

            <div class="row g-3">
              <div class="col-md-3">
                <div class="input-group">
                  <span class="input-group-text bg-transparent border-0 ps-0"><i class="bi bi-people"></i></span>
                  <input v-model.number="kid" type="number" min="0"
                    class="form-control border-0 border-bottom rounded-0 shadow-none" placeholder="Số trẻ em" />
                </div>
              </div>

              <div class="col-md-3">
                <div class="input-group">
                  <span class="input-group-text bg-transparent border-0 ps-0"><i class="bi bi-people"></i></span>
                  <input v-model.number="guests" type="number" min="1"
                    class="form-control border-0 border-bottom rounded-0 shadow-none" placeholder="Số người lớn" />
                </div>
              </div>

              <div class="col-md-3">
                <div class="input-group">
                  <span class="input-group-text bg-transparent border-0 ps-0"><i class="bi bi-layers"></i></span>
                  <input v-model.number="minArea" type="number"
                    class="form-control border-0 border-bottom rounded-0 shadow-none" placeholder="Diện tích từ (m²)" />
                </div>
              </div>

              <div class="col-md-3">
                <button type="submit" class="btn btn-primary w-100 fw-bold shadow-sm"
                  style="background: #f35525; border: none; height: 45px;">
                  <i class="bi bi-search me-1"></i> Tìm Kiếm Ngay
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>

    <div class="featured section">
      <div class="container">
        <div class="row">
          <div class="col-lg-4">
            <div class="left-image">
              <img src="/assets/images/featured.jpg" alt="">
              <a href="#"><img src="/assets/images/featured-icon.png" alt="" style="max-width: 60px; padding: 0px;"></a>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="section-heading">
              <h6>| Nổi bật</h6>
              <h2>Phòng Deluxe độc nhất & View biển</h2>
            </div>
            <div class="accordion" id="accordionExample">
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                    aria-expanded="true" aria-controls="collapseOne">
                    Có gì đặc biệt?
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    Có view biển, ban công rộng rãi, tiện nghi đầy đủ.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingTwo">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Chi phí như thế nào?
                  </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo"
                  data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    Với chỉ từ 1.200.000 VNĐ/ngày, bạn đã có thể trải nghiệm.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingThree">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    Chất lượng dịch vụ?
                  </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree"
                  data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    Đa dạng dịch vụ đi kèm, phục vụ 24/7.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3">
            <div class="info-table">
              <ul>
                <li>
                  <img src="/assets/images/info-icon-01.png" alt="" style="max-width: 52px;">
                  <h4>250 m2<br><span>Tổng diện tích</span></h4>
                </li>
                <li>
                  <img src="/assets/images/info-icon-02.png" alt="" style="max-width: 52px;">
                  <h4>Thủ tục<br><span>Nhanh gọn</span></h4>
                </li>
                <li>
                  <img src="/assets/images/info-icon-03.png" alt="" style="max-width: 52px;">
                  <h4>Thanh toán<br><span>Linh hoạt</span></h4>
                </li>
                <li>
                  <img src="/assets/images/info-icon-04.png" alt="" style="max-width: 52px;">
                  <h4>An toàn<br><span>Kiểm soát 24/7</span></h4>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="video section">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 offset-lg-4">
            <div class="section-heading text-center">
              <h6>| Video Trực quan</h6>
              <h2>Góc nhìn cận cảnh & Cảm nhận khác biệt</h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="video-content">
      <div class="container">
        <div class="row">
          <div class="col-lg-10 offset-lg-1">
            <div class="video-frame">
              <img src="/assets/images/video-frame.jpg" alt="">
              <a href="https://youtube.com" target="_blank"><i class="fa fa-play"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fun-facts">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="wrapper">
              <div class="row">
                <div class="col-lg-4">
                  <div class="counter">
                    <h2 class="timer count-title count-number" data-to="34" data-speed="1000">70</h2>
                    <p class="count-text ">Lượt khách<br>Đã trải nghiệm</p>
                  </div>
                </div>
                <div class="col-lg-4">
                  <div class="counter">
                    <h2 class="timer count-title count-number" data-to="12" data-speed="1000">6</h2>
                    <p class="count-text ">Năm<br>Vận hành</p>
                  </div>
                </div>
                <div class="col-lg-4">
                  <div class="counter">
                    <h2 class="timer count-title count-number" data-to="24" data-speed="1000">100%</h2>
                    <p class="count-text ">Khách hàng<br>Hài lòng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section best-deal">
      <div class="container">
        <div class="row">
          <div class="col-lg-4">
            <div class="section-heading">
              <h6>| Ưu đãi tốt nhất</h6>
              <h2>Tìm phòng ưng ý ngay hôm nay!</h2>
            </div>
          </div>
          <div class="col-lg-12">
            <div class="tabs-content">
              <div class="row">
                <div class="nav-wrapper ">
                  <ul class="nav nav-tabs" role="tablist">
                    <li class="nav-item" role="presentation">
                      <button class="nav-link active" id="appartment-tab" data-bs-toggle="tab"
                        data-bs-target="#appartment" type="button" role="tab" aria-controls="appartment"
                        aria-selected="true">Deluxe</button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button class="nav-link" id="villa-tab" data-bs-toggle="tab" data-bs-target="#villa" type="button"
                        role="tab" aria-controls="villa" aria-selected="false">VIP</button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button class="nav-link" id="penthouse-tab" data-bs-toggle="tab" data-bs-target="#penthouse"
                        type="button" role="tab" aria-controls="penthouse" aria-selected="false">Standard</button>
                    </li>
                  </ul>
                </div>
                <div class="tab-content" id="myTabContent">
                  <div class="tab-pane fade show active" id="appartment" role="tabpanel"
                    aria-labelledby="appartment-tab">
                    <div class="row">
                      <div class="col-lg-3">
                        <div class="info-table">
                          <ul>
                            <li>Tổng diện tích <span>185 m2</span></li>
                            <li>Tầng số <span>26</span></li>
                            <li>Số phòng <span>4</span></li>
                            <li>Bãi đậu xe <span>Có</span></li>
                            <li>Thanh toán <span>Ngân hàng</span></li>
                          </ul>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <img src="/assets/images/deal-01.jpg" alt="">
                      </div>
                      <div class="col-lg-3">
                        <h4>Thông tin thêm về phòng</h4>
                        <p>Nội dung mô tả chi tiết về phòng này. Vị trí thuận lợi, tiện ích đầy đủ.</p>
                        <div class="icon-button">
                          <a href="#"><i class="fa fa-calendar"></i> Đặt lịch xem</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="tab-pane fade" id="villa" role="tabpanel" aria-labelledby="villa-tab">
                    <div class="row">
                      <div class="col-lg-3">
                        <div class="info-table">
                          <ul>
                            <li>Tổng diện tích <span>120 m2</span></li>
                            <li>Tầng số <span>15</span></li>
                            <li>Số phòng <span>3</span></li>
                            <li>Bãi đậu xe <span>Có</span></li>
                            <li>Thanh toán <span>Ngân hàng</span></li>
                          </ul>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <img src="/assets/images/deal-01.jpg" alt="">
                      </div>
                      <div class="col-lg-3">
                        <h4>Thông tin thêm về phòng</h4>
                        <p>Nội dung mô tả chi tiết về phòng này. Vị trí thuận lợi, tiện ích đầy đủ.</p>
                        <div class="icon-button">
                          <a href="#"><i class="fa fa-calendar"></i> Đặt lịch xem</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="tab-pane fade" id="penthouse" role="tabpanel" aria-labelledby="penthouse-tab">
                    <div class="row">
                      <div class="col-lg-3">
                        <div class="info-table">
                          <ul>
                            <li>Tổng diện tích <span>100 m2</span></li>
                            <li>Tầng số <span>8</span></li>
                            <li>Số phòng <span>2</span></li>
                            <li>Bãi đậu xe <span>Có</span></li>
                            <li>Thanh toán <span>Ngân hàng</span></li>
                          </ul>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <img src="/assets/images/deal-01.jpg" alt="">
                      </div>
                      <div class="col-lg-3">
                        <h4>Thông tin thêm về phòng</h4>
                        <p>Nội dung mô tả chi tiết về phòng này. Vị trí thuận lợi, tiện ích đầy đủ.</p>
                        <div class="icon-button">
                          <a href="#"><i class="fa fa-calendar"></i> Đặt lịch xem</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="properties section">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 offset-lg-4">
            <div class="section-heading text-center">
              <h6>| Danh sách phòng</h6>
              <h2>Chúng tôi cung cấp những căn phòng tốt nhất</h2>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-4 col-md-6" v-for="room in rooms.slice(0, 3)" :key="room.maBienThePhong">
            <div class="item">
              <router-link :to="`/phong/${room.maBienThePhong}`"><img :src="room.anhDaiDien"
                  :alt="room.tenBienThe"></router-link>
              <span class="category">{{ room.TenLoai }}</span>
              <h6>{{ room.giaGoc }} VNĐ</h6>
              <h4><router-link :to="`/phong/${room.maBienThePhong}`">{{ room.tenBienThe }}</router-link></h4>
              <ul>
                <li>Số người: <span>{{ room.soNguoiToiDa }}</span></li>
                <li>Phòng ngủ: <span>{{ room.soPhongCon }}</span></li>
                <li>Diện tích: <span>{{ room.dienTich }}m2</span></li>
                <li>Tầng: <span>{{ room.floor }}</span></li>
              </ul>
              <div class="main-button">
                <router-link :to="`/phong/${room.maBienThePhong}`">Đặt phòng ngay</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="contact section">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 offset-lg-4">
            <div class="section-heading text-center">
              <h6>| Liên hệ</h6>
              <h2>Kết nối với đại lý của chúng tôi</h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="contact-content">
      <div class="container">
        <div class="row">
          <div class="col-lg-7">
            <div id="map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4946681007846!2d106.69976391471834!3d10.773374292323565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14565e63e419!2sHo%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1646726884000!5m2!1sen!2s"
                width="100%" height="500px" frameborder="0"
                style="border:0; border-radius: 10px; box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);"
                allowfullscreen=""></iframe>
            </div>
            <div class="row">
              <div class="col-lg-6">
                <div class="item phone">
                  <img src="/assets/images/phone-icon.png" alt="" style="max-width: 52px;">
                  <h6>010-020-0340<br><span>Số điện thoại</span></h6>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="item email">
                  <img src="/assets/images/email-icon.png" alt="" style="max-width: 52px;">
                  <h6>info@luxury.com<br><span>Email doanh nghiệp</span></h6>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <form id="contact-form" @submit.prevent="submitForm">
              <div class="row">
                <div class="col-lg-12">
                  <fieldset>
                    <label for="name">Họ và tên</label>
                    <input type="text" id="name" v-model="formData.name" placeholder="Nhập tên của bạn..." required>
                  </fieldset>
                </div>
                <div class="col-lg-12">
                  <fieldset>
                    <label for="email">Địa chỉ Email</label>
                    <input type="text" id="email" v-model="formData.email" placeholder="Nhập email..." required>
                  </fieldset>
                </div>
                <div class="col-lg-12">
                  <fieldset>
                    <label for="subject">Tiêu đề</label>
                    <input type="text" id="subject" v-model="formData.subject" placeholder="Tiêu đề...">
                  </fieldset>
                </div>
                <div class="col-lg-12">
                  <fieldset>
                    <label for="message">Lời nhắn</label>
                    <textarea id="message" v-model="formData.message" placeholder="Nội dung lời nhắn"></textarea>
                  </fieldset>
                </div>
                <div class="col-lg-12">
                  <fieldset>
                    <button type="submit" id="form-submit" class="orange-button">Gửi tin nhắn</button>
                  </fieldset>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
const router = useRouter();

const API_URL = import.meta.env.VITE_API_URL + '/api';

// 1. KHAI BÁO CÁC BIẾN CHO FORM TÌM KIẾM (Khớp với v-model trong template)
const keyword = ref("");
const minPrice = ref(null);
const maxPrice = ref(null);
const onlyAvailable = ref(false);
const kid = ref(null);
const guests = ref(null);
const minArea = ref(null);

// 2. HÀM XỬ LÝ TÌM KIẾM -> CHUYỂN TRANG
const handleSearch = () => {
  const query = {};

  // Chỉ đẩy lên URL những ô có dữ liệu
  if (keyword.value) query.keyword = keyword.value;
  if (minPrice.value) query.minPrice = minPrice.value;
  if (maxPrice.value) query.maxPrice = maxPrice.value;
  if (onlyAvailable.value) query.onlyAvailable = 'true';
  if (kid.value) query.kid = kid.value;
  if (guests.value) query.guests = guests.value;
  if (minArea.value) query.minArea = minArea.value;

  router.push({
    path: '/danh-sach-phong',
    query: query
  });
};

// State cho loading
const isLoading = ref(true);

// State cho form
const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

// Dữ liệu danh sách phòng
// const rooms = ref([
//   {
//     id: 1,
//     name: 'Phòng Deluxe – 202',
//     type: 'Phòng Deluxe',
//     price: '1.200.000',
//     maxPeople: 2,
//     image: '/assets/images/property-01.jpg',
//     area: 250,
//     bedrooms: 2,
//     bathrooms: 2,
//     floor: '2',
//     parking: '2 xe'
//   },
//   {
//     id: 2,
//     name: 'Biệt thự View Biển – 105',
//     type: 'Biệt thự cao cấp',
//     price: '2.500.000',
//     maxPeople: 6,
//     image: '/assets/images/property-02.jpg',
//     area: 450,
//     bedrooms: 4,
//     bathrooms: 3,
//     floor: '1',
//     parking: '4 xe'
//   },
//   {
//     id: 3,
//     name: 'Penthouse Hoàng Gia',
//     type: 'Penthouse',
//     price: '5.000.000',
//     maxPeople: 8,
//     image: '/assets/images/property-03.jpg',
//     area: 320,
//     bedrooms: 5,
//     bathrooms: 5,
//     floor: '26',
//     parking: 'VIP'
//   }
// ]);
const rooms = ref([]);



const loadData = async () => {
  try {
    const response = await axios.get(`${API_URL}/DanhSachPhong`); // Giả sử có API trả về danh sách phòng
    rooms.value = response.data;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu phòng:", error);
  }


};


// HÀM QUAN TRỌNG: Load lại file JS để chạy hiệu ứng Slider, Counter...
onMounted(() => {
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      let oldScript = document.querySelector(`script[src="${src}"]`);
      if (oldScript) oldScript.remove();

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  // Load custom.js và tắt loading
  loadScript('/assets/js/custom.js')
    .then(() => {
      console.log('Đã load custom.js thành công!');
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    })
    .catch(() => {
      console.error('Lỗi load custom.js');
      isLoading.value = false;
    });
  // Load dữ liệu phòng
  loadData();
});

// Hàm xử lý submit form
// Hàm xử lý submit form
const submitForm = async () => {
    // 1. Validate cơ bản (tránh gửi rỗng)
    if (!formData.value.name || !formData.value.email || !formData.value.message) {
        alert("Vui lòng điền tên, email và nội dung tin nhắn!");
        return;
    }

    // Bật trạng thái loading (để disable nút bấm)
    isLoading.value = true;

    // 2. Map dữ liệu cho khớp với C# (ContactDto)
    // C# bên kia đang chờ: HoTen, Email, TieuDe, NoiDung
    const payload = {
        HoTen: formData.value.name,
        Email: formData.value.email,
        TieuDe: formData.value.subject || 'Không có tiêu đề',
        NoiDung: formData.value.message
    };

    try {
        // 3. Gọi API và HỨNG RESPONSE
        const response = await axios.post(`${API_URL}/LienHe`, payload);

        // 4. Xử lý khi thành công
        // response.data chính là cái { message: "..." } mà C# trả về
        console.log("Server phản hồi:", response.data);
        
        alert(response.data.message || "Gửi tin nhắn thành công!");

        // Reset form cho sạch sẽ
        formData.value = {
            name: '',
            email: '',
            subject: '',
            message: ''
        };

    } catch (error) {
        // 5. Xử lý khi lỗi
        console.error("Lỗi khi gửi form liên hệ:", error);
        
        // Lấy thông báo lỗi cụ thể từ Server (nếu có)
        const serverMessage = error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau.";
        alert(serverMessage);

    } finally {
        // 6. Luôn chạy: Tắt loading để nút bấm sáng lại
        isLoading.value = false;
    }
};
</script>

<style scoped>
/* Fix kích thước ảnh trong danh sách phòng */
.properties .item img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.js-preloader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.98);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* --- CSS CHO THANH TÌM KIẾM (STYLE MỚI) --- */
.search-property {
  position: relative;
  margin-top: -60px;
  /* Vẫn giữ hiệu ứng đè lên banner */
  z-index: 10;
  margin-bottom: 60px;
}

/* Style cho Card trắng */
.filter-wrapper {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  /* Viền mờ rất nhẹ */
}

/* Style cho các ô input/select để giống DanhSachPhong */
.form-control,
.form-select,
.input-group-text {
  border-color: transparent;
  /* Bỏ viền đậm */
  padding: 0.6rem 0.75rem;
}

.bg-light {
  background-color: #f8f9fa !important;
  /* Màu xám nhạt nền nã */
}

.input-group-text {
  color: #f35525;
  /* Icon màu cam chủ đạo */
}

.form-select:focus {
  background-color: #fff !important;
  box-shadow: 0 0 0 2px rgba(243, 85, 37, 0.2);
  /* Highlight màu cam khi chọn */
}

/* CSS ĐỂ ĐẨY FORM LÊN ĐÈ VÀO BANNER */
.search-container {
  position: relative;
  margin-top: -80px; /* Kéo lên trên */
  z-index: 10;       /* Đè lên các phần tử khác */
}

.filter-wrapper {
  /* Giữ nguyên style bạn đã có */
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0px 10px 30px rgba(0,0,0,0.1) !important;
}

/* Các style khác giữ nguyên */
.form-control, .form-select { border-radius: 8px; }
.form-control:focus { border-color: #f35525; box-shadow: 0 0 0 0.2rem rgba(243, 85, 37, 0.1); }
.custom-switch .form-check-input:checked { background-color: #f35525; border-color: #f35525; }
</style>