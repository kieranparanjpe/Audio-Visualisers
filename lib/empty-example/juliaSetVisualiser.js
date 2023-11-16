class JuliaSetVisualiser
{
    static maxIterations;
    static angle = 0;
    static ca;
    static cb;

    static initialise(max)
    {
        JuliaSetVisualiser.maxIterations = 100;
    }

    static show(frame)
    {
// let ca = map(mouseX, 0, width, -1, 1); //-0.70176;
        // let cb = map(mouseY, 0, height, -1, 1); //-0.3842;

        //let ca = 5 * cos(angle * 3.213); //sin(angle);
        //let cb = 5 * sin(angle);
        //console.log(delx);


       // let ca = map(mx, 0, width, -2, 2); //-0.35,
        //let cb = map(my, 0, height, -2, 2);//0.63333

        //let avg = getAvgAmplitude();

        //let ca = map(170 + avg, 0, 140, -2, 2);
        //let cb = 0;//map(170 + avg, 0, 140, -2, 2);

       // let ca = JuliaSetVisualiser.ca;
        //let cb = JuliaSetVisualiser.cb;

        let ca = sin(JuliaSetVisualiser.angle) * 0.4;
        let cb = sin(JuliaSetVisualiser.angle ) * 0.4;
        frameRate(60);
        console.log(frameRate());

        JuliaSetVisualiser.angle += 0.02;
        // Establish a range of values on the complex plane
        // A different range will allow us to "zoom" in or out on the fractal

        // It all starts with the width, try higher or lower values
        //let w = abs(sin(angle)) * 5;
        let w = 5;
        let h = (w * frame.height) / frame.width;
        // Start at negative half the width and height
        let xmin = -w/2;
        let ymin = -h/2;

        // Make sure we can write to the pixels[] array.
        // Only need to do this once since we don't do any other drawing.
        frame.loadPixels();

        // x goes from xmin to xmax
        let xmax = xmin + w;
        // y goes from ymin to ymax
        let ymax = ymin + h;

        // Calculate amount we increment x,y for each pixel
        let dx = (xmax - xmin) / frame.width;
        let dy = (ymax - ymin) / frame.height;

        // Start y
        let y = ymin;
        for (let j = 0; j < frame.height; j++) {
            // Start x
            let x = xmin;
            for (let i = 0; i < frame.width; i++) {
                // Now we test, as we iterate z = z^2 + cm does z tend towards infinity?
                let a = x;
                let b = y;
                let n = 0;
                while (n < JuliaSetVisualiser.maxIterations) {
                    let aa = a * a;
                    let bb = b * b;
                    // Infinity in our finite world is simple, let's just consider it 16
                    if (aa + bb > 2.0) {
                        break; // Bail
                    }
                    let twoab = 2.0 * a * b;
                    a = aa - bb + ca;
                    b = twoab + cb;
                    n++;
                }

                // We color each pixel based on how long it takes to get to infinity
                // If we never got there, let's pick the color black
                let pix = (i + j * frame.width) * 4;
                if (n == JuliaSetVisualiser.maxIterations) {
                    frame.pixels[pix + 0] = 0;
                    frame.pixels[pix + 1] = 0;
                    frame.pixels[pix + 2] = 0;
                } else {
                    // Otherwise, use the colors that we made in setup()
                    frame.pixels[pix + 0] = 255;
                    frame.pixels[pix + 1] = 255;
                    frame.pixels[pix + 2] = 255;
                }
                x += dx;
            }
            y += dy;
        }
        frame.updatePixels();
        //console.log(frameRate());
    }

    static setCa(a)
    {
        document.getElementById('ca').textContent = Number(a).toFixed(2);
        JuliaSetVisualiser.ca = a;
    }
    static setCb(b)
    {
        document.getElementById('cb').textContent = Number(b).toFixed(2);

        JuliaSetVisualiser.cb = b;
    }
}