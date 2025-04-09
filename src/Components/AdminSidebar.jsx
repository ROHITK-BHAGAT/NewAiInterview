import React, { useState, useEffect } from "react";
import { Users, User, ClipboardList, LogOut, BookOpen, CheckSquare, Mails } from "lucide-react";
import { FaFile } from "react-icons/fa";
import { Link } from "react-router-dom";
// import { useLogin } from "../auth/LoginContext";
// import { useSidebar } from "../auth/SidebarContext";
import { useLogin } from "../auth/LoginContext";
import { useSidebar } from "../auth/SidebarContext ";
const AdminSidebar = () => {
  const [user, setUser] = useState(null);
  const { logout } = useLogin();
  const { isSidebarOpen } = useSidebar();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  const renderSidebarItems = () => {
    if (!user) return null;

    switch (user.user_type) {
     
      case "admin":
        return (
          <>
            <li><ClipboardList /><Link to="/admin_business_msg">Business Message</Link></li>
            <li><Users /><Link to="/all_users">All Users</Link></li>
            <li><BookOpen /><Link to="/hr_activity">HR Activity</Link></li>
            <li><CheckSquare /><Link to="/All_hr_candidate_report">All HR Candidate</Link></li>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {isSidebarOpen && (
        <aside className="sidebar">
          <div className="sidebar-header">
            <h1>MaitriAI</h1>
          </div>
          <nav>
            <ul>{renderSidebarItems()}</ul>
          </nav>
          <div className="logout">
            <LogOut />
            <Link to="/" onClick={handleLogout}>Logout</Link>
          </div>
        </aside>
      )}
    </>
  );
};

export default AdminSidebar;
