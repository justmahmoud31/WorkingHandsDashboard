import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notAdmin, setNotAdmin] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginAttempted(true);
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (user) {
      if (user.role !== "user") {
        navigate("/home");
      } else if (loginAttempted) {
        setNotAdmin(true);
      }
    }
  }, [user, navigate, loginAttempted]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-second px-6 py-12">
      <div className="flex flex-grow max-w-md bg-main backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <div className="w-full">
          <h2 className="text-center text-xl font-bold text-white mb-6">
            تسجيل الدخول للوحة التحكم
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-right text-white mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                className="w-full p-3 rounded-lg bg-second text-right focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="relative">
              <label className="block text-right text-white mb-2">
                رمز الدخول
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 pr-10 rounded-lg bg-second text-right focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Toggle Password Button */}
              <button
                type="button"
                className="absolute inset-y-0 left-3 top-8 flex items-center text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash  />}
              </button>
            </div>

            {notAdmin && (
              <p className="text-red-600 text-center font-semibold">
                لا يسمح بدخول غير الادمن
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-second cursor-pointer py-3 rounded-lg font-semibold shadow-md transition"
              disabled={loading}
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
