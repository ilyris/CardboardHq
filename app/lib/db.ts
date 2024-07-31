import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: pool,
  }),
});

export interface CardInformation {
  unique_id: string;
  name: string;
  pitch?: string | null;
  cost?: string | null;
  power?: string | null;
  defense?: string | null;
  health?: string | null;
  intelligence?: string | null;
  functional_text?: string | null;
  functional_text_plain?: string | null;
  type_text?: string | null;
  played_horizontally?: boolean;
  blitz_legal?: boolean;
  cc_legal?: boolean;
  commoner_legal?: boolean;
  blitz_living_legend?: boolean;
  cc_living_legend?: boolean;
  blitz_banned?: boolean;
  cc_banned?: boolean;
  commoner_banned?: boolean;
  upf_banned?: boolean;
  blitz_suspended?: boolean;
  cc_suspended?: boolean;
  commoner_suspended?: boolean;
  ll_restricted?: boolean;
}

export interface CardPrintingPriceView {
  printing_unique_id: string;
  set_printing_unique_id: string;
  printing_id: string;
  set_id: string;
  edition: string;
  foiling: string;
  artist: string;
  image_url: string;
  tcgplayer_product_id: string;
  tcgplayer_url: string;
  card_unique_id: string;
  card_name: string;
  low_price: number | null;
  market_price: number | null;
}

export interface CardPriceData {
  product_id: number;
  date: string;
  sub_type_name: string;
  low_price: string;
  mid_price: string;
  high_price: string;
  market_price: string;
  direct_low_price: string | null;
}

export interface AllCardPrintingView {
  printing_unique_id: string;
  set_printing_unique_id: string;
  printing_id: string;
  set_id: string;
  edition: string;
  foiling: string;
  artist: string;
  image_url: string;
  tcgplayer_product_id: string;
  tcgplayer_url: string;
  card_unique_id: string;
  card_name: string;
  low_price: number | null;
  market_price: number | null;
  price_date: string;
  sub_type_name: string;
}

export interface Database {
  printing_with_card_and_latest_pricing: CardPrintingPriceView;
  product_prices: CardPriceData;
  all_high_rarity_printings_with_card_prices_weekly: AllCardPrintingView;
  all_printings_with_card_prices_weekly: AllCardPrintingView;
  card: CardInformation;
}
