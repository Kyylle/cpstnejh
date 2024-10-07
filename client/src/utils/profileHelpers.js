import { fetchCommenterProfileImage } from '../pages/Employer/services/apiService';

export const fetchAllCommentersProfileImages = async (feeds, setCommentersProfileImages) => {
  const newCommentersProfileImages = {};

  for (let feed of feeds) {
    for (let comment of feed.comments) {
      if (!newCommentersProfileImages[comment.user]) {
        const profileImage = await fetchCommenterProfileImage(comment.user, comment.userType);
        newCommentersProfileImages[comment.user] = profileImage;
      }
    }
  }

  setCommentersProfileImages(newCommentersProfileImages);
};
