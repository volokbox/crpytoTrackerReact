import "./App.css";
import { Route, Routes, HashRouter } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CoinPage from "./pages/CoinPage";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  App: {
    backgroundColor: "#14161a",
    color: "white",
    minHeight: "100vh",
  },
});

function App() {
  const classes = useStyles();

  return (
    <HashRouter>
      <div className={classes.App}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/coins/:id" element={<CoinPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
