import React from "react";
import { Routes, Route } from "react-router-dom";
import NavbarLayout from "./components/common/NavbarLayout";
import Home from "./pages/public/Home";
import History from "./pages/public/History";

const App: React.FC = () => {
  return (
    <NavbarLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/historia" element={<History />} />
      </Routes>
    </NavbarLayout>
  );
};

export default App;

