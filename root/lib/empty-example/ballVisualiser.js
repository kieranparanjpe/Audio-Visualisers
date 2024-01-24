class ballVisualiser
{
    static resolution = 128;

    static balls = [];

    static time = 0;

    static initialise()
    {
        for (let i = 0; i < ballVisualiser.resolution /2 ; i++) {
            ballVisualiser.balls.push(new ball(0, 0, map(i, 0, ballVisualiser.resolution/2, 0, 2 * Math.PI)));

        }
    }

    static show(frame){

        ballVisualiser.time += 1;

        analyser.fftSize = ballVisualiser.resolution;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);
        analyser.getFloatFrequencyData(dataArray);



        let amplitude = 140 + avgAmplitude;
        console.log(amplitude);
        if(ballVisualiser.time % 1 == 0){
            ballVisualiser.balls.push(new ball(0, 0, map(ballVisualiser.time % (ballVisualiser.resolution/2), 0, ballVisualiser.resolution/2, 0, 2 * Math.PI)));
            ballVisualiser.balls.push(new ball(0, 0, map((ballVisualiser.time+1) % (ballVisualiser.resolution/2), 0, ballVisualiser.resolution/2, 0, 2 * Math.PI)));
            ballVisualiser.balls.push(new ball(0, 0, map((ballVisualiser.time+2) % (ballVisualiser.resolution/2), 0, ballVisualiser.resolution/2, 0, 2 * Math.PI)));
            ballVisualiser.balls.push(new ball(0, 0, map((ballVisualiser.time+3) % (ballVisualiser.resolution/2), 0, ballVisualiser.resolution/2, 0, 2 * Math.PI)));

        }
        amplitude = map(amplitude, 0, 140, 0, 1);

        for (let i = 0; i < ballVisualiser.balls.length; i++) {
            let index = (dataArray.length-1) - abs((i%(ballVisualiser.resolution-2)) - (dataArray.length-1));
            let magnitude = map((170 + dataArray[index]), 0, 140, 0 , 1);
            ballVisualiser.balls[i].show(frame, magnitude, amplitude);

        }
        fill(255);

    }
}

class ball
{
    position = new p5.Vector();
    velocity = new p5.Vector();

    rotOffset = 0;
    sz = 0;

    constructor(x, y, rotation) {
        this.position = createVector(x, y);
        this.rotOffset = rotation;
        this.sz = 30;
    }

    show(frame, magnitude, amplitude)
    {
        //console.log(this.position.x + " " + this.velocity.x);

        this.updateVelocity(magnitude, amplitude);

        this.position = createVector(this.position.x + this.velocity.x, this.position.y + this.velocity.y);
        frame.push();
        frame.noStroke();
        frame.translate(frame.width/ 2, frame.height / 2);
        this.rotOffset += (Math.pow(amplitude, 3) / 100) + (magnitude / 1000);
        frame.rotate(this.rotOffset);
        frame.scale(scaleFactor);

        let powed = 100 * Math.pow(magnitude, 0.6);
        frame.fill(color(100 * magnitude, powed, powed, powed));
        frame.ellipse(this.position.x, this.position.y, this.sz);

        frame.pop();
    }

    updateVelocity(magnitude, amplitude)
    {
        this.sz = Math.pow(amplitude, 0.3) * 50;
        //this.velocity = createVector(Math.max(0, Math.min(Math.pow(amplitude, 4) * 3, 0.75), 0));
        this.velocity = createVector(0.75, 0);
        //this.velocity = createVector(0.5, 0 );
        //this.velocity.rotate(this.rotOffset);
        //this.velocity.rotate(random(0, 2 * Math.PI));

        /*let p = createVector(this.position.x + this.velocity.x + canvas.width/2, this.position.y + this.velocity.y + canvas.height/ 2);
        if(p.x > canvas.width || p.x < 0 || p.y > canvas.height || p.y < 0)
        {
            this.velocity.rotate(Math.PI);
        }*/
    }
}