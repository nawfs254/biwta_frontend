import { fetchSearchResults } from './fetchSearchResults';

/**
 * Handles search logic for dropdown, including API call and position setting.
 * 
 * @param {string} query - The search query.
 * @param {string} apiEndpoint - The API endpoint (with placeholders if needed).
 * @param {Array<Object>} fieldConfig - Configuration mapping headers to fields.
 * @param {Function} setSearchResults - Function to update search results.
 * @param {Function} setListOpen - Function to toggle the dropdown visibility.
 * @param {Object} inputRef - Ref to the input field for calculating dropdown position.
 * @param {Function} setDropdownPosition - Function to set dropdown position.
 */
export const handleSearch = async (
    query,
    apiEndpoint,
    fieldConfig,
    setSearchResults,
    setListOpen,
    inputRef,
    setDropdownPosition
) => {
    if (!query.trim()) {
        setSearchResults([]);
        setListOpen(false);
        return;
    }

    try {
        const results = await fetchSearchResults(query, apiEndpoint, fieldConfig);
        // console.log(results)
        setSearchResults(results);
        setListOpen(true);

        // Calculate dropdown position based on input field
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY, // Position below the input field
                left: rect.left + window.scrollX,  // Align it with the input field
            });
        }
    } catch (error) {
        console.error('Error in handleSearch:', error);
    }
};
