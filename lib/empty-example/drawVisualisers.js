
class radialVisualiser
{
    static angularVelocity = Math.PI / 180;
    static angularVelocityMultiplier = 0;
    static spiral = 0;
    static radiusOffset = 70;
    static rotationDependsOnAmp = false;
    static resolution;
    static width;
    static maxHeight;

    static linearHeightCoefficient;
    static exponentialHeightCoefficient = 1.2;
    static exponentialAlphaCoefficient = 1.8;
    static linearAlphaCoefficient;

    bars = [];

    constructor(cx, cy, res) {
        radialVisualiser.resolution = res;
        radialVisualiser.width = (canvas.width / (res/2)) * 1.5;
        radialVisualiser.maxHeight = canvas.height / 3;

        radialVisualiser.linearHeightCoefficient = 140 / (Math.pow(radialVisualiser.maxHeight, 1/radialVisualiser.exponentialHeightCoefficient));
        //radialVisualiser.exponentialAlphaCoefficient = (1.5/256)*res/2 - 0;
        radialVisualiser.linearAlphaCoefficient = 100 / Math.pow(100, 1/radialVisualiser.exponentialAlphaCoefficient);
        for(let i = 0; i < res/2; i++)
            this.bars.push(new radialBar(cx, cy));
    }

    showF(frame){
        analyser.fftSize = radialVisualiser.resolution;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);
        analyser.getFloatFrequencyData(dataArray);

        let max = -Number.MAX_VALUE;
        let min = Number.MAX_VALUE;

        for (let i = 0; i < bufferLength; i++) {
            this.bars[i].showF(i, dataArray, frame);

            if(dataArray[i] < min)
                min = dataArray[i];

            if(dataArray[i] > max){
                max = dataArray[i];

            }

           /* let barHeight = Math.pow((140 + dataArray[i]) / radialVisualiser.linearHeightCoefficient, radialVisualiser.heightPow);
            let barPercent = Math.pow((140 + dataArray[i])/radialVisualiser.linearAlphaCoefficient, radialVisualiser.exponentialAlphaCoefficient);

            fill(color(100 - (100 * i / ((bufferLength) / 3) % 100), 100, barPercent * 1.4, barPercent));
            noStroke();
            translate(canvas.width / 2 + cx, canvas.height / 2 - cy);//i * width
            let rotationAmp = this.rotationDependsOnAmp ? (0.8 + 0.4 * i / bufferLength) : 1;
            rotate((i / (bufferLength / 3) * Math.PI * 2) + (rot * rotationAmp));
            scale(scaleFactor);

            //canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
            rect(-width / 2, this.radiusOffset * Math.sin(i / bufferLength * rot * this.spiral) - this.radiusOffset,width * 1.3, -barHeight)
            // text(dataArray[i].toFixed(0), 0, 400);*/

        }

        //console.log(min + " to " + max);

    }

    show(){
        analyser.fftSize = radialVisualiser.resolution;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);
        analyser.getFloatFrequencyData(dataArray);




        for (let i = 0; i < bufferLength; i++) {
            this.bars[i].show(i, dataArray);

            /* let barHeight = Math.pow((140 + dataArray[i]) / radialVisualiser.linearHeightCoefficient, radialVisualiser.heightPow);
             let barPercent = Math.pow((140 + dataArray[i])/radialVisualiser.linearAlphaCoefficient, radialVisualiser.exponentialAlphaCoefficient);

             fill(color(100 - (100 * i / ((bufferLength) / 3) % 100), 100, barPercent * 1.4, barPercent));
             noStroke();
             translate(canvas.width / 2 + cx, canvas.height / 2 - cy);//i * width
             let rotationAmp = this.rotationDependsOnAmp ? (0.8 + 0.4 * i / bufferLength) : 1;
             rotate((i / (bufferLength / 3) * Math.PI * 2) + (rot * rotationAmp));
             scale(scaleFactor);

             //canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
             rect(-width / 2, this.radiusOffset * Math.sin(i / bufferLength * rot * this.spiral) - this.radiusOffset,width * 1.3, -barHeight)
             // text(dataArray[i].toFixed(0), 0, 400);*/

        }

    }
    static setSpiralVelocity(vel)
    {
        document.getElementById('spiralVel').textContent = Number(vel).toFixed(2);

        this.spiral = vel;
    }
    static setRadiusOffset(vel)
    {
        document.getElementById('radiusOffset').textContent = Number(vel).toFixed(2);

        this.radiusOffset = vel;
    }
    static setAngularVelocity(deltaR)
    {
        document.getElementById('angVel').textContent = Number(deltaR).toFixed(2);
        radialVisualiser.angularVelocityMultiplier = deltaR;
    }

    static newSong()
    {
        let bpm = SpotifyHandler.details.tempo;
        let timeSig = SpotifyHandler.details.time_signature;
        radialVisualiser.angularVelocity = ((0.5 * Math.PI / timeSig) / (60 / bpm)) * (deltaTime / 1000);

        console.log(timeSig + " " + bpm);

        //radialVisualiser.rotation = 0;
    }
}

