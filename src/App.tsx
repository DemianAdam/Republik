import { Routes, Route } from 'react-router-dom';
import Home from 'routes/Home';
import Contact from 'routes/Contact';
import AdminAuth from 'features/admin/components/AdminAuth';
import Dashboard from 'routes/Dashboard';
import Permissions from 'routes/Permissions';
import { ROLES_ENUM } from 'features/admin/types/userTypes';
import PublicLayout from 'features/public/components/PublicLayout';
import AdminLayout from 'features/admin/components/AdminLayout';
import Test from 'routes/Test';
import SelfCheckIn from 'routes/SelfCheckIn';
import Ticket from 'routes/Ticket';
import Statistics from 'routes/Statistics';
import RouteRoleGuard from 'features/admin/components/RouteRoleGuard';
import NotFound from 'routes/NotFound';

function App() {
  return (
    <Routes>
      <Route path="test" element={<Test />} />
      <Route path="check-in" element={<SelfCheckIn />} />
      <Route path="check-in/:userName" element={<SelfCheckIn />} />
      <Route path="/ticket/:uuid" element={<Ticket />} />
      <Route element={<PublicLayout />}>
        <Route path="" element={<Home />} />
        <Route path="contacto" element={<Contact />} />
      </Route>
      <Route path='admin' element={<AdminAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="estadisticas" element={<Statistics />} />
          <Route element={<RouteRoleGuard requiredRole={ROLES_ENUM.ADMIN} />}>
            <Route path="permisos" element={<Permissions />} />
          </Route>
        </Route>
      </Route>
      {/* The 404 Route must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;