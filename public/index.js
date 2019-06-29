const socket = io.connect("/")

socket.on("offer", signal => {
  startStream(false, signal)
})

const startStream = async (isInitiator, offer) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    const peer = new SimplePeer({
      initiator: isInitiator,
      trickle: false,
      stream,
    })

    if (isInitiator) {
      initWebRTCSession(peer)
    } else {
      receiveWebRTCSession(peer, offer)
    }

    peer.on("stream", stream => {
      const videoElement = document.getElementById("video")
      videoElement.srcObject = stream
    })
  } catch (error) {
    console.error(error)
  }
}

const initWebRTCSession = peer => {
  peer.on("signal", signal => {
    socket.emit("offer", signal)
  })

  socket.on("answer", answer => {
    peer.signal(answer)
  })

  peer.on("connect", () => {
    console.log("connected")
  })
}

const receiveWebRTCSession = (peer, offer) => {
  peer.signal(offer)

  peer.on("signal", answer => {
    socket.emit("answer", answer)
  })
}

const startButton = document.getElementById("startButton")

startButton.addEventListener("click", () => startStream(true))
