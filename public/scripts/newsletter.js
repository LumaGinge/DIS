
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('newsletter-form');
  const messageBox = document.getElementById('message-box'); //henter message-box fra html

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // forhindrer refresh

    // viser loading besked
    displayMessage('Submitting...', 'loading');

    const email = document.getElementById('email').value; //henter email fra input felt

    try {
      const response = await fetch('/newsletter/subscribe', { //fetcher data fra server
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }) //sender email til server
      });

      const data = await response.json(); //konverterer data til json
      if (response.ok) { //hvis response er ok
        displayMessage(`Success! ${data.message} Check your email for a welcome message and coupon code.`, 'success');
      } else {
        displayMessage(data.message, 'error');
      }
    } catch (error) { //hvis der er en fejl
      console.error('Error:', error);
      displayMessage('Subscription failed. Please try again later.', 'error');
    }
  }); 

  // Function to display messages on the page
  function displayMessage(message, type) {
    messageBox.textContent = message; // tag besked fra server og vis i message-box
    messageBox.className = ''; // fjerner alle classes fra message-box
    messageBox.classList.add('message-box', type === 'success' ? 'success' : type === 'error' ? 'error' : 'loading');
  }
});
