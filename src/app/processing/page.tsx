
export const dynamic = 'force-dynamic';
const ProcessingPage = () => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-gray-600">Verifying payment, please wait...</p>
      <div className="loader"></div> {/* Add a spinner here */}
    </div>
  );
  
  export default ProcessingPage;
  