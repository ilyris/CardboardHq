import requests
from bs4 import BeautifulSoup
import os
import json
import re
from PIL import Image
from io import BytesIO

def format_name(name):
    formatted_name = name.replace(" ", "-").lower()
    if "-of" in formatted_name or "-to" in formatted_name:
        formatted_name = formatted_name.replace("-of", "").replace("-to", "")
    return formatted_name

def get_asset_url(soup, name, asset_type):
    asset = soup.find('h5', string=re.compile(f"{name} {asset_type}", re.IGNORECASE))
    if not asset:
        print(f"Could not find the {asset_type} section for {name}.")
        return None
    
    parent_anchor = asset.find_parent('a')
    if not parent_anchor:
        print(f"Could not find a link associated with {name} {asset_type}.")
        return None
    
    return parent_anchor['href']

def download_assets(name):
    formatted_name = format_name(name)
    base_url = f"https://fabtcg.com/resources/digital-assets/{formatted_name}/"
    response = requests.get(base_url)

    if response.status_code != 200:
        print(f"Failed to retrieve the page for {name}. Status code: {response.status_code}")
        return

    soup = BeautifulSoup(response.content, 'html.parser')

    assets = [
        {"type": "logo", "dir": "../public/Fab_assets/logos"},
        {"type": "key art|banner", "dir": "../public/Fab_assets/key_art"}
    ]

    for asset in assets:
        asset_url = get_asset_url(soup, name, asset["type"])
        if asset_url:
            if not asset_url.startswith("http"):
                asset_url = base_url + asset_url
            
            file_extension = os.path.splitext(asset_url)[-1]

            file_name = f"{formatted_name}{file_extension}"
            print(f"Processing file: {asset_url} {file_name}")

            # Ensure the directory exists
            os.makedirs(asset["dir"], exist_ok=True)

            # Full path for the file
            file_path = os.path.join(asset["dir"], file_name)

            download_and_compress_file(asset_url, file_path)

def download_and_compress_file(url, file_path, max_size=(800, 800), quality=85):
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        image = Image.open(BytesIO(response.content))
        image.thumbnail(max_size, Image.LANCZOS)
        image.save(file_path, optimize=True, quality=quality)
        print(f"Downloaded and compressed {file_path}")
    else:
        print(f"Failed to download {file_path}. Status code: {response.status_code}")

def load_assets_from_json(json_file):
    try:
        with open(json_file, 'r') as f:
            data = json.load(f)
            return data  # Return the entire data
    except FileNotFoundError:
        print(f"JSON file {json_file} not found.")
        return []
    except json.JSONDecodeError:
        print("Error decoding JSON.")
        return []

if __name__ == "__main__":
    json_file = "../app/jsonData/FaBSet.json"  # Update path accordingly
    assets_data = load_assets_from_json(json_file)

    # Ensure it's a list
    if not isinstance(assets_data, list):
        print("Error: JSON data is not a list.")
    else:
        # List of IDs to include
        desired_ids = ["WTR", "DTD", "MST", "OUT", "UPR", "ELE", "CRU", "EVO", "DYN", "1HP", "EVR", "ARC", "MON", "HVY"]

        # Filter the assets based on the desired IDs
        filtered_assets = [item for item in assets_data if item["id"] in desired_ids]

        for asset in filtered_assets:
            # Get the name and format it
            name = asset["name"]
            download_assets(name)
