const handCanvasElem = document.getElementById('handwriting_canvas');

handCanvasElem.setAttribute("height", 280);
handCanvasElem.setAttribute("width", 280);

const handCanvas = new fabric.Canvas('handwriting_canvas');

handCanvas.isDrawingMode = true;
handCanvas.freeDrawingBrush.width = 20;
handCanvas.freeDrawingBrush.color = "#ffffff";
handCanvas.backgroundColor = "#000000";
handCanvas.renderAll();

async function loadModel() {
    var model = await tf.loadLayersModel("https://raw.githubusercontent.com/Sahar-S1/ml_test/main/model.json");
    return model;
}

const clearBtn = document.getElementById("clear_btn");
clearBtn.addEventListener('click', () => {
    handCanvas.clear();
    handCanvas.backgroundColor = "#000000";
    handCanvas.renderAll();
})

const recogBtn = document.getElementById("recog_btn");
recogBtn.addEventListener('click', () => {
    loadModel().then(async (model) => {
        // var rawImageData = handCanvas.getContext().getImageData(0, 0, handCanvas.width, handCanvas.height);

        var tensor = tf.browser.fromPixels(handCanvasElem)
            .resizeNearestNeighbor([28, 28])
            .mean(2)
            .expandDims()
            .toFloat()
            .div(255.00);

        var predictions = await model.predict(tensor).data();
        var maxPrediction = Math.max(...predictions)
        var prediction = predictions.indexOf(maxPrediction);    

        var predictionsPlot = [];

        for(var valIndex = 0; valIndex < predictions.length; valIndex++)
        {
            predictionsPlot[valIndex] = (predictions[valIndex] * 100).toFixed(2);
        }
        
        console.log(tensor);
        console.log(tensor.array());
        console.log(predictions);
        console.log(prediction);

        console.log(predictionsPlot);

        var areaChartData = {
            labels  : ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            datasets: [
              {
                label               : 'Predictions',
                backgroundColor     : 'rgba(60,141,188,0.9)',
                borderColor         : 'rgba(60,141,188,0.8)',
                pointRadius          : false,
                pointColor          : '#3b8bba',
                pointStrokeColor    : 'rgba(60,141,188,1)',
                pointHighlightFill  : '#fff',
                pointHighlightStroke: 'rgba(60,141,188,1)',
                data                : predictionsPlot
              },
            ]
          }

         //-------------
        //- BAR CHART -
        //-------------
        var barChartCanvas = $('#recognitionResults').get(0).getContext('2d')
        var barChartData = $.extend(true, {}, areaChartData)

        var barChartOptions = {
        responsive              : true,
        maintainAspectRatio     : false,
        datasetFill             : false
        }

        new Chart(barChartCanvas, {
        type: 'bar',
        data: barChartData,
        options: barChartOptions
        })


        console.log("%c ====== END ======", "background: #000; color: #fff");
    })
})
