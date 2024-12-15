document.addEventListener('DOMContentLoaded', async () => {
  async function fetchUserData() {
    try {
      const response = await fetch('/api/user', { //henter bruger data fra serveren med route /api/user som er en beskyttet route
        method: 'GET',
        credentials: 'include', 
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: HTTP ${response.status}`);
      }
  
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      return null;
    }
  }
  
  const user = await fetchUserData(); // vent på at brugerdata er hentet
  if (user) {
    document.getElementById('name').textContent = `Name: ${user.firstName} ${user.lastName}`;
    document.getElementById('userEmail').textContent = `Email: ${user.email}`;
    document.getElementById('phone').textContent = `Phone: ${user.phoneNumber || 'Not provided'}`;
  } else {
    Redirect('/static/signup.html'); // hvis brugerdata ikke er hentet, så sendes brugeren til signup siden
  }

  // logud knap
  document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST', credentials: 'include' }); // fetch til serveren for at logge brugeren ud
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
