let canvas;
let frameQueue = new Queue();
let scaleFactor = 1;
let frameDelay = 0;
let frame;
let RadialVisualiser;
let horizontalVisualiser;
let backgroundGraphic;
let colorScheme = 0;
let avgAmplitude = 0;

function setup() {
  canvas = createCanvas(floor(screen.width * 0.6), floor(screen.height * 0.6));
  canvas.parent("CanvasParent");
  colorMode(HSB, 100);
  canvas.background(color(0, 0 ,0));
  frame = createGraphics(canvas.width, canvas.height);
  frame.pixelDensity(1);
  backgroundGraphic = createGraphics(canvas.width, canvas.height);
  backgroundGraphic.background(0);
  backgroundGraphic.pixelDensity(1);


  SpotifyHandler.initialise();
  ballVisualiser.initialise();
  JuliaSetVisualiser.initialise(12);
  RadialVisualiser = new radialVisualiser(0, 0, 128);
  horizontalVisualiser = new HorizontalVisualiser(0, 0, 1024);

  document.addEventListener('fullscreenchange', () => {const isFullscreen = Boolean(document.fullscreenElement);
    if(!isFullscreen) {
        resizeCanvas(floor(screen.width * 0.6), floor(screen.height * 0.6));
        frame.resizeCanvas(canvas.width, canvas.height);
        backgroundGraphic.resizeCanvas(canvas.width, canvas.height);
        backgroundGraphic.background(ColourManager.bgColor);

        sizeSketch(scaleFactor * 0.6)
    }
  });

}
function draw() {
    background(0);
    frame.background(0);
    //StaticArt.drawMandelbrotSet();
    frame.image(backgroundGraphic, 0, 0);

    //JuliaSetVisualiser.show(frame);

    if(analyser != null) {
        checkForNewSong();
        RadialVisualiser.showF(frame);
        //horizontalVisualiser.showF(frame);
        //ballVisualiser.show(frame);
    }

    //Frame Delay Buffer for bluetooth speakers:
    if(frameDelay == 0){
        image(frame, 0, 0);
    }
    else
    {
        frameQueue.enqueue(frame.get());
        if(frameQueue.length >= frameDelay)
        {
            let fr = frameQueue.dequeue();

            if(fr == frame)
                console.log("not changing frames");

            image(fr, 0, 0);
        }
    }
}

function UpdateBackground()
{
    StaticArt.radialGradient(ColourManager.bgColor, ColourManager.b2Color);
}

function setColorScheme(scheme)
{
    if(scheme > 1 && ColourManager.palette.length == 0)
    {
        scheme = colorScheme;
    }

    colorScheme = scheme;

    console.log(colorScheme);

}

function toggleFullscreen()
{
    const element = document.getElementById("CanvasParent");
    if (!document.fullscreenElement)  {
        // Enter fullscreen
        element.requestFullscreen().catch(err => {
            console.error('Enter fullscreen error:', err);
        });
        resizeCanvas(floor(screen.width), floor(screen.height));
        frame.resizeCanvas(canvas.width, canvas.height);
        backgroundGraphic.resizeCanvas(canvas.width, canvas.height);
        backgroundGraphic.background(ColourManager.bgColor);

        sizeSketch(scaleFactor /0.6)
    }
    //fullscreen(state);
}

function sizeSketch(factor)
{
    document.getElementById('scale').textContent = Number(factor).toFixed(2);

    scaleFactor = factor;
}

function addDelay(factor)
{
    document.getElementById('delay').textContent = Number(factor).toFixed(0);

    frameDelay = factor;

    frameQueue = new Queue();
}

function onNewSong()
{
    //backgroundGraphic.background(color(SpotifyHandler.details.energy * 100, 50, SpotifyHandler.details.valence * 100));
}

let lastAvgAmplitude = 0;
let lastDeltaAmp = 0;
let runningTroughs = new Queue();
let runningTroughAverage = 0;
let lastPeak = 0;
let lastTrough = 0;
let p = 0;

function checkForNewSong()
{
    avgAmplitude = getAvgAmplitude();
    let deltaAmp = avgAmplitude - lastAvgAmplitude;


    strokeWeight(5);
    stroke(0);

    if(lastDeltaAmp < 0 && deltaAmp > 0)
    {
        //console.log(avg + " - " + runningTroughAverage + " = " + Math.abs(avg - runningTroughAverage));

        if(Math.abs(avgAmplitude - lastPeak) > 27)
        {
            strokeWeight(12);
            stroke(color(0, 100, 100, 100));
            setTimeout(SpotifyHandler.updateSong, 1000);
            runningTroughs = new Queue();
            runningTroughAverage = 0;
        }
        /*if(Math.abs(avg - runningTroughAverage) > 17 && runningTroughs.length == 10)
        {
            strokeWeight(12);
            stroke(color(0, 100, 100, 100));
            console.log("before delay")
            setTimeout(SpotifyHandler.updateSong, 1000);
            runningTroughs = new Queue();
            runningTroughAverage = 0;
        }
        else
        {
            strokeWeight(10);
            runningTroughs.enqueue(avg);
            runningTroughAverage += avg / 10;
        }*/

        lastTrough = avgAmplitude;
    }

    if(lastDeltaAmp > 0 && deltaAmp < 0)
    {
        if(Math.abs(avgAmplitude - lastTrough) > 17)
        {
            strokeWeight(12);
            stroke(color(0, 100, 100, 100));
            console.log("before delay")
            setTimeout(SpotifyHandler.updateSong, 1000);
            runningTroughs = new Queue();
            runningTroughAverage = 0;
        }

        lastPeak = avgAmplitude;
    }

    //line(p, lastAvgAmplitude + 300, p + 1, avg + 300);
    p++;

    if(p > canvas.width) {
        background(255);
        p = 0;
    }

    if(runningTroughs.length > 10){
        runningTroughAverage -= runningTroughs.dequeue() / runningTroughs.length;
    }

    lastDeltaAmp = deltaAmp;
    lastAvgAmplitude = avgAmplitude;
}

function getAvgAmplitude()
{
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    analyser.getFloatFrequencyData(dataArray);

    let avg = 0.0;

    for(let i = 0; i < floor(bufferLength / 2); i++)
    {
        avg += dataArray[i];
    }

    return avg / (bufferLength/2);
}


