const baseUrl = process.argv[2] ?? "https://kimgiang.vercel.app";

const demoProducts = [
  {
    name: "Gold-Gilded Buddha Statue",
    slug: "gold-gilded-buddha-statue-demo",
    dynasty: "17th Century",
    priceUsd: 180000,
    imageUrl: "/artifacts/buddha-gold.svg",
    shortDescription: "Refined devotional sculpture with preserved lacquer traces.",
    longDescription: "A serene seated Buddha cast in bronze and gilded in fine layers.",
    provenanceCode: "KG-COA-1701",
  },
  {
    name: "Jade Dragon Carving",
    slug: "jade-dragon-carving-demo",
    dynasty: "Tang Dynasty",
    priceUsd: 95000,
    imageUrl: "/artifacts/jade-dragon.svg",
    shortDescription: "Celadon jade dragon with cloud-form carving details.",
    longDescription: "Carved jade pendant featuring a dragon in mid-turn.",
    provenanceCode: "KG-COA-2043",
  },
  {
    name: "Imperial Lacquer Box",
    slug: "imperial-lacquer-box-demo",
    dynasty: "Le Dynasty",
    priceUsd: 25000,
    imageUrl: "/artifacts/lacquer-box.svg",
    shortDescription: "Hand-polished lacquer chest with mother-of-pearl motif.",
    longDescription: "Rectangular ceremonial box with deep red lacquer body.",
    provenanceCode: "KG-COA-0907",
  },
  {
    name: "Bronze Ceremonial Gong",
    slug: "bronze-ceremonial-gong-demo",
    dynasty: "Dong Son",
    priceUsd: 45000,
    imageUrl: "/artifacts/bronze-gong.svg",
    shortDescription: "Ritual bronze gong with radial sunburst centerpiece.",
    longDescription: "Early ceremonial percussion artifact with concentric rings.",
    provenanceCode: "KG-COA-3320",
  },
  {
    name: "Celadon Tea Vessel",
    slug: "celadon-tea-vessel-demo",
    dynasty: "Ly Dynasty",
    priceUsd: 32000,
    imageUrl: "/artifacts/celadon-vessel.svg",
    shortDescription: "Translucent celadon glaze with lotus petal engraving.",
    longDescription: "Wheel-thrown tea vessel with subtle crackle glaze.",
    provenanceCode: "KG-COA-1148",
  },
  {
    name: "Temple Bronze Bell",
    slug: "temple-bronze-bell-demo",
    dynasty: "16th Century",
    priceUsd: 88000,
    imageUrl: "/artifacts/bronze-gong.svg",
    shortDescription: "Ritual bell with engraved sutra bands.",
    longDescription: "Cast bronze bell bearing script lines and motifs.",
    provenanceCode: "KG-COA-4502",
  },
  {
    name: "Blue-White Porcelain Jar",
    slug: "blue-white-porcelain-jar-demo",
    dynasty: "Le Trung Hung",
    priceUsd: 74000,
    imageUrl: "/artifacts/porcelain-jar.svg",
    shortDescription: "Cobalt floral scrollwork under transparent glaze.",
    longDescription: "Tall porcelain jar with cobalt-painted lotus vines.",
    provenanceCode: "KG-COA-5388",
  },
  {
    name: "Jade Bi Disc",
    slug: "jade-bi-disc-demo",
    dynasty: "Han Influence",
    priceUsd: 67000,
    imageUrl: "/artifacts/jade-disc.svg",
    shortDescription: "Ritual bi disc with polished nephrite surface.",
    longDescription: "Circular jade disc symbolizing heaven in ritual cosmology.",
    provenanceCode: "KG-COA-2905",
  },
];

const run = async () => {
  for (const product of demoProducts) {
    const response = await fetch(`${baseUrl}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      const message = await response.text();
      console.log(`SKIP ${product.slug}: ${response.status} ${message}`);
      continue;
    }

    console.log(`OK ${product.slug}`);
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
