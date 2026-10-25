var cart = [];
var showExtra = false;
var alreadySpun = false;
var timerId = null;

var prizes = [
  "Rs 50 OFF on next order",
  "FREE Delivery on your order",
  "10% OFF on your cart",
  "Better luck next time",
  "Rs 20 OFF on orders above Rs 199",
  "Buy 1 Get 1 FREE on snacks",
  "Rs 100 OFF on orders above Rs 499",
  "5% OFF sitewide"
];

var riders = [
  { name: "Rajesh Kumar", init: "RK", info: "4.9 | 2340 deliveries" },
  { name: "Amit Sharma", init: "AS", info: "4.8 | 1890 deliveries" },
  { name: "Priya Nair", init: "PN", info: "5.0 | 3120 deliveries" },
  { name: "Vikram Singh", init: "VS", info: "4.9 | 2780 deliveries" }
];

function showToast(msg) {
  var box = document.getElementById("toast");
  box.innerHTML = msg;
  box.className = "toast show";
  setTimeout(function () {
    box.className = "toast";
  }, 2500);
}

function toggleMore() {
  var extras = document.getElementsByClassName("extra");
  var btn = document.getElementById("moreBtn");
  var i;

  showExtra = !showExtra;

  for (i = 0; i < extras.length; i++) {
    extras[i].style.display = showExtra ? "block" : "none";
  }

  btn.innerHTML = showExtra ? "Show Less" : "Load More Products";
}

function addToCart(name, price) {
  var found = false;
  var i;

  for (i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      cart[i].qty = cart[i].qty + 1;
      found = true;
    }
  }

  if (!found) {
    cart.push({ name: name, price: price, qty: 1 });
  }

  updateCart();
  showToast(name + " added to cart");
}

function changeQty(index, change) {
  cart[index].qty = cart[index].qty + change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  updateCart();
}

function getCount() {
  var count = 0;
  var i;
  for (i = 0; i < cart.length; i++) {
    count = count + cart[i].qty;
  }
  return count;
}

function getTotal() {
  var total = 0;
  var i;
  for (i = 0; i < cart.length; i++) {
    total = total + cart[i].price * cart[i].qty;
  }
  return total;
}

function updateCart() {
  var count = getCount();
  var total = getTotal();
  var list = document.getElementById("cartItems");
  var bill = document.getElementById("cartBill");
  var html = "";
  var i;
  var freeDelivery = total >= 199;
  var delivery = 25;
  var pay = 0;
  var nextGoal = 199;
  var percent = 0;

  document.getElementById("cartBadge").innerHTML = count;
  document.getElementById("floatText").innerHTML = count + " items in cart - Rs " + total;

  if (count > 0) {
    document.getElementById("floatBar").className = "float-bar show";
  } else {
    document.getElementById("floatBar").className = "float-bar";
  }

  if (cart.length === 0) {
    list.innerHTML = '<p class="empty">Your cart is empty</p>';
    bill.className = "hidden";
    return;
  }

  bill.className = "";

  for (i = 0; i < cart.length; i++) {
    html = html + '<div class="cart-row">';
    html = html + "<div>" + cart[i].name + "<br>Rs " + cart[i].price + " x " + cart[i].qty + "</div>";
    html = html + "<div>";
    html = html + '<button class="qty-btn" onclick="changeQty(' + i + ', -1)">-</button> ';
    html = html + cart[i].qty + " ";
    html = html + '<button class="qty-btn" onclick="changeQty(' + i + ', 1)">+</button>';
    html = html + "</div></div>";
  }

  list.innerHTML = html;

  if (freeDelivery) {
    delivery = 0;
  }

  if (total > 0) {
    pay = total + delivery + 3;
  }

  document.getElementById("itemTotal").innerHTML = "Rs " + total;
  document.getElementById("delFee").innerHTML = freeDelivery ? "FREE" : "Rs 25";
  document.getElementById("grandTotal").innerHTML = "Rs " + pay;

  if (total < 199) {
    nextGoal = 199;
  } else if (total < 299) {
    nextGoal = 299;
  } else if (total < 499) {
    nextGoal = 499;
  } else {
    nextGoal = 0;
  }

  percent = (total / 499) * 100;
  if (percent > 100) {
    percent = 100;
  }
  document.getElementById("progressBar").style.width = percent + "%";

  if (nextGoal === 0) {
    document.getElementById("progressMsg").innerHTML = "All offers unlocked!";
  } else {
    document.getElementById("progressMsg").innerHTML =
      "Add Rs " + (nextGoal - total) + " more to unlock the next offer";
  }

  if (freeDelivery) {
    document.getElementById("freeMsg").className = "free-msg";
  } else {
    document.getElementById("freeMsg").className = "hidden";
  }
}

function openCart() {
  updateCart();
  document.getElementById("cartOverlay").className = "overlay show";
  document.getElementById("cartPanel").className = "cart-panel show";
}

function closeCart() {
  document.getElementById("cartOverlay").className = "overlay";
  document.getElementById("cartPanel").className = "cart-panel";
}

function placeOrder() {
  var name = document.getElementById("custName").value;
  var address = document.getElementById("custAddress").value;
  var pay = document.getElementById("custPay").value;

  if (cart.length === 0) {
    showToast("Cart is empty");
    return;
  }

  if (name === "" || address === "" || pay === "") {
    showToast("Please fill all details");
    return;
  }

  closeCart();
  openTrack(name);

  cart = [];
  updateCart();
  document.getElementById("custName").value = "";
  document.getElementById("custAddress").value = "";
  document.getElementById("custPay").value = "";
}

