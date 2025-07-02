-- 🏠 Script tạo database local cho development

-- Connect vào PostgreSQL với user postgres
-- psql -U postgres

-- Tạo database
CREATE DATABASE movie;

-- Hoặc nếu muốn tên khác
CREATE DATABASE bluesocial;

-- Kiểm tra database đã tạo
\l

-- Connect vào database 
\c movie

-- Exit
\q 