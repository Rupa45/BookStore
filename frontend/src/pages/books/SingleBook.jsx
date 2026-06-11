import React, { useState, useEffect } from 'react'
import { FiShoppingCart } from "react-icons/fi"
import { FaStar, FaRegStar, FaStarHalfAlt, FaUsers } from "react-icons/fa"
import { FiZap } from "react-icons/fi"
import { useParams } from "react-router-dom"
import { getImgUrl } from '../../utils/getImgUrl';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { useFetchAllBooksQuery, useFetchBookByIdQuery, useRateBookMutation } from '../../redux/features/books/booksApi';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

// Star Rating Display
const StarDisplay = ({ rating, size = 16 }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) stars.push(<FaStar key={i} size={size} className="text-yellow-400" />);
        else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} size={size} className="text-yellow-400" />);
        else stars.push(<FaRegStar key={i} size={size} className="text-yellow-400" />);
    }
    return <div className="flex">{stars}</div>;
};

// Interactive Star Rating Input
const StarInput = ({ value, onChange }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
            <button key={star} type="button" onClick={() => onChange(star)}>
                {star <= value
                    ? <FaStar size={24} className="text-yellow-400 hover:scale-110 transition-transform" />
                    : <FaRegStar size={24} className="text-gray-300 hover:text-yellow-300 transition-colors" />}
            </button>
        ))}
    </div>
);

const SingleBook = () => {
    const { id } = useParams();
    const { data: book, isLoading, isError, refetch } = useFetchBookByIdQuery(id);
    const { data: allBooks } = useFetchAllBooksQuery();
    const dispatch = useDispatch();
    const { currentUser } = useAuth();
    const [rateBook] = useRateBookMutation();

    const [userRating, setUserRating] = useState(0);
    const [ratingSubmitted, setRatingSubmitted] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecs, setLoadingRecs] = useState(false);

    const handleAddToCart = (product) => dispatch(addToCart(product));

    const handleRatingSubmit = async () => {
        if (!currentUser || userRating === 0) return;
        try {
            await rateBook({ id, userId: currentUser.uid, value: userRating }).unwrap();
            setRatingSubmitted(true);
            refetch();
        } catch (err) {
            console.error("Rating failed", err);
        }
    };

    // AI Recommendations
    useEffect(() => {
        if (!book || !allBooks || allBooks.length < 2) return;

        const fetchRecommendations = async () => {
            setLoadingRecs(true);
            try {
                const otherBooks = allBooks
                    .filter(b => b._id !== book._id)
                    .map(b => ({ id: b._id, title: b.title, author: b.author || '', category: b.category }));

                const response = await fetch("https://api.anthropic.com/v1/messages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: "claude-sonnet-4-20250514",
                        max_tokens: 500,
                        messages: [{
                            role: "user",
                            content: `A user is viewing the book: "${book.title}" by "${book.author || 'unknown'}" (${book.category}).
                            
From the following list of books in our store, pick the 3 most relevant recommendations for someone who likes this book.
Return ONLY a JSON array of book IDs, nothing else. Example: ["id1","id2","id3"]

Available books:
${JSON.stringify(otherBooks)}`
                        }]
                    })
                });
                const data = await response.json();
                const text = data.content?.[0]?.text?.trim() || '[]';
                const clean = text.replace(/```json|```/g, '').trim();
                const recommendedIds = JSON.parse(clean);
                const recommendedBooks = allBooks.filter(b => recommendedIds.includes(b._id));
                setRecommendations(recommendedBooks);
            } catch (err) {
                console.error("Recommendations failed", err);
            } finally {
                setLoadingRecs(false);
            }
        };

        fetchRecommendations();
    }, [book, allBooks]);

    if (isLoading) return <div className="flex justify-center py-20 text-gray-500">Loading...</div>;
    if (isError) return <div className="text-red-500 py-10 text-center">Error loading book info.</div>;

    const avgRating = book.averageRating || 0;
    const totalRatings = book.ratings?.length || 0;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Book Detail */}
            <div className="flex flex-col md:flex-row gap-10 mb-10">
                <div className="md:w-1/3 flex-shrink-0">
                    <img src={`${getImgUrl(book.coverImage)}`} alt={book.title} className="w-full rounded-lg shadow-md" />
                </div>

                <div className="md:w-2/3">
                    <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                    {book.author && <p className="text-gray-500 mb-3 text-lg">by {book.author}</p>}

                    {/* Rating Display */}
                    <div className="flex items-center gap-3 mb-4">
                        <StarDisplay rating={avgRating} />
                        <span className="text-gray-700 font-semibold">{avgRating > 0 ? avgRating.toFixed(1) : 'No ratings yet'}</span>
                        {totalRatings > 0 && <span className="text-gray-400 text-sm">({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})</span>}
                    </div>

                    {/* Purchase Count */}
                    {book.purchaseCount > 0 && (
                        <div className="flex items-center gap-2 mb-4 text-green-600">
                            <FaUsers />
                            <span className="text-sm font-medium">{book.purchaseCount} {book.purchaseCount === 1 ? 'person has' : 'people have'} bought this</span>
                        </div>
                    )}

                    <p className="text-gray-600 mb-2 capitalize"><strong>Category:</strong> {book?.category}</p>
                    <p className="text-gray-600 mb-4"><strong>Published:</strong> {new Date(book?.createdAt).toLocaleDateString()}</p>

                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl font-bold text-green-600">${book.newPrice}</span>
                        <span className="line-through text-gray-400">${book.oldPrice}</span>
                    </div>

                    <button onClick={() => handleAddToCart(book)} className="btn-primary px-6 py-2 flex items-center gap-2 rounded-md">
                        <FiShoppingCart />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>

            {/* Description */}
            {book.description && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Description</h2>
                    <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>
            )}

            {/* Summary */}
            {book.summary && (
                <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                        <FiZap className="text-purple-500" /> About This Book
                    </h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{book.summary}</p>
                </div>
            )}

            {/* Rate This Book */}
            {currentUser && (
                <div className="mb-10 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-3">Rate This Book</h2>
                    {ratingSubmitted ? (
                        <p className="text-green-600 font-medium">✅ Thanks for your rating!</p>
                    ) : (
                        <div className="flex items-center gap-4">
                            <StarInput value={userRating} onChange={setUserRating} />
                            <button
                                onClick={handleRatingSubmit}
                                disabled={userRating === 0}
                                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-5 py-2 rounded-md disabled:opacity-40 transition-all"
                            >
                                Submit Rating
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* AI Recommendations */}
            {(loadingRecs || recommendations.length > 0) && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FiZap className="text-purple-500" /> You Might Also Like
                    </h2>
                    {loadingRecs ? (
                        <p className="text-gray-400 text-sm">Finding recommendations...</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {recommendations.map(rec => (
                                <Link to={`/books/${rec._id}`} key={rec._id} className="border rounded-lg p-3 hover:shadow-md transition-shadow flex gap-3 items-center">
                                    <img src={`${getImgUrl(rec.coverImage)}`} alt={rec.title} className="w-12 h-16 object-cover rounded" />
                                    <div>
                                        <p className="font-semibold text-sm line-clamp-2">{rec.title}</p>
                                        {rec.author && <p className="text-gray-400 text-xs">{rec.author}</p>}
                                        <p className="text-green-600 text-sm font-medium mt-1">${rec.newPrice}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SingleBook;
