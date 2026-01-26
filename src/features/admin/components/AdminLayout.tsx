import { Outlet, useOutletContext } from 'react-router-dom'
import AdminNavbar from './AdminNavbar'
import { AdminAuthContext } from '../../../types/AdminAuthContext';
import { AdminLayoutContext } from '../../../types/AdminLayoutContext';
import { GlobalErrorProvider } from '../../../types/GlobalErrorProvider';
import GlobalErrorModal from 'components/GlobalErrorModal';

export default function AdminLayout() {
    const { userResponse } = useOutletContext<AdminAuthContext>();

    {/*TODO: handle error and loading cases?*/ }
    if (!userResponse.isSuccess) {
        return <div>Error</div>
    }

    const user = userResponse.data;

    return (
        <GlobalErrorProvider>
            <div className="min-h-screen w-full">
                <AdminNavbar user={user} />
                <Outlet context={{ user } satisfies AdminLayoutContext} />
            </div>
            <GlobalErrorModal />
        </GlobalErrorProvider>
    )
}
