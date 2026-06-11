const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    value: { type: Number, required: true, min: 1, max: 5 }
}, { _id: false });

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, default: '' },
    description: { type: String, required: true },
    summary: { type: String, default: '' },
    category: { type: String, required: true },
    trending: { type: Boolean, required: true },
    coverImage: { type: String, required: true },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    ratings: { type: [ratingSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Virtual: average rating
bookSchema.virtual('averageRating').get(function () {
    if (!this.ratings.length) return 0;
    const sum = this.ratings.reduce((acc, r) => acc + r.value, 0);
    return Math.round((sum / this.ratings.length) * 10) / 10;
});

bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
