import { Link, useNavigate } from "react-router-dom";
import { HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi";
import avatarImg from "../assets/avatar.png"
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useFetchAllBooksQuery } from "../redux/features/books/booksApi";

const navigation = [
    { name: "Dashboard", href: "/user-dashboard" },
    { name: "Orders", href: "/orders" },
    { name: "Cart", href: "/cart" },
    { name: "Checkout", href: "/checkout" },
]

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const cartItems = useSelector(state => state.cart.cartItems);
    const { currentUser, logout } = useAuth();
    const { data: books = [] } = useFetchAllBooksQuery();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim().length > 1) {
            const results = books.filter(book =>
                book.title.toLowerCase().includes(value.toLowerCase()) ||
                (book.author && book.author.toLowerCase().includes(value.toLowerCase())) ||
                book.category.toLowerCase().includes(value.toLowerCase())
            );
            setSearchResults(results.slice(0, 5));
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    };

    const handleSelectResult = (bookId) => {
        setSearchTerm('');
        setShowResults(false);
        navigate(`/books/${bookId}`);
    };

    const handleLogOut = () => {
        logout();
        setIsDropdownOpen(false);
    };

    const token = localStorage.getItem('token');

    return (
        <header className="max-w-screen-2xl mx-auto px-4 py-6">
            <nav className="flex justify-between items-center">
                {/* Left side */}
                <div className="flex items-center md:gap-16 gap-4">
                    <Link to="/" className="text-xl font-bold text-secondary">Bookstore</Link>

                    {/* Search */}
                    <div className="relative sm:w-72 w-40">
                        <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            onBlur={() => setTimeout(() => setShowResults(false), 150)}
                            onFocus={() => searchTerm.length > 1 && setShowResults(true)}
                            placeholder="Search books, authors..."
                            className="bg-[#EAEAEA] w-full py-1 md:px-8 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {/* Search Results Dropdown */}
                        {showResults && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md z-50 mt-1 border border-gray-100">
                                {searchResults.map(book => (
                                    <button
                                        key={book._id}
                                        onMouseDown={() => handleSelectResult(book._id)}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex flex-col border-b last:border-0"
                                    >
                                        <span className="text-sm font-medium text-gray-800">{book.title}</span>
                                        {book.author && <span className="text-xs text-gray-400">{book.author} · {book.category}</span>}
                                    </button>
                                ))}
                            </div>
                        )}
                        {showResults && searchTerm.length > 1 && searchResults.length === 0 && (
                            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md z-50 mt-1 border border-gray-100 px-4 py-3 text-sm text-gray-400">
                                No books found for "{searchTerm}"
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side */}
                <div className="relative flex items-center md:space-x-3 space-x-2">
                    <div>
                        {currentUser ? (
                            <>
                                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    <img
                                        src={currentUser.photoURL || avatarImg}
                                        alt="avatar"
                                        className="size-7 rounded-full ring-2 ring-blue-500"
                                    />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40">
                                        <ul className="py-2">
                                            {navigation.map((item) => (
                                                <li key={item.name} onClick={() => setIsDropdownOpen(false)}>
                                                    <Link to={item.href} className="block px-4 py-2 text-sm hover:bg-gray-100">
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                            <li>
                                                <button onClick={handleLogOut} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500">
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : token ? (
                            <Link to="/dashboard" className="border-b-2 border-primary text-sm font-medium">Dashboard</Link>
                        ) : (
                            <Link to="/login"><HiOutlineUser className="size-6" /></Link>
                        )}
                    </div>

                    <button className="hidden sm:block">
                        <HiOutlineHeart className="size-6" />
                    </button>

                    <Link to="/cart" className="bg-primary p-1 sm:px-6 px-2 flex items-center rounded-sm">
                        <HiOutlineShoppingCart />
                        <span className="text-sm font-semibold sm:ml-1">
                            {cartItems.length > 0 ? cartItems.length : 0}
                        </span>
                    </Link>
                </div>
            </nav>
        </header>
    )
}

export default Navbar;
