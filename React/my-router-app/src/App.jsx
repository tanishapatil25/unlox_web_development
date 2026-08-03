import React from "react";
import Home from "./HomePage";
import About from "./AboutPage";
//React-Router
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'
function App(){
  return (
    <BrowserRouter>
<nav>
  <link to="/">Home</link>
  <link to="/about">About</link>
</nav>

    <Routes>
      {/*Path-Address of different Pages */}
      <Route path="/"  element={<Home />} />
      <Route path="/about" element={<About/>}  />
    </Routes>
    </BrowserRouter>
)}
export default App