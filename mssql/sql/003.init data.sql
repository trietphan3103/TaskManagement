use CSDLPT

INSERT INTO PHONG_BAN (ten_phong, mo_ta) VALUES
(N'Phòng giám đốc', N'Phòng mặc định cho người dùng có quyền Giám đốc'),
(N'Phòng CNTT', N'Phòng thực hiện các hạng mục công nghệ thông tin'),
(N'Phòng nhân sự', N'Phòng quản lý các thông tin về nhân viên'),
(N'Phòng kế toán', N'Phòng thực hiện các công việc liên quan tới tính toán')

-- USERS --
INSERT INTO USERS (user_name, password, user_role, ho_ten, gioi_tinh, ngay_sinh, sdt, anh_dai_dien, active, so_absence_max, phong_ban_id, status) VALUES
('admin', '$2b$10$L6xCjrkSg544GekclkOWSuHeE2QGjcAW7alzdwGcIIRFEurYUxZKq', 'Director', 'admin', 'Male', '12/19/2000', '0915634258', NULL, 1, NULL, 1, 0)

INSERT INTO USERS (user_name, password, user_role, ho_ten, gioi_tinh, ngay_sinh, sdt, anh_dai_dien, active, so_absence_max, phong_ban_id, status) VALUES
('minhtriet', '$2b$10$/rz4CjED6gi.utMLXhiilO39Jm5ZS7Jl/YqsXNNpkRE3v7EDV3H..', 'Employee', N'Phan Minh Triết', 'Male', '03/31/2001', '0969782633', NULL, 1, 15, 2, 1)

INSERT INTO USERS (user_name, password, user_role, ho_ten, gioi_tinh, ngay_sinh, sdt, anh_dai_dien, active, so_absence_max, phong_ban_id, status) VALUES
('dangtri', '$2b$10$mnIxKxD9cAWmxyGQKxo1o.RSb/ZoOSfT4Sanyx6.YCFmXsR8k/sMK', 'Employee', N'Đặng Đăng Trí', 'Male', '11/29/2001', '0915478422', NULL, 1, 15, 3, 1)

INSERT INTO USERS (user_name, password, user_role, ho_ten, gioi_tinh, ngay_sinh, sdt, anh_dai_dien, active, so_absence_max, phong_ban_id, status) VALUES
('thanghy', '$2b$10$YULKLl1jkGBXyG9wKJ6l1e2Z98m9.VwF.MmngbimmH1afMrYgx40a', 'Employee', N'Xin Thăng Hỷ', 'Female', '02/28/2001', '0938126455', NULL, 1, 15, 4, 1)

INSERT INTO USERS (user_name, password, user_role, ho_ten, gioi_tinh, ngay_sinh, sdt, anh_dai_dien, active, so_absence_max, phong_ban_id, status) VALUES
('giangdien', '$2b$10$2Jd09Vtcpac0pvJWuQe/Xeqcon6JRkHrmgj7S2ACkjGA0j2K5GOJ.', 'Employee', N'Trương Giang Diễn', 'Male', '11/14/2001', '0981033100', '/images/user_avt/5/avatar.jpg', 1, 12, 2, 0)

INSERT INTO USERS (user_name, password, user_role, ho_ten, gioi_tinh, ngay_sinh, sdt, anh_dai_dien, active, so_absence_max, phong_ban_id, status) VALUES
('ngocanh', '$2b$10$tl2EpU6tyWHD3HxXhmqkUe2SnhfujvOXbbZbp4DZIeHyIy8dM.5cS', 'Employee', N'Hoàng Thị Ngọc Anh', 'Female', '10/08/2001', '0191435077', '/images/user_avt/6/avatar.jpg', 1, 12, 2, 0)

INSERT INTO USERS (user_name, password, user_role, ho_ten, gioi_tinh, ngay_sinh, sdt, anh_dai_dien, active, so_absence_max, phong_ban_id, status) VALUES
('vantung', '$2b$10$ba0lZts7MYAkeGDUk.WqyOZ7mGQjOrYT0DSQ8ekwNmAo6e6UyjThS', 'Employee', N'Lê Văn Tùng', 'Male', '06/06/2001', '0909714532', '/images/user_avt/7/avatar.jpg', 1, 12, 2, 0)

