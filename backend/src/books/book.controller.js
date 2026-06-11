const Book = require("./book.model");
const Order = require("../orders/order.model");

const postABook = async (req, res) => {
    try {
        const newBook = await Book({ ...req.body });
        await newBook.save();
        res.status(200).send({ message: "Book posted successfully", book: newBook });
    } catch (error) {
        console.error("Error creating book", error);
        res.status(500).send({ message: "Failed to create book" });
    }
};

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });

        // Get purchase counts for all books
        const orders = await Order.find({}, 'productIds');
        const purchaseCounts = {};
        orders.forEach(order => {
            order.productIds.forEach(pid => {
                const key = pid.toString();
                purchaseCounts[key] = (purchaseCounts[key] || 0) + 1;
            });
        });

        const booksWithStats = books.map(book => {
            const b = book.toJSON();
            b.purchaseCount = purchaseCounts[book._id.toString()] || 0;
            return b;
        });

        res.status(200).send(booksWithStats);
    } catch (error) {
        console.error("Error fetching books", error);
        res.status(500).send({ message: "Failed to fetch books" });
    }
};

const getSingleBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) return res.status(404).send({ message: "Book not Found!" });

        // Get purchase count for this book
        const orders = await Order.find({ productIds: book._id });
        const b = book.toJSON();
        b.purchaseCount = orders.length;

        res.status(200).send(b);
    } catch (error) {
        console.error("Error fetching book", error);
        res.status(500).send({ message: "Failed to fetch book" });
    }
};

const UpdateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBook) return res.status(404).send({ message: "Book is not Found!" });
        res.status(200).send({ message: "Book updated successfully", book: updatedBook });
    } catch (error) {
        console.error("Error updating a book", error);
        res.status(500).send({ message: "Failed to update a book" });
    }
};

const deleteABook = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) return res.status(404).send({ message: "Book is not Found!" });
        res.status(200).send({ message: "Book deleted successfully", book: deletedBook });
    } catch (error) {
        console.error("Error deleting a book", error);
        res.status(500).send({ message: "Failed to delete a book" });
    }
};

// POST /api/books/:id/rate  — body: { userId, value }
const rateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, value } = req.body;

        if (!userId || !value || value < 1 || value > 5) {
            return res.status(400).send({ message: "Invalid rating data" });
        }

        const book = await Book.findById(id);
        if (!book) return res.status(404).send({ message: "Book not found" });

        const existingIndex = book.ratings.findIndex(r => r.userId === userId);
        if (existingIndex > -1) {
            book.ratings[existingIndex].value = value;
        } else {
            book.ratings.push({ userId, value });
        }

        await book.save();
        const b = book.toJSON();
        res.status(200).send({ message: "Rating saved", averageRating: b.averageRating, totalRatings: book.ratings.length });
    } catch (error) {
        console.error("Error rating book", error);
        res.status(500).send({ message: "Failed to rate book" });
    }
};

module.exports = { postABook, getAllBooks, getSingleBook, UpdateBook, deleteABook, rateBook };
