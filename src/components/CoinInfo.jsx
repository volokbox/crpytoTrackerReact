import React, { useEffect, useState } from "react";
import { HistoricalChart } from "../config/api.js";
import axios from "axios";
import { CryptoState } from "../CryptoContext.jsx";
import { CircularProgress, ThemeProvider, createTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Line } from "react-chartjs-2";
import { chartDays } from "../config/data";
import SelectButton from "./SelectButton.jsx";
import "chart.js/auto";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    padding: 40,
    "@media (max-width: 960px)": {
      width: "100%",
      marginTop: 0,
      padding: 20,
      paddingTop: 0,
    },
  },
}));

const CoinInfo = ({ coinId }) => {
  const [historicalChart, setHistoricalChart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(90);
  const { currency } = CryptoState();
  const [flag, setFlag] = useState(false);

  const classes = useStyles();

  const fetchHistoricalChart = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(HistoricalChart(coinId, days, currency));
      setHistoricalChart(data.prices);
      setLoading(false);
    } catch (e) {
      console.log("Error: ", e);
      setLoading(false); // Set loading to false in case of error
    }
  };

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  const handleDays = (newDays) => {
    setDays(newDays);
  };

  useEffect(() => {
    fetchHistoricalChart();
  }, [currency, days]);

  // Function to downsample the data
  const downsampleData = (data, sampleRate) => {
    return data.filter((_, index) => index % sampleRate === 0);
  };

  // Adjust the sample rate as needed
  const sampleRate = Math.ceil(historicalChart.length / 50); // Adjust the number of points

  const downsampledChart = downsampleData(historicalChart, sampleRate);

  const chartData = {
    labels: downsampledChart.map((coin) => {
      let date = new Date(coin[0]);
      let time =
        date.getHours() > 12
          ? `${date.getHours() - 12}:${date.getMinutes()} PM`
          : `${date.getHours()}:${date.getMinutes()} AM`;
      return days === 1 ? time : date.toLocaleDateString();
    }),
    datasets: [
      {
        label: "Price",
        data: downsampledChart.map((coin) => coin[1]),
        borderColor: "purple",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {!loading ? (
          historicalChart.length > 0 ? (
            <Line data={chartData} />
          ) : (
            <p>No data available</p>
          )
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
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;
