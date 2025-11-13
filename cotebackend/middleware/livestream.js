const { google } = require('googleapis');
// Set up YouTube API client
const youtube = google.youtube({
  version: 'v3',
  auth: 'AIzaSyDw6CP54PZ1ISALxFRxZnEhVBg_87tx3bA'
});
async function Livestream(videoId) {
  return new Promise((resolve, reject) => {
    youtube.videos.list({
      id: videoId,
      part: 'id,liveStreamingDetails'
    }, (err, res) => {
      if (err) {
        reject(err);
      } else {
        const videos = res.data.items;
        if (videos.length > 0) {
            const liveDetails = videos[0].liveStreamingDetails;
            if (liveDetails && liveDetails.actualStartTime && !liveDetails.actualEndTime) {
              resolve({ exists: true, isLive: true });
            } else {
              resolve({ exists: true, isLive: false });
            }
          } else {
            resolve({ exists: false, isLive: false });
          }
      }
    });
  });
}
module.exports = { Livestream };
