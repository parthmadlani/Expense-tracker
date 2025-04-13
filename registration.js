document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User created successfully
        alert('Registration successful!');
        window.location.href = '/dashboard.html'; // Go to dashboard
      })
      .catch((error) => {
        alert(error.message); // Show error if registration fails
      });
  });