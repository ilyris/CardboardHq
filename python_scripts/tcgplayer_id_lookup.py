import json

# Load the JSON data from the file
with open('../app/jsonData/card.json', 'r', encoding='utf-8') as file:
    cards = json.load(file)

# Initialize a list to hold the IDs of printings missing the keys
missing_printings = []

# Loop through each card in the array
for card in cards:
    # Loop through each printing of the current card
    for printing in card.get('printings', []):
        # Check if the printing is missing either "tcgplayer_product_id" or "tcgplayer_url"
        if 'tcgplayer_product_id' not in printing or 'tcgplayer_url' not in printing:
            missing_printings.append(printing['id'])

# Print the result
print("Printings missing 'tcgplayer_product_id' or 'tcgplayer_url':")
print(missing_printings)
