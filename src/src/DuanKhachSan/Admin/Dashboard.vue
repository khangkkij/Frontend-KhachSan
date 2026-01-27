<template>
  <div class="row">
    <div class="col-lg-8 mb-4 order-0">
      <div class="card">
        <div class="d-flex align-items-end row">
          <div class="col-sm-7">
            <div class="card-body">
              <h5 class="card-title text-primary">Xin chào Admin! 🎉</h5>
              <p class="mb-4">
                Bạn đã bán được nhiều hơn <span class="fw-bold">72%</span> so với hôm qua. Hãy kiểm tra huy hiệu mới trong hồ sơ của bạn.
              </p>

              <a href="javascript:;" class="btn btn-sm btn-outline-primary">Xem huy hiệu</a>
            </div>
          </div>
          <div class="col-sm-5 text-center text-sm-left">
            <div class="card-body pb-0 px-0 px-md-4">
              <div style="height: 140px; display: flex; align-items: center; justify-content: center; color: #ccc;">
                  <i class="bx bx-user" style="font-size: 50px;"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-4 col-md-4 order-1">
      <div class="row">
        <div class="col-lg-6 col-md-12 col-6 mb-4">
          <div class="card">
            <div class="card-body">
              <div class="card-title d-flex align-items-start justify-content-between">
                <div class="avatar flex-shrink-0">
                  <span class="avatar-initial rounded bg-label-success"><i class="bx bx-chart"></i></span>
                </div>
                <div class="dropdown">
                  <button class="btn p-0" type="button" id="cardOpt3" data-bs-toggle="dropdown">
                    <i class="bx bx-dots-vertical-rounded"></i>
                  </button>
                  <div class="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                    <a class="dropdown-item" href="javascript:void(0);">Xem thêm</a>
                    <a class="dropdown-item" href="javascript:void(0);">Xóa</a>
                  </div>
                </div>
              </div>
              <span class="fw-semibold d-block mb-1">Lợi nhuận</span>
              <h3 class="card-title mb-2">$12,628</h3>
              <small class="text-success fw-semibold"><i class="bx bx-up-arrow-alt"></i> +72.80%</small>
            </div>
          </div>
        </div>
        <div class="col-lg-6 col-md-12 col-6 mb-4">
          <div class="card">
            <div class="card-body">
              <div class="card-title d-flex align-items-start justify-content-between">
                <div class="avatar flex-shrink-0">
                  <span class="avatar-initial rounded bg-label-info"><i class="bx bx-wallet"></i></span>
                </div>
                <div class="dropdown">
                  <button class="btn p-0" type="button" id="cardOpt6" data-bs-toggle="dropdown">
                    <i class="bx bx-dots-vertical-rounded"></i>
                  </button>
                  <div class="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt6">
                    <a class="dropdown-item" href="javascript:void(0);">Xem thêm</a>
                    <a class="dropdown-item" href="javascript:void(0);">Xóa</a>
                  </div>
                </div>
              </div>
              <span>Doanh số</span>
              <h3 class="card-title text-nowrap mb-1">$4,679</h3>
              <small class="text-success fw-semibold"><i class="bx bx-up-arrow-alt"></i> +28.42%</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-8 order-2 order-md-3 order-lg-2 mb-4">
      <div class="card">
        <div class="row row-bordered g-0">
          <div class="col-md-8">
            <h5 class="card-header m-0 me-2 pb-3">Tổng Doanh Thu</h5>
            <div id="totalRevenueChart" class="px-2"></div>
          </div>
          <div class="col-md-4">
            <div class="card-body">
              <div class="text-center">
                <div class="dropdown">
                  <button class="btn btn-sm btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    2024
                  </button>
                  <div class="dropdown-menu dropdown-menu-end">
                    <a class="dropdown-item" href="javascript:void(0);">2023</a>
                    <a class="dropdown-item" href="javascript:void(0);">2022</a>
                  </div>
                </div>
              </div>
            </div>
            <div id="growthChart"></div>
            <div class="text-center fw-semibold pt-3 mb-2">Tăng trưởng 62%</div>

            <div class="d-flex px-xxl-4 px-lg-2 p-4 gap-xxl-3 gap-lg-1 gap-3 justify-content-between">
              <div class="d-flex">
                <div class="me-2">
                  <span class="badge bg-label-primary p-2"><i class="bx bx-dollar text-primary"></i></span>
                </div>
                <div class="d-flex flex-column">
                  <small>2024</small>
                  <h6 class="mb-0">$32.5k</h6>
                </div>
              </div>
              <div class="d-flex">
                <div class="me-2">
                  <span class="badge bg-label-info p-2"><i class="bx bx-wallet text-info"></i></span>
                </div>
                <div class="d-flex flex-column">
                  <small>2023</small>
                  <h6 class="mb-0">$41.2k</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-8 col-lg-4 order-3 order-md-2">
      <div class="row">
        <div class="col-6 mb-4">
          <div class="card">
            <div class="card-body">
              <div class="card-title d-flex align-items-start justify-content-between">
                <div class="avatar flex-shrink-0">
                  <span class="avatar-initial rounded bg-label-danger"><i class="bx bxl-paypal"></i></span>
                </div>
              </div>
              <span class="d-block mb-1">Thanh toán</span>
              <h3 class="card-title text-nowrap mb-2">$2,456</h3>
              <small class="text-danger fw-semibold"><i class="bx bx-down-arrow-alt"></i> -14.82%</small>
            </div>
          </div>
        </div>
        <div class="col-6 mb-4">
          <div class="card">
            <div class="card-body">
              <div class="card-title d-flex align-items-start justify-content-between">
                <div class="avatar flex-shrink-0">
                  <span class="avatar-initial rounded bg-label-primary"><i class="bx bx-credit-card"></i></span>
                </div>
              </div>
              <span class="fw-semibold d-block mb-1">Giao dịch</span>
              <h3 class="card-title mb-2">$14,857</h3>
              <small class="text-success fw-semibold"><i class="bx bx-up-arrow-alt"></i> +28.14%</small>
            </div>
          </div>
        </div>
        
        <div class="col-12 mb-4">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between flex-sm-row flex-column gap-3">
                <div class="d-flex flex-sm-column flex-row align-items-start justify-content-between">
                  <div class="card-title">
                    <h5 class="text-nowrap mb-2">Báo cáo hồ sơ</h5>
                    <span class="badge bg-label-warning rounded-pill">Năm 2024</span>
                  </div>
                  <div class="mt-sm-auto">
                    <small class="text-success text-nowrap fw-semibold"><i class="bx bx-chevron-up"></i> 68.2%</small>
                    <h3 class="mb-0">$84,686k</h3>
                  </div>
                </div>
                <div id="profileReportChart"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-md-6 col-lg-4 col-xl-4 order-0 mb-4">
      <div class="card h-100">
        <div class="card-header d-flex align-items-center justify-content-between pb-0">
          <div class="card-title mb-0">
            <h5 class="m-0 me-2">Thống kê Đơn hàng</h5>
            <small class="text-muted">42.82k Tổng đơn</small>
          </div>
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="d-flex flex-column align-items-center gap-1">
              <h2 class="mb-2">8,258</h2>
              <span>Tổng đơn</span>
            </div>
            <div id="orderStatisticsChart"></div>
          </div>
          <ul class="p-0 m-0">
            <li class="d-flex mb-4 pb-1">
              <div class="avatar flex-shrink-0 me-3">
                <span class="avatar-initial rounded bg-label-primary"><i class="bx bx-mobile-alt"></i></span>
              </div>
              <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                <div class="me-2">
                  <h6 class="mb-0">Điện tử</h6>
                  <small class="text-muted">Mobile, Earbuds, TV</small>
                </div>
                <div class="user-progress">
                  <small class="fw-semibold">82.5k</small>
                </div>
              </div>
            </li>
            <li class="d-flex mb-4 pb-1">
              <div class="avatar flex-shrink-0 me-3">
                <span class="avatar-initial rounded bg-label-success"><i class="bx bx-closet"></i></span>
              </div>
              <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                <div class="me-2">
                  <h6 class="mb-0">Thời trang</h6>
                  <small class="text-muted">Áo, Quần, Giày</small>
                </div>
                <div class="user-progress">
                  <small class="fw-semibold">23.8k</small>
                </div>
              </div>
            </li>
            <li class="d-flex mb-4 pb-1">
              <div class="avatar flex-shrink-0 me-3">
                <span class="avatar-initial rounded bg-label-info"><i class="bx bx-home-alt"></i></span>
              </div>
              <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                <div class="me-2">
                  <h6 class="mb-0">Nội thất</h6>
                  <small class="text-muted">Trang trí, Bàn ăn</small>
                </div>
                <div class="user-progress">
                  <small class="fw-semibold">849k</small>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="col-md-6 col-lg-4 order-1 mb-4">
      <div class="card h-100">
        <div class="card-header">
          <ul class="nav nav-pills" role="tablist">
            <li class="nav-item">
              <button type="button" class="nav-link active" role="tab" data-bs-toggle="tab" data-bs-target="#navs-tabs-line-card-income">
                Thu nhập
              </button>
            </li>
            <li class="nav-item">
              <button type="button" class="nav-link" role="tab">Chi phí</button>
            </li>
            <li class="nav-item">
              <button type="button" class="nav-link" role="tab">Lợi nhuận</button>
            </li>
          </ul>
        </div>
        <div class="card-body px-0">
          <div class="tab-content p-0">
            <div class="tab-pane fade show active" id="navs-tabs-line-card-income" role="tabpanel">
              <div class="d-flex p-4 pt-3">
                <div class="avatar flex-shrink-0 me-3">
                  <span class="avatar-initial rounded bg-label-secondary"><i class="bx bx-wallet"></i></span>
                </div>
                <div>
                  <small class="text-muted d-block">Tổng số dư</small>
                  <div class="d-flex align-items-center">
                    <h6 class="mb-0 me-1">$459.10</h6>
                    <small class="text-success fw-semibold"><i class="bx bx-chevron-up"></i> 42.9%</small>
                  </div>
                </div>
              </div>
              <div id="incomeChart"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-6 col-lg-4 order-2 mb-4">
      <div class="card h-100">
        <div class="card-header d-flex align-items-center justify-content-between">
          <h5 class="card-title m-0 me-2">Giao dịch</h5>
        </div>
        <div class="card-body">
          <ul class="p-0 m-0">
            <li class="d-flex mb-4 pb-1">
              <div class="avatar flex-shrink-0 me-3">
                <span class="avatar-initial rounded bg-label-danger"><i class="bx bxl-paypal"></i></span>
              </div>
              <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                <div class="me-2">
                  <small class="text-muted d-block mb-1">Paypal</small>
                  <h6 class="mb-0">Chuyển tiền</h6>
                </div>
                <div class="user-progress d-flex align-items-center gap-1">
                  <h6 class="mb-0">+82.6</h6>
                  <span class="text-muted">USD</span>
                </div>
              </div>
            </li>
            <li class="d-flex mb-4 pb-1">
              <div class="avatar flex-shrink-0 me-3">
                 <span class="avatar-initial rounded bg-label-success"><i class="bx bx-wallet"></i></span>
              </div>
              <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                <div class="me-2">
                  <small class="text-muted d-block mb-1">Ví điện tử</small>
                  <h6 class="mb-0">Ăn uống</h6>
                </div>
                <div class="user-progress d-flex align-items-center gap-1">
                  <h6 class="mb-0">+270.69</h6>
                  <span class="text-muted">USD</span>
                </div>
              </div>
            </li>
             <li class="d-flex mb-4 pb-1">
              <div class="avatar flex-shrink-0 me-3">
                 <span class="avatar-initial rounded bg-label-info"><i class="bx bx-credit-card"></i></span>
              </div>
              <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                <div class="me-2">
                  <small class="text-muted d-block mb-1">Thẻ tín dụng</small>
                  <h6 class="mb-0">Mua sắm</h6>
                </div>
                <div class="user-progress d-flex align-items-center gap-1">
                  <h6 class="mb-0">-838.71</h6>
                  <span class="text-muted">USD</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

// Logic JS giữ nguyên
</script>

<style scoped>
/* CSS giữ nguyên */
</style>