const inquirer = require('inquirer');
const config = require('./config/config');
const table = require('console.table');
const connection = config.connection;

const mainMenu = [  
    {
        type: 'list',
        name: 'mainMenu',
        message: 'What would you like to do?',
        choices: [  {name: 'View All Employees',        value: 0},
                    {name: 'Add Employee',              value: 1},
                    {name: 'Update Employee Role',      value: 2},
                    {name: 'View All Roles',            value: 3},
                    {name: 'Add Role',                  value: 4},
                    {name: 'View All Departments',      value: 5},
                    {name: 'Add Department',            value: 6},
                    {name: 'Delete Employee',           value: 7},
                    {name: 'Delete Role',               value: 8},
                    {name: 'Delete Department',         value: 9},
                    {name: 'Quit',                      value: 10}
                ]
    }
];

const somethingElse = [
    {
        type: 'list', 
        name: 'somethingElse', 
        message: 'Would you like to do something else?',
        choices: [  {name: 'Yes', value: 'Y'},
                    {name: 'No', value: 'N'}
                ]
    }
]

function prompts(){
    inquirer.prompt(mainMenu).then((answer) => {
        // console.log(answer.mainMenu);
        if (answer.mainMenu == 0) {
            viewAllEmployees();
        } else if (answer.mainMenu == 1) {
            addEmployee();
        } else if (answer.mainMenu == 2) {
            updateRole();
        } else if (answer.mainMenu == 3) {
            viewRoles();
        } else if (answer.mainMenu == 4) {
            addRole();
        } else if (answer.mainMenu == 5) {
            viewDepartments();
        } else if (answer.mainMenu == 6) {
            addDepartment();
        } else if (answer.mainMenu == 7) {
            deleteEmployee();
        } else if (answer.mainMenu == 8) {
            deleteRole();
        } else if (answer.mainMenu == 9) {
            deleteDepartment();
        } else {
            console.log("You're finished!")
        }
    })
}

function doSomethingElse() {
    inquirer.prompt(somethingElse).then((answer) => {
        // console.log(answer.somethingElse);
        if (answer.somethingElse == 'Y') {
            prompts();
        } else {
            console.log("You're finished!")
        }
    })
}

function viewAllEmployees() {
    connection.query(
        `SELECT e.id, e.first_name, e.last_name, roles.title, departments.dept_name AS department, roles.salary, CONCAT(m.first_name,' ',m.last_name) AS manager
        FROM employees e
        LEFT JOIN employees m ON e.manager_id = m.id
        LEFT JOIN roles ON e.role_id = roles.id
        LEFT JOIN departments ON departments.id = roles.department_id`, 
        function(err, res) {
        // console.log('Employees');
        console.table(res);
        doSomethingElse();
    })
}

async function addEmployee() {
    connection.query(`SELECT id AS value, title AS name from roles; SELECT id AS value, CONCAT(first_name,' ',last_name) AS name FROM employees;`, function(err, results) {
        inquirer.prompt([
            {
                type: 'input',
                name: 'newEmpFirst',
                message: 'First name:'
            },
            {
                type: 'input',
                name: 'newEmpLast',
                message: 'Last name:'
            },
            {
                type: 'list',
                name: 'newEmpRole',
                message: 'Job role?',
                choices: results[0]
            },
            {
                type: 'list',
                name: 'newEmpManager',
                message: 'Who is their manager?',
                choices: results[1]
            }
        ]).then((answers) => {
            connection.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${answers.newEmpFirst}","${answers.newEmpLast}","${answers.newEmpRole}","${answers.newEmpManager}")`, function() {
                doSomethingElse();
            })
        })
    })
}

