<template>
  <div class="container-xxl container-p-y admin-layout">
    <div class="d-flex justify-content-between align-items-center mb-5 header-section">
      <div>
        <h4 class="fw-bold mb-1 text-dark">Quản lý danh mục phòng</h4>
        <p class="text-muted small mb-0">Thiết lập và tùy chỉnh các hạng phòng trong hệ thống</p>
      </div>
      <button class="btn btn-add-new shadow-sm px-4 py-2" data-bs-toggle="modal" data-bs-target="#modalAdd">
        <i class="bi bi-plus-lg me-2"></i> Thêm loại phòng
      </button>
    </div>

    <div class="search-box mb-5">
      <div class="input-group shadow-sm">
        <span class="input-group-text bg-white border-end-0 ps-4">
          <i class="bi bi-search text-muted"></i>
        </span>
        <input
          type="text"
          class="form-control border-start-0 py-3 ps-2"
          placeholder="Tìm theo tên loại phòng hoặc giá tiền..."
        />
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-4 col-md-6">
        <div class="card loai-phong-card border-0 h-100">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="category-icon bg-soft-primary">
                <i class="bi bi-house-door text-primary"></i>
              </div>
              <div class="badge bg-soft-success text-success rounded-pill px-3">Đang kinh doanh</div>
            </div>

            <h5 class="fw-bold mb-2 title-room">Standard Room</h5>
            <p class="text-muted small mb-4 line-clamp">
              Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản, phù hợp cho cặp đôi hoặc đi công tác.
            </p>

            <div class="info-grid mb-4">
              <div class="info-item">
                <span class="label">Giá mỗi đêm</span>
                <span class="value text-primary fw-bold">400.000đ</span>
              </div>
              <div class="info-item">
                <span class="label">Sức chứa</span>
                <span class="value">02 người lớn</span>
              </div>
            </div>

            <div class="d-flex gap-2 border-top pt-4">
              <button class="btn btn-light-warning flex-grow-1 py-2" data-bs-toggle="modal" data-bs-target="#modalEdit">
                <i class="bi bi-pencil-square me-2"></i>Sửa
              </button>
              <button class="btn btn-light-danger flex-grow-1 py-2">
                <i class="bi bi-trash3 me-2"></i>Xoá
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4 col-md-6">
        <div class="card loai-phong-card border-0 h-100 highlight-card">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="category-icon bg-soft-warning">
                <i class="bi bi-stars text-warning"></i>
              </div>
              <div class="badge bg-soft-success text-success rounded-pill px-3">Đang kinh doanh</div>
            </div>

            <h5 class="fw-bold mb-2 title-room">Deluxe Suite</h5>
            <p class="text-muted small mb-4 line-clamp">
              Hạng phòng cao cấp với tầm nhìn toàn cảnh thành phố, nội thất gỗ tự nhiên sang trọng.
            </p>

            <div class="info-grid mb-4">
              <div class="info-item">
                <span class="label">Giá mỗi đêm</span>
                <span class="value text-primary fw-bold">1.250.000đ</span>
              </div>
              <div class="info-item">
                <span class="label">Sức chứa</span>
                <span class="value">04 người lớn</span>
              </div>
            </div>

            <div class="d-flex gap-2 border-top pt-4">
              <button class="btn btn-light-warning flex-grow-1 py-2" data-bs-toggle="modal" data-bs-target="#modalEdit">
                <i class="bi bi-pencil-square me-2"></i>Sửa
              </button>
              <button class="btn btn-light-danger flex-grow-1 py-2">
                <i class="bi bi-trash3 me-2"></i>Xoá
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    </div>
</template>