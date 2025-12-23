const { google } = require("googleapis");
// Set up YouTube API client
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

async function videoExists(videoId) {
  return new Promise((resolve, reject) => {
    youtube.videos.list(
      {
        id: videoId,
        part: "id",
      },
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          const videos = res.data.items;
          if (videos.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      }
    );
  });
}
module.exports = { videoExists };
