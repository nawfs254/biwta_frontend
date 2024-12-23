import React, { createContext, useContext, useEffect } from "react";
// import Navbar from "../Shared/Navbar";
import { ToastContainer } from "react-toastify";
import Sidebar from "../Shared/Sidebar";
import { Outlet } from "react-router-dom";
// import Subnav from "../Shared/Subnav";
import "react-toastify/dist/ReactToastify.css";
import NewNavbar from "../Shared/NewNavbar";
import Breadcrumbs from "../utility/Breadcrumb";
import MenuIcon from '@mui/icons-material/Menu';
import { SidebarContext, SidebarProvider } from "../context/SidebarProvider";


const Main = () => {

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* Navbar */}
        <div className="w-full fixed top-0 left-0 z-20">
          <NewNavbar />
        </div>

        {/* Main Content */}
        <div className="flex flex-row  bg-[#F6F5FF]">
          {/* Sidebar */}
          <div className="w-64 fixed left-0 z-30">
            <Sidebar />
          </div>

          {/* Content Area */}
          <div className="flex-grow overflow-y-auto">
            {/* <Subnav /> */}

            <div className="flex-grow mt-[60px] rounded-md">
              {/* <Breadcrumbs />
            <div className="w-full mb-0">
              <hr className="border-t border-gray-300" />
            </div> */}
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Main;
