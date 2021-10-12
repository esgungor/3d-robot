import Chart from "chart.js/auto";
import { robotData } from "./script";
// import { getRelativePosition } from "chart.js/helpers";

const labels = ["Data1", "Data2", "Data3"];

export let myChart = null;
export const createChart = () => {
  var ctx = document.getElementById("myChart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: robotData.positionArrayX,
      datasets: [
        {
          label: "Linear Data",
          data: robotData.positionArrayY,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
  });
};
