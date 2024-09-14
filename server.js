import express from "express";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import { Crypto } from "./models/crypto.model.js";

const app = express();
dotenv.config();
app.use(express.static(path.resolve("./Public")));
app.use(express.json());

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("error", error);
    });
  })
  .catch((error) => {
    console.log("connection failed", error);
  });

const fetchCryptos = async () => {
  try {
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers", {
      family: 4,
    });
    const data = response.data;
    //console.log(response.data);
    const dataMain = Object.keys(data)
      .slice(0, 10)
      .map((key) => {
        return {
          name: data[key].name,
          last: data[key].last,
          buy: data[key].buy,
          sell: data[key].sell,
          volume: data[key].volume,
          base_unit: data[key].base_unit,
        };
      });



    //console.log(dataMain);
    const cryptos = await Crypto.insertMany(dataMain);
  } catch (error) {
    console.error(error, "error fetching data");
  }
};
fetchCryptos();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
