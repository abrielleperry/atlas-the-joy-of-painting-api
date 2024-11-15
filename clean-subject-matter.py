def replace_underscores_with_spaces(input_file, output_file):
    try:
        with open(input_file, 'r') as file:
            content = file.read()

        modified_content = content.replace('_', ' ')

        with open(output_file, 'w') as file:
            file.write(modified_content)

        print(f"Underscores replaced with spaces and saved to {output_file}")
    except Exception as e:
        print(f"An error occurred: {e}")

input_file = 'Subject-Matter.csv'
output_file = 'Subject-Matter.csv'

replace_underscores_with_spaces(input_file, output_file)
