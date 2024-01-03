// import logo from './logo.svg';
import './App.css';
import { getPaymentDetails } from './payment';

function App() {
  const callback = () => {
    
  }
  const onClick = async () => {
    const details = getPaymentDetails(100, "7598967900");
    try {
      const res = await fetch('https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay', {
        ...details,
      });

      if (!res.ok) {
        throw new Error('Network issue');
      }

      const response = await res.json();
      if (response?.code === 'PAYMENT_INITIATED') {
       
        // console.log('response=', response);
        window.PhonePeCheckout.transact({
          tokenUrl: response?.data?.instrumentResponse.redirectInfo.url,
          callback,
          type: 'IFRAME',
        });
        //  / window.location.href = response?.data?.instrumentResponse.redirectInfo.url;
      } else {
        throw new Error('Something went wrong');
      }
    } catch (error) {
      console.log("somethign went wrong")
    }
  }
  return (
    <div className="App">
       <button onClick={onClick}>
      pay 100 
    </button>
    </div>
  );
}

export default App;
