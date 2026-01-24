import Navbar from "./components/common/Navbar";
/*import Home from "./pages/public/Home";*/
import History from "./pages/public/History"; 
import "./styles/globals.css";
// Si tu Navbar necesita este css y NO lo importa por su cuenta, déjalo:
import "./components/common/Navbar.css";

function App() {
  return (
    <>
      <Navbar />
      <History />
    </>
  );
}

export default App;
