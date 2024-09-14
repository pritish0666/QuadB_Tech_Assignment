document.addEventListener("DOMContentLoaded", () => {
  const timerElement = document.getElementById("timer");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const cryptoTableBody = document.getElementById("cryptoTableBody");
  const progressCircle = document.getElementById("progressCircle");
  const buyButton = document.getElementById("buyButton");
  const cryptoSelect = document.getElementById("cryptoSelect");

  let timeLeft = 60;
  const totalTime = 60;

  function updateTimer() {
    timerElement.textContent = timeLeft;
    const progress = ((totalTime - timeLeft) / totalTime) * 360;
    progressCircle.style.setProperty("--progress", `${progress}deg`);
    timeLeft--;
    if (timeLeft < 0) {
      timeLeft = 60;
    }
  }

  setInterval(updateTimer, 1000);

  window.openTelegram = function () {
    window.location.href = "/contact/telegram"; // Make sure this matches the server route
  };

  document.body.classList.add("dark-mode");
  darkModeToggle.checked = true;

  darkModeToggle.addEventListener("change", function () {
    document.body.classList.toggle("dark-mode");
  });

  async function fetchAndRenderCryptos() {
    try {
      const response = await fetch("/api/cryptos");
      const cryptos = await response.json();
      console.log("Fetched cryptos:", cryptos);
      cryptoTableBody.innerHTML = "";
      cryptos.forEach((crypto, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${crypto.name}</td>
          <td>${crypto.last}</td>
          <td>${crypto.buy}</td>
          <td>${crypto.sell}</td>
          <td>${crypto.volume}</td>
          <td>${crypto.base_unit}</td>
        `;
        cryptoTableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching cryptos:", error);
    }
  }

  fetchAndRenderCryptos();

  cryptoSelect.addEventListener("change", function () {
    const selectedCrypto = this.value;
    buyButton.textContent = `BUY ${selectedCrypto}`;
  });

  buyButton.addEventListener("click", function () {
    window.open("https://wazirx.com/signup");
  });

  document
    .getElementById("addToHomeScreen")
    .addEventListener("click", function () {
      alert("Installing HodlInfo");
    });
});
