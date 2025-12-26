# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

src/
│
├── api/
│   ├── axios.js
│   ├── auth.api.js
│   ├── board.api.js
│   ├── list.api.js
│   └── task.api.js
│
├── context/
│   └── AuthContext.jsx
│
├── routes/
│   ├── PrivateRoute.jsx
│   └── PublicRoute.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Boards.jsx
│   ├── BoardPage.jsx
│   └── NotFound.jsx
│
├── components/
│   ├── common/
│   │   ├── Loader.jsx
│   │   ├── Modal.jsx
│   │   └── Navbar.jsx
│   │
│   ├── boards/
│   │   ├── BoardCard.jsx
│   │   ├── CreateBoardModal.jsx
│   │   └── BoardHeader.jsx
│   │
│   ├── lists/
│   │   ├── ListColumn.jsx
│   │   ├── CreateList.jsx
│   │   └── ListMenu.jsx
│   │
│   └── tasks/
│       ├── TaskCard.jsx
│       ├── CreateTask.jsx
│       └── TaskModal.jsx
│
├── hooks/
│   └── useAuth.js
│
├── App.jsx
└── main.jsx



| User intent                    | File                       |
| ------------------------------ | -------------------------- |
| “Show me all my boards”        | `pages/Boards.jsx`         |
| “I want to create a new board” | `pages/CreateBoard.jsx`    |
| “Show me one board in detail”  | `pages/Board.jsx`          |
| “Show one board card visually” | `components/BoardCard.jsx` |


user logs in
            |
            |
            |
--> boards.jsx(p) 
1. (it fetches all the boards, and stores them, then a component is called and boards data is passed on to it which maps the components in a card format)- boardGrid.jsx(c);
2. also it navigates the useer to create a new board by giving him a button
            |
            |
            |
-->board.jsx(p)
1. first thing it does on loading is fetching all the board details,lists and also the tasks of that lists ✅
2. displays the board details ✅
3. a component included to create a new List(createList(c))--creates a list by showing input box 
4. include a component listContainer and pass the data of list and tasks for it to map--

Listcontainer.jsx(c)
  |
  |
  |
  it just maps the list data and includes a component (ListCard.jsx)(c) which is kindof like a big column of that list containing the mapped tasks by including a component TaskCards, at the end of each mapping iteration, a createTask component is present as the last task in that column
  CreateTask(c):
  |
  |
  |
basically takes input (by desinging card as well and sends the info ) and then calls the addTask handler function from board.jsx by use of props,passing of props...in this way again fetching doesnt occur
TaskCard.jsx(c):
|
|
|
basically it is present inside the listCard component, in which the whole task card ui is designed and is included as a component in every iteration of listCard mapping, 
Task.jsx(c)
|
|
|
|
detailed szoomed component containing comments, edit delete option, what all is modifiable thopse options are visiblke here

ListCard.jsx(c):
|
|
|
ui of every list as well as mapping of tasks and delete edit function at the bottom


Action	        Who can do it
Create List--	    Board member
Edit/Delete List--	List creator
Create Task	List-- creator
Edit/Delete Task--	Task creator
Assign Task	List-- creator
Change Task Status--	Assignee