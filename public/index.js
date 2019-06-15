const socket = io.connect("/")

const video = document.getElementById("video")
const startButton = document.getElementById("startButton")

let peer

const startStream = initiator => {
  return navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then(stream => {
      peer = new SimplePeer({
        initiator,
        trickle: false,
        stream,
        config: { iceServers: [] },
      })

      peer.on("signal", signal => {
        socket.emit("clientSignal", signal)
      })

      peer.on("stream", stream => {
        video.srcObject = stream
      })

      peer.on("error", console.error)
    })
    .catch(console.error)
}

socket.on("otherClientSignal", async signal => {
  if (!peer) await startStream(false)
  peer.signal(signal)
})

startButton.addEventListener("click", () => startStream(true))
