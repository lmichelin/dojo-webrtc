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

startStream()
