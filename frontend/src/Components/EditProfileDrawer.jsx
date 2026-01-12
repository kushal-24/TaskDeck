import React, { useState } from "react";

const EditProfileDrawer = ({onClose, onUpdateProfile, profile, onSavePass}) => {
const [fullName, setFullName] = useState(profile.fullName);
const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [changePass, setChangePass] = useState(false);


const onSave = () => {
    if (fullName === profile.fullName) {
      alert("No changes found");
      return;
    }
  
    onUpdateProfile({ fullName });
    onClose();
  };
  

  const savePassHandler = () => {
    if (!oldPassword || !newPassword) {
      alert("Fill both password fields");
      return;
    }

    onSavePass({oldPassword, newPassword});
  
    setOldPassword("");
    setNewPassword("");
    setChangePass(false);
  };

    return (
      <div className="fixed inset-0 z-50 flex">
        
        {/* Backdrop */}
        <div className="flex-1 bg-black/30"></div>
  
        {/* Drawer */}
        <div className="w-full max-w-sm bg-white shadow-xl p-6">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Edit Profile
            </h2>
            <button 
            onClick={()=>onClose()}
            className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
  
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
            value={fullName}
            onChange={(e)=>setFullName(e.target.value)}
              type="text"
              placeholder="Enter full name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              disabled
              value={profile.email}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
          onClick={()=>setChangePass(true)}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Change Password
            </button>
  
          {/* Password */}
          {changePass && (
            <>
            <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Old Password
            </label>
            <input
            onChange={(e)=>setOldPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
            onChange={(e)=>setNewPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
          onClick={()=>savePassHandler()}
          className="flex-1 rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
              Save password
            </button>
            </>
          )}
  
          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
              Cancel
            </button>

            <button 
            onClick={()=> onSave()}
            className="flex-1 rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
              Save changes
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default EditProfileDrawer;  