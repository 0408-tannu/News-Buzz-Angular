import { db } from '../config/firebase.js';

const searchLocationsCol = db.collection('searchLocations');

const addSearchLocation = async (req, res, Text) => {
  let searchText = Text;
  console.log(searchText);
  searchText = searchText.toLowerCase();
  const user_id = req.user.id;

  if (!searchText) {
    return res.status(210).json({ success: false, message: "Search Text is required" });
  }

  const snapshot = await searchLocationsCol.where('user_id', '==', user_id).limit(1).get();

  if (snapshot.empty) {
    await searchLocationsCol.add({
      user_id,
      searchText: [{ text: searchText, count: 1, updatedAt: new Date().toISOString() }],
    });
    return;
  }

  const docRef = snapshot.docs[0].ref;
  const data = snapshot.docs[0].data();
  const searchTextArray = data.searchText || [];

  const existingIndex = searchTextArray.findIndex((s) => s.text === searchText);

  if (existingIndex >= 0) {
    searchTextArray[existingIndex].count += 1;
    searchTextArray[existingIndex].updatedAt = new Date().toISOString();
  } else {
    searchTextArray.push({ text: searchText, count: 1, updatedAt: new Date().toISOString() });
  }

  await docRef.update({ searchText: searchTextArray });
  return;
}

export { addSearchLocation };
