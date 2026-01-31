import React from "react";
import { Routes, Route } from "react-router-dom";
import NavbarLayout from "./components/common/NavbarLayout";
import FooterLayout from "./components/common/FooterLayout";
import Home from "./pages/public/Home";
import History from "./pages/public/History";

const App: React.FC = () => {
  return (
    <NavbarLayout>
      <FooterLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/historia" element={<History />} />
        </Routes>
      </FooterLayout>
    </NavbarLayout>
  );
};

export default App;

