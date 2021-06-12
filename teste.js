var items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var numberOfItems = items.length;
var itemsPerPage = 3;

getItems(2);

function getItems(page) {
  var i;
  for (i = (page - 1) * itemsPerPage; i < page *itemsPerPage && i < numberOfItems; i++){
    console.log(items[i]);
  };

}