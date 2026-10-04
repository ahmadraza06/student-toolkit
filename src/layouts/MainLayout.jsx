import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function MainLayout() {
  const {user,logout} = useAuth()
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold">
            Student Toolkit
          </Link>

          <div className="flex items-center gap-6 text-sm">
            <Link to="/">Home</Link>
            <Link to="/tools">Tools</Link>
            <Link to="/resume-builder">
              Resume Builder
            </Link>
            <Link to={"/timetable"}> Timetable</Link>
            {user?(
            <>
              <Link
                  to="/dashboard"
                  className="rounded-lg border px-4 py-2"
                >
                  Dashboard
              
              </Link>
              <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg bg-black px-4 py-2 text-white"
                >
                  Logout
              </button>
            </>
            ): (
              <>
              <Link
                  to="/login"
                  className="rounded-lg border px-4 py-2"
                >
                  Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
              >
                Register
              </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t bg-white px-6 py-8 text-center text-sm text-gray-500">
        © 2026 Student Toolkit
      </footer>
    </div>
  );
}


