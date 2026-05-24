import { Navigate } from 'react-router-dom';

export default function GuruRoute({ children }) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    console.log('[GuruRoute] user:', user);
    console.log('[GuruRoute] onboarding_completed:', user.onboarding_completed);

    // Belum login
    if (!token || user.role !== 'guru') {
        return <Navigate to="/" replace />;
    }

    // Belum onboarding — cek semua kemungkinan falsy (null, 0, false, undefined)
    if (!user.onboarding_completed || user.onboarding_completed === 0 || user.onboarding_completed === '0') {
        return <Navigate to="/onboarding" replace />;
    }

    return children;
}