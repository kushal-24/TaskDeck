# crashCourse

USER
 ├── name
 ├── email
 ├── password
 ├── role ("user" or "admin")
 └── other fields...

BOARD
 ├── title
 ├── owner (User)
 ├── members [User]
 └── (contains Lists)

LIST
 ├── title
 ├── boardId (Board)
 ├── order (position)
 └── (contains Tasks)

TASK
 ├── title
 ├── description
 ├── listId (List)
 ├── priority
 ├── dueDate
 ├── order (position)
 ├── createdBy (User)
 └── assignees [User]

ADMIN (optional system-wide admin)
 ├── username
 ├── email
 └── password


🟦 2. RELATIONSHIP DIAGRAM (VISUAL)--------------------------------------------------------------------------------------------

 USER (board owner)
     |
     | creates
     v
 BOARD -----------------+
  |    \                |
  |     \ adds members  |
  |      \              |
  v       v             |
 LIST → LIST → LIST     |
  |        |            |
  | contains tasks      |
  v        v            |
 TASK → TASK → TASK     |
  |        |            |
  |  assigned to users  |
  +--------+------------+
           |
           v
         USERS


🟥 4. REQUEST-AUTH FLOW (How access works)-------------------------------------------------------------------------------------


Frontend → sends request
 ↓
Backend → verifyJWT middleware
 ↓
Check:
   - Is user logged in?
   - Who is this user? (req.user)
   - What board/list/task is being accessed?
 ↓
Permission check:
   - Is user owner?
   - Is user member?
   - Is user creator?
   - Is user assignee?
 ↓
Allow or deny
