import { handleApiRequest } from "../utility/handleApiRequest";

export const addFunction=async(
    data,endpoint,method,onSuccess
) =>{
   
    try {
        console.log(endpoint)
        await handleApiRequest({
            endpoint,
            data,
            method: method,
            onSuccess: (response) => {
                if (onSuccess) onSuccess(response.data);
            },
        });
    } catch (error) {
        console.error("Unexpected error:", error);
    }
}