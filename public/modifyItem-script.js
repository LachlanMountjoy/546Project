// sellType
const modifySellType = document.getElementById('modifySellType');;

modifySellType.addEventListener('change', (event) => {
  const inputAuctionExpirationDiv = document.getElementById('modifyAuctionExpirationDiv');
  if (event.target.value == 'sell') {
    inputAuctionExpirationDiv.classList.add('invisible');
  } else {
    inputAuctionExpirationDiv.classList.remove('invisible');
  }
});


// price
const modifyPrice = document.getElementById('modifyPrice');
modifyPrice.addEventListener('change', (event) => {
  const price = Math.round((Number(modifyPrice.value) + Number.EPSILON) * 100) / 100;

  if (isNaN(price) || price <= 0) {
    modifyPrice.classList.add('is-invalid');
    modifyPrice.value = '';
  } else {
    modifyPrice.value = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(price);
    modifyPrice.classList.remove('is-invalid');
  }
});


// image
const inputImage = document.getElementById('inputImage');
inputImage.addEventListener("change", handleFiles, false);
function handleFiles() {
  const file = this.files[0];
  // console.log(file.name, file.size, file.type);
  if (!file.type.startsWith('image/')) {
    inputImage.classList.add('is-invalid');
    return;
  } else {
    inputImage.classList.remove('is-invalid');
  }

  const img = document.createElement("img");
  img.classList.add("img-thumbnail");
  img.setAttribute('width', '100%');
  img.setAttribute('height', '250');
  img.file = file;
  const thumbnailDiv = document.getElementById('thumbnailDiv');
  console.log(thumbnailDiv);
  const oldImage = thumbnailDiv.firstElementChild;
  thumbnailDiv.replaceChild(img, oldImage);

  const reader = new FileReader();
  reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(img);
  reader.readAsDataURL(file);
}

// submit
const itemForm = document.getElementById('itemForm');
itemForm.addEventListener('submit', (event) => {
  // event.preventDefault();
  const itemId = document.getElementById('itemId').value;
  const sellType = modifySellType.value;

  let auctionExpiration = undefined;
  if (sellType == 'auction') {
    auctionExpiration = document.getElementById('modifyAuctionExpiration').value;
  }

  const name = document.getElementById('modifyName').value;

  const price = Number(document.getElementById('modifyPrice').value);

  const image = document.getElementById('inputImage').files[0];

  const inputCategories = document.getElementById('modifyCategories');
  const categories = inputCategories.value.split(',').map(x => x.trim());

  const descriptions = document.getElementById('modifyDescriptions').value;
  


  console.log(sellType, auctionExpiration, name, price, image, categories, descriptions);


})