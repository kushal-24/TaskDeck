import { useState } from "react";

const UserDropdown = ({ taskData, members, onRemoveAssignee, onAddAssignee }) => {
  const [open, setOpen] = useState(false);

  const formatName = (name) =>
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  return (
    <div className="relative w-56">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-md border bg-white px-3 py-2 text-sm text-left">
        Manage assignees
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
          {members.map((member) => {
            const isAssigned = taskData.assignees.includes(member._id);

            return (
              <div
                key={member._id}
                className="flex items-center justify-between px-3 py-2 hover:bg-gray-100">
                {/* Name */}
                <span className="text-sm">
                  {formatName(member.fullName)}
                </span>

                {/* Action buttons */}
                <div className="flex gap-1">
                  {!isAssigned ? (
                    <button
                      onClick={() => onAddAssignee(member._id, taskData)}
                      className="rounded bg-green-500 px-2 py-0.5 text-xs text-white hover:bg-green-600">
                      +
                    </button>
                  ) : (
                    <button
                      onClick={() => onRemoveAssignee(member._id, taskData)}
                      className="rounded bg-red-500 px-2 py-0.5 text-xs text-white hover:bg-red-600">
                      x
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
