document.getElementById('loginform').addEventListener('submit', async (event) => {
  event.preventDefault();

  //henter input værdierne
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    // fetch til serveren for at logge ind med email og password
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
    //
    const loginData = await loginResponse.json();
    const phoneNumber = loginData.phoneNumber; //henter telefonnummer fra login data for at sende OTP

    // otp sendes med twilio til telefonnummeret fra databasen
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
    // prompt for at indtaste OTP
    const otp = prompt('Enter the OTP sent to your phone:');
    if (!otp) {
      alert('You must enter an OTP to proceed.');
      return;
    }
    // otp verifikation af den indtastede OTP
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

    // hvis OTP er verificeret, så logges brugeren
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
    window.location.href = '/';
  } catch (error) {
    console.error('Error:', error.message);
    alert('An error occurred. Please try again.');
  }
});
