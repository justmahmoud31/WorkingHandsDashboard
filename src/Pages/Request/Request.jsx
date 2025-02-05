import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRequests,
  setPage,
  acceptRequest,
  rejectRequest,
} from "../../redux/requestsSlice";
import Sidebar from "../../Components/Sidebar";
import TableComponent from "../../Components/Table";
import { Pagination, Button } from "@mui/material";
import { toast } from "react-toastify";
import { API_URL } from "../../../constants";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Loading from "../../Components/Loader/Loading";
function Request() {
  const dispatch = useDispatch();
  const { requestsList, loading, error, currentPage, totalPages } = useSelector(
    (state) => state.request
  );

  const token = localStorage.getItem("token");
  const limit = 10; // Number of requests per page

  useEffect(() => {
    if (token) {
      dispatch(getRequests({ token, page: currentPage, limit }));
    }
  }, [dispatch, token, currentPage]);

  const handlePageChange = (_, newPage) => {
    dispatch(setPage(newPage));
  };

  const handleAccept = (requestId) => {
    dispatch(acceptRequest({ token, requestId }))
      .unwrap()
      .then(() => toast.success("تم قبول المستخدم بنجاح"))
      .catch((err) => toast.error("حدث خطأ أثناء القبول: " + err));
  };

  const handleReject = (requestId) => {
    dispatch(rejectRequest({ token, requestId }))
      .unwrap()
      .then(() => toast.success("تم رفض المستخدم"))
      .catch((err) => toast.error("حدث خطأ أثناء الرفض: " + err));
  };

  const headers = [
    "الرقم",
    "الاسم",
    "الصورة",
    "البريد الإلكتروني",
    "السكن",
    "الطول",
    "الاسم الوظيفي",
    "الرقم الخاص",
    "رقم الهاتف",
    "تاريخ الميلاد",
    "إجراءات",
  ];

  const tableData = requestsList.map((request) => ({
    الرقم: request.id,
    الاسم: request.fullname,
    الصورة: (
      <img
        src={`${API_URL}${request.profilepicture}`}
        alt="الصورة الشخصية"
        className="w-10 h-10 rounded-full"
      />
    ),
    "البريد الإلكتروني": request.email,
    السكن: request.livesin,
    الطول: request.height,
    "الاسم الوظيفي": request.jobtitle,
    "الرقم الخاص": request.privatenumber,
    "رقم الهاتف": request.phonenumber,
    "تاريخ الميلاد": request.birthdate
      ? new Date(request.birthdate).toLocaleDateString("EG")
      : "-",
    إجراءات: (
      <div className="flex gap-2">
        <Button
          variant="contained"
          color="success"
          onClick={() => handleAccept(request.id)}
        >
          <FaCheck />
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleReject(request.id)}
        >
          <IoClose />
        </Button>
      </div>
    ),
  }));

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar activeTab="طلبات الانضمام" />

      <div className="flex flex-col flex-1 px-24 py-8">
        <h1 className="text-2xl font-bold mb-4">طلبات الانضمام</h1>

        {loading && (
          <div className="flex justify-center items-center my-2">
            <Loading />
          </div>
        )}
        {error && <p className="text-red-500">حدث خطأ: {error}</p>}

        {requestsList.length > 0 ? (
          <>
            <TableComponent headers={headers} data={tableData} />
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              className="mt-4"
            />
          </>
        ) : (
          !loading && <p className="text-gray-500">لا توجد طلبات متاحة</p>
        )}
      </div>
    </div>
  );
}

export default Request;
