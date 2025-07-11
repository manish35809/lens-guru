import json
from collections import defaultdict

# Load the data from the JSON file
with open('shivaOpticiansLensData.json', 'r') as file:
    lens_data = json.load(file)

# Dictionary to count occurrences of each ID
id_count = defaultdict(int)

# Count each ID
for item in lens_data:
    id_count[item['id']] += 1

# Collect duplicate IDs
duplicate_ids = [id_ for id_, count in id_count.items() if count > 1]

# Output results
if duplicate_ids:
    print("Duplicate IDs found:")
    for dup_id in duplicate_ids:
        print(dup_id)
else:
    print("No duplicate IDs found.")
