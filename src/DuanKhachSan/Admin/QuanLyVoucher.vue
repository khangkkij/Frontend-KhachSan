<template>
  <div class="container-xxl container-p-y">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0">Quản lý Mã giảm giá (Voucher)</h4>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalVoucher">
        <i class="bx bx-plus me-1"></i> Tạo Voucher mới
      </button>
    </div>

    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <div class="input-group input-group-merge">
              <span class="input-group-text"><i class="bx bx-search"></i></span>
              <input type="text" class="form-control" placeholder="Tìm theo mã voucher..." />
            </div>
          </div>
          <div class="col-md-3">
            <select class="form-select">
              <option selected>Tất cả trạng thái</option>
              <option value="1">Đang hoạt động</option>
              <option value="2">Chưa diễn ra</option>
              <option value="3">Đã hết hạn</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 voucher-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-label-primary p-2 rounded">
                <i class="bx bx-gift fs-4"></i>
              </span>
              <div class="dropdown">
                <button class="btn p-0" type="button" data-bs-toggle="dropdown">
                  <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-end">
                  <a class="dropdown-item" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#modalVoucher">
                    <i class="bx bx-edit-alt me-1"></i> Sửa
                  </a>
                  <a class="dropdown-item text-danger" href="javascript:void(0);">
                    <i class="bx bx-trash me-1"></i> Xoá
                  </a>
                </div>
              </div>
            </div>
            
            <h5 class="card-title fw-bold text-primary mb-1">SUMMER2024</h5>
            <h3 class="mb-1 text-success">-20%</h3>
            <p class="text-muted mb-3">Giảm tối đa 200k cho đơn từ 1tr</p>

            <div class="d-flex justify-content-between align-items-center mb-2">
              <small class="text-muted"><i class="bx bx-calendar me-1"></i>Hết hạn: <strong>30/08/2024</strong></small>
              <span class="badge bg-success">Đang hoạt động</span>
            </div>

            <div class="progress mb-2" style="height: 6px;">
              <div class="progress-bar bg-primary" role="progressbar" style="width: 45%"></div>
            </div>
            <div class="d-flex justify-content-between">
              <small class="text-muted">Đã dùng: 45</small>
              <small class="text-muted">Tổng: 100</small>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <div class="card h-100 voucher-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-label-warning p-2 rounded">
                <i class="bx bxs-coupon fs-4"></i>
              </span>
              <div class="dropdown">
                <button class="btn p-0" type="button" data-bs-toggle="dropdown">
                  <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-end">
                  <a class="dropdown-item" href="javascript:void(0);">Sửa</a>
                  <a class="dropdown-item text-danger" href="javascript:void(0);">Xoá</a>
                </div>
              </div>
            </div>
            
            <h5 class="card-title fw-bold text-primary mb-1">TET2025</h5>
            <h3 class="mb-1 text-warning">-50.000đ</h3>
            <p class="text-muted mb-3">Giảm trực tiếp 50k</p>

            <div class="d-flex justify-content-between align-items-center mb-2">
              <small class="text-muted"><i class="bx bx-calendar me-1"></i>Hết hạn: <strong>01/02/2025</strong></small>
              <span class="badge bg-warning">Chưa diễn ra</span>
            </div>

            <div class="progress mb-2" style="height: 6px;">
              <div class="progress-bar bg-warning" role="progressbar" style="width: 0%"></div>
            </div>
            <div class="d-flex justify-content-between">
              <small class="text-muted">Đã dùng: 0</small>
              <small class="text-muted">Tổng: 500</small>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4">
        <div class="card h-100 voucher-card grayscale">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-label-secondary p-2 rounded">
                <i class="bx bx-purchase-tag-alt fs-4"></i>
              </span>
              <div class="dropdown">
                <button class="btn p-0" type="button" data-bs-toggle="dropdown">
                  <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-end">
                  <a class="dropdown-item" href="javascript:void(0);">Sửa</a>
                  <a class="dropdown-item text-danger" href="javascript:void(0);">Xoá</a>
                </div>
              </div>
            </div>
            
            <h5 class="card-title fw-bold text-secondary mb-1">WELCOME</h5>
            <h3 class="mb-1 text-secondary">-10%</h3>
            <p class="text-muted mb-3">Dành cho khách hàng mới</p>

            <div class="d-flex justify-content-between align-items-center mb-2">
              <small class="text-muted"><i class="bx bx-calendar me-1"></i>Hết hạn: <strong>01/01/2024</strong></small>
              <span class="badge bg-secondary">Đã hết hạn</span>
            </div>

            <div class="progress mb-2" style="height: 6px;">
              <div class="progress-bar bg-secondary" role="progressbar" style="width: 100%"></div>
            </div>
            <div class="d-flex justify-content-between">
              <small class="text-muted">Đã dùng: 200</small>
              <small class="text-muted">Tổng: 200</small>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="modal fade" id="modalVoucher" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Thông tin Voucher</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Mã Voucher (Code) <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" placeholder="VD: SUMMER2024" style="text-transform: uppercase;">
                </div>
                
                <div class="col-md-6">
                  <label class="form-label">Loại giảm giá</label>
                  <select class="form-select">
                    <option value="percent">Theo phần trăm (%)</option>
                    <option value="amount">Theo số tiền (VNĐ)</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Giá trị giảm</label>
                  <div class="input-group">
                    <input type="number" class="form-control" placeholder="VD: 10">
                    <span class="input-group-text">%</span>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Số lượng phát hành</label>
                  <input type="number" class="form-control" placeholder="VD: 100">
                </div>

                <div class="col-md-6">
                  <label class="form-label">Ngày bắt đầu</label>
                  <input type="date" class="form-control">
                </div>

                <div class="col-md-6">
                  <label class="form-label">Ngày kết thúc</label>
                  <input type="date" class="form-control">
                </div>

                <div class="col-12">
                  <label class="form-label">Mô tả / Điều kiện áp dụng</label>
                  <textarea class="form-control" rows="2" placeholder="VD: Áp dụng cho đơn hàng từ 500k..."></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Huỷ bỏ</button>
            <button type="button" class="btn btn-primary">Lưu Voucher</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
// Logic xử lý script ở đây
</script>

<style scoped>
.voucher-card {
  border: 1px dashed #d9dee3; /* Viền nét đứt tạo cảm giác voucher */
  transition: all 0.2s ease-in-out;
}

.voucher-card:hover {
  border-color: #696cff;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(105, 108, 255, 0.15);
}

.grayscale {
  filter: grayscale(100%);
  opacity: 0.7;
}

.grayscale:hover {
  filter: grayscale(0%);
  opacity: 1;
}
</style>