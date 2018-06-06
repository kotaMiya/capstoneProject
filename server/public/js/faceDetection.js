

var faceId = [];

$('#btn').click(function () {
    var i;
    var t0 = performance.now();
    // Start timing now
  
    for(i =0; i<document.getElementById('filename').files.length; i++){
        var file = document.getElementById('filename').files[i];
        detectFaces(file);
    }
    var t1 = performance.now();
    console.log("Call to detect took " + (t1 - t0) + " milliseconds.")
    
});

$('#verifyBtn').click(function () {
   // Start timing now
   var t0 = performance.now();
   faceVerification();
   var t1 = performance.now();
   console.log("Call to verify took " + (t1 - t0) + " milliseconds.")
});

$('#addFace').click(function () {
    var i;

    // Start timing now
    for(i =0; i<document.getElementById('filename').files.length; i++){
        var file = document.getElementById('filename').files[i];
        addFace(file);
    }

 });


$("#filename").change(function () {
    showImage();
    var files = document.getElementById("filename").files;
    var name = "";
    for (var i = 0; i < files.length; i++){
        name += files[i].name+"<br>";
    }
    document.getElementById("name").innerHTML = name;
});

function detectFaces(file) {
    var apiKey = "9ae287031335449bbdf1b7e2ec4cb918";
    var uriBase = "https://australiaeast.api.cognitive.microsoft.com/face/v1.0/detect";

        // Request parameters.
        var params = {
            "returnFaceId": "true",
            "returnFaceLandmarks": "false",
            "returnFaceAttributes": "emotion,age,gender",
        };
    // Call the API
    $.ajax({
        url: uriBase + "?" + $.param(params),
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
            $("#response").text("Calling api...");
        },
        type: "POST",
        data: file,
        processData: false
    })
        .done(function (response) {
            // Process the API response.
            processResult(response);
           
        })
        .fail(function (error) {
            // Oops, an error :(
            $("#response").text(error.getAllResponseHeaders());
        });
}

function processResult(response) {
    var tempt = "";
    console.log(faceId)
    for(var i = 0; i < response.length; i++){
        faceId.push(response[i].faceId)
        tempt += "<br>faceId : "+response[i].faceId + "  gender:" + response[i].faceAttributes.gender + " Age:" + response[i].faceAttributes.age+ " Anger:" + response[i].faceAttributes.emotion.anger + " Happiness:" + response[i].faceAttributes.emotion.happiness + " Neutrsl:" +response[i].faceAttributes.emotion.neutral + " Sadness:" + response[i].faceAttributes.emotion.sadness + "</br>";
     obj.push("{faceId : "+response[i].faceId+",\
                gender :"+response[i].faceAttributes.gender+",\
                Age :"+response[i].faceAttributes.age+", \
                Anger:" + response[i].faceAttributes.emotion.anger+",\
                Happiness:" + response[i].faceAttributes.emotion.happiness+",\
                Neutrsl:" +response[i].faceAttributes.emotion.neutral+",\
                Sadness:" + response[i].faceAttributes.emotion.sadness +"}");
     } 
    var text = document.getElementById("response");
    text.innerHTML += tempt;
}

function showImage() {
    var canvas = document.getElementById("myCanvas");   
    // var context = canvas.getContext("2d");
    // context.clearRect(0, 0, canvas.width, canvas.height);

    var input = document.getElementById("filename");
    // var img = new Image;


    // img.onload = function () {
    //     context.drawImage(img, 0, 0);
    // }
    var files = document.getElementById("filename").files;
        var images = "";
        for (var i = 0; i < files.length; i++){
            images += '<img src = "'+ URL.createObjectURL(input.files[i])+'">';
        }

    canvas.innerHTML = images;

}




function faceVerification() {
    var apiKey = "9ae287031335449bbdf1b7e2ec4cb918";
    var uriBase = "https://australiaeast.api.cognitive.microsoft.com/face/v1.0/findsimilars";

        // Request parameters.
        var params = {
           
        };
    // Call the API
    $.ajax({
        url: uriBase,
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
        },
        type: "POST",
        data:JSON.stringify( {
            "faceId": faceId[0],
            "FaceListId": "123456789",
            "maxNumOfCandidatesReturned": 1,
            "mode": "matchFace", 
        }),
        
        processData: false
    })
        .done(function (response) {
            // Process the API response.
            processVerification(response);
        })
        .fail(function (error) {
            // Oops, an error :(
          console.log(error.getAllResponseHeaders());
        });
}

function processVerification(response) {
    var tempt = "";
    
        tempt += "<br>faceId : "+response[0].persistedFaceId + ";       confidence:" + response[0].confidence + "</br>";
    
    var text = document.getElementById("response");
    text.innerHTML += tempt;
}

function addFace(file){


    var apiKey = "9ae287031335449bbdf1b7e2ec4cb918";
    var uriBase = "https://australiaeast.api.cognitive.microsoft.com/face/v1.0/facelists/123456789/persistedFaces";

        // Request parameters.

    // Call the API
    $.ajax({
        url: uriBase,
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
        },
        type: "POST",
        data:file,
        
        processData: false
    })
        .done(function (response) {
            // Process the API response.
            console.log(response);
        })
        .fail(function (error) {
            // Oops, an error :(
          console.log(error.getAllResponseHeaders());
        });

}

