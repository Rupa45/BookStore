import React from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { getImgUrl } from '../../utils/getImgUrl'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlice'

const StarDisplay = ({ rating }) => (
    <div className="flex">
        {[1, 2, 3, 4, 5].map(i =>
            i <= Math.round(rating)
                ? <FaStar key={i} size={12} className="text-yellow-400" />
                : <FaRegStar key={i} size={12} className="text-yellow-300" />
        )}
    </div>
);

const BookCard = ({ book }) => {
    const dispatch = useDispatch();
    const handleAddToCart = (product) => dispatch(addToCart(product));
    const avgRating = book.averageRating || 0;
    const totalRatings = book.ratings?.length || 0;
    const imgUrl = getImgUrl(book?.coverImage);

    return (
        <div className="rounded-lg transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:h-72 sm:justify-center gap-4">
                <div className="sm:h-72 sm:flex-shrink-0 border rounded-md overflow-hidden">
                    <Link to={`/books/${book._id}`}>
                        {imgUrl ? (
                            <img
                                src={imgUrl}
                                alt={book.title}
                                className="w-full h-full object-cover p-2 rounded-md cursor-pointer hover:scale-105 transition-all duration-200"
                                onError={(e) => { e.target.onerror = null; e.target.src = ''; e.target.style.display='none'; }}
                            />
                        ) : (
                            <div className="w-32 h-44 bg-gray-100 flex items-center justify-center rounded-md text-gray-400 text-xs text-center p-2">
                                No Image
                            </div>
                        )}
                    </Link>
                </div>

                <div>
                    <Link to={`/books/${book._id}`}>
                        <h3 className="text-xl font-semibold hover:text-blue-600 mb-1">{book?.title}</h3>
                    </Link>
                    {book.author && <p className="text-gray-400 text-sm mb-2">by {book.author}</p>}

                    <div className="flex items-center gap-2 mb-2">
                        <StarDisplay rating={avgRating} />
                        {totalRatings > 0
                            ? <span className="text-xs text-gray-500">{avgRating.toFixed(1)} ({totalRatings})</span>
                            : <span className="text-xs text-gray-400">No ratings yet</span>
                        }
                    </div>

                    {book.purchaseCount > 0 && (
                        <p className="text-xs text-green-600 mb-2">{book.purchaseCount} sold</p>
                    )}

                    <p className="text-gray-600 mb-3 text-sm">
                        {book?.description?.length > 80 ? `${book.description.slice(0, 80)}...` : book?.description}
                    </p>

                    <p className="font-medium mb-4">
                        ${book?.newPrice} <span className="line-through font-normal ml-2 text-gray-400">${book?.oldPrice}</span>
                    </p>

                    <button onClick={() => handleAddToCart(book)} className="btn-primary px-6 space-x-1 flex items-center gap-1">
                        <FiShoppingCart />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
