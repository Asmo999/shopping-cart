import { getClient } from "@/lib/apollo/ServerClient";
import { gql } from "@apollo/client";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { cookies } from "next/headers";

const GET_PRODUCTS_QUERY = gql`
  query GetProducts {
    getProducts {
      products {
        cost
        availableQuantity
        title
        _id
      }
      total
    }
  }
`;

export default async function ProductList() {
  const cookieStore = await cookies();
  const token = cookieStore.get("visitor-token")?.value;
  const { data } = await getClient().query({
    query: GET_PRODUCTS_QUERY,
    context: {
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
    },
  });
  return (
    <div className="product-list">
      <ul className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {data.getProducts.products.map((product: Product) => (
          <ProductCard key={product._id} productData={product} />
        ))}
      </ul>
    </div>
  );
}
