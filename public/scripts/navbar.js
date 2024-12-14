document.addEventListener('DOMContentLoaded', async () => {
  const authLink = document.getElementById('authLink');

  try {
    // Check if the user is logged in
    const response = await fetch('/api/user', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    });

    if (response.ok) {
      const user = await response.json();
      console.log('User is logged in:', user);

      // Change "Signup" to "Profile"
      authLink.innerHTML = `<a href="/protected/profile">Profile</a>`;
    } else {
      console.log('User is not logged in.');
      // Keep the "Signup" link
      authLink.innerHTML = `<a href="/static/signup.html">Signup</a>`;
    }
  } catch (error) {
    console.error('Error checking user login state:', error.message);
    // Default to "Signup" link if an error occurs
    authLink.innerHTML = `<a href="/static/signup.html">Signup</a>`;
  }
});
