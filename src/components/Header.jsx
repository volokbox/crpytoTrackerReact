import React from "react";
import AppBar from "@mui/material/AppBar";
import {
  Container,
  MenuItem,
  Select,
  Toolbar,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import { CryptoState } from "../CryptoContext";

const useStyles = makeStyles({
  title: {
    flex: 1,
    color: "gold",
    fontFamily: "Montserrat",
    fontWeight: "bold",
    cursor: "pointer",
  },
});

const Header = ({ CryptoContext }) => {
  const classes = useStyles();
  const { currency, setCurrency } = CryptoState();

  console.log(currency);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <AppBar color="transparent" position="static">
          <Container>
            <Toolbar>
              <Typography className={classes.title} variant="h5">
                <Link to="/">Crypto Tracker</Link>
              </Typography>
              <Select
                variant="outlined"
                style={{
                  width: 100,
                  height: 40,
                  marginRight: 15,
                }}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <MenuItem value={"EUR"}>EUR</MenuItem>
                <MenuItem value={"USD"}>USD</MenuItem>
                <MenuItem value={"UAH"}>UAH</MenuItem>
              </Select>
            </Toolbar>
          </Container>
        </AppBar>
      </ThemeProvider>
    </>
  );
};

export default Header;
