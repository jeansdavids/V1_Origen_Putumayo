import Navbar from "./components/common/Navbar";
import Home from "./pages/public/Home";
import "./styles/globals.css";
// Si tu Navbar necesita este css y NO lo importa por su cuenta, déjalo:
import "./components/common/Navbar.css";

function App() {
  return (
    <>
      <Navbar />
      <Home />
    </>
  );
}

export default App;
