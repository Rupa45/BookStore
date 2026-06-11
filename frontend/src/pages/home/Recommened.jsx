import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import BookCard from '../books/BookCard';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

const Recommended = () => {
    const { data: books = [], isLoading } = useFetchAllBooksQuery();

    // Show books that are not trending (or just last half of catalogue)
    const recommendedBooks = books.length > 0
        ? books.filter(book => !book.trending).slice(0, 10)
        : [];

    // Fallback: if all books are trending, just show last 8
    const displayBooks = recommendedBooks.length > 0 ? recommendedBooks : books.slice(-8);

    return (
        <div className='py-16'>
            <h2 className='text-3xl font-semibold mb-6'>Recommended for You</h2>

            {isLoading && <p className="text-gray-400">Loading recommendations...</p>}

            {!isLoading && displayBooks.length === 0 && (
                <p className="text-gray-400">No recommendations available yet. Add some books to get started!</p>
            )}

            {!isLoading && displayBooks.length > 0 && (
                <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    navigation={true}
                    breakpoints={{
                        640: { slidesPerView: 1, spaceBetween: 20 },
                        768: { slidesPerView: 2, spaceBetween: 40 },
                        1024: { slidesPerView: 2, spaceBetween: 50 },
                        1180: { slidesPerView: 3, spaceBetween: 50 },
                    }}
                    modules={[Pagination, Navigation]}
                    className="mySwiper"
                >
                    {displayBooks.map((book, index) => (
                        <SwiperSlide key={index}>
                            <BookCard book={book} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    )
}

export default Recommended;
