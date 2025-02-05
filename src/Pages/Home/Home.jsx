import { useEffect } from "react";
import { FaUserClock, FaUserCog, FaUserFriends } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../Components/Loader/Loading";
import Sidebar from "../../Components/Sidebar";
import { getEditRequestsNumber } from "../../redux/editRequests";
import { getRequestsNumber } from "../../redux/requestsSlice";
import { getUsersNumber } from "../../redux/userSlice";
import CountCards from "./Home-Components/Count-Cards";
import MainPage from "./Home-Components/Main-Page-Content";

const Home = () => {
  const dispatch = useDispatch();
  const {
    usersCount,
    loading: userloading,
    error,
  } = useSelector((state) => state.user);
  const { requestsCount } = useSelector((state) => state.request);
  const { editRequestsCount } = useSelector((state) => state.edits);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(getUsersNumber(token));
      dispatch(getRequestsNumber(token));
      dispatch(getEditRequestsNumber(token));
    }
  }, [token, dispatch]);
  const stats = [
    { title: "عدد المستخدمين", count: usersCount, icon: <FaUserFriends /> },
    {
      title: "عدد طلبات الانضمام",
      count: requestsCount,
      icon: <FaUserClock />,
    },
    {
      title: "عدد طلبات التعديل",
      count: editRequestsCount,
      icon: <FaUserCog />,
    },
  ];

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar */}
      <Sidebar activeTab="الرئيسية" />

      {/* Main Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-20">
          {userloading ? (
            <div className="col-span-3 flex justify-center">
              <Loading />
            </div>
          ) : (
            stats.map((stat, index) => <CountCards key={index} stat={stat} />)
          )}
        </div>

        {/* Main Page Content */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <MainPage />
        </div>
      </div>
    </div>
  );
};

export default Home;
