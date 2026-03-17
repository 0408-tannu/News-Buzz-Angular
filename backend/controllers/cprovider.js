import { db } from '../config/firebase.js';

const newsProvidersCol = db.collection('newsProviders');
const usersCol = db.collection('users');

const getAllProviders = async (req, res) => {
  try {
    const snapshot = await newsProvidersCol.get();
    const providers = snapshot.docs.map(doc => ({ ...doc.data(), _id: doc.id }));
    res.status(202).json({ success: true, providers });
  } catch (error) {
    console.error('[PROVIDER] Error getting all providers:', error);
    res.status(210).json({ success: false, message: error.message });
  }
};

const getFollowingProviders = async (req, res) => {
  try {
    const userDoc = await usersCol.doc(req.user.id).get();
    if (!userDoc.exists) {
      return res.status(210).json({ success: false, message: "User not found" });
    }

    const following = userDoc.data().following || [];

    if (following.length === 0) {
      return res.status(202).json({ success: true, providers: [] });
    }

    const providers = [];
    for (let i = 0; i < following.length; i += 30) {
      const batch = following.slice(i, i + 30);
      const snapshot = await newsProvidersCol.where('baseURL', 'in', batch).get();
      snapshot.docs.forEach(doc => providers.push({ ...doc.data(), _id: doc.id }));
    }

    res.status(202).json({ success: true, providers });
  } catch (error) {
    console.error('[PROVIDER] Error getting following providers:', error);
    res.status(210).json({ success: false, message: "Error while getting following providers" });
  }
};

export { getAllProviders, getFollowingProviders };
