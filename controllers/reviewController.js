const Review = require("../models/ReviewModel");

const createReview = async (req, res) => {
  try {
    const { name, content, rating, image } = req.body;
    const review = await Review.create({ name, content, rating, image });
    res.status(200).json({
      status: "successful",
      message: "review created successfully",
      review,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ status: "error", message: "no review found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

module.exports = {
  createReview,
  deleteReview
};
