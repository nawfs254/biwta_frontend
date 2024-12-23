import React, { useEffect, useRef, useState } from "react";
import SideButtons from "../../Shared/SideButtons";
import HelmetTitle from "../../utility/HelmetTitle";

import Caption from "../../utility/Caption";
import Swal from "sweetalert2";

import SelectField from "../../formfield/SelectField";
import Checkbox from "../../formfield/Checkbox";

import {
    Box,
    FormControl,
    InputLabel,
    List,
    ListItem,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import axios from "axios";
import { handleApiRequest } from "../../utility/handleApiRequest";

import ItemGroupList from "./ItemGroupList";
import { useAuth } from "../../Provider/AuthProvider";

const ItemGroup = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isListOpen, setListOpen] = useState(false);
    const { zid } = useAuth();
    const [formData, setFormData] = useState({
        zid: zid,
        xtype: "Item Group",
        xcode: "",
        xlong: "",
        xemail: "",
        xmadd: "",
        zactive: false,
        xtypeobj: "",
        xphone: "",
        xgtype: "",
    });
    const [errors, setErrors] = useState({});
    const [refreshList, setRefreshList] = useState(() => () => { });
    const apiBaseUrl = "api/xcodes";
    const formRef = useRef(null);

    // Handle input changes and fetch results for search
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "xcode") {

            setIsTyping(true);
            fetchSearchResults(value);
        }
    };


    const fetchSearchResults = async (query) => {
        if (!query) {
            setSearchResults([]);
            setListOpen(false);
            return;
        }
        try {
            const response = await axios.get(
                `${apiBaseUrl}/searchtext?zid=${formData.zid}&xtype=${formData.xtype}&searchText=${query}`
            );
            setSearchResults(response.data);
            setListOpen(true);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const handleResultClick = (result) => {
        setFormData({
            ...formData,
            ...result,
            zid: zid,
            zactive: parseInt(result.zactive) === 1, // Ensure boolean conversion
        });
        setListOpen(false);
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setListOpen(false);
            }


        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);

        };
    }, []);

    // Handle checkbox toggle
    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked; // Simplified logic
        setFormData((prevState) => ({
            ...prevState,
            zid: zid,
            zactive: isChecked ? 1 : 0,
        }));
    };

    // Handle select changes
    const handleTypeChange = (e) => {
        setFormData({ ...formData, xtypeobj: e.target.value || "" });
    };

    const handleGtypeChange = (e) => {
        setFormData({ ...formData, xgtype: e.target.value || "" });
    };

    // CRUD actions
    const handleAction = async (method) => {
        const endpoint = `${apiBaseUrl}?zid=${formData.zid}&xtype=${formData.xtype}&xcode=${formData.xcode}`;
        const data = { ...formData };
        await handleApiRequest({
            endpoint,
            data,
            method,
            onSuccess: () => {
                if (method === "DELETE") {
                    setFormData({
                        zid: formData.zid,
                        xtype: "Item Group",
                        xcode: "",
                        xlong: "",
                        zactive: false,
                        xtypeobj: "",
                        xgtype: "",
                    });
                }
                refreshList();
            },
        });
    };

    const handleClear = () => {
        setFormData({
            zid: formData.zid,
            xtype: "Item Group",
            xcode: "",
            xlong: "",
            zactive: false,
            xtypeobj: "",
            xgtype: "",
        });
        Swal.fire("Form cleared.");
    };

    return (
        <div className="">
            <HelmetTitle title="Item Group" />
            <div className="grid grid-cols-12">
                <div className="">
                    <SideButtons
                        onAdd={() => handleAction("POST")}
                        onUpdate={() => handleAction("PUT")}
                        onDelete={() => handleAction("DELETE")}
                        onClear={handleClear}
                    />
                </div>

                <div className="col-span-11">
                    <div className="grid grid-cols-2 gap-2">
                        {/* Form Section */}
                        <div className="border shadow-lg border-black rounded max-h-[300px]">
                            <div className="w-full px-2 py-2 mx-auto">
                                <Caption title="Item Group Entry" />
                                <Box
                                    component="form"
                                    sx={{
                                        "& > :not(style)": { my: 1 },
                                        display: "grid",
                                        gap: 2,
                                        mt: 1,
                                        gridTemplateColumns: "repeat(3, 1fr)",
                                    }}
                                    ref={formRef}
                                    noValidate
                                >
                                    {isListOpen && searchResults.length > 0 && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                maxHeight: "400px",
                                                width: "600px",
                                                overflowY: "auto",
                                                border: "1px solid black",
                                                borderRadius: "4px",
                                                backgroundColor: "#fff",
                                                zIndex: 100,
                                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    padding: '10px',
                                                    fontWeight: 'bold',
                                                    backgroundColor: '#f0f0f0',
                                                    borderBottom: '1px solid gray',
                                                }}
                                            >
                                                <div style={{ flex: 1, textAlign: 'left' }}>Code</div>
                                                <div style={{ flex: 2, textAlign: 'left' }}>Name</div>
                                                <div style={{ flex: 1, textAlign: 'left' }}>Group Type</div>
                                                <div style={{ flex: 1, textAlign: 'left' }}>Group Nature</div>
                                            </div>
                                            <List>
                                                {searchResults.map((result, index) => (
                                                    <ListItem
                                                        key={index}
                                                        button
                                                        onClick={() => handleResultClick(result)}
                                                        style={{ display: "flex" }}
                                                    >
                                                        <div style={{ flex: 1 }}>{result.xcode}</div>
                                                        <div style={{ flex: 2 }}>{result.xlong}</div>
                                                        <div style={{ flex: 1 }}>{result.xtypeobj}</div>
                                                        <div style={{ flex: 1 }}>{result.xgtype}</div>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </div>
                                    )}

                                    <TextField
                                        id="xcode"
                                        name="xcode"
                                        label="Item Group Code"
                                        value={formData.xcode}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{ gridColumn: "span 1" }}
                                    />
                                    <TextField
                                        id="xlong"
                                        name="xlong"
                                        label="Item Group Name"
                                        value={formData.xlong}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{ gridColumn: "span 2" }}
                                    />
                                    <FormControl fullWidth sx={{ gridColumn: "span 1" }}>
                                        <InputLabel>Item Group Type</InputLabel>
                                        <Select
                                            name="xtypeobj"
                                            value={formData.xtypeobj || ""}
                                            label="Item Group Type"
                                            onChange={handleTypeChange}
                                        >
                                            <MenuItem value="">Select</MenuItem>
                                            <MenuItem value="Product">Product</MenuItem>
                                            <MenuItem value="Service">Service</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth sx={{ gridColumn: "span 1" }}>
                                        <InputLabel>Item Group Nature</InputLabel>
                                        <Select
                                            name="xgtype"
                                            value={formData.xgtype || ""}
                                            label="Item Group Nature"
                                            onChange={handleGtypeChange}
                                        >
                                            <MenuItem value="">Select</MenuItem>
                                            <MenuItem value="General">General</MenuItem>
                                            <MenuItem value="Fixed Asset">Fixed Asset</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Checkbox
                                        checked={!!formData.zactive}
                                        onChange={handleCheckboxChange}
                                        name="zactive"
                                        color="primary"
                                        sx={{ gridColumn: "span 1", justifyContent: "center" }}
                                    />
                                </Box>
                            </div>
                        </div>

                        {/* List Section */}
                        <div className="border shadow-lg border-gray-500 rounded p-2">
                            <Caption title={`List of ${formData.xtype}`} />
                            <ItemGroupList
                                xtype={formData.xtype}
                                apiBaseUrl={apiBaseUrl}
                                zid={formData.zid}
                                onItemSelect={(item) =>
                                    setFormData({
                                        ...item,
                                        zactive: parseInt(item.zactive) === 1,
                                    })

                                }
                                onRefresh={(fetchData) => setRefreshList(() => fetchData)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemGroup;
