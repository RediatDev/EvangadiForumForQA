import React from "react";
import Dashboard from "./pages/DashBoard/Dashboard.jsx";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
// import NotFound from "./components/notFound/NotFound";
function App() {
  return (
    <>
      <Header />
      <Dashboard />
      <Footer />
	  {/* <NotFound/> */}
    </>
  );
}

export default App;
