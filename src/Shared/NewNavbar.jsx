import React, { useContext, useEffect } from 'react';
import ProfileDropdown from './ProfileDropdown';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { SidebarContext } from '../context/SidebarProvider';
import { MenuOpen } from '@mui/icons-material';

const NewNavbar = () => {
  const {sideBarOpen, setSideBarOpen} = useContext(SidebarContext)

  const handleMenu = () => {
    setSideBarOpen(!sideBarOpen)
  }

  useEffect(() => {
    console.log(sideBarOpen)
  }, [sideBarOpen])

  return (
    <nav className="p-4 bg-white flex justify-between shadow-md">
      <div className={`transition-all duration-500 ${sideBarOpen ? "ml-64" : "ml-0"} cursor-pointer`} onClick={() => handleMenu()}>
        {sideBarOpen ? <MenuIcon sx={{fontSize: "2rem"}}></MenuIcon> : <MenuOpen sx={{fontSize: "2rem"}}></MenuOpen>}
      </div>
      <div className="flex justify-between items-center z-0">
        {/* <div className="text-lg font-semibold">Tuly Digital Studio</div> */}
          
        <div className="space-x-4">
          {/* <a href="#" className="hover:text-gray-300">Profile</a> */}
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
};

export default NewNavbar;