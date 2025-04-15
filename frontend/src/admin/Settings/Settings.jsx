import { useState } from "react";

const Settings = () => {
  const [message, setMessage] = useState("");

  const handleButtonClick = () => {
    setMessage("Settings have been updated successfully!");
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Settings Page</h1>
      <p>Manage your admin settings here.</p>

      {/* Button to trigger an action */}
      <button
        onClick={handleButtonClick}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Update Settings
      </button>

      {/* Show message when button is clicked */}
      {message && <p className="mt-4 text-green-500 font-semibold">{message}</p>}
    </div>
  );
};

export default Settings;
