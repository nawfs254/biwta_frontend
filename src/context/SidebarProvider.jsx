import React, { createContext, useContext, useState } from "react";

// Create a Context for theme
export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [sideBarOpen, setSideBarOpen] = useState(true)


  

  return (
    <SidebarContext.Provider value={{ sideBarOpen, setSideBarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};
