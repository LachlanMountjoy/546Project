const itemDeleteForm = document.getElementById('itemDeleteForm');
const bidItemDiv = document.getElementById('bidItemDiv');
const bidPriceDiv = document.getElementById('bidPriceDiv');
const sellType = document.getElementById('sellType').value;
const status = document.getElementById('statusDiv').getAttribute("value");
const role = document.getElementById('role').value;

const bidLink = document.getElementById('bidLink');
const buyLink = document.getElementById('buyLink');
const modifyLink = document.getElementById('modifyLink');
const deleteButton = document.getElementById('deleteButton');

console.log(status);
console.log(role);
console.log(sellType);

if(status == 'selling') {
    if(role == "seller") {
        modifyLink.hidden = false;
        deleteButton.hidden = false;
        buyLink.hidden = true;
        bidLink.hidden = true;
    }else {
        if(sellType == 'sell') {
            modifyLink.hidden = true;
            deleteButton.hidden = true;
            buyLink.hidden = false;
            bidLink.hidden = true;
        } else {
            modifyLink.hidden = true;
            deleteButton.hidden = true;
            buyLink.hidden = true;
            bidLink.hidden = false;
        }
    }
}
console.log(modifyLink.hidden);
console.log(deleteButton.hidden);
console.log(buyLink.hidden);
console.log(bidLink.hidden);


if(sellType == "sell") {
    bidItemDiv.hidden = true;
    bidPriceDiv.hidden = true;

}else {
    bidItemDiv.hidden = false;
    bidPriceDiv.hidden = false;
}





itemDeleteForm.addEventListener('submit', (event) => {
    const itemId = document.getElementById('itemId').value;
})