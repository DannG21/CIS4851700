import UserStats from './UserStats';
import RecentActivity from './RecentActivity';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <UserStats />
      <RecentActivity />
    </div>
  );
}