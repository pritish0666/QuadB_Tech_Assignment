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

// const deleteAll = async()=>{
//   try {
//     await Crypto.deleteMany()

//   } catch (error) {
//     console.log(error)

//   }
// }
// deleteAll()

const fetchCryptos = async () => {
  try {
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers", {
      family: 4,
    });
    const data = response.data;

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

    for (let crypto of dataMain) {
      const existingCrypto = await Crypto.findOne({
        base_unit: crypto.base_unit,
      });

      if (!existingCrypto) {
        await Crypto.create(crypto);
      }
    }
  } catch (error) {
    console.error(error, "Error fetching or inserting cryptos");
  }
};

fetchCryptos();

app.get("/api/cryptos", async (req, res) => {
  try {
    const cryptos = await Crypto.find(); // Fetching data from MongoDB
    res.json(cryptos);
  } catch (error) {
    console.error("Error fetching cryptos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/contact/telegram", (req, res) => {
  return res.sendFile(path.resolve("./Public/telegram.html"));
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
