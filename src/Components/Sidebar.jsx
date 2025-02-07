import { useState } from "react";
import { FaBars, FaHome, FaSignOutAlt, FaUser } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { RiUserSettingsFill, RiUserSharedFill } from "react-icons/ri";
import { FaUserShield } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function Sidebar({ activeTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Force refresh
  };

  // Toggle sidebar state
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-second text-main h-screen p-5 pt-8 fixed top-0 right-0 transition-all duration-300 ${
          isOpen ? "w-60" : "w-16"
        }`}
      >
        {/* Toggle Button */}
        <button
          className="absolute top-4 left-5 text-main text-2xl cursor-pointer"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>

        {/* Sidebar Content */}
        <ul
          className={`mt-10 space-y-6 flex flex-col ${
            isOpen ? "items-start" : "items-center"
          }`}
        >
          <SidebarItem
            isOpen={isOpen}
            icon={<FaHome />}
            title="الرئيسية"
            to="/"
            activeTab={activeTab}
          />
          <SidebarItem
            isOpen={isOpen}
            icon={<FaUser />}
            title="المستخدمين"
            to="/users"
            activeTab={activeTab}
          />
          <SidebarItem
            isOpen={isOpen}
            icon={<RiUserSharedFill />}
            title="طلبات الانضمام"
            to="/requests"
            activeTab={activeTab}
          />
          <SidebarItem
            isOpen={isOpen}
            icon={<RiUserSettingsFill />}
            title="طلبات التعديل"
            to="/editrequests"
            activeTab={activeTab}
          />
          <SidebarItem
            isOpen={isOpen}
            icon={<FaUserShield />}
            title="المسؤلين"
            to="/admins"
            activeTab={activeTab}
          />
          <SidebarItem
            isOpen={isOpen}
            icon={<MdVerified />}
            title="اكواد التحقق"
            to="/codes"
            activeTab={activeTab}
          />
          <SidebarItem
            isOpen={isOpen}
            icon={<FaSignOutAlt />}
            title="تسجيل الخروج"
            to="#"
            activeTab=""
            onClick={handleLogout} // Pass the function here
          />
        </ul>
      </div>
    </div>
  );
}

// Sidebar Item Component
const SidebarItem = ({ icon, title, isOpen, to, activeTab, onClick }) => {
  const isActive = activeTab === title;

  return (
    <li
      className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all duration-300 
        ${isActive ? "bg-main text-second" : "hover:bg-main hover:text-second"}
      `}
      onClick={onClick} // Allow handling clicks
    >
      {to !== "#" ? (
        <Link to={to} className="flex items-center w-full gap-2">
          <span className="text-xl">{icon}</span>
          <span
            className={`text-lg ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}
          >
            {title}
          </span>
        </Link>
      ) : (
        <div className="flex items-center w-full gap-2">
          <span className="text-xl">{icon}</span>
          <span
            className={`text-lg ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}
          >
            {title}
          </span>
        </div>
      )}
    </li>
  );
};
