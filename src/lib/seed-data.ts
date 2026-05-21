export type SeedProduct = {
  name: string;
  slug: string;
  dynasty: string;
  priceUsd: number;
  imageUrl: string;
  shortDescription: string;
  longDescription: string;
  provenanceCode: string;
};

export const seedProducts: SeedProduct[] = [
  {
    name: "Gold-Gilded Buddha Statue",
    slug: "gold-gilded-buddha-statue",
    dynasty: "17th Century",
    priceUsd: 180000,
    imageUrl: "/artifacts/buddha-gold.svg",
    shortDescription: "Refined devotional sculpture with preserved lacquer traces.",
    longDescription:
      "A serene seated Buddha cast in bronze and gilded in fine layers, attributed to late 17th century workshops.",
    provenanceCode: "KG-COA-1701",
  },
  {
    name: "Jade Dragon Carving",
    slug: "jade-dragon-carving",
    dynasty: "Tang Dynasty",
    priceUsd: 95000,
    imageUrl: "/artifacts/jade-dragon.svg",
    shortDescription: "Celadon jade dragon with cloud-form carving details.",
    longDescription:
      "Carved jade pendant featuring a dragon in mid-turn, symbolizing imperial protection and prosperity.",
    provenanceCode: "KG-COA-2043",
  },
  {
    name: "Imperial Lacquer Box",
    slug: "imperial-lacquer-box",
    dynasty: "Le Dynasty",
    priceUsd: 25000,
    imageUrl: "/artifacts/lacquer-box.svg",
    shortDescription: "Hand-polished lacquer chest with mother-of-pearl motif.",
    longDescription:
      "Rectangular ceremonial box with deep red lacquer body and intricate mother-of-pearl floral medallions.",
    provenanceCode: "KG-COA-0907",
  },
  {
    name: "Bronze Ceremonial Gong",
    slug: "bronze-ceremonial-gong",
    dynasty: "Dong Son",
    priceUsd: 45000,
    imageUrl: "/artifacts/bronze-gong.svg",
    shortDescription: "Ritual bronze gong with radial sunburst centerpiece.",
    longDescription:
      "An early ceremonial percussion artifact with concentric rings and central boss, likely used in ritual contexts.",
    provenanceCode: "KG-COA-3320",
  },
  {
    name: "Celadon Tea Vessel",
    slug: "celadon-tea-vessel",
    dynasty: "Ly Dynasty",
    priceUsd: 32000,
    imageUrl: "/artifacts/celadon-vessel.svg",
    shortDescription: "Translucent celadon glaze with lotus petal engraving.",
    longDescription:
      "Wheel-thrown tea vessel with subtle crackle glaze and floral relief details characteristic of Ly kiln aesthetics.",
    provenanceCode: "KG-COA-1148",
  },
  {
    name: "Ivory Seal Handle",
    slug: "ivory-seal-handle",
    dynasty: "Nguyen Court",
    priceUsd: 56000,
    imageUrl: "/artifacts/phoenix-panel.svg",
    shortDescription: "Ceremonial seal handle with cloud-scroll carving.",
    longDescription:
      "Courtly ivory seal grip with hand-chiseled motifs used for imperial dispatch and administrative authentication.",
    provenanceCode: "KG-COA-2286",
  },
  {
    name: "Temple Bronze Bell",
    slug: "temple-bronze-bell",
    dynasty: "16th Century",
    priceUsd: 88000,
    imageUrl: "/artifacts/bronze-gong.svg",
    shortDescription: "Ritual bell with engraved sutra bands.",
    longDescription:
      "Cast bronze bell bearing script lines and protective motifs, traditionally suspended in pagoda courtyards.",
    provenanceCode: "KG-COA-4502",
  },
  {
    name: "Lacquered Manuscript Chest",
    slug: "lacquered-manuscript-chest",
    dynasty: "Tran Dynasty",
    priceUsd: 47000,
    imageUrl: "/artifacts/manuscript-chest.svg",
    shortDescription: "Archive chest with cinnabar lacquer and brass corner guards.",
    longDescription:
      "Rectangular manuscript chest designed for preservation of royal records, featuring layered lacquer and gilt trim.",
    provenanceCode: "KG-COA-3179",
  },
  {
    name: "Scholar Stone Plinth",
    slug: "scholar-stone-plinth",
    dynasty: "Ming Trade Period",
    priceUsd: 39000,
    imageUrl: "/artifacts/jade-disc.svg",
    shortDescription: "Dark wood base for scholar stones and calligraphy display.",
    longDescription:
      "Hand-carved hardwood plinth with cloud feet, crafted to elevate display stones in scholarly interiors.",
    provenanceCode: "KG-COA-6124",
  },
  {
    name: "Blue-White Porcelain Jar",
    slug: "blue-white-porcelain-jar",
    dynasty: "Le Trung Hung",
    priceUsd: 74000,
    imageUrl: "/artifacts/porcelain-jar.svg",
    shortDescription: "Cobalt floral scrollwork under transparent glaze.",
    longDescription:
      "Tall porcelain jar with cobalt-painted lotus vines and fitted cover, fired at high temperature for enduring luster.",
    provenanceCode: "KG-COA-5388",
  },
  {
    name: "Carved Phoenix Panel",
    slug: "carved-phoenix-panel",
    dynasty: "Hue Imperial Workshop",
    priceUsd: 51000,
    imageUrl: "/artifacts/phoenix-panel.svg",
    shortDescription: "Gilded wood panel with rising phoenix motif.",
    longDescription:
      "Decorative panel once mounted in a ceremonial hall, combining layered carving, lacquer, and gold highlights.",
    provenanceCode: "KG-COA-7421",
  },
  {
    name: "Jade Bi Disc",
    slug: "jade-bi-disc",
    dynasty: "Han Influence",
    priceUsd: 67000,
    imageUrl: "/artifacts/jade-disc.svg",
    shortDescription: "Ritual bi disc with polished nephrite surface.",
    longDescription:
      "Circular jade bi disc with smooth aperture and subtle mineral veining, symbolizing heaven in ritual cosmology.",
    provenanceCode: "KG-COA-2905",
  },
];
