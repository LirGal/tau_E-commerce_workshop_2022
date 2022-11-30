


const add_2_cart_btns = document.getElementsByClassName("cart-content");

const add_counter = 0;
const rm_counter = 0;

function cart_change_handler(mutationList) {
  

  if (mutationList.addedNodes.length > 0){
    console.log("a node added" + str(mutationList.addedNodes[0]))
  }

  console.log(mutationList); // debug - delete this

  // if item added

  // if item changed amount (also check amount == 0)

  // if item removed

  
}

// add observer for the cart
let observer = new MutationObserver(cart_change_handler);
const cart = document.getElementsByClassName("cart-content")[0]
observer.observe(cart, {subtree: true, childList: true});






// btn.addEventListener("change", add2Cart, false)


// add_2_cart_butt.addEventListener("click", borat2log, false);



function add2Cart(event) {
  add_counter++;
  console.log("\n added item number " + add_counter.toString() + " to cart\n");
}


function rmFromCart() {
  rm_counter++;
  console.log("\n removed item number " + rm_counter.toString() + " from cart\n");
}