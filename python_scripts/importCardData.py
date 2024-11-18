import json
import psycopg2
from psycopg2.extras import execute_values

# Database connection setup
conn = psycopg2.connect(
    dbname="postgres",
    user="postgres.mymiwwelfxadxqnbcape",
    password="StayingAlive1993!",
    host="aws-0-us-west-1.pooler.supabase.com",
    port="6543"
)
cursor = conn.cursor()

# Read JSON file
with open('../app/jsonData/card.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Function to insert data into card table
def insert_card_data(card_data):
    card_query = """
    INSERT INTO card (
        unique_id, name, pitch, cost, power, defense, health, intelligence,
        functional_text, functional_text_plain, type_text, played_horizontally,
        blitz_legal, cc_legal, commoner_legal, blitz_living_legend, cc_living_legend,
        blitz_banned, cc_banned, commoner_banned, upf_banned, blitz_suspended,
        cc_suspended, commoner_suspended, ll_restricted
    ) VALUES %s ON CONFLICT (unique_id) DO NOTHING
    """
    card_values = [
        (
            card['unique_id'], card['name'], card['pitch'], card['cost'], card['power'],
            card['defense'], card['health'], card['intelligence'], card['functional_text'],
            card['functional_text_plain'], card['type_text'], card['played_horizontally'],
            card['blitz_legal'], card['cc_legal'], card['commoner_legal'], card['blitz_living_legend'],
            card['cc_living_legend'], card['blitz_banned'], card['cc_banned'], card['commoner_banned'],
            card['upf_banned'], card['blitz_suspended'], card['cc_suspended'], card['commoner_suspended'],
            card['ll_restricted']
        )
        for card in card_data
    ]
    execute_values(cursor, card_query, card_values)

# Function to insert data into printing table
def insert_printing_data(card_data):
    printing_query = """
    INSERT INTO printing (
        unique_id, set_printing_unique_id, id, set_id, edition, foiling, rarity, artist_array,
        art_variation, flavor_text, flavor_text_plain, image_url, tcgplayer_product_id, tcgplayer_url, 
        card_unique_id, is_front, other_face_unique_id, is_DFC
    ) VALUES %s
    ON CONFLICT (unique_id) DO UPDATE 
    SET 
        artist_array = EXCLUDED.artist_array,
        is_front = EXCLUDED.is_front,
        other_face_unique_id = EXCLUDED.other_face_unique_id,
        is_DFC = EXCLUDED.is_DFC;
    """
    printing_values = []
    for card in card_data:
        for printing in card['printings']:
            # Pass the artists list directly as a Python list
            artists = printing.get('artists', [])  # Ensure it's a list

            # Extract double_sided_card_info data
            double_sided_info = printing.get('double_sided_card_info', [{}])[0]
            is_front = double_sided_info.get('is_front', None)
            other_face_unique_id = double_sided_info.get('other_face_unique_id', None)
            is_DFC = double_sided_info.get('is_DFC', None)

            # Append values for insertion
            printing_values.append((
                printing['unique_id'],
                printing['set_printing_unique_id'],
                printing['id'],
                printing['set_id'],
                printing['edition'],
                printing['foiling'],
                printing['rarity'],
                artists,  # Pass the Python list directly
                printing.get('art_variation', ''),
                printing.get('flavor_text', ''),
                printing.get('flavor_text_plain', ''),
                printing['image_url'],
                printing.get('tcgplayer_product_id', None),
                printing.get('tcgplayer_url', None),
                card['unique_id'],
                is_front,  # New column
                other_face_unique_id,  # New column
                is_DFC  # New column
            ))

    # Execute the insertion with psycopg2's execute_values
    execute_values(cursor, printing_query, printing_values)

# Insert data into tables
insert_card_data(data)
insert_printing_data(data)

# Commit and close the database connection
conn.commit()
cursor.close()
conn.close()