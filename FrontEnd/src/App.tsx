import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/auth-context"
import { DataProvider } from "./contexts/data-context"
import { NotificationsProvider } from "./contexts/notifications-context"
import { NotificationsCenter } from "./components/notifications-center"
import { ProtectedRoute } from "./components/protected-route"
import { AdminSetup } from "./components/admin-setup"

// Pages
import HomePage from "./pages/home"
import LoginPage from "./pages/login"
import SignupPage from "./pages/signup"
import EventDetailPage from "./pages/event-detail"
import ReservationsPage from "./pages/reservations"
import AdminPage from "./pages/admin"
import EmailsPage from "./pages/admin-emails"
import ConfirmationPage from "./pages/confirmation"
import NotFoundPage from "./pages/not-found"

export default function App() {
  return (
    <BrowserRouter>
      <NotificationsProvider>
        <AuthProvider>
          <DataProvider>
            <AdminSetup />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />

              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/reservations" element={<ReservationsPage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/emails" element={<EmailsPage />} />
              </Route>

              {/* Catch All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <NotificationsCenter />
          </DataProvider>
        </AuthProvider>
      </NotificationsProvider>
    </BrowserRouter>
  )
}