function openLogin() {
  document.getElementById("loginBox").className = "overlay show";
}

function closeLogin() {
  document.getElementById("loginBox").className = "overlay";
}

function showTab(tab) {
  if (tab === "login") {
    document.getElementById("loginForm").className = "";
    document.getElementById("signupForm").className = "hidden";
    document.getElementById("loginTab").className = "tab-on";
    document.getElementById("signupTab").className = "";
  } else {
    document.getElementById("loginForm").className = "hidden";
    document.getElementById("signupForm").className = "";
    document.getElementById("loginTab").className = "";
    document.getElementById("signupTab").className = "tab-on";
  }
}

function doLogin() {
  closeLogin();
  showToast("Welcome back to Zaplet");
}

function doSignup() {
  closeLogin();
  showToast("Account created. Welcome to Zaplet");
}

function canShowCard(card) {
  if (card.className.indexOf("extra") !== -1 && showExtra === false) {
    return false;
  }
  return true;
}

function searchProducts() {
  var text = document.getElementById("searchBox").value.toLowerCase();
  var cards = document.getElementsByClassName("card");
  var i;
  var name;

  for (i = 0; i < cards.length; i++) {
    name = cards[i].getAttribute("data-name");
    if (name.indexOf(text) !== -1 && canShowCard(cards[i])) {
      cards[i].style.display = "block";
    } else {
      cards[i].style.display = "none";
    }
  }
}

function filterCategory(el, cat) {
  var items = document.getElementsByClassName("nav-item");
  var cards = document.getElementsByClassName("card");
  var i;

  for (i = 0; i < items.length; i++) {
    items[i].className = "nav-item";
  }
  el.className = "nav-item active";

  for (i = 0; i < cards.length; i++) {

    if (cat === "all") {
      if (canShowCard(cards[i])) {
        cards[i].style.display = "block";
      } else {
        cards[i].style.display = "none";
      }

    } else {

      if (cards[i].getAttribute("data-cat") === cat) {
        cards[i].style.display = "block";
      } else {
        cards[i].style.display = "none";
      }

    }
  }

  if (cat === "all") {
    document.getElementById("hero").style.display = "flex";
  } else {
    document.getElementById("hero").style.display = "none";
  }
}

function openWheel() {
  document.getElementById("wheelBox").className = "overlay show";
  document.getElementById("wheelResult").innerHTML = "";
}

function closeWheel() {
  document.getElementById("wheelBox").className = "overlay";
}

function spinWheel() {
  var index;
  var deg;

  if (alreadySpun) {
    showToast("You already used your free spin");
    return;
  }

  alreadySpun = true;
  index = Math.floor(Math.random() * prizes.length);
  deg = 1440 + index * 45;

  document.getElementById("spinBtn").disabled = true;
  document.getElementById("spinBtn").innerHTML = "Spinning...";
  document.getElementById("wheel").style.transform = "rotate(" + deg + "deg)";

  setTimeout(function () {
    document.getElementById("wheelResult").innerHTML = prizes[index];
    document.getElementById("spinBtn").innerHTML = "Claimed";
    showToast(prizes[index]);
  }, 3100);
}

function openTrack(customerName) {
  var rider = riders[Math.floor(Math.random() * riders.length)];
  var orderNo = 100000 + Math.floor(Math.random() * 900000);
  var seconds = 20 * 60;

  document.getElementById("orderId").innerHTML = "#ZAP-" + orderNo;
  document.getElementById("trackName").innerHTML = customerName;
  document.getElementById("riderName").innerHTML = rider.name;
  document.getElementById("riderInit").innerHTML = rider.init;
  document.getElementById("riderRate").innerHTML = rider.info;
  document.getElementById("trackTitle").innerHTML = "Order Confirmed!";
  document.getElementById("riderText").innerHTML = "Rider picked up your order";
  document.getElementById("step1").className = "done";
  document.getElementById("step2").className = "now";
  document.getElementById("step3").className = "";
  document.getElementById("step4").className = "";
  document.getElementById("trackBox").className = "overlay show";

  clearInterval(timerId);
  timerId = setInterval(function () {
    var min;
    var sec;

    seconds = seconds - 1;
    if (seconds < 0) {
      clearInterval(timerId);
      return;
    }

    min = Math.floor(seconds / 60);
    sec = seconds % 60;
    if (sec < 10) {
      sec = "0" + sec;
    }
    document.getElementById("eta").innerHTML = min + ":" + sec;
  }, 1000);

  setTimeout(function () {
    document.getElementById("step2").className = "done";
    document.getElementById("step3").className = "now";
    document.getElementById("riderText").innerHTML = "Rider is 1.2 km away";
  }, 5000);

  setTimeout(function () {
    document.getElementById("step3").className = "done";
    document.getElementById("step4").className = "now";
    document.getElementById("riderText").innerHTML = "Rider is 600 m away";
  }, 12000);

  setTimeout(function () {
    document.getElementById("step4").className = "done";
    document.getElementById("riderText").innerHTML = "Almost there - 200 m!";
    document.getElementById("trackTitle").innerHTML = "Delivered! Enjoy";
    document.getElementById("eta").innerHTML = "Done";
    clearInterval(timerId);
  }, 22000);
}

function closeTrack() {
  document.getElementById("trackBox").className = "overlay";
  clearInterval(timerId);
}
