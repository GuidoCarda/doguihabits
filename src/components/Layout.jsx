import React from "react";

const Layout = ({ children }) => {
  return (
    <section className="max-w-screen-xl px-4 mx-auto py-10">{children}</section>
  );
};

export default Layout;
