import { db } from "./data.js";
import lodash from "lodash";
import { v4 as uuid } from "uuid";

export const resolvers = {
  Query: {
    product: (_parent, { id }, context) => {
      return db.products.find((product) => product.id === id);
    },
    products: (_parent, { filter }) => {
      let filteredProducts = db.products;
      if (filter) {
        if (filter.onSale) {
          filteredProducts = filteredProducts.filter(
            (product) => product.onSale
          );
        }
      }
      return filteredProducts;
    },
    categories: () => db.categories,
    category: (_parent, { id }) => {
      return categories.find((category) => category.id === id);
    },
  },
  Category: {
    products: (parent, { filter }) => {
      let filteredProducts = db.products.filter(
        (product) => product.categoryId === parent.id
      );
      if (filter) {
        if (filter.onSale) {
          filteredProducts = filteredProducts.filter(
            (product) => product.onSale
          );
        }
      }
      return filteredProducts;
    },
  },
  Product: {
    category: (parent) => {
      return db.categories.find(
        (category) => category.id === parent.categoryId
      );
    },
    reviews: (parent) => {
      return db.reviews.filter((review) => review.productId === parent.id);
    },
  },
  Mutation: {
    addCategory: (_parent, { input: { name } }) => {
      const newCategory = {
        id: uuid(),
        name,
      };
      db.categories.push(newCategory);
      return newCategory;
    },
    addProduct: (_parent, { input }) => {
      const newProduct = {
        ...input,
        id: uuid(),
      };
      db.products.push(newProduct);
      return newProduct;
    },
    addReview: (_parent, { input }) => {
      const newReview = {
        ...input,
        id: uuid(),
      };
      db.reviews.push(newReview);
      return newReview;
    },
    deleteCategory: (_parent, { id }) => {
      db.categories = db.categories.filter((category) => category.id !== id);
      db.products = db.products.map((product) => {
        if (product.categoryId === id) {
          product.categoryId = null;
        }
        return product;
      });
      return true;
    },
    deleteProduct: (_parent, { id }) => {
      db.products = db.products.filter((product) => product.id !== id);
      db.reviews = db.reviews.filter((review) => review.productId !== id);
      return true;
    },
    deleteReview: (_parent, { id }) => {
      db.reviews = db.reviews.filter((review) => review.id !== id);
      return true;
    },

    updateCategory: (_parent, { id, input }) => {
      const index = db.categories.findIndex((category) => category.id === id);
      const updatedCategory = {
        ...db.categories[index],
        ...input,
      };
      db.categories[index] = updatedCategory;
      return updatedCategory;
    },
    updateProduct: (_parent, { id, input }) => {
      const index = db.products.findIndex((product) => product.id === id);
      if (index === -1) return null;
      const updatedProduct = {
        ...db.products[index],
        ...input,
      };
      db.products[index] = updatedProduct;
      return updatedProduct;
    },
    updateReview: (_parent, { id, input }) => {
      const index = db.reviews.findIndex((review) => review.id === id);
      if (index === -1) return null;
      const updatedReview = {
        ...db.reviews[index],
        ...input,
      };
      db.reviews[index] = updatedReview;
      return updatedReview;
    },
  },
};
