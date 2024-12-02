document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
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
   
    console.log('User data:', user); // Log user data to debug
   
    fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
  })
      .then(response => response.json())
      .then(data => {
          if (data.error) {
              alert(`Error registering user: ${data.error}`);
          } else {
              // Save user data in a cookie or localStorage
              document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/;`;
              console.log('User stored in cookie:', user);
              window.location.href = '/';
          }
      })
      .catch(error => {
          console.error('Registration error:', error);
          alert('Error registering user. Please try again.');
      });
  
   });
  
   function logoutUser() {
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    alert('You have been logged out.');
    location.reload();
  }
  
   document.addEventListener('DOMContentLoaded', () => {
    console.log('All cookies:', document.cookie); // Log raw cookie string
    // Function to get a cookie by name
    function getCookie(name) {
      console.log('All cookies (raw):', document.cookie); // Log raw cookies
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
      
  
      const user = getCookie('user'); // Get the 'user' cookie
      console.log('User from cookie:', user); // Debug: Log the user data
      // Display user info
      if (user) {
        // Display user info
        console.log('User is logged in. Updating UI...');
        document.getElementById('userInfoContainer').style.display = 'block';
        document.getElementById('registerContainer').style.display = 'none';
    
        document.getElementById('name').textContent = `Name: ${user.firstName} ${user.lastName}`;
        document.getElementById('userEmail').textContent = `Email: ${user.email}`; // Updated ID
        document.getElementById('phone').textContent = `Phone: ${user.phoneNumber || 'Not provided'}`;
  
        const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      console.log('Logout button clicked'); // Debugging
      logoutUser(); // Call the logout function
    });
  } else {
    console.log('Logout button not found'); // Debugging
  }
   
  }});