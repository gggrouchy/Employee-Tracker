const inquirer = require('inquirer');
const pool = require('./db/db');

async function mainMenu() {
    const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Delete a department',
            'Delete a role',
            'Delete an employee',
            'Exit',
        ],
    });

    switch (action) {
        case 'View all departments':
            return viewDepartments();
        case 'View all roles':
            return viewRoles();
        case 'View all employees':
            return viewEmployees();
        case 'Add a department':
            return addDepartment();
        case 'Add a role':
            return addRole();
        case 'Add an employee':
            return addEmployee();
        case 'Update an employee role':
            return updateEmployeeRole();
        case 'Delete a department':
            return deleteDepartment();
        case 'Delete a role':
            return deleteRole();
        case 'Delete an employee':
            return deleteEmployee();
        default:
            process.exit();
    }
}


mainMenu();

async function viewDepartments() {
    const result = await pool.query('SELECT * FROM departments');
    console.table(result.rows);
    mainMenu();
}

async function viewRoles() {
    const query = `
        SELECT roles.id, roles.title, roles.salary, departments.name AS department
        FROM roles
        JOIN departments ON roles.department_id = departments.id;
    `;
    const result = await pool.query(query);
    console.table(result.rows);
    mainMenu();
}

async function viewEmployees() {
    const query = `
        SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, 
               CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employees
        JOIN roles ON employees.role_id = roles.id
        JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees AS manager ON employees.manager_id = manager.id;
    `;
    const result = await pool.query(query);
    console.table(result.rows);
    mainMenu();
}

async function addDepartment() {
    const { name } = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the department name:',
    });
    await pool.query('INSERT INTO departments (name) VALUES ($1)', [name]);
    console.log(`Added ${name} to the database.`);
    mainMenu();
}

async function addRole() {
    const departments = await pool.query('SELECT * FROM departments');
    const departmentChoices = departments.rows.map(({ id, name }) => ({ name, value: id }));

    const { title, salary, department_id } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter the role title:' },
        { type: 'input', name: 'salary', message: 'Enter the role salary:' },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department:',
            choices: departmentChoices,
        },
    ]);

    await pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log(`Added role ${title} to the database.`);
    mainMenu();
}

async function addEmployee() {
    const roles = await pool.query('SELECT * FROM roles');
    const roleChoices = roles.rows.map(({ id, title }) => ({ name: title, value: id }));

    const employees = await pool.query('SELECT * FROM employees');
    const managerChoices = employees.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        { type: 'input', name: 'first_name', message: 'Enter the first name:' },
        { type: 'input', name: 'last_name', message: 'Enter the last name:' },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the role:',
            choices: roleChoices,
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select the manager:',
            choices: [{ name: 'None', value: null }].concat(managerChoices),
        },
    ]);

    await pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
    console.log(`Added employee ${first_name} ${last_name} to the database.`);
    mainMenu();
}

async function updateEmployeeRole() {
    const employees = await pool.query('SELECT * FROM employees');
    const employeeChoices = employees.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

    const roles = await pool.query('SELECT * FROM roles');
    const roleChoices = roles.rows.map(({ id, title }) => ({ name: title, value: id }));

    const { employee_id, role_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to update:',
            choices: employeeChoices,
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the new role:',
            choices: roleChoices,
        },
    ]);

    await pool.query('UPDATE employees SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log('Updated employee role.');
    mainMenu();
}

async function deleteDepartment() {
    const departments = await pool.query('SELECT * FROM departments');
    const departmentChoices = departments.rows.map(({ id, name }) => ({ name, value: id }));

    const { department_id } = await inquirer.prompt({
        type: 'list',
        name: 'department_id',
        message: 'Select the department to delete:',
        choices: departmentChoices,
    });

    await pool.query('DELETE FROM departments WHERE id = $1', [department_id]);
    console.log('Deleted department.');
    mainMenu();
}

async function deleteRole() {
    const roles = await pool.query('SELECT * FROM roles');
    const roleChoices = roles.rows.map(({ id, title }) => ({ name: title, value: id }));

    const { role_id } = await inquirer.prompt({
        type: 'list',
        name: 'role_id',
        message: 'Select the role to delete:',
        choices: roleChoices,
    });

    await pool.query('DELETE FROM roles WHERE id = $1', [role_id]);
    console.log('Deleted role.');
    mainMenu();
}

async function deleteEmployee() {
    const employees = await pool.query('SELECT * FROM employees');
    const employeeChoices = employees.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

    const { employee_id } = await inquirer.prompt({
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee to delete:',
        choices: employeeChoices,
    });

    await pool.query('DELETE FROM employees WHERE id = $1', [employee_id]);
    console.log('Deleted employee.');
    mainMenu();
}
