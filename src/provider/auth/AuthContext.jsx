import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";


export let AuthContext = createContext(null);
const BASE_URL = process.env.REACT_APP_BASE_URL;
// @ts-ignore
export default function AuthProvider({ children }: { children : ReactNode}) {
    let location = useLocation();
    let navigate = useNavigate();
    let [, setSessionExpired] = useState(false);
    let [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    useEffect(() => {
        if(!user || !checkCookie()){
            // toast.error('Session expired, please sign in again')
            signOut(() => {});
        }
    }, []);


    const getCookie = () =>{
        let cookieStr = document.cookie;
        let cookieObj = {};
        let cookieArr = cookieStr.split(';');
        cookieArr.forEach(cookie => {
            let [key, value] = cookie.trim().split('=');
            cookieObj[key] = value;
        });
        return cookieObj;
    }
    let getRole = () => {
        let cookie = getCookie().user || null;
        if(!cookie) return null;
        const role = JSON.parse(decodeURIComponent(getCookie().role));
        return role.roles
    };


    let [role, setRole] = useState(getRole());
    let getUser = () => {
        const user = localStorage.getItem('user');

        if(!user) return null;
        return user
    };






    /**
     * Check if user is connected based on cookie
     */
    const checkUser = useCallback(() => {
        const user = localStorage.getItem('user');
        const markerCookie = document.cookie.includes('markerCookie=true');
        return user && markerCookie;
    }, []);

    const checkCookie = useCallback(() => {
        return document.cookie.includes('markerCookie=true');
    }, []);


    /**
     * Register a new user
     * @param user
     * @param callback
     * @param setError
     * @return {Promise<void>}
     */
    const register = async (user:{username: string, password:string, email:string , agreement_accepted:boolean, birthdate: string}, callback: VoidFunction, setError) => {
        try {
            const response = await fetch(`${BASE_URL}/api/user/new`, {
                method: "POST",
                headers: {"Content-Type": "application/json",
                },
                body: JSON.stringify(user),
                credentials: 'include'
            });
            const data = await response.json();
           if(!response.ok) {
               setError(data)
               throw new Error(data);
           }


            //login
           callback();
        } catch (e) {
            console.error(e);
        }
    }


    const excludedRoute = ['/new-password/', '/request-new-password', '/signin']
    let signIn = async (newUser: string, password: string, callback: VoidFunction, setLoading, remember, setError, mode) => {
        const httpMode = window.location.protocol;
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/auth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: newUser,
                    password: password,
                    remember: remember,
                }),
                credentials: 'include'
            });
            if (!response.ok) {
                setError("Login or password incorrect");
                throw new Error("Login or password incorrect");
            }

            const data = await response.json();

            setLoading(false);
            setUser(data);
            //store current user in cookie
            localStorage.setItem('user', JSON.stringify(data));
            callback();
        } catch (e) {
            console.error(e);
            setLoading(false);
            setError(e.message);
        }
    };

    const removeCookie = (name, path, domain) => {
        if (document.cookie.split(';').some((item) => item.trim().startsWith(`${name}=`))) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
        }
    };

    let signOut = (callback: VoidFunction) => {
        setUser(null);
        //remove markerLoginCookie
        const cookieName = 'markerLoginCookie';
        const cookiePath = '/';
        removeCookie(cookieName, cookiePath);
        //remove local storage
        localStorage.removeItem('user');

        callback();
        navigate(location.pathname, { replace: true })
    };

    let value = { user, role, signIn, signOut, getUser,  getRole, checkUser, register};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};