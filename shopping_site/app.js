// website Number (for configurations)
const websiteNum = 1;

// HTML elements query
const showCartBtn = document.querySelector(".cart-btn");
const hideCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
const startShoppingBtn = document.querySelector(".start-shopping-btn");
const productsSection = document.querySelector(".products");
const banner = document.querySelector(".banner");
const navbar = document.querySelector(".navbar");
const websiteName = document.querySelector("title");
const brand = document.querySelector(".navbar-brand");

// JSON of the products of the shopping site
const productsJsonName = "fashion_products.json";

// The cart of the shopping site
let cart = [];

// The buttons of adding items to the cart
let addToCartButtons = [];

// Manages the products fetch and the display in the products section
class ProductsManager {
  /*
  Initializes an Event Listener for the "Start Shopping" button
  */
  setupProducts(){
    startShoppingBtn.addEventListener("click", this.scrollToProducts);
  }
  /*
  Creates a smooth scroll to the products section
  (activated by the"Start Shopping" button)
  */
  scrollToProducts(){
    productsSection.scrollIntoView({behavior: "smooth"});
  }
  /*
  Receives a product from the the Json and creates a product sturcture
  */
  structureProduct(product){
    let website = websiteName.innerText;
    const title = product.title;
    const price = product.price;
    const id = product.asin;
    // asin is the id of the product in the dataset
    const image = product.imUrl;
    const categories = product.categories;
    return {website, title, price, id, image, categories};
  }
  /*
  Builds products' structures (based on the products JSON file)
  and returns an array of the products of the shopping site
  */
  async getProducts(){
    try {
      let response = await fetch(productsJsonName);
      let productsJson = await response.json();
      let products = productsJson.items;
      products = products.map(product => this.structureProduct(product));
      return products;
    } catch (e) {
      console.log(e);
    }
  }
  /*
  Receives an array of products and adds the products
  to the products' section HTML
  */
  displayProducts(products) {
    let productsHTML = "";
    products.forEach(product => {
      productsHTML += `
      <!-- single product -->
      <article class="product">
        <div class="img-container">
          <img src=${product.image} alt="product" class="product-img">
          <button class="add-to-cart-btn" data-id=${product.id}>
            <i class="fas fa-shopping-cart"></i>
            add to cart
          </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$${product.price}</h4>
      </article>
      <!-- end of single product -->
      `;
    });
    productsDOM.innerHTML = productsHTML;
  }
}

