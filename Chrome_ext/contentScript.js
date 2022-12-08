// this is the global dictionary that will hold all the values.
var CART_DICT = {};

// add observer for the cart
let cart_observer = new MutationObserver(cart_change_handler);
var cart = document.getElementsByClassName("cart-content")[0]
cart_observer.observe(cart, {subtree: true, childList: true});

var clear_cart = document.getElementsByClassName("clear-cart banner-btn")[0];
clear_cart.addEventListener("click", clear_cart_handler);

// count the changes in the cart to do calculations
function cart_change_handler(mutationRecList) {
  create_cart_dict(mutationRecList);
  return true; // elimate server error
}

// deleting the cart when the user clears it
function clear_cart_handler(mutationRecList) {
  CART_DICT = {};
  console.log("CART CLEARED");
  return true;
}

// re-read the cart json and update the global cart_dict
function create_cart_dict() {
  
  for (const item of Array.from(document.getElementsByClassName("cart-item"))) {

    item_name   = item.querySelector("h4").innerHTML;
    item_price  = item.querySelector("h5").innerHTML;
    item_amount = item.querySelector("p").innerHTML;

    CART_DICT[item_name] = {price:item_price, amount:item_amount };

    console.log("CART_DICT");
    console.log(CART_DICT)
  }
}


