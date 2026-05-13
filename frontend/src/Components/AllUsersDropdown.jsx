import { useEffect, useRef, useState } from "react";

const AllUsersDropdown = ({ 
    users, 
    boardMembers, 
    board,
    onAddMember,
    onRemoveMember
}) => {
  const [open, setOpen] = useState(false);
  const dropDownRef=useRef();
  

  useEffect(()=>{
    const handleClickOutside=(e)=>{
        if(dropDownRef.current && !dropDownRef.current.contains(e.target)){
            setOpen(false)
        }
    }
    document.addEventListener("mousedown", handleClickOutside); //Listen to all clicks on the page

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },[])

  const formatName = (name) =>
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  return (
    <div ref={dropDownRef} className="relative w-64">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-md border bg-white px-3 py-2 text-sm text-left">
        Select user
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 max-h-44 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
    
    {users && users.length > 0 ? (
      users.map((user) => {
        const userId= user._id?.toString()
        const isMember = boardMembers.some((member)=> member._id == user._id) || userId==board.ownerId.toString()

        return (
          <div
            key={user._id}
            className="flex items-center justify-between px-3 py-2 hover:bg-gray-100">
            {/* User name */}
            <span className="text-sm text-gray-800">
              {formatName(user.fullName)}
            </span>

            {/* Action */}
            <div>
              {!isMember ? (
                <button
                  onClick={() => onAddMember({boardId: board._id, userId: user._id})}
                  className="rounded-md bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600">
                  Add
                </button>
              ) : (
                <button
                  onClick={() => onRemoveMember({boardId: board._id, userId: user._id})}
                  className="rounded-md bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600">
                  Remove
                </button>
              )}
            </div>
          </div>
        );
      })
    ) : (
      <p className="px-3 py-2 text-xs text-gray-400">No users found</p>
    )}
  </div>
)}

    </div>
  );
};

export default AllUsersDropdown;
