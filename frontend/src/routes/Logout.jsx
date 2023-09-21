import React from 'react'
import { useAuth } from '../hooks/auth/auth';

function Logout() {
    const { logout } = useAuth();
    logout()
}

export default Logout