# Program to replace underscores with spaces and capitalize the first letter of every word

def replace_and_capitalize(input_file, output_file):
    try:
        with open(input_file, 'r') as file:
            content = file.read()
        
        # Replace underscores with spaces
        modified_content = content.replace('_', ' ')
        
        # Capitalize the first letter of every word
        capitalized_content = modified_content.title()
        
        with open(output_file, 'w') as file:
            file.write(capitalized_content)
        
        print(f"Processing complete. File saved to {output_file}")
    except Exception as e:
        print(f"An error occurred: {e}")

# Input and output file paths
input_file = 'Subject-Matter.csv'
output_file = 'Subject-Matter.csv'

replace_and_capitalize(input_file, output_file)
