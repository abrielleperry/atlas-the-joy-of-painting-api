const filterEpisodes = async (db, query) => {
  const { months, subjects, colors, match = "all" } = query;

  const colorsCollection = db.collection("colors_used");
  const datesCollection = db.collection("episode_dates");
  const subjectsCollection = db.collection("subject_matter");

  const filters = [];

  if (months) {
    const monthsArray = months.split(",").map((month) => month.trim());
    const monthFilter = { date: { $regex: `-${monthsArray.join("|")}-` } };
    const monthResults = await datesCollection.find(monthFilter).toArray();
    const monthTitles = monthResults.map((doc) => doc.title);
    filters.push(monthTitles);
  }

  if (subjects) {
    const subjectsArray = subjects.split(",").map((subject) => subject.trim());
    const subjectFilter = { $or: subjectsArray.map((subject) => ({ [subject]: true })) };
    const subjectResults = await subjectsCollection.find(subjectFilter).toArray();
    const subjectTitles = subjectResults.map((doc) => doc.title);
    filters.push(subjectTitles);
  }

  if (colors) {
    const colorsArray = colors.split(",").map((color) => color.trim());
    const colorFilter = { $or: colorsArray.map((color) => ({ [color]: { $exists: true } })) };
    const colorResults = await colorsCollection.find(colorFilter).toArray();
    const colorTitles = colorResults.map((doc) => doc.title);
    filters.push(colorTitles);
  }

  let finalTitles;
  if (match === "all") {
    finalTitles = filters.reduce((acc, curr) =>
      acc.filter((title) => curr.includes(title))
    );
  } else {
    finalTitles = Array.from(new Set(filters.flat()));
  }

  const results = await Promise.all(
    finalTitles.map(async (title) => {
      const colorDoc = await colorsCollection.findOne({ title });
      const dateDoc = await datesCollection.findOne({ title });
      const subjectDoc = await subjectsCollection.findOne({ title });

      return {
        title,
        date: dateDoc?.date || null,
        subjects: subjectDoc || {},
        colors: colorDoc || {},
      };
    })
  );

  return results;
};

module.exports = { filterEpisodes };
