// maps: url->item->details
// example: CART_DICT[https...website1..][red shirt] == {color:"red", size:"large"....}
const CART_DICT = "CART_DICT";

// initializing memory when first entering one of the websites.
var CART_INIT = false;
if ( !CART_INIT) {
  chrome.storage.local.get(["CART_DICT"]).then((result) => {
    console.log(result.CART_DICT);
    if(!result.CART_DICT) {
      chrome.storage.local.set({ CART_DICT: {} }, function(){});
      CART_INIT = true;
    }
  });
}


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
    console.log("CART_DICT"); // debug
    console.log(result.CART_DICT); // debug
    return true;
  });

  refresh_ui();
  return true; // elimate server error
}

// deleting the cart when the user clears it
function clear_cart_handler(mutationRecList) {
  // background.CART_DICT = {}; -> cannot uset this because it clears all the carts
  console.log("CART CLEARED"); // TODO - delete this line afer imp.
  var update_CART_DICT = {};
  update_CART_DICT[location.href] = {};
  chrome.storage.local.get([CART_DICT]).then((result) => {
    update_cart_dict(update_CART_DICT, result.CART_DICT);
    return true;
  });
  
  refresh_ui();
  return true;
}

// re-read the cart json and update the global cart_dict
function create_cart_dict() {
  
  console.log(JSON.parse(localStorage.getItem("cart")));
  console.log(typeof JSON.parse(localStorage.getItem("cart")));
  curr_shop_dict = {};
  for (const item_dict of JSON.parse(localStorage.getItem("cart"))) {
    curr_shop_dict[item_dict["title"]] = item_dict;
  }

  var update_CART_DICT = {};
  update_CART_DICT[location.href] = curr_shop_dict;
  return update_CART_DICT;
}

function update_cart_dict(temp_dict, global_dict) {
  
  for (const [key, value] of Object.entries(temp_dict)) {
    global_dict[key] = value;
  }
  
  chrome.storage.local.set({ CART_DICT: global_dict }, function(){});
}

function refresh_ui(){
  (async () => {
    const response = await chrome.runtime.sendMessage({refresh_ui_tab: "true"});
  })();
}