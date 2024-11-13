import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "../pages/Chat";
import Installation from "../pages/Installation";

function CustomRouter() {

    return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Installation />} />
            <Route path="/chat" element={<Chat/>} />
            <Route path="*" element={<Installation />} />
          </Routes>
        </BrowserRouter>
      );
  }
  
  export default CustomRouter