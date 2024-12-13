document.addEventListener('DOMContentLoaded', async () => {
  async function fetchUserData() {
    try {
      const response = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: HTTP ${response.status}`);
      }
  
      const data = await response.json();
      console.log('User data from server:', data.user);
      return data.user;
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      return null;
    }
  }
  
  const user = await fetchUserData(); // Fetch user data from the server
  if (user) {
    console.log('User is logged in:', user);

    const signupLink = document.querySelector('a[href="/static/signup.html"]');
    if (signupLink) {
      signupLink.textContent = 'Profile';
      signupLink.href = '/protected/profile'; // Adjust this URL to your actual profile page

    // Update UI for logged-in state
    document.getElementById('userInfoContainer').style.display = 'block';
    document.getElementById('registerContainer').style.display = 'none';

    document.getElementById('name').textContent = `Name: ${user.firstName} ${user.lastName}`;
    document.getElementById('userEmail').textContent = `Email: ${user.email}`;
    document.getElementById('phone').textContent = `Phone: ${user.phoneNumber || 'Not provided'}`;
  } else {
    console.log('No user found. Showing registration form.');

    // Update UI for logged-out state
    document.getElementById('userInfoContainer').style.display = 'none';
    document.getElementById('registerContainer').style.display = 'block';
  }}

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

  
  // Handle registration form submission

  document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Collect user data
    const countryCode = document.getElementById('countryCode').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const fullPhoneNumber = countryCode + phoneNumber;

    try {
        // Step 1: Send OTP in the background
        fetch('/api/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to send OTP. Please try again.');
                }
                console.log('OTP sent successfully!');
            })
            .catch((error) => {
                console.error('Error sending OTP:', error.message);
                alert('Error sending OTP. Please try again.');
            });

        // Step 2: Prompt user to enter OTP immediately
        const otp = prompt('Please enter the OTP sent to your phone:');
        if (!otp) {
            throw new Error('You must enter an OTP to proceed.');
        }

        // Step 3: Verify OTP
        const verifyResponse = await fetch('/api/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: fullPhoneNumber, otp }),
        });

        if (!verifyResponse.ok) {
            throw new Error('OTP verification failed. Please try again.');
        }

        alert('OTP verified successfully! Proceeding with signup.');

        // Step 4: Complete Signup
        const user = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phoneNumber: fullPhoneNumber,
            password: document.getElementById('password').value,
        };

        const signupResponse = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });

        if (!signupResponse.ok) {
            throw new Error('Signup failed. Please try again.');
        }
        window.location.href = '/'; // Redirect to homepage
    } catch (error) {
        console.error('Error:', error.message);
        alert(error.message);
    }
});
});
