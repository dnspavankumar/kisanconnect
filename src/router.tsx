import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import DiseasePage from "./pages/DiseasePage";
import NewsPage from "./pages/NewsPage";

export const router = createBrowserRouter([
  { path: "/", element: <Dashboard /> },
  { path: "/welcome", element: <Index /> },
  { path: "/chat", element: <ChatPage /> },
  { path: "/disease", element: <DiseasePage /> },
  { path: "/news", element: <NewsPage /> },
]);
