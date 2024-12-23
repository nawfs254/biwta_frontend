import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { menuitems } from "../Staticitems/Menuitems";
import {
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  Collapse,
} from "@mui/material";
import {
  ExpandMore,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { SidebarContext } from "../context/SidebarProvider";

export default function Sidebar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedMenus, setExpandedMenus] = useState({});

  const { sideBarOpen } = useContext(SidebarContext)

  const toggleSubmenu = (title) => {
    setExpandedMenus((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  };

  const filterMenu = (items, searchTerm) => {
    return items
      .map((item) => {
        const matches = item.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const filteredSubmenu = item.submenu
          ? filterMenu(item.submenu, searchTerm)
          : [];
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
      <Box key={`${item.title}-${index}`} sx={{ py: 1 }}>
        <ListItem
          button
          onClick={() =>
            item.submenu?.length > 0 ? toggleSubmenu(item.title) : null
          }
          sx={{
            px: 2,
            justifyContent: "space-between",
            display: "flex",
            transition: "background-color 0.3s ease, padding 0.4s ease",
            "&:hover": { backgroundColor: "transparent", color: "#7174F2" }
          }}
          disableGutters
        >
          <Link
            to={item.submenu?.length > 0 ? "#" : item.to}
            className="font-semibold"
            onClick={(e) => {
              if (item.submenu?.length > 0) {
                e.preventDefault();
              }
            }}
            style={{
              textDecoration: "none",
              fontWeight: 300,
              transition: "color 0.3s ease",
              color: expandedMenus[item.title] ? "#7174F2" : "#595983",
              display: "flex", // Ensure both icon and text are on the same line
              alignItems: "center",
              width: "100%"
            }}
          >
            {item.icon && (
              <img
                src={item.icon}
                alt={`${item.title} icon`}
                style={{ width: "18px", marginRight: "10px" }}
              />
            )}
            <Typography sx={{ transition: "color 0.3s ease", "&:hover": { color: "#7174F2" } }}>{item.title}</Typography>
          </Link>
          {item.submenu?.length > 0 && (
            <Typography
              sx={{
                cursor: "pointer",
                color: "#6B7280",
                "&:hover": { color: "#2563EB" },
              }}
            >
              {expandedMenus[item.title] ? (
                <ExpandMore />
              ) : (
                <KeyboardArrowRight />
              )}
            </Typography>
          )}
        </ListItem>
        {item.submenu && (
          <Collapse
            in={expandedMenus[item.title]}
            timeout={{ enter: 400, exit: 300 }}
            unmountOnExit
          >
            <Box sx={{ pl: 4, mt: 1, transition: "all 0.4s ease" }}>
              {renderMenu(item.submenu)}
            </Box>
          </Collapse>
        )}
      </Box>
    ));
  };

  const filteredItems = filterMenu(menuitems, searchTerm);

  return (
    <div className={`w-64 fixed left-0 z-30 transition-all duration-500 ${sideBarOpen ? "" : "transform -translate-x-full"}`}>
      <Box
        className="scrollbars"
        sx={{
          position: "fixed",
          left: 0,
          minHeight: "100vh",
          width: 250,
          backgroundColor: "#fff",
          boxShadow: "2px 0 2px rgba(0, 0, 0, 0.05)",
          overflowY: "auto",
          zIndex: 10
        }}
      >
        <div className="text-2xl font-bold p-4 text-center">BIWTA</div>
        {/* Search Input */}
        <Box
          sx={{
            px: 2,
            py: 2,
            borderBottom: "1px solid #E0E0E0",
          }}
        >
          <TextField
            placeholder="Search Items..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                borderRadius: 1,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#D1D5DB",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#2563EB",
              },
            }}
          />
        </Box>

        {/* Menu Items */}
        <Box>
          {filteredItems.length > 0 ? (
            <List sx={{ p: 0 }}>{renderMenu(filteredItems)}</List>
          ) : (
            <Box sx={{ px: 2, py: 3, textAlign: "center", color: "#9CA3AF" }}>
              <Typography variant="body2">No matching items found</Typography>
            </Box>
          )}
        </Box>
      </Box>  
    </div>
  );
}
