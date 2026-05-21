import { StorefrontPage } from "@/components/StorefrontPage";
import { getCatalogProducts } from "@/lib/catalog";

export default async function Home() {
  const products = await getCatalogProducts();

  return <StorefrontPage products={products} />;
}
