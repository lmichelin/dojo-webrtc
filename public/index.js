const socket = io.connect("/")

socket.on("offer", (message) => receiveWebRTCSession(message))

const initWebRTCSession = async () => {
  try {
    const configuration = {}
  
    const pc = new RTCPeerConnection(configuration)
  
    pc.onnegotiationneeded = async () => {
      const offer = await pc.createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
      })
      await pc.setLocalDescription(offer)
    
      socket.emit('offer', offer)
    }

    // send any ice candidates to the other peer
    pc.onicecandidate = ({ candidate }) => {
      console.log("ice candidate", candidate);
      if (candidate) {
        socket.emit("icecandidate", candidate)
      }
    }
  
    socket.on("icecandidate", candidate => {
      console.log("received Ice candidate", candidate);
      pc.addIceCandidate(new RTCIceCandidate(candidate))
    })

    socket.on("answer", answer => {
      console.log(answer);
      pc.setRemoteDescription(new RTCSessionDescription(answer))
    })
  
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

  } catch (error) {
    console.error(error);
  }
}

const receiveWebRTCSession = async (message) => {
  try {
    const configuration = {}
    const pc = new RTCPeerConnection(configuration)
  
    await pc.setRemoteDescription(new RTCSessionDescription(message))
    const answer = await pc.createAnswer()
    
    await pc.setLocalDescription(answer)
    
    socket.emit("answer", pc.localDescription)
  
    socket.on("icecandidate", candidate => {
      if (candidate) {
        pc.addIceCandidate(new RTCIceCandidate(candidate))
      }
    })

    pc.ontrack = (track) => {
      console.log(track);
      // const videoElement = document.getElementById("video")
      // videoElement.srcObject = stream;
    }
  
  } catch (error) {
    console.error(error);
  }
}

startButton.addEventListener("click", initWebRTCSession)
// startStream()
