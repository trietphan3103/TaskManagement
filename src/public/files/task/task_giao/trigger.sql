use QUANLYVI

DROP TRIGGER IF EXISTS insert_USERS_status;
DROP TRIGGER IF EXISTS update_USERS_status;
DROP TRIGGER IF EXISTS insert_WITHDRAW_withdraw_amount;
DROP TRIGGER IF EXISTS update_WITHDRAW_withdraw_amount;
DROP TRIGGER IF EXISTS WITHDRAW_fee;
DROP TRIGGER IF EXISTS insert_WITHDRAW_status;
DROP TRIGGER IF EXISTS update_WITHDRAW_status;
DROP TRIGGER IF EXISTS insert_WITHDRAW_amount_status;
DROP TRIGGER IF EXISTS insert_TRANSFER_status;
DROP TRIGGER IF EXISTS update_TRANSFER_status;
DROP TRIGGER IF EXISTS insert_TRANSFER_amount_status;
DROP TRIGGER IF EXISTS insert_TRANSFER_balance;
DROP TRIGGER IF EXISTS update_TRANSFER_balance;
DROP TRIGGER IF EXISTS insert_BUYING_CARD_TRANSACTION;
DROP TRIGGER IF EXISTS update_BUYING_CARD_TRANSACTION;
-----USERS-------
-----check username từ 0-9--------
DELIMITER $$
create trigger insert_USERS_status
before insert
on USERS
for each row
begin
	if new.status not between -1 and 2 then
		SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = N'Re-enter the users status';
	end if;
end$$
DELIMITER ;

DELIMITER $$
create trigger update_USERS_status
before update
on USERS
for each row
begin
	if new.status not between -1 and 2 then
		SIGNAL SQLSTATE '45001'
			SET MESSAGE_TEXT = N'Re-enter the users status';
	end if;
end$$
DELIMITER ;


------WITHDRAW-------
DELIMITER $$
create trigger insert_WITHDRAW_withdraw_amount
before insert
on WITHDRAW
for each row
begin
	if not(new.withdraw_amount % 50000 = 0) then
		SIGNAL SQLSTATE '45002'
            SET MESSAGE_TEXT = N'Withdrawal amount each time must be a multiple of 50000';
	end if;
end$$
DELIMITER ;

DELIMITER $$
create trigger update_WITHDRAW_withdraw_amount
before update
on WITHDRAW
for each row
begin
	if not(new.withdraw_amount % 50000 = 0) then
		SIGNAL SQLSTATE '45003'
            SET MESSAGE_TEXT = N'Withdrawal amount each time must be a multiple of 50000';
	end if;
end$$
DELIMITER ;

DELIMITER $$
create trigger WITHDRAW_count_max
before insert
on WITHDRAW
for each row
begin
	if(new.withdraw_count > 2) then
		SIGNAL SQLSTATE '45004'
            SET MESSAGE_TEXT = N'Can only withdraw up to 2 times a day';
	end if;
end$$
DELIMITER ;

DELIMITER $$
create trigger WITHDRAW_fee
before insert
on WITHDRAW
for each row
begin
	SET new.fee = withdraw_amount * 5/100 ;
end$$
DELIMITER ;

DELIMITER $$
create trigger update_WITHDRAW_fee
before update
on WITHDRAW
for each row
begin
	SET new.fee = withdraw_amount * 5/100 ;
end$$
DELIMITER ;

DELIMITER $$
create trigger insert_WITHDRAW_status
before insert
on WITHDRAW
for each row
begin
	if new.status not between -1 and 2 then
		SIGNAL SQLSTATE '45005'
			SET MESSAGE_TEXT = N'Re-enter the withdraw status';
	end if;
end$$
DELIMITER ;

DELIMITER $$
create trigger update_WITHDRAW_status
before update
on WITHDRAW
for each row
begin
	if new.status not between -1 and 2 then
		SIGNAL SQLSTATE '45006'
			SET MESSAGE_TEXT = N'Re-enter the withdraw status';
	end if;
end$$
DELIMITER ;

DELIMITER $$
create trigger insert_WITHDRAW_amount_status
before insert
on WITHDRAW
for each row
begin
	if (new.withdraw_amount > 5000000) then
		UPDATE WITHDRAW SET status = 0;
	else
		UPDATE WITHDRAW SET status = 1;
	end if;
end$$
DELIMITER ;

-------TRANSFER-------
DELIMITER $$
create trigger insert_TRANSFER_status
before insert
on TRANSFER
for each row
begin
	if new.status not between -1 and 2 then
		SIGNAL SQLSTATE '45007'
			SET MESSAGE_TEXT = N'Re-enter the transfer status';
	end if;
end$$
DELIMITER ;

DELIMITER $$
create trigger update_TRANSFER_status
before update
on TRANSFER
for each row
begin
	if new.status not between -1 and 2 then
		SIGNAL SQLSTATE '45008'
			SET MESSAGE_TEXT = N'Re-enter the transfer status';
	end if;
end$$
DELIMITER ;

DELIMITER $$
create trigger insert_TRANSFER_amount_status
before insert
on TRANSFER
for each row
begin
	if (new.transfer_amount > 5000000) then
		UPDATE TRANSFER SET status = 0;
	else
		UPDATE TRANSFER SET status = 1;
	end if;
end$$
DELIMITER ;

DELIMITER $$
create trigger insert_TRANSFER_balance
before insert
on TRANSFER
for each row
begin
	if (balance < new.transfer_amount) then
		UPDATE TRANSFER SET status = -1;
	else
		UPDATE TRANSFER SET status = 1;
	end if;
end$$
DELIMITER ;

DELIMITER $$
create trigger update_TRANSFER_balance
before update
on TRANSFER
for each row
begin
	if (balance < new.transfer_amount) then
		UPDATE TRANSFER SET status = -1;
	else
		UPDATE TRANSFER SET status = 1;
	end if;
end$$
DELIMITER ;

------BUYING_CARD_TRANSACTION-------

DELIMITER $$
create trigger insert_BUYING_CARD_TRANSACTION
before insert
on BUYING_CARD_TRANSACTION
for each row
begin
	if(new.mobile_card_quantity > 5) then
		SIGNAL SQLSTATE '45009'
			SET MESSAGE_TEXT = N'Users are only allowed to buy up to 5 cards in one transaction';
	end if;
end$$
DELIMITER ;

DELIMITER $$
create trigger update_BUYING_CARD_TRANSACTION
before update
on BUYING_CARD_TRANSACTION
for each row
begin
	if(new.mobile_card_quantity > 5) then
		SIGNAL SQLSTATE '45010'
			SET MESSAGE_TEXT = N'Users are only allowed to buy up to 5 cards in one transaction';
	end if;
end$$
DELIMITER ;
