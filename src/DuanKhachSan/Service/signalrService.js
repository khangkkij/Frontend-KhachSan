
import * as signalR from '@microsoft/signalr';

class SignalRService {
    constructor() {
        this.connection = null;
        this.callbacks = []; // Lưu trữ các hàm khi có sự kiện mới
    }

    startConnection() {
        if (this.connection) return; // Đã có kết nối rồi, không tạo lại

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_API_URL}/hotelHub`)
            .withAutomaticReconnect()
            .build();

        // Cấu hình lắng nghe sự kiện từ Backend
        this.connection.on("reload_Service", () => {
            console.log(" [SignalR Global] Có cập nhật! Đang báo cho các màn hình...");

            this.callbacks.forEach(cb => cb());
        });

        this.connection.start()
            .then(() => console.log(" [SignalR Global] Đã kết nối thành công!"))
            .catch(err => console.error(" [SignalR Global] Lỗi: ", err));
    }

    // các file .vue gọi vào để "đăng ký" được lắng nghe
    registerListener(callback) {
        this.callbacks.push(callback);
    }

    // các file .vue gọi vào để "hủy đăng ký" khi chuyển trang
    removeListener(callback) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }
}

// Xất ra 1 object duy nhất 
export default new SignalRService();