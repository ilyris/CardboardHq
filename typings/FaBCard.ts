export interface Printing {
    unique_id: string;
    set_printing_unique_id: string;
    id: string;
    set_id: string;
    edition: string;
    foiling: string;
    rarity: string;
    artist: string;
    art_variation: string | null;
    flavor_text: string;
    flavor_text_plain: string;
    image_url: string;
    tcgplayer_product_id: string;
    tcgplayer_url: string;
}

export interface Card {
    unique_id: string;
    name: string;
    pitch: string;
    cost: string;
    power: string;
    defense: string;
    health: string;
    intelligence: string;
    types: string[];
    card_keywords: string[];
    abilities_and_effects: string[];
    ability_and_effect_keywords: string[];
    granted_keywords: string[];
    removed_keywords: string[];
    interacts_with_keywords: string[];
    functional_text: string;
    functional_text_plain: string;
    type_text: string;
    played_horizontally: boolean;
    blitz_legal: boolean;
    cc_legal: boolean;
    commoner_legal: boolean;
    blitz_living_legend: boolean;
    cc_living_legend: boolean;
    blitz_banned: boolean;
    cc_banned: boolean;
    commoner_banned: boolean;
    upf_banned: boolean;
    blitz_suspended: boolean;
    cc_suspended: boolean;
    commoner_suspended: boolean;
    ll_restricted: boolean;
    printings: Printing[];
}
