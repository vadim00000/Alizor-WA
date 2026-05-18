import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, Filler);

export default function WeightChart({ points, height = 220 }) {
  const data = {
    datasets: [
      {
        label: 'Weight (kg)',
        data: points.map(p => ({ x: p.x, y: p.y })),
        borderColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return '#C6FF00';
          const grad = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          grad.addColorStop(0, '#C6FF00');
          grad.addColorStop(1, '#00FFB2');
          return grad;
        },
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return 'rgba(198,255,0,0.12)';
          const grad = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          grad.addColorStop(0, 'rgba(198,255,0,0.25)');
          grad.addColorStop(1, 'rgba(0,255,178,0.06)');
          return grad;
        },
        tension: 0.3,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#00FFB2',
        pointBorderColor: '#ffffff',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          tooltipFormat: 'PPpp',
        },
        ticks: {
          autoSkip: true,
          maxRotation: 0,
        }
      },
      y: {
        suggestedMin: 0,
        suggestedMax: 150,
        ticks: {
          callback: (v) => `${v} kg`
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    }
  };

  return (
    <div style={{ width: '100%', height }}>
      <Line data={data} options={options} />
    </div>
  );
}
