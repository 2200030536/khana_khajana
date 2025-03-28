import { useState } from "react";

function MessUser() {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-100 p-4">
        <ul className="space-y-4">
          {["dashboard", "editMenu", "setPrice", "students", "transactions", "addRevokeUser", "profile"].map((item) => (
            <li key={item}>
              <button onClick={() => setActiveComponent(item)} className="w-full text-left p-2 hover:bg-gray-200">
                {item.charAt(0).toUpperCase() + item.slice(1).replace(/([A-Z])/g, " $1")}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-4/5">
        {/* Header */}
        <div className="bg-gray-300 p-4 flex justify-between">
          <h1 className="text-lg font-bold">Mess Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-4">id institute</span>
            <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="p-4">
          {activeComponent === "dashboard" && <div>Dashboard Content</div>}
          {activeComponent === "editMenu" && <div>Edit Menu Content</div>}
          {activeComponent === "setPrice" && <div>Set Price Content</div>}
          {activeComponent === "students" && <div>Students Content</div>}
          {activeComponent === "transactions" && <div>Transactions Content</div>}
          {activeComponent === "addRevokeUser" && <div>Add/Revoke User Content</div>}
          {activeComponent === "profile" && <div>Profile Content</div>}
        </div>
      </div>
    </div>
  );
}

export default MessUser;
