CREATE DATABASE CSDLPT;
USE CSDLPT;

CREATE TABLE PHONG_BAN (
	phong_ban_id int IDENTITY(1,1),
	ten_phong nvarchar(30) not null,
	mo_ta nvarchar(2550),
	primary key (phong_ban_id)
);

CREATE TABLE USERS (
	user_id int IDENTITY(1,1),
	user_name varchar(20) unique not null,
	password varchar(255) not null,
	user_role varchar(15) not null,
	ho_ten nvarchar(100),
	gioi_tinh varchar(6),
	ngay_sinh date,
	sdt varchar(10) unique,
	anh_dai_dien varchar(255),
	-- active: -1: false, 1: true
	active int default 0,
	so_absence_max int,
	phong_ban_id int not null,
	-- status: 0: nhanvien, 1: truongphong
    status int,
	constraint fk_NHANVIEN_PHONGBAN foreign key (phong_ban_id) references PHONG_BAN(phong_ban_id),
	constraint check_USERS_user_role check (user_role in ('Director', 'Employee')),
	constraint check_USERS_gioi_tinh check (gioi_tinh in ('Male', 'Female')),
	constraint check_USERS_active check (active between -1 and 1),
	constraint check_USERS_status check (status in (0,1)),
	primary key (user_id)
);

CREATE TABLE TASK (
	task_id int IDENTITY(1,1),
	nguoi_tao_id int default not null,
	nguoi_thuc_hien_id int not null,
	ten_task nvarchar(50) not null,
	mo_ta nvarchar(2550),
	mo_ta_nop nvarchar(2550),
	-- status: 1 = new, 2 = in-progress, 3 = canceled, 4 = waiting, 5: rejected, 6: completed 
	status int,
	-- muc_do_hoan_thanh: 1 = bad, 2 = OK, 3 = good
	muc_do_hoan_thanh int default 1,
	tap_tin varchar(255),
	tap_tin_nop varchar(255),
	thoi_gian_deadline datetime,
	thoi_gian_hoan_thanh datetime,
	note nvarchar(255),
	constraint fk_TASK_nguoi_tao foreign key (nguoi_tao_id) references USERS(user_id),
	constraint fk_TASK_nguoi_thuc_hien foreign key (nguoi_thuc_hien_id) references USERS(user_id),
	constraint check_TASK_status check (status between 1 and 6),
	constraint check_TASK_muc_do_hoan_thanh check (muc_do_hoan_thanh between 1 and 3),
	constraint check_TASK_thoi_gian_deadline check (thoi_gian_deadline > GETDATE()),
	primary key (task_id)
);

CREATE TABLE HISTORY (
    history_id int IDENTITY(1,1),
    task_id int not null,
	-- task_status: -1 = rejected, 1 = approved
	task_status int,
    note nvarchar(255),
	mo_ta_nop nvarchar(255),
    created_on datetime DEFAULT CURRENT_TIMESTAMP,
	file_history varchar(2550),
	file_task_nop varchar(2550),
    constraint fk_HISTORY_task_id foreign key (task_id) references TASK(task_id),
	constraint check_HISTORY_task_status check (task_status in (-1,1)),
    primary key (history_id, task_id)
);

create table ABSENCE (
	absence_id int IDENTITY(1,1),
	nguoi_tao_id int not null,
	nguoi_duyet_id int not null,
	-- status: -1 = reject, 0 = waiting, 1 = aprroved
	status int default 0,
	tap_tin varchar(255) default NULL,
	ngay_bat_dau date not null,
	ngay_ket_thuc date not null,
	ly_do nvarchar(255) not null,
	ngay_duyet date default NULL,
	created_on datetime not null default CAST(CURRENT_TIMESTAMP AS DATE),
	constraint fk_ABSENCE_nguoi_tao_id foreign key (nguoi_tao_id) references USERS(user_id),
	constraint fk_ABSENCE_nguoi_duyet_id foreign key (nguoi_duyet_id) references USERS(user_id),
	constraint check_ABSENCE_status check (status between -1 and 1),
    constraint check_ABSENCE_date check(ngay_ket_thuc >= ngay_bat_dau and ngay_bat_dau >= CAST(GETDATE() AS DATE)),
	primary key (absence_id)
);