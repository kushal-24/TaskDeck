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









