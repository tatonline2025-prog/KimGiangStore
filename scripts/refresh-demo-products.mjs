const baseUrl = process.argv[2] ?? "https://kimgiang.vercel.app";
const username = process.argv[3] ?? "admin";
const password = process.argv[4] ?? "KimGiang@2026";

const imageMap = {
  "gold-gilded-buddha-statue": "https://images.unsplash.com/photo-1558980394-d9cfe2f1f190?auto=format&fit=crop&w=1200&q=80",
  "gold-gilded-buddha-statue-demo": "https://images.unsplash.com/photo-1558980394-d9cfe2f1f190?auto=format&fit=crop&w=1200&q=80",
  "jade-dragon-carving": "https://images.unsplash.com/photo-1560354811-2d7f2f8e2f28?auto=format&fit=crop&w=1200&q=80",
  "jade-dragon-carving-demo": "https://images.unsplash.com/photo-1560354811-2d7f2f8e2f28?auto=format&fit=crop&w=1200&q=80",
  "imperial-lacquer-box": "https://images.unsplash.com/photo-1610882648335-ced8fc8fa6b5?auto=format&fit=crop&w=1200&q=80",
  "imperial-lacquer-box-demo": "https://images.unsplash.com/photo-1610882648335-ced8fc8fa6b5?auto=format&fit=crop&w=1200&q=80",
  "bronze-ceremonial-gong": "https://images.unsplash.com/photo-1515442261605-65987783cb6a?auto=format&fit=crop&w=1200&q=80",
  "bronze-ceremonial-gong-demo": "https://images.unsplash.com/photo-1515442261605-65987783cb6a?auto=format&fit=crop&w=1200&q=80",
  "celadon-tea-vessel": "https://images.unsplash.com/photo-1593469949508-5f3f8b7a2cb2?auto=format&fit=crop&w=1200&q=80",
  "celadon-tea-vessel-demo": "https://images.unsplash.com/photo-1593469949508-5f3f8b7a2cb2?auto=format&fit=crop&w=1200&q=80",
  "ivory-seal-handle": "https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea?auto=format&fit=crop&w=1200&q=80",
  "temple-bronze-bell": "https://images.unsplash.com/photo-1579519431462-8f8d9b8f5a08?auto=format&fit=crop&w=1200&q=80",
  "temple-bronze-bell-demo": "https://images.unsplash.com/photo-1579519431462-8f8d9b8f5a08?auto=format&fit=crop&w=1200&q=80",
  "lacquered-manuscript-chest": "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80",
  "scholar-stone-plinth": "https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=1200&q=80",
  "blue-white-porcelain-jar": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80",
  "blue-white-porcelain-jar-demo": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80",
  "carved-phoenix-panel": "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
  "jade-bi-disc": "https://images.unsplash.com/photo-1515555230216-82228b88ea98?auto=format&fit=crop&w=1200&q=80",
  "jade-bi-disc-demo": "https://images.unsplash.com/photo-1515555230216-82228b88ea98?auto=format&fit=crop&w=1200&q=80",
};

function getSessionCookie(setCookieHeader) {
  if (!setCookieHeader) {
    return "";
  }

  return setCookieHeader.split(";")[0];
}

async function main() {
  const loginRes = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!loginRes.ok) {
    throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
  }

  const cookie = getSessionCookie(loginRes.headers.get("set-cookie"));
  if (!cookie) {
    throw new Error("No admin session cookie received");
  }

  const productsRes = await fetch(`${baseUrl}/api/products`);
  const productsData = await productsRes.json();
  const products = productsData.products ?? [];

  for (const product of products) {
    const nextImage = imageMap[product.slug];
    if (!nextImage || product.imageUrl === nextImage) {
      continue;
    }

    const updateRes = await fetch(`${baseUrl}/api/products/${product._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: JSON.stringify({ imageUrl: nextImage }),
    });

    if (!updateRes.ok) {
      console.log(`SKIP ${product.slug}: ${updateRes.status}`);
      continue;
    }

    console.log(`UPDATED ${product.slug} -> ${nextImage}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
