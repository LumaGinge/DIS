document.addEventListener('DOMContentLoaded', () => {
  console.log('All cookies:', document.cookie); // Log raw cookie string

  // Function to get a cookie by name
  function getCookie(name) {
    console.log('All cookies (raw):', document.cookie); // Debug all cookies
    if (!document.cookie) {
      console.log('No cookies found.');
      return null;
    }

    const cookies = document.cookie.split('; ').filter(Boolean); // Remove empty strings
    console.log('Parsed cookies array:', cookies);

    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      console.log(`Checking cookie: ${key} = ${value}`);
      if (key === name) {
        try {
          const decodedValue = decodeURIComponent(value);
          console.log(`Decoded cookie value for ${name}:`, decodedValue);
          return JSON.parse(decodedValue); // Parse JSON cookie value
        } catch (err) {
          console.error('Error parsing cookie value:', err);
          return null;
        }
      }
    }

    console.log(`Cookie ${name} not found.`);
    return null;
  }

  // Check if user is logged in
  const user = getCookie('user'); // Get the 'user' cookie
  console.log('User from cookie:', user); // Debug: Log the user data

  // Update UI based on login state
  if (user) {
    console.log('User is logged in. Updating UI...');
    document.getElementById('userInfoContainer').style.display = 'block';
    document.getElementById('registerContainer').style.display = 'none';

    document.getElementById('name').textContent = `Name: ${user.firstName} ${user.lastName}`;
    document.getElementById('userEmail').textContent = `Email: ${user.email}`;
    document.getElementById('phone').textContent = `Phone: ${user.phoneNumber || 'Not provided'}`;
  } else {
    console.log('No user found. Showing registration form...');
    document.getElementById('userInfoContainer').style.display = 'none';
    document.getElementById('registerContainer').style.display = 'block';
  }

  // Function to log out the user
  function logoutUser() {
    console.log('Attempting to log out user...');
    fetch('/api/logout', {
      method: 'POST',
      credentials: 'include', // Include cookies in the request
    })
      .then((response) => {
        if (response.ok) {
          console.log('User logged out successfully');
          // Clear local UI state
          document.getElementById('userInfoContainer').style.display = 'none';
          document.getElementById('registerContainer').style.display = 'block';
          location.reload(); // Reload the page
        } else {
          console.error('Logout failed:', response.statusText);
          alert('Failed to log out. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error during logout request:', error);
        alert('Logout error. Please try again.');
      });
  }

  // Attach event listener to logout button
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      console.log('Logout button clicked'); // Debugging
      logoutUser(); // Call the logout function
    });
  } else {
    console.log('Logout button not found'); // Debugging
  }

  // Handle signup form submission
  document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const countryCode = document.getElementById('countryCode').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const fullPhoneNumber = countryCode + phoneNumber;

    const user = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phoneNumber: fullPhoneNumber,
      password: document.getElementById('password').value,
    };

    console.log('Submitting user data:', user); // Debug log

    fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error('Error during signup:', data.error); // Debug log
          alert(`Signup failed: ${data.error}`);
        } else {
          console.log('Signup successful:', data); // Debug log

          // Set cookies with user data and token
          document.cookie = `user=${encodeURIComponent(
            JSON.stringify({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber,
            })
          )}; path=/; max-age=3600;`; // 1-hour expiry

          document.cookie = `jwtToken=${data.token}; path=/; HttpOnly; max-age=3600;`; // JWT cookie

          // Redirect or update UI
          window.location.href = '/'; // Reload or redirect to the homepage
        }
      })
      .catch((error) => {
        console.error('Signup request failed:', error); // Debug log
        alert('Signup request failed. Please try again.');
      });
  });
});

