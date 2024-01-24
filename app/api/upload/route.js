// import { NextApiRequest, NextApiResponse } from 'next';
// import cloudinary from 'cloudinary';

// // Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
// });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { method } = req;

//   switch (method) {
//     case 'POST':
//       try {
//         const fileStr = req.body.data;
//         const uploadedResponse = await cloudinary.v2.uploader.upload(fileStr, {
//           upload_preset: 'ml_default',
//           quality: 'auto:low',
//           fetch_format: 'auto',
//           width: 500, // adjust width to manage the file size
//           crop: 'scale',
//           format: 'webp'
//         });

//         if (!uploadedResponse) {
//           return res.status(500).json('Failed to Upload Image');
//         }

//         res.status(200).json({ imageUrl: uploadedResponse.secure_url });
//       } catch (error) {
//         res.status(500).json({ error: 'Something went wrong' });
//       }
//       break;
//     default:
//       res.status(400).json({ success: false });
//       break;
//   }
// }
