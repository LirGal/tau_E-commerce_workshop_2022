// variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const shopNowBtn = document.querySelector(".shop-now-btn");
const categoriesDropdown = document.querySelector("#categories-dropdown-content");

const sortByWebsiteBtn = document.querySelector("#sort-by-brand");
const sortByTitleBtn = document.querySelector("#sort-a-to-z");
const sortByPriceAscendingBtn = document.querySelector("#sort-by-price-ascending");
const sortByPriceDescendingBtn = document.querySelector("#sort-by-price-descending");

const duplicates = document.querySelector(".duplicates");
const similarities = document.querySelector(".similarities");
const findDuplicatesBtn = document.querySelector("#find-duplicates");
const findSimilaritiesBtn = document.querySelector("#find-similarities");

const SORT_BY_WEBSITE_TEXT = "Brand";
const SORT_BY_TITLE_TEXT = "A-Z";
const SORT_BY_PRICE_ASCENDING_TEXT = "Price (low to high)";
const SORT_BY_PRICE_DESCENDING_TEXT = "Price (high to low)";
const FIND_DUPLICATES_TEXT = "Find duplicates";
const FIND_SIMILARITIES_TEXT = "Find similarities";
const NONE = "none";
const BLOCK = "block";

var categorySelectors;
var selectedCategories = new Set();
const categories = new Set(["Dresses", "Hoodies", "Jackets & Coats", "Jeans", "Men", "Polos", "Shirts", "T-Shirts", "Vests", "Women"]);

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

  populateCart(cart) {
    cartContent.innerHTML = "";
    cart.forEach(item => this.addCartItem(item));
  }

  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  initializeCategoriesDropdown() {
    var counter = 0;
    var a;
    for(const category of categories) {
      a = document.createElement("a");
      a.classList.add("category-checkbox");
      a.href = "#";
      a.innerHTML = category;
      categoriesDropdown.appendChild(a);
      counter++;
    }
  }

  resetAllSortByCheckboxes() {
    sortByWebsiteBtn.innerHTML = SORT_BY_WEBSITE_TEXT;
    sortByTitleBtn.innerHTML = SORT_BY_TITLE_TEXT;
    sortByPriceAscendingBtn.innerHTML = SORT_BY_PRICE_ASCENDING_TEXT;
    sortByPriceDescendingBtn.innerHTML = SORT_BY_PRICE_DESCENDING_TEXT;
  }

  boldAndUnboldCategoryCheckboxes() {
    categorySelectors.forEach(categorySelector => {
      var category = categorySelector.innerText;
      if(selectedCategories.has(category)) {
        categorySelector.innerHTML = "<b>" + category + "</b>";
      }
      else {
        categorySelector.innerHTML = category;
      }
    });
  }

  sortBy(cart, paremeter, selector, text) {
    similarities.style.display = NONE;
    findSimilaritiesBtn.innerHTML = FIND_SIMILARITIES_TEXT;
    duplicates.style.display = NONE;
    findDuplicatesBtn.innerHTML = FIND_DUPLICATES_TEXT;

    this.resetAllSortByCheckboxes();
    selectedCategories = new Set();
    this.boldAndUnboldCategoryCheckboxes();
    selector.innerHTML = "<b>" + text + "</b>";
    var sorted = sortBy(cart, paremeter);  // function declared in analytics.js
    this.setCartValues(sorted);
    this.populateCart(sorted);
  }

  filter(event, cart) {
    this.resetAllSortByCheckboxes();
    var category = event.target.innerText;
    if(selectedCategories.has(category)) {
      selectedCategories.delete(category);
    }
    else {
      selectedCategories.add(category);
    }

    this.boldAndUnboldCategoryCheckboxes()

    var relevantItems;
    if(selectedCategories.size > 0) {
      relevantItems = filter(cart, selectedCategories);  // function declared in analytics.js
    }
    else {
      relevantItems = cart;
    }

    this.setCartValues(relevantItems);
    this.populateCart(relevantItems);
  }

  showGroupedList(groupedList, div) {
    var groupDiv;
    var itemDiv;
    for(const group of groupedList) {
      groupDiv = document.createElement("div");
      groupDiv.classList.add("group");
      for(const item of group) {
        itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.classList.add("duplicated-cart-item");
        itemDiv.innerHTML += `
        <img src=${item.image} alt="product">
        <div>
          <h4>${item.title}</h4>
          <h5>$${item.price} | x${item.amount}</h5>
          <h5>${item.website}</h5>
        </div>
        `;
        groupDiv.appendChild(itemDiv);
      }
      div.appendChild(groupDiv);
    }
  }

  findDuplicates(cart) {
    similarities.style.display = NONE;
    findSimilaritiesBtn.innerHTML = FIND_SIMILARITIES_TEXT;
    if(duplicates.style.display == NONE) {
      duplicates.style.display = BLOCK;
      findDuplicatesBtn.innerHTML = "<b>" + FIND_DUPLICATES_TEXT + "</b>";
    }
    else {
      duplicates.style.display = NONE;
      findDuplicatesBtn.innerHTML = FIND_DUPLICATES_TEXT;
    }
    var groupedDuplicates = findDuplicates(cart);  // function declared in analytics.js
    this.showGroupedList(groupedDuplicates, duplicates);
  }

  findSimilarities(cart) {
    duplicates.style.display = NONE;
    findDuplicatesBtn.innerHTML = FIND_DUPLICATES_TEXT;
    if(similarities.style.display == NONE) {
      similarities.style.display = BLOCK;
      findSimilaritiesBtn.innerHTML = "<b>" + FIND_SIMILARITIES_TEXT + "</b>";
    }
    else {
      similarities.style.display = NONE;
      findSimilaritiesBtn.innerHTML = FIND_SIMILARITIES_TEXT;
    }
    var groupedSimilarities = findSimilarities(cart);  // function declared in analytics.js
    this.showGroupedList(groupedSimilarities, similarities);
  }

  setupAPP(cart) {
    this.setCartValues(cart);
    this.populateCart(cart);
    this.initializeCategoriesDropdown(categories);

    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
    shopNowBtn.addEventListener("click", this.showCart);

    var currentUI = this;

    sortByWebsiteBtn.addEventListener("click", function() {
      currentUI.sortBy(cart, WEBSITE, sortByWebsiteBtn, SORT_BY_WEBSITE_TEXT);
    });
    sortByTitleBtn.addEventListener("click", function() {
      currentUI.sortBy(cart, TITLE, sortByTitleBtn, SORT_BY_TITLE_TEXT);
    });
    sortByPriceAscendingBtn.addEventListener("click", function() {
      currentUI.sortBy(cart, PRICE_ASCENDING, sortByPriceAscendingBtn, SORT_BY_PRICE_ASCENDING_TEXT);
    });
    sortByPriceDescendingBtn.addEventListener("click", function() {
      currentUI.sortBy(cart, PRICE_DESCENDING, sortByPriceDescendingBtn, SORT_BY_PRICE_DESCENDING_TEXT);
    });

    categorySelectors = document.querySelectorAll(".category-checkbox");
    categorySelectors.forEach(categorySelector => {
      categorySelector.addEventListener("click", function(event) {
        currentUI.filter(event, cart);
      });
    });

    findDuplicatesBtn.addEventListener("click", function() {
      currentUI.findDuplicates(cart);
    });

    findSimilaritiesBtn.addEventListener("click", function() {
      currentUI.findSimilarities(cart);
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {

  chrome.storage.local.get(["CART_DICT"]).then((result) => {
    console.log(result.CART_DICT);
    if(result.CART_DICT) {
      setup_ui(result.CART_DICT);
    }
    else {
      setup_ui({});
    }
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
