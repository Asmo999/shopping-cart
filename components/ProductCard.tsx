import { Product } from "@/types";
import { AddToCartForm } from "@/components/AddToCartForm";

const ProductCard = ({ productData }: { productData: Product }) => {
  return (
    <div className="group rounded-sm bg-white px-3 py-2">
      <div className="h-[300px] w-full content-center bg-main text-center text-black/30">
        {productData.title[0]}
      </div>
      <div className="mt-4 flex flex-col gap-2 text-black">
        <span>{productData.title}</span>
        <div className="flex items-center justify-between">
          <div className="flex gap-[2px]">
            <span>$</span>
            {productData.cost}
          </div>
          <AddToCartForm
            productId={productData._id}
            availableQuantity={productData.availableQuantity}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
