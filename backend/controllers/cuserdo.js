import { db } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';

const bookmarksCol = db.collection('bookmarks');
const likesCol = db.collection('likes');
const usersCol = db.collection('users');
const newsProvidersCol = db.collection('newsProviders');
const commentsCol = db.collection('comments');


const getBookmarkArticle = async (req, res) => {
  const snapshot = await bookmarksCol.where('user_id', '==', req.user.id).get();
  const bookmarks = snapshot.docs.map(doc => ({ ...doc.data(), _id: doc.id }));
  return res.status(202).json({ success: true, bookmarks });
}

const isBookmarked = async (req, res) => {
  const { title, link } = req.body;

  if (!title || !link) {
    return res.status(210).json({ success: false, message: "Title and Link is required" });
  }

  const snapshot = await bookmarksCol
    .where('user_id', '==', req.user.id)
    .where('title', '==', title)
    .where('link', '==', link)
    .limit(1).get();

  if (snapshot.empty) {
    return res.status(202).json({ success: true, bookmarked: false });
  }

  return res.status(202).json({ success: true, bookmarked: true });
}

const addBookmarkArticle = async (req, res) => {
  const { title, link, providerImg, providerName, imgURL, someText } = req.body;

  if (!title && !link) {
    return res.status(210).json({ success: false, message: "Title and Link are required" });
  }

  await bookmarksCol.add({
    user_id: req.user.id, title, link, providerImg, providerName, imgURL, someText,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return res.status(202).json({ success: true, message: "Bookmark added successfully" });
}

const deleteBookmarkArticle = async (req, res) => {
  const { title, link } = req.body;

  if (!title && !link) {
    return res.status(210).json({ success: false, message: "Title and Link are required" });
  }

  const snapshot = await bookmarksCol
    .where('user_id', '==', req.user.id)
    .where('title', '==', title)
    .where('link', '==', link)
    .limit(1).get();

  if (!snapshot.empty) {
    await snapshot.docs[0].ref.delete();
  }

  return res.status(202).json({ success: true, message: "Bookmark deleted successfully" });
}

const addLikeArticle = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(210).json({ success: false, message: "Title is required" });
  }

  await likesCol.add({
    user_id: req.user.id, title,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return res.status(202).json({ success: true, message: "Like added successfully" });
}

const deleteLikeArticle = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(210).json({ success: false, message: "Title is required" });
  }

  const snapshot = await likesCol
    .where('user_id', '==', req.user.id)
    .where('title', '==', title)
    .limit(1).get();

  if (!snapshot.empty) {
    await snapshot.docs[0].ref.delete();
  }

  return res.status(202).json({ success: true, message: "Like deleted successfully" });
}

const isLiked = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(210).json({ success: false, message: "Title is required" });
  }

  const snapshot = await likesCol
    .where('user_id', '==', req.user.id)
    .where('title', '==', title)
    .limit(1).get();

  if (snapshot.empty) {
    return res.status(202).json({ success: true, liked: false });
  }

  return res.status(202).json({ success: true, liked: true });
}

const getNumLikes = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(210).json({ success: false, message: "title is required" });
  }

  const snapshot = await likesCol.where('title', '==', title).get();

  return res.status(202).json({ success: true, numLikes: snapshot.size });
}


