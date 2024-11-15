import pandas as pd

def replace_and_capitalize(input_file, output_file):
    try:
        # Open and read the file content as plain text
        with open(input_file, 'r') as file:
            content = file.read()
        
        # Replace underscores with spaces
        modified_content = content.replace('_', ' ')
        
        # Capitalize the first letter of every word
        capitalized_content = modified_content.title()
        
        # Save the updated content back to a new file
        with open(output_file, 'w') as file:
            file.write(capitalized_content)
        
        print(f"Processing complete. File saved to {output_file}")
    except Exception as e:
        print(f"An error occurred: {e}")

def process_episode_column(data_file, output_file):
    try:
        # Load data into a DataFrame
        df = pd.read_csv(data_file)
        
        # Check if 'Episode' column exists
        if 'Episode' in df.columns:
            # Extract season number and create 'Season' column
            df['Season'] = df['Episode'].str.extract(r'S(\d{2})', expand=False).astype(int)
            
            # Remove the 'E' and keep only the episode number in the 'Episode' column
            df['Episode'] = df['Episode'].str.extract(r'E(\d+)', expand=False).astype(int)
        
        # Save the updated DataFrame
        df.to_csv(output_file, index=False)
        print(f"Episode column processed and saved to {output_file}")
    except Exception as e:
        print(f"An error occurred: {e}")

def remove_all_quotes(input_file, output_file):
    try:
        # Open and read the file content as plain text
        with open(input_file, 'r') as file:
            content = file.read()
        
        # Remove all single and double quotes
        no_quotes_content = content.replace('"', '').replace("'", "")
        
        # Save the updated content back to a new file
        with open(output_file, 'w') as file:
            file.write(no_quotes_content)
        
        print(f"All quotes removed and saved to {output_file}")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage:
# Replace underscores and capitalize content
input_file = 'Subject-Matter.csv'
temp_file = 'Subject-Matter_temp.csv'  # Temporary file to prevent overwriting
replace_and_capitalize(input_file, temp_file)

# Remove all quotes
temp_file_no_quotes = 'Subject-Matter_no_quotes.csv'
remove_all_quotes(temp_file, temp_file_no_quotes)

# Process the Episode column
output_file = 'Subject-Matter_processed.csv'  # Final output file
process_episode_column(temp_file_no_quotes, output_file)
