import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontSize: 13, // Set the default font size globally
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '13px', // For all input components
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontSize: '13px', // For all TextField components
        },
      },
    },
      MuiTableCell: {
        styleOverrides: {
          root: {
            border: "1px solid #e0e0e0", // Applies border globally to all TableCells
          },
        },
      },
    
  },
});

export default theme;