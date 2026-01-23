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
import HoSo from '@/DuanKhachSan/KhachHang/Profile/HoSo.vue'
import DonHang from '@/DuanKhachSan/KhachHang/Profile/DonHang.vue'
import ChiTietDonHang from '@/DuanKhachSan/KhachHang/Profile/ChiTietDonHang.vue'
import Voucher from '@/DuanKhachSan/KhachHang/Profile/Voucher.vue'
import PhongDaLuu from '@/DuanKhachSan/KhachHang/Profile/PhongDaLuu.vue'
import voucher from '@/DuanKhachSan/KhachHang/voucher.vue'
// 3. Import Admin
import LayoutAdmin from '@/DuanKhachSan/Admin/LayoutAdmin.vue'
import Dashboard from '@/DuanKhachSan/Admin/Dashboard.vue'
import QuanLyDanhMuc from '@/DuanKhachSan/Admin/QuanLyDanhMuc.vue'
import QuanLyPhong from '@/DuanKhachSan/Admin/QuanLyPhong.vue'
import QuanLyVoucher from '@/DuanKhachSan/Admin/QuanLyVoucher.vue'
//4. Import NhanVien
import ReceptionLayout from '@/DuanKhachSan/NhanVien/Views/ReceptionLayout.vue'
import RoomManager from '@/DuanKhachSan/NhanVien/Views/reception/RoomManager.vue'
import ServiceManager from '@/DuanKhachSan/NhanVien/Views/reception/ServiceManager.vue'
import DashboardHome from '@/DuanKhachSan/NhanVien/Views/reception/ReceptionDashboard.vue'

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
        { path: 'voucher', name: 'voucher', component: voucher },
        // Profile Routes
        { path: 'profile', name: 'profile', component: HoSo },
        { path: 'history', name: 'order-history', component: DonHang },
        { path: 'order-detail/:id', name: 'order-detail', component: ChiTietDonHang },
        { path: 'voucher', name: 'my-voucher', component: Voucher },
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
        }
      ]
    },
    // --- ROUTE NHÂN VIÊN (Phải nằm trong mảng routes) ---
    {
    path: '/NhanVien',
    component: ReceptionLayout, // Load cái khung sườn riêng này
    children: [
      {
        path: '', // Mặc định vào /reception sẽ hiện trang này
        name: 'ReceptionDashboard',
        component: DashboardHome 
      },
      {
        path: 'rooms', // Đường dẫn: /reception/rooms
        name: 'RoomManager',
        component: RoomManager
      },
      {
        path: 'services', // Đường dẫn: /reception/services
        name: 'ServiceManager',
        component: ServiceManager
      }
    ]
  }
  ]
})

export default router