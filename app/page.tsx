import ProductList from "@/components/ProductList";

export default function Home() {
  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="mb-8 text-3xl font-bold">Shopping Cart Demo</h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ProductList />
        </div>
      </div>
    </div>
  );
}
