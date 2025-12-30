import {
  Bell,
  CalendarDays,
  CheckSquare2,
  ChevronDown,
  ListChecks,
  Megaphone,
  MessageCircle,
  Paperclip,
  Pin,
  Plus,
  Search,
  Users,
} from "lucide-react";
import Sidebar from "../../components/sidebar/Sidebar";

const LabeledField = ({ label, children }) => (
  <div className="space-y-2">
    <p className="text-sm font-semibold text-[#1F2937]">{label}</p>
    {children}
  </div>
);

const SelectField = ({ icon: Icon, defaultValue, options }) => (
  <div className="relative">
    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0A7C86]">
      <Icon size={18} />
    </div>
    <select
      defaultValue={defaultValue}
      className="w-full appearance-none rounded-lg border border-[#C9CED6] bg-white py-3 pl-10 pr-10 text-sm font-medium text-[#1F2937] shadow-sm focus:border-[#0A7C86] focus:outline-none focus:ring-2 focus:ring-[#0A7C86]/20"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
  </div>
);

const ToggleCard = ({ icon: Icon, label, defaultChecked = false }) => (
  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#C9CED6] bg-white px-4 py-3 text-sm font-medium text-[#1F2937] shadow-[0_8px_24px_rgba(10,124,134,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(10,124,134,0.12)]">
    <input type="checkbox" className="hidden" defaultChecked={defaultChecked} />
    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#E5F6F7] text-[#0A7C86]">
      <Icon size={18} />
    </span>
    {label}
  </label>
);

const PillButton = ({ variant = "solid", children }) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition shadow-sm";
  const styles = {
    solid: "bg-[#0A7C86] text-white hover:bg-[#0E8F9E]",
    ghost: "border border-[#0A7C86] text-[#0A7C86] bg-white hover:bg-[#E5F6F7]",
    danger: "bg-[#E84545] text-white hover:bg-[#c93838]",
  };
  return <button className={`${base} ${styles[variant]}`}>{children}</button>;
};

