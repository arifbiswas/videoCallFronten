// Extend the Navigator interface to include legacy methods
declare global {
  interface Navigator {
    getUserMedia?: (
      constraints: MediaStreamConstraints,
      successCallback: (stream: MediaStream) => void,
      errorCallback: (error: DOMException) => void
    ) => void;
    webkitGetUserMedia?: (
      constraints: MediaStreamConstraints,
      successCallback: (stream: MediaStream) => void,
      errorCallback: (error: DOMException) => void
    ) => void;
    mozGetUserMedia?: (
      constraints: MediaStreamConstraints,
      successCallback: (stream: MediaStream) => void,
      errorCallback: (error: DOMException) => void
    ) => void;
    msGetUserMedia?: (
      constraints: MediaStreamConstraints,
      successCallback: (stream: MediaStream) => void,
      errorCallback: (error: DOMException) => void
    ) => void;
  }
}

interface MediaConstraints {
  video?: boolean | MediaTrackConstraints;
  audio?: boolean | MediaTrackConstraints;
}

const getBrowserMedia = (constraints: MediaConstraints): Promise<MediaStream> => {
  // First, check for modern browser support
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  // Fallbacks for older browsers (legacy)
  const getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  // If one of the legacy methods is available
  if (getUserMedia) {
    return new Promise<MediaStream>((resolve, reject) => {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }

  // If neither modern nor legacy getUserMedia is available
  return Promise.reject(new Error("getUserMedia is not supported in this browser"));
};

export default getBrowserMedia;
