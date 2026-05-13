import React, { useState } from "react";
import { X, User as UserIcon, Lock, Mail, Trash2, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import { changeFullName, changePassApi, deleteAccountApi } from "../Api/auth.api";
import { useAuth } from "../Context/Auth.context";
import { useNavigate } from "react-router-dom";

const UserSettingsModal = ({ onClose }) => {
  const { user, logout, checkAuth } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile"); // profile, password, danger
  
  // Profile state
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });
  
  // Password state
  const [passData, setPassData] = useState({
    password: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [passMsg, setPassMsg] = useState({ text: "", type: "" });

  // Loading states
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    
    setIsUpdatingProfile(true);
    setProfileMsg({ text: "", type: "" });
    try {
      await changeFullName({ fullName });
      await checkAuth(); // refresh user data in context
      setProfileMsg({ text: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.message || "Failed to update profile", type: "error" });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPassMsg({ text: "", type: "" });

    if (passData.newPassword !== passData.confirmNewPassword) {
      return setPassMsg({ text: "New passwords do not match", type: "error" });
    }

    setIsUpdatingPass(true);
    try {
      await changePassApi({
        email: user.email,
        password: passData.password,
        newPassword: passData.newPassword,
        confirmNewPassword: passData.confirmNewPassword
      });
      setPassMsg({ text: "Password updated successfully!", type: "success" });
      setPassData({ password: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      setPassMsg({ text: err.response?.data?.message || "Failed to update password", type: "error" });
    } finally {
      setIsUpdatingPass(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await deleteAccountApi();
      await logout();
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete account");
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Helper to get initials for PFP
  const getInitials = (name) => {
    return name
      ? name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
      : "U";
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-cyan-400" />
            User Settings
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info Header (Fixed) */}
        <div className="p-6 flex items-center gap-4 border-b border-white/5">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-xl font-bold text-white shadow-lg shrink-0">
            {getInitials(user?.fullName)}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-lg font-bold text-white truncate">{user?.fullName}</h3>
            <p className="text-gray-400 text-sm flex items-center gap-1 truncate">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              {user?.email}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 px-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "profile" ? "border-cyan-400 text-cyan-400" : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "password" ? "border-cyan-400 text-cyan-400" : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            Password
          </button>
          <button
            onClick={() => setActiveTab("danger")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "danger" ? "border-red-400 text-red-400" : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            Danger Zone
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              {profileMsg.text && (
                <div className={`p-3 rounded-xl flex items-center gap-2 text-sm ${profileMsg.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                  {profileMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  {profileMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isUpdatingProfile || fullName === user?.fullName}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}

          {/* PASSWORD TAB */}
          {activeTab === "password" && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passData.password}
                  onChange={(e) => setPassData({...passData, password: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                <input
                  type="password"
                  value={passData.newPassword}
                  onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passData.confirmNewPassword}
                  onChange={(e) => setPassData({...passData, confirmNewPassword: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {passMsg.text && (
                <div className={`p-3 rounded-xl flex items-center gap-2 text-sm ${passMsg.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                  {passMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  {passMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isUpdatingPass}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                {isUpdatingPass ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}

          {/* DANGER ZONE TAB */}
          {activeTab === "danger" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <h4 className="text-red-400 font-medium flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4" /> Delete Account
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                <h4 className="text-gray-300 font-medium mb-2">Log out of TaskDeck</h4>
                <p className="text-gray-400 text-sm mb-4">
                  You can log back in at any time.
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium flex items-center justify-center gap-2 transition-colors border border-white/10"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettingsModal;
