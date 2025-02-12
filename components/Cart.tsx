const cartItems = [
  { id: 1, name: "Product 1", price: 10, quantity: 2 },
  { id: 2, name: "Product 2", price: 15, quantity: 1 },
];

export default function Cart() {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded border p-4"
            >
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p>
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="rounded bg-gray-200 px-2 py-1 font-bold text-gray-800 hover:bg-gray-300">
                  -
                </button>
                <span>{item.quantity}</span>
                <button className="rounded bg-gray-200 px-2 py-1 font-bold text-gray-800 hover:bg-gray-300">
                  +
                </button>
                <button className="rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-600">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
      </div>
    </div>
  );
}
