document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Login successful
        window.location.href = '/dashboard.html'; // Go to dashboard
      })
      .catch((error) => {
        alert(error.message); // Show error if login fails
      });
  });