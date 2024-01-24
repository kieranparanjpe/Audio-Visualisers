class ColourManager
{
    static colorThief = new ColorThief();
    static dominant;
    static palette = [];
    static resolution = 10.0;
    static img;
    static bgColor;
    static b2Color;
    static getPalette(url) {
        ColourManager.img = loadImage(url);
        // Create an HTMLImageElement
        let image = new Image();
        let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
        // Replace virtual img object
        image.crossOrigin = 'Anonymous';
        image.src = (url ? googleProxyURL + encodeURIComponent(url) : '');
       // image = ColourManager.convertP5ImageToHTMLImage(ColourManager.img);

        if (image.complete) {
            ColourManager.createPalette(image);
        }
        else
        {
            image.addEventListener('load', function () {
                ColourManager.createPalette(image);
            });

        }
    }

    static createPalette(image)
    {
        colorMode(RGB, 255);

        let d = ColourManager.colorThief.getColor(image);
        ColourManager.dominant = color(d[0], d[1], d[2]);

        ColourManager.palette = [];

        let p = ColourManager.colorThief.getPalette(image, ColourManager.resolution);
        for (let i = 0; i < p.length; i++) {
            let c = p[i];
            ColourManager.palette.push(color(c[0], c[1], c[2]));
        }
        colorMode(HSB, 100);

        ColourManager.palette.sort((a, b) => brightness(a) - brightness(b));

        let bg = ColourManager.palette[0];
        let b2 = ColourManager.palette[1];

        if(saturation(bg) >= 25 || brightness(bg) >= 25)
            bg = color(hue(bg) / 3.6, 25, 25);
        else
            bg = color(hue(bg) / 3.6, saturation(bg), brightness(bg));

        if(saturation(b2) >= 35 || brightness(b2) >= 35)
            b2 = color(hue(b2) / 3.6, 35, 35);
        else
            b2 = color(hue(b2) / 3.6, saturation(b2), brightness(b2));

        for (let i = 0; i < p.length; i++) {
            let c = ColourManager.palette[i];
            ColourManager.palette[i] = color(hue(c) / 3.6, saturation(c) * 1.5, brightness(c));
        }

        ColourManager.bgColor = bg;
        ColourManager.b2Color = b2;
        UpdateBackground();

        let pal = ColourManager.palette.filter((item, index, array) => {
            return brightness(item) >= 25 && saturation(item) >= 15;
        });
        if(pal.length >= 4)
        {
            ColourManager.palette = pal;
        }
    }

    static rgbToHsv(c) {
        let r = red(c);
        let g = green(c);
        let b = blue(c);
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h, s, v = max;

        let d = max - min;
        s = (max === 0) ? 0 : d / max;

        if (max === min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + ((g < b) ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return color(h * 360, s * 100, v * 100);
    }

    static getColor(n)
    {
        n = Math.min(Math.max(n, 0), 1);
        let index = n * (ColourManager.palette.length - 1);
        if(ColourManager.palette.length > 0)
            return ColourManager.linearInterpolateColors(ColourManager.palette[Math.floor(index)],
                ColourManager.palette[Math.ceil(index)], index - Math.floor(index));
        return
            color(0);
    }

    static linearInterpolateColors(a, b, p)
    {
        colorMode(RGB, 255);
        let r = a.levels[0] + (b.levels[0] - a.levels[0]) * p;
        let g = a.levels[1] + (b.levels[1] - a.levels[1]) * p;
        let bl = a.levels[2] + (b.levels[2] - a.levels[2]) * p;

        let c =  color(r, g, bl);
        colorMode(HSB, 100);
        return c;

    }
}