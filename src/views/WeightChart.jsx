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
  // points: [{ x: Date, y: number }]
  const data = {
    datasets: [
      {
        label: 'Weight (kg)',
        data: points.map(p => ({ x: p.x.getTime(), y: p.y })),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25,118,210,0.12)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
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
          unit: 'day',
          tooltipFormat: 'PP',
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
