const express = require("express");
const router = express.Router();
const { createReview, deleteReview } = require('../controllers/reviewController')
router
.post("/", createReview).delete("/:reviewId", deleteReview);

module.exports = router;