INSERT INTO USERS (user_name, password, user_role, ho_ten, gioi_tinh, ngay_sinh, sdt, anh_dai_dien, active, so_absence_max, phong_ban_id, status) VALUES
('hoaibao', '$2b$10$vErnYZ2ZVrMS/ArwgAR65.VBvaMcoOOsfdaPSdptr3dmfPW9uB2bG', 'Employee', N'Trần Hoài Bảo', 'Male', '10/03/2001', '0985840366', '/images/user_avt/8/avatar.jpg', 1, 12, 3, 0)

INSERT INTO USERS (user_name, password, user_role, ho_ten, gioi_tinh, ngay_sinh, sdt, anh_dai_dien, active, so_absence_max, phong_ban_id, status) VALUES
('baothai', '$2b$10$XdLwusNUOWyospU1hmz.zetPssqo0/ixggSrjIiWKqp5o3nu5ok9W', 'Employee', N'Nguyễn Bảo Thái', 'Male', '08/27/2001', '0962004072', '/images/user_avt/9/avatar.jpg', 1, 12, 3, 0)

INSERT INTO USERS (user_name, password, user_role, ho_ten, gioi_tinh, ngay_sinh, sdt, anh_dai_dien, active, so_absence_max, phong_ban_id, status) VALUES
('khanhhuyen', '$2b$10$0Td2VmvS2UNWwT40r5EYEupXyzBRBkUWyvCuKWFHNY/bjIlDvh7R.', 'Employee', N'Lê Thị Khánh Huyền', 'Female', '09/12/2001', '0937626140', '/images/user_avt/10/avatar.jpg', 1, 12, 3, 0)

INSERT INTO USERS (user_name, password, user_role, ho_ten, gioi_tinh, ngay_sinh, sdt, anh_dai_dien, active, so_absence_max, phong_ban_id, status) VALUES
('minhcuong', '$2b$10$L6xCjrkSg544GekclkOWSuHeE2QGjcAW7alzdwGcIIRFEurYUxZKq', 'Employee', N'Đoàn Minh Cường', 'Male', '07/19/2001', '0788159438', '/images/user_avt/11/avatar.jpg', 1, 12, 4, 0)

INSERT INTO USERS (user_name, password, user_role, ho_ten, gioi_tinh, ngay_sinh, sdt, anh_dai_dien, active, so_absence_max, phong_ban_id, status) VALUES
('thuthao', '$2b$10$3tqLAmsZC0I06I1KX6/iyuALyuTqyGIFWRDh9lpu9HsQaDidjWfma', 'Employee', N'Phạm Thị Thu Thảo', 'Female', '08/09/2001', '0932141589', '/images/user_avt/12/avatar.jpg', 1, 12, 4, 0)

INSERT INTO USERS (user_name, password, user_role, ho_ten, gioi_tinh, ngay_sinh, sdt, anh_dai_dien, active, so_absence_max, phong_ban_id, status) VALUES
('viethung', '$2b$10$3Foz6upysbuWF0ubqxGhOeT78WaIFxXSMTp6zwtUMEEOTnljJRuZ6', 'Employee', N'Nguyễn Viết Hùng', 'Male', '12/02/2001', '0934561282', '/images/user_avt/13/avatar.jpg', 1, 12, 4, 0)


-- TASK --
INSERT INTO TASK (nguoi_tao_id, nguoi_thuc_hien_id, ten_task, mo_ta, mo_ta_nop, status, muc_do_hoan_thanh, tap_tin, tap_tin_nop, thoi_gian_deadline, thoi_gian_hoan_thanh, note) VALUES
(2, 5, N'Chức năng thanh toán', N'Thực hiện kết nối các ví điện tử', NULL, 1, 1, '/files/task/task_giao/1/Chuc-nang-thanh-toan.txt', NULL, '05/20/2022 11:00:00', NULL, NULL)

