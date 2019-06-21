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

const initWebRTCSession = () => {
  const peer = new SimplePeer({
    initiator: true,
    trickle: false,
  })

  peer.on("signal", signal => {
    console.log(signal)
  })
}

startStream()
initWebRTCSession()
