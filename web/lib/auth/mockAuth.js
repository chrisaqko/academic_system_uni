// Mock auth session — stores chosen role in sessionStorage
// Replace with real Supabase Auth when credentials are available.

export const MOCK_USERS = {
  admin:   { id_user: 1,  name: 'Marcus',  surname: 'Vance',    user_type: 'admin',   email: 'admin@scholastic.edu' },
  teacher: { id_user: 2,  name: 'Elena',   surname: 'Thornton', user_type: 'teacher', email: 'e.thornton@scholastic.edu' },
  student: { id_user: 7,  name: 'Alex',    surname: 'Rivers',   user_type: 'student', email: 'a.rivers@student.edu' },
};

export function getMockSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem('sc_session');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setMockSession(role) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('sc_session', JSON.stringify(MOCK_USERS[role]));
}

export function clearMockSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('sc_session');
}
