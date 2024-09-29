
-- Create departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- Create roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT REFERENCES departments(id) ON DELETE CASCADE
);

-- Create employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    manager_id INT REFERENCES employees(id) ON DELETE CASCADE
);
-- Insert initial departments
INSERT INTO departments (name) VALUES
('Sales'),
('Engineering'),
('HR');

-- Insert initial roles
INSERT INTO roles (title, salary, department_id) VALUES
('Salesperson', 100000, 1),
('Engineer', 120000, 2),
('HR Specialist', 80000, 3);

-- Insert initial employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Alice', 'Williams', 3, 1);


