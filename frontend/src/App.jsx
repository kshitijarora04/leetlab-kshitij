import React, { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./page/HomePage"
import LoginPage from "./page/LoginPage"
import SignupPage from "./page/SignupPage"
import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./store/useAuthStore"
import { Loader } from "lucide-react"
import Layout from "./layout/Layout"
import AdminRoute from "./components/AdminRoute"
import AddProblem from "./page/AddProblem"
import ProblemPage from "./page/ProblemPage"
import Profile from "./components/Profile"
import Updateproblem from "./page/Updateproblem"

const App = () => {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth])


  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (

    <div className="flex flex-col items-center justify-start">
      <Toaster />
      <Routes>

        <Route path='/' element={<Layout />}>
          <Route
            index
            element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
          />
        </Route>

        <Route
          path='/login'
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />

        <Route
          path='/signup'
          element={!authUser ? <SignupPage /> : <Navigate to={"/"} />}
        />

        <Route
          path="/problem/:id"
          element={authUser ? <ProblemPage /> : <Navigate to="/login" />}
        />

        < Route element={<AdminRoute />}>
          <Route path='/add-problem' element={authUser ? <AddProblem /> : <Navigate to="/" />} />
        </Route>

        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        >
        </Route>

        < Route element={<AdminRoute />}>
          <Route path='/update-problem/:problemId' element={authUser ? <Updateproblem /> : <Navigate to="/" />} />
        </Route>
      </Routes>

    </div >
  )
}

export default App
