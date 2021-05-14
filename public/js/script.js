
(function(){
  const $ = document.querySelector.bind(document);
  const controls = $('.takephoto__buttons');
  const cameraOptions = $('.video-options>select');
  const videoArea = $('video');
  const photolist = $('.photolist')
  const buttons = [...controls.querySelectorAll('button')];
  let startStreaming = false;
  
  const [start, screenshot] = buttons;
  $('body').style.background = 'url("/img/4.jpg") no-repeat center center fixed';
  const videoConstraints = {
    video: {
      width: {
        min: 1280,
        ideal: 1920,
        max: 2560,
      },
      height: {
        min: 720,
        ideal: 1080,
        max: 1440
      },
    }
  };
  
  const getCameras = async () => {
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
    const options = videoDevices.map(videoDevice => 
       `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`
  );
    cameraOptions.innerHTML = options.join('');
  };
  
  start.onclick = () => {
    if (startStreaming) {
      videoArea.play();
      start.classList.add('display-off');
      return;
    }
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
      const updatedConstraints = {
        ...videoConstraints,
        deviceId: {
          exact: cameraOptions.value
        }
      };
      startStream(updatedConstraints);
    }
  };
  
  const startStream = async (videoConstraints) => {
    const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
    streamHandling(stream);
  };
  
  const streamHandling = (stream) => {
    videoArea.srcObject = stream;
    start.classList.add('display-off');
    screenshot.classList.remove('display-off');
    startStreaming = true;
  };
  
  getCameras();
  cameraOptions.onchange = () => {
      const updatedConstraints = {
        ...videoConstraints,
        deviceId: {
          exact: cameraOptions.value
        }
      };
      startStream(updatedConstraints);
    };
    
    
    const doScreenshot = () => {
      const newCanvas = document.createElement('canvas');
      newCanvas.classList.add('display-off');
      newCanvas.classList.add('canvas-styles');
      newCanvas.width = videoArea.videoWidth;
      newCanvas.height = videoArea.videoHeight;
      newCanvas.getContext('2d').drawImage(videoArea, 0, 0);
      photolist.appendChild(newCanvas);
      var image = newCanvas.toDataURL("image/png");
      postData('/img', {image})
      .then(data => {
        console.log(data); 
      });
    };
    async function postData(url = '', data = {}) {
      const response = await fetch(url, {
        method: 'POST', 
        mode: 'cors', 
        cache: 'no-cache',
        credentials: 'same-origin', 
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer', 
        body: JSON.stringify(data)
      });
      return response.json();
    }
    
    screenshot.onclick = doScreenshot;
  })();