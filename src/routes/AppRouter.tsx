import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import WordManager from "../pages/WordManager";
import Exercises from "../pages/Exercises";

const AppRouter = () => {
  return(<>
    <BrowserRouter>
      <Routes>
        <Route path="exercises" element={<Exercises />} />
        <Route path="wordManager" element={<WordManager />} />
      </Routes>
    </BrowserRouter>
  </>)
}

export default AppRouter;