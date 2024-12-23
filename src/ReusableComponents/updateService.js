import Swal from 'sweetalert2'; // For alerts, you can use your preferred method

export const handleUpdate = async ({
    tableName, 
    updates, 
    whereClause, 
    handleApiRequest, 
    validateForm, 
    setFormErrors, 
    setErrorMessage
}) => {
    // Validate the updates if needed (you can create your custom validation logic)
    const errors = validateForm(updates);
    
    if (Object.keys(errors).length > 0) {
        setFormErrors(errors); // Set form errors to the state
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Please fix the errors before proceeding.',
        });
        return;
    }

    // Prepare the data for the API call
    const data = {
        includedColumns: Object.keys(updates), // Columns to include in the update
        whereClause, // The condition for updating rows
        updates, // The updates to be made
    };

    const endpoint = `/api/dynamic-update/${tableName}`; // Dynamic endpoint

    try {
        // Call the API to perform the update
        await handleApiRequest({
            endpoint,
            data,
            method: 'PUT',
        });

        // Success message
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'The data was updated successfully.',
        });
        setErrorMessage(''); // Clear any previous error message
    } catch (error) {
        // Error handling
        setErrorMessage('An error occurred while updating the data.');
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while updating the data.',
        });
    }
};