class radialBar
{
    barWidth;
    rotation = 0;

    cx;
    cy;

    constructor(cx, cy) {
        this.cx = cx;
        this.cy = cy;
    }

    showF(i, dataArray, frame)
    {

        frame.push();
        let barHeight = Math.pow((170 + dataArray[i]) / radialVisualiser.linearHeightCoefficient, radialVisualiser.exponentialHeightCoefficient);
        let barAlpha = Math.pow((170 + dataArray[i])/radialVisualiser.linearAlphaCoefficient, radialVisualiser.exponentialAlphaCoefficient);
        let amplitudePercent = Math.min(Math.max((1 / 140) * (170 + dataArray[i]), 0), 1); //0-1
        let sinAmplitude = 0.5 + -0.5 * Math.sin((2 * Math.PI / 140) * (136 + dataArray[i]));

        switch(colorScheme)
        {
            case 0:
                let colorByIndex = color((100 - (100 * i / ((radialVisualiser.resolution) / 6)) % 100), 100, barAlpha * 1.4, barAlpha);//0
                frame.fill(colorByIndex);
                break;
            case 1:
                let colorByPercent = color(sinAmplitude * 100, 100, barAlpha * 1.4, barAlpha);//1
                frame.fill(colorByPercent);
                break;
            case 2:
                let colorByAlbumPercent = ColourManager.getColor(sinAmplitude);//2
                colorByAlbumPercent.setAlpha((barAlpha / 100) * 255);
                frame.fill(colorByAlbumPercent);
                break;
            case 3:
                let colorByAlbumIndex = ColourManager.getColor(-((i / (radialVisualiser.resolution / 6)) % 1) + 1);//3
                colorByAlbumIndex.setAlpha((barAlpha / 100) * 255);
                frame.fill(colorByAlbumIndex);
                break;
        }


        frame.noStroke();
        frame.translate(canvas.width / 2 + this.cx, canvas.height / 2 - this.cy);//i * width


        let rotationAmp = radialVisualiser.rotationDependsOnAmp ? (0.8 + 0.4 * i / radialVisualiser.resolution / 2) : 1;
        let newRotMult =  false ? barPercent / 100 : 1; // false -> radialVisualiser.rotationDependsOnAmp
        this.rotation += radialVisualiser.angularVelocity * radialVisualiser.angularVelocityMultiplier * newRotMult;

        frame.rotate((i / (radialVisualiser.resolution / 6) * Math.PI * 2) + (this.rotation * rotationAmp));
        frame.scale(scaleFactor);

        //canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        frame.rect(-radialVisualiser.width / 2,
            radialVisualiser.radiusOffset * Math.sin(i / radialVisualiser.resolution/2 * this.rotation * radialVisualiser.spiral)
            - radialVisualiser.radiusOffset,
            radialVisualiser.width * 1.3, -barHeight)
        // text(dataArray[i].toFixed(0), 0, 400);
        frame.pop();

    }

    show(i, dataArray)
    {
        push();
        let barHeight = Math.pow((140 + dataArray[i]) / radialVisualiser.linearHeightCoefficient, radialVisualiser.exponentialHeightCoefficient);
        let barPercent = Math.pow((140 + dataArray[i])/radialVisualiser.linearAlphaCoefficient, radialVisualiser.exponentialAlphaCoefficient);
        let colorByIndex = color((100 - (100 * i / ((radialVisualiser.resolution) / 6)) % 100), 100, barPercent * 1.4, barPercent);
        let colorByPercent = color((barPercent * 2) % 100, 100, barPercent * 1.4, barPercent);
        fill(colorByPercent);
        noStroke();
        translate(canvas.width / 2 + this.cx, canvas.height / 2 - this.cy);//i * width


        let rotationAmp = radialVisualiser.rotationDependsOnAmp ? (0.8 + 0.4 * i / radialVisualiser.resolution / 2) : 1;
        let newRotMult =  false ? barPercent / 100 : 1;
        this.rotation += radialVisualiser.angularVelocity * radialVisualiser.angularVelocityMultiplier * newRotMult;

        rotate((i / (radialVisualiser.resolution / 6) * Math.PI * 2) + (this.rotation * rotationAmp));
        scale(scaleFactor);

        //canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        rect(-radialVisualiser.width / 2,
            radialVisualiser.radiusOffset * Math.sin(i / radialVisualiser.resolution/2 * this.rotation * radialVisualiser.spiral)
            - radialVisualiser.radiusOffset,
            radialVisualiser.width * 1.3, -barHeight)
        // text(dataArray[i].toFixed(0), 0, 400);
        pop();

    }


}

