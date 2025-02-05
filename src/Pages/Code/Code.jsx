import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCodes, deleteCode } from "../../redux/codeSlice";
import Sidebar from "../../Components/Sidebar";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

function Code() {
  const dispatch = useDispatch();
  const { codes, loading, error } = useSelector((state) => state.code);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(fetchCodes({ token }));
    }
  }, [dispatch, token]);

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد أنك تريد حذف هذا الكود؟")) {
      dispatch(deleteCode({ token, codeId: id }))
        .unwrap()
        .then(() => toast.success("تم حذف الكود بنجاح"))
        .catch(() => toast.error("فشل في حذف الكود"));
    }
  };

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar activeTab="اكواد التحقق" />
      <div className="flex flex-col flex-1 px-24 py-8">
        <h1 className="text-2xl font-bold mb-4"> اكواد التحقق</h1>
        {loading && <p>جاري التحميل...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <TableContainer component={Paper} className="mt-4">
          <Table
            sx={{
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              fontFamily: "'Cairo', sans-serif", // Apply Cairo font
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontFamily: "'Cairo', sans-serif", // Apply Cairo font
                }}
                className="bg-main text-white"
              >
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">الكود</TableCell>
                <TableCell align="center">عدد مرات الاستخدام</TableCell>
                <TableCell align="center">المستخدم</TableCell>
                <TableCell align="center">الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {codes.map((code) => (
                <TableRow
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontFamily: "'Cairo', sans-serif", // Apply Cairo font
                  }}
                  key={code.id}
                >
                  <TableCell align="center">{code.id}</TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontFamily: "'Cairo', sans-serif", // Apply Cairo font
                    }}
                    align="center"
                  >
                    {code.code}
                  </TableCell>
                  <TableCell align="center">{code.stock}</TableCell>
                  <TableCell align="center">{code.used}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(code.id)}
                    >
                      <MdDelete size={20} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Code;
