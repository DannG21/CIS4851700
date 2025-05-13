postgres=# CREATE DATABASE lab_16;
CREATE DATABASE
postgres=# \c lab_16
You are now connected to database "lab_16" as user "postgres".
lab_16=# CREATE TABLE table1 (id SERIAL PRIMARY KEY, name VARCHAR(50));
CREATE TABLE
lab_16=# INSERT INTO table1 (name) VALUES ('George'), ('Jerry'), ('Larry');
INSERT 0 3