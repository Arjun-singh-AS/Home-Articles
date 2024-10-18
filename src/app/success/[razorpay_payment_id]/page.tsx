'use client';
import { useSearchParams } from 'next/navigation';
// import { CheckCircleIcon } from '@heroicons/react/solid';
import { AiOutlineCheckCircle } from 'react-icons/ai';


const SuccessPage = () => {
  const searchParams = useSearchParams();
  const razorpay_payment_id = searchParams.get('razorpay_payment_id');
    console.log(razorpay_payment_id)
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12">
      <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 w-full max-w-md text-center">
        <AiOutlineCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your payment ID is:
        </p>
        <div className="bg-gray-100 text-gray-800 p-4 rounded-lg mb-6">
          <span className="text-blackfont-mono text-sm">{razorpay_payment_id}</span>
        </div>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

export default SuccessPage;
