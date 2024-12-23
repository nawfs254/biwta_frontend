import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PrintIcon from "@mui/icons-material/Print";
import axiosInstance from "../Middleware/AxiosInstance";



const SortableList = ({
  apiUrl,
  columns,
  onUpdate,
  onDelete,
  printPdf,
  searchClicked,
  additionalParams = {},
  pageSize,
  searchInput
}) => {
  console.log(searchClicked, additionalParams)
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [originalRows, setOriginalRows] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [xsortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalEntries, setTotalEntries] = useState(0);





  useEffect(() => {
    setPage(1);
  }, [pageSize, searchClicked]);

  // just api
  const constructApiUrl = useMemo(() => {
    const sortQuery = xsortField
      ? `&sortBy=${xsortField}&ascending=${sortOrder === "asc"}`
      : "";
    return `${apiUrl}?page=${page - 1}&size=${pageSize}${sortQuery}`;
  }, [apiUrl, page, pageSize, xsortField, sortOrder]);

  //data fetching
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(constructApiUrl, {
        params: { ...additionalParams },
      });
      console.log(response)
      const fetchedRows = response.data.content || [];
      setOriginalRows(fetchedRows); // Store the full dataset
      setRows(fetchedRows);
      setTotalPages(response.data.page.totalPages || 1);
      setTotalEntries(response.data.page.totalElements || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch
  useEffect(() => {
    if (searchClicked) {
      // setPage(1)
      fetchData();
    }

  }, [constructApiUrl, additionalParams, searchClicked]);

  // local search
  useEffect(() => {
    if (searchInput) {
      const filteredRows = originalRows.filter((row) =>
        columns.some((col) => {
          const cellValue = row[col.field]?.toString().toLowerCase() || "";
          return cellValue.includes(searchInput.toLowerCase());
        })
      );
      setRows(filteredRows);
      setTotalEntries(filteredRows.length); // Update total entries for filtered data
    } else {
      setRows(originalRows); // Reset to original rows if no search input
      setTotalEntries(originalRows.length);
    }
  }, [searchInput, originalRows, columns]);



  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, border: "1px solid #EFF0FE" }}>
          <TableHead sx={{ paddingBottom: 0 }}>
            <TableRow
              sx={{
                "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                "& .MuiTableCell-root": {
                  paddingTop: 2,
                  paddingBottom: 2,
                },
              }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  sx={{
                    fontWeight: "bold",
                    cursor: "pointer",
                    borderRight: "1px solid #e0e0e0",
                  }}
                  onClick={() => handleSort(col.field)}
                >
                  {col.title}{" "}
                  {xsortField === col.field
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  align="center"
                  sx={{
                    paddingY: 0,
                    "& .MuiTableCell-root": {
                      paddingTop: 0,
                      paddingBottom: 0,
                      borderBottom: "1px solid rgba(224, 224, 224, 1)", // Light border for table cells
                    },
                  }}
                >
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    // backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",  
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#f1f1f1",
                      cursor: "pointer"
                    },
                    "& .MuiTableCell-root": {
                      paddingTop: 0,
                      paddingBottom: 0,
                      borderBottom: "1px solid rgba(224, 224, 224, 1)", // Light border for table cells
                    },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.field}
                      sx={{ padding: "8px", fontSize: "0.875rem" }}
                    >
                      {row[col.field] || "N/A"}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {row.xstatusdoc === "Open" ? (
                        <>
                          <IconButton
                            color="success"
                            onClick={() => onUpdate(row)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => onDelete(row)}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton
                            color="success"
                            onClick={() => onDelete(row)}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => printPdf(row)}>
                            <PrintIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            onClick={() => printPdf(row)}
                          >
                            <PrintIcon />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>


      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
        px={2}
      >
        {/* Showing entries text */}
        <Typography variant="body2">
          Showing {rows.length} entries of {totalEntries}
        </Typography>

        {/* Pagination */}
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          size="small"
        />
      </Box>
    </Box>
  );
};

export default SortableList;
