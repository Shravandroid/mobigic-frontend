
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from './App';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    let location = useLocation();
    const {token} = useContext(AppContext);
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} />;
    }
    return children;
}

export default ProtectedRoute;
