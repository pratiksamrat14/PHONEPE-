import sha256 from 'sha256';

export const generateMarchantTransactionId = () => {
  const prefix = 'MT'; // Transaction ID prefix
  const randomNum = Math.floor(Math.random() * 10000000000); // Generate a random 10-digit number
  const timestamp = Date.now(); // Get current timestamp

  const transactionId = `${prefix}${timestamp}${randomNum}`; // Combine prefix, timestamp, and random number

  return transactionId;
};

export const getPaymentDetails = (amount = 0, userMobileNumber) => {
  const transectionId = generateMarchantTransactionId();

  const normalPayLoad = {
    merchantId: "PGTESTPAYUAT",
    merchantTransactionId: transectionId,
    merchantUserId: "MUID123",
    amount: 100 * amount,
    redirectUrl: "http://localhost:3000/", // this url will redirect you back to the given web page
    redirectMode: 'REDIRECT',
    callbackUrl:"http://localhost:3000/pay-return-url/", // this is for server to server call back
    mobileNumber: userMobileNumber,
    paymentInstrument: {
      type: 'PAY_PAGE', //  => Possible values:  PAY_PAGE, CARD, UPI_INTENT, SAVED_CARD, TOKEN, UPI_COLLECT, UPI_QR, NET_BANKING
      // bankId: 'SBIN',
    },
  };

  const saltKey ="099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
  const saltIndex = 1;

  const jsonString = JSON.stringify(normalPayLoad);
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(jsonString);
  const binaryString = String.fromCharCode.apply(null, uint8Array);
  const base64String = btoa(binaryString);

  const string = base64String + '/pg/v1/pay' + saltKey;
  const sha256Val = sha256(string);
  const xVerify = sha256Val + '###' + saltIndex;

  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': xVerify,
      accept: 'application/json',
    },
    body: JSON.stringify({
      request: base64String,
    }),
  };
};