INSERT INTO TASK (nguoi_tao_id, nguoi_thuc_hien_id, ten_task, mo_ta, mo_ta_nop, status, muc_do_hoan_thanh, tap_tin, tap_tin_nop, thoi_gian_deadline, thoi_gian_hoan_thanh, note) VALUES
(2, 6, N'Giao diện trang chủ', N'Fix lỗi responsive', NULL, 1, 1, '/files/task/task_giao/4/menu.txt', NULL, '05/26/2022 10:30:00', NULL, NULL)

INSERT INTO TASK (nguoi_tao_id, nguoi_thuc_hien_id, ten_task, mo_ta, mo_ta_nop, status, muc_do_hoan_thanh, tap_tin, tap_tin_nop, thoi_gian_deadline, thoi_gian_hoan_thanh, note) VALUES
(2, 7, N'Login', N'Kiểm tra lỗi login bằng gmail', NULL, 1, 1, '/files/task/task_giao/3/login.txt', NULL, '05/29/2022 14:00:00', NULL, NULL)

INSERT INTO TASK (nguoi_tao_id, nguoi_thuc_hien_id, ten_task, mo_ta, mo_ta_nop, status, muc_do_hoan_thanh, tap_tin, tap_tin_nop, thoi_gian_deadline, thoi_gian_hoan_thanh, note) VALUES
(2, 6, N'Lỗi thông báo', N'Thông báo khuyến mãi mới', NULL, 2, 1, '/files/task/task_giao/2/thong-bao-km.txt', NULL, '05/23/2022 15:00:00', NULL, NULL)

INSERT INTO TASK (nguoi_tao_id, nguoi_thuc_hien_id, ten_task, mo_ta, mo_ta_nop, status, muc_do_hoan_thanh, tap_tin, tap_tin_nop, thoi_gian_deadline, thoi_gian_hoan_thanh, note) VALUES
(2, 5, N'Đặt hàng items', N'Chỉnh sửa items đặt hàng mới', N'Đã chỉnh sửa bản 1', 4, 1, '/files/task/task_giao/5/mo-ta.txt', '/files/task/task_nop/5/items-dat-hang.txt', '05/20/2022 15:30:00', '05/17/2022 11:30:00', NULL)

INSERT INTO TASK (nguoi_tao_id, nguoi_thuc_hien_id, ten_task, mo_ta, mo_ta_nop, status, muc_do_hoan_thanh, tap_tin, tap_tin_nop, thoi_gian_deadline, thoi_gian_hoan_thanh, note) VALUES
(2, 6, N'View thông báo', N'Cập nhật view thông báo', N'Cập nhật item thông báo', 5, 1, '/files/task/task_giao/6/update-view.txt', '/files/task/task_nop/6/update-view.c', '05/22/2022 14:10:00', '05/19/2022 14:40:00', NULL)

INSERT INTO TASK (nguoi_tao_id, nguoi_thuc_hien_id, ten_task, mo_ta, mo_ta_nop, status, muc_do_hoan_thanh, tap_tin, tap_tin_nop, thoi_gian_deadline, thoi_gian_hoan_thanh, note) VALUES
(2, 7, N'Xem giỏ hàng', N'FE giỏ sản phẩm chưa hợp lý', N'Đã fix', 5, 1, '/files/task/task_giao/7/update-gio-hang.txt', '/files/task/task_nop/7/gio-hang-updated.txt', '05/25/2022 15:30:00', '05/24/2022 10:20:00', NULL)

INSERT INTO TASK (nguoi_tao_id, nguoi_thuc_hien_id, ten_task, mo_ta, mo_ta_nop, status, muc_do_hoan_thanh, tap_tin, tap_tin_nop, thoi_gian_deadline, thoi_gian_hoan_thanh, note) VALUES
(2, 5, N'View xem sản phẩm', N'Cập nhật FE', N'Đã cập nhật đầy đủ', 6, 3, '/files/task/task_giao/8/xem-san-pham.txt', '/files/task/task_nop/8/bao-cao-xem-sp.txt', '05/28/2022 10:00:00', '05/27/2022 14:00:00', NULL)

INSERT INTO TASK (nguoi_tao_id, nguoi_thuc_hien_id, ten_task, mo_ta, mo_ta_nop, status, muc_do_hoan_thanh, tap_tin, tap_tin_nop, thoi_gian_deadline, thoi_gian_hoan_thanh, note) VALUES
(3, 8, N'Cập nhật lương', N'lương phòng CNTT tháng 5', NULL, 1, 1, '/files/task/task_giao/9/bang-luong.txt', NULL, '05/30/2022 15:00:00', NULL, NULL)

INSERT INTO TASK (nguoi_tao_id, nguoi_thuc_hien_id, ten_task, mo_ta, mo_ta_nop, status, muc_do_hoan_thanh, tap_tin, tap_tin_nop, thoi_gian_deadline, thoi_gian_hoan_thanh, note) VALUES
(3, 9, N'Chương trình thực tập mới', N'Soạn script chương trình', NULL, 2, 1, '/files/task/task_giao/10/script.txt', NULL, '05/22/2022 14:50:00', NULL, NULL)

INSERT INTO TASK (nguoi_tao_id, nguoi_thuc_hien_id, ten_task, mo_ta, mo_ta_nop, status, muc_do_hoan_thanh, tap_tin, tap_tin_nop, thoi_gian_deadline, thoi_gian_hoan_thanh, note) VALUES
(3, 10, N'Lên kế hoạch chương trình đào tạo mới', N'Xác định nhu cầu, mục đích và kế hoạch đào tạo', N'Nộp báo cáo kế hoạch', 4, 1, '/files/task/task_giao/11/huong-dan-ct.txt', '/files/task/task_nop/11/ban-ke-hoach.docx', '05/29/2022 16:00:00', '05/25/2022 16:30:00', NULL)

INSERT INTO TASK (nguoi_tao_id, nguoi_thuc_hien_id, ten_task, mo_ta, mo_ta_nop, status, muc_do_hoan_thanh, tap_tin, tap_tin_nop, thoi_gian_deadline, thoi_gian_hoan_thanh, note) VALUES
(3, 8, N'Đánh giá mức độ làm việc CNTT', N'Tiến hành đánh giá kết quả làm việc của phòng CNTT', N'Đánh giá lần 1', 5, 1, '/files/task/task_giao/12/danh-gia.txt', '/files/task/task_nop/12/danh-gia-lan-1.txt', '05/30/2022 15:20:00', '05/26/2022 10:00:00', NULL)

INSERT INTO TASK (nguoi_tao_id, nguoi_thuc_hien_id, ten_task, mo_ta, mo_ta_nop, status, muc_do_hoan_thanh, tap_tin, tap_tin_nop, thoi_gian_deadline, thoi_gian_hoan_thanh, note) VALUES
(4, 11, N'Thống kê', N'Tính thống kê chiến dịch', NULL, 1, 1, '/files/task/task_giao/13/thong-ke.txt', NULL, '06/15/2022 11:30:00', NULL, NULL)

INSERT INTO TASK (nguoi_tao_id, nguoi_thuc_hien_id, ten_task, mo_ta, mo_ta_nop, status, muc_do_hoan_thanh, tap_tin, tap_tin_nop, thoi_gian_deadline, thoi_gian_hoan_thanh, note) VALUES
(4, 13, N'Quản lý thời gian', N'Soạn timeline', NULL, 1, 1, '/files/task/task_giao/14/thoi-gian.txt', NULL, '06/02/2022 11:45:00', NULL, NULL)

INSERT INTO TASK (nguoi_tao_id, nguoi_thuc_hien_id, ten_task, mo_ta, mo_ta_nop, status, muc_do_hoan_thanh, tap_tin, tap_tin_nop, thoi_gian_deadline, thoi_gian_hoan_thanh, note) VALUES
(4, 11, N'Tính lương', N'Báo cáo lương', N'Báo cáo lương bản 1', 4, 1, '/files/task/task_giao/15/mau-bao-cao.txt', '/files/task/task_nop/15/bao-cao-luong-1.txt', '05/29/2022 16:40:00', '05/21/2022 14:35:00', NULL)


