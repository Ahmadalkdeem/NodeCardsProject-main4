import cors from "cors";
import express from "express";
import morgan from "morgan";
import { connect } from "./db/connect.js";
import { notFound } from "./middleware/not-found.js";
import { FileRouter } from "./routes/File.js";
import { UpdatecardRouter } from "./routes/ubdate.js";
import { cartRouter } from "./routes/carts.js";
import { authRouter } from "./routes/users.js";
import { PerformenceRouter } from "./routes/Performence.js";
import { ordersTest } from "./middleware/testing/cronjob.js";
import { CardsRouter } from "./routes/cards.js";
import bodyParser from "body-parser";
import { fileTest } from "./middleware/testing/files.js";
import { emailRouter } from "./routes/email.js";
import { favoriteRouter } from "./routes/favoriteRouter.js";
import { userRouter } from "./routes/user.js";
const app = express();

ordersTest()
fileTest()
connect()
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.static('public'));
app.use("/cards", CardsRouter);
app.use("/favorite", favoriteRouter);
app.use("/users", userRouter);
app.use("/email", emailRouter);
app.use("/Performence", PerformenceRouter);
app.use("/carts", cartRouter);
app.use("/uplode", FileRouter);
app.use("/update", UpdatecardRouter);
app.use("/api/auth", authRouter);
app.use(notFound);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));