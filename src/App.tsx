import { Routes, Route } from 'react-router-dom';
import Home from 'routes/Home';
import Contact from 'routes/Contact';
import AdminAuth from 'features/admin/components/AdminAuth';
import Dashboard from 'routes/Dashboard';
import Permissions from 'routes/Permissions';
import RoleGuard from 'features/admin/components/RoleGuard';
import { ROLES_ENUM } from 'features/admin/types/userTypes';
import PublicLayout from 'features/public/components/PublicLayout';
import AdminLayout from 'features/admin/components/AdminLayout';
import Test from 'routes/Test';
import SelfCheckIn from 'routes/SelfCheckIn';
import Ticket from 'routes/Ticket';

function App() {
  return (
    <Routes>
      <Route path="test" element={<Test />} />
      <Route path="self-check-in" element={<SelfCheckIn />} />
      <Route path="/ticket/:uuid" element={<Ticket />} />
      <Route element={<PublicLayout />}>
        <Route path="" element={<Home />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path='admin' element={<AdminAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route element={<RoleGuard requiredRole={ROLES_ENUM.ADMIN} />}>
            <Route path="permissions" element={<Permissions />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;