use CSDLPT

CREATE PROCEDURE _get_current_day_off_used @user_id INT
AS
BEGIN
	SELECT ISNULL(sum(DATEDIFF(day, ngay_ket_thuc, ngay_bat_dau)) + 1, 0) as day_used
    FROM ABSENCE
    WHERE nguoi_tao_id = @user_id and YEAR(ngay_bat_dau) = YEAR(GETDATE()) and status = 1;
END;

CREATE PROC _get_list_waiting_absence_of_manager
AS 
	SELECT ABSENCE.*, USERS.ho_ten 
	FROM ABSENCE,USERS 
	WHERE USERS.status = 1 
			and ABSENCE.nguoi_tao_id = USERS.user_id  
			and ABSENCE.status = 0 
	order by ABSENCE.created_on desc
GO

CREATE PROC _get_list_proccessed_absence_of_manager
AS 
	SELECT ABSENCE.*, USERS.ho_ten 
	FROM ABSENCE,USERS 
	WHERE USERS.status = 1 
			and ABSENCE.nguoi_tao_id = USERS.user_id  
			and ABSENCE.status != 0 
	order by ABSENCE.created_on desc
GO

CREATE PROC _get_list_today_absence
AS
	SELECT ABSENCE.*, DATEADD(day, 1, cast(GETDATE() AS Date)) as ngay_quay_lai,  USERS.*,PHONG_BAN.ten_phong 
	from ABSENCE,USERS, PHONG_BAN 
	where ABSENCE.nguoi_tao_id = USERS.user_id 
			and USERS.phong_ban_id = PHONG_BAN.phong_ban_id 
			and ABSENCE.ngay_bat_dau <= cast(GETDATE() AS Date) 
			and ABSENCE.ngay_ket_thuc >= cast(GETDATE() AS Date) 
	order by ngay_bat_dau desc;
GO

CREATE PROC _get_list_users
AS
	SELECT USERS.*, PHONG_BAN.ten_phong 
	FROM USERS, PHONG_BAN 
	WHERE USERS.phong_ban_id = PHONG_BAN.phong_ban_id 
			and USERS.user_role != N'Giám đốc' 
			and USERS.active = 1 
	order by USERS.user_id
GO

CREATE PROCEDURE _get_current_day_off_used @user_id INT
AS
BEGIN
	SELECT ISNULL(sum(DATEDIFF(day, ngay_ket_thuc, ngay_bat_dau)) + 1, 0) as day_used
    FROM ABSENCE
    WHERE nguoi_tao_id = @user_id and YEAR(ngay_bat_dau) = YEAR(GETDATE()) and status = 1;
END;