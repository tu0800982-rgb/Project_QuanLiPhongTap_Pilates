# Repository boundary

UI chỉ gọi đối tượng repository. Hiện `mockRepository.ts` cung cấp dữ liệu trong bộ nhớ. Khi Backend Spring Boot sẵn sàng, tạo `apiRepository.ts` với cùng chữ ký phương thức, gọi `apiClient`, sau đó chọn implementation theo `VITE_DATA_MODE`. Nhờ vậy Component không phụ thuộc Axios hay endpoint cụ thể.
