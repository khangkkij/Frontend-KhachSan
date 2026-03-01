
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 
import'./notify.css'; // Import custom CSS
// Khởi tạo Notyf với config cũ của bạn
const notyf = new Notyf({
    duration: 3200,
    position: {
        x: 'right',
        y: 'top'
    },
    ripple: false,
    dismissible: false,
    types: [
        {
            type: 'success',
            background: '#fff',
            className: 'lux-success'
        },
        {
            type: 'error',
            background: '#fff',
            className: 'lux-error'
        },
        {
            type: 'info',
            background: '#fff',
            className: 'lux-info'
        }
    ]
});

// Hàm nội bộ để render HTML y hệt như cũ
function luxNotify(title, message, type = 'info') {
    notyf.open({
        type,
        message: `
            <div class="lux-notify-content" style="padding:8px 12px;">
                <div style="
                    font-size:11px;
                    letter-spacing:.6px;
                    text-transform:uppercase;
                    color:#999;
                    margin-bottom:2px;
                ">
                </div>
                <div style="
                    font-family:Georgia,serif;
                    font-size:13.5px;
                    color:${type === 'error' ? '#b24a4a' : '#c9a24d'};
                    margin-bottom:4px;
                ">
                    ${title}
                </div>
                <div>${message}</div>
            </div>

        `
    });
}

// Export default object để api.js sử dụng trực tiếp (notify.error, notify.success)
export default {
    success: (message) => {
        luxNotify('Success', message, 'success');
    },
    error: (message) => {
        luxNotify('Error', message, 'error');
    },
    info: (message) => {
        luxNotify('Notice', message, 'info');
    }
};