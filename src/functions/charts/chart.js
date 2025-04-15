const ctx = document.getElementById("chart");

const labels = ["ok", "pas ok ", "d'accord", "buf", "..."];
const data = {
  labels: labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [11, 5, 8, 6, 9],
      fill: true,

      borderColor: "lightblue",
      backgroundColor: "yellow",
      stack: "combined",
      type: "line",
    },
    {
      label: "Dataset 2",
      data: [8, 9, 7, 10, 5],
      borderColor: "blue",
      backgroundColor: "red",
      stack: "combined",
    },
  ],
};
const config = {
  type: "scatter",
  data: data,
  options: {
    plugins: {
      title: {
        display: true,
        text: "Chart.js Stacked Line/Bar Chart",
      },
    },
    scales: {
      y: {
        stacked: true,
      },
    },
  },
};

const chart = new Chart(ctx, config);
