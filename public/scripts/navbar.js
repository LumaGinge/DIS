document.addEventListener('DOMContentLoaded', async () => { //venter på at DOM er loaded før den kører koden med async
  const authLink = document.getElementById('authLink'); //henter elementet med id authLink fra DOM
  if (!authLink) {
    console.error('authLink element not found in the DOM.');
    return;
  }

  try {
    const response = await fetch('/api/user', { //Bruger fetch til at hente bruger data fra serveren
      method: 'GET',
      credentials: 'include',
    });
    //Hvis brugeren er logget ind, så vises link til profile, ellers vises link til signup siden
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
