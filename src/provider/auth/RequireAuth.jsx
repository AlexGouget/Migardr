import {useContext, useEffect, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import useAuth from './useAuth';
import {ToastContext} from "../provider/ToastProvider";


export default function RequireAuth({ children }: { children: JSX.Element }) {
    let auth = useAuth();
    let location = useLocation();
    let navigate = useNavigate();
    let toast = useContext(ToastContext);

    const toastShown = useRef(false); // Utilisez un ref pour suivre si le toast a été affiché

    useEffect(() => {
        // Check the cookie expiration date format timestamp
          if (auth.user === null || auth.user.exp * 1000 < Date.now()) {

              if (!toastShown.current){
                  toast.error('Session, expired, You must be logged in to view this page.', 10);
                  toastShown.current = true;
                  auth.signOut(()=>{ navigate('/', { state: { from: location }, replace: true });});
              }
          }
    }, [auth.user]);

    if (auth.user) {
        return children;
    } else {
        return null;
    }
}