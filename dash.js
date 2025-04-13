document.addEventListener('DOMContentLoaded', function() {
    // Data Storage
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [
        { id: 1, date: "2025-04-12", description: "Grocery Shopping", category: "Food", amount: -120.00, type: "expense" },
        { id: 2, date: "2025-04-10", description: "Salary", category: "Income", amount: 2500.00, type: "income" },
        { id: 3, date: "2025-04-08", description: "Electric Bill", category: "Utilities", amount: -80.00, type: "expense" }
    ];
    
    const categories = ["Food", "Transport", "Utilities", "Entertainment", "Shopping", "Others"];
    
    // DOM Elements
    const transactionsBody = document.getElementById('transactions-body');
    const totalIncomeElement = document.getElementById('total-income');
    const totalExpenseElement = document.getElementById('total-expense');
    const totalBalanceElement = document.getElementById('total-balance');
    const viewAllBtn = document.getElementById('view-all-btn');
    const addExpenseBtn = document.getElementById('add-expense-btn');
    const notificationBadge = document.querySelector('.notification .badge');
    const modal = document.getElementById('transaction-modal');
    const modalTitle = document.getElementById('modal-title');
    const transactionForm = document.getElementById('transaction-form');
    const transactionIdInput = document.getElementById('transaction-id');
    const transactionTypeInput = document.getElementById('transaction-type');
    const transactionAmountInput = document.getElementById('transaction-amount');
    const transactionDescriptionInput = document.getElementById('transaction-description');
    const transactionCategoryInput = document.getElementById('transaction-category');
    const transactionDateInput = document.getElementById('transaction-date');
    const closeBtn = document.querySelector('.close-btn');
    
    // Initialize the dashboard
    function initDashboard() {
        updateTransactionList();
        updateSummary();
        initCharts();
        initParticles();
        setupEventListeners();
    }
    
    // Update transaction list
    function updateTransactionList(showAll = false) {
        transactionsBody.innerHTML = '';
        const transactionsToShow = showAll ? transactions : transactions.slice(0, 5);
        
        if (transactionsToShow.length === 0) {
            transactionsBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No transactions found</td></tr>';
            return;
        }
        
        transactionsToShow.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(transaction.date)}</td>
                <td>${transaction.description}</td>
                <td>${transaction.category}</td>
                <td class="${transaction.type === 'income' ? 'income-amount' : 'expense-amount'}">
                    ${transaction.type === 'income' ? '+' : '-'}$${Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td>
                    <button class="action-btn edit" data-id="${transaction.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" data-id="${transaction.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            transactionsBody.appendChild(row);
        });
        
        viewAllBtn.style.display = showAll || transactions.length <= 5 ? 'none' : 'block';
    }
    
    // Update summary cards
    function updateSummary() {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const balance = income - expense;
        
        totalIncomeElement.textContent = `$${income.toFixed(2)}`;
        totalExpenseElement.textContent = `$${expense.toFixed(2)}`;
        totalBalanceElement.textContent = `$${balance.toFixed(2)}`;
    }
    
    // Initialize charts
    function initCharts() {
        // Expense Chart
        const expenseCtx = document.getElementById('expenseChart');
        if (expenseCtx) {
            new Chart(expenseCtx, {
                type: 'line',
                data: getExpenseChartData(),
                options: getChartOptions('Income vs Expenses')
            });
        }
        
        // Category Chart
        const categoryCtx = document.getElementById('categoryChart');
        if (categoryCtx) {
            new Chart(categoryCtx, {
                type: 'doughnut',
                data: getCategoryChartData(),
                options: getChartOptions('Expense Categories', false)
            });
        }
    }
    
    // Get data for expense chart
    function getExpenseChartData() {
        // Group by month (simplified for demo)
        const monthlyData = {
            income: [1200, 1900, 1500, 2000, 1800, 2200],
            expense: [800, 1200, 1000, 1400, 1100, 1600]
        };
        
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Income',
                data: monthlyData.income,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                tension: 0.3,
                fill: true
            }, {
                label: 'Expenses',
                data: monthlyData.expense,
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                tension: 0.3,
                fill: true
            }]
        };
    }
    
    // Get data for category chart
    function getCategoryChartData() {
        const categoryTotals = {};
        categories.forEach(cat => {
            categoryTotals[cat] = transactions
                .filter(t => t.type === 'expense' && t.category === cat)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        });
        
        return {
            labels: categories,
            datasets: [{
                data: categories.map(cat => categoryTotals[cat] || 0),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ],
                borderWidth: 0
            }]
        };
    }
    
    // Common chart options
    function getChartOptions(title, showLegend = true) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: showLegend,
                    position: 'right',
                    labels: {
                        color: '#fff'
                    }
                },
                title: {
                    display: !!title,
                    text: title,
                    color: '#fff',
                    font: {
                        size: 16
                    }
                }
            }
        };
    }
    
    // Initialize particles
    function initParticles() {
        if (document.getElementById('particles-js')) {
            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 60,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: '#FFD700'
                    },
                    shape: {
                        type: 'circle'
                    },
                    opacity: {
                        value: 0.3,
                        random: false,
                        anim: {
                            enable: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#FFD700',
                        opacity: 0.2,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1.5,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: true,
                            mode: 'grab'
                        },
                        onclick: {
                            enable: true,
                            mode: 'push'
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            line_linked: {
                                opacity: 0.5
                            }
                        },
                        push: {
                            particles_nb: 4
                        }
                    }
                },
                retina_detect: true
            });
        }
    }
    
    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    // Open modal for adding transaction
    function openAddTransactionModal() {
        modalTitle.textContent = 'Add New Transaction';
        transactionIdInput.value = '';
        transactionTypeInput.value = 'expense';
        transactionAmountInput.value = '';
        transactionDescriptionInput.value = '';
        transactionCategoryInput.value = 'Food';
        transactionDateInput.value = new Date().toISOString().split('T')[0];
        modal.style.display = 'block';
    }
    
    // Open modal for editing transaction
    function openEditTransactionModal(id) {
        const transaction = transactions.find(t => t.id === id);
        if (!transaction) return;
        
        modalTitle.textContent = 'Edit Transaction';
        transactionIdInput.value = transaction.id;
        transactionTypeInput.value = transaction.type;
        transactionAmountInput.value = Math.abs(transaction.amount);
        transactionDescriptionInput.value = transaction.description;
        transactionCategoryInput.value = transaction.category;
        transactionDateInput.value = transaction.date;
        modal.style.display = 'block';
    }
    
    // Save transaction (add or update)
    function saveTransaction(e) {
        e.preventDefault();
        
        const id = transactionIdInput.value ? parseInt(transactionIdInput.value) : Date.now();
        const type = transactionTypeInput.value;
        const amount = parseFloat(transactionAmountInput.value);
        const description = transactionDescriptionInput.value;
        const category = transactionCategoryInput.value;
        const date = transactionDateInput.value;
        
        const transaction = {
            id,
            date,
            description,
            category,
            amount: type === 'income' ? amount : -amount,
            type
        };
        
        if (transactionIdInput.value) {
            // Update existing transaction
            const index = transactions.findIndex(t => t.id === id);
            if (index !== -1) {
                transactions[index] = transaction;
            }
        } else {
            // Add new transaction
            transactions.unshift(transaction);
        }
        
        // Save to localStorage
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        // Update UI
        updateTransactionList();
        updateSummary();
        initCharts();
        
        // Close modal
        modal.style.display = 'none';
    }
    
    // Delete transaction
    function deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            transactions = transactions.filter(t => t.id !== id);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            updateTransactionList();
            updateSummary();
            initCharts();
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Add transaction button
        addExpenseBtn.addEventListener('click', openAddTransactionModal);
        
        // View all transactions button
        viewAllBtn.addEventListener('click', () => updateTransactionList(true));
        
        // Close modal button
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Form submission
        transactionForm.addEventListener('submit', saveTransaction);
        
        // Edit/Delete buttons (event delegation)
        transactionsBody.addEventListener('click', (e) => {
            if (e.target.closest('.edit')) {
                const id = parseInt(e.target.closest('.edit').dataset.id);
                openEditTransactionModal(id);
            } else if (e.target.closest('.delete')) {
                const id = parseInt(e.target.closest('.delete').dataset.id);
                deleteTransaction(id);
            }
        });
        
        // Notification button
        document.querySelector('.notification').addEventListener('click', () => {
            alert('You have 3 new notifications');
            notificationBadge.style.display = 'none';
        });
    }
    
    // Initialize the dashboard
    initDashboard();
});

