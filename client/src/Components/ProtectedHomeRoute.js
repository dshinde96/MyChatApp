

import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const ProtectedHomeRoute = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!sessionStorage.getItem('authTocken') || sessionStorage.getItem('authTocken') === null) {
            navigate('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Outlet />
    )
}

export default ProtectedHomeRoute