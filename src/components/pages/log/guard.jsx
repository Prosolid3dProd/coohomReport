import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { getLocalToken } from '../../../data/localStorage';

/**
 *
 *
 * @return {boolean} 
 */
const authLogin = () => {
    /** @type {object.<login, string>} */
    const userAuth = getLocalToken() // useContext(userContext)
    if (userAuth && userAuth?.user) return true
    return false
}

/**
 *
 *
 * @return {Component} --> user Autorizado ? 'Dashboard' : 'Login' 
 */
const RedirectLogin = () => {
    /** @type {boolean} */
    const user = authLogin() // Debe ir --> authLogin()
    return user ? <Outlet /> : <Navigate to={'/Login'} />
}

export {
    authLogin,
    RedirectLogin
}