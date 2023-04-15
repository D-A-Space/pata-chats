export const scrollTranscriptWindow = () => {
  const transcriptWindow = document.getElementById("chat");
  setTimeout(() => {
    transcriptWindow?.scroll({
      top: transcriptWindow.scrollHeight,
      behavior: "smooth",
    });
  }, 500);
};
