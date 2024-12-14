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
    document.getElementById('name').textContent = `Name: ${user.firstName} ${user.lastName}`;
    document.getElementById('userEmail').textContent = `Email: ${user.email}`;
    document.getElementById('phone').textContent = `Phone: ${user.phoneNumber || 'Not provided'}`;
  } else {
    console.log('No user found. Showing registration form.');
    Redirect('/static/signup.html');
  }

  // Logout
  document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST', credentials: 'include' });
      if (response.ok) {
        alert('Logged out successfully!');
        window.location.href = '/static/signup.html';
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error.message);
      alert(error.message);
    }
  });
});
