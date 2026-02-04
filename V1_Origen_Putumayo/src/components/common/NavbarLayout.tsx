import React from "react";
import Navbar from "./Navbar";

interface Props {
  children: React.ReactNode;
}

const NavbarLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default NavbarLayout;

