import { useState, useRef } from 'react';
import axios from 'axios';
import axiosInstance from '../Middleware/AxiosInstance';

const useSearchDropdown = ({ zid, xtype, apiBaseUrl,typingField }) => {
    const [formData, setFormData] = useState({});
    const [isTyping, setIsTyping] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [listOpen, setListOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const inputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === typingField) {
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
            const response = await axiosInstance.get(`api/xcodes/searchtext?zid=${zid}&xtype=${xtype}&searchText=${query}`);
            setSearchResults(response.data);
            setListOpen(true);

            if (inputRef.current) {
                const rect = inputRef.current.getBoundingClientRect();
                setDropdownPosition({
                    top: rect.bottom + window.scrollY, // Position below the input field
                    left: rect.left + window.scrollX,  // Align with the input field
                });
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return {
        formData,
        handleChange,
        searchResults,
        listOpen,
        dropdownPosition,
        inputRef,
    };
};

export default useSearchDropdown;
