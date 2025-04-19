const ctx = document.getElementById("chart");
const scoreWord = JSON.parse(localStorage.getItem("scoreWord"));

const labels = scoreWord.map((item, k) => k + 1);
const data = {
  labels: labels,
  datasets: [
    {
      label: "correct",
      data: scoreWord.map((items) => items.map((el) => el.WPM)[0]),
      fill: true,
      borderColor: "#2C506D",
      backgroundColor: "#7FBC8C",
      stack: "combined",
      type: "line",
    },
    {
      label: "Error",
      data: scoreWord.map((items) => items.map((el) => el.incorrect)[0]),
      borderColor: "#EFEEDC",
      backgroundColor: "#BD7D7D",
      stack: "combined",
    },
  ],
};
console.log();

const config = {
  type: "scatter",
  data: data,
  options: {
    plugins: {
      title: {
        display: true,
        text: "Score",
      },
    },
    scales: {
      y: {
        stacked: true,
      },
    },
  },
};

let score = JSON.parse(localStorage.getItem("score"));
for (const [k, v] of Object.entries(...score)) {
  console.log(k, v);

  switch (k) {
    case "WPM":
      document.querySelector("[wpm]").textContent = String(v);
      break;
    case "ACCURACY":
      document.querySelector("[acc]").textContent = String(v) + "%";
      break;
    case "correct":
      document.querySelector("[correct]").textContent = String(v);
      break;
    case "incorrect":
      document.querySelector("[incorrect]").textContent = String(v);
      break;
    case "extra":
      document.querySelector("[extra]").textContent = String(v);
      break;
    case "missed":
      document.querySelector("[missing]").textContent = String(v);
      break;
    default:
      break;
  }
}
document
  .querySelector("[restart]")
  .addEventListener("click", () => (window.location.href = "/"));

const chart = new Chart(ctx, config);
