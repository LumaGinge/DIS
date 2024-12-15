document.getElementById('loginform').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    // Validering af email og password
    const loginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      alert(`Error: ${errorData.error}`);
      return;
    }

    const loginData = await loginResponse.json();
    const phoneNumber = loginData.phoneNumber;

    // Sender onetime password til telefonnummeret med Twilio
    const otpResponse = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber }),
    });

    if (!otpResponse.ok) {
      const errorData = await otpResponse.json();
      alert(`Error: ${errorData.error}`);
      return;
    }
    // Prompt brugeren til at indtaste OTP 
    const otp = prompt('Enter the OTP sent to your phone:');
    if (!otp) {
      alert('You must enter an OTP to proceed.');
      return;
    }
    // Verificerer OTP med Twilio
    const verifyResponse = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, otp }),
    });

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      alert(`Error: ${errorData.error}`);
      return;
    }

    // Bruger er nu verificeret og kan logge ind og får en JWT
    const finalLoginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otpVerified: true }),
    });

    if (!finalLoginResponse.ok) {
      const errorData = await finalLoginResponse.json();
      alert(`Error: ${errorData.error}`);
      return;
    }

    alert('Login successful!');
    window.location.href = '/'; // Redirect til forsiden
  } catch (error) {
    console.error('Error:', error.message);
    alert('An error occurred. Please try again.');
  }

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
