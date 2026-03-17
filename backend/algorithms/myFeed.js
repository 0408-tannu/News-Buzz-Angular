import { db } from "../config/firebase.js";
import { ScrapForFeed } from "../algorithms/ScrapForFeed.js";

const searchLocationsCol = db.collection('searchLocations');
const usersCol = db.collection('users');
const quickSearchesCol = db.collection('quickSearches');

const DEFAULT_TOPICS = ['Technology', 'World News', 'Science', 'Business', 'Sports', 'Entertainment', 'Health', 'Education'];

const getTextByCount = async (id) => {
  const snapshot = await searchLocationsCol.where('user_id', '==', id).limit(1).get();

  if (snapshot.empty) {
    // No search history — try quickSearches (user's saved topics)
    console.log("[FEED] No searchLocations for user, checking quickSearches");
    const qsSnapshot = await quickSearchesCol.where('user_id', '==', id).limit(1).get();
    if (!qsSnapshot.empty) {
      const qsData = qsSnapshot.docs[0].data();
      const texts = qsData.quickSearchText || [];
      if (texts.length > 0) {
        console.log("[FEED] Using quickSearches:", texts);
        return texts.slice(0, 8);
      }
    }
    // Fallback to defaults
    console.log("[FEED] Using default topics");
    return DEFAULT_TOPICS;
  }

  const data = snapshot.docs[0].data();
  const searchTextArray = data.searchText || [];

  if (searchTextArray.length === 0) {
    console.log("[FEED] searchLocations exists but empty, using defaults");
    return DEFAULT_TOPICS;
  }

  // Sort by count descending
  const byCount = [...searchTextArray].sort((a, b) => (b.count || 0) - (a.count || 0));
  // Sort by updatedAt descending
  const byUpdatedAt = [...searchTextArray].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return dateB - dateA;
  });

  const textArrayForCount = byCount.map(item => item.text);
  const textArrayForUpdatedAt = byUpdatedAt.map(item => item.text);

  const interleavedSet = new Set();
  const maxLength = 8;

  const totalLength = Math.max(textArrayForCount.length, textArrayForUpdatedAt.length);

  for (let i = 0; i < totalLength; i++) {
    if (interleavedSet.size >= maxLength) break;

    if (i < textArrayForCount.length) {
      interleavedSet.add(textArrayForCount[i]);
    }
    if (interleavedSet.size >= maxLength) break;

    if (i < textArrayForUpdatedAt.length) {
      interleavedSet.add(textArrayForUpdatedAt[i]);
    }
  }
  const interleavedArray = Array.from(interleavedSet);

  if (interleavedArray.length === 0) {
    return DEFAULT_TOPICS;
  }
  return interleavedArray;
};


let TextArray = [];


const ByText = async (req, res) => {

  try {
    const { id } = req.user;
    const textId = parseInt(req.params.textId);

    console.log("[FEED] ByText request - textId:", textId, "userId:", id);

    if (textId === 0) {
      TextArray = (await getTextByCount(id));
      console.log("[FEED] Loaded TextArray:", TextArray);
    }

    if (!TextArray || TextArray.length === 0) {
      console.log("[FEED] TextArray is empty, returning empty");
      return res.status(202).json({ success: true, partialArticles: [] });
    }

    if (textId >= TextArray.length) {
      console.log("[FEED] textId", textId, "exceeds TextArray length", TextArray.length);
      return res.status(202).json({ success: true, partialArticles: [] });
    }

    const searchTerm = TextArray[textId];
    if (!searchTerm) {
      console.log("[FEED] No search term at index", textId);
      return res.status(202).json({ success: true, partialArticles: [] });
    }

    console.log("[FEED] Scraping for:", searchTerm);
    let ArticlesByText = (await ScrapForFeed([searchTerm]));
    return res.status(202).json({ success: true, partialArticles: ArticlesByText });
  } catch (error) {
    console.error("[FEED] Error in ByText:", error);
    return res.status(210).json({ success: false, message: "Internal Server Error" });
  }
};


let userTopics = [];


const ByTopic = async (req, res) => {

  try {
    const { id } = req.user;
    const topicId = parseInt(req.params.topicId);

    console.log("[FEED] ByTopic request - topicId:", topicId, "userId:", id);

    if (topicId === 0) {
      const userDoc = await usersCol.doc(id).get();

      if (!userDoc.exists) {
        return res.status(210).json({ success: false, message: "User not found" });
      }

      const user = userDoc.data();
      userTopics = user.topics || [];

      // If user has no topics, use defaults
      if (userTopics.length === 0) {
        console.log("[FEED] User has no topics, using defaults");
        userTopics = DEFAULT_TOPICS;
      }

      console.log("[FEED] Loaded userTopics:", userTopics);
    }

    if (topicId >= userTopics.length) {
      console.log("[FEED] topicId", topicId, "exceeds userTopics length", userTopics.length);
      return res.status(202).json({ success: true, partialArticles: [] });
    }

    const topic = userTopics[topicId];
    if (!topic) {
      console.log("[FEED] No topic at index", topicId);
      return res.status(202).json({ success: true, partialArticles: [] });
    }

    console.log("[FEED] Scraping for topic:", topic);
    let ArticlesByTopic = (await ScrapForFeed([topic]));
    return res.status(202).json({ success: true, partialArticles: ArticlesByTopic });

  } catch (error) {
    console.error("[FEED] Error in ByTopic:", error);
    return res.status(210).json({ success: false, message: "Internal Server Error" });
  }
}

export { ByText, ByTopic };
