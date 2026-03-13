import React from 'react' ;
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom' ;
import Layout from './pages/Layout';
import AuthProvider from './context/AuthProvider';
import useAuth from './hooks/useAuth';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';

const AppRoutes = () => {
  const {user} = useAuth() ;

    return (
      <Routes>
        <Route element = {<Layout/>}>
          <Route path = '/' 
            element = {
              user ? 
              (<Navigate to = '/dashboard' replace></Navigate>)
              : 
              (<Navigate to = '/login' replace></Navigate>) 
            }
          ></Route>
          <Route path = "/login" element = {<Login/>}></Route>
          <Route element = {<ProtectedRoute/>}>
            <Route path = "/dashboard" element = {<Dashboard/>}></Route>
          </Route>
          <Route path = "*" element = {<NotFound/>}></Route>
        </Route>
      </Routes>
    )
} ;

const App = () => {
  return(
    <BrowserRouter>
        <AuthProvider>
          <AppRoutes/>
        </AuthProvider>
      </BrowserRouter>
  )
}

export default App ;