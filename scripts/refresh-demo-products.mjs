const baseUrl = process.argv[2] ?? "https://kimgiang.vercel.app";
const username = process.argv[3] ?? "admin";
const password = process.argv[4] ?? "KimGiang@2026";

const imageMap = {
  "gold-gilded-buddha-statue": "/artifacts/buddha-gold.svg",
  "gold-gilded-buddha-statue-demo": "/artifacts/buddha-gold.svg",
  "jade-dragon-carving": "/artifacts/jade-dragon.svg",
  "jade-dragon-carving-demo": "/artifacts/jade-dragon.svg",
  "imperial-lacquer-box": "/artifacts/lacquer-box.svg",
  "imperial-lacquer-box-demo": "/artifacts/lacquer-box.svg",
  "bronze-ceremonial-gong": "/artifacts/bronze-gong.svg",
  "bronze-ceremonial-gong-demo": "/artifacts/bronze-gong.svg",
  "celadon-tea-vessel": "/artifacts/celadon-vessel.svg",
  "celadon-tea-vessel-demo": "/artifacts/celadon-vessel.svg",
  "ivory-seal-handle": "/artifacts/phoenix-panel.svg",
  "temple-bronze-bell": "/artifacts/bronze-gong.svg",
  "lacquered-manuscript-chest": "/artifacts/manuscript-chest.svg",
  "scholar-stone-plinth": "/artifacts/jade-disc.svg",
  "blue-white-porcelain-jar": "/artifacts/porcelain-jar.svg",
  "blue-white-porcelain-jar-demo": "/artifacts/porcelain-jar.svg",
  "carved-phoenix-panel": "/artifacts/phoenix-panel.svg",
  "jade-bi-disc": "/artifacts/jade-disc.svg",
  "jade-bi-disc-demo": "/artifacts/jade-disc.svg",
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