const addComment = async (req, res) => {
  try {
    const { articleURL, comment } = req.body;

    if (!articleURL || !comment) {
      return res.status(210).json({
        success: false, message: "ArticleURL, Username, and Comment are required"
      });
    }

    const snapshot = await commentsCol.where('articleURL', '==', articleURL).limit(1).get();

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      const existingData = snapshot.docs[0].data();
      const users = existingData.user || [];
      users.push({
        username: req.user.username,
        comment,
        commentId: uuidv4(),
        timestamp: new Date(),
      });
      await docRef.update({ user: users });
      return res.status(210).json({ success: true, message: "Comment added successfully", username: req.user.username });
    } else {
      await commentsCol.add({
        articleURL,
        user: [
          {
            username: req.user.username,
            comment: comment,
            commentId: uuidv4(),
            timestamp: new Date(),
          }
        ],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return res.status(202).json({
        success: true, message: "Comment added successfully",
      });
    }

  } catch (error) {
    console.error("Failed to add comment:", error);
    return res.status(210).json({
      success: false,
      message: "Error while adding comment"
    });
  }
}

const deleteComment = async (req, res) => {
  try {
    const { articleURL, commentId } = req.body;

    if (!articleURL || !commentId) {
      return res.status(210).json({ success: false, message: "ArticleURL and timestamp are required" });
    }

    const snapshot = await commentsCol.where('articleURL', '==', articleURL).limit(1).get();

    if (snapshot.empty) {
      return res.status(210).json({ success: false, message: "Comment not found" });
    }

    const docRef = snapshot.docs[0].ref;
    const existingData = snapshot.docs[0].data();
    const filteredUsers = (existingData.user || []).filter((u) => u.commentId !== commentId);

    await docRef.update({ user: filteredUsers });

    return res.status(202).json({ success: true, message: "Comment deleted successfully" });

  } catch (error) {
    console.error('Failed to delete comment:', error);
    return res.status(210).json({ success: false, message: "Error while deleting comment" });
  }
}

const getCommentsOfArticles = async (req, res) => {
  try {
    const { articleURL } = req.body;

    if (!articleURL) {
      return res.status(210).json({ success: false, message: "ArticleURL is required" });
    }

    const snapshot = await commentsCol.where('articleURL', '==', articleURL).limit(1).get();

    if (snapshot.empty) {
      return res.status(210).json({ success: true, comments: [] });
    }

    const comments = snapshot.docs[0].data();

    return res.status(202).json({ success: true, comments: comments.user || [], loggedUserName: req.user.username });

  } catch (error) {
    console.error('Failed to get comments:', error);
    return res.status(210).json({ success: false, message: "Error while getting comments" });
  }
}

const getNumComments = async (req, res) => {
  try {
    const { articleURL } = req.body;

    if (!articleURL) {
      return res.status(210).json({ success: false, message: "ArticleURL is required" });
    }

    const snapshot = await commentsCol.where('articleURL', '==', articleURL).limit(1).get();

    if (snapshot.empty) {
      return res.status(202).json({ success: true, numComments: 0 });
    }

    const comments = snapshot.docs[0].data();

    return res.status(202).json({ success: true, numComments: (comments.user || []).length });

  } catch (error) {
    console.error('Failed to get comments:', error);
    return res.status(210).json({ success: false, message: "Error while getting comments" });
  }
}

const addFollow = async (req, res) => {
  const { baseURL } = req.body;
  if (!baseURL) {
    return res.status(210).json({ success: false, message: "BaseURL is required" });
  }

  const providerSnap = await newsProvidersCol.where('baseURL', '==', baseURL).limit(1).get();
  if (providerSnap.empty) {
    return res.status(210).json({ success: false, message: "Provider not found" });
  }

  const userRef = usersCol.doc(req.user.id);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    return res.status(210).json({ success: false, message: "User not found" });
  }

  await providerSnap.docs[0].ref.update({ followers: FieldValue.arrayUnion(req.user.id) });
  await userRef.update({ following: FieldValue.arrayUnion(baseURL) });

  return res.status(202).json({ success: true, message: "Followed successfully" });
}

const deleteFollow = async (req, res) => {
  const { baseURL } = req.body;
  if (!baseURL) {
    return res.status(210).json({ success: false, message: "BaseURL is required" });
  }

  const providerSnap = await newsProvidersCol.where('baseURL', '==', baseURL).limit(1).get();
  if (providerSnap.empty) {
    return res.status(210).json({ success: false, message: "Provider not found" });
  }

  const userRef = usersCol.doc(req.user.id);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    return res.status(210).json({ success: false, message: "User not found" });
  }

  await providerSnap.docs[0].ref.update({ followers: FieldValue.arrayRemove(req.user.id) });
  await userRef.update({ following: FieldValue.arrayRemove(baseURL) });

  return res.status(202).json({ success: true, message: "Unfollowed successfully" });
}

const isFollowed = async (req, res) => {
  try {
    const { baseURL } = req.body;
    if (!baseURL) {
      return res.status(210).json({ success: false, message: "BaseURL is required" });
    }

    const userDoc = await usersCol.doc(req.user.id).get();
    if (!userDoc.exists) {
      return res.status(202).json({ success: true, isFollowing: false });
    }

    const following = userDoc.data().following || [];
    return res.status(202).json({ success: true, isFollowing: following.includes(baseURL) });
  } catch (error) {
    console.error('Failed to check follow status:', error);
    return res.status(210).json({ success: false, message: "Error while checking follow status" });
  }
}

export { addBookmarkArticle, deleteBookmarkArticle, getBookmarkArticle, isBookmarked, addLikeArticle, deleteLikeArticle, isLiked, addFollow, deleteFollow, isFollowed, addComment, deleteComment, getCommentsOfArticles, getNumLikes, getNumComments };
