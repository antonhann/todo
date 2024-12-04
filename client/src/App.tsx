interface RouteConfig{
  path: string,
  component: React.FC
}
import { Route, Routes } from 'react-router'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import LoginPage from './components/Pages/Login'
import RegisterPage from './components/Pages/Register'
import Home from './components/Pages/Home'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Layout } from './components/reuseables/Layout'

const ROUTES: RouteConfig[] = [
  {
    path:"/",
    component: Home,
  },
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/register",
    component: RegisterPage
  }
]
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {ROUTES.map((route, index) => (
          <Route key={index} path={route.path} element={
            <Layout>
              <route.component />
            </Layout>
        } />
        ))}
        {/* <Route path = "*" element = {<NotFound/>}/> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
