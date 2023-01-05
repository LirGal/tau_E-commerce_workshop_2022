// Constant strings
const PRICE = "price";
const PRICE_ASCENDING = "priceAscending";
const PRICE_DESCENDING = "priceDescending";
const ID = "id";
const CATEGORIES = "categories";
const TITLE = "title";
const WEBSITE = "website";

const specialCharacters = [/&quot;/g, /&amp;/g, /&lt;/g, /&gt;/g, /&nbsp;/g, /[^a-zA-Z0-9\- ]/g];

function removeSpecialCharacters(str) {
    for(const regex of specialCharacters) {
        str = str.replace(regex, "");
    }
    str = str.trim();
    return str;
}

function compareStrings(str1, str2) {
    str1 = removeSpecialCharacters(str1);
    str2 = removeSpecialCharacters(str2);
    return str1.localeCompare(str2);
}

function compareTitle(item1, item2) {
    return compareStrings(item1[TITLE], item2[TITLE]);
}

function compareWebsite(item1, item2) {
    var comparedWebsites = compareStrings(item1[WEBSITE], item2[WEBSITE]);
    if(comparedWebsites != 0) {
        return comparedWebsites;
    }
    return compareTitle(item1, item2);
}

function comparePriceAscending(item1, item2) {
    return item1[PRICE] - item2[PRICE];
}

function comparePriceDescending(item1, item2) {
    return comparePriceAscending(item2, item1);
}

function sortBy(cartItems, parameter) {
    var cartItemsCopy = Array.from(cartItems).slice();
    if(parameter == WEBSITE) {
        return cartItemsCopy.sort(compareWebsite);
    }
    if(parameter == TITLE) {
        return cartItemsCopy.sort(compareTitle);
    }
    if(parameter == PRICE_ASCENDING) {
        return cartItemsCopy.sort(comparePriceAscending);
    }
    if(parameter == PRICE_DESCENDING) {
        return cartItemsCopy.sort(comparePriceDescending);
    }
}

function getCategories(item) {
    currentItemCategories = new Set();
    for(const categoryArray of item[CATEGORIES]) {
        for(const category of categoryArray) {
            currentItemCategories.add(category);
        }
    }
    return Array.from(currentItemCategories);
}

function filter(cartItems, categories) {
    var relevantItems = [];
    loop1:
    for(const item of cartItems) {
        loop2:
        currentItemCategories = getCategories(item);
        for(const category of categories) {
            if(!currentItemCategories.includes(category)) {
                continue loop1;
            }
        }
        relevantItems.push(item);
    }
    return relevantItems;
}