export interface Printing {
  unique_id: string;
  set_printing_unique_id: string;
  id: string;
  set_id: string;
  edition: string;
  foiling: string;
  rarity: string;
  artist: string | string[];
  art_variation: string | null;
  flavor_text: string;
  flavor_text_plain: string;
  image_url: string;
  tcgplayer_product_id: string;
  tcgplayer_url: string;
  artist_array: string | string[];
}

export interface Card {
  unique_id: string;
  name: string;
  printings: Printing[];
}
