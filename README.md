# TodoList

Ứng dụng quản lý công việc `TodoList` gồm 2 phần:

- `todo-backend`: Spring Boot API kết nối MySQL.
- `todo-frontend`: giao diện React + Vite.

## Yêu cầu môi trường

- Docker Desktop hoặc Docker Engine có hỗ trợ `docker compose`.
- JDK 21.
- Node.js 18+ hoặc 20+.

## Cấu trúc dự án

- `todo-backend/`: backend Spring Boot.
- `todo-frontend/`: frontend React.
- `todo-backend/docker-compose.yml`: file khởi tạo MySQL local.

## 1. Khởi tạo MySQL bằng Docker Compose

Mở terminal tại thư mục `todo-backend` rồi chạy:

```bash
docker compose up -d
```

Container MySQL sẽ được tạo với cấu hình:

- Host: `localhost`
- Port: `3316`
- Database: `todo_db`
- Username: `root`
- Password: `root123`

Nếu muốn dừng và xóa container:

```bash
docker compose down
```

## 2. Chạy backend

Mở terminal tại thư mục `todo-backend` rồi chạy:

```bash
./mvnw spring-boot:run
```

Trên Windows, dùng:

```bash
mvnw.cmd spring-boot:run
```

Backend mặc định chạy tại:

- `http://localhost:8080`

Bạn có thể đổi cấu hình trong file `todo-backend/src/main/resources/application.yaml` nếu cần.

## 3. Chạy frontend

Mở terminal tại thư mục `todo-frontend` rồi cài dependency và chạy dev server:

```bash
npm install
npm run dev
```

Frontend mặc định chạy tại:

- `http://localhost:5173`

Nếu muốn đổi địa chỉ backend, đặt biến môi trường `VITE_API_BASE_URL`. Mặc định frontend sẽ gọi về `http://localhost:8080`.

## 4. Luồng chạy đề xuất

1. Khởi động Docker MySQL.
2. Chạy backend Spring Boot.
3. Chạy frontend React.
4. Mở trình duyệt tại `http://localhost:5173`.

## 5. Chức năng của ứng dụng

Ứng dụng hỗ trợ các chức năng chính sau:

- Tạo công việc mới với tiêu đề và mô tả.
- Chỉnh sửa công việc, bao gồm cập nhật trạng thái.
- Xóa công việc.
- Đánh dấu công việc đã hoàn thành hoặc chưa hoàn thành.
- Tìm kiếm theo từ khóa trong tiêu đề
- Lọc theo trạng thái `PENDING` hoặc `COMPLETED`.
- Sắp xếp
- Phân trang

## 6. API chính

Backend cung cấp các endpoint chính dưới tiền tố `/api/v1/todos`:

- `GET /api/v1/todos`: lấy danh sách công việc, hỗ trợ `keyword`, `status`, `page`, `pageSize`, `sortBy`, `sortDirection`.
- `POST /api/v1/todos`: tạo công việc mới.
- `PUT /api/v1/todos/{id}`: cập nhật công việc.
- `PATCH /api/v1/todos/{id}/status`: đổi trạng thái công việc.
- `DELETE /api/v1/todos/{id}`: xóa công việc.

## 7. Cấu trúc phản hồi

Backend trả dữ liệu theo dạng wrapper `ApiResponse`, và frontend sẽ tự động lấy phần `data` khi request thành công.

## 8. Ghi chú nhanh

- MySQL mặc định sử dụng port `3316` trên máy local để tránh trùng với MySQL đang chạy sẵn.
- CORS đã được cấu hình để frontend ở `http://localhost:5173` có thể gọi API backend.