function updateRole() {
    connection.query(`SELECT id AS value, CONCAT(first_name,' ',last_name) AS name FROM employees; SELECT roles.id AS value, roles.title AS name FROM roles;`, function(err, results) {
        // console.log(results[1])
        inquirer.prompt([
            {
                type: 'list',
                name: 'updateRole',
                message: 'Select employee:',
                choices: results[0]
            },
            {
                type: 'list',
                name: 'newRole',
                message: 'Updated role:',
                choices: results[1]
            },
            {
                type: 'list',
                name: 'updateManager',
                message: 'Update manager?',
                choices: [{value: 'Y', name: 'Yes'},{value: 'N', name: 'No'}]
            }
        ]).then((answers) => {
            let updatingEmployee = answers.updateRole;
            connection.query(`UPDATE employees SET role_id = "${answers.newRole}" WHERE id = ${answers.updateRole}`);
            if (answers.updateManager == 'Y') {
                connection.query(`SELECT id AS value, CONCAT(first_name,' ', last_name) AS name FROM employees`, function(err, res) {
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'newManager',
                            message: 'New manager:',
                            choices: res
                        }
                    ]).then((answers) => {
                        connection.query(`UPDATE employees SET manager_id = ${answers.newManager} WHERE id = ${updatingEmployee}`);
                        doSomethingElse();
                    })
                    
                })
            } else {
                doSomethingElse();
            }
        })
    })
}

function viewRoles() {
    connection.query('SELECT roles.id, roles.title, departments.dept_name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id ORDER BY roles.id', function(err, res) {
        console.table(res);
        doSomethingElse();
    })
}

function addRole() {
    connection.query(`SELECT id AS value, dept_name AS name FROM departments`, function(err, res) {
        inquirer.prompt([
            {
                type: 'input',
                name: 'newRole',
                message: 'New role name:'
            },
            {
                type: 'input',
                name: 'newSalary',
                message: 'Salary:'
            },
            {
                type: 'list',
                name: 'addToDept',
                message: 'Add to department:',
                choices: res
            }
        ]).then((answers) => {
            connection.query(`INSERT INTO roles (title, salary, department_id) VALUES ("${answers.newRole}",${answers.newSalary},${answers.addToDept})`);
            doSomethingElse();
        })
    })
}

function viewDepartments() {
    connection.query('SELECT id, dept_name AS department FROM departments', function(err, res) {
        console.table(res);
        doSomethingElse();
    })
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDepartment',
            message: 'Name of department?'
        }
    ]).then((answer) => {
        const sql = `INSERT INTO departments (dept_name) VALUES (?);`
        const params = [`${answer.newDepartment}`];

        connection.query(sql, params, (err, res) => {
            console.log('Department added!');
            doSomethingElse();
        })
    })
}

function deleteEmployee(){
    connection.query(`SELECT id AS value, CONCAT(first_name,' ',last_name) AS name FROM employees`, function(err, res) {
        inquirer.prompt([
            {
                type: 'list',
                name: 'deleteEmp',
                message: 'Select employee to remove:',
                choices: res
            }
        ]).then((answers) => {
            connection.query(`DELETE FROM employees WHERE id = ${answers.deleteEmp}`);
            doSomethingElse();
        })
    })
}

function deleteRole(){
    connection.query(`SELECT id AS value, title AS name FROM roles`, function(err, res) {
        inquirer.prompt([
            {
                type: 'list',
                name: 'deleteRole',
                message: 'Select role to remove:',
                choices: res
            }
        ]).then((answers) => {
            connection.query(`DELETE FROM roles WHERE id = ${answers.deleteRole}`);
            doSomethingElse();
        })
    })
}

function deleteDepartment(){
    connection.query(`SELECT id AS value, dept_name AS name FROM departments`, function(err, res) {
        inquirer.prompt([
            {
                type: 'list',
                name: 'deleteDept',
                message: 'Select department to remove:',
                choices: res
            }
        ]).then((answers) => {
            connection.query(`DELETE FROM departments WHERE id = ${answers.deleteDept}`);
            doSomethingElse();
        })
    })
}

prompts();