import CheckoutHeader from './CheckoutHeader';
import OrderSummary from './OrderSummary';
import PaymentOptions from './PaymentOptions';
import DeliveryDatePicker from './DeliveryDatePicker';
import BillingAddress from './BillingAddress';
import '../App.css';


const Payment = () => {

    const handlePlaceOrder = () => {
    alert('Order placed successfully! (This is a demo)');
  };

  return (
    <div className="App">
      <CheckoutHeader />
      
      <div className="checkout-container">
        <div className="checkout-main">
          <div className="checkout-form">
            <PaymentOptions />
            <DeliveryDatePicker />
            <BillingAddress />
          </div>
        </div>
        
        <div className="checkout-sidebar">
          <OrderSummary />
          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place your order
          </button>
          <div className="order-disclaimer">
            By placing your order, you agree to Amazon's 
            <a href="#"> privacy notice</a> and 
            <a href="#"> conditions of use</a>.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment