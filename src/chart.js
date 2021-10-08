import Chart from "chart.js/auto";
// import { getRelativePosition } from "chart.js/helpers";

const labels = ["Data1", "Data2", "Data3"];
export const createChart = () => {
  var ctx = document.getElementById("myChart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "My First Dataset",
          data: [65, 59, 80],
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
  });
};
