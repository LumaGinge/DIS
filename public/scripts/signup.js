// Handle registration form submission

document.getElementById('registerForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  // henter værdierne fra input felterne
  const countryCode = document.getElementById('countryCode').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const fullPhoneNumber = countryCode + phoneNumber;

  try {
      // fetch til serveren for at sende OTP med det indtastede telefonnummer
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

      // prompt for at indtaste OTP der er sendt til telefonen
      const otp = prompt('Please enter the OTP sent to your phone:');
      if (!otp) {
          throw new Error('You must enter an OTP to proceed.');
      }

      // otp verifikation
      const verifyResponse = await fetch('/api/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: fullPhoneNumber, otp }),
      });

      if (!verifyResponse.ok) {
          throw new Error('OTP verification failed. Please try again.');
      }

      alert('OTP verified successfully! Proceeding with signup.');

      // når otp er verificeret, så kan brugeren oprettes
      const user = {
          firstName: document.getElementById('firstName').value,
          lastName: document.getElementById('lastName').value,
          email: document.getElementById('email').value,
          phoneNumber: fullPhoneNumber,
          password: document.getElementById('password').value,
      };

      const signupResponse = await fetch('/api/signup', { // fetch til serveren for at oprette brugeren
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
      });

      if (!signupResponse.ok) {
          throw new Error('Signup failed. Please try again.');
      }
      window.location.href = '/'; // brugeren dirigeres til forsiden efter oprettelse
  } catch (error) {
      console.error('Error:', error.message);
      alert(error.message);
  }
});