-- HISTORY --
INSERT INTO HISTORY (task_id, task_status, note, mo_ta_nop, created_on, file_history, file_task_nop) VALUES
(8, -1, N'Chưa hoàn thành', N'Bổ sung', '05/22/2022 23:06:58', '/files/history/1/chinh-sua.txt', '/files/task/task_nop/7/FE-updated.txt')

INSERT INTO HISTORY (task_id, task_status, note, mo_ta_nop, created_on, file_history, file_task_nop) VALUES
(12, -1, N'Tiếp tục', N'Lần 1', '05/24/2022 23:07:00', '/files/history/2/mau-danh-gia.txt', '/files/task/task_nop/12/danh-gia-cntt-1.txt')


-- ABSENCE --
INSERT INTO ABSENCE (nguoi_tao_id, nguoi_duyet_id, status, tap_tin, ngay_bat_dau, ngay_ket_thuc, ly_do, ngay_duyet, created_on) VALUES
(2, 1, 1, NULL, '05/15/2022', '05/16/2022', N'Bận việc', '05/13/2022', '05/12/2022')

INSERT INTO ABSENCE (nguoi_tao_id, nguoi_duyet_id, status, tap_tin, ngay_bat_dau, ngay_ket_thuc, ly_do, ngay_duyet, created_on) VALUES
(3, 1, 0, NULL, '05/22/2022', '05/22/2022', N'Du lịch', NULL, '05/17/2022')

INSERT INTO ABSENCE (nguoi_tao_id, nguoi_duyet_id, status, tap_tin, ngay_bat_dau, ngay_ket_thuc, ly_do, ngay_duyet, created_on) VALUES
(4, 1, 0, '/files/absence/2/giay-kham-benh.jpg', '05/22/2022', '05/22/2022', N'Khám bệnh', NULL, '05/19/2022')

INSERT INTO ABSENCE (nguoi_tao_id, nguoi_duyet_id, status, tap_tin, ngay_bat_dau, ngay_ket_thuc, ly_do, ngay_duyet, created_on) VALUES
(5, 2, 1, NULL, '05/24/2022', '05/25/2022', N'Bận việc nhà', '05/24/2022', '05/23/2022')

INSERT INTO ABSENCE (nguoi_tao_id, nguoi_duyet_id, status, tap_tin, ngay_bat_dau, ngay_ket_thuc, ly_do, ngay_duyet, created_on) VALUES
(6, 2, 0, NULL, '05/29/2022', '05/29/2022', N'Du lịch', NULL, '05/24/2022')

INSERT INTO ABSENCE (nguoi_tao_id, nguoi_duyet_id, status, tap_tin, ngay_bat_dau, ngay_ket_thuc, ly_do, ngay_duyet, created_on) VALUES
(7, 2, 0, NULL, '05/25/2022', '05/26/2022', N'Đám giỗ', NULL, '05/23/2022')

INSERT INTO ABSENCE (nguoi_tao_id, nguoi_duyet_id, status, tap_tin, ngay_bat_dau, ngay_ket_thuc, ly_do, ngay_duyet, created_on) VALUES
(8, 3, 1, NULL, '05/14/2022', '05/15/2022', N'Du lịch', '05/14/2022', '05/14/2022')

INSERT INTO ABSENCE (nguoi_tao_id, nguoi_duyet_id, status, tap_tin, ngay_bat_dau, ngay_ket_thuc, ly_do, ngay_duyet, created_on) VALUES
(9, 3, 0, '/files/absence/5/giay-kham-benh.jpg', '05/29/2022', '05/30/2022', N'Khám bệnh', NULL, '05/26/2022')

INSERT INTO ABSENCE (nguoi_tao_id, nguoi_duyet_id, status, tap_tin, ngay_bat_dau, ngay_ket_thuc, ly_do, ngay_duyet, created_on) VALUES
(10, 3, 0, NULL, '05/21/2022', '05/23/2022', N'Du lịch', NULL, '05/17/2022')