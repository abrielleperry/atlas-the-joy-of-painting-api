import pandas as pd

file_names = ['Episode-Dates.csv', 'Subject-Matter.csv', 'Colors-Used.csv']

# dict to store headers for each file
header_data = {}

for file_name in file_names:
    print(f"Processing file: {file_name}")
    try:
        # read the file into a DataFrame
        df = pd.read_csv(file_name)

        # store headers under the file name
        header_data[file_name] = df.columns.tolist()
    except Exception as e:
        print(f"Error processing {file_name}: {e}")
        header_data[file_name] = []

# convert the dict to a DataFrame
headers_df = pd.DataFrame.from_dict(header_data, orient='index').transpose()

# save the table to a CSV file
output_file = 'headers_by_file.csv'
headers_df.to_csv(output_file, index=False)
print(f"Table of headers saved as '{output_file}'")

# display the table
print(headers_df)
