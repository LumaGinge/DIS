document.getElementById('registerForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const user = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
  };
 
 
  fetch('/api/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user)
  })
  .then(response => response.json())
  .then(data => {
      if (data.error) {
          alert(`Error registering user: ${data.error}`);
      } else {
        window.location.href = '/';
      }
  })
  .catch(error => {
      console.error('Registration error:', error);
      alert("Error registering user. Please try again.");
  });
 });
 
 
 