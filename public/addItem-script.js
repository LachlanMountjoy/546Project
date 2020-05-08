// sellType
const inputSellType = document.getElementById('inputSellType');;
inputSellType.addEventListener('change', (event) => {
  const inputAuctionExpirationDiv = document.getElementById('inputAuctionExpirationDiv');
  if (event.target.value == 'sell') {
    inputAuctionExpirationDiv.classList.add('invisible');
  } else {
    inputAuctionExpirationDiv.classList.remove('invisible');
  }
});


// price
const inputPrice = document.getElementById('inputPrice');
inputPrice.addEventListener('change', (event) => {
  const price = Math.round((Number(inputPrice.value) + Number.EPSILON) * 100) / 100;

  if (isNaN(price) || price <= 0) {
    inputPrice.classList.add('is-invalid');
    inputPrice.value = '';
  } else {
    inputPrice.value = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(price);
    inputPrice.classList.remove('is-invalid');
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

  const sellType = inputSellType.value;

  let auctionExpiration = undefined;
  if (sellType == 'auction') {
    auctionExpiration = document.getElementById('inputAuctionExpiration').value;
  }

  const name = document.getElementById('inputName').value;

  const price = Number(document.getElementById('inputPrice').value);

  const image = document.getElementById('inputImage').files[0];

  const inputCategories = document.getElementById('inputCategories');
  const categories = inputCategories.value.split(',').map(x => x.trim());

  const descriptions = document.getElementById('inputDescriptions').value;



  //console.log(sellType, auctionExpiration, name, price, image, categories, descriptions);


})

