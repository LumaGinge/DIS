// public/scripts/newsletter.js
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('newsletter-form');
  const messageBox = document.getElementById('message-box');

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent page reload

    // Show loading message
    displayMessage('Submitting...', 'loading');

    const email = document.getElementById('email').value;

    try {
      const response = await fetch('/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok) {
        displayMessage(`Success! ${data.message} Check your email for a welcome message and coupon code.`, 'success');
      } else {
        displayMessage(data.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      displayMessage('Subscription failed. Please try again later.', 'error');
    }
  });

  // Function to display messages on the page
  function displayMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = ''; // Reset classes
    messageBox.classList.add('message-box', type === 'success' ? 'success' : type === 'error' ? 'error' : 'loading');
  }
});
