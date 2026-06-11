const express = require('express');
const { postABook, getAllBooks, getSingleBook, UpdateBook, deleteABook, rateBook } = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const router = express.Router();

router.post("/create-book", verifyAdminToken, postABook);
router.get("/", getAllBooks);
router.get("/:id", getSingleBook);
router.put("/edit/:id", verifyAdminToken, UpdateBook);
router.delete("/:id", verifyAdminToken, deleteABook);
router.post("/:id/rate", rateBook); // any logged-in user

module.exports = router;
