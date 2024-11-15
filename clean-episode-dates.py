import pandas as pd
import re

# load the raw content of the file
file_path = 'Episode-Dates.csv'

with open(file_path, 'r') as file:
    raw_content = file.readlines()

# process the raw content to extract the episode name, date, and extra information
processed_data = []
for line in raw_content:
    match = re.match(r'"(.+)"\s\((.+)\)', line.strip())
    if match:
        title = match.group(1)
        date_extra = match.group(2)
        # extract date and extra info
        date_match = re.match(r'([\w]+\s\d{1,2},\s\d{4})(.*)', date_extra)
        if date_match:
            date = date_match.group(1).strip()
            extra = date_match.group(2).strip().replace(')', '').replace('(', '')  # Remove all `(` and `)` characters
        else:
            date = date_extra.strip()
            extra = ""
        processed_data.append({"Title": title, "Date": date, "Extra": extra})

# convert the processed data to a DataFrame
processed_df = pd.DataFrame(processed_data)

# save the cleaned data to same CSV file
output_file_path = 'Episode-Dates.csv'
processed_df.to_csv(output_file_path, index=False)

print(f"Cleaned data has been saved to {output_file_path}.")
