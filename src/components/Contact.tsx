// pages/contact.tsx
'use client';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // Flatten formData
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      console.log('Form submitted:', formData);
      setSubmitted(true);
      setError(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('There was an issue submitting the form. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black py-20">
      <h1 className="text-4xl font-bold mb-10 text-white mt-3">Contact Us</h1>
      <form
        className="bg-white shadow-lg rounded-lg px-10 pt-8 pb-10 mb-8 w-full max-w-2xl"
        onSubmit={handleSubmit}
      >
        {submitted ? (
          <p className="text-green-500 text-2xl">Thank you for your message!</p>
        ) : (
          <>
            {error && <p className="text-red-500 text-xl mb-4">{error}</p>}
            <div className="mb-6">
              <label className="block text-gray-700 text-lg font-bold mb-3" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 text-lg"
                placeholder="Your name"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-lg font-bold mb-3" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 text-lg"
                placeholder="Your email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-lg font-bold mb-3" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 text-lg"
                placeholder="Your phone number"
                required
              />
            </div>
            <div className="mb-8">
              <label className="block text-gray-700 text-lg font-bold mb-3" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded-lg w-full py-4 px-4 text-gray-700 text-lg"
                placeholder="Your message"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 text-lg rounded-lg"
                type="submit"
              >
                Send
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
