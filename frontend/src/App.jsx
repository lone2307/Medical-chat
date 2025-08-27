import NavBar from './components/navBar.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Product from "./pages/Product.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  return (
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Product" element={<Product />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
  )
}