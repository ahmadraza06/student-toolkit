import React from 'react'
import { Routes,Route } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { Home } from '../pages/Home'
import { Tools } from '../pages/Tools'
import CGPACalculator from '../pages/CGPACalculator'
import PercentageCalculator from '../pages/PercentageCalculator'
import AttendanceCalculator from '../pages/AttendanceCalculator'
import Timetable from '../pages/Timetable'
import AgeCalculator from '../pages/AgeCalculator'
import ResumeBuilder from '../pages/ResumeBuilder'
import MyResumes from "../pages/MyResumes";
import MyTimetables from "../pages/MyTimetables";
import ProtectedRoute from '../components/ProtectedRoute'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'

export const AppRoutes = () => {
  return (
    <Routes>
      
        <Route element={<MainLayout/>} >
        {/* public routes */}
            <Route path="/" element={<Home/>} />
            <Route path ="/tools" element ={<Tools/>}/>
            <Route path="/tools/cgpa-calculator" element={<CGPACalculator/>}/>
            <Route path="/tools/percentage-calculator" element={<PercentageCalculator/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
            path="/tools/attendance-calculator"
            element={<AttendanceCalculator/>}
            />
            

            <Route
            path='/tools/age-calculator'
            element={<AgeCalculator/>}
            />

            
            <Route element={<ProtectedRoute />}>
              <Route path="/my-resumes" element={<MyResumes />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-timetables" element={<MyTimetables />} />
              <Route path="/resume-builder" element={<ResumeBuilder/>} />
              <Route path='/tools/timetable' element={<Timetable/>} />
            </Route>
            
            
            
        </Route>
    </Routes>
  )
}
