import { useEffect, useState } from 'react';
import AnalyticsCharts from '../components/AnalyticsCharts';
import EmptyState from '../components/EmptyState';
import Header from '../components/Header';
import KanbanBoard from '../components/KanbanBoard';
import LoadingSpinner from '../components/LoadingSpinner';
import Sidebar from '../components/Sidebar';
import toast from '../services/toast';
import StatsCards from '../components/StatsCards';
import TaskModal from '../components/TaskModal';
import { getDashboardActivity, getDashboardCharts, getDashboardStats, getUpcomingDeadlines } from '../services/dashboardService';
import { createProject, getProjects } from '../services/projectService';
import { createCheckoutSession } from '../services/stripeService';
import { createTask, deleteTask, getTasks, updateTask } from '../services/taskService';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    teamMembers: 0,
    tasksCompletedThisWeek: 0,
    projectsCreatedThisWeek: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0
  });
  const [charts, setCharts] = useState({ weeklyProgress: [], taskCompletion: [], projectProgress: [] });
  const [deadlines, setDeadlines] = useState([]);
  const [activity, setActivity] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [initialTaskStatus, setInitialTaskStatus] = useState('To Do');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      const [taskData, projectData, statsData, chartsData, deadlinesData, activityData] = await Promise.all([
        getTasks({ limit: 100, sort: 'position' }),
        getProjects({ limit: 50 }),
        getDashboardStats(),
        getDashboardCharts(),
        getUpcomingDeadlines(),
        getDashboardActivity()
      ]);
      setTasks(taskData.tasks);
      setProjects(projectData.projects);
      setStats(statsData);
      setCharts(chartsData);
      setDeadlines(deadlinesData.deadlines);
      setActivity(activityData.activities);
    } catch {
      setMessage('Could not load tasks');
      toast.error('Could not load dashboard');
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal(status = 'To Do') {
    setInitialTaskStatus(status);
    setSelectedTask(null);
    setShowModal(true);
  }

  function openEditModal(task) {
    setSelectedTask(task);
    setShowModal(true);
  }

  async function handleSave(taskData) {
    try {
      let projectId = taskData.projectId || projects[0]?._id;
      if (!projectId) {
        const data = await createProject({ title: 'Website Redesign', description: 'Redesign and optimize the marketing website for better performance.' });
        projectId = data.project._id;
        setProjects([data.project]);
      }

      if (selectedTask) {
        const data = await updateTask(selectedTask._id, { ...taskData, projectId });
        setTasks(tasks.map((task) => (task._id === selectedTask._id ? data.task : task)));
        toast.success('Tool Updated');
      } else {
        const data = await createTask({ ...taskData, projectId });
        setTasks([data.task, ...tasks]);
        toast.success('Tool Added');
      }

      setShowModal(false);
      loadTasks();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Task could not be saved');
      toast.error(err.response?.data?.message || 'Task could not be saved');
    }
  }

  async function handleDelete(taskId) {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success('Tool Deleted');
      loadTasks();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Task could not be deleted');
      toast.error(err.response?.data?.message || 'Task could not be deleted');
    }
  }

  async function handleStatusChange(task, status) {
    try {
      const data = await updateTask(task._id, { status });
      setTasks(tasks.map((item) => (item._id === task._id ? data.task : item)));
      toast.success(status === 'Completed' ? 'Borrow Returned' : 'Borrow Approved');
      loadTasks();
    } catch {
      setMessage('Status could not be updated');
      toast.error('Status could not be updated');
    }
  }

  async function handleTaskChecked(task, checked) {
    await handleStatusChange(task, checked ? 'Completed' : 'To Do');
  }

  async function handleUpgrade() {
    try {
      const data = await createCheckoutSession();
      toast.success('Payment Successful');
      window.location.href = data.url;
    } catch (err) {
      setMessage(err.response?.data?.message || 'Stripe checkout could not start');
      toast.error(err.response?.data?.message || 'Stripe checkout could not start');
    }
  }

  return (
    <main className="dashboard-shell">
      <Sidebar />

      <section className="dashboard-main">
        <Header onCreateTask={openCreateModal} onUpgrade={handleUpgrade} />
        {message && <div className="notice">{message}</div>}
        {loading && <LoadingSpinner label="Loading dashboard..." />}
        {!loading && tasks.length === 0 && (
          <EmptyState
            title="No Tools Yet"
            description="Start by adding your first tool."
            buttonText="Add Task"
            buttonAction={() => openCreateModal()}
          />
        )}
        <StatsCards stats={stats} />
        <section className="dashboard-widgets">
          <article className="chart-card progress-card">
            <div className="card-heading">
              <h3>Project Progress Overview</h3>
              <button type="button">This Month</button>
            </div>
            <div className="progress-graph" aria-label="Project progress chart">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
              <svg viewBox="0 0 680 220" role="img" preserveAspectRatio="none">
                <path d={buildProgressPath(charts.weeklyProgress)} />
                {charts.weeklyProgress.length > 0 && <circle {...getProgressPoint(charts.weeklyProgress, Math.min(2, charts.weeklyProgress.length - 1))} r="5" />}
              </svg>
              <div className="graph-tooltip">Completion<br /><strong>Progress: {stats.completionRate}%</strong></div>
              <div className="graph-dates">
                {(charts.weeklyProgress.length ? charts.weeklyProgress : [{ name: '-' }]).map((item) => <span key={item.name}>{item.name}</span>)}
              </div>
            </div>
          </article>

          <article className="chart-card deadlines-card">
            <div className="card-heading">
              <h3>Upcoming Deadlines</h3>
              <a href="#tasks">View all</a>
            </div>
            {deadlines.map((task) => (
              <div className={`deadline-item ${priorityTone(task.priority)}`} key={task._id}>
                <div>
                  <strong>{task.title}</strong>
                  <span>{task.projectId?.title || 'No project'} - {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                </div>
                <small>{task.priority}</small>
              </div>
            ))}
            {deadlines.length === 0 && <EmptyState title="No Borrow Requests" description="No pending requests." />}
          </article>
        </section>
        <section className="lower-widgets">
          <article className="chart-card activity-card">
            <div className="card-heading">
              <h3>Recent Activity</h3>
              <a href="#tasks">View all</a>
            </div>
            {activity.map((item) => (
              <div className="activity-item" key={item._id}>
                <div className="mini-avatar">{initials(item.userId?.name)}</div>
                <p><strong>{item.userId?.name || 'User'}</strong> {item.action.toLowerCase()}<span>{item.targetName} - {new Date(item.createdAt).toLocaleString()}</span></p>
              </div>
            ))}
            {activity.length === 0 && <EmptyState title="No Activity Yet" description="Workspace activity will appear here." />}
          </article>
          <article className="chart-card assigned-card">
            <div className="card-heading">
              <h3>Assigned Tasks</h3>
              <a href="#tasks">View all</a>
            </div>
            {tasks.filter((task) => task.status !== 'Completed').slice(0, 4).map((task) => (
              <div className="assigned-task" key={task._id}>
                <input type="checkbox" checked={task.status === 'Completed'} onChange={(event) => handleTaskChecked(task, event.target.checked)} />
                <strong>{task.title}</strong>
                <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
              </div>
            ))}
            {tasks.filter((task) => task.status !== 'Completed').length === 0 && <EmptyState title="No Assigned Tools" description="Everything is clear for now." />}
          </article>
        </section>
        <KanbanBoard
          tasks={tasks}
          project={projects[0]}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onCreateTask={openCreateModal}
        />
        <AnalyticsCharts tasks={tasks} charts={charts} />
      </section>

      {showModal && (
        <TaskModal
          task={selectedTask}
          initialStatus={initialTaskStatus}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}

function initials(name = 'User') {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function priorityTone(priority) {
  if (priority === 'High') return 'red';
  if (priority === 'Medium') return 'orange';
  return 'blue';
}

function buildProgressPath(points = []) {
  if (!points.length) return 'M40 200 L660 200';
  return points.map((point, index) => {
    const { x, y } = getProgressPoint(points, index);
    return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
  }).join(' ');
}

function getProgressPoint(points = [], index = 0) {
  const left = 40;
  const right = 660;
  const top = 14;
  const bottom = 200;
  const step = points.length > 1 ? (right - left) / (points.length - 1) : 0;
  const value = Math.max(0, Math.min(points[index]?.value || 0, 100));

  return {
    x: left + index * step,
    y: bottom - (value / 100) * (bottom - top)
  };
}

export default Dashboard;
