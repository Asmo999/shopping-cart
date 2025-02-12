import { AddToCartForm } from "@/components/AddToCartForm";
import { getClient } from "@/lib/apollo/ServerClient";
import { gql } from "@apollo/client";
import { Product } from "@/types";

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
  const { data } = await getClient().query({ query: GET_PRODUCTS_QUERY });
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Products</h2>
      <ul className="space-y-4">
        {data.getProducts.products.map((product: Product, index: number) => (
          <li
            key={index}
            className="flex items-center justify-between rounded border p-4"
          >
            <div>
              <h3 className="font-semibold">{product.title}</h3>
              <p>${product.cost}</p>
              <p>In stock: {product.availableQuantity}</p>
            </div>
            <AddToCartForm
              availableQuantity={product.availableQuantity}
              productId={product._id}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
