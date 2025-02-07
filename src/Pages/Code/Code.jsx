import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { API_URL } from "../../../constants";

function Code() {
  const dispatch = useDispatch();
  const { codes, loading, error } = useSelector((state) => state.code);
  const token = localStorage.getItem("token");

  const [open, setOpen] = useState(false);
  const [selectedCodeId, setSelectedCodeId] = useState(null);
  const [newStock, setNewStock] = useState("");

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

  const handleOpenDialog = (id, currentStock) => {
    setSelectedCodeId(id);
    setNewStock(currentStock);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedCodeId(null);
    setNewStock("");
  };

  const handleEditStock = async () => {
    if (!newStock || isNaN(newStock)) {
      toast.error("الرجاء إدخال رقم صحيح");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/code/editcode/${selectedCodeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newStock: Number(newStock) }),
        }
      );

      if (!response.ok) throw new Error("فشل في تعديل المخزون");

      toast.success("تم تعديل المخزون بنجاح");
      dispatch(fetchCodes({ token })); // Refresh the data
      handleCloseDialog();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar activeTab="اكواد التحقق" />
      <div className="flex flex-col flex-1 px-24 py-8">
        <h1 className="text-2xl font-bold mb-4"> اكواد التحقق</h1>
        <div className="flex justify-end">
          <Link
            to={"/addcode"}
            className="bg-main px-3 py-2 text-white rounded-lg"
          >
            اضف كود جديد
          </Link>
        </div>
        {loading && <p>جاري التحميل...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <TableContainer component={Paper} className="mt-4">
          <Table
            sx={{
              fontFamily: "'Cairo', sans-serif", // Apply Cairo font
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  color: "white",
                  fontFamily: "'Cairo', sans-serif",
                }}
                className="bg-main"
              >
                <TableCell
                  align="center"
                  sx={{
                    fontFamily: "'Cairo', sans-serif",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontFamily: "'Cairo', sans-serif",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  الكود
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontFamily: "'Cairo', sans-serif",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  عدد مرات الاستخدام
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontFamily: "'Cairo', sans-serif",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  المستخدم
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontFamily: "'Cairo', sans-serif",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  الإجراءات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {codes.map((code) => (
                <TableRow
                  key={code.id}
                  sx={{
                    fontFamily: "'Cairo', sans-serif",
                  }}
                >
                  <TableCell align="center">{code.id}</TableCell>
                  <TableCell align="center">{code.code}</TableCell>
                  <TableCell align="center">{code.stock}</TableCell>
                  <TableCell align="center">{code.used}</TableCell>
                  <TableCell align="center">
                    <button
                      className="text-white bg-main px-2 py-2 rounded-lg lg:ml-2 my-2"
                      onClick={() => handleOpenDialog(code.id, code.stock)}
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      className="text-white bg-red-600 px-2 py-2 rounded-lg "
                      onClick={() => handleDelete(code.id)}
                    >
                      <MdDelete size={20} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Stock Dialog */}
        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle
            sx={{ fontFamily: "'Cairo', sans-serif", fontWeight: "bold" }}
          >
            تعديل المخزون
          </DialogTitle>
          <DialogContent>
            <TextField
              label="عدد مرات الاستخدام"
              type="number"
              fullWidth
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              margin="dense"
              sx={{ fontFamily: "'Cairo', sans-serif" }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              color="secondary"
              sx={{ fontFamily: "'Cairo', sans-serif" }}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleEditStock}
              color="primary"
              sx={{ fontFamily: "'Cairo', sans-serif" }}
            >
              حفظ
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Code;
