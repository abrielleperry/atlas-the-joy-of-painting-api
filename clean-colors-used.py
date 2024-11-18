import pandas as pd

data = pd.read_csv("Colors-Used.csv")

# replace underscores with spaces and capitalize each word
data.columns = [col.replace("_", " ").title() for col in data.columns]

# specific name changes
data.rename(
    columns={
        "Num Colors": "Number of Colors",
        "Youtube Src": "Youtube Source",
        "Unnamed: 0": "Index",
        "Img Src": "Image Source",
        "Painting Title": "Title",
    },
    inplace=True,
)

# save updated version
data.to_csv("Colors-Used.csv", index=False)
