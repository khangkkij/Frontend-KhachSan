import { createRouter, createWebHistory } from 'vue-router'

// 1. Import Layout
import Layout from '@/DuanKhachSan/KhachHang/Layout.vue'

// 2. Import các trang con Khách hàng
import TrangChu from '@/DuanKhachSan/KhachHang/TrangChu.vue'
import DangNhap from '@/DuanKhachSan/KhachHang/DangNhap.vue'
import DangKy from '@/DuanKhachSan/KhachHang/DangKy.vue'
import QuenMatKhau from '@/DuanKhachSan/KhachHang/QuenMatKhau.vue'
import XacNhanOTP from '@/DuanKhachSan/KhachHang/XacNhanOTP.vue'
import DanhSachPhong from '@/DuanKhachSan/KhachHang/DanhSachPhong.vue'
import ChiTietPhong from '@/DuanKhachSan/KhachHang/ChiTietPhong.vue'
import DatPhong from '@/DuanKhachSan/KhachHang/DatPhong.vue'
import ThanhToan from '@/DuanKhachSan/KhachHang/ThanhToan.vue'
import XacNhanDatPhong from '@/DuanKhachSan/KhachHang/XacNhanDatPhong.vue'
import HoSo from '@/DuanKhachSan/KhachHang/Profile/HoSo.vue'
import DonHang from '@/DuanKhachSan/KhachHang/Profile/DonHang.vue'
import ChiTietDonHang from '@/DuanKhachSan/KhachHang/Profile/ChiTietDonHang.vue'
import Voucher from '@/DuanKhachSan/KhachHang/Profile/Voucher.vue'
import PhongDaLuu from '@/DuanKhachSan/KhachHang/Profile/PhongDaLuu.vue'
import voucher from '@/DuanKhachSan/KhachHang/voucher.vue'
import ProfileSidebar from '@/DuanKhachSan/KhachHang/Profile/ProfileSidebar.vue'
import XacThucGamil from '@/DuanKhachSan/KhachHang/XacThucGamil.vue'
import LichSuDanhGia from  '@/DuanKhachSan/KhachHang/Profile/LichSuDanhGia.vue'

// 3. Import Admin
import LayoutAdmin from '@/DuanKhachSan/Admin/LayoutAdmin.vue'
import Dashboard from '@/DuanKhachSan/Admin/Dashboard.vue'
import QuanLyDanhMuc from '@/DuanKhachSan/Admin/QuanLyDanhMuc.vue'
import QuanLyPhong from '@/DuanKhachSan/Admin/QuanLyPhong.vue'
import QuanLyVoucher from '@/DuanKhachSan/Admin/QuanLyVoucher.vue'
import QuanLyNhanSu from '@/DuanKhachSan/Admin/QuanLyNhanSu.vue'
import QuanLyDichVu from '@/DuanKhachSan/Admin/QuanLyDichVu.vue'
import QuanLyKhachHang from '@/DuanKhachSan/Admin/QuanLyKhachHang.vue'
import QuanLyHoaDon from '@/DuanKhachSan/Admin/QuanLyHoaDon.vue'
import CheckIn from '@/DuanKhachSan/Admin/CheckIn.vue'
import CheckOut from '@/DuanKhachSan/Admin/CheckOut.vue'
//4. Import NhanVien
import LayoutNhanVien from '@/DuanKhachSan/NhanVien/LayoutNhanVien.vue';
import DashboardNhanVien from '@/DuanKhachSan/NhanVien/Views/Dashboard.vue';
import RoomManager from '@/DuanKhachSan/NhanVien/Views/RoomManager.vue';
import ServiceManager from '@/DuanKhachSan/NhanVien/Views/ServiceManager.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- ROUTE KHÁCH HÀNG ---
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', name: 'home', component: TrangChu },
        { path: 'dang-nhap', name: 'login', component: DangNhap },
        { path: 'dang-ky', name: 'register', component: DangKy },
        { path: 'quen-mat-khau', name: 'forgot-password', component: QuenMatKhau },
        { path: 'xac-nhan-otp', name: 'verify-otp', component: XacNhanOTP },
        { path: 'danh-sach-phong', name: 'room-list', component: DanhSachPhong },
        { path: 'phong/:id', name: 'room-detail', component: ChiTietPhong },
        { path: 'booking', name: 'booking', component: DatPhong },
        { path: 'payment', name: 'payment', component: ThanhToan },
        { path: 'xac-nhan-dat-phong', name: 'confirm-booking', component: XacNhanDatPhong },
        { path: 'voucher', name: 'voucher', component: voucher },
        { path: 'xac-thuc-gmail', name: 'XacThucGamil', component: XacThucGamil },
        { path: 'lich-su-danh-gia', name: 'review-history', component: LichSuDanhGia },
        // Profile Routes
        { path: 'ProfileSidebar', name: 'ProfileSidebar', component: ProfileSidebar },
        { path: 'profile', name: 'profile', component: HoSo },
        { path: 'history', name: 'order-history', component: DonHang },
        { path: 'order-detail/:id', name: 'order-detail', component: ChiTietDonHang },
        { path: 'my-voucher', name: 'my-voucher', component: Voucher },
        { path: 'saved', name: 'saved-rooms', component: PhongDaLuu }
      ]
    }, // <--- Dấu phẩy ngăn cách giữa object Khách Hàng và Admin

    // --- ROUTE ADMIN (Phải nằm trong mảng routes) ---
    {
      path: '/admin',
      component: LayoutAdmin,
      children: [
        {
          path: '', // Mặc định vào /admin hiện Dashboard
          name: 'admin-dashboard',
          component: Dashboard // Dùng biến Dashboard đã import ở trên
        },
        // Thêm các route con khác của admin ở đây nếu có
        {
          path: 'loai-phong', // Đường dẫn sẽ là /admin/loai-phong
          name: 'admin-loai-phong',
          component: QuanLyDanhMuc
        },
        {
          path: 'phong', // Đường dẫn sẽ là: /admin/phong
          name: 'admin-phong',
          component: QuanLyPhong
        }, {
          path: 'voucher',
          name: 'admin-voucher',
          component: QuanLyVoucher
        },
        {
          path: 'nhan-su',
          name: 'admin-nhan-su',
          component: QuanLyNhanSu
        },
        {
          path: 'dich-vu',
          name: 'admin-dich-vu',
          component: QuanLyDichVu
        },
        {
          path: 'khach-hang',
          name: 'admin-khach-hang',
          component: QuanLyKhachHang
        },
        {
          path: 'hoa-don',
          name: 'admin-hoa-don',
          component: QuanLyHoaDon
        },
        {
          path: 'check-in',
          name: 'admin-check-in',
          component: CheckIn
        },
        {
          path: 'check-out',
          name: 'admin-check-out',
          component: CheckOut
        }
      ]
    },
    // --- ROUTE NHÂN VIÊN (Phải nằm trong mảng routes) ---
    {
    path: '/NhanVien',
    component: LayoutNhanVien, // Sử dụng layout riêng cho nhân viên
    children: [
      { path: 'dashboard', component: DashboardNhanVien },
      { path: 'room-manager', component: RoomManager },
      { path: 'service-manager', component: ServiceManager },
      { path: 'user-manager', component: QuanLyKhachHang}
    ]
  }
  ]
})

export default router