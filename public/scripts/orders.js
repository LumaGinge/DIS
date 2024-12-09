// orders.js

// Decode JWT function
function decodeToken(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
      return payload;
    } catch (error) {
      console.error("Error decoding token:", error.message);
      return null;
    }
  }
  
  /// Fetch and display orders for the logged-in user
function fetchAndDisplayOrdersForLoggedInUser() {
    // Fetch orders from the API with credentials included
    fetch(`/api/get-orders`, {
      method: 'GET',
      credentials: 'include', // Ensure cookies are sent automatically
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            // Unauthorized; redirect to login
            alert("Session expired. Please log in again.");
            window.location.href = "/static/login.html";
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(orders => {
        displayOrders(orders); // Display the fetched orders
      })
      .catch(err => {
        console.error("Error fetching orders:", err.message);
        alert("Failed to fetch orders. Please try again later.");
      });
  }
  
  // Display orders in the DOM
  function displayOrders(orders) {
    const ordersContainer = document.getElementById("orders-container");
    ordersContainer.innerHTML = ""; // Clear previous content
  
    if (!orders || orders.length === 0) {
      ordersContainer.innerHTML = "<p>No orders found.</p>";
      return;
    }
  
    // Iterate over each order and create DOM elements
    orders.forEach(order => {
      const orderDiv = document.createElement("div");
      orderDiv.classList.add("order");
  
      const orderHeader = document.createElement("h3");
      orderHeader.textContent = `Order ID: ${order.orderId}, Total Price: ${order.totalPrice.toFixed(2)} kr`;
      orderDiv.appendChild(orderHeader);
  
      const itemsList = document.createElement("ul");
      order.items.forEach(item => {
        const itemLi = document.createElement("li");
        itemLi.textContent = `Product ID: ${item.productId}, Quantity: ${item.quantity}, Price: ${item.price.toFixed(
          2
        )} kr, Total: ${item.total.toFixed(2)} kr`;
        itemsList.appendChild(itemLi);
      });
  
      orderDiv.appendChild(itemsList);
      ordersContainer.appendChild(orderDiv);
    });
  }
  
  // Initialize and fetch orders for the logged-in user
  fetchAndDisplayOrdersForLoggedInUser();
  