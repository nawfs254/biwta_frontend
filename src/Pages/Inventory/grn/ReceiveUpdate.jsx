import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  IconButton,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
} from "@mui/material";

import { Close as CloseIcon } from "@mui/icons-material";
import { MdAddCircleOutline, MdDeleteForever } from "react-icons/md";
import DynamicDropdown from "../../../ReusableComponents/DynamicDropdown";
import XcodesDropDown from "../../../ReusableComponents/XcodesDropDown";
import axiosInstance from "../../../Middleware/AxiosInstance";
import { handleSearch } from "../../../ReusableComponents/handleSearch";

export default function ReceiveUpdate({ onClose, grnData, grnNumber }) {
  const [supDropdownOpen, setSupDropdownOpen] = useState("");
  const id = localStorage.getItem("zid");
  const [dropdownState, setDropdownState] = useState([]); // Track dropdown state per row

  const [modalAlert, setModalAlert] = useState({
    open: false,
    title: "",
    message: "",
    severity: "",
  });

  const closeModalAlert = () => {
    setModalAlert((prev) => ({ ...prev, open: false }));
  };

  const [errors, setErrors] = useState({});
  const [msg,setMsg]=useState('')
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    severity: "success", // 'success', 'error', 'warning', 'info'
    message: "",
  });
  const zid = localStorage.getItem("zid");
  const supplierRef = useRef(null);
  const itemRefs = useRef([]);
  const [searchResults, setSearchResults] = useState([]);
  const [itemDropdownPositions, setItemDropdownPositions] = useState({});
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    heading: {
      zid: id,
      zauserid: "",
      ztime: "",
      xgrnnum: grnNumber,
      xstatusgrn: "",
      xcus: "",
      xcusdesc: "",
      xwh: "",
      xdate: today,
      xref: "",
      xnote: "",
    },
    details: [],
  });

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    if (grnData) {
      setFormData({
        heading: {
          zid: localStorage.getItem("zid"),
          zauserid: grnData.zauserid || "",
          ztime: grnData.ztime || "",
          xgrnnum: grnData.xgrnnum || grnNumber,
          xcus: grnData.xcus || "",
          xcusdesc: grnData.xcusdesc || "",
          xwh: grnData.xwh || "",
          xdate: grnData.xdate || "",
          xref: grnData.xref || "",
          xnote: grnData.xnote || "",
        },
        details: grnData.details?.length
          ? grnData.details
          : [{ xitem: "", xqtygrn: 0, xrate: 0 }],
      });
    }
  }, [grnData, grnNumber]);

  const [itemdropdownPosition, setItemDropdownPosition] = useState({});

  const supConfig = [
    { header: "Supplier ID", field: "xcus" },
    { header: "Name", field: "xorg" },
    { header: "Address", field: "xmadd" },
  ];

  const itemConfig = [
    { header: "Item Code", field: "xitem" },
    { header: "Name", field: "xdesc" },
    { header: "Generic Name", field: "xgenericname" },
    { header: "Unit", field: "xunit" },
  ];

  const handleInputChange = (e, section, field) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  const handleChange = (e, section, field) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  const handleCloseAlert = () => {
    setAlertInfo({ ...alertInfo, open: false });
  };

  const handleResultClick = (result) => {
    setFormData((prevData) => ({
      ...prevData,
      heading: {
        ...prevData.heading,
        xcus: result.xcus,
        xcusdesc: result.xorg,
      },
    }));
    setSupDropdownOpen(false); // Close the dropdown
  };

  const handleDropdownSelect = (fieldName, value) => {
    setFormData((prevState) => ({
      ...prevState,
      heading: {
        ...prevState.heading,
        [fieldName]: value,
      },
    }));
  };

  const handleProductChange = (index, e, field) => {
    const { value } = e.target;
    const updatedProducts = [...formData.details];
    updatedProducts[index][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      details: updatedProducts,
    }));
  };

  const handleProductAdd = () => {
    setFormData((prevData) => ({
      ...prevData,
      details: [...prevData.details, { xitem: "", xqtygrn: 0, xrate: 0 }],
    }));
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
            top: parentScrollTop + triggerRect.bottom - 25,
            left: parentScrollLeft + triggerRect.left - 285,
            width: triggerRect.width + 100,
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
  }, [formData.heading.xcus]);

  const calculateDropdownPosition = (ref, index) => {
    if (ref) {
      const triggerRect = ref.getBoundingClientRect();
      const parentScrollTop =
        document.documentElement.scrollTop || document.body.scrollTop || 0;
      const parentScrollLeft =
        document.documentElement.scrollLeft || document.body.scrollLeft || 0;

      // Set position for dropdown dynamically for each row
      setItemDropdownPosition((prevState) => ({
        ...prevState,
        [index]: {
          top: parentScrollTop + triggerRect.bottom + 40, // Add space below
          left: parentScrollLeft + triggerRect.left,
          width: triggerRect.width,
        },
      }));
    }
  };

  useLayoutEffect(() => {
    window.addEventListener("resize", () => {
      itemRefs.current.forEach((el, index) => {
        calculateDropdownPosition(el, index);
      });
    });
    window.addEventListener("scroll", () => {
      itemRefs.current.forEach((el, index) => {
        calculateDropdownPosition(el, index);
      });
    });

    return () => {
      window.removeEventListener("resize", () => {
        itemRefs.current.forEach((el, index) => {
          calculateDropdownPosition(el, index);
        });
      });
      window.removeEventListener("scroll", () => {
        itemRefs.current.forEach((el, index) => {
          calculateDropdownPosition(el, index);
        });
      });
    };
  }, [formData.details]);

  const handleProductRemove = (index) => {
    const updatedProducts = formData.details.filter((_, idx) => idx !== index);
    setFormData((prevData) => ({
      ...prevData,
      details: updatedProducts,
    }));
  };

  const handleClearForm = () => {
    if (window.confirm("Are you sure you want to clear the form?")) {
      setFormData({
        heading: {
          zid: id,
          zauserid: "",
          ztime: "",
          xgrnnum: "",
          xcus: "",
          xcusdesc: "",
          xwh: "",
          xdate: "",
          xref: "",
          xnote: "",
        },
        details: [],
      });
    }
  };

  const handleSubmit = async (e) => {
    console.log("Form submitted!");
    e.preventDefault();

    const transformFormData = (formData) => ({
      xgrnnum: formData.heading.xgrnnum,
      zid: localStorage.getItem("zid"),
      xref: formData.heading.xref,
      xnote: formData.heading.xnote,
      xwh: formData.heading.xwh,
      xcus: formData.heading.xcus,
      xdate: formData.heading.xdate,
      zauserid: localStorage.getItem("zemail"),
      items: formData.details.map((product) => ({
        xitem: product.xitem,
        xqtygrn: product.xqtygrn,
        xrate: product.xrate,
      })),
    });

    const requestBody = transformFormData(formData);
    console.log("Submitting Form Data:", requestBody);

    try {
      const response = await axiosInstance.post(
        "/api/grn/createOrUpdate",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      const createdGrnNumber = response.data;

      

      setFormData((prevFormData) => ({
        ...prevFormData,
        heading: {
          ...prevFormData.heading,
          xgrnnum: createdGrnNumber,
        },
      }));



      setModalAlert({
        open: true,
        title: "Success",
        message: `GRN Number: ${createdGrnNumber} Changed.`,
        severity: "success",
      });

      setErrors({});
    } catch (error) {
      const errorMessage = "Failed to submit the form. Please try again.";

      setModalAlert({
        open: true,
        title: "Error",
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleConfirm = async () => {
    const requestBody = {
      zid: localStorage.getItem("zid"),
      zemail: localStorage.getItem("zemail"),
      xgrnnum: formData.heading.xgrnnum,
      xdate: formData.heading.xdate,
      xwh: formData.heading.xwh,
      len: 8,
    };

    try {
      const response = await axiosInstance.post(
        "/api/pogrnheader/confirmGRN",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);
      if (response.status == "200") {
        alert("GRN Confirmation successful!");

        setFormData((prevFormData) => ({
          ...prevFormData,
          heading: {
            ...prevFormData.heading,
            xstatusgrn: response.data.xstatusgrn,
          },
        }));
      } else {
        const error = await response.text(); // Read error message
        console.error("Error confirming GRN:", error);
        alert("Failed to confirm GRN.");
      }
    } catch (err) {
      console.error("Request error:", err);
      alert("Something went wrong.");
    }
  };

  const handleItemSearch = (index, e) => {
    const query = e.target.value;
    const ref = itemRefs.current[index];

    calculateDropdownPosition(ref, index);

    const updatedProducts = [...formData.details];
    updatedProducts[index].xitem = query;

    setFormData((prevData) => ({
      ...prevData,
      details: updatedProducts,
    }));

    const apiSearchUrl = `api/products/${zid}/search?searchText=${query}&searchFields=xitem,xdesc,xunit`;

    handleSearch(
      query,
      apiSearchUrl,
      itemConfig,
      setSearchResults,
      (isOpen) => {
        const newState = [...dropdownState];
        newState[index] = isOpen;
        setDropdownState(newState);
      },
      itemRefs.current[index],
      { zid }
    );
  };

  const validateForm = () => {
    const errors = {};
    const { heading, details } = formData;

    // Heading Validation
    if (!heading.xcus) errors.xcus = "Supplier ID is required";
    if (!heading.xdate) errors.xdate = "Date is required";
    if (!heading.xwh) errors.xwh = "Store is required";

    // Product Validation
    details.forEach((product, index) => {
      if (!product.xitem)
        errors[`product[${index}].xitem`] = "Product ID is required";
      if (product.xqtygrn <= 0)
        errors[`product[${index}].xqtygrn`] = "Quantity must be greater than 0";
      if (product.xrate < 0)
        errors[`product[${index}].xrate`] = "Rate must be non-negative";
    });

    return errors;
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          bgcolor: "background.paper",
          boxShadow: 24,
          maxHeight: "90vh",
          p: 4,
          borderRadius: 2,
          overflowY: "auto",
          scrollbarGutter: "stable",
          outline: "none",
        }}
      >
        <IconButton
          onClick={() => {
            onClose();
            // handleSubmit();
          }}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <form onSubmit={handleSubmit} className=" bg-[#FCFCFC]">
          <Typography variant="h6" mb={2}>
            Product Receive
          </Typography>
          <Grid container spacing={2} mb={4}>
            <Grid item xs={6}>
              <TextField
                label="Receive No"
                name="heading.xgrnnum"
                value={formData.heading.xgrnnum}
                fullWidth
                size="small"
                onChange={(e) => handleInputChange(e, "heading", "xgrnnum")}
                error={Boolean(errors.xgrnnum)}
                helperText={errors.xgrnnum}
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: Boolean(formData.heading.xgrnnum),
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Date"
                type="date"
                name="heading.xdate"
                value={formData.heading.xdate}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleInputChange(e, "heading", "xdate")}
                error={Boolean(errors.xdate)}
                helperText={errors.xdate}
              />
            </Grid>

            {/* <Grid item xs={6}>
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
              
              <TextField
                ref={supplierRef}
                id="xcus"
                name="Supplier"
                label="Supplier Code"
                size="small"
                value={formData.heading.xcus || ""}
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  handleChange(e, "heading", "xcus");
                  const query = e.target.value;
                  const apiSearchUrl = `api/cacus/${zid}/search?searchText=${query}&searchFields=xcus,xorg,xmobile`;
                  handleSearch(
                    e.target.value,
                    apiSearchUrl,
                    supConfig,
                    setSearchResults,
                    setSupDropdownOpen,
                    supplierRef,
                    setDropdownPosition,
                    { zid }
                  );
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Supplier Name"
                name="heading.xcusdesc"
                value={formData.heading.xcusdesc}
                fullWidth
                size="small"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid> */}

            <Grid item xs={6}>
              <XcodesDropDown
                id="xwh"
                name="xwh"
                label="Branch"
                type="Branch"
                onSelect={(value) => handleDropdownSelect("xwh", value)}
                value={formData.heading.xwh}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Challan No"
                name="heading.xref"
                value={formData.heading.xref}
                fullWidth
                size="small"
                onChange={(e) => handleInputChange(e, "heading", "xref")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Note"
                name="heading.xnote"
                value={formData.heading.xnote}
                fullWidth
                size="small"
                onChange={(e) => handleInputChange(e, "heading", "xnote")}
              />
            </Grid>
          </Grid>
          <Typography variant="h6" mb={2}>
            Details
          </Typography>

          <TableContainer
            component={Paper}
            container="true"
            alignitems="center"
          >
            <Table sx={{ minWidth: 650, border: "1px solid #e0e0e0" }}>
              <TableHead sx={{ paddingBottom: 0 }}>
                <TableRow
                  sx={{
                    backgroundColor: "#f5f5f5",
                    paddingY: 0, // Remove vertical padding from TableRow
                    "& .MuiTableCell-root": {
                      paddingTop: 0, // Remove top padding from cells
                      paddingBottom: 0, // Remove bottom padding from cells
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#424242",
                      borderRight: "1px solid #e0e0e0",
                      width: "15%",
                    }}
                  >
                    Item Code
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#424242",
                      borderRight: "1px solid #e0e0e0",
                      width: "35%",
                    }}
                  >
                    Item Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#424242",
                      borderRight: "1px solid #e0e0e0",
                      width: "18%",
                    }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#424242",
                      borderRight: "1px solid #e0e0e0",
                      width: "18%",
                    }}
                  >
                    Rate
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", color: "#424242", width: "10%" }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.details.map((product, index) => {
                  const isDropdownOpen = dropdownState[index] || false; // Moved outside JSX
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                        "& .MuiTableCell-root": {
                          paddingTop: 0,
                          paddingBottom: 0,
                        },
                      }}
                    >
                      <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>
                        <TextField
                          ref={(el) => (itemRefs.current[index] = el)}
                          id={`xitem-${index}`}
                          name={`details[${index}].xitem`}
                          // label="Item Code"
                          size="small"
                          value={formData.details[index].xitem || ""}
                          variant="outlined"
                          fullWidth
                          onChange={(e) => handleItemSearch(index, e)}
                          sx={{
                            "& .MuiInputBase-root": {
                              border: "none",
                            },
                          }}
                        />

                        <DynamicDropdown
                          isOpen={isDropdownOpen}
                          onClose={() => {
                            const newState = [...dropdownState];
                            newState[index] = false;
                            setDropdownState(newState);
                          }}
                          triggerRef={itemRefs.current[index]}
                          data={searchResults}
                          headers={itemConfig.map((config) => config.header)}
                          onSelect={(selectedItem) => {
                            const updatedProducts = [...formData.details];
                            updatedProducts[index].xitem = selectedItem.xitem;
                            updatedProducts[index].xdesc = selectedItem.xdesc; // Update description
                            setFormData((prevData) => ({
                              ...prevData,
                              details: updatedProducts,
                            }));
                            const newState = [...dropdownState];
                            newState[index] = false;
                            setDropdownState(newState);
                          }}
                          dropdownWidth={800}
                          dropdownHeight={400}
                          dropdownPosition={itemdropdownPosition}
                        />
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>
                        <TextField
                          // label="Name"
                          type="text"
                          name={`details[${index}].xdesc`}
                          value={formData.details[index].xdesc || ""}
                          fullWidth
                          size="small"
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>
                        <TextField
                          // label="Quantity"
                          type="number"
                          name={`details[${index}].xqtygrn`}
                          value={product.xqtygrn || ""}
                          fullWidth
                          size="small"
                          onChange={(e) =>
                            handleProductChange(index, e, "xqtygrn")
                          }
                          error={Boolean(errors[`product[${index}].xqtygrn`])}
                          helperText={errors[`product[${index}].xqtygrn`] || ""}
                          sx={{
                            "& input[type='number']": {
                              appearance: "none", // Standard for modern browsers
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>
                        <TextField
                          // label="Rate"
                          type="number"
                          name={`details[${index}].xrate`}
                          value={product.xrate || ""}
                          fullWidth
                          size="small"
                          onChange={(e) =>
                            handleProductChange(index, e, "xrate")
                          }
                          error={Boolean(errors[`product[${index}].xrate`])}
                          helperText={errors[`product[${index}].xrate`] || ""}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleProductRemove(index)}
                          sx={{
                            fontSize: "2rem",
                          }}
                        >
                          <MdDeleteForever color="red" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <IconButton
              onClick={handleProductAdd}
              sx={{
                fontSize: "2rem",
                marginLeft: 1,
              }}
            >
              <MdAddCircleOutline color="green" />
            </IconButton>
          </TableContainer>

          <Grid container mb={4}></Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "4",
            }}
          >
            <Button
              onClick={handleClearForm}
              variant="contained"
              color="default"
              style={{ backgroundColor: "#90CAF9", width: "120px" }}
              disabled={formData.heading.xstatusgrn === "Confirmed"}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ backgroundColor: "#1976D2", width: "120px" }}
              disabled={formData.heading.xstatusgrn === "Confirmed"}
            >
              Save
            </Button>
            <Button
              onClick={handleConfirm}
              variant="contained"
              color="success"
              style={{ backgroundColor: "#388E3C", width: "120px" }}
              disabled={formData.heading.xstatusgrn === "Confirmed"}
            >
              Confirm
            </Button>
          </Box>
        </form>
        <Dialog
          open={modalAlert.open}
          onClose={closeModalAlert}
          style={{ zIndex: 1301 }} // Ensure it appears above the product modal
        >
          <DialogTitle>{modalAlert.title}</DialogTitle>
          <DialogContent>
            <p>{modalAlert.message}</p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeModalAlert}
              color={modalAlert.severity === "success" ? "primary" : "error"}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Backdrop for Notification Modal */}
        <Backdrop open={modalAlert.open} style={{ zIndex: 1300 }} />
      </Box>
    </Modal>
  );
}
