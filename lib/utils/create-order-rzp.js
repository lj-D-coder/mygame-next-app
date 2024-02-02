
const createOrder = async (data) => {
    const url = 'https://api.razorpay.com/v1/orders';
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from('rzp_test_P7zizep0w8PLAX:agc3vxqxs5EgJGuatB8o5BAm').toString('base64')
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  

export default createOrder;