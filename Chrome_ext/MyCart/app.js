
// variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const shopNowBtn = document.querySelector(".shop-now-btn");

// display products
class UI {

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }
  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML += `
    <img src=${item.image} alt="product">
    <div>
      <h4>${item.title}</h4>
      <h5>$${item.price} | x${item.amount}</h5>
      <h5>${item.website}</h5>
    </div>
    `;
    cartContent.appendChild(div);
  }
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  setupAPP(cart) {
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
    shopNowBtn.addEventListener("click", this.showCart);
  }
  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
}

document.addEventListener("DOMContentLoaded", async () => {

  chrome.storage.local.get(["CART_DICT"]).then((result) => {
    console.log(result.CART_DICT);
    setup_ui(result.CART_DICT)
  });
});

async function setup_ui(global_cart)
{
  products_list = [];
  for (const [website, products] of Object.entries(global_cart)) {
    for (const [product_name, product_details] of Object.entries(products)) {
      products_list.push(product_details);
    }
  }

  console.log("final_dict:", products_list);

  const ui = new UI();

  // setup app
  ui.setupAPP(products_list);
}
