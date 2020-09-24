import config from './config.js'

let img = new Image();
img.src = './assets/picture/dl.png';
img.onload = function() {
  draw(this);
};

function draw(img) {
  const subject = document.getElementById('subject')
  subject.width = img.width
  subject.height = img.height

  const ctxSubject = subject.getContext('2d')
  ctxSubject.drawImage(img, 0, 0)

  const newSubject = document.getElementById("newSubject")
  newSubject.width = img.width
  newSubject.height = img.height

  const ctxNewSubject = newSubject.getContext('2d')
  ctxNewSubject.drawImage(img, 0, 0)

  img.style.display = 'none'
  let imageData = ctxSubject.getImageData(0, 0, subject.width, subject.height)
  let data = imageData.data
  let buffer = new Uint8ClampedArray(img.width * img.height * 4) //have enough bytes

  let deplace = function(key) {
    let max = 40
    let min = 1
    let jumpPixelx = Math.floor(Math.random() * (max - min) + min)
    let jumpPixely = Math.floor(Math.random() * (max - min) + min)
    // if (key % 2)
    // {
    //   jumpPixel = 20
    // }
    // else if (key % 9)
    // {
    //   jumpPixel = 54
    // }
    // else
    // {
    //   jumpPixel = 10
    // }


    //console.log(imageData)
    //console.log(data)

    // Copy of an image pixel by pixel on buffer
    ctxSubject.putImageData(imageData, 0, 0);
    //let buffer = new Uint8ClampedArray(img.width * img.height * 4) //have enough bytes
    for(let y = 0; y < img.height; y+=jumpPixely) {
      for(let x = 0; x < img.width; x+=jumpPixelx) {
        let pos = (y * img.width + x) * 4
        let distance, randomR, randomG, randomB

        let currentPixel = ctxNewSubject.getImageData(x, y, 1, 1)

        if (x%4 && (key === 'KeyA'|| key > 3000)) {
          //Distance value of movement
          distance = Math.floor(-33 * Math.random() + 15)

          //RGB random value between 0 to 255 do not exceed 255
          randomR = 0
          randomG = 0
          randomB = 0
        } else if (key === 'KeyS'|| key > 2000) {
          //Distance value of movement
          distance = Math.floor(-33 * Math.random() + 15)

          //RGB random value between 0 to 255 do not exceed 255
          randomR = 0
          randomG = 0
          randomB = 0
        } else if (key === 'KeyD'|| key > 1500) {
          //Distance value of movement
          distance = Math.floor(-33 * Math.random() + 15)

          //RGB random value between 0 to 255 do not exceed 255
          randomR = 0//Math.floor(Math.random() * (255 - 0) + 0)
          randomG = 0//Math.floor(Math.random() * (255 - 0) + 0)
          randomB = 0//Math.floor(Math.random() * (255 - 0) + 0)
        }
        else if (key === 'KeyF'|| key > 1000) {
          //Distance value of movement
          distance = Math.floor(-33 * Math.random() + 115)

          //RGB random value between 0 to 255 do not exceed 255
          randomR = 0
          randomG = 0
          randomB = 0

        }
        else if (key === 'KeyG'|| key > 500) {
          //Distance value of movement
          distance = Math.floor(-33 * Math.random() + 1115)

          //RGB random value between 0 to 255 do not exceed 255
          randomR = 0
          randomG = 0
          randomB = 0

          //currentPixel = ctxSubject.getImageData(x, y, 1, 1)
        }
        else if (key === 'KeyH'|| key > 300) {
          //Distance value of movement
          distance = 15

          //RGB random value between 0 to 255 do not exceed 255
          randomR = 0
          randomG = 0
          randomB = 0

          currentPixel = ctxSubject.getImageData(x, y, 1, 1)
        }
        else if (key === 'KeyJ'|| key == -1) {
          //Distance value of movement
          distance = 20

          //RGB random value between 0 to 255 do not exceed 255
          randomR = 0
          randomG = 0
          randomB = 0
        }
        else {
          //Distance value of movement
          distance = 0

          //RGB random value between 0 to 255 do not exceed 255
          randomR = 0
          randomG = 0
          randomB = 0

          currentPixel = ctxSubject.getImageData(x, y, 1, 1)
        }
        let dataPixel = currentPixel.data

        //Calculate pixel buffer with different variable
        buffer[pos + 0 + distance * 4 ] = dataPixel[0] - randomR   //some R value [0, 255]
        buffer[pos + 1 + distance * 4 ] = dataPixel[1] - randomG   //some G value
        buffer[pos + 2 + distance * 4 ] = dataPixel[2] - randomB   //some B value
        buffer[pos + 3 + distance * 4 ] = dataPixel[3]   //set alpha channel
      }
    }
    //console.log('buffer', buffer);

    // Print image using the copy pixel by pixel
    let newImageData = new ImageData(buffer, img.width, img.height);
    ctxNewSubject.putImageData(newImageData, 0, 0);


    //console.log('source', imageData);
    //console.log('final', newImageData);
  };
  ctxSubject.putImageData(imageData, 0, 0);


  const myInput = document.getElementById('sample');
  myInput.addEventListener('keypress', (e) => {
    //console.log(e.code);
    deplace(e.code)
  })


  const BaseAudioContext = window.AudioContext || window.webkitAudioContext
  const context = new BaseAudioContext()
  let sourceNode
  let analyser
  let player
  let buflen = 1024;
  let buf = new Float32Array( buflen )

  const playSound = () => {
    player = context.createBufferSource()

    console.log('sample rate', context.sampleRate)

    player.connect(context.destination)

    fetch('./assets/sound/enstl.mp3')
      .then(response => response.arrayBuffer())
      .then(binAudio => context.decodeAudioData(binAudio))
      .then(buffer => {
        sourceNode = context.createBufferSource()
        sourceNode.buffer = buffer
        analyser = context.createAnalyser()
        analyser.fftSize = 2048
        sourceNode.connect( analyser )
        analyser.connect( context.destination )
        // sourceNode.start( 0 )
        // updatePitch()
      })
  }

  let pitch

  function updatePitch( time ) {
    var cycles = new Array;
    analyser.getFloatTimeDomainData( buf );
    var ac = autoCorrelate( buf, context.sampleRate );

    console.log(ac);
     if (ac == -1) {
       console.log('Nothinnnng');
       pitch = ac;
       deplace(pitch)
       // detectorElem.className = "vague";
       // pitchElem.innerText = "--";
      // noteElem.innerText = "-";
      // detuneElem.className = "";
      // detuneAmount.innerText = "--";
     } else {
       // detectorElem.className = "confident";
        pitch = ac;
        console.log('Pitch: ' + Math.round( pitch ));
        deplace(pitch)

       // var note =  noteFromPitch( pitch );
      // noteElem.innerHTML = noteStrings[note%12];
      // var detune = centsOffFromPitch( pitch, note );
      // if (detune == 0 ) {
      // 	detuneElem.className = "";
      // 	detuneAmount.innerHTML = "--";
      // } else {
      // 	if (detune < 0)
      // 		detuneElem.className = "flat";
      // 	else
      // 		detuneElem.className = "sharp";
      // 	detuneAmount.innerHTML = Math.abs( detune );
      // }
    }
  }

  var MIN_SAMPLES = 0;  // will be initialized when AudioContext is created.
  var GOOD_ENOUGH_CORRELATION = 0.9; // this is the "bar" for how close a correlation needs to be

  function autoCorrelate( buf, sampleRate ) {
    var SIZE = buf.length
    var MAX_SAMPLES = Math.floor(SIZE/2)
    var best_offset = -1
    var best_correlation = 0
    var rms = 0
    var foundGoodCorrelation = false
    var correlations = new Array(MAX_SAMPLES)

    for (var i=0;i<SIZE;i++) {
      var val = buf[i]
      rms += val*val
    }
    rms = Math.sqrt(rms/SIZE)
    if (rms<0.01) // not enough signal
      return -1

    var lastCorrelation=1
    for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
      var correlation = 0

      for (var i=0; i<MAX_SAMPLES; i++) {
        correlation += Math.abs((buf[i])-(buf[i+offset]))
      }
      correlation = 1 - (correlation/MAX_SAMPLES)
      correlations[offset] = correlation // store it, for the tweaking we need to do below.
      if ((correlation>GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
        foundGoodCorrelation = true
        if (correlation > best_correlation) {
          best_correlation = correlation
          best_offset = offset
        }
      } else if (foundGoodCorrelation) {
        // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
        // Now we need to tweak the offset - by interpolating between the values to the left and right of the
        // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
        // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
        // (anti-aliased) offset.

        // we know best_offset >=1,
        // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and
        // we can't drop into this clause until the following pass (else if).
        var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset]
        return sampleRate/(best_offset+(8*shift))
      }
      lastCorrelation = correlation;
    }
    if (best_correlation > 0.01) {
      // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
      return sampleRate/best_offset;
    }
    return -1;
  //	var best_frequency = sampleRate/best_offset;
  }

  playSound()
  const button = document.getElementById('play')
  button.addEventListener('click', () => {
    sourceNode.start( 0 )
    window.setInterval(() => updatePitch(), 0.05)
  })
}

const button = document.getElementById('save')
button.addEventListener('click', () => {
  console.log('save');
  const canvas = document.getElementById('newSubject')
    canvas.toBlob(
      (blob) => {
        let file = canvas.toDataURL()
        let title = 'myNewImage'

        const formData = new FormData()
        formData.append('title', title)
        formData.append('experiment', blob, 'truc.jpg')
        fetch('http://localhost:3001/experiment', {
          method: 'POST',
          body: formData,
        }).then(res => console.log(res.text()))
      },
      'image/jpeg',
      0.95,
    )
})


// document.addEventListener('DOMContentLoaded', () => {
//   playSound()
//   const button = document.getElementById('play')
//   button.addEventListener('click', () => {
//     sourceNode.start( 0 )
//     window.setInterval(() => updatePitch(), 10)
//   })
// })
