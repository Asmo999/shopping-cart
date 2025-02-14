import { updateItemQuantity } from "@/actions/Cart/updateItemQuantity";
import { useTransition } from "react";
import { useCart } from "@/context/CartContext";
import { removeProduct } from "@/actions/Cart/removeProduct";

const QuantitySelect = ({
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
      formData.set("cartItemId", itemId);
      if (newQuantity === 0) {
        result = await removeProduct(formData);
      } else {
        formData.set("quantity", String(newQuantity));
        result = await updateItemQuantity(formData);
      }
      if (result.success) {
        refreshCart();
      }
    });
  };

  const quantityOptions = Array.from(
    { length: availableQuantity + 1 },
    (_, i) => i,
  );

  return (
    <div className="flex items-center gap-2">
      <p className="text-xl text-gray-500 xl:text-sm">Quantity:</p>
      <select
        value={itemQuantity}
        onChange={handleQuantityChange}
        disabled={isPending}
        className="w-[50px] rounded-md border px-2 py-1 text-sm text-black xl:px-1 xl:py-[2px]"
      >
        {quantityOptions.map((quantity) => (
          <option key={quantity} value={quantity}>
            {quantity === 0 ? `${quantity}(delete)` : quantity}
          </option>
        ))}
      </select>
      {isPending && <p className="text-sm text-gray-500">Updating...</p>}
    </div>
  );
};

export default QuantitySelect;
