function fetchAndDisplayOrders(userId) {
  fetch(`/api/get-orders/${userId}`)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(orders => {
          displayOrders(orders); // Display the orders
      })
      .catch(err => console.error("Error fetching orders:", err.message));
}

function displayOrders(orders) {
  const ordersContainer = document.getElementById("orders-container");
  ordersContainer.innerHTML = ""; // Clear previous content

  if (orders.length === 0) {
      ordersContainer.innerHTML = "<p>No orders found.</p>";
      return;
  }

  orders.forEach(order => {
      const orderDiv = document.createElement("div");
      orderDiv.classList.add("order");

      const orderHeader = document.createElement("h3");
      orderHeader.textContent = `Order ID: ${order.orderId}, Total Price: ${order.totalPrice.toFixed(2)} kr`;
      orderDiv.appendChild(orderHeader);

      const itemsList = document.createElement("ul");
      order.items.forEach(item => {
          const itemLi = document.createElement("li");
          itemLi.textContent = `Product ID: ${item.productId}, Quantity: ${item.quantity}, Price: ${item.price.toFixed(2)} kr, Total: ${item.total.toFixed(2)} kr`;
          itemsList.appendChild(itemLi);
      });

      orderDiv.appendChild(itemsList);
      ordersContainer.appendChild(orderDiv);
  });
}

// Example: Fetch orders for user with ID 1
fetchAndDisplayOrders(1);
