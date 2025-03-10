import React from "react";

export const metadata = {
  title: "Prof Avalia",
  description: "Veja e faça avaliações dos seus professores",
};

const layout = ({ children }) => {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
};

export default layout;
