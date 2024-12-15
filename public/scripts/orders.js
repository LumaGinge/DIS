function decodeToken(token) { // dekrypterer JWT token
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // token dekrypteres og payload hentes med brugerens informationer
      return payload;
    } catch (error) {
      console.error("Error decoding token:", error.message);
      return null;
    }
  }
  
  /// henter og viser brugerens ordrer
function fetchAndDisplayOrdersForLoggedInUser() {
    // hent brugerens JWT token fra cookien 
    fetch(`/api/get-orders`, {
      method: 'GET',
      credentials: 'include', // sørger for at cookien sendes med i requesten
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            alert("Session expired. Please log in again.");
            window.location.href = "/static/login.html";
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(orders => {
        displayOrders(orders); // viser brugerens ordrer
      })
      .catch(err => {
        console.error("Error fetching orders:", err.message);
        alert("Failed to fetch orders. Please try again later.");
      });
  }
  
  // Display orders in the DOM
function displayOrders(orders) {
  const ordersContainer = document.getElementById("orders-container");
  ordersContainer.innerHTML = "";

  if (!orders || orders.length === 0) { // hvis brugeren ikke har nogen ordrer
    const noOrdersDiv = document.createElement("div");
    noOrdersDiv.classList.add("no-orders");

    const noOrdersMessage = document.createElement("p");
    noOrdersMessage.textContent = "You have no orders yet.";

    const callToAction = document.createElement("button");
    callToAction.textContent = "Go to Menu";
    callToAction.classList.add("cta-button");
    callToAction.addEventListener("click", () => {
      window.location.href = "/protected/menu";
    });

    noOrdersDiv.appendChild(noOrdersMessage);
    noOrdersDiv.appendChild(callToAction);
    ordersContainer.appendChild(noOrdersDiv);
    return;
  }

  // dynamisk html genereres for hver ordre med data fra SQL databasen
  orders.forEach(order => {
    const orderDiv = document.createElement("div");
    orderDiv.classList.add("order");

    const orderHeader = document.createElement("h3"); 
    orderHeader.textContent = `Order ID: ${order.orderId}, Total Price: ${order.totalPrice.toFixed(2)} kr`;
    orderDiv.appendChild(orderHeader);

    const locationInfo = document.createElement("p");
    locationInfo.textContent = `Location: ${order.location}`;
    orderDiv.appendChild(locationInfo);

    const pickupTimeInfo = document.createElement("p");
    const pickupTime = new Date(order.pickupTime);
    const danishTime = new Intl.DateTimeFormat('da-DK', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'Europe/Copenhagen',
    }).format(pickupTime);
    pickupTimeInfo.textContent = `Pickup Time: ${danishTime}`;
    orderDiv.appendChild(pickupTimeInfo);

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
  fetchAndDisplayOrdersForLoggedInUser();
  