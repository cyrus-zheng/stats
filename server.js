const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images" });

mongoose
  .connect(
    "mongodb+srv://cyrus-zheng:aQ12be92@cluster0.0nbwbwy.mongodb.net/"
  )
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("Could not connect to mongodb...", err));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const userStatsSchema = new mongoose.Schema({
  name: String,
  age: Number,
  height: Number,
  weight: Number,
  preferredPosition: String,
  passingAccuracy: Number,
  dribbleSuccess: Number,
  shotConversionRate: Number,
  tackleSuccessRate: Number,
  minutesOnBall: Number,
  _id: Number,
});

const UserStats = mongoose.model("UserStats", userStatsSchema);

app.get("/api/user-stats", (req, res) => {
  getUserStats(res);
});

const getUserStats = async (res) => {
  const userStats = await UserStats.find();
  res.send(userStats);
};

app.post("/api/user-stats", upload.single("img"), async (req, res) => {
  console.log(req.body);
  const result = validateUserStats(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const userStats = await UserStats.find();
  let maxID = 0;

  for (let i = 0; i < userStats.length; i++) {
    if (userStats[i]._id > maxID) {
      maxID = userStats[i]._id;
    }
  }

  maxID++;

  const newUserStats = new UserStats({
    _id: maxID,
    name: req.body.name,
    age: req.body.age,
    height: req.body.height,
    weight: req.body.weight,
    preferredPosition: req.body.preferredPosition,
    passingAccuracy: req.body.passingAccuracy,
    dribbleSuccess: req.body.dribbleSuccess,
    shotConversionRate: req.body.shotConversionRate,
    tackleSuccessRate: req.body.tackleSuccessRate,
    minutesOnBall: req.body.minutesOnBall,
  });

  createUserStats(newUserStats, res);
});

const createUserStats = async (userStats, res) => {
  const result = await userStats.save();
  res.send(userStats);
};

app.put("/api/user-stats/:id", upload.single("img"), async (req, res) => {
  console.log(req.body);
  const result = validateUserStats(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  updateUserStats(req, res);
});

const updateUserStats = async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    age: req.body.age,
    height: req.body.height,
    weight: req.body.weight,
    preferredPosition: req.body.preferredPosition,
    passingAccuracy: req.body.passingAccuracy,
    dribbleSuccess: req.body.dribbleSuccess,
    shotConversionRate: req.body.shotConversionRate,
    tackleSuccessRate: req.body.tackleSuccessRate,
    minutesOnBall: req.body.minutesOnBall,
  };

  const result = await UserStats.updateOne({ _id: req.params.id }, fieldsToUpdate);
  const userStats = await UserStats.findById(req.params.id);
  res.send(userStats);
};

app.delete("/api/user-stats/:id", upload.single("img"), (req, res) => {
  console.log(req.body);
  removeUserStats(res, req.params.id);
});

const removeUserStats = async (res, id) => {
  const userStats = await UserStats.findByIdAndDelete(id);
  res.send(userStats);
};

const validateUserStats = (userStats) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    name: Joi.string().required(),
    age: Joi.number().integer().required(),
    height: Joi.number().required(),
    weight: Joi.number().required(),
    preferredPosition: Joi.string().required(),
    passingAccuracy: Joi.number().required(),
    dribbleSuccess: Joi.number().required(),
    shotConversionRate: Joi.number().required(),
    tackleSuccessRate: Joi.number().required(),
    minutesOnBall: Joi.number().required(),
  });

  return schema.validate(userStats);
};

app.listen(3000, () => {
  console.log("Running");
});
