import { fetchCommenterProfileImage } from '../services/apiService';

// Fetch profile images for all commenters in the feeds
export const fetchAllCommentersProfileImages = async (feeds, setCommentersProfileImages) => {
  const newCommentersProfileImages = {};

  for (let feed of feeds) {
    for (let comment of feed.comments) {
      if (!newCommentersProfileImages[comment.user]) {
        try {
          const profileImage = await fetchCommenterProfileImage(comment.user, comment.userType);
          newCommentersProfileImages[comment.user] = profileImage;
        } catch (error) {
          console.error("Error fetching profile image for commenter:", comment.user, error);
        }
      }
    }
  }

  setCommentersProfileImages(newCommentersProfileImages);
};
