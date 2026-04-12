const { tool } = require("@langchain/core/tools");
const axios = require("axios");
const { z } = require("zod");

// -------------------- SEARCH PRODUCT --------------------
const searchProduct = tool(
  async ({ query, token }) => {
    try {
      console.log("searchProduct token:", token);
      console.log("search query:", query);

      const response = await axios.get(
        `http://localhost:3001/api/products?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Search API response:", response.data);

      return JSON.stringify(response.data);
    } catch (error) {
      console.error(
        "searchProduct error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to fetch products");
    }
  },
  {
    name: "searchProduct",
    description:
      "Use this tool whenever the user wants to find, search, browse, or check availability of products.",
    schema: z.object({
      query: z.string().describe("The product search query"),
    }),
  }
);

// -------------------- ADD TO CART --------------------
const addProductToCart = tool(
  async ({ productId, quantity = 1, token }) => {
    try {
      console.log("addProductToCart token:", token);
      console.log("Adding product:", { productId, quantity });

      // manual validation (since we removed strict zod rules)
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Quantity must be a positive integer");
      }

      const response = await axios.post(
        `http://localhost:3002/api/cart/items`,
        {
          productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Cart API response:", response.data);

      return JSON.stringify(response.data);
    } catch (error) {
      console.error(
        "addProductToCart error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to add product to cart");
    }
  },
  {
    name: "addProductToCart",
    description:
      "Use this tool whenever the user wants to add a product to their cart after selecting a valid product.",
    schema: z.object({
      productId: z.string().describe("The ID of the product to add"),
      quantity: z.number().optional().default(1).describe("Quantity to add"),
    }),
  }
);

module.exports = {
  searchProduct,
  addProductToCart,
};