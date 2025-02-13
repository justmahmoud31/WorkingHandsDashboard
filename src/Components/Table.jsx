import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const TableComponent = ({ headers, data, onRowClick }) => {
  return (
    <TableContainer
      component={Paper}
      className="shadow-lg rounded-lg"
      sx={{
        fontFamily: "'Cairo', sans-serif", // Apply Cairo font
      }}
    >
      <Table dir="rtl">
        {/* Table Header */}
        <TableHead>
          <TableRow sx={{ backgroundColor: "#3c8dad" }}>
            {headers.map((header, index) => (
              <TableCell
                key={index}
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontFamily: "'Cairo', sans-serif", // Apply Cairo font
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                hover
                onClick={() => onRowClick(row["المعرف"])}
                style={{ cursor: "pointer" }}
              >
                {headers.map((header, colIndex) => (
                  <TableCell
                    key={colIndex}
                    sx={{
                      textAlign: "center",
                      fontFamily: "'Cairo', sans-serif", // Apply Cairo font
                    }}
                  >
                    {row[header] || "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={headers.length}
                sx={{
                  textAlign: "center",
                  color: "gray",
                  fontFamily: "'Cairo', sans-serif",
                }}
              >
                لا توجد بيانات متاحة
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
