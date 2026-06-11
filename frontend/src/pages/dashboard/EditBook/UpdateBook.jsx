import React, { useEffect, useState } from 'react'
import InputField from '../addBook/InputField'
import SelectField from '../addBook/SelectField'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useFetchBookByIdQuery, useUpdateBookMutation } from '../../../redux/features/books/booksApi';
import Loading from '../../../components/Loading';
import Swal from 'sweetalert2';
import { FiZap } from 'react-icons/fi';

const UpdateBook = () => {
    const { id } = useParams();
    const { data: bookData, isLoading, isError, refetch } = useFetchBookByIdQuery(id);
    const [updateBook] = useUpdateBookMutation();
    const { register, handleSubmit, setValue, watch } = useForm();
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (bookData) {
            setValue('title', bookData.title);
            setValue('author', bookData.author || '');
            setValue('description', bookData.description);
            setValue('summary', bookData.summary || '');
            setValue('category', bookData?.category);
            setValue('trending', bookData.trending);
            setValue('oldPrice', bookData.oldPrice);
            setValue('newPrice', bookData.newPrice);
            setValue('coverImage', bookData.coverImage);
        }
    }, [bookData, setValue]);

    const generateSummary = async () => {
        const title = watch('title');
        const author = watch('author');
        const category = watch('category');

        if (!title) {
            Swal.fire('Missing Info', 'Please ensure the title is filled.', 'warning');
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    messages: [{
                        role: "user",
                        content: `Write a compelling 3-4 paragraph summary for the book titled "${title}"${author ? ` by ${author}` : ''}${category ? ` (genre: ${category})` : ''}. 
                        Cover what the book is about, the main themes, and why readers would enjoy it. 
                        Write it in an engaging way that would help a potential buyer decide to purchase.
                        Do not include any preamble — just the summary paragraphs directly.`
                    }]
                })
            });
            const data = await response.json();
            const summary = data.content?.[0]?.text || '';
            setValue('summary', summary);
        } catch (err) {
            Swal.fire('Error', 'Failed to generate summary.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const onSubmit = async (data) => {
        const updateBookData = {
            title: data.title,
            author: data.author,
            description: data.description,
            summary: data.summary,
            category: data.category,
            trending: data.trending,
            oldPrice: Number(data.oldPrice),
            newPrice: Number(data.newPrice),
            coverImage: data.coverImage || bookData.coverImage,
        };
        try {
            await updateBook({ id, ...updateBookData }).unwrap();
            Swal.fire({ title: "Book Updated!", text: "Your book has been updated successfully!", icon: "success", confirmButtonColor: "#3085d6" });
            await refetch();
        } catch (error) {
            alert("Failed to update book.");
        }
    };

    if (isLoading) return <Loading />;
    if (isError) return <div>Error fetching book data</div>;

    return (
        <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Book</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputField label="Title" name="title" placeholder="Enter book title" register={register} />
                <InputField label="Author" name="author" placeholder="Enter author name" register={register} />
                <InputField label="Description" name="description" placeholder="Short description" type="textarea" register={register} />

                {/* Summary with AI Generate */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-semibold text-gray-700">Summary</label>
                        <button
                            type="button"
                            onClick={generateSummary}
                            disabled={isGenerating}
                            className="flex items-center gap-1 text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full transition-all disabled:opacity-60"
                        >
                            <FiZap size={12} />
                            {isGenerating ? 'Generating...' : 'Generate with AI'}
                        </button>
                    </div>
                    <textarea
                        {...register('summary')}
                        placeholder="Write a detailed summary or click 'Generate with AI'"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        rows={5}
                    />
                </div>

                <SelectField
                    label="Category"
                    name="category"
                    options={[
                        { value: '', label: 'Choose A Category' },
                        { value: 'business', label: 'Business' },
                        { value: 'technology', label: 'Technology' },
                        { value: 'fiction', label: 'Fiction' },
                        { value: 'horror', label: 'Horror' },
                        { value: 'adventure', label: 'Adventure' },
                    ]}
                    register={register}
                />

                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input type="checkbox" {...register('trending')} className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500" />
                        <span className="ml-2 text-sm font-semibold text-gray-700">Trending</span>
                    </label>
                </div>

                <InputField label="Old Price" name="oldPrice" type="number" placeholder="Old Price" register={register} />
                <InputField label="New Price" name="newPrice" type="number" placeholder="New Price" register={register} />
                <InputField label="Cover Image URL" name="coverImage" type="text" placeholder="Cover Image URL" register={register} />

                <button type="submit" className="w-full py-2 bg-blue-500 text-white font-bold rounded-md">Update Book</button>
            </form>
        </div>
    );
};

export default UpdateBook;
