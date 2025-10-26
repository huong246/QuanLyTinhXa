# Bài tập: Quản lý Danh mục Tỉnh/Xã

## Mục tiêu

Xây dựng ứng dụng RESTful API để quản lý danh mục địa giới hành chính Việt Nam bao gồm: Tỉnh/Thành phố và Xã/Phường/Thị trấn.
(Chưa cần đăng nhập/ phân quyền nhé)

## Yêu cầu chức năng

### 1. Quản lý Tỉnh
- Thêm mới tỉnh/thành phố
- Cập nhật thông tin tỉnh/thành phố
- Xóa tỉnh/thành phố (Kiểm tra mã đã dùng cho xã nào chưa)
- Tìm kiếm tỉnh/thành phố (phân trang)
    + Có trường text - search theo like code hoặc name
- Lấy chi tiết một tỉnh/thành phố theo ID


- Yêu cầu validate:
 + Mã không trùng

### 2. Quản lý Xã
- Thêm mới xã/phường/thị trấn (phải thuộc một tỉnh)
- Cập nhật thông tin xã/phường/thị trấn
- Xóa xã/phường/thị trấn
- Lấy danh sách xã/phường/thị trấn theo tỉnh (mã tỉnh)
- Tìm kiếm xã/phường/thị trấn (phân trang).
    + Có trường text - search theo like code hoặc name
    + Có trường provinceCode để tìm kiếm theo mã tỉnh

- Yêu cầu validate:
 + Mã không trùng
## Cấu trúc Database

### Bảng: provinces (Tỉnh/Thành phố)
```sql
id          
code        
name      
```

### Bảng: wards (Xã/Phường/Thị trấn)
```sql
id          
code        
name   
provinceCode 
```