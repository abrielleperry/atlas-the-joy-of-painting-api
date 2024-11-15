import pandas as pd

# List of file names
file_names = ['Episode-Dates.csv', 'Subject-Matter.csv', 'Colors-Used.csv']

# Dictionary to store headers for each file
header_data = {}

for file_name in file_names:
    print(f"Processing file: {file_name}")
    try:
        # Read the file into a DataFrame
        df = pd.read_csv(file_name)
        
        # Store headers under the file name
        header_data[file_name] = df.columns.tolist()
    except Exception as e:
        print(f"Error processing {file_name}: {e}")
        header_data[file_name] = []

# Convert the dictionary to a DataFrame
headers_df = pd.DataFrame.from_dict(header_data, orient='index').transpose()

# Save the table to a CSV file
output_file = 'headers_by_file.csv'
headers_df.to_csv(output_file, index=False)
print(f"Table of headers saved as '{output_file}'")

# Display the table (optional)
print(headers_df)
