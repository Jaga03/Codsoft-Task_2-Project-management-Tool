import { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import api from '../utils/api';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import '../styles/DashboardChart.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

export default function DashboardChart() {
  const [projectData, setProjectData] = useState([]);
  const [taskStats, setTaskStats] = useState({ Pending: 0, Progress: 0, Completed: 0 });
  const [taskCountsPerProject, setTaskCountsPerProject] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await api.get('/projects');
        const taskRes = await api.get('/tasks/assigned/me');
        const tasks = taskRes.data;

        const statusStats = { Pending: 0, Progress: 0, Completed: 0 };
        const projectTaskCounts = {};

        tasks.forEach(task => {
          const status = task.status || 'Pending';
          statusStats[status] += 1;

          const projectId = task.projectId;
          if (projectId) {
            if (!projectTaskCounts[projectId]) {
              projectTaskCounts[projectId] = 0;
            }
            projectTaskCounts[projectId] += 1;
          }
        });

        setTaskStats(statusStats);
        setTaskCountsPerProject(projectTaskCounts);
        setProjectData(projectRes.data);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    };

    fetchData();
  }, []);

  const barData = {
    labels: projectData.map(p => p.name),
    datasets: [
      {
        label: 'Total Tasks',
        data: projectData.map(p => taskCountsPerProject[p._id] || 0),
        backgroundColor: '#57B894',
      }
    ]
  };

  const doughnutData = {
    labels: ['Pending', 'Progress', 'Completed'],
    datasets: [
      {
        data: [taskStats.Pending, taskStats.Progress, taskStats.Completed],
        backgroundColor: ['#facc15', '#3b82f6', '#22c55e'],
        borderWidth: 1,
      }
    ]
  };

  return (
    <div className="dashboard-container">
      <h2>Project & Task Overview</h2>
      <div className="chart-section">
        <div className="chart-box">
          <h4>Task Distribution</h4>
          <Doughnut data={doughnutData} />
        </div>
        <div className="chart-box">
          <h4>Tasks per Project</h4>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
}
