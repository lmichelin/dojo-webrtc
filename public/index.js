const socket = io.connect("/")

const sendFile = peer => {
  const fileInput = document.getElementById("fileInput")

  if (fileInput.files && fileInput.files[0]) {
    peer.send(fileInput.files[0])
    return
  }

  alert("Please choose a file!")
}

const downloadBlob = blob => {
  let url = URL.createObjectURL(blob)
  let aElement = document.createElement("a")
  aElement.setAttribute("href", url)
  let filename = new Date().toISOString().split(".")[0]
  aElement.setAttribute("download", filename)
  aElement.style.display = "none"
  document.body.appendChild(aElement)
  aElement.click()
  document.body.removeChild(aElement)
  URL.revokeObjectURL(url)
}

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

    peer.on("data", data => {
      const blob = new Blob([new Uint8Array(data)]) // https://stackoverflow.com/questions/44147912/arraybuffer-to-blob-conversion?answertab=votes#tab-top
      downloadBlob(blob)
    })

    const sendButton = document.getElementById("sendButton")

    sendButton.addEventListener("click", () => sendFile(peer))
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
