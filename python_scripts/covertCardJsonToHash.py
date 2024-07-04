import json
from typing import List, Dict

# Define the structure of Printing
class Printing:
    def __init__(self, unique_id: str, set_printing_unique_id: str, id: str, set_id: str, edition: str, foiling: str, rarity: str, artist: str, art_variation: str, image_url: str, tcgplayer_product_id: str, tcgplayer_url: str):
        self.unique_id = unique_id
        self.set_printing_unique_id = set_printing_unique_id
        self.id = id
        self.set_id = set_id
        self.edition = edition
        self.foiling = foiling
        self.rarity = rarity
        self.artist = artist
        self.art_variation = art_variation
        self.image_url = image_url
        self.tcgplayer_product_id = tcgplayer_product_id
        self.tcgplayer_url = tcgplayer_url

# Define the structure of Card
class Card:
    def __init__(self, unique_id: str, name: str, printings: List[Printing]):
        self.unique_id = unique_id
        self.name = name
        self.printings = printings

def convertCardDataToHashMap(cards: List[Dict]) -> Dict:
    hashMap = {}

    for card_data in cards:
        # Extract basic card info
        unique_id = card_data['unique_id']
        name = card_data['name']
        printings_data = card_data.get('printings', [])

        # Create list to store Printing objects
        printings = []
        for printing_data in printings_data:
            printing = Printing(
                printing_data['unique_id'],
                printing_data['set_printing_unique_id'],
                printing_data['id'],
                printing_data['set_id'],
                printing_data['edition'],
                printing_data['foiling'],
                printing_data['rarity'],
                printing_data['artist'],
                printing_data.get('art_variation', ''),
                printing_data.get('image_url', ''),
                printing_data.get('tcgplayer_product_id', ''),
                printing_data.get('tcgplayer_url', '')
            )
            printings.append(printing)

        # Create Card object
        card = Card(unique_id, name, printings)

        # Add Card object to hashMap based on set_id
        for printing in card.printings:
            set_id = printing.set_id
            if set_id not in hashMap:
                hashMap[set_id] = []

            # Check if card already exists in hashMap
            card_found = False
            for existing_card in hashMap[set_id]:
                if existing_card['unique_id'] == card.unique_id:
                    existing_card['printings'].extend([
                        {
                            'unique_id': printing.unique_id,
                            'set_printing_unique_id': printing.set_printing_unique_id,
                            'id': printing.id,
                            'set_id': printing.set_id,
                            'edition': printing.edition,
                            'foiling': printing.foiling,
                            'rarity': printing.rarity,
                            'artist': printing.artist,
                            'art_variation': printing.art_variation,
                            'image_url': printing.image_url,
                            'tcgplayer_product_id': printing.tcgplayer_product_id,
                            'tcgplayer_url': printing.tcgplayer_url
                        }
                    ])
                    card_found = True
                    break

            if not card_found:
                hashMap[set_id].append({
                    'unique_id': card.unique_id,
                    'name': card.name,
                    'printings': [
                        {
                            'unique_id': printing.unique_id,
                            'set_printing_unique_id': printing.set_printing_unique_id,
                            'id': printing.id,
                            'set_id': printing.set_id,
                            'edition': printing.edition,
                            'foiling': printing.foiling,
                            'rarity': printing.rarity,
                            'artist': printing.artist,
                            'art_variation': printing.art_variation,
                            'image_url': printing.image_url,
                            'tcgplayer_product_id': printing.tcgplayer_product_id,
                            'tcgplayer_url': printing.tcgplayer_url
                        }
                    ]
                })

    return hashMap

def update_json_file_with_hashmap(filename: str):
    # Load JSON data from file
    with open(filename, 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Convert JSON data to list of dictionaries (cards)
    cards = data

    # Convert cards to hashmap
    hashMap = convertCardDataToHashMap(cards)

    # Write hashmap data to a new JSON file
    with open('../app/jsonData/FabCardData.json', 'w', encoding='utf-8') as outfile:
        json.dump(hashMap, outfile, indent=2, ensure_ascii=False)

# Example usage
if __name__ == '__main__':
    filename = '../app/jsonData/card.json'  # Replace with your input JSON file path

    # Update hashmap.json file with the formatted hashmap data
    update_json_file_with_hashmap(filename)
