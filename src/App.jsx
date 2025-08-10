import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateNote from "./pages/CreateNote";
import ViewNote from "./pages/ViewNote";
import PdfAnalyzer from "./pages/PdfAnalyzer";
import ManualNote from "./pages/ManualNote";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateNote />
            </ProtectedRoute>
          }
        />
        <Route
          path="/note/:id"
          element={
            <ProtectedRoute>
              <ViewNote />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pdf-analyzer"
          element={
            <ProtectedRoute>
              <PdfAnalyzer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pdf-analyzer/:fileName"
          element={
            <ProtectedRoute>
              <PdfAnalyzer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manual-note"
          element={
            <ProtectedRoute>
              <ManualNote />
            </ProtectedRoute>
          }
        />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
