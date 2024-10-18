'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useEdgeStore } from '@/lib/edgestore';

interface Review {
    username: string;
    comment: string;
    rating: number; // Changed to number
}

interface Size {
    size: string;
    instock: boolean;
    images: string[]; // URLs of the images corresponding to this size
}

interface ColorVariant {
    color: string;
    sizes: Size[];
}

interface Product {
    id: string;
    name: string;
    sellingPrice: string;
    markPrice: string;
    description: string;
    hproduct: boolean;
    ratings: string;
    reviews: Review[];
    colors: ColorVariant[];
    categories: string[];
    image: string; // Main product image
}

const UploadProduct: React.FC = () => {
    const [product, setProduct] = useState<Product>({
        id: '',
        name: '',
        sellingPrice: '',
        markPrice: '',
        description: '',
        hproduct: false,
        ratings: '',
        reviews: [],
        colors: [],
        categories: [''],
        image: '',
    });

    const { edgestore } = useEdgeStore();
    const [file, setFile] = useState<File | null>(null); // For main product image
    const [colorFiles, setColorFiles] = useState<{ [colorIndex: number]: { [sizeIndex: number]: File[] } }>({}); // For color/size images

    // Handle input field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    // Handle number of colors input
    const handleChangenC = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        const newColors = Array.from({ length: value }, () => ({ color: '', sizes: [] }));
        setProduct((prev) => ({ ...prev, colors: newColors }));
    };

    const handleChangenR = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        const newReviews = Array.from({ length: value }, () => ({ username: '', comment: '', rating: 0 }));
        setProduct((prev) => ({ ...prev, reviews: newReviews }));
    };

    // Handle number of sizes input for each color
    const handleSizeCountChange = (e: React.ChangeEvent<HTMLInputElement>, colorIndex: number) => {
        const value = parseInt(e.target.value, 10);
        setProduct((prev) => {
            const newColors = [...prev.colors];
            newColors[colorIndex].sizes = Array.from(
                { length: value },
                (v, i) => newColors[colorIndex].sizes[i] || { size: '', instock: true, images: [] }
            );
            return { ...prev, colors: newColors };
        });
    };

    // Handle array field changes (e.g., colors, sizes)
    const handleArrayChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number,
        type: 'reviews' | 'colors',
        fieldName: string,
        subIndex?: number,
        sizeFieldName?: string
    ) => {
        const { value } = e.target;

        setProduct((prev) => {
            const newArray = [...prev[type]];
            if (type === 'colors' && sizeFieldName && subIndex !== undefined) {
                // Change within color -> size field
                const newSizes = [...(newArray[index] as ColorVariant).sizes];
                newSizes[subIndex] = { ...newSizes[subIndex], [sizeFieldName]: value };
                (newArray[index] as ColorVariant).sizes = newSizes;
            } else {
                newArray[index] = { ...newArray[index], [fieldName]: value };
            }
            return { ...prev, [type]: newArray };
        });
    };

    // Handle instock checkbox toggle for each size
    const handleInstockChange = (colorIndex: number, sizeIndex: number) => {
        setProduct((prev) => {
            const newColors = [...prev.colors];
            newColors[colorIndex].sizes[sizeIndex].instock = !newColors[colorIndex].sizes[sizeIndex].instock;
            return { ...prev, colors: newColors };
        });
    };

    // Handle file upload for color and size images
    const handleColorFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        colorIndex: number,
        sizeIndex: number
    ) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            setColorFiles((prev) => ({
                ...prev,
                [colorIndex]: {
                    ...prev[colorIndex],
                    [sizeIndex]: filesArray,
                },
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Step 1: Upload the main image if selected
            let imageUrl = '';
            if (file) {
                const res = await edgestore.myPublicImages.upload({ file });
                imageUrl = res.url;
            }

            // Step 2: Upload color/size variant images
            const updatedColors = await Promise.all(
                product.colors.map(async (color, colorIndex) => {
                    const updatedSizes = await Promise.all(
                        color.sizes.map(async (size, sizeIndex) => {
                            if (colorFiles[colorIndex] && colorFiles[colorIndex][sizeIndex]) {
                                const uploadedImages = await Promise.all(
                                    colorFiles[colorIndex][sizeIndex].map(async (file) => {
                                        const res = await edgestore.myPublicImages.upload({ file });
                                        return res.url;
                                    })
                                );
                                return { ...size, images: uploadedImages };
                            }
                            return size;
                        })
                    );
                    return { ...color, sizes: updatedSizes };
                })
            );

            // Step 3: Submit the product data with updated color and size images
            const finalProduct = { ...product, image: imageUrl, colors: updatedColors };
            const response = await axios.post('/api/products', finalProduct);
            console.log('Product uploaded:', response.data);
        } catch (error) {
            console.error('Error uploading product:', error);
        }
    };

    // Handle number of categories input
    const handleCategoryCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        const newCategories = Array.from({ length: value }, () => '');
        setProduct((prev) => ({ ...prev, categories: newCategories }));
    };

    // Handle category input field changes
    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        setProduct((prev) => {
            const newCategories = [...prev.categories];
            newCategories[index] = value;
            return { ...prev, categories: newCategories };
        });
    };

    return (
        <div className="container mx-auto p-6 my-20">
            <h1 className="text-2xl font-bold mb-4 text-center">Upload Product</h1>
            <form onSubmit={handleSubmit} className="bg-gray shadow-md rounded-lg p-8">
                <div className="grid grid-cols-1 gap-4 text-black">
                    {/* Product details */}
                    <input
                        type="text"
                        name="id"
                        placeholder="Product ID"
                        value={product.id}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 p-2 rounded"
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={product.name}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 p-2 rounded"
                    />
                    <input
                        type="number"
                        name="sellingPrice"
                        placeholder="Selling Price"
                        value={product.sellingPrice}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 p-2 rounded"
                    />
                    <input
                        type="number"
                        name="markPrice"
                        placeholder="Market Price"
                        value={product.markPrice}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 p-2 rounded"
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={product.description}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 p-2 rounded h-24"
                    />

                    {/* Main Image Upload */}
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="text-white"
                    />

                    {/* Total Colors */}
                    <input
                        type="number"
                        name="noColor"
                        placeholder="Tell total number of colors"
                        onChange={handleChangenC}
                        required
                        className="border border-gray-300 p-2 rounded"
                    />

                    {/* Colors Input */}
                    {product.colors.map((color, colorIndex) => (
                        <div key={colorIndex} className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Color Name"
                                value={color.color}
                                onChange={(e) => handleArrayChange(e, colorIndex, 'colors', 'color')}
                                required
                                className="border border-gray-300 p-2 rounded"
                            />

                            {/* Size Count for Color */}
                            <input
                                type="number"
                                placeholder="Number of Sizes"
                                onChange={(e) => handleSizeCountChange(e, colorIndex)}
                                className="border border-gray-300 p-2 rounded"
                            />

                            {/* Sizes Input */}
                            {color.sizes.map((size, sizeIndex) => (
                                <div key={sizeIndex} className="flex flex-col">
                                    <input
                                        type="text"
                                        placeholder="Size Name"
                                        value={size.size}
                                        onChange={(e) => handleArrayChange(e, colorIndex, 'colors', 'sizes', sizeIndex, 'size')}
                                        className="border border-gray-300 p-2 rounded"
                                    />
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={size.instock}
                                            onChange={() => handleInstockChange(colorIndex, sizeIndex)}
                                        />
                                        In Stock
                                    </label>

                                    {/* File upload for size images */}
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => handleColorFileChange(e, colorIndex, sizeIndex)}
                                        className="text-white"
                                    />
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* Total Reviews */}
                    <input
                        type="number"
                        name="noReview"
                        placeholder="Tell total number of reviews"
                        onChange={handleChangenR}
                        required
                        className="border border-gray-300 p-2 rounded"
                    />

                    {/* Reviews Input */}
                    {product.reviews.map((review, reviewIndex) => (
                        <div key={reviewIndex} className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Reviewer Username"
                                value={review.username}
                                onChange={(e) => handleArrayChange(e, reviewIndex, 'reviews', 'username')}
                                required
                                className="border border-gray-300 p-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Review Comment"
                                value={review.comment}
                                onChange={(e) => handleArrayChange(e, reviewIndex, 'reviews', 'comment')}
                                required
                                className="border border-gray-300 p-2 rounded"
                            />
                            <input
                                type="number"
                                placeholder="Rating (0-5)"
                                value={review.rating}
                                onChange={(e) => handleArrayChange(e, reviewIndex, 'reviews', 'rating')}
                                min="0"
                                max="5"
                                required
                                className="border border-gray-300 p-2 rounded"
                            />
                        </div>
                    ))}

                    {/* Total Categories */}
                    <input
                        type="number"
                        name="noCategory"
                        placeholder="Tell total number of categories"
                        onChange={handleCategoryCountChange}
                        required
                        className="border border-gray-300 p-2 rounded"
                    />

                    {/* Categories Input */}
                    {product.categories.map((category, index) => (
                        <div key={index} className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Category Name"
                                value={category}
                                onChange={(e) => handleCategoryChange(e, index)}
                                required
                                className="border border-gray-300 p-2 rounded"
                            />
                        </div>
                    ))}
                </div>

                <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
                    Upload Product
                </button>
            </form>
        </div>
    );
};

export default UploadProduct;
