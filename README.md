🚨 For example API queries, jump to the [**Getting Started**](#📊-example-api-queries-for-testing) section 🚨
 ---


![Bob Ross](https://gardenandgun.com/wp-content/uploads/2017/10/Bob-Ross-1.png)
# The Joy of Painting



Welcome to the **atlas-the-joy-of-painting-api** repository! This project is designed to support my local public broadcasting station by building a centralized database and API to manage and filter episodes of *The Joy of Painting* based on specific criteria requested by viewers.

---



## 📂 Resources

- [**Bob Ross Episode Data CSV**](https://github.com/fivethirtyeight/data/blob/master/bob-ross/elements-by-episode.csv): Contains episode details such as broadcast dates and subjects painted.
- [**Bob Ross Paint Color Details CSV**](https://github.com/jwilber/Bob_Ross_Paintings/blob/master/data/bob_ross_paintings.csv): Includes the color palettes used in the episodes.

---

## 📜 Project Context

This project demonstrates the ETL (Extract, Transform, Load) process by:

1. Extracting data from multiple sources.
2. Transforming and cleaning data for consistency.
3. Loading the data into a unified database.

The goal is to provide viewers with a website that allows them to filter *The Joy of Painting* episodes based on:
- **Month of Original Broadcast**: Find episodes aired during a specific month.
- **Subject Matter**: Filter episodes based on the objects or scenes painted.
- **Color Palette**: Filter episodes by the colors used in the painting.

The database and API developed in this project will integrate seamlessly with a front-end application for viewers.

---




## Getting Started

### Prerequisites
- **MongoDB**: Ensure MongoDB is installed and running locally or accessible via a cloud instance.
- **Node.js**: Install Node.js to run the server and scripts.
- **Postman** (or a similar tool): Use for testing the API.

### Steps to Run the Project
1. Clone this repository:
   ```bash
   git clone https://github.com/<your-username>/atlas-the-joy-of-painting-api.git
   cd atlas-the-joy-of-painting-api
   ```

2. Set up the MongoDB database:
   - Ensure your MongoDB instance is running locally or available online.
   - Update the MongoDB connection string in the `server.js` or configuration file.

3. Run the ETL process:
   - Use scripts to populate the MongoDB database with data from the CSV files.

4. Start the API server:
   - Launch the server using Node.js:
     ```bash
     node server.js
     ```

5. Test the API:
   - Use Postman or your preferred tool to send requests and verify the filtering functionality.

---




### 📊 API Filtering Options

#### **Available Subject Matters**
The following subject matters can be used in filtering API queries:

- `apple frame`, `aurora borealis`, `barn`, `beach`, `boat`, `bridge`, `building`, `bushes`, `cabin`, `cactus`, `circle frame`, `cirrus`, `cliff`, `clouds`, `conifer`, `cumulus`, `deciduous`, `diane andre`, `dock`, `double oval frame`, `farm`, `fence`, `fire`, `florida frame`, `flowers`, `fog`, `framed`, `grass`, `guest`, `half circle frame`, `half oval frame`, `hills`, `lake`, `lakes`, `lighthouse`, `mill`, `moon`, `mountains`, `night`, `ocean`, `oval frame`, `palm trees`, `path`, `person`, `portrait`, `rectangle 3d frame`, `rectangular frame`, `river`, `rocks`, `seashell frame`, `snow`, `snowy mountain`, `split frame`, `steve ross`, `structure`, `sun`, `tomb frame`, `trees`, `triple frame`, `waterfall`, `waves`, `windmill`, `window frame`, `winter`, `wood framed`.

---

#### **Available Months**
You can filter episodes by the following months:
- `january`, `february`, `march`, `april`, `may`, `june`, `july`, `august`, `september`, `october`, `november`, `december`.

---

#### **Available Colors**
Filter episodes using the following color options:
- `black gesso`, `bright red`, `burnt umber`, `cadmium yellow`, `dark sienna`, `indian red`, `indian yellow`, `liquid black`, `liquid clear`, `midnight black`, `phthalo blue`, `phthalo green`, `prussian blue`, `sap green`, `titanium white`, `van dyke brown`, `yellow ochre`, `alizarin crimson`.

---

### 📊 Example API Queries for Testing
Here’s how you can use these options to query the API:

- **Filter by Subject Matter**:
  ```plaintext
  http://localhost:5001/filter-subjects?mountains=1
  ```

  ```plaintext
  http://localhost:5001/filter-subjects?trees=1,moon=1
  ```

- **Filter by Month**:
  ```plaintext
  http://localhost:5001/filter-months?month=january
  ```
  ```plaintext
  http://localhost:5001/filter-months?month=march,december
  ```

- **Filter by Color**:
  ```plaintext
  http://localhost:5001/filter-colors?color=bright red
  ```
  

  ```
  http://localhost:5001/filter-colors?color=bright red, indian yellow
  ```

- **Combine Filters with Logical Conditions**:
  ```plaintext
  http://localhost:5001/filter-episodes?month=august&mountains=1&trees=1&bright red=1&sap green=1&filterLogic=AND
  ```
  ```plaintext
  http://localhost:5001/filter-episodes?month=august&mountains=1&trees=1&bright red=1&sap green=1&filterLogic=OR
  ```


These queries allow users to filter episodes dynamically using the provided subject matters, months, and colors.

---




## 🌟 Features

- **Dynamic Filtering**: Combine filters for month, subject, and colors.
- **Logical Querying**: Support for "match all" and "match any" logic.
- **RESTful API**: Return structured JSON responses for seamless front-end integration.

---

## 🤝 Contribution

Contributions are welcome! If you encounter any issues or have suggestions, feel free to open an issue or submit a pull request.




## Authors
 Abrielle Perry

 - <a href="mailto:abrielleperry22@icloud.com">Email</a>
 - [LinkedIn](www.linkedin.com/in/abriellerperry)
  - [GitHub](https://github.com/abrielleperry)


