import { useEffect, useState } from "react";
import {
  FiPackage,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiTruck,
  FiClock,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import axiosInstance from "../confiq/Axio";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../Redux/LoadingSlic";
import Layout from "../component/Layout";
import AddReview from "../component/AddReview";
import toast from "react-hot-toast";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [userReviews, setUserReviews] = useState([]);
  const [review, setReview] = useState(false);
  const [productName, setProductName] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchOrders = async () => {
      try {
        dispatch(showLoading());
        const response = await axiosInstance.get(`/user/orders/${activeTab}`);
        console.log("order",response)
        setOrders(response.data.orders);
        setFilteredOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        dispatch(hideLoading());
      }
    };
    fetchOrders();
  }, [activeTab]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      fetchReviews();
      filterOrders(activeTab);
    }
  }, [orders, activeTab]);

  const filterOrders = (status) => {
    if (status === "all") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.map(order => ({
        ...order,
        items: order.items.map(item => ({
          ...item,
          products: item.products.filter(product => product.status.toLowerCase() === status.toLowerCase())
        })).filter(item => item.products.length > 0)
      })).filter(order => order.items.length > 0);
      setFilteredOrders(filtered);
    }
  };

  const fetchReviews = async () => {
    const filters = orders?.flatMap((order) =>
      order.items.flatMap((items) =>
        items.products.map((item) => ({
          productId: item.productId._id,
          orderId: order._id
        }))
      )
    );
    console.log("filter=",filters)

    try {
      const queryString = encodeURIComponent(JSON.stringify(filters));
      const url = `/user/getreviews?filters=${queryString}`;
      const res = await axiosInstance.get(url);
      setUserReviews(res.data.reviewedMap);
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  };

  const hasUserReviewed = (productId, orderId) => {
    if (review.length === 0) {
      return null;
    }
    return userReviews?.some(
      review => review.productId === productId && review.orderId === orderId
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancel = () => {
    setReview(false);
  };
  function getDateOnly(isoString) {
  const date = new Date(isoString);
  // console.log(date)
  return date.toISOString().split("T")[0]; // Returns "2025-07-27"
}

  return (
    <div className="min-h-screen flex felx-col overflow-x-hidden ">
      <Layout>
        {review ? (
          <div className="w-full h-full flex justify-center">
            <AddReview
              product={productName}
              onCancel={handleCancel}
              onSubmit={() => {
                fetchReviews(), setReview(false);
              }}
            />
          </div>
        ) : (
          <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                <p className="mt-1 text-sm text-gray-500">
                  View your order history and track shipments
                </p>
                
                {/* Status Navigation Tabs */}
                <div className="mt-6 border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "all"
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      All Orders
                    </button>
                    <button
                      onClick={() => setActiveTab("pending")}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "pending"
                          ? "border-yellow-500 text-yellow-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => setActiveTab("shipped")}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "shipped"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      shipped
                    </button>
                    <button
                      onClick={() => setActiveTab("delivered")}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "delivered"
                          ? "border-green-500 text-green-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Delivered
                    </button>
                    <button
                      onClick={() => setActiveTab("cancelled")}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "cancelled"
                          ? "border-red-500 text-red-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Cancelled
                    </button>
                  </nav>
                </div>
              </div>

              {filteredOrders?.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No {activeTab === "all" ? "" : activeTab} orders found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {activeTab === "all" 
                      ? "You haven't placed any orders with us yet."
                      : `You don't have any ${activeTab} orders.`}
                  </p>
                  {activeTab !== "all" && (
                    <button
                      onClick={() => setActiveTab("all")}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      View All Orders
                    </button>
                  )}
                  {activeTab === "all" && (
                    <div className="mt-6">
                      <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders?.flatMap((order) =>
                    order.items.flatMap((val) =>
                      val.products.map((item) => (
                        <div key={`${order._id}-${item._id}`} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                          {/* Status and Delete Button Row */}
                          <div className="flex justify-between items-start mb-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status || 'shipped'}
                            </span>
                          </div>

                          {/* Product Info */}
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center  gap-4 flex-1">
                              <img
                                src={item.productId?.images?.[0]}
                                alt={item.productId?.name}
                                className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                              />
                              <div>
                                <h3 className="text-md font-medium text-gray-800">{item.productId?.name}</h3>
                                <div className="flex gap-4 mt-1">
                                  <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                  <span className="text-sm font-medium text-gray-700">
                                    ₹{item.productId.discountprice}
                                  </span>
                                  
                                  
                                </div>
                                 {(item.status === 'delivered' || item.status === 'shipped') && (
  <p className={`mt-5  ${item.status === 'shipped' ? 'font-medium text-md text-gray-700' : 'text-sm text-gray-400'}`}>
    {item.status === 'shipped' ? 'The estimated delivery is expected on ' : 'Delivered on '}
    <span>{getDateOnly(item.deliveryDate) ||' 17/05/2025' }</span>
  </p>
)}


                              </div>
                              
                            </div>
                           
                            {/* Price and Actions */}
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="text-lg font-semibold text-gray-900">
                                  ₹{(item.price).toFixed(2)}
                                </p>
                              </div>
                              
                              {(userReviews.length === 0 || !hasUserReviewed(item.productId._id, order._id) && item.status.toLowerCase() !== 'cancelled') && (
                                <button
                                  onClick={() => {  
                                    setReview(true);
                                    setProductName({ ...productName, product: item, orderId: order._id });
                                  }}
                                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
                                >
                                  Review
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Order Meta */}
                          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              Order #{order._id.slice(-6)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Layout>
    </div>
  );
};

export default Order;