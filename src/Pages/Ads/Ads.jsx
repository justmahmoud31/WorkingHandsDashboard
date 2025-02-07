import React from "react";
import Sidebar from "../../Components/Sidebar";

function Ads() {
  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar activeTab="اعلانات" />
      <div className="flex flex-col flex-1 px-24 py-8">
        <h1 className="text-2xl font-bold mb-4">اعلانات</h1>
      </div>
    </div>
  );
}

export default Ads;
