import React from 'react'

function ListContainer({list}) {
  return (
    <div>
        {list.length === 0 ? (
        <p>No lists yet</p>
    ) : (
        list.map((item) => (
          <div
            key={item._id}
            className="mt-2 rounded bg-white p-3 shadow"
          >
            {item.title}
          </div>
        ))
      )}
    </div>
  )
}

export default ListContainer