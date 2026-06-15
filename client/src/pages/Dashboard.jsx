import { useEffect, useState } from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../api.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Dashboard({ refreshKey }) {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then((response) => setDashboard(response.data));
  }, [refreshKey]);

  if (!dashboard) {
    return <p className="muted">Loading dashboard...</p>;
  }

  const totalValue = Number(dashboard.summary.total_stock_value || 0);

  const chartData = {
    labels: dashboard.stockByMaterial.map((item) => item.material_name),
    datasets: [
      {
        label: 'Current Stock',
        data: dashboard.stockByMaterial.map((item) =>
          Number(item.current_quantity)
        ),
        backgroundColor: '#2563eb'
      }
    ]
  };

  return (
    <section className="page-section">
      <div className="metrics-grid">
        <article className="metric-card">
          <span>Total Materials</span>
          <strong>{dashboard.summary.total_materials}</strong>
        </article>
        <article className="metric-card warning">
          <span>Low Stock Count</span>
          <strong>{dashboard.summary.low_stock_count}</strong>
        </article>
        <article className="metric-card">
          <span>Total Stock Value</span>
          <strong>
            {totalValue.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            })}
          </strong>
        </article>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <h2>Stock by Material</h2>
        </div>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }}
        />
      </section>
    </section>
  );
}

export default Dashboard;
