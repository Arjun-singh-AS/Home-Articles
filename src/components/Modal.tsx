import React from 'react';

type Review = {
  username: string;
  comment: string;
  rating: number;
};

type Size = {
  size: string;
  instock: boolean;
  price: number;  // Added price specific to size
  images: string[]; // Retained the images field in Size
};

type ColorVariant = {
  color: string;
  sizes: Size[];
};

type Product = {
  id: number;
  name: string;
  sellingPrice: number;  // The current selling price of the product
  markPrice: number;     // The original marked price of the product
  description: string;
  hproduct: boolean;     // Indicates if the product is a hot product
  ratings: number;       // Average rating as a number
  reviews: Review[];     // Array of reviews for the product
  colors: ColorVariant[]; // Array of color variants
  categories: string[];   // Array of categories for the product
  image: string;          // URL for the main product image
};


type ModalProps = {
  show: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart: (color: string, size: string, quantity: number, price: number) => void;
};

const Modal: React.FC<ModalProps> = ({ show, onClose, product, onAddToCart }) => {
  const [selectedColor, setSelectedColor] = React.useState('');
  const [selectedSize, setSelectedSize] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  const [price, setprice] = React.useState(1);

  if (!show) {
    return null;
  }

  const handleAddToCart = () => {
    if (selectedColor && selectedSize) {
      onAddToCart(selectedColor, selectedSize, quantity, price);
      onClose(); // Close modal after adding to cart
    } else {
      alert('Please select both color and size');
    }
  };
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number(e.target.value));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-dark text-black">
      <div className="bg-back p-6 rounded shadow-lg">
        <h3 className="text-lg font-bold mb-4">{product.name}</h3>

        {/* Select color */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Select Color:</label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="block w-full max-w-xs py-2 px-3 border border-gray-300 bg-gray-900 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
          >
            <option value="" disabled>Select a color</option>
            {product.colors.map((colorVariant) => (
              <option key={colorVariant.color} value={colorVariant.color}>
                {colorVariant.color}
              </option>
            ))}
          </select>
        </div>

        {/* Select size */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Select Size:</label>
          <select
            value={selectedSize}
            onChange={(e) => {
              const newSize = e.target.value;
              setSelectedSize(newSize);

              // Find the selected color variant
              const selectedColorVariant = product.colors.find((colorVariant) => colorVariant.color === selectedColor);

              // Find the size variant in the selected color
              const selectedSizeVariant = selectedColorVariant?.sizes.find((sizeOption) => sizeOption.size === newSize);

              // Update price based on the selected size
              if (selectedSizeVariant) {
                setprice(selectedSizeVariant.price);
              }
            }}
            className="block w-full max-w-xs py-2 px-3 border border-gray-300 bg-gray-900 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
            disabled={!selectedColor}
          >
            <option value="" disabled>Select a size</option>
            {selectedColor &&
              product.colors
                .find((colorVariant) => colorVariant.color === selectedColor)
                ?.sizes.map((sizeOption) => (
                  <option key={sizeOption.size} value={sizeOption.size}>
                    {sizeOption.size}
                  </option>
                ))}
          </select>
        </div>

        {/* Select quantity */}

        <div className="mb-2">
          <label htmlFor="quantity" className="block text-sm font-medium bg-dark text-dark mb-1">
            Quantity:
          </label>
          <select
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            className="block w-full max-w-xs py-2 px-3 border border-gray-300 bg-gray-900 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-blue-500 text-dark rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
