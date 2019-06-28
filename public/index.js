const socket = io.connect("/")

socket.on("offer", signal => {
  receiveWebRTCSession(signal)
})

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
    socket.emit("offer", signal)
  })

  socket.on("answer", answer => {
    peer.signal(answer)
  })

  peer.on("connect", () => {
    console.log("connected")
  })
}

const receiveWebRTCSession = offer => {
  const peer = new SimplePeer({})

  peer.signal(offer)

  peer.on("signal", answer => {
    socket.emit("answer", answer)
  })
}

const startButton = document.getElementById("startButton")

startButton.addEventListener("click", initWebRTCSession)
