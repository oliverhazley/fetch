import '../css/style.css';

// src/js/main.js
import { apiRequest } from './fetch.js';
import { showSnackbar } from "./fetch.js";

// Fetch Items
const fetchItems = async () => {
    const itemsTable = document.getElementById('items-table');
    const tbody = itemsTable.querySelector('tbody');

    try {
        const response = await apiRequest('/items');
        console.log('Fetched items:', response);  // ✅ Confirm API response structure

        // Access items from the 'data' property
        const itemsArray = response.data || [];

        // Clear previous items
        tbody.innerHTML = '';

        itemsArray.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.description || 'N/A'}</td>
                <td>${item.id}</td>
            `;
            tbody.appendChild(row);
        });

        itemsTable.style.display = 'table';
        showSnackbar('Items fetched successfully!');
    } catch (error) {
        console.error('Error fetching items:', error);
        showSnackbar(`Error fetching items: ${error.message}`);
        itemsTable.style.display = 'none';
    }
};

document.getElementById('fetch-items-btn')?.addEventListener('click', fetchItems);

// Fetch Users
const fetchUsers = async () => {
    const users = await apiRequest('/users');
    const table = document.getElementById('users-table');
    table.innerHTML = `
        <tr>
            <th>Username</th>
            <th>Email</th>
            <th>ID</th>
            <th>Info</th>
            <th>Delete</th>
        </tr>
    `; // Add header with ID

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.id}</td>  <!-- ✅ Display User ID -->
            <td><button class="check" data-id="${user.id}">Info</button></td>
            <td><button class="del" data-id="${user.id}">Delete</button></td>
        `;
        table.appendChild(row);
    });

    addEventListeners();
};


document.getElementById('fetch-users-btn')?.addEventListener('click', fetchUsers);

// Add User
const addUser = async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const email = document.getElementById('email').value.trim();

    const newUser = await apiRequest('/users', 'POST', { username, password, email });
    showSnackbar(`User ${newUser.username} added successfully!`);
    await fetchUsers();
};

document.getElementById('add-user-form')?.addEventListener('submit', addUser);

// Info & Delete Buttons
const addEventListeners = () => {
    document.querySelectorAll('.check').forEach(button => {
        button.addEventListener('click', async (event) => {
            const userId = event.target.dataset.id;
            try {
                const user = await apiRequest(`/users/${userId}`);
                showSnackbar(`User Info: Username - ${user.username}, Email - ${user.email}`);
            } catch (error) {
                showSnackbar(`Error fetching user: ${error.message}`);
            }

        });
    });

    document.querySelectorAll('.del').forEach(button => {
        button.addEventListener('click', async (e) => {
            const userId = e.target.dataset.id;
            await apiRequest(`/users/${userId}`, 'DELETE');
            showSnackbar('User deleted successfully');
            await fetchUsers();
        });
    });
};

document.getElementById('search-user-btn')?.addEventListener('click', async () => {
    const userId = document.getElementById('search-user-id').value.trim();
    const resultTable = document.getElementById('search-result-table');
    const tbody = resultTable.querySelector('tbody');

    if (!userId) {
        showSnackbar('Please enter a valid User ID.');
        return;
    }

    try {
        const user = await apiRequest(`/users/${userId}`);
        showSnackbar(`User Found: Username - ${user.username}, Email - ${user.email}`);

        // Clear previous search results
        tbody.innerHTML = '';

        // Add the user details to the table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.id}</td>
        `;
        tbody.appendChild(row);

        // Show the table
        resultTable.style.display = 'table';
    } catch (error) {
        showSnackbar(`Error: ${error.message}`);
        resultTable.style.display = 'none';
    }
});
