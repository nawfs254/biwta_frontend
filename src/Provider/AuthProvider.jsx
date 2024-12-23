import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../Middleware/AxiosInstance";

// Create Context for Authentication
export const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        zid: null,
        zemail: null,
    });

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [zid, setZid] = useState(null);
    const [zemail, setZemail] = useState(null);
    const [xname,setXname]=useState(null);
    const [zorg,setZorg]=useState(null);

    // Function to handle user login (using JWT)
    const login = (id, zid, token,xname,zorg,xwh) => {
       

        // Set state using passed arguments
        setAuthState({ zid, zemail: id,xname:xname,zorg:zorg });
        setToken(token);
        setZid(zid);
        setZemail(id);
        setZorg(zorg);
        setXname(xname);
        console.log(zorg)
        // Store in localStorage
        localStorage.setItem("zid", zid);
        localStorage.setItem("zemail", id);
        localStorage.setItem("token", token);
        localStorage.setItem("xname", xname);
        localStorage.setItem("zorg",zorg);
        localStorage.setItem("xwh",xwh)

       
    };

    // Function to fetch user data after login
    const fetchUserData = async (token) => {
        try {
            const response = await axios.get(
                `api/employee/search?zid=${authState.zid}&xstaff=${authState.zemail}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // Function to handle user logout
    const logout = () => {
        console.log("log out calling")
        setLoading(true);
        localStorage.removeItem("token");
        localStorage.removeItem("zid");
        localStorage.removeItem("zemail");
        localStorage.removeItem("xname");
        localStorage.removeItem("zorg");
        localStorage.removeItem("xwh")
        localStorage.removeItem("authToken")
        setAuthState({ zid: null, zemail: null });
        setToken(null);
        setUser(null);
        setLoading(false);

      
    };



    useEffect(() => {
        const storedZid = localStorage.getItem("zid");
        const storedZemail = localStorage.getItem("zemail");
        const storedToken = localStorage.getItem("token");
    
        if (storedZid && storedZemail && storedToken) {
            setAuthState({ zid: storedZid, zemail: storedZemail });
            setToken(storedToken);
            setZid(storedZid); // Make sure to set this too
            setZemail(storedZemail); // Same for zemail
        } else {
            setAuthState({ zid: null, zemail: null });
        }
        setLoading(false);
    }, []);
    

    useEffect(() => {
        const validateUser = async () => {
            try {
                const response = await axiosInstance.get("/auth/validate", {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                setLoading(false);
    
                if (
                    localStorage.getItem('zid') !== String(response.data.zid) ||
                    localStorage.getItem('zemail') !== String(response.data.zemail)
                ) {
                    console.log(localStorage.getItem('zid'),localStorage.getItem('zemail'))
                    console.log(response.data)
                    logout();
                }
            } catch (error) {
                console.error("User validation failed:", error);
                setLoading(false); 
                logout();
            }
        };
    
        if (token && zid && zemail) {
            validateUser();
        } else {
            setLoading(false);  
        }
    }, [token, zid, zemail]);
    



    useEffect(() => {
        const handleStorageChange = () => {
            const storedToken = localStorage.getItem("token");
            const storedZid = localStorage.getItem("zid");
            const storedZemail = localStorage.getItem("zemail");

            if (!storedToken || !storedZid || !storedZemail) {
                logout(); // Logout if any critical value is missing
            } 
            // else {
            //     setToken(storedToken);
            //     setZid(storedZid);
            //     setZemail(storedZemail);
            // }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);


    const authInfo = {
        login,
        logout,
        zemail,
        zid,
        token,
        loading,
        user,
        setAuthState,
        fetchUserData,
        xname:authState.xname,
        zorg:authState.zorg
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};