auth.onAuthStateChanged(user => {
    if (!user) {
      // No user is signed in, redirect to login
      window.location.href = 'login.html';
    } else {
      // User is signed in, load their data
      loadUserData(user.uid);
    }
  });

  function addExpense() {
    const amount = document.getElementById('expenseAmount').value;
    const category = document.getElementById('expenseCategory').value;
    const date = document.getElementById('expenseDate').value;
    
    const userId = auth.currentUser.uid;
    
    db.collection('expenses').add({
      userId: userId,
      amount: parseFloat(amount),
      category: category,
      date: date,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      alert('Expense added!');
      updateExpenseList(); // Refresh the list
      updateCharts(); // Update the charts
    })
    .catch(error => {
      alert('Error adding expense: ' + error.message);
    });
  }

  function updateExpenseList() {
    const userId = auth.currentUser.uid;
    const expenseList = document.getElementById('expenseList');
    
    expenseList.innerHTML = ''; // Clear current list
    
    db.collection('expenses')
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .limit(10) // Show only 10 most recent
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const expense = doc.data();
          const expenseItem = document.createElement('div');
          expenseItem.className = 'expense-item';
          expenseItem.innerHTML = `
            <span>${expense.category}: $${expense.amount}</span>
            <span>${expense.date}</span>
            <button onclick="deleteExpense('${doc.id}')">Delete</button>
          `;
          expenseList.appendChild(expenseItem);
        });
      });
  }

  function deleteExpense(expenseId) {
    if (confirm('Are you sure you want to delete this expense?')) {
      db.collection('expenses').doc(expenseId).delete()
        .then(() => {
          updateExpenseList(); // Refresh the list
          updateCharts(); // Update the charts
        });
    }
  }

  <><canvas id="expenseChart"></canvas><canvas id="incomeChart"></canvas><script src="https://cdn.jsdelivr.net/npm/chart.js"></script></>

  let expenseChart, incomeChart;

function updateCharts() {
  const userId = auth.currentUser.uid;
  
  // Get expenses data
  db.collection('expenses')
    .where('userId', '==', userId)
    .get()
    .then(querySnapshot => {
      const expenses = [];
      querySnapshot.forEach(doc => {
        expenses.push(doc.data());
      });
      
      // Prepare data for charts
      const categories = [...new Set(expenses.map(e => e.category))];
      const amountsByCategory = categories.map(cat => 
        expenses.filter(e => e.category === cat)
                .reduce((sum, e) => sum + e.amount, 0)
      );
      
      // Create or update expense chart
      const ctx = document.getElementById('expenseChart').getContext('2d');
      if (expenseChart) {
        expenseChart.data.labels = categories;
        expenseChart.data.datasets[0].data = amountsByCategory;
        expenseChart.update();
      } else {
        expenseChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: categories,
            datasets: [{
              label: 'Expenses by Category',
              data: amountsByCategory,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    });
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        window.location.href = 'login.html';
      })
      .catch(error => {
        alert('Error signing out: ' + error.message);
      });
  });
   
  auth.onAuthStateChanged(user => {
    if (user) {
      document.getElementById('userEmail').textContent = user.email;
      // ... rest of your code
    }
  });