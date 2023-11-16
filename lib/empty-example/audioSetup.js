
let audioContext = null;
let analyser = null;

let data = [];
let mediaRecorder;

let recordTimer = 0;
let recording = false;
let speakerStream;

async function setupAudio()
{
    audioContext = new AudioContext();

    analyser = audioContext.createAnalyser();
    let stream = new MediaStream();
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });
        speakerStream = await navigator.mediaDevices.getDisplayMedia({
            audio: {
                sampleRate: 44100,
            },
            video: {
                frameRate: 30,
                cursor: "never",
                width: {
                    ideal: screen.width,
                },
                height:{
                    ideal: screen.height,
                },
            },
        });
    }catch (e) {
        console.log(e);
    }


    const speakerSource = audioContext.createMediaStreamSource(speakerStream);
    const micSource = audioContext.createMediaStreamSource(stream);

    const destination = audioContext.createMediaStreamDestination();

    speakerSource.connect(analyser);
    speakerSource.connect(destination);
    //micSource.connect(analyser);
   // micSource.connect(destination);




}

function startRecording()
{
    data = [];

    mediaRecorder = new MediaRecorder(speakerStream, { videoBitsPerSecond: 2500000 });
    mediaRecorder.ondataavailable = handleData;
    mediaRecorder.onstop = stopRecording;
    mediaRecorder.start();
}

function handleData(e)
{

    console.log("handling data");
    data.push(e.data);
}

function stopRecording()
{
    document.querySelector("video").src = URL.createObjectURL(
        new Blob(data, { type: 'video/MP4' })
    );

}

function keyPressed()
{
    if(key === 'r' && millis() > recordTimer + 1000)
    {
        if(!recording)
            startRecording();
        else
            mediaRecorder.stop();

        recording = !recording;

        recordTimer = millis();

    }

}