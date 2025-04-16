-- Customer table
CREATE TABLE Customer (
    cust_Id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone_number INT NOT NULL,
    password VARCHAR(15) NOT NULL,
    points INT DEFAULT 0
);

-- Transaction table
CREATE TABLE Transaction (
    ref_no INT AUTO_INCREMENT PRIMARY KEY,
    cust_Id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (cust_Id) REFERENCES Customer(cust_Id)
);


-- Voucher table
CREATE TABLE Voucher (
    voucher_Id INT AUTO_INCREMENT PRIMARY KEY,
    voucher_name VARCHAR(50) NOT NULL,
    voucher_desc VARCHAR(100),
    cost INT NOT NULL
);

-- Redeemed table
CREATE TABLE Redeem (
    trans_Id INT AUTO_INCREMENT PRIMARY KEY,
    voucher_Id INT NOT NULL,
    cust_Id INT NOT NULL,
    trans_Date DATE NOT NULL DEFAULT CURRENT_DATE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    serial_No INT NOT NULL,
    FOREIGN KEY (voucher_Id) REFERENCES Voucher(voucher_Id),
    FOREIGN KEY (cust_Id) REFERENCES Customer(cust_Id)
);

-- auto update customer points after a new transaction is inserted
DELIMITER $$
CREATE TRIGGER after_transaction_insert
AFTER INSERT ON Transaction
FOR EACH ROW
BEGIN
    UPDATE Customer
    SET points = points + FLOOR(NEW.amount * 0.1)
    WHERE cust_Id = NEW.cust_Id;
END$$
DELIMITER ;

-- insert test data
INSERT INTO Customer (name, phone_number, password, points) VALUES
('John Doe', 1234567890, '1234', 100),
('Jane Smith', 9876543210, '1234', 600),
('Alice Johnson', 5555555555, '1234', 1000),
('Bob Brown', 4444444444, '1234', 5000);

INSERT INTO Voucher (voucher_name, voucher_desc, cost) VALUES
('Free coffee', 'Get a free coffee on your next purchase', 100),
('Free entry to lounge', 'Get free entry to the vip lounge', 5000);
