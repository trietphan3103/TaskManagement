use CSDLPT;

DROP TRIGGER IF EXISTS insert_USERS_absence_max_default;
DROP TRIGGER IF EXISTS insert_USERS_so_absence_max;
DROP TRIGGER IF EXISTS insert_USERS_so_absence_max_giam_doc;
DROP TRIGGER IF EXISTS insert_USERS_nhan_vien;
DROP TRIGGER IF EXISTS insert_USERS_truong_phong;
DROP TRIGGER IF EXISTS insert_TASKS_chung_phong_ban;
GO

-- ----------------------------------------------------------
-- -------------------------- USER --------------------------
-- ----------------------------------------------------------
create trigger insert_USERS_absence_max_default
on USERS
for insert, update
as
begin
	declare @user_id int
    declare @user_role varchar(15)
    declare @so_absence_max int
	declare @status int

	set @user_id = (select user_id from inserted)
	set @user_role = (select user_role from inserted)
	set @so_absence_max = (select so_absence_max from inserted)
	set @status = (select status from inserted)

	if (@user_role = 'Employee')
    begin
		if (@status = 0)
        begin
            SET @so_absence_max = 12;
        end
    else
        begin
            SET @so_absence_max = 15;
        end
	end

	UPDATE USERS
	SET so_absence_max = @so_absence_max
	WHERE user_id = @user_id
end;
go

create trigger insert_USERS_so_absence_max
on USERS
for insert, update
as
begin
    declare @user_role varchar(15)
    declare @so_absence_max int

	set @user_role = (select user_role from inserted)
	set @so_absence_max = (select so_absence_max from inserted)

	if @user_role = 'Employee' and @so_absence_max not in (12, 15)
    begin
		print 'Employee must have 12 or 15 maximum days off'
        rollback tran
    end
end;
go

create trigger insert_USERS_so_absence_max_giam_doc
on USERS
for insert, update
as
begin
    declare @user_role varchar(15)
    declare @so_absence_max int

	set @user_role = (select user_role from inserted)
	set @so_absence_max = (select so_absence_max from inserted)

	if @user_role = 'Director' and @so_absence_max is not null
    begin
		print 'No need to enter the number of days off of the director'
        rollback tran
    end
end;
go

create trigger insert_USERS_nhan_vien
on USERS
for insert, update
as
begin
    declare @user_role varchar(15)
    declare @status int

	set @user_role = (select user_role from inserted)
	set @status = (select status from inserted)

	if @status = 1 and @user_role = 'Director'
    begin
		print 'Invalid departmental position'
        rollback tran
    end
end;
go

create trigger insert_USERS_truong_phong
on USERS
after insert, update
as
begin
    declare @phong_ban_id int

	set @phong_ban_id = (select phong_ban_id from inserted)

	if (select count(*) 
        from USERS 
        where status = 1 and phong_ban_id = @phong_ban_id) > 1
    begin
		print 'Only one person can be the head of the department'
        rollback tran
	end
end;
go


-- -----------------------------------------------------------
-- -------------------------- TASKS --------------------------
-- -----------------------------------------------------------
create trigger insert_TASKS_chung_phong_ban
on TASK
for insert, update
as
begin
    declare @nguoi_tao_id int
    declare @nguoi_thuc_hien_id int

	set @nguoi_tao_id = (select nguoi_tao_id from inserted)
	set @nguoi_thuc_hien_id = (select nguoi_thuc_hien_id from inserted)

	if @nguoi_tao_id not in (select n.user_id 
                            from USERS n 
                            where n.phong_ban_id in 
                                                (select phong_ban_id from USERS n2 where @nguoi_thuc_hien_id = n2.user_id))
    begin
        print 'Creator and executor must be in the same department'
        rollback tran
	end
end;
go
