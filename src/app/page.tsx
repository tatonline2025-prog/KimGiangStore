import { StorefrontPage } from "@/components/StorefrontPage";
import { getCatalogProducts } from "@/lib/catalog";
import { getStoreSettings } from "@/lib/store-settings";

export default async function Home() {
  const [products, settings] = await Promise.all([
    getCatalogProducts(),
    getStoreSettings(),
  ]);

  return <StorefrontPage products={products} settings={settings} />;
}
