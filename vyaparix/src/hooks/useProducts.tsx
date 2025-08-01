// src/context/ProductsContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import type { product, reviews } from "../types/types";

import { useAuth } from "./useAuth";

interface ProductsContextType {
  products: product[];
  searchResults: product[];
  isSearch: boolean;
  setIsSearch: (val: boolean) => void;
  searchProducts: (text: string) => void;
  addReview: (product: product, newReview: reviews) => void;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {


  const [products, setProducts] = useState<product[]>([]);
  const [searchResults, setSearchResults] = useState<product[]>([]);
  const [isSearch, setIsSearch] = useState(false);


  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(30));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        ...(doc.data() as product),
        docID: doc.id,
      }));
      setProducts(items);
    });
    return () => unsubscribe();
  }, []);


  const { user } = useAuth();

  const searchProducts = async (search: string) => {
    const words = search.toLowerCase().split(/\s+/).filter(Boolean);
    const seen = new Map<string, { item: product; score: number }>();

    for (const word of words) {
      if (word.length < 1) continue;

      const q = query(collection(db, "products"), where("tags", "array-contains", word));
      const snap = await getDocs(q);

      snap.forEach((doc) => {
        const data = doc.data() as product;
        const existing = seen.get(doc.id);
        if (existing) {
          existing.score += 2;
        } else {
          seen.set(doc.id, { item: { ...data, docID: doc.id }, score: 2 });
        }
      });
    }

    const allProducts = new Set([...products, ...Array.from(seen.values()).map((v) => v.item)]);
    for (const prod of allProducts) {
      const name = prod.name?.toLowerCase() || "";
      const tags = prod.tag?.map((t) => t.toLowerCase()) || [];
      let score = 0;

      for (const word of words) {
        if (name.includes(word)) score += 1;
        if (name.startsWith(word)) score += 1;
        if (tags.some((tag) => tag.includes(word))) score += 1;
      }

      const id = prod.docID || prod.id;
      const existing = seen.get(id);
      if (existing) {
        existing.score += score;
      } else if (score > 0) {
        seen.set(id, { item: prod, score });
      }
    }

    const sorted = [...seen.values()]
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);

    setSearchResults(sorted);
    setIsSearch(true);
  };
  const addReview = async (product: product, newReview: reviews) => {
    if (!user) return;
    if (newReview.rating === 0) return;

    const productDoc = doc(db, "products", product.docID as string);
    const productSnap = await getDoc(productDoc);

    if (!productSnap.exists()) {
      console.error("Product not found");
      return;
    }

    const productData = productSnap.data();
    const existingReviews: reviews[] = productData.reviews || [];

    // Filter out any review from the same user
    const updatedReviews = existingReviews.filter(
      (review) => review.user_id !== user.uid
    );

    // Add the new/updated review
    updatedReviews.push(newReview);

    // Update the product document
    await updateDoc(productDoc, {
      reviews: updatedReviews,
    });

    console.log("Review added/updated successfully");
    //PLEASE CONVERT THIS TO MODAL MESSAGE
  }


  return (
    <ProductsContext.Provider value={{ products, searchResults, isSearch, setIsSearch, searchProducts, addReview }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) throw new Error("useProducts must be used within ProductsProvider");
  return context;
};