class ballVisualiser
{
    static resolution = 2048;

    static balls = [];

    static time = 0;

    static initialise()
    {
        for (let i = 0; i < ballVisualiser.resolution /2 ; i++) {
            ballVisualiser.balls.push(new ball(random(50, canvas.width - 50), random(50, canvas.height- 50)));

        }
    }

    static show(frame){
        ballVisualiser.time += 1/10;
        analyser.fftSize = ballVisualiser.resolution;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);
        analyser.getFloatFrequencyData(dataArray);


        for (let i = 0; i < bufferLength; i++) {
            let magnitude = ((140 + dataArray[i]) / 140);
            if(magnitude > 100 || magnitude < 0)
                magnitude = 0;

            let velMag = Math.pow(2 * magnitude, 3)

            ballVisualiser.balls[i].updateVelocity(velMag, magnitude);
            ballVisualiser.balls[i].show(frame);

        }
    }
}

class ball
{
    position = new p5.Vector();
    velocity = new p5.Vector();

    rotOffset = 0;
    sz = 0;

    constructor(x, y) {
        this.position = createVector(x, y);
        this.rotOffset = random(0, Math.PI);
        this.sz = 10;
    }

    show(frame)
    {
        //console.log(this.position.x + " " + this.velocity.x);

        this.position = createVector(this.position.x + this.velocity.x, this.position.y + this.velocity.y);
        push();
        frame.noStroke();
        frame.translate(this.position.x, this.position.y);
        frame.fill(color(100 - this.sz*80, 100, 100, this.sz * 100));
        frame.ellipse(0, 0, 37.2 * this.sz);

        pop();
    }

    updateVelocity(x, y)
    {
        this.sz = Math.sqrt(y);
        this.velocity = createVector(x, 0);
        this.velocity.rotate((ballVisualiser.time / 20) * Math.PI);
        //this.velocity.rotate(random(0, 2 * Math.PI));

        let p = createVector(this.position.x + this.velocity.x, this.position.y + this.velocity.y);
        if(p.x > canvas.width || p.x < 0 || p.y > canvas.height || p.y < 0)
        {
            this.velocity.rotate(Math.PI);
        }
    }
}