// Manages the cart functionality
class CartManager {
  /*
  Loads the cart from the storage,
  adds the items to the cart's display,
  and initializes the cart show and hide buttons functionality
  */
  setupCart() {
    cart = Storage.getCart();
    // Loads the cart from the storage
    this.updateTotalItemsAndPrice(cart);
    this.addItemsToCartDisplay(cart);
    this.applyCartShowHideButtonsLogic();
  }
  /*
  Receives a cart of items and adds each of them to the cart display
  */
  addItemsToCartDisplay(cart) {
    cart.forEach(item => this.addItemToCartDisplay(item));
  }
  /*
  Receives a specific item and adds it to the cart display
  */
  addItemToCartDisplay(item) {
    const cartItemElem = document.createElement("div");
    cartItemElem.classList.add("cart-item");
    cartItemElem.innerHTML += `
    <img src=${item.image} alt="product">
    <div>
      <h4>${item.title}</h4>
      <h5>$${item.price}</h5>
      <span class="remove-item" data-id=${item.id}>remove</span>
    </div>
    <div>
      <i class="fas fa-chevron-up" data-id=${item.id}></i>
      <p class="item-amount">${item.amount}</p>
      <i class="fas fa-chevron-down"data-id=${item.id}></i>
    </div>
    `;
    cartContent.appendChild(cartItemElem);
  }
  /*
  Receives a cart of items and updates the total number of items
  in the cart and the total price, in the site's HTML
  */
  updateTotalItemsAndPrice(cart) {
    let priceTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      priceTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(priceTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }
  /*
  Applies the logic of the cart show and hide buttons
  */
  applyCartShowHideButtonsLogic(){
    showCartBtn.addEventListener("click", this.showCart);
    hideCartBtn.addEventListener("click", this.hideCart);
  }
  /*
  Applies the logic of the "add to cart" buttons in the products section
  */
  applyAddToCartButtonsLogic() {
    const buttons = [...document.querySelectorAll(".add-to-cart-btn")];
    // Array of the "add to cart" buttons
    addToCartButtons = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        // The item was in the last saved cart
        this.disableButton(button);
      }
      // Adds the logic of "add to cart" button clicking
      button.addEventListener("click", event => {
        this.disableButton(button);
        // cartItem is an object which is similar to
        // the one returned by the getProduct method but also
        // has amount attribute initialized to 1
        let cartItem = {...Storage.getProduct(id), amount: 1};
        //  Append cart with cartItem
        cart = [...cart, cartItem];
        this.saveCartAndUpdateValues(cart);
        this.addItemToCartDisplay(cartItem);
        this.showCart();
      });
    });
  }
  /* Disable "add to cart" button */
  disableButton(button){
    button.innerText = "In Cart";
    button.disabled = true;
  }
  /* Enable "add to cart" button */
  enableButton(button){
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>
    add to cart`;
  }
  /* Makes the cart visble and the background transparent */
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  /* Makes the cart invisble and removes the transparent background */
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  /*
  Applies the logic of all the buttons in the cart bar
  */
  applyCartButtonsLogic() {
    //  Applies the Clear Cart button click logic
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    //  Applies logic when the cart content is clicked
    cartContent.addEventListener("click", event => {
      let opElem = event.target;
      let id = opElem.dataset.id;
      // Case 1: remove button is clicked
      if(opElem.classList.contains("remove-item")){
        cartContent.removeChild(opElem.parentElement.parentElement);
        // the parent of the parent is an element with a class of cart-item
        this.removeItem(id);
      }
      // Case 2: up arrow button is clicked
      else if (opElem.classList.contains("fa-chevron-up")) {
        let chosenItem = cart.find(item => item.id === id);
        chosenItem.amount += 1;
        this.saveCartAndUpdateValues(cart);
        opElem.nextElementSibling.innerText = chosenItem.amount;
        // the next sibiling of addAmount in the HTML has the class of item-amount
      }
      // Case 3: down arrow button is clicked
      else if (opElem.classList.contains("fa-chevron-down")) {
        let chosenItem = cart.find(item => item.id === id);
        chosenItem.amount -= 1;
        if(chosenItem.amount > 0){
          this.saveCartAndUpdateValues(cart);
          opElem.previousElementSibling.innerText = chosenItem.amount;
          // the previous sibiling of opElem in the HTML has the class of item-amount
        }
        else { //this was the only item of this product in the cart
          cartContent.removeChild(opElem.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }
  /*
  Receives a cart, saves it to storage
  and updates the total number of item and the total price
  */
  saveCartAndUpdateValues(cart){
    Storage.saveCart(cart);
    this.updateTotalItemsAndPrice(cart);
  }
  /*
  Empties the cart of items
  (in the array of items and in the site's display)
  */
  clearCart() {
    let cartItems = cart.map(item => item.id);
    // Clears the cart array
    cartItems.forEach(id => this.removeItem(id));
    // Clears the cart display
    while(cartContent.children.length > 0){
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
  /*
  Receives a product's ID and remove it from the cart
  Note: The removal from the cart's display is not included
  in this function
  */
  removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    // updates the cart array
    this.updateTotalItemsAndPrice(cart);
    Storage.saveCart(cart);
    let button = this.getProductAddToCartButton(id);
    this.enableButton(button);
  }
  /*
  Recieves a product's ID and returns its "add to cart" button
  */
  getProductAddToCartButton(id) {
    return addToCartButtons.find(button => button.dataset.id === id);
  }
}

// Manages the local storage of the site
class Storage {
  /*
  Receives an array of products and saves it
  in the local storage as JSON string
  */
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  /*
  Receives an ID of a product
  and returns the product which has that ID
  */
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
  }
  /*
  Receives an cart array and saves it
  in the local storage as JSON string
  */
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  /*
  Returns the cart in the local storage if exists
  otherwise returns an empty array
  */
  static getCart() {
    return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
  }
}

// Manages the configurations of the different shopping site
class Site {
  /*
  Configures the shopping site UI based on the website number
  */
  configure(){
    let backgroundColor = "#FFEFD5";
    if (websiteNum === 2){
      backgroundColor = "#BBFDC4";
      websiteName.innerText = "Creed Fashion";
      brand.innerHTML = "C r e e d &emsp; F a s h i o n";
      banner.style.background = backgroundColor;
      cartDOM.style.background = backgroundColor;
      navbar.style.background = backgroundColor;
    }
    if (websiteNum === 3){
      backgroundColor = "#FFC1C1";
      websiteName.innerText = "Kevin Fashion";
      brand.innerHTML = "K e v i n &emsp; F a s h i o n";
      banner.style.background = backgroundColor;
      cartDOM.style.background = backgroundColor;
      navbar.style.background = backgroundColor;
    }
  }
}

// THE MAIN OF THE SHOPPING SITE
document.addEventListener("DOMContentLoaded", () => {
  const site = new Site();
  const cartManager = new CartManager();
  const productsManager = new ProductsManager();
  site.configure();
  cartManager.setupCart();
  productsManager.setupProducts();
  productsManager.getProducts().then(products => {
    productsManager.displayProducts(products);
    Storage.saveProducts(products);
  }).then(() => {
    // So we won't access the add to cart buttons
    // before all the products are displayed
    cartManager.applyAddToCartButtonsLogic();
    cartManager.applyCartButtonsLogic();
  });
});
