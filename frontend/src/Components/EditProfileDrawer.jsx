import React, { useState, useEffect } from "react";
import { X, UserCog, KeyRound } from "lucide-react";

const EditProfileDrawer = ({
  onClose,
  onUpdateProfile,
  profile,
  onSavePass,
}) => {
  const [fullName, setFullName] = useState(profile.fullName);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changePass, setChangePass] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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
    onSavePass({ oldPassword, newPassword });
    setOldPassword("");
    setNewPassword("");
    setChangePass(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="
          fixed inset-y-0 right-0 z-50
          w-[92vw] sm:w-[420px]
          bg-linear-to-br from-slate-900/95 to-slate-800/95
          backdrop-blur-lg
          border-l border-white/10
          shadow-xl
          animate-slide-in-right
        "
      >
        <div className="h-full flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <UserCog className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">
                Edit Profile
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-5 overflow-y-auto">

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                className="
                  w-full px-4 py-3
                  bg-white/5 border border-white/10
                  rounded-lg text-white
                  focus:outline-none focus:border-cyan-500
                  focus:ring-2 focus:ring-cyan-500/20
                  transition
                "
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="
                  w-full px-4 py-3
                  bg-white/5 border border-white/10
                  rounded-lg text-gray-400 cursor-not-allowed
                "
              />
            </div>

            {/* Change password toggle */}
            {!changePass && (
              <button
                onClick={() => setChangePass(true)}
                className="
                  flex items-center gap-2
                  text-sm font-medium text-cyan-400
                  hover:text-cyan-300 transition
                "
              >
                <KeyRound className="w-4 h-4" />
                Change Password
              </button>
            )}

            {/* Password Section */}
            {changePass && (
              <div className="space-y-4 rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    Old Password
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="
                      w-full px-4 py-3
                      bg-white/5 border border-white/10
                      rounded-lg text-white
                      focus:outline-none focus:border-cyan-500
                    "
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="
                      w-full px-4 py-3
                      bg-white/5 border border-white/10
                      rounded-lg text-white
                      focus:outline-none focus:border-cyan-500
                    "
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setChangePass(false)}
                    className="
                      flex-1 py-2 rounded-lg
                      bg-gray-600 hover:bg-gray-500
                      text-white font-medium transition
                    "
                  >
                    Cancel
                  </button>
                  <button
                    onClick={savePassHandler}
                    className="
                      flex-1 py-2 rounded-lg
                      bg-cyan-600 hover:bg-cyan-500
                      text-white font-semibold transition
                    "
                  >
                    Save Password
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 flex gap-3 bg-slate-900/70">
            <button
              onClick={onClose}
              className="
                flex-1 py-3 rounded-lg
                bg-gray-600 hover:bg-gray-500
                text-white font-semibold transition
              "
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="
                flex-1 py-3 rounded-lg
                bg-cyan-600 hover:bg-cyan-500
                text-white font-semibold transition
                shadow-md shadow-cyan-500/30
              "
            >
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default EditProfileDrawer;
