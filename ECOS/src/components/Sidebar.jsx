import { NavLink } from 'react-router-dom'

function NavItem({ to, label, icon, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `nav-item w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-200 ${
          isActive ? 'active' : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      {label}
    </NavLink>
  )
}

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-neutral-800 bg-[#050505] h-screen fixed left-0 top-0 z-20">
      {/* Logo / Title */}
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-orange-500 glow-text">ECOS</span>
        </h1>
        <p className="text-sm text-neutral-400 mt-1">Security Agreement</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4">
        <NavItem to="/agreement" label="New Agreement" icon="📝" end />
        <NavItem to="/workflow" label="Workflow Status" icon="🔄" />
        <NavItem to="/dashboard" label="Admin Dashboard" icon="📊" />
      </nav>

      {/* Footer — Role switcher placeholder (Phase 5) */}
      <div className="p-4 border-t border-neutral-800">
        {/* Role switcher placeholder — Phase 5 */}
      </div>
    </aside>
  )
}

export function MobileNav({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 z-30 lg:hidden"
        onClick={onClose}
      />

      {/* Slide-out panel */}
      <div className="fixed inset-y-0 left-0 w-64 bg-[#050505] border-r border-neutral-800 z-40 lg:hidden flex flex-col">
        {/* Logo / Title */}
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-orange-500 glow-text">ECOS</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Security Agreement</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4">
          <NavItem to="/agreement" label="New Agreement" icon="📝" onClick={onClose} end />
          <NavItem to="/workflow" label="Workflow Status" icon="🔄" onClick={onClose} />
          <NavItem to="/dashboard" label="Admin Dashboard" icon="📊" onClick={onClose} />
        </nav>

        {/* Footer — Role switcher placeholder (Phase 5) */}
        <div className="p-4 border-t border-neutral-800">
          {/* Role switcher placeholder — Phase 5 */}
        </div>
      </div>
    </>
  )
}
