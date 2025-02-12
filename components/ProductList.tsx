// import { addProduct } from "@/actions/addProduct";
import { AddToCartForm } from "@/components/AddToCart";
import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";
import { Product } from "@/types";

// const products = [
//   { id: 1, name: "Product 1", price: 10, stock: 5 },
//   { id: 2, name: "Product 2", price: 15, stock: 3 },
//   { id: 3, name: "Product 3", price: 20, stock: 8 },
// ];

const GET_PRODUCTS_QUERY = gql`
  query ExampleQuery {
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
            <AddToCartForm productId={product._id} />
            {/*<button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600">*/}
            {/*  Add to Cart*/}
            {/*</button>*/}
          </li>
        ))}
      </ul>
    </div>
  );
}
