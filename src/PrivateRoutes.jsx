
import { useAuth } from './Provider/AuthProvider';
import LoadingPage from './Pages/Loading/Loading';
import { useNavigate } from 'react-router-dom';
 // Make sure you're importing the auth context

const PrivateRoutes = ({ element }) => {
    const { zid,token,loading,logout } = useAuth();  
    const navigate = useNavigate();


   
    if (loading) {
        return <LoadingPage />; 
    }

    if(!zid || !token){
        logout();
        navigate('/');
    }

    

    return element;

     
};

export default PrivateRoutes;
