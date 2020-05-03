const bidOnPrice = document.getElementById('bidOnPrice');
const currentPrice = document.getElementById('currentPrice').getAttribute("value")
console.log(currentPrice);

bidOnPrice.addEventListener('change', (event) => {
  const price = Math.round((Number(bidOnPrice.value) + Number.EPSILON) * 100) / 100;

  if (isNaN(price) || price <= currentPrice) {
    bidOnPrice.classList.add('is-invalid');
    bidOnPrice.value = '';
  } else {
    bidOnPrice.value = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(price);
    bidOnPrice.classList.remove('is-invalid');
  }
});

const addBidderForm = document.getElementById('addBidderForm');
addBidderForm.addEventListener('submit', (event) => {
  // event.preventDefault();

  const price = Number(document.getElementById('bidOnPrice').value);
  const itemId = document.getElementById('itemId').value;
})