const itemDeleteForm = document.getElementById('itemDeleteForm');
const bidItemDiv = document.getElementById('bidItemDiv');
const bidPriceDiv = document.getElementById('bidPriceDiv');
const sellType = document.getElementById('sellType').value;
const status = document.getElementById('statusDiv').getAttribute("value");
console.log(status);
const bidLink = document.getElementById('bidLink');
const buyLink = document.getElementById('buyLink');
const modifyLink = document.getElementById('modifyLink');
if(sellType == 'sell') {
    bidItemDiv.hidden = true;
    bidPriceDiv.hidden = true;
    if(status == 'selling') {
        buyLink.hidden = false;
        modifyLink.hidden = false;
    }else{
        buyLink.hidden = true;
        modifyLink.hidden = true;
    }

}else {
    bidItemDiv.hidden = false;
    bidPriceDiv.hidden = false;
    buyLink.hidden = true;
    modifyLink.hidden = false;
    if(status == 'selling') {
       bidLink.hidden = false;
    }else {
        bidLink.hidden = true;
    }
}
itemDeleteForm.addEventListener('submit', (event) => {
    const itemId = document.getElementById('itemId').value;
})