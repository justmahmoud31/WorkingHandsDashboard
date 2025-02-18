import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getEditRequests,
  setEditPage,
  acceptEditRequest,
  rejectEditRequest,
} from "../../redux/editRequests";
import Sidebar from "../../Components/Sidebar";
import TableComponent from "../../Components/Table";
import { Pagination, Button, Avatar } from "@mui/material";
import { toast } from "react-toastify";
import { API_URL } from "../../../constants";
import Loading from "../../Components/Loader/Loading";

function EditRequests() {
  const dispatch = useDispatch();
  const { editRequestsList, loading, error, currentPage, totalPages } =
    useSelector((state) => state.edits);

  const token = localStorage.getItem("token");
  const limit = 10; // Number of edit requests per page

  useEffect(() => {
    if (token) {
      dispatch(getEditRequests({ token, page: currentPage, limit }));
    }
  }, [dispatch, token, currentPage]);

  const handlePageChange = (_, newPage) => {
    dispatch(setEditPage(newPage));
  };

  const handleAccept = (requestId) => {
    dispatch(acceptEditRequest({ token, requestId }))
      .unwrap()
      .then(() => toast.success("تم قبول التعديل بنجاح"))
      .catch((err) => toast.error("حدث خطأ أثناء القبول: " + err));
  };

  const handleReject = (requestId) => {
    dispatch(rejectEditRequest({ token, requestId }))
      .unwrap()
      .then(() => toast.success("تم رفض التعديل"))
      .catch((err) => toast.error("حدث خطأ أثناء الرفض: " + err));
  };

  const headers = [
    "رقم الطلب",
    "الصورة الشخصية",
    "الاسم الحالي",
    "الاسم الجديد",
    "السكن الحالي",
    "السكن الجديد",
    "تاريخ الميلاد الحالي",
    "تاريخ الميلاد الجديد",
    "الإجراءات",
  ];

  const tableData = editRequestsList.map((request) => ({
    "رقم الطلب": request.id,
    "الصورة الشخصية": (
      <Avatar
        src={`${API_URL}${request.user.profilepicture}`}
        alt={request.user.fullname}
      />
    ),
    "الاسم الحالي": request.user.fullname,
    "الاسم الجديد": request.fullname,
    "السكن الحالي": request.user.livesin || "غير متاح",
    "تاريخ الميلاد الحالي":request.user.birthdate,
    "تاريخ الميلاد الجديد":request.birthdate,
    "السكن الجديد": request.livesin || "غير متاح",
    الإجراءات: (
      <div className="flex gap-2">
        <Button
          variant="contained"
          color="success"
          onClick={() => handleAccept(request.id)}
        >
          قبول
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleReject(request.id)}
        >
          رفض
        </Button>
      </div>
    ),
  }));

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar activeTab="طلبات التعديل" />

      <div className="flex flex-col flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">طلبات التعديل</h1>

        {loading && (
          <div className="flex justify-center items-center my-2">
            <Loading />
          </div>
        )}
        {error && <p className="text-red-500">حدث خطأ: {error}</p>}

        {editRequestsList.length > 0 ? (
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
          !loading && <p className="text-gray-500">لا توجد طلبات تعديل متاحة</p>
        )}
      </div>
    </div>
  );
}

export default EditRequests;
