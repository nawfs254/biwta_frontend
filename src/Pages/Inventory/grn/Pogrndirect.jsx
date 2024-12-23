import React, { useState, useEffect, useRef, useLayoutEffect, useContext } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import SortableList from "../../../ReusableComponents/SortableList";
import XcodesDropDown from "../../../ReusableComponents/XcodesDropDown";
import DynamicDropdown from "../../../ReusableComponents/DynamicDropdown";
import ReceiveUpdate from "./ReceiveUpdate";
import axiosInstance from "../../../Middleware/AxiosInstance";
import { SidebarContext } from "../../../context/SidebarProvider";

export default function Pogrndirect() {
  const zid = localStorage.getItem("zid");
  const supplierRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReceiveUpdateModalOpen, setIsReceiveUpdateModalOpen] =
    useState(false);
  const [selectedGrnNumber, setSelectedGrnNumber] = useState(null);
  const [grnData, setGrnData] = useState(null);
  const [filters, setFilters] = useState({
    xwh: "",
    fromDate: "",
    toDate: "",
    // status: "",
    xcus: "",
  });
  const [searchResults, setSearchResults] = useState([]);

  const [supDropdownOpen, setSupDropdownOpen] = useState(false);
  const [additionalParams, setAdditionalParams] = useState({});
  const [searchClicked, setSearchClicked] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const apiUrl = `api/pogrnheader/filteredGrnList/${zid}`;
  const [pageSize, setPageSize] = useState(10);
  const [localSearch, setLocalSearch] = useState("");

  const columns = [
    { field: "xgrnnum", title: "Receive No" },
    { field: "xdate", title: "Date" },
    // { field: "xorg", title: "Supplier" },
    { field: "xlong", title: "Store" },
    { field: "xstatusdoc", title: "Status" },
  ];

  const supConfig = [
    { header: "Supplier ID", field: "xcus" },
    { header: "Name", field: "xorg" },
    { header: "Address", field: "xmadd" },
  ];
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const handleLocalSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setLocalSearch(searchValue);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
  };

  const handleUpdate = async (row) => {
    setSelectedGrnNumber(row.xgrnnum);
    try {
      const response = await axiosInstance.get(
        `/api/grn/${zid}/${row.xgrnnum}`
      );
      console.log(response);
      setGrnData(response.data);
      setIsReceiveUpdateModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch GRN data:", error);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setSearchClicked((prev) => prev + 1);
    // setSearchClicked(true)
    setIsModalOpen(false);
  };

  const handlePrintPdf = (row) => {
    console.log("pdf called " + row.xgrnnum);
  };

  const handleReceiveUpdateCloseModal = () => {
    setSearchClicked((prev) => prev + 1);
    setIsReceiveUpdateModalOpen(false);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };


  const handleResultClick = (result) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      xcus: result.xcus,
    }));
    setSupDropdownOpen(false);
  };

  const handleDropdownSelect = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handleFilterSearch = async () => {
    setAdditionalParams(filters);
    setSearchClicked((prev) => prev + 1);

    try {
      const response = await axiosInstance.get(apiUrl, { params: filters });
      setFilteredData(response.data); // Update search results based on the response
    } catch (error) {
      console.error("Failed to fetch filtered data:", error);
    }
  };

  useLayoutEffect(() => {
    const handlePositionUpdate = () => {
      if (supplierRef.current) {
        const triggerRect = supplierRef.current.getBoundingClientRect();
        const parentScrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        const parentScrollLeft =
          document.documentElement.scrollLeft || document.body.scrollLeft;

        if (triggerRect) {
          //   console.log(triggerRect.bottom);
          setDropdownPosition({
            top: parentScrollTop + triggerRect.bottom,
            left: parentScrollLeft + triggerRect.left,
            width: triggerRect.width + 300,
          });
        }
      }
    };

    handlePositionUpdate();

    window.addEventListener("resize", handlePositionUpdate);
    window.addEventListener("scroll", handlePositionUpdate);

    return () => {
      window.removeEventListener("resize", handlePositionUpdate);
      window.removeEventListener("scroll", handlePositionUpdate);
    };
  }, [filters.xcus]);

  const {sideBarOpen} = useContext(SidebarContext)

  return (
    <div className={`transition-all duration-500 ${sideBarOpen ? "ml-64" : "ml-0"}`}>
      <Box sx={{ p: 3, minHeight: "100vh" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" fontWeight="medium" color="#595983">
            Receive List
          </Typography>

        </Box>

        <Box sx={{ backgroundColor: "white", p: 3, borderRadius: 2 }}>
          <Button variant="contained" onClick={handleOpenModal}
            sx={{ backgroundColor: '#6366F1', "&:hover": { backgroundColor: "#4F46E5" } }}
          >
            Add New +
          </Button>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 2,
              my: 3,
            }}
          >
            <XcodesDropDown
              id="xwh"
              name="xwh"
              label="Branch"
              type="Branch"
              onSelect={(value) => handleDropdownSelect("xwh", value)}
              value={filters.xwh}
            />
            <DynamicDropdown
              isOpen={supDropdownOpen}
              onClose={() => setSupDropdownOpen(false)}
              triggerRef={supplierRef}
              data={searchResults}
              headers={supConfig.map((config) => config.header)}
              onSelect={handleResultClick}
              dropdownWidth={800}
              dropdownHeight={400}
              dropdownPosition={dropdownPosition}
            />
            {/* <TextField
          ref={supplierRef}
          id="xcus"
          name="Supplier"
          label="Supplier Code"
          size="small"
          value={filters.xcus || ""}
          variant="outlined"
          fullWidth
          onChange={(e) => {
            handleFilterChange("xcus", e.target.value);
            const query = e.target.value;
            const apiSearchUrl = `api/cacus/${zid}/search?searchText=${query}&searchFields=xcus,xorg,xmobile`;
            handleSearch(
              e.target.value,
              apiSearchUrl,
              supConfig,
              setSearchResults,
              setSupDropdownOpen,
              supplierRef,
              // setDropdownPosition,
              { zid }
            );
          }}
        /> */}

            <TextField
              label="From Date"
              type="date"
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filters.fromDate}
              onChange={(e) => handleFilterChange("fromDate", e.target.value)}
            />
            <TextField
              label="To Date"
              type="date"
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filters.toDate}
              onChange={(e) => handleFilterChange("toDate", e.target.value)}
            />
            {/* <TextField
          label="Status"
          variant="outlined"
          size="small"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        /> */}

            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="success"
              onClick={handleFilterSearch}
              sx={{ backgroundColor: '#6366F1', "&:hover": { backgroundColor: "#4F46E5" }, mx: sideBarOpen ? 2 : 4, transition: "all 0.5s ease" }}
            >
              Search
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            {/* Entry count selector */}
            <FormControl variant="outlined" size="small" sx={{ width: "150px" }}>
              <InputLabel id="entry-count-label">Entries per page</InputLabel>
              <Select
                labelId="entry-count-label"
                value={pageSize}
                // onChange={(e) => setPageSize(e.target.value)}
                onChange={handlePageSizeChange}
                label="Entries per page"
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>

            {/* Client-side search field */}
            <TextField
              label="Search in results"
              variant="outlined"
              size="small"
              sx={{ width: "300px" }}
              value={localSearch}
              onChange={handleLocalSearchChange}
            />
          </Box>

          <SortableList
            apiUrl={apiUrl}
            columns={columns}
            onUpdate={handleUpdate}
            additionalParams={additionalParams}
            searchClicked={searchClicked}
            searchInput={localSearch}
            pageSize={pageSize}
            printPdf={handlePrintPdf}
          />
        </Box>



        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
            }}
          >
            <ReceiveUpdate onClose={handleCloseModal} />
          </Box>
        </Modal>

        <Modal
          open={isReceiveUpdateModalOpen}
          onClose={handleReceiveUpdateCloseModal}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
            }}
          >
            <ReceiveUpdate
              onClose={handleReceiveUpdateCloseModal}
              grnData={grnData}
              grnNumber={selectedGrnNumber}
            />
          </Box>
        </Modal>
      </Box>
    </div>
  );
}
