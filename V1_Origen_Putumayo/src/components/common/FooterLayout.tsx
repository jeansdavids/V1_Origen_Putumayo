import React from "react";
import Footer from "./Footer";

interface Props {
  children: React.ReactNode;
}

const FooterLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

export default FooterLayout;
