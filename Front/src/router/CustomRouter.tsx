import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "../pages/Chat";
import Installation from "../pages/Installation";
import { ServicesProvider } from "../context/ServicesContext";

function CustomRouter() {

    return (
        <BrowserRouter>
          <ServicesProvider>
            <Routes>
              <Route path="/" element={<Installation />} />
              <Route path="/chat" element={<Chat/>} />
              <Route path="*" element={<Installation />} />
            </Routes>
          </ServicesProvider>
        </BrowserRouter>
      );
  }
  
  export default CustomRouter