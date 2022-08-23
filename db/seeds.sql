INSERT INTO departments (dept_name)
VALUES  ("Sales"),
        ("Engineering"),
        ("Finance");

INSERT INTO roles (title, salary, department_id)
VALUES  ("Sales Manager",           90000,  1),
        ("Salesperson",             70000,  1),
        ("After Sales Consultant",  70000,  1),
        ("Software Manager",        100000, 2),
        ("Software Engineer",       90000,  2),
        ("Software Trainee",        70000,  2),
        ("Accounts Manager",        90000,  3),
        ("Accountant",              75000,  3),
        ("Accounts Assistant",      60000,  3),
        ("Team Manager",            110000, NULL);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ("Bentley", "Thomson",      10, NULL),
        ("Bradley", "Haupt",        1,  1),
        ("Rebecca", "Emes",         2,  2),
        ("Caroline", "Thomson",     4,  1),
        ("Daniel", "Kain",          5,  4),
        ("Nima-Jon", "Thomson",     5,  4),
        ("Simone", "Van Zoeren",    6,  4),
        ("Jordon", "Oreilly",       7,  1),
        ("Bella", "Patterson",      8,  8),
        ("Sadie", "Thomson",        9,  7);