document.getElementById('loginform').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent default form submission

  const user = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  };

  fetch('/api/login', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
    credentials: 'include', // Ensures cookies are sent
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
        errorMessage.textContent = `Error: ${data.error}`;
      } else {
        window.location.href = 'signup.html';
      }
    })
    .catch(error => {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
    });

    fetch('/protected/endpoint', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          console.log('User is authenticated');
        } else {
          console.log('User is not authenticated');
        }
      })
      .catch((error) => {
        console.error('Error verifying authentication:', error);
      });
});
