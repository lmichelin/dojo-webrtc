const startStream = async () => {
  const videoElement = document.getElementById("video")

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    videoElement.srcObject = stream
  } catch (error) {
    console.error(error)
  }
}

const initWebRTCSession = async () => {
  const configuration = {}

  const pc = new RTCPeerConnection(configuration)
  const offer = await pc.createOffer()
  pc.setLocalDescription(offer)

  // send any ice candidates to the other peer
  pc.onicecandidate = ({ candidate }) => console.log({ candidate })
}

startStream()
initWebRTCSession()
