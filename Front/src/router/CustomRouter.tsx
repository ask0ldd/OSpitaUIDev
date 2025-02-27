import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "../pages/Chat";
import Installation from "../pages/Installation";
import { ServicesProvider } from "../context/ServicesContext";
import ImageGen from "../pages/ImageGen";
import { OptionsProvider } from "../context/OptionsContext";

function CustomRouter() {

    return (
        <BrowserRouter future={{
          v7_startTransition: true, v7_relativeSplatPath: true,
        }}>
          <ServicesProvider>
            <OptionsProvider>
              <Routes>
                <Route path="/" element={<Installation />} />
                <Route path="/chat" element={<Chat/>} />
                <Route path="/imagegen" element={<ImageGen/>} />
                <Route path="*" element={<Installation />} />
              </Routes>
            </OptionsProvider>
          </ServicesProvider>
        </BrowserRouter>
      );
  }
  
  export default CustomRouter