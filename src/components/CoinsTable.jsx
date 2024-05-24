import {
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  createTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { CryptoState } from "../CryptoContext";
import { CoinList } from "../config/api.js";
import axios from "axios";
import { ThemeProvider } from "@emotion/react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { numberWithCommas } from "./Banner/Carousel.jsx";
import { Pagination } from "@mui/material";

const useStyles = makeStyles({
  headingText: {
    fontWeight: "bold",
    fontFamily: "Montserrat",
    fontSize: 17.5,
  },
  row: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#1e2125",
    },
  },
});

const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const classes = useStyles();

  const { currency, symbol } = CryptoState();
  const navigate = useNavigate();

  const fetchListingCoins = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(CoinList(currency));
      setCoins(data);
      setLoading(false);
    } catch (e) {
      console.log("Error: ", e);
      setLoading(true);
    }
  };

  useEffect(() => {
    try {
      fetchListingCoins();
    } catch (e) {
      console.log(e);
    }
  }, [currency]);

  console.log(coins);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  };

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat", marginTop: 40 }}
        >
          Cryptocurrency value per Market Cap
        </Typography>
        <TextField
          id="searchCrypto"
          label="Search for a Cryptocurrency..."
          variant="outlined"
          style={{ width: "60%" }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer style={{ marginTop: 30, overflow: "visible" }}>
          {loading ? (
            <CircularProgress style={{ color: "purple" }} />
          ) : (
            <Table>
              <TableHead
                style={{
                  backgroundColor: "rgb(166, 104, 207)",
                }}
              >
                <TableRow>
                  <TableCell className={classes.headingText}>Coin</TableCell>
                  <TableCell
                    className={classes.headingText}
                    style={{ textAlign: "right" }}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    className={classes.headingText}
                    style={{ textAlign: "right" }}
                  >
                    24h Change
                  </TableCell>
                  <TableCell
                    className={classes.headingText}
                    style={{ textAlign: "right" }}
                  >
                    Market Cap
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit = row.price_change_percentage_24h >= 0;

                    return (
                      <TableRow
                        className={classes.row}
                        key={row.id}
                        onClick={() => navigate(`/coins/${row.id}`)}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                          }}
                        >
                          <img
                            src={row?.image}
                            alt={row.name}
                            height="50"
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span style={{ color: "darkgrey" }}>
                              {row.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          {numberWithCommas(row.current_price.toFixed(2))}{" "}
                          {symbol}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit > 0 ? "green" : "red",
                            fontWeight: 400,
                          }}
                        >
                          {profit > 0 ? "+" : ""}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          {symbol}{" "}
                          {row.market_cap
                            .toLocaleString()
                            .toString()
                            .slice(0, -7)}
                          M
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {loading ? (
          ""
        ) : (
          <Pagination
            count={(handleSearch()?.length / 10).toFixed(0)}
            page={page}
            onChange={(_, value) => {
              setPage(value);
              window.scroll(0, 450);
            }}
            style={{
              padding: 40,
              display: "flex",
              justifyContent: "center",
            }}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;
