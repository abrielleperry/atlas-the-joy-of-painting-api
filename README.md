# atlas-the-joy-of-painting-api

Welcome to the **atlas-the-joy-of-painting-api** repository! This project is designed to support your local public broadcasting station by building a centralized database and API to manage and filter episodes of *The Joy of Painting* based on specific criteria requested by viewers.

---

## 📂 Resources

- **Bob Ross Episode Data CSV**: Contains episode details such as broadcast dates and subjects painted.
- **Bob Ross Paint Color Details CSV**: Includes the color palettes used in the episodes.

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

## 🛠️ Tasks Overview

### **Task 1: Design a Database**
Design a database to consolidate the provided data into a structure that supports efficient querying.

- **Requirements**:
  - Analyze the provided datasets and design a normalized database structure using UML diagrams.
  - Create SQL scripts to set up the database schema locally.

- **Deliverables**:
  - UML design document for the database.
  - SQL scripts for database creation.

### **Task 2: Extract, Transform, Load (ETL)**
Extract data from the provided files, transform it to fit the database structure, and load it into the database.

- **Requirements**:
  - Write custom scripts (in any programming language) to handle the ETL process.
  - Address inconsistencies and clean up data for accuracy.
  - Ensure data integrity to allow precise filtering in subsequent tasks.

- **Deliverables**:
  - ETL scripts to populate the database.

### **Task 3: API Development**
Build an API to allow users to filter episodes based on their desired criteria.

- **Features**:
  - Filter episodes by:
    - Month of broadcast.
    - Subject matter.
    - Color palette.
  - Support multiple filters and logical conditions (e.g., "match all" or "match any").
  - Return results in JSON format.
  - Handle queries via URL parameters, query strings, or POST data.

- **Deliverables**:
  - API implementation code.
  - Local testing capability (e.g., using Postman).

---

## 🚀 Getting Started

### Prerequisites
- A SQL database management system (e.g., MySQL, PostgreSQL, etc.).
- Python, Node.js, or your preferred language for scripting and API development.
- Postman (or similar tool) for testing the API.

### Steps to Run the Project
1. Clone this repository:
   ```bash
   git clone https://github.com/<your-username>/atlas-the-joy-of-painting-api.git
   cd atlas-the-joy-of-painting-api
   ```
2. Set up the database:
   - Review the UML design document.
   - Execute the SQL scripts to create the database schema.

3. Run the ETL process:
   - Execute the ETL scripts to populate the database with data from the CSV files.

4. Launch the API:
   - Run the API server locally.
   - Use Postman to send requests and verify the filtering functionality.

---

## 📁 Repository Structure
```
atlas-the-joy-of-painting-api/
│
├── data/
│   ├── bob_ross_episodes.csv         # Episode data
│   ├── bob_ross_colors.csv           # Paint color data
│
├── sql/
│   ├── database_schema.sql           # SQL scripts for database setup
│
├── etl/
│   ├── etl_script.py                 # ETL script (language-agnostic placeholder)
│
├── api/
│   ├── app.py                        # API implementation
│
├── docs/
│   ├── database_design.uml           # UML design document
│
├── tests/
│   ├── test_api.postman_collection   # Postman tests
│
└── README.md                         # Project documentation
```

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

