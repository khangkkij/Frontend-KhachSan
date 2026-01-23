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
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Có gì đặc biệt?
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    Có view biển, ban công rộng rãi, tiện nghi đầy đủ.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingTwo">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Chi phí như thế nào?
                  </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    Với chỉ từ 1.200.000 VNĐ/ngày, bạn đã có thể trải nghiệm.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingThree">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    Chất lượng dịch vụ?
                  </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
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
                      <button class="nav-link active" id="appartment-tab" data-bs-toggle="tab" data-bs-target="#appartment" type="button" role="tab" aria-controls="appartment" aria-selected="true">Deluxe</button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button class="nav-link" id="villa-tab" data-bs-toggle="tab" data-bs-target="#villa" type="button" role="tab" aria-controls="villa" aria-selected="false">VIP</button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button class="nav-link" id="penthouse-tab" data-bs-toggle="tab" data-bs-target="#penthouse" type="button" role="tab" aria-controls="penthouse" aria-selected="false">Standard</button>
                    </li>
                  </ul>
                </div>              
                <div class="tab-content" id="myTabContent">
                  <div class="tab-pane fade show active" id="appartment" role="tabpanel" aria-labelledby="appartment-tab">
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
          <div class="col-lg-4 col-md-6" v-for="room in rooms.slice(0, 3)" :key="room.id">
            <div class="item">
              <a href="#"><img :src="room.image" :alt="room.name"></a>
              <span class="category">{{ room.type }}</span>
              <h6>{{ room.price }} VNĐ</h6>
              <h4><a href="#">{{ room.name }}</a></h4>
              <ul>
                <li>Số người: <span>{{ room.maxPeople }}</span></li>
                <li>Phòng ngủ: <span>{{ room.bedrooms }}</span></li>
                <li>Diện tích: <span>{{ room.area }}m2</span></li>
                <li>Tầng: <span>{{ room.floor }}</span></li>
                <li>Đậu xe: <span>{{ room.parking }}</span></li>
              </ul>
              <div class="main-button">
                <a href="#">Đặt lịch xem</a>
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
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4946681007846!2d106.69976391471834!3d10.773374292323565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14565e63e419!2sHo%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1646726884000!5m2!1sen!2s" width="100%" height="500px" frameborder="0" style="border:0; border-radius: 10px; box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);" allowfullscreen=""></iframe>
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
                  <h6>info@villa.co<br><span>Email doanh nghiệp</span></h6>
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
const rooms = ref([
  {
    id: 1,
    name: 'Phòng Deluxe – 202',
    type: 'Phòng Deluxe',
    price: '1.200.000',
    maxPeople: 2,
    image: '/assets/images/property-01.jpg',
    area: 250,
    bedrooms: 2,
    bathrooms: 2,
    floor: '2',
    parking: '2 xe'
  },
  {
    id: 2,
    name: 'Biệt thự View Biển – 105',
    type: 'Biệt thự cao cấp',
    price: '2.500.000',
    maxPeople: 6,
    image: '/assets/images/property-02.jpg',
    area: 450,
    bedrooms: 4,
    bathrooms: 3,
    floor: '1',
    parking: '4 xe'
  },
  {
    id: 3,
    name: 'Penthouse Hoàng Gia',
    type: 'Penthouse',
    price: '5.000.000',
    maxPeople: 8,
    image: '/assets/images/property-03.jpg',
    area: 320,
    bedrooms: 5,
    bathrooms: 5,
    floor: '26',
    parking: 'VIP'
  }
]);
// const rooms = ref([]);

// const loadData = async () => {
//   const response = await fetch('/api/rooms'); // Giả sử có API trả về danh sách phòng
//   rooms.value = await response.json();

// }


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
});

// Hàm xử lý submit form
const submitForm = () => {
  console.log("Dữ liệu gửi đi:", formData.value);
  alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
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
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(255,255,255,0.98);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}
</style>