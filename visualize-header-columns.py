import pandas as pd
import matplotlib.pyplot as plt


file_names = ['Episode-Dates.csv', 'Subject-Matter.csv', 'Colors-Used.csv']

# dict to store the number of columns in each file
header_counts = {}

for file_name in file_names:
    try:
        # read the file into a DataFrame
        df = pd.read_csv(file_name)

        # count the number of columns in header
        header_counts[file_name] = len(df.columns)
    except Exception as e:
        print(f"Error reading {file_name}: {e}")
        header_counts[file_name] = 0

# visualization
plt.figure(figsize=(10, 6))
plt.bar(header_counts.keys(), header_counts.values())
plt.xlabel('File Name')
plt.ylabel('Number of Header Columns')
plt.title('Number of Header Columns in Each File')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
