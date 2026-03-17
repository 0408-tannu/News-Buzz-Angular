import { db } from '../config/firebase.js';

const historyCol = db.collection('history');

const gethistory = async (req, res, next) => {
  const user_id = req.user.id;
  const snapshot = await historyCol.where('userid', '==', user_id).limit(1).get();

  if (!snapshot.empty) {
    const data = snapshot.docs[0].data();
    res.status(202).json({ success: true, data: data.historyData });
  } else {
    res.status(210).json({ success: false, message: "No History Found" });
  }
}

const removehistory = async (req, res, next) => {
  const user_id = req.user.id;
  const { baseURL } = req.body;

  const snapshot = await historyCol.where('userid', '==', user_id).limit(1).get();

  if (!snapshot.empty) {
    const docRef = snapshot.docs[0].ref;
    const data = snapshot.docs[0].data();
    const newHistory = data.historyData.filter((item) => item.link !== baseURL);
    await docRef.update({ historyData: newHistory });
    res.status(202).json({ success: true, message: "Article Removed from History" });
  } else {
    res.status(210).json({ success: false, message: "History of Article not Found" });
  }
}

const addhistory = async (req, res, next) => {
  const user_id = req.user.id;
  const { title, link } = req.body;

  const snapshot = await historyCol.where('userid', '==', user_id).limit(1).get();

  if (!snapshot.empty) {
    const docRef = snapshot.docs[0].ref;
    const data = snapshot.docs[0].data();
    const historyData = data.historyData || [];
    historyData.unshift({ title, link, time: new Date().toISOString() });
    await docRef.update({ historyData });
    res.status(202).json({ success: true, message: "Article Added to History" });
  } else {
    await historyCol.add({
      userid: user_id,
      historyData: [{ title, link, time: new Date().toISOString() }]
    });
    res.status(202).json({ success: true, message: "Article Added to History" });
  }
}

const removeallhistory = async (req, res, next) => {
  const user_id = req.user.id;

  const snapshot = await historyCol.where('userid', '==', user_id).limit(1).get();

  if (!snapshot.empty) {
    await snapshot.docs[0].ref.update({ historyData: [] });
    res.status(202).json({ success: true, message: "All History Articles Deleted" });
  } else {
    res.status(210).json({ success: false, message: "No History Found" });
  }
}

export { gethistory, addhistory, removehistory, removeallhistory };
