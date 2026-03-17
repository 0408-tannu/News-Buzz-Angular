import { db } from '../config/firebase.js';

const reportArticlesCol = db.collection('reportArticles');
const newsProvidersCol = db.collection('newsProviders');

const AddreportArticles = async (req, res) => {
  try {
    const { title, link, num } = req.body;

    const snapshot = await reportArticlesCol.where('link', '==', link).limit(1).get();

    if (!snapshot.empty) {
      await snapshot.docs[0].ref.update({ num: num + 1 });
      return res.status(202).json({ success: true, message: "Article Reported Successfully" });
    } else {
      await reportArticlesCol.add({ title, link, num: num || 1, feedback: [] });
      return res.status(202).json({ success: true, message: "Article Reported Successfully" });
    }
  } catch (error) {
    res.status(210).json({ error: error.message });
  }
}

const GetreportArticles = async (req, res) => {
  try {
    const providerSnap = await newsProvidersCol.where('provider_id', '==', req.user.id).limit(1).get();

    if (providerSnap.empty) {
      return res.status(210).json({ success: false, message: "Error finding Provider" });
    }

    const BaseURL = providerSnap.docs[0].data().baseURL;

    // Firestore doesn't support regex, so we fetch all and filter client-side
    const allReports = await reportArticlesCol.get();
    const reportarticles = allReports.docs
      .map(doc => ({ ...doc.data(), _id: doc.id }))
      .filter(report => report.link && report.link.startsWith(BaseURL));

    return res.status(202).json({ success: true, reportarticles });
  } catch (error) {
    console.error("Error fetching report articles:", error);
    return res.status(210).json({ success: false, message: "Internal Server Error" });
  }
};

export { AddreportArticles, GetreportArticles };
