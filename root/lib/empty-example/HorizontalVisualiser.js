class HorizontalVisualiser
{
    static resolution;
    static width;
    static maxHeight;

    static linearHeightCoefficient;
    static exponentialHeightCoefficient = 1.2;
    static exponentialAlphaCoefficient = 1.8;
    static linearAlphaCoefficient;

    bars = [];

    constructor(cx, cy, res) {
        HorizontalVisualiser.resolution = res;
        HorizontalVisualiser.width = (canvas.width / (res)) * 1.5;
        HorizontalVisualiser.maxHeight = canvas.height / 3;

        HorizontalVisualiser.linearHeightCoefficient = 140 / (Math.pow(HorizontalVisualiser.maxHeight, 1/HorizontalVisualiser.exponentialHeightCoefficient));
        //radialVisualiser.exponentialAlphaCoefficient = (1.5/256)*res/2 - 0;
        HorizontalVisualiser.linearAlphaCoefficient = 100 / Math.pow(100, 1/HorizontalVisualiser.exponentialAlphaCoefficient);
        for(let i = 0; i < res/2; i++)
            this.bars.push(new HorizontalBar(cx, cy));
    }

    showF(frame){
        analyser.fftSize = HorizontalVisualiser.resolution;

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

        }
    }
}

class HorizontalBar
{
    barWidth;
    cx;
    cy;

    constructor(cx, cy) {
        this.cx = cx;
        this.cy = cy;
    }

    showF(i, dataArray, frame)
    {

        frame.push();
        let barHeight = Math.pow((170 + dataArray[i]) / HorizontalVisualiser.linearHeightCoefficient, HorizontalVisualiser.exponentialHeightCoefficient);
        let barAlpha = Math.pow((170 + dataArray[i])/HorizontalVisualiser.linearAlphaCoefficient, HorizontalVisualiser.exponentialAlphaCoefficient);
        let amplitudePercent = Math.min(Math.max((1 / 140) * (170 + dataArray[i]), 0), 1); //0-1
        let sinAmplitude = 0.5 + -0.5 * Math.sin((2 * Math.PI / 140) * (136 + dataArray[i]));
        barHeight = (170 + dataArray[i]) * map(i, 0, HorizontalVisualiser.resolution/2, 1, 1.8);

        switch(colorScheme)
        {
            case 0:
                let colorByIndex = color((100 - (100 * i / ((HorizontalVisualiser.resolution) / 6)) % 100), 100, barAlpha * 1.4, barAlpha);//0
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
                let colorByAlbumIndex = ColourManager.getColor(-((i / (HorizontalVisualiser.resolution / 6)) % 1) + 1);//3
                colorByAlbumIndex.setAlpha((barAlpha / 100) * 255);
                frame.fill(colorByAlbumIndex);
                break;
        }

        frame.fill(255);


        frame.noStroke();
        frame.translate(i * HorizontalVisualiser.width * 1.3, canvas.height / 2 - this.cy);//i * width

        frame.scale(scaleFactor);

        //canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        frame.rect(0, 0, HorizontalVisualiser.width * 1.3, -barHeight)
        frame.fill(color(90, 255, 255));
        frame.text(i, 0, 0);
        // text(dataArray[i].toFixed(0), 0, 400);
        frame.pop();

    }


}
