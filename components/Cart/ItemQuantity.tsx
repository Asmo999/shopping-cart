import { updateItemQuantity } from "@/actions/Cart/updateItemQuantity";
import { useTransition } from "react";
import { useCart } from "@/context/CartContext";
import { removeProduct } from "@/actions/Cart/removeProduct";

const ItemQuantity = ({
  itemQuantity,
  itemId,
  availableQuantity,
}: {
  itemQuantity: number;
  itemId: string;
  availableQuantity: number;
}) => {
  const [isPending, startTransition] = useTransition();
  const { refreshCart } = useCart();

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newQuantity = Number(event.target.value);
    startTransition(async () => {
      const formData = new FormData();
      let result;
      if (newQuantity === 0) {
        formData.set("cartItemId", itemId);
        result = await removeProduct(formData);
      } else {
        formData.set("quantity", String(newQuantity));
        result = await updateItemQuantity(formData);
      }

      if (result.success) {
        refreshCart();
        console.log("Quantity updated successfully:", result);
      } else {
        console.log("Error updating quantity:", result);
      }
    });
  };

  // Generate array of possible quantities from 0 to availableQuantity
  const quantityOptions = Array.from(
    { length: availableQuantity + 1 },
    (_, i) => i,
  );

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm text-gray-500">Quantity:</p>
      <select
        value={itemQuantity}
        onChange={handleQuantityChange}
        disabled={isPending}
        className="rounded-md border px-2 py-1 text-sm text-black"
      >
        {quantityOptions.map((quantity) => (
          <option key={quantity} value={quantity}>
            {quantity}
          </option>
        ))}
      </select>
      {isPending && <p className="text-sm text-gray-500">Updating...</p>}
    </div>
  );
};

export default ItemQuantity;
