const express = require("express");
const router = express.Router();
const School = require("../models/school");

router.get("/", async (req, res) => {
  const school = await School.findAll();
  res.json(school);
});

router.post("/", async (req, res) => {
  const school = await School.create(req.body);
  res.json(school);
});

module.exports = router;
