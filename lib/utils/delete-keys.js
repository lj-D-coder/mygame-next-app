//delete object keys

const removeProperties = async (obj, propsToRemove) => {
    let newObj = { ...obj };
    propsToRemove.forEach(prop => {
      delete newObj[prop];
    });
    return newObj;
  }

  
export default removeProperties;