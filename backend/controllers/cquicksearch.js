import { db } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

const quickSearchesCol = db.collection('quickSearches');

const getQuickSearch = async (req, res) => {
  try {
    const user_id = req.user.id;

    if (!user_id) {
      return res.status(210).json({ success: false, message: "User id is required" });
    }

    const snapshot = await quickSearchesCol.where('user_id', '==', user_id).limit(1).get();

    if (snapshot.empty) {
      return res.status(210).json({ success: false, message: "No quick search found for the user" });
    }

    res.status(202).json({ success: true, quickSearchText: snapshot.docs[0].data().quickSearchText });
  } catch (error) {
    res.status(210).json({ success: false, message: error.message });
  }
}

const addQuickSearch = async (req, res) => {
  try {
    const user_id = req.user.id;

    if (!user_id) {
      return res.status(210).json({ success: false, message: "User ID is required." });
    }

    const { quickSearchTextFromFrontend } = req.body;

    if (!quickSearchTextFromFrontend) {
      return res.status(210).json({ success: false, message: "Quick Search Text is required." });
    }

    const snapshot = await quickSearchesCol.where('user_id', '==', user_id).limit(1).get();

    if (snapshot.empty) {
      await quickSearchesCol.add({
        user_id,
        quickSearchText: [quickSearchTextFromFrontend],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return res.status(202).json({ success: true, message: "Quick Search added successfully." });
    }

    await snapshot.docs[0].ref.update({
      quickSearchText: FieldValue.arrayUnion(quickSearchTextFromFrontend),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.status(202).json({ success: true, message: "Quick Search updated successfully." });
  } catch (error) {
    return res.status(210).json({ success: false, message: error.message });
  }
};

const deleteQuickSearch = async (req, res) => {
  console.log("deleteQuickSearch");
  try {
    const user_id = req.user.id;

    if (!user_id) {
      return res.status(210).json({ success: false, message: "User id is required" });
    }

    const { quickSearchText } = req.body;
    console.log(quickSearchText);

    if (!quickSearchText) {
      return res.status(210).json({ success: false, message: "Quick Search Text is required" });
    }

    const snapshot = await quickSearchesCol.where('user_id', '==', user_id).limit(1).get();

    if (snapshot.empty) {
      return res.status(210).json({ success: false, message: "No quick search found for the user" });
    }

    await snapshot.docs[0].ref.update({
      quickSearchText: FieldValue.arrayRemove(quickSearchText),
      updatedAt: FieldValue.serverTimestamp(),
    });

    res.status(202).json({ success: true, message: "Quick Search deleted successfully" });

  } catch (error) {
    res.status(210).json({ message: error.message });
  }
}

export { addQuickSearch, deleteQuickSearch, getQuickSearch };
