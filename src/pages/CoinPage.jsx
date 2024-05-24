import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import { SingleCoin } from "../config/api.js";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import CoinInfo from "../components/CoinInfo.jsx";
import { CircularProgress, Typography } from "@mui/material";
import { numberWithCommas } from "../components/Banner/Carousel.jsx";
import HtmlParser from "react-html-parser";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    "@media (max-width: 960px)": {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  sidebar: {
    width: "30%",
    "@media (max-width: 960px)": {
      width: "100%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 25,
    borderRight: "2px solid grey",
  },
  heading: {
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Montserrat",
  },
  description: {
    width: "100%",
    fontFamily: "Montserrat",
    textAlign: "center",
    padding: 25,
    paddingBottom: 15,
    paddingTop: 0,
    // eslint-disable-next-line no-dupe-keys
    textAlign: "justify",
  },
  marketData: {
    alignSelf: "start",
    padding: 25,
    paddingTop: 10,
    width: "100%",
    "@media (max-width: 960px)": {
      display: "flex",
      justifyContent: "space-around",
    },
    // eslint-disable-next-line no-dupe-keys
    "@media (max-width: 960px)": {
      flexDirection: "column",
      alignItems: "center",
    },
    // eslint-disable-next-line no-dupe-keys
    "@media (max-width: 960px)": {
      alignItems: "start",
    },
  },
}));

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const [loading, setLoading] = useState(false);

  console.log(coin);
  console.log(id);

  const classes = useStyles();

  const { currency, symbol } = CryptoState();

  const fetchSingleCoin = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(SingleCoin(id));
      setCoin(data);
      setLoading(false);
    } catch (e) {
      console.log("Error: ", e);
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchSingleCoin();
  }, [currency]);

  return (
    <>
      {!loading ? (
        <div className={classes.container}>
          <div className={classes.sidebar}>
            <img
              src={coin?.image.large}
              alt={coin?.name}
              height="200"
              style={{ marginBottom: 20 }}
            />
            <Typography variant="h3" className={classes.heading}>
              {coin?.name}
            </Typography>
            <Typography variant="subtitle1" className={classes.description}>
              {HtmlParser(coin?.description.en.split(". ")[0])}.
              {HtmlParser(coin?.description.en.split(". ")[1])}.
            </Typography>
            <div className={classes.marketData}>
              <span style={{ display: "flex" }}>
                <Typography variant="h5" className={classes.heading}>
                  Rank:
                </Typography>
                &nbsp;&nbsp;
                <Typography
                  variant="h5"
                  style={{
                    fontFamily: "Montserrat",
                  }}
                >
                  {coin?.market_cap_rank}
                </Typography>
              </span>
              <span style={{ display: "flex" }}>
                <Typography variant="h5" className={classes.heading}>
                  Current Price:
                </Typography>
                &nbsp;&nbsp;&nbsp;
                <Typography
                  variant="h5"
                  style={{
                    fontFamily: "Montserrat",
                  }}
                >
                  {symbol}{" "}
                  {!loading
                    ? numberWithCommas(
                        coin?.market_data.current_price[currency.toLowerCase()]
                      )
                    : " "}
                </Typography>
              </span>
              <span style={{ display: "flex" }}>
                <Typography variant="h5" className={classes.heading}>
                  Market Cap:
                </Typography>
                &nbsp;&nbsp;&nbsp;
                <Typography
                  variant="h5"
                  style={{
                    fontFamily: "Montserrat",
                  }}
                >
                  {symbol}{" "}
                  {!loading
                    ? numberWithCommas(
                        coin?.market_data.market_cap[currency.toLowerCase()]
                          .toString()
                          .slice(0, -6)
                      )
                    : " "}
                  M
                </Typography>
              </span>
            </div>
          </div>
          <CoinInfo coin={coin} coinId={coin?.id} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "20%",
          }}
        >
          <CircularProgress style={{ color: "purple" }} size={100} />
        </div>
      )}
    </>
  );
};

export default CoinPage;
