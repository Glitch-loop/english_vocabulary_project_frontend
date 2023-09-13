import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import WordManager from "../pages/WordManager";


const AppRouter = () => {
  return(<>
    <BrowserRouter>
      <Routes>
        <Route path="wordManager" element={<WordManager />} />
      </Routes>
    </BrowserRouter>
  </>)
}

export default AppRouter;