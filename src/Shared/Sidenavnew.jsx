import React, { useState } from "react";
import { Link } from "react-router-dom";
import { menuitems } from "../Staticitems/Menuitems";

export default function Sidenavnew() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedMenus, setExpandedMenus] = useState({});
  const [selectedItem, setSelectedItem] = useState("");
  const sidebarWidth = 360;

  const toggleSubmenu = (title) => {
    setExpandedMenus((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  };

  const handleMenuClick = (title) => {
    setSelectedItem(title); // Set the selected item
  };

  const filterMenu = (items, searchTerm) => {
    return items
      .map((item) => {
        const matches = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const filteredSubmenu = item.submenu ? filterMenu(item.submenu, searchTerm) : [];
        if (matches || filteredSubmenu.length > 0) {
          return {
            ...item,
            submenu: filteredSubmenu,
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  const renderMenu = (items) => {
    return items.map((item, index) => (
      <div key={`${item.title}-${index}`} className="mb-1">
        <div
          className={`menu-item flex justify-between items-center rounded-lg transition-all cursor-pointer ${selectedItem === item.title ? "bg-[#A390FF] text-white" : "hover:bg-[#A390FF] hover:text-white"
            }`}
        >
          {item.submenu?.length > 0 ? (
            <div
              className="flex-1 text-sm px-4 py-3 font-medium text-[#333333]"
              onClick={() => {
                toggleSubmenu(item.title);
                handleMenuClick(item.title);
              }}
            >
              {item.title}
            </div>
          ) : (
            <Link
              to={item.to}
              className="flex-1 text-sm font-medium px-4 py-3 text-[#333333]"
              onClick={() => { handleMenuClick(item.title); setIsOpen(!isOpen); }}
            >
              {item.title}
            </Link>
          )}
          {item.submenu?.length > 0 && (
            <span
              onClick={() => toggleSubmenu(item.title)}
              className={` mr-4 transition-transform transform ${expandedMenus[item.title] ? "rotate-180" : ""
                }`}
            >
              ▼
            </span>
          )}
        </div>
        {item.submenu && expandedMenus[item.title] && (
          <div className="ml-4 border-l border-gray-600 py-4">
            {renderMenu(item.submenu)}
          </div>
        )}
      </div>
    ));
  };

  const filteredItems = filterMenu(menuitems, searchTerm);

  return (
    <div>

      <div
        className={`fixed z-30 top-0 left-0 h-full bg-[#E0E0E0] text-white shadow-lg transition-transform duration-1000 ease-in-out`}
        style={{
          // background: "linear-gradient(to bottom, #8979ee, #5e3b82)",
          width: `${sidebarWidth}px`,
          transform: isOpen ? "translateX(0)" : `translateX(-${sidebarWidth}px)`,
        }}
      >

        <div className="px-4 pt-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 bg-[#fff] text-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:[#A390FF] transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>


        <div
          className="mt-4 overflow-y-auto h-[calc(100vh-64px)]"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#5e3b82 transparent",
          }}
        >
          {filteredItems.length > 0 ? (
            renderMenu(filteredItems)
          ) : (
            <div className="px-4 py-2 text-sm text-[#333333]">No matching items found</div>
          )}
        </div>
      </div>


      <button
        className="fixed top-1 left-4 z-50 p-2 text-[#333333] bg-transparent rounded-full transition-all duration-1000 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          left: isOpen ? `${sidebarWidth + 10}px` : "10px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-10 text-zab-hombtn text-3xl"
          fill="none"
          viewBox="0 1 24 22"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
}
