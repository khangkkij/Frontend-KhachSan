<template>
  <div class="container-xxl container-p-y">

    <!-- HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0">Quản lý danh mục phòng</h4>
      <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalAdd">
        + Thêm loại phòng
      </button>
    </div>

    <!-- SEARCH -->
    <div class="card mb-4">
      <div class="card-body">
        <input
          type="text"
          class="form-control"
          placeholder="Tìm theo tên loại phòng..."
        />
      </div>
    </div>

    <!-- LIST -->
    <div class="row g-4">

      <!-- CARD ITEM -->
      <div class="col-md-4">
        <div class="card loai-phong-card h-100">
          <div class="card-body">
            <h5 class="fw-semibold mb-2">Standard</h5>

            <p class="text-muted mb-3">
              Phòng tiêu chuẩn, phù hợp cho 2 người
            </p>

            <ul class="list-unstyled mb-3">
              <li>💰 <strong>400.000đ</strong> / đêm</li>
              <li>👤 Tối đa 2 người</li>
            </ul>

            <div class="d-flex justify-content-end gap-2">
              <button class="btn btn-sm btn-outline-warning" data-bs-toggle="modal" data-bs-target="#modalEdit">
                Sửa
              </button>
              <button class="btn btn-sm btn-outline-danger">
                Xoá
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CARD ITEM -->
      <div class="col-md-4">
        <div class="card loai-phong-card h-100">
          <div class="card-body">
            <h5 class="fw-semibold mb-2">Deluxe</h5>

            <p class="text-muted mb-3">
              Phòng cao cấp, view đẹp, rộng rãi
            </p>

            <ul class="list-unstyled mb-3">
              <li>💰 <strong>650.000đ</strong> / đêm</li>
              <li>👤 Tối đa 3 người</li>
            </ul>

            <div class="d-flex justify-content-end gap-2">
              <button class="btn btn-sm btn-outline-warning" data-bs-toggle="modal" data-bs-target="#modalEdit">
                Sửa
              </button>
              <button class="btn btn-sm btn-outline-danger">
                Xoá
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- MODAL ADD -->
    <div class="modal fade" id="modalAdd" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Thêm loại phòng</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Tên loại phòng</label>
                <input class="form-control" placeholder="VD: Deluxe" />
              </div>

              <div class="col-md-6">
                <label class="form-label">Giá phòng</label>
                <input type="number" class="form-control" placeholder="VD: 500000" />
              </div>

              <div class="col-md-6">
                <label class="form-label">Số người tối đa</label>
                <input type="number" class="form-control" placeholder="VD: 2" />
              </div>

              <div class="col-md-6">
                <label class="form-label">Mô tả</label>
                <input class="form-control" placeholder="Mô tả ngắn..." />
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Huỷ</button>
            <button class="btn btn-success">Lưu</button>
          </div>

        </div>
      </div>
    </div>

    <!-- MODAL EDIT -->
    <div class="modal fade" id="modalEdit" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Sửa loại phòng</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Tên loại phòng</label>
                <input class="form-control" value="Standard" />
              </div>

              <div class="col-md-6">
                <label class="form-label">Giá phòng</label>
                <input type="number" class="form-control" value="400000" />
              </div>

              <div class="col-md-6">
                <label class="form-label">Số người tối đa</label>
                <input type="number" class="form-control" value="2" />
              </div>

              <div class="col-md-6">
                <label class="form-label">Mô tả</label>
                <input class="form-control" value="Phòng tiêu chuẩn" />
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Huỷ</button>
            <button class="btn btn-primary">Lưu thay đổi</button>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.loai-phong-card {
  border-radius: 14px;
  transition: all 0.25s ease;
}

.loai-phong-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
</style>