const AdminAnnouncements = () => {
  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#1F2937]">
      <div className="flex h-full min-h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Header */}
          <header className="flex items-center justify-between border-b border-[#C9CED6]/80 bg-white px-8 py-4">
            <div className="relative w-full max-w-xl">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                className="w-full rounded-full border border-[#C9CED6] bg-white py-2.5 pl-10 pr-4 text-sm text-[#1F2937] placeholder:text-[#6B7280] focus:border-[#0A7C86] focus:outline-none focus:ring-2 focus:ring-[#0A7C86]/20"
                placeholder="Search"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9CED6] bg-white text-[#0A7C86] hover:bg-[#E5F6F7]">
                <Bell size={18} />
              </button>

              <div className="flex items-center gap-3 rounded-full border border-[#C9CED6] bg-white px-3 py-2 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-[url('https://i.pravatar.cc/80?img=48')] bg-cover bg-center" />
                <div className="leading-tight">
                  <p className="text-sm font-semibold">Sachi</p>
                  <p className="text-xs text-[#6B7280]">Admin</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto px-8 py-6">
            <p className="text-sm text-[#6B7280]">Create / Edit Announcement & Detail / Engagement</p>

            <div className="mt-2 flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Create and Edit Announcement Form</h1>
              <div className="flex items-center gap-3 text-[#0A7C86]">
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9CED6] bg-white shadow-sm hover:bg-[#E5F6F7]">
                  <Plus size={18} />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9CED6] bg-white shadow-sm hover:bg-[#E5F6F7]">
                  <ListChecks size={18} />
                </button>
              </div>
            </div>

            <section className="mt-6 space-y-6">
              <div className="rounded-2xl border border-[#C9CED6] bg-[#E9ECEF] shadow-[0_12px_36px_rgba(17,94,104,0.08)]">
                <div className="space-y-5 p-6">
                  <LabeledField label="Title :">
                    <input
                      className="w-full rounded-lg border border-[#C9CED6] bg-white px-4 py-3 text-sm text-[#1F2937] placeholder:text-[#6B7280] focus:border-[#0A7C86] focus:outline-none focus:ring-2 focus:ring-[#0A7C86]/20"
                      placeholder="Title :"
                    />
                  </LabeledField>

                  <LabeledField label="Message (0/2000 chars)">
                    <textarea
                      rows={6}
                      className="w-full rounded-lg border border-[#C9CED6] bg-white px-4 py-3 text-sm text-[#1F2937] placeholder:text-[#6B7280] focus:border-[#0A7C86] focus:outline-none focus:ring-2 focus:ring-[#0A7C86]/20"
                      placeholder="Type your announcement here......"
                    />
                  </LabeledField>

                  <div className="grid gap-4 lg:grid-cols-3">
                    <LabeledField label="Priority">
                      <SelectField icon={Megaphone} defaultValue="Normal" options={["Normal", "High", "Urgent"]} />
                    </LabeledField>

                    <LabeledField label="Status">
                      <SelectField icon={CalendarDays} defaultValue="Schedule" options={["Schedule", "Draft", "Published"]} />
                    </LabeledField>

                    <LabeledField label="Audience">
                      <SelectField icon={Users} defaultValue="All" options={["All", "Admins", "Team Leads", "Employees"]} />
                    </LabeledField>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-3">
                    <LabeledField label="Publish">
                      <div className="relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0A7C86]">
                          <CalendarDays size={18} />
                        </div>
                        <input
                          className="w-full rounded-lg border border-[#C9CED6] bg-white px-4 py-3 pl-10 text-sm text-[#1F2937] placeholder:text-[#6B7280] focus:border-[#0A7C86] focus:outline-none focus:ring-2 focus:ring-[#0A7C86]/20"
                          placeholder="Due : DD/MM/YYYY"
                        />
                      </div>
                    </LabeledField>

                    <LabeledField label="Expiry">
                      <div className="relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0A7C86]">
                          <CalendarDays size={18} />
                        </div>
                        <input
                          className="w-full rounded-lg border border-[#C9CED6] bg-white px-4 py-3 pl-10 text-sm text-[#1F2937] placeholder:text-[#6B7280] focus:border-[#0A7C86] focus:outline-none focus:ring-2 focus:ring-[#0A7C86]/20"
                          placeholder="Due : DD/MM/YYYY"
                        />
                      </div>
                    </LabeledField>

                    <div className="flex items-end">
                      <label className="flex w-full items-center justify-between rounded-lg border border-[#C9CED6] bg-white px-4 py-3 text-sm font-medium text-[#1F2937] shadow-sm">
                        <div className="flex items-center gap-3">
                          <CheckSquare2 className="text-[#0A7C86]" size={18} />
                          <span>Never Expire</span>
                        </div>
                        <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#0A7C86]" />
                      </label>
                    </div>
                  </div>

                  <LabeledField label="Attachments">
                    <div className="flex flex-col gap-2 rounded-lg border border-[#C9CED6] bg-white px-4 py-3 shadow-sm">
                      <button className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-[#0A7C86] bg-[#E5F6F7] px-4 py-2 text-sm font-semibold text-[#0A7C86] hover:bg-[#D8EFF1]">
                        <Paperclip size={16} /> Add Files
                      </button>
                      <p className="text-xs text-[#6B7280]">(Max 10MB, PDF/Images/Doc)</p>
                    </div>
                  </LabeledField>

                  <div className="grid gap-3 md:grid-cols-3">
                    <ToggleCard icon={Pin} label="Pin to top" />
                    <ToggleCard icon={MessageCircle} label="Allow comments" />
                    <ToggleCard icon={Bell} label="Notify all users" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-end gap-3 md:flex-row">
                <PillButton variant="danger">Cancel</PillButton>
                <PillButton variant="ghost">Preview</PillButton>
                <PillButton variant="solid">Publish Announcement</PillButton>
                <PillButton variant="solid">
                  <ListChecks size={16} /> Announcement Detail
                </PillButton>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncements;
