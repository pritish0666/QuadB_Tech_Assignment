const apiUrl = "/cryptos";

async function fetchCryptos() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  const cryptoList = document.getElementById("crypto-list");

  cryptoList.innerHTML = "";
  data.forEach((crypto) => {
    const li = document.createElement("li");
    li.textContent = `${crypto.name} (${crypto.symbol}): $${crypto.price}`;
    cryptoList.appendChild(li);
  });
}

// Fetch data every 60 seconds
setInterval(fetchCryptos, 60000);

// Initial fetch when the page loads
fetchCryptos();
