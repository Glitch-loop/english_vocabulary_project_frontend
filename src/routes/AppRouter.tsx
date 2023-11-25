import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import WordManager from "../pages/WordManager";
import Exercises from "../pages/Exercises";
import Layout from "../pages/Layout";

const AppRouter = () => {
  return(<>
    <BrowserRouter>
      <Routes>
        <Route path="/app" element={<Layout/>}>
          <Route path="wordManager" element={<WordManager />} />
          <Route path="exercises" element={<Exercises />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </>)
}

export default AppRouter;