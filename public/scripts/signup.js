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