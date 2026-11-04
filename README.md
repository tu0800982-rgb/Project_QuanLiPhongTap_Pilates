# PILATES STUDIO MANAGEMENT SYSTEM · NHÓM 8

Frontend React + TypeScript + Vite cho hệ thống quản lý Pilates Studio. Dự án dùng Mock Data theo Repository Pattern, sẵn điểm thay thế bằng REST API Spring Boot.

## Chạy trong VS Code

```powershell
npm.cmd install
npm.cmd run dev
```

Mở địa chỉ Vite hiển thị trong Terminal (mặc định `http://localhost:5173`).

Tài khoản demo (mật khẩu chung: `123456`): `admin@pilates.com`, `staff@pilates.com`, `trainer@pilates.com`, `member@pilates.com`.

## Cấu hình API

Sao chép `.env.example` thành `.env`. Hiện tại `VITE_DATA_MODE=mock`; khi làm Spring Boot, thay MockRepository bằng ApiRepository gọi `VITE_API_BASE_URL`.
