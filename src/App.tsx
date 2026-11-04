import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { LoginPage } from './pages/auth/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { AttendancePage, ClassesPage, EmployeesPage, MembersPage, PackagesPage, PaymentsPage, ProfilePage, RegistrationsPage, ReportsPage } from './pages/ModulesPage'
import { useAuthStore } from './stores/authStore'
import type { Role } from './types'
function Guard({ roles }: { roles?: Role[] }) { const user=useAuthStore(x=>x.user); if(!user)return <Navigate to="/login" replace/>; if(roles&&!roles.includes(user.role))return <Navigate to={`/${user.role.toLowerCase()}`} replace/>; return <AppLayout/> }
function roleRoutes(base:string,role:Role){return <Route path={base} element={<Guard roles={[role]}/>}><Route index element={<DashboardPage/>}/><Route path="members" element={<MembersPage/>}/><Route path="employees" element={<EmployeesPage/>}/><Route path="packages" element={<PackagesPage/>}/><Route path="classes" element={<ClassesPage/>}/><Route path="registrations" element={<RegistrationsPage/>}/><Route path="attendance" element={<AttendancePage/>}/><Route path="history" element={<AttendancePage/>}/><Route path="payments" element={<PaymentsPage/>}/><Route path="reports" element={<ReportsPage/>}/><Route path="profile" element={<ProfilePage/>}/><Route path="students" element={<MembersPage/>}/></Route>}
export default function App(){return <Routes><Route path="/login" element={<LoginPage/>}/>{roleRoutes('/admin','ADMIN')}{roleRoutes('/staff','STAFF')}{roleRoutes('/trainer','TRAINER')}{roleRoutes('/member','MEMBER')}<Route path="*" element={<Root/>}/></Routes>}
function Root(){const user=useAuthStore(x=>x.user);return <Navigate to={user?`/${user.role.toLowerCase()}`:'/login'} replace/>}
