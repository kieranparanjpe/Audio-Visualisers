class StaticArt {
    static drawArt() {
        let x, y;
        for (let x = 0; x < backgroundGraphic.width; x++) {
            for (let y = 0; y < backgroundGraphic.height; y++) {
                let u = 6 * Math.PI * (x - 200) / 800;
                let v = 6 * Math.PI * (y - 200) / 800;

                backgroundGraphic.stroke(color(StaticArt.sinMapped(x * y),
                    100,
                    100));

                //stroke(color(1, 1, 1));
                backgroundGraphic.strokeWeight(2);
                //rect(x, y, 1, 1);
                backgroundGraphic.point(x, y);
            }
        }
    }

    static sinMapped(input) {
        return Math.sin(input) * 50 + 50;
    }

    static radialGradient(c1, c2) {
        backgroundGraphic.background(c1);

        let max = Math.min(backgroundGraphic.height, backgroundGraphic.width);

        backgroundGraphic.noStroke();

        for (let i = max; i > 0; i--) {
            //console.log(1 - (i / max));
            backgroundGraphic.colorMode(HSB, 100);
            let c = ColourManager.linearInterpolateColors(c1, c2, 1 - (i / max));
            backgroundGraphic.fill(c);
            // cnvs.fill(100 * 1 - (i/max));
            backgroundGraphic.ellipse(backgroundGraphic.width / 2, backgroundGraphic.height / 2,
                backgroundGraphic.width * ((i / max)), backgroundGraphic.height * ((i / max)));

        }
    }

    static zoom = 0;
    static drawMandelbrotSet() {
        StaticArt.zoom += 0.01;
        /*backgroundGraphic.pixelDensity(1);
        let d = backgroundGraphic.pixelDensity();
        backgroundGraphic.loadPixels();

        let ca = 0.5;
        let cb = 0.5;

        for(let x = 0; x < backgroundGraphic.width; x++)
        {
            for(let y = 0; y < backgroundGraphic.width; y++)
            {
                let a = ca;
                let b = cb;

                let fill = color(0);

                for(let i = 0; i < 25; i++)
                {
                    let aa = a*a;
                    let bb = b*b;
                    a = aa - bb + ca;
                    b = 2 * a * b + cb;

                    if(aa*aa + bb * bb > 16)
                    {
                        fill = color(255);
                        break;
                    }
                }
                let index = 4 * ((y * d + y) * backgroundGraphic.width * d + (x * d + x));
                backgroundGraphic.pixels[index] = red(fill);
                backgroundGraphic.pixels[index + 1] = green(fill);
                backgroundGraphic.pixels[index + 2] = blue(fill);
                backgroundGraphic.pixels[index + 3] = 255;
            }
        }

        backgroundGraphic.updatePixels();*/

        let maxiterations = 10;
        backgroundGraphic.pixelDensity(1);
        backgroundGraphic.loadPixels();
        for (let x = 0; x < backgroundGraphic.width; x++) {
            for (let y = 0; y < backgroundGraphic.height; y++) {

                let a = map(x, 0, backgroundGraphic.width, -2.5 + this.zoom, 2.5 - this.zoom);
                let b = map(y, 0, backgroundGraphic.height, -1.5 + this.zoom, 1.5 - this.zoom);

                var ca = a;
                var cb = b;

                var n = 0;

                while (n < maxiterations) {
                    var aa = a * a - b * b;
                    var bb = 2 * a * b;
                    a = aa + ca;
                    b = bb + cb;
                    if (a * a + b * b > 16) {
                        break;
                    }
                    n++;
                }

                var bright = map(n, 0, maxiterations, 0, 1);
                bright = map(sqrt(bright), 0, 1, 0, 255);

                if (n == maxiterations) {
                    bright = 0;
                }

                var pix = (x + y * width) * 4;
                backgroundGraphic.pixels[pix + 0] = bright;
                backgroundGraphic.pixels[pix + 1] = bright;
                backgroundGraphic.pixels[pix + 2] = bright;
                backgroundGraphic.pixels[pix + 3] = 255;
            }
        }
        backgroundGraphic.updatePixels();

    }

    static drawJuliaSet(ca, cb) {
     /*   backgroundGraphic.loadPixels();

        let ca = 0.5;
        let cb = 0.5;

        for (let x = 0; x < backgroundGraphic.width; x++) {
            for (let y = 0; y < backgroundGraphic.width; y++) {
                let a = ca;
                let b = cb;

                let fill = color(0);

                for (let i = 0; i < 25; i++) {
                    let aa = a * a;
                    let bb = b * b;
                    a = aa - bb + ca;
                    b = 2 * a * b + cb;

                    if (aa * aa + bb * bb > 16) {
                        fill = color(255);
                        break;
                    }
                }
                let index = (x + y * backgroundGraphic.width) * 4;
                backgroundGraphic.pixels[index] = red(fill);
                backgroundGraphic.pixels[index + 1] = green(fill);
                backgroundGraphic.pixels[index + 2] = blue(fill);
                backgroundGraphic.pixels[index + 3] = 255;
            }
        }*/

      //  backgroundGraphic.updatePixels();

        let maxiterations = 100;
        backgroundGraphic.pixelDensity(1);
        backgroundGraphic.loadPixels();
        for (let x = 0; x < backgroundGraphic.width; x++) {
            for (let y = 0; y < backgroundGraphic.height; y++) {

                let a = map(x, 0, backgroundGraphic.width, -2.5, 2.5);
                let b = map(y, 0, backgroundGraphic.height, -1.5, 1.5);

                var n = 0;

                while (n < maxiterations) {
                    var aa = a * a - b * b;
                    var bb = 2 * a * b;
                    a = aa + ca;
                    b = bb + cb;
                    if (a * a + b * b > 16) {
                        break;
                    }
                    n++;
                }

                var bright = map(n, 0, maxiterations, 0, 1);
                bright = map(sqrt(bright), 0, 1, 0, 255);

                if (n == maxiterations) {
                    bright = 0;
                }

                var pix = (x + y * width) * 4;
                backgroundGraphic.pixels[pix + 0] = bright;
                backgroundGraphic.pixels[pix + 1] = bright;
                backgroundGraphic.pixels[pix + 2] = bright;
                backgroundGraphic.pixels[pix + 3] = 255;
            }
        }
        backgroundGraphic.updatePixels();

    }


}