const ImageKit = require("imagekit");
const { v4: uuidv4 } = require("uuid");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Upload Image
async function uploadImage({ buffer, filename, folder = "/products" }) {
  try {
    const res = await imagekit.upload({
      file: buffer.toString("base64"), // convert buffer → base64  ,,,ImageKit needs image in base64 format
      fileName: filename,
      folder
    });

    return {
      url: res.url,
      thumbnail: res.thumbnailUrl || res.url,
      id: res.fileId
    };
  } catch (error) {
    console.error("Image upload error:", error.message);
    throw new Error("Image upload failed");
  }
}

module.exports = { imagekit, uploadImage };