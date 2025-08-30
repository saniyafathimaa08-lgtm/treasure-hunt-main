// frontend/app/layout.js
export const metadata = {
  title: "IEDC Treasure Hunt",
  description: "IEDEC ASET official",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
