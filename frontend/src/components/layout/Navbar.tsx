
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import type { AppDispatch, RootState } from "../../store/store";
import { logout } from "../../store/slices/authSlice";
import { logoutUser } from "../../services/auth.service";

function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      await logoutUser();

      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Code<span className="text-[#ffa116]">Arena</span>
          </h1>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex">
          <Link className="transition hover:text-[#ffa116]" to="/">Home</Link>
          <Link className="transition hover:text-[#ffa116]" to="/problems">Problems</Link>
          <Link className="transition hover:text-[#ffa116]" to="/submissions">Submissions</Link>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-600 sm:inline">
              Hi, <span className="font-semibold text-gray-900">{user.username}</span>
            </span>
            <button className="btn btn-sm btn-outline" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link className="btn btn-sm btn-ghost" to="/login">Log in</Link>
            <Link className="btn btn-sm bg-[#ffa116] text-white hover:bg-[#e89000]" to="/signup">Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
