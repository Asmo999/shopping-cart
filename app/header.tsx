import CartWrapper from "@/components/Cart/CartWrapper";
import Link from "next/link";

export default function Header() {
  return (
    <div className="fixed top-0 z-50 flex w-full justify-between bg-white px-10 py-6 text-2xl font-bold text-black md:px-20">
      <Link href="/">Store</Link>
      <CartWrapper />
    </div>
  );
}
