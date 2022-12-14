const CART_DICT = "CART_DICT";

// add observer for the cart
let cart_observer = new MutationObserver(cart_change_handler);
var cart = document.getElementsByClassName("cart-content")[0]
cart_observer.observe(cart, {subtree: true, childList: true});

var clear_cart = document.getElementsByClassName("clear-cart banner-btn")[0];
clear_cart.addEventListener("click", clear_cart_handler);

// This function is triggerd when there is a change in the cart (except clear)
function cart_change_handler(mutationRecList) {
  temp_dict = create_cart_dict(mutationRecList);

  chrome.storage.local.get([CART_DICT]).then((result) => {
    update_cart_dict(temp_dict, result.CART_DICT);
    console.log("CART_DICT");
    console.log(result.CART_DICT);
  });
  return true; // elimate server error
}

// deleting the cart when the user clears it
// TODO - this does nothing so far, we need to work on deleting items from only one website.
// TODO - currently "clear" clears global func, only works in "comfy house" website
function clear_cart_handler(mutationRecList) {
  // background.CART_DICT = {}; -> cannot uset this because it clears all the carts
  console.log("CART CLEARED"); // TODO - delete this line afer imp.
  chrome.storage.local.set({ CART_DICT: {} }, function(){}); // set global dict to empty
  return true;
}

// re-read the cart json and update the global cart_dict
// TODO - create a way to figure out which website the item is coming from
function create_cart_dict() {
  
  var temp_CART_DICT = {};
  for (const item of Array.from(document.getElementsByClassName("cart-item"))) {

    item_name   = item.querySelector("h4").innerHTML;
    item_price  = item.querySelector("h5").innerHTML;
    item_amount = item.querySelector("p").innerHTML;
    temp_CART_DICT[item_name] = {price:item_price, amount:item_amount };

  }
  return temp_CART_DICT;
}

function update_cart_dict(temp_dict, global_dict) {

  for (const [key, value] of Object.entries(temp_dict)) {
    global_dict[key] = value;
  }

  chrome.storage.local.set({ CART_DICT: global_dict }, function(){});
}