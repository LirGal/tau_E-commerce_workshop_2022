// Constant strings
const PRICE = "price";
const PRICE_ASCENDING = "priceAscending";
const PRICE_DESCENDING = "priceDescending";
const ID = "id";
const CATEGORIES = "categories";
const TITLE = "title";
const WEBSITE = "website";

const THRESHOLD = 1/2;

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

function compareID(item1, item2) {
    return compareStrings(item1[ID], item2[ID]);
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
    if(parameter == ID) {
        return cartItemsCopy.sort(compareID);
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

function findDuplicates(cartItems) {
    var sorted = sortBy(cartItems, ID);
    var groupedDuplicates = [];
    var groupsCounter = 0;
    for(var i = 0; i < sorted.length-1; i++) {
        if(compareID(sorted[i], sorted[i+1]) == 0) {
            groupedDuplicates.push([]);
            while(i < sorted.length-1 && compareID(sorted[i], sorted[i+1]) == 0) {
                groupedDuplicates[groupsCounter].push(sorted[i]);
                i++;
            }
            groupedDuplicates[groupsCounter].push(sorted[i]);
            groupsCounter++;
        }
    }
    return groupedDuplicates;
}

function union(set1, set2) {
    const union = new Set(set1);
    for(const element of set2) {
      union.add(element);
    }
    return union;
  }
  
  function intersection(set1, set2) {
    const intersection = new Set();
    for(const element of set2) {
      if(set1.has(element)) {
        intersection.add(element);
      }
    }
    return intersection;
  }

function jaccard(str1, str2) {
    str1 = removeSpecialCharacters(str1);
    str2 = removeSpecialCharacters(str2);
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
    var words1 = new Set(str1.split(' '));
    var words2 = new Set(str2.split(' '));
    var unionSize = union(words1, words2).size;
    var intersectionSize = intersection(words1, words2).size;
    return intersectionSize / unionSize;
}

function findSimilarities(cartItems) {
    var groupedSimilarities = [];
    var indexDictionary = {};  // indexDictionary[k] == i iff cartItems[k] is grouped to group #i
    var groupsCounter = 0;
    var similarity;
    var groupIndex;
    for(var i = 0; i < cartItems.length; i++) {
        for(var j = i+1; j < cartItems.length; j++) {
            similarity = jaccard(cartItems[i][TITLE].toLowerCase(), cartItems[j][TITLE].toLowerCase());
            if(similarity >= THRESHOLD) {
                if(!(i in indexDictionary) && !(j in indexDictionary)) {  // Check whether cartItems[i] and cartItems[j] already grouped
                    groupIndex = groupsCounter;
                    groupsCounter++;
                    indexDictionary[i] = groupIndex;
                    indexDictionary[j] = groupIndex;
                    groupedSimilarities.push(new Set());
                    groupedSimilarities[groupIndex].add(cartItems[i]);
                    groupedSimilarities[groupIndex].add(cartItems[j]);
                }
                else if(!(i in indexDictionary) && (j in indexDictionary)) {
                    groupIndex = indexDictionary[j]
                    indexDictionary[i] = groupIndex;
                    groupedSimilarities[groupIndex].add(cartItems[i]);
                }
                else if((i in indexDictionary) && !(j in indexDictionary)) {
                    groupIndex = indexDictionary[i]
                    indexDictionary[j] = groupIndex;
                    groupedSimilarities[groupIndex].add(cartItems[j]);
                }
            }
        }
    }
    return groupedSimilarities;
}