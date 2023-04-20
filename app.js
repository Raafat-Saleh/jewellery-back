/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const HttpError = require("./models/http-error");

const usersRoutes = require("./routes/users-routes");
const productsRoutes = require("./routes/products-routes");
const tempProductsRoutes = require("./routes/temp-products-routes");
const commentsRoutes = require("./routes/comments-routes");
const optionRoutes = require("./routes/option-routes");
const binRoutes = require("./routes/bin-routes");
const draftRoutes = require("./routes/draft-routes");
const reportRoutes = require("./routes/report-routes");
const blogRoutes = require("./routes/blogs-routes");
const tempBlogsRoutes = require("./routes/temp-blogs-routes");

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/temp/products", tempProductsRoutes);
app.use("/api/option", optionRoutes);
app.use("/api/bin", binRoutes);
app.use("/api/draft", draftRoutes);
app.use("/api/report", reportRoutes);

app.use("/api/blogs", blogRoutes);
app.use("/api/temp/blogs", tempBlogsRoutes);
app.use("/api/comment", commentsRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect("mongodb://127.0.0.1:27017/db", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.listen(3000);
    console.log("app running at 3000");
  })
  .catch((err) => {
    console.log(err);
  });
