document.addEventListener('DOMContentLoaded', async () => {
  const authLink = document.getElementById('authLink');
  if (!authLink) {
    console.error('authLink element not found in the DOM.');
    return;
  }

  try {
    const response = await fetch('/api/user', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    });

    if (response.ok) {
      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();

        authLink.innerHTML = `<a href="/protected/profile">Profile</a>`;
        authLink.style.display = 'block';
      } else {
        authLink.innerHTML = `<a href="/static/signup.html">Signup</a>`;
        authLink.style.display = 'block';
      }
    } else {
      console.log('User is not logged in or request failed.');
      authLink.innerHTML = `<a href="/static/signup.html">Signup</a>`;
      authLink.style.display = 'block';
    }
  } catch (error) {
    console.error('Error checking user login state:', error.message);
    authLink.innerHTML = `<a href="/static/signup.html">Signup</a>`;
    authLink.style.display = 'block';
  }
});
