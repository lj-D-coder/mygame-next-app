//delete object keys

const removeProperties = async (obj, propsToRemove) => {
    let newObj = { ...obj };
    propsToRemove.forEach(prop => {
      delete newObj[prop];
    });
    return newObj;
  }

  // useCase
  // let obj = data.toObject();
  //   dataToSave = await removeProperties(obj, ["_id", "__v"]);
  
export default removeProperties;