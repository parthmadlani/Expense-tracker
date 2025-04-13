// // auth.js - Handles user authentication

// // User data structure
// const users = JSON.parse(localStorage.getItem('users')) || [
//     // Default demo user
//     {
//         id: 1,
//         name: "Demo User",
//         email: "demo@example.com",
//         password: "demo123",
//         balance: 2500,
//         transactions: [
//             { id: 1, date: "2025-04-12", description: "Grocery Shopping", category: "Food", amount: -120.00, type: "expense" },
//             { id: 2, date: "2025-04-10", description: "Salary", category: "Income", amount: 2500.00, type: "income" }
//         ]
//     }
// ];

// // Check authentication state on page load
// document.addEventListener('DOMContentLoaded', function() {
//     // Redirect to dashboard if already logged in
//     if (isLoggedIn() && !window.location.pathname.includes('/dashboard.html')) {
//         redirectToDashboard();
//     }

//     // Initialize login form if exists
//     const loginForm = document.getElementById('loginForm');
//     if (loginForm) {
//         loginForm.addEventListener('submit', handleLogin);
//     }

//     // Initialize registration form if exists
//     const registerForm = document.getElementById('registerForm');
//     if (registerForm) {
//         registerForm.addEventListener('submit', handleRegister);
//     }

//     // Forgot password link
//     const forgotPassword = document.getElementById('forgotPassword');
//     if (forgotPassword) {
//         forgotPassword.addEventListener('click', function(e) {
//             e.preventDefault();
//             alert('Password reset instructions would be sent to your email in a production app');
//         });
//     }
// });

// // Check if user is logged in
// function isLoggedIn() {
//     return localStorage.getItem('isLoggedIn') === 'true';
// }

// // Get current user
// function getCurrentUser() {
//     return JSON.parse(localStorage.getItem('currentUser'));
// }

// // Handle login form submission
// function handleLogin(e) {
//     e.preventDefault();
    
//     const email = document.getElementById('loginEmail').value;
//     const password = document.getElementById('loginPassword').value;
    
//     // Find user in database
//     const user = users.find(u => u.email === email && u.password === password);
    
//     if (user) {
//         // Successful login
//         loginUser(user);
//         redirectToDashboard();
//     } else {
//         showError('Invalid email or password');
//     }
// }

// // Handle registration form submission
// function handleRegister(e) {
//     e.preventDefault();
    
//     const name = document.getElementById('registerName').value.trim();
//     const email = document.getElementById('registerEmail').value.trim();
//     const password = document.getElementById('registerPassword').value;
//     const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
//     // Validate form
//     if (!name || !email || !password || !confirmPassword) {
//         showError('All fields are required');
//         return;
//     }
    
//     if (password !== confirmPassword) {
//         showError('Passwords do not match');
//         return;
//     }
    
//     if (password.length < 6) {
//         showError('Password must be at least 6 characters');
//         return;
//     }
    
//     // Check if user already exists
//     if (users.some(u => u.email === email)) {
//         showError('Email already registered');
//         return;
//     }
    
//     // Create new user
//     const newUser = {
//         id: Date.now(),
//         name,
//         email,
//         password,
//         balance: 0,
//         transactions: []
//     };
    
//     // Add to users array and save
//     users.push(newUser);
//     localStorage.setItem('users', JSON.stringify(users));
    
//     // Log in the new user
//     loginUser(newUser);
//     redirectToDashboard();
// }

// // Login user (set session)
// function loginUser(user) {
//     localStorage.setItem('isLoggedIn', 'true');
//     localStorage.setItem('currentUser', JSON.stringify(user));
// }

// // Logout user
// function logoutUser() {
//     localStorage.removeItem('isLoggedIn');
//     localStorage.removeItem('currentUser');
//     window.location.href = '/dashboard.html';
// }

// // Redirect to dashboard
// function redirectToDashboard() {
//     window.location.href = '/dashboard.html';
// }

// // Show error message
// function showError(message) {
//     const errorElement = document.getElementById('authError') || createErrorElement();
//     errorElement.textContent = message;
//     errorElement.style.display = 'block';
// }

// // Create error element if it doesn't exist
// function createErrorElement() {
//     const errorElement = document.createElement('div');
//     errorElement.id = 'authError';
//     errorElement.style.color = '#dc3545';
//     errorElement.style.marginBottom = '15px';
//     errorElement.style.display = 'none';
    
//     const form = document.querySelector('form');
//     form.insertBefore(errorElement, form.firstChild);
//     return errorElement;
// }

// // Make logout function available globally
// window.logoutUser = logoutUser;