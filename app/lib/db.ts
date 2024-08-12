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
  price_date: Date;
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

export interface Portfolio {
  portfolio_name: string;
  description?: string;
  unique_id: string;
  user_id: string;
}

export interface PortfolioCard {
  unique_id: string;
  card_unique_id: string;
  printing_unique_id: string;
  quantity: number;
  grade: string;
  unit_price: number | null;
  use_market_price: boolean;
  date_added: Date;
  portfolio_unique_id: string;
}

export interface PortfolioAggregate {
  portfolio_name: string;
  portfolio_user_id: string;
  description?: string;
  portfolio_id: string;
  portfolio_card_id: string;
  card_unique_id: string;
  printing_unique_id: string;
  quantity: number;
  grade: string;
  unit_price?: number;
  use_market_price: boolean;
  date_added: Date;
  card_name: string;
  set_printing_unique_id: string;
  printing_id: string;
  set_id: string;
  edition: string;
  foiling: string;
  image_url: string;
  tcgplayer_product_id: string;
  tcgplayer_url: string;
  low_price: number;
  market_price: number;
  date: Date;
}

export interface Database {
  printing_with_card_and_latest_pricing: CardPrintingPriceView;
  product_prices: CardPriceData;
  all_high_rarity_printings_with_card_prices_weekly: AllCardPrintingView;
  all_printings_with_card_prices_weekly: AllCardPrintingView;
  all_printings_with_card_prices_weekly_new: AllCardPrintingView;
  card: CardInformation;
  portfolio: Portfolio;
  portfolio_card: PortfolioCard;
  portfolio_aggregate: PortfolioAggregate;
  portfolio_prices: any;
  portfolio_with_latest_prices: any;
  users: any;
}
