import { useEffect } from 'react';
import { FaCheckCircle, FaArrowRight, FaListAlt } from 'react-icons/fa';
import { SiStripe } from 'react-icons/si';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../confiq/Axio';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../Redux/LoadingSlic';

export default function SuccessPayment() {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        const confirmPayment = async () => {
            try {
                dispatch(showLoading());
                const response = await axiosInstance.post('/user/payment/confirm', { sessionId });
                console.log('payment confirm', response);
            } catch (error) {
                console.log(error);
            } finally {
                dispatch(hideLoading());
            }
        }
        // confirmPayment();
        // window.history.replaceState(null, '', '/payment-success');
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-indigo-600 p-6 text-center">
                    <div className="flex justify-center items-center space-x-2">
                        <SiStripe className="h-8 w-8 text-white" />
                        <span className="text-xl font-bold text-white">Payment Complete</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="text-center">
                        {/* Success Icon */}
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <FaCheckCircle className="h-10 w-10 text-green-600" />
                        </div>

                        {/* Heading */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Payment Successful!
                        </h2>
                        
                        <p className="text-gray-600 mb-6">
                            Thank you for your purchase. Your order has been confirmed.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-3">
                            <Link 
                                to="/orders" 
                                className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                            >
                                <FaListAlt className="mr-2" />
                                View Orders
                            </Link>
                            
                            <Link 
                                to="/"
                                className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                            >
                                Continue Shopping
                                <FaArrowRight className="ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}