export interface Printing {
  unique_id: string;
  edition: string;
  start_card_id: string;
  end_card_id: string;
  initial_release_date: string;
  out_of_print_date: string | null;
  product_page: string;
  collectors_center: string;
  card_gallery: string;
}

export interface CardSet {
  unique_id: string;
  id: string;
  name: string;
  formatted_name: string;
  printings: Printing[];
}
