CREATE DATABASE mydatabase;
USE mydatabase; 
CREATE TABLE IF NOT EXISTS transactions(id INT NOT NULL AUTO_INCREMENT, amount DECIMAL(10,2), description VARCHAR(100), PRIMARY KEY(ID));
INSERT INTO transactions (amount,description) VALUES ('100','groceries');