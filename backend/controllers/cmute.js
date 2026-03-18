import { db } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

const mutesCol = db.collection('mutes');

const addMute = async (req, res) => {
  const user_id = req.user.id;
  const { baseURL } = req.body;

  try {
    const snapshot = await mutesCol.where('user', '==', user_id).limit(1).get();

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      const data = snapshot.docs[0].data();
      const isURLExist = (data.mutedURL || []).includes(baseURL);

      if (isURLExist) {
        return res.status(210).json({ success: false, message: "URL already muted" });
      }

      await docRef.update({ mutedURL: FieldValue.arrayUnion(baseURL) });
      return res.status(202).json({ success: true, message: "Provider muted successfully" });
    }

    await mutesCol.add({
      user: user_id,
      mutedURL: [baseURL],
    });
    return res.status(202).json({ success: true, message: "Provider muted successfully" });

  } catch (error) {
    console.error("Error while muting provider:", error);
    return res.status(210).json({ success: false, message: "Internal server error while muting provider" });
  }
}

const removeMute = async (req, res) => {
  const user_id = req.user.id;
  const { baseURL } = req.body;

  try {
    const snapshot = await mutesCol.where('user', '==', user_id).limit(1).get();

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const isURLExist = (data.mutedURL || []).includes(baseURL);

      if (!isURLExist) {
        return res.status(210).json({ success: false, message: "URL not muted" });
      }

      await snapshot.docs[0].ref.update({ mutedURL: FieldValue.arrayRemove(baseURL) });
      return res.status(202).json({ success: true, message: "Provider unmuted successfully" });
    }

    return res.status(210).json({ success: false, message: "URL not muted" });

  } catch (error) {
    console.error("Error while unmuting provider:", error);
    return res.status(210).json({ success: false, message: "Internal server error while unmuting provider" });
  }
}

const getMute = async (req, res) => {
  const user_id = req.user.id;
  const { baseURL } = req.body;

  try {
    const snapshot = await mutesCol.where('user', '==', user_id).limit(1).get();

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const isURLExist = (data.mutedURL || []).includes(baseURL);

      if (isURLExist) {
        return res.status(202).json({ success: true, isMuted: true });
      } else {
        return res.status(202).json({ success: true, isMuted: false });
      }
    } else {
      return res.status(202).json({ success: true, isMuted: false });
    }

  } catch (error) {
    console.error("Error while getting mute status:", error);
    return res.status(210).json({ success: false, message: "Internal server error while getting mute status" });
  }
}

export { addMute, removeMute, getMute };
