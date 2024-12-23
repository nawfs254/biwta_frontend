import axios from 'axios';
import Swal from 'sweetalert2';
import axiosInstance from '../Middleware/AxiosInstance';

export const handleApiRequest = async ({ 
    endpoint, 
    method = 'POST',
    data = {},
    params = {},
    headers = {},
    onSuccess,
    onError
}) => {
    try {
      
        const config = {
            method: method.toUpperCase(),
            url: endpoint,
            headers,
            params, 
            data, 
        };

      
      
        const response = await axiosInstance(config);
        
       console.log(response)
        if (onSuccess) onSuccess(response);

        
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Operation completed successfully',
           
        });
        
    } catch (error) {
       
        if (error.response && error.response.status === 400) {
            const errorMessages = error.response.data.message;
            console.log(errorMessages.message)
            if (typeof errorMessages === 'object') {
              

                Swal.fire({
                    icon: 'error',
                    title: 'Validation Errors',
                    html: errorMessages,
                    confirmButtonText: 'Okay',
                   
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Errors',
                    text: errorMessages,
                    confirmButtonText: 'Okay',
                    
                });
            }
        } else {
            const errorMessages = error.message;

            if (error.code === 'ECONNABORTED') {
                Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'The request took too long to respond. Please try again later.',
                    confirmButtonText: 'Okay',
                    
                });
            } else if (error.response && error.response.status >= 500) {
                Swal.fire({
                    icon: 'error',
                    title: 'Server Error',
                    text: 'There was an issue with the server. Please try again later.',
                    confirmButtonText: 'Okay',
                    
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: error.code || 'Error',
                    html: errorMessages,
                    confirmButtonText: 'Okay',
                    
                });
            }

            if (onError) onError(error);
        }
    }
};
