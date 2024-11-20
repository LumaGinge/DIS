document.getElementById('loginform').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent default form submission

  const user = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  };

  fetch('/api/login', { // Replace with your backend login endpoint
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
        errorMessage.textContent = `Error: ${data.error}`;
      } else {
        window.location.href = '/';
      }
    })
    .catch(error => {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
    });
});
