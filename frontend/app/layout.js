// frontend/app/layout.js
export const metadata = {
  title: "IEDC Treasure Hunt",
  description: "IEDEC ASET official",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        {/* Preconnect to speed up font and backend connections */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://iedc-treasure-hunt-backend.onrender.com" />
        {/* Preload main font if used site-wide */}
        {/* <link rel="preload" as="font" type="font/woff2" href="/fonts/YourMainFont.woff2" crossOrigin="anonymous" /> */}
      </head>
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
