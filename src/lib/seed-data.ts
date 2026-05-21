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
    imageUrl:
      "https://images.unsplash.com/photo-1558980394-d9cfe2f1f190?auto=format&fit=crop&w=1200&q=80",
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
    imageUrl:
      "https://images.unsplash.com/photo-1560354811-2d7f2f8e2f28?auto=format&fit=crop&w=1200&q=80",
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
    imageUrl:
      "https://images.unsplash.com/photo-1610882648335-ced8fc8fa6b5?auto=format&fit=crop&w=1200&q=80",
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
    imageUrl:
      "https://images.unsplash.com/photo-1515442261605-65987783cb6a?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Ritual bronze gong with radial sunburst centerpiece.",
    longDescription:
      "An early ceremonial percussion artifact with concentric rings and central boss, likely used in ritual contexts.",
    provenanceCode: "KG-COA-3320",
  },
];
