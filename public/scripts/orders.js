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
  
  // Fetch and display orders for the logged-in user
  function fetchAndDisplayOrdersForLoggedInUser() {
    // Retrieve JWT from cookies
    const jwtToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('jwtToken='))
      ?.split('=')[1];
  
    if (!jwtToken) {
      console.error("JWT not found! Cannot fetch orders.");
      return;
    }
  
    const user = decodeToken(jwtToken); // Decode the JWT to get user data
    if (!user || !user.id) {
      console.error("Invalid JWT! Cannot fetch orders.");
      return;
    }
  
    fetchAndDisplayOrders(jwtToken, user.id);
  }
  
  // Fetch and display orders
  function fetchAndDisplayOrders(jwtToken, userId) {
    console.log("Fetching orders for userId:", userId);
  
    fetch(`/api/get-orders`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`, // Include JWT in Authorization header
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(orders => {
        displayOrders(orders); // Display the fetched orders
      })
      .catch(err => console.error("Error fetching orders:", err.message));
  }
  
  // Display orders in the DOM
  function displayOrders(orders) {
    const ordersContainer = document.getElementById("orders-container");
    ordersContainer.innerHTML = ""; // Clear previous content
  
    if (orders.length === 0) {
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
  
  