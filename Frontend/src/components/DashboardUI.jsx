import React, { useState } from 'react';
import officeImg from '../assets/office.jpg';
import Sidebar from './sidebar/Sidebar';
import { CheckSquare, Users, FolderKanban, Search, Bell } from 'lucide-react';

/*
  Consolidated dashboard UI components:
  - TopBar
  - WelcomeCard
  - ProfileCard (with Progress SVGs)
  - StatCard
  - RecentActivities
  - CompleteProfileCard

  Export: default DashboardUI
*/

const TopBar = () => {
  const [query, setQuery] = useState('');

  return (
    <header className="flex h-20 items-center justify-between rounded-2xl bg-white px-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="relative w-[400px] max-w-[60vw]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            className="w-full rounded-full border-2 border-gray-200 bg-gray-50 py-3 pl-12 pr-6 text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#087990] focus:border-transparent focus:bg-white transition-all duration-200"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative rounded-full p-3 text-gray-500 hover:bg-gray-100 hover:text-[#087990] transition-all duration-200 group">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="flex items-center gap-3 bg-gray-50 rounded-full pl-4 pr-2 py-2 hover:bg-gray-100 transition-all duration-200 cursor-pointer">
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-gray-800">John Doe</span>
            <span className="text-xs text-gray-500">Employee</span>
          </div>
          <img src="https://i.pravatar.cc/40?img=12" alt="John Doe" className="h-10 w-10 rounded-full ring-2 ring-white shadow-md" />
        </div>
      </div>
    </header>
  );
};

const StatCard = ({ icon, number, label }) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-[12px] bg-card p-6 text-center shadow-md">
    <div className="rounded-full bg-[#F1F5F9] p-3 text-primary">{icon}</div>
    <div className="text-2xl font-semibold text-text-primary">{number}</div>
    <div className="text-sm text-text-secondary">{label}</div>
  </div>
);

const WelcomeCard = () => (
  <div
    className="relative col-span-2 overflow-hidden rounded-[12px] shadow-md"
    style={{ minHeight: '160px' }}
  >
    <img
      src={officeImg}
      alt="Team workspace"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/15" />

    <div className="relative flex items-center gap-6 px-6 py-6 text-white">
      <div className="flex-1">
        <h2 className="text-2xl font-semibold drop-shadow">Dashboard</h2>
        <p className="mt-1 text-sm text-white/90">Welcome, John Doe</p>
        <p className="mt-4 text-sm text-white/80">Upcoming: Team sync at 3:00 PM</p>
      </div>
      <div className="hidden h-28 w-36 shrink-0 rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm lg:block" />
    </div>
  </div>
);

const ProfileCard = () => {
  const Progress = ({ color, percent }) => {
    const r = 18;
    const c = 2 * Math.PI * r;
    const offset = c - (percent / 100) * c;
    return (
      <svg width="44" height="44" viewBox="0 0 44 44" className="rounded-full">
        <circle cx="22" cy="22" r={r} stroke="#F3F4F6" strokeWidth="6" fill="none" />
        <circle
          cx="22"
          cy="22"
          r={r}
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 22 22)"
        />
      </svg>
    );
  };

  return (
    <div className="rounded-[12px] bg-card p-4 shadow-md">
      <div className="flex items-center gap-4">
        <img src="https://i.pravatar.cc/88?img=12" alt="John Doe" className="h-20 w-20 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-text-primary">John Doe</div>
              <div className="text-[13px] text-text-secondary">UI/UX Designer</div>
            </div>
            <div className="flex gap-2">
              <Progress color="#8B5CF6" percent={50} />
              <Progress color="#FB7185" percent={50} />
              <Progress color="#0E8A8A" percent={50} />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold text-text-primary">Last Activities</div>
            <ul className="mt-2 space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-[#3B82F6]">●</span>
                <span>Your attendance correction was reviewed by admin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F59E0B]">●</span>
                <span>Your project status was updated by the team lead</span>
              </li>
              <li className="text-sm mt-2">
                <a className="text-info hover:underline" href="#">See All</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentActivities = () => {
  const items = [
    { text: 'Katherine has updated her profile' },
    { text: 'Emily requested leave' },
    { text: 'James assigned a new task' },
    { text: 'Michael updated project status' },
  ];

  return (
    <div className="rounded-[12px] bg-card p-4 shadow-md">
      <h3 className="text-lg font-semibold text-text-primary">Recent Activities</h3>
      <ul className="mt-3 space-y-3 text-text-secondary">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-[#0E8A8A]/80" />
            <div className="text-sm">{it.text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CompleteProfileCard = () => (
  <div className="rounded-[12px] bg-card p-3 shadow-md">
    <div className="text-sm font-semibold text-text-primary">Complete Profile</div>
    <div className="mt-3 text-sm text-text-secondary">Your profile was done with 20%</div>
    <div className="mt-3 h-3 w-full rounded-full bg-[#E5E7EB]">
      <div className="h-3 rounded-full bg-primary" style={{ width: '20%' }} />
    </div>
  </div>
);

export default function DashboardUI() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col gap-6 p-6 bg-gray-50 overflow-y-auto">
        <TopBar />

        <section className="grid grid-cols-3 gap-6">
          <WelcomeCard />

          <div className="col-span-1 flex flex-col gap-4">
            <ProfileCard />
          </div>
        </section>

        <section className="grid grid-cols-3 gap-4">
          <StatCard icon={<CheckSquare className="w-6 h-6 text-[#087990]" />} number={34} label="Assigned Tasks" />
          <StatCard icon={<Users className="w-6 h-6 text-[#6366F1]" />} number={12} label="Employees" />
          <StatCard icon={<FolderKanban className="w-6 h-6 text-[#F59E0B]" />} number={5} label="Active Projects" />
        </section>

        <section className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <RecentActivities />
          </div>
          <div className="col-span-1">
            <div className="space-y-4">
              <CompleteProfileCard />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
