// Sidebar toggle functionality using the hamburger icon
const menuToggle = document.getElementById('menu-toggle');
const wrapper = document.getElementById('wrapper');
menuToggle.addEventListener('click', () => {
    wrapper.classList.toggle('toggled');
});

// Event listeners for sidebar links
document.getElementById('overviewLink').addEventListener('click', function() {
    document.getElementById('overviewSection').style.display = 'block';
    document.getElementById('analyticsSection').style.display = 'none';
    document.getElementById('userManagementSection').style.display = 'none'; // Hide User Management
    setActiveLink(this);
    fetchOverviewData(); // Fetch data for overview
});

document.getElementById('userManagementLink').addEventListener('click', function() {
    document.getElementById('overviewSection').style.display = 'none'; // Hide Overview
    document.getElementById('analyticsSection').style.display = 'none'; // Hide Analytics
    document.getElementById('userManagementSection').style.display = 'block'; // Show User Management
    setActiveLink(this);
    loadUsers(); // Load users initially in User Management
});

// Event listener for the Analytics link
document.getElementById('analyticsLink').addEventListener('click', function() {
    document.getElementById('overviewSection').style.display = 'none'; // Hide Overview
    document.getElementById('userManagementSection').style.display = 'none'; // Hide User Management
    document.getElementById('analyticsSection').style.display = 'block'; // Show Analytics
    setActiveLink(this); // Set active link style
    fetchAnalyticsData(); // Fetch data for analytics if needed
});


// User Management Functionality
let users = [];

// Fetch user data from API (jsonplaceholder.typicode.com)
fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(data => {
        // Use only the first 3 users from the fetched data
        users = data.slice(0, 3).map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            status: Math.random() > 0.5 ? 'active' : 'inactive' // Random status
        }));
        loadUsers(); // Populate the user table after fetching data
    })
    .catch(error => console.error('Error fetching data:', error));



// Helper function to set the active link style
function setActiveLink(activeLink) {
    const links = document.querySelectorAll('.sidebar-link');
    links.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Load users into the table
function loadUsers() {
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = ''; // Clear existing rows

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.status}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editUser(${user.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
                <button class="btn btn-info btn-sm" onclick="toggleUserStatus(${user.id})">
                    ${user.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

// Function to toggle user status
function toggleUserStatus(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.status = user.status === 'active' ? 'inactive' : 'active'; // Toggle status
        loadUsers(); // Refresh the user table
    }
}

// Show Add User Modal
document.getElementById('addUserBtn').addEventListener('click', function () {
    const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
    modal.show();
});

// Add new user with validation
document.getElementById('addUserForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const status = document.getElementById('userStatus').value;

    // Client-side validation
    if (!name || !email || !status) {
        alert("All fields are required.");
        return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Check for duplicate email
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        alert("A user with this email already exists.");
        return;
    }

    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1, // New ID
        name: name,
        email: email,
        status: status
    };
    users.push(newUser);
    loadUsers();

    // Reset form and close modal
    this.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
    modal.hide();
});


// Function to delete a user
function deleteUser(userId) {
    users = users.filter(user => user.id !== userId);
    loadUsers();
}

// Function to edit a user
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        document.getElementById('editUserId').value = user.id; // Set hidden input for user ID
        document.getElementById('editUserName').value = user.name; // Set name
        document.getElementById('editUserEmail').value = user.email; // Set email
        document.getElementById('editUserStatus').value = user.status; // Set status
        const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
        modal.show();
    }
}

// Add event listener for the Edit User form
document.getElementById('editUserForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const id = document.getElementById('editUserId').value;
    const name = document.getElementById('editUserName').value.trim();
    const email = document.getElementById('editUserEmail').value.trim();
    const status = document.getElementById('editUserStatus').value;

    // Client-side validation
    if (!name || !email || !status) {
        alert("All fields are required.");
        return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const userIndex = users.findIndex(u => u.id == id);
    if (userIndex !== -1) {
        users[userIndex].name = name;
        users[userIndex].email = email;
        users[userIndex].status = status;
        loadUsers();
    }

    // Reset form and close modal
    this.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
    modal.hide();
});

// Variables to track sorting order
let nameSortOrder = 'asc'; // Default sorting order for name
let statusSortOrder = 'asc'; // Default sorting order for status

// Sort table function for 'Name' and 'Status'
function sortTable(column) {
    if (column === 'name') {
        users.sort((a, b) => {
            return nameSortOrder === 'asc' 
                ? a.name.localeCompare(b.name) 
                : b.name.localeCompare(a.name);
        });
        nameSortOrder = nameSortOrder === 'asc' ? 'desc' : 'asc'; // Toggle order
    } else if (column === 'status') {
        users.sort((a, b) => {
            return statusSortOrder === 'asc' 
                ? a.status.localeCompare(b.status) 
                : b.status.localeCompare(a.status);
        });
        statusSortOrder = statusSortOrder === 'asc' ? 'desc' : 'asc'; // Toggle order
    }
    loadUsers(); // Reload the sorted table
}


// Mock function to fetch data for Overview
function fetchOverviewData() {
    const mockData = [
        { active: 50, inactive: 10 },
        { active: 60, inactive: 15 },
        { active: 70, inactive: 20 },
        { active: 80, inactive: 25 },
        { active: 90, inactive: 30 },
        { active: 100, inactive: 35 },
        { active: 110, inactive: 40 },
        { active: 120, inactive: 45 },
        { active: 130, inactive: 50 },
        { active: 140, inactive: 55 },
        { active: 150, inactive: 60 },
        { active: 160, inactive: 65 }
    ];

    // For Overview Section
    const totalUsers = mockData.reduce((sum, data) => sum + data.active + data.inactive, 0);
    const activeUsers = mockData.reduce((sum, data) => sum + data.active, 0);
    const monthlyTraffic = totalUsers * 3; // Dummy traffic calculation

    document.getElementById('total-users').textContent = totalUsers;
    document.getElementById('active-users').textContent = activeUsers;
    document.getElementById('monthly-traffic').textContent = monthlyTraffic;

    // Create user distribution chart
    createUserDistributionChart(mockData);
}

// Create chart for user distribution in Overview
function createUserDistributionChart(data) {
    const ctx = document.getElementById('userDistributionChart').getContext('2d');
    const totalActive = data.reduce((sum, item) => sum + item.active, 0);
    const totalInactive = data.reduce((sum, item) => sum + item.inactive, 0);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Active Users', 'Inactive Users'],
            datasets: [{
                data: [totalActive, totalInactive],
                backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  // Allow changing aspect ratio to respect width/height
            plugins: {
                legend: {
                    position: 'top',
                },
            },
        }
    });
}


function fetchAnalyticsData() {
    const mockData = [
        { month: 'Jan', sales: 50 },
        { month: 'Feb', sales: 60 },
        { month: 'Mar', sales: 70 },
        { month: 'Apr', sales: 80 },
        { month: 'May', sales: 90 },
        { month: 'Jun', sales: 100 },
        { month: 'Jul', sales: 110 },
        { month: 'Aug', sales: 120 },
        { month: 'Sep', sales: 130 },
        { month: 'Oct', sales: 140 },
        { month: 'Nov', sales: 150 },
        { month: 'Dec', sales: 160 }
    ];

    // Create charts for Analytics
    createUserTrafficChart(mockData);
    createProductSalesChart(mockData); // Call the new function for Product Sales
}

// Create Line Chart for User Traffic Over Time
function createUserTrafficChart(data) {
    const ctx = document.getElementById('userTrafficChart').getContext('2d');
    const months = data.map(item => item.month);
    const activeUsers = data.map(item => item.sales); // Assume sales represents user traffic
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'User Traffic',
                data: activeUsers,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Months' } },
                y: { title: { display: true, text: 'Number of Users' } }
            }
        }
    });
}

// Create Bar Chart for Product Sales
function createProductSalesChart(data) {
    const ctx = document.getElementById('productSalesChart').getContext('2d');
    const months = data.map(item => item.month);
    const salesData = data.map(item => item.sales);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Product Sales',
                data: salesData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Months' } },
                y: { title: { display: true, text: 'Sales Amount' } }
            }
        }
    });
}

// Initial data fetch on page load
fetchOverviewData();