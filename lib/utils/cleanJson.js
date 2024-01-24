//This Utility function will delete key with null value from Json data

function removeNulls(obj) {
    for (let key in obj) {
      if (obj[key] === null) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        removeNulls(obj[key]);
      }
    }
}
  
export default removeNulls;
