import React from "react";
import { notFound } from "next/navigation";
import { getSingleProduct, getAllProducts } from "@/api/services/routemisr.service";
import ProductDetailsView from "./ProductDetailsView";

export default async function ProductDetails(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  // Fetch product details and related products catalog in parallel
  const [product, allProducts] = await Promise.all([
    getSingleProduct(id),
    getAllProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const sameCategoryProducts = allProducts.filter(
    (p) =>
      (p.category?._id === product.category?._id ||
        p.category?.name === product.category?.name) &&
      p._id !== product._id &&
      p.id !== product.id
  );

  // If fewer than 4 items in same category, backfill from remaining products
  const relatedProducts =
    sameCategoryProducts.length >= 4
      ? sameCategoryProducts.slice(0, 4)
      : [
          ...sameCategoryProducts,
          ...allProducts.filter(
            (p) =>
              p._id !== product._id &&
              p.id !== product.id &&
              !sameCategoryProducts.some((scp) => scp._id === p._id)
          ),
        ].slice(0, 4);

  return (
    <ProductDetailsView
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
