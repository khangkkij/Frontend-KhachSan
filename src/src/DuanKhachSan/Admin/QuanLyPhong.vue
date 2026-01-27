<template>
  <div class="container-xxl flex-grow-1 container-p-y">
              <div class="row">
                <!-- Tìm kiếm, bộ lọc -->
                <div class="mb-4 order-0" style="width: 29.5rem;">
                  <div class="card">
                    <div class="d-flex align-items-end row">
                      <div class="col-sm-7">
                        <div class="card-body">
                            <!-- Search -->
                            <div class="navbar-nav align-items-center">
                                <div class="nav-item d-flex align-items-center">
                                <i class="bx bx-search fs-4 lh-0"></i>
                                <input
                                    type="text"
                                    class="form-control border-0 shadow-none"
                                    placeholder="Search..."
                                    aria-label="Search..."
                                />
                                </div>
                            </div>
                            <!-- /Search -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Bộ lọc -->
                 <div class="mb-4 order-0" style="width:43.5%">
                  <div class="card">
                        <div class="card-body">
                        <div>
                            <div class="btn-group pe-3">
                                <button
                                    type="button"
                                    class="btn btn-outline-primary dropdown-toggle btn-fixed"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Trạng thái
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="javascript:void(0);">Action</a></li>
                                    <li><a class="dropdown-item" href="javascript:void(0);">Another action</a></li>
                                    <li><a class="dropdown-item" href="javascript:void(0);">Something else here</a></li>
                                    <li>
                                    <hr class="dropdown-divider" />
                                    </li>
                                    <li><a class="dropdown-item" href="javascript:void(0);">Separated link</a></li>
                                </ul>
                            </div>

                            <div class="btn-group pe-3">
                                <button
                                    type="button"
                                    class="btn btn-outline-secondary dropdown-toggle btn-fixed"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Loại phòng
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="javascript:void(0);">Action</a></li>
                                    <li><a class="dropdown-item" href="javascript:void(0);">Another action</a></li>
                                    <li><a class="dropdown-item" href="javascript:void(0);">Something else here</a></li>
                                    <li>
                                    <hr class="dropdown-divider" />
                                    </li>
                                    <li><a class="dropdown-item" href="javascript:void(0);">Separated link</a></li>
                                </ul>
                            </div>

                            <div class="btn-group">
                                <button
                                    type="button"
                                    class="btn btn-outline-info dropdown-toggle btn-fixed"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Giá
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="javascript:void(0);">Action</a></li>
                                    <li><a class="dropdown-item" href="javascript:void(0);">Another action</a></li>
                                    <li><a class="dropdown-item" href="javascript:void(0);">Something else here</a></li>
                                    <li>
                                    <hr class="dropdown-divider" />
                                    </li>
                                    <li><a class="dropdown-item" href="javascript:void(0);">Separated link</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
                <div class="card d-flex justify-content-center align-items-center" style="width: 12rem;height: 3.7rem; margin-left: 0.9rem;">
                  <button type="button" class="btn btn-success " data-bs-toggle="modal" data-bs-target="#createRoomModal">Tạo phòng mới</button>
                </div>
                <!-- Phòng -->
                <div class="card me" style="width: 23.5%; margin-left:1rem; height: 17%; margin-top: 1rem;">
                  <img src=""
                      class="card-img-top card-img-room"
                      style="height:120px; object-fit:cover;">

                  <div class="card-room">
                    <h6 class="mb-1">Phòng 101</h6>
                    <small class="text-muted">Deluxe</small>

                    <div class="mt-1">
                      <span class="badge bg-success">Trống</span>
                    </div>

                    <div class="mt-1 fw-semibold text-primary">
                      650.000đ / đêm
                    </div>
                  </div>

                  <div class="d-flex justify-content-between p-1">
                    <button class="btn btn-sm btn-outline-info"data-bs-target="#roomDetailModal" data-bs-toggle="modal">Chi tiết</button>
                    <button class="btn btn-sm btn-outline-warning" data-bs-target="#editRoomModal" data-bs-toggle="modal">Sửa</button>
                  </div>
                </div>
                <!-- Modal Tạo phòng -->
                <div class="modal fade" id="createRoomModal" tabindex="-1">
                  <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">

                      <!-- Header -->
                      <div class="modal-header">
                        <h5 class="modal-title">Tạo phòng mới</h5>
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                      </div>

                      <!-- Body -->
                      <div class="modal-body">
                        <form>

                          <div class="row g-3">

                            <!-- Số phòng -->
                            <div class="col-md-6">
                              <label class="form-label">Số phòng</label>
                              <input type="number" class="form-control" placeholder="VD: 101">
                            </div>

                            <!-- Loại phòng -->
                            <div class="col-md-6">
                              <label class="form-label">Loại phòng</label>
                              <select class="form-select">
                                <option selected disabled>-- Chọn loại phòng --</option>
                                <option value="1">Standard</option>
                                <option value="2">Deluxe</option>
                                <option value="3">VIP</option>
                              </select>
                            </div>

                            <!-- Giá phòng (readonly) -->
                            <div class="col-md-6">
                              <label class="form-label">Giá phòng</label>
                              <input type="text" class="form-control" value="650.000" readonly>
                            </div>

                            <!-- Số người tối đa (readonly) -->
                            <div class="col-md-6">
                              <label class="form-label">Số người tối đa</label>
                              <input type="text" class="form-control" value="2 người" readonly>
                            </div>

                            <!-- Phần trăm giảm -->
                            <div class="col-md-6">
                              <label class="form-label">Giảm giá (%)</label>
                              <input type="number" class="form-control" placeholder="VD: 10">
                            </div>

                            <!-- Trạng thái -->
                            <div class="col-md-6">
                              <label class="form-label">Trạng thái</label>
                              <select class="form-select">
                                <option value="true">Hoạt động</option>
                                <option value="false">Ngưng sử dụng</option>
                              </select>
                            </div>

                          </div>

                        </form>
                      </div>

                      <!-- Footer -->
                      <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Huỷ</button>
                        <button class="btn btn-success">Lưu phòng</button>
                      </div>

                    </div>
                  </div>
                </div>


                <!-- Modal sửa phòng -->
                 <div class="modal fade" id="editRoomModal" tabindex="-1">
                  <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">

                      <!-- Header -->
                      <div class="modal-header">
                        <h5 class="modal-title">Sửa thông tin phòng</h5>
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                      </div>

                      <!-- Body -->
                      <div class="modal-body">
                        <form id="editRoomForm">

                          <!-- MaPhong (hidden) -->
                          <input type="hidden" id="editMaPhong">

                          <div class="row g-3">

                            <!-- Số phòng (readonly) -->
                            <div class="col-md-6">
                              <label class="form-label">Số phòng</label>
                              <input type="number" class="form-control" id="editSoPhong" readonly>
                            </div>

                            <!-- Loại phòng -->
                            <div class="col-md-6">
                              <label class="form-label">Loại phòng</label>
                              <select class="form-select" id="editMaLoaiPhong">
                                <option value="1">Standard</option>
                                <option value="2">Deluxe</option>
                                <option value="3">VIP</option>
                              </select>
                            </div>

                            <!-- Giá phòng (readonly - từ loại phòng) -->
                            <div class="col-md-6">
                              <label class="form-label">Giá phòng</label>
                              <input type="text" class="form-control" id="editGiaPhong" readonly>
                            </div>

                            <!-- Số người tối đa (readonly) -->
                            <div class="col-md-6">
                              <label class="form-label">Số người tối đa</label>
                              <input type="text" class="form-control" id="editSoNguoi" readonly>
                            </div>

                            <!-- Phần trăm giảm -->
                            <div class="col-md-6">
                              <label class="form-label">Giảm giá (%)</label>
                              <input type="number" class="form-control" id="editPhanTramGiam">
                            </div>

                            <!-- Trạng thái -->
                            <div class="col-md-6">
                              <label class="form-label">Trạng thái</label>
                              <select class="form-select" id="editTrangThai">
                                <option value="true">Hoạt động</option>
                                <option value="false">Ngưng sử dụng</option>
                              </select>
                            </div>

                          </div>
                        </form>
                      </div>

                      <!-- Footer -->
                      <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Huỷ</button>
                        <button class="btn btn-primary" onclick="saveEditRoom()">Lưu thay đổi</button>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Modal xem chi tiết -->
                 <div class="modal fade" id="roomDetailModal" tabindex="-1">
                  <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">

                      <!-- Header -->
                      <div class="modal-header">
                        <h5 class="modal-title">Chi tiết phòng</h5>
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                      </div>

                      <!-- Body -->
                      <div class="modal-body">
                        <div class="row g-4">

                          <!-- LEFT: CHI TIẾT PHÒNG -->
                          <div class="col-md-6 border-end">
                            <h6 class="fw-bold mb-3">Thông tin phòng</h6>

                            <div class="mb-2"><strong>Số phòng:</strong> 101</div>
                            <div class="mb-2"><strong>Loại phòng:</strong> Deluxe</div>
                            <div class="mb-2"><strong>Giá:</strong> 650.000đ / đêm</div>
                            <div class="mb-2"><strong>Số người tối đa:</strong> 2</div>
                            <div class="mb-2">
                              <strong>Trạng thái:</strong>
                              <span class="badge bg-danger">Đang thuê</span>
                            </div>
                            <div class="mb-2">
                              <strong>Giảm giá:</strong> 10%
                            </div>
                            <div class="mt-3">
                              <strong>Mô tả:</strong>
                              <p class="text-muted mb-0">
                                View ban công, gần thang máy
                              </p>
                            </div>
                          </div>

                          <!-- RIGHT: THÔNG TIN KHÁCH -->
                          <div class="col-md-6">
                            <h6 class="fw-bold mb-3">Khách hàng đang sử dụng</h6>

                            <!-- Avatar -->
                            <div class="d-flex align-items-center mb-3">
                              <img src="" class="rounded-circle me-3"
                                  style="width:64px;height:64px;object-fit:cover;">
                              <div>
                                <div class="fw-semibold">Nguyễn Văn A</div>
                                <small class="text-muted">Khách đang ở</small>
                              </div>
                            </div>

                            <div class="mb-2"><strong>Giới tính:</strong> Nam</div>
                            <div class="mb-2"><strong>Ngày sinh:</strong> 01/01/1998</div>
                            <div class="mb-2"><strong>CCCD:</strong> 012345678901</div>
                            <div class="mb-2"><strong>SĐT:</strong> 0909 123 456</div>
                            <div class="mb-2"><strong>Email:</strong> a@gmail.com</div>
                            <div class="mb-2"><strong>Địa chỉ:</strong> TP.HCM</div>

                            <div class="mt-3">
                              <span class="badge bg-success">Đang hoạt động</span>
                            </div>
                          </div>

                        </div>
                      </div>

                      <!-- Footer -->
                      <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
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
                      <li class="page-item first">
                        <a class="page-link" href="javascript:void(0);"
                          ><i class="tf-icon bx bx-chevrons-left"></i
                        ></a>
                      </li>
                      <li class="page-item prev">
                        <a class="page-link" href="javascript:void(0);"
                          ><i class="tf-icon bx bx-chevron-left"></i
                        ></a>
                      </li>
                      <li class="page-item">
                        <a class="page-link" href="javascript:void(0);">1</a>
                      </li>
                      <li class="page-item">
                        <a class="page-link" href="javascript:void(0);">2</a>
                      </li>
                      <li class="page-item active">
                        <a class="page-link" href="javascript:void(0);">3</a>
                      </li>
                      <li class="page-item">
                        <a class="page-link" href="javascript:void(0);">4</a>
                      </li>
                      <li class="page-item">
                        <a class="page-link" href="javascript:void(0);">5</a>
                      </li>
                      <li class="page-item next">
                        <a class="page-link" href="javascript:void(0);"
                          ><i class="tf-icon bx bx-chevron-right"></i
                        ></a>
                      </li>
                      <li class="page-item last">
                        <a class="page-link" href="javascript:void(0);"
                          ><i class="tf-icon bx bx-chevrons-right"></i
                        ></a>
                      </li>
                    </ul>
                  </nav>
                  <!--/ Basic Pagination -->
                </div>
            <!-- / Content -->

            <!-- Footer -->
        
            <!-- / Footer -->

            <div class="content-backdrop fade"></div>
          </div>
          <!-- Content wrapper -->
        </div>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.card-body{
  padding: 0.75rem 1.5rem;
  padding-right: 0.2rem;
}
.btn-fixed {
    width: 140px;     /* cố định ngang */
    height: 36px;     /* cố định dọc */
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.card-room{
  padding-top: 0.5rem;
  padding-left: 0.5rem;
}
.card-img-room{
  margin-top: 0.5rem;
}
.me {
  transition: all 0.25s ease;
  border-radius: 14px;
  cursor: pointer;
}

.me:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
}

</style>
