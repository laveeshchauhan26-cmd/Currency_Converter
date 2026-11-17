const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.innerText = currCode;
    option.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    }

    if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.appendChild(option);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    updateExchangeRate();
  });
}

function updateFlag(element) {
  let currCode = element.value;
  let countryCode = countryList[currCode];

  let img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

async function updateExchangeRate() {
  let amount = document.querySelector(".amount input");
  let amtVal = Number(amount.value);

  if (amtVal === "" || amtVal < 1 || isNaN(amtVal)) {
    amtVal = 1;
    amount.value = 1;
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();

  const URL = `${BASE_URL}/${from}.json`;

  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error("API Error");
    }

    const data = await response.json();

    console.log(data);

    if (!data[from]) {
      msg.innerText = "Currency data not found";
      return;
    }

    const rate = data[from][to];

    if (rate === undefined) {
      msg.innerText = "Exchange rate not found";
      return;
    }

    const finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;

  } catch (error) {
    console.log(error);
    msg.innerText = "Unable to fetch exchange rate";
  }
}

btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();

  dropdowns.forEach((select) => {
    updateFlag(select);
  });
});