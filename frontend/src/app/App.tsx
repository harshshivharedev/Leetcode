import HomePage from "../pages/HomePage";
import { Routes, Route } from "react-router";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import ProblemsPage from "../pages/ProblemsPage";
import ProblemPage from "../pages/ProblemPage";

function App() {
    return (
        <>
          <Routes>
            <Route path="/" element={<HomePage></HomePage>}></Route>
            <Route path="/login" element={<Login></Login>}></Route>
            <Route path="/signup" element={<Signup></Signup>}></Route>
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/problems/:slug" element={<ProblemPage />} />

          </Routes>
        </>
    );
}

export default App;
