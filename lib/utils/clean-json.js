//This Utility function will delete key with null value from Json data

export const removeNulls = (obj) => {
  for (let key in obj) {
    if (obj[key] === null) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      removeNulls(obj[key]);
    }
  }
  return obj; // return the modified object
}
  
export default removeNulls;



// Need to check the code for file upload
// export const UploadImage = async(file, folder) => {
//   const buffer = await file.arrayBuffer();
//   const bytes = Buffer.from(buffer);
//   return new Promise(async (resolve, reject) => {
//       await cloudinary.uploader
//           .upload_stream(
//               {
//                   resource_type: "auto",
//                   folder: folder,
//               },
//               async (err, result) => {
//                   if (err) {
//                       reject(err.message);
//                   }
//                   resolve(result);
//               }
//           )
//           .end(bytes);
//   });
// }

//const byteArrayBuffer = fs.readFileSync('shirt.jpg');
