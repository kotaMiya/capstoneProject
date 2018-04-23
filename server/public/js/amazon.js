console.log('this is amazon');



function changeText(id) { 
    id.innerHTML = "Ooops!";
}


function readSourceImages(input) {
    console.log('fire');
    var list = document.getElementById("test");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }

    if (input.files.length > 10) {
        alert("You can only upload a maximum of 10 images.");
    } else {
        if (input.files && input.files[0]) {
            for (var i = 0; i < input.files.length; i++) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var imgEle = document.createElement('img'); 
                    imgEle.src = e.target.result;
                    imgEle.height = 230;
                    imgEle.width = 200;
                    imgEle.className = 'box';
                    document.getElementById('test').appendChild(imgEle);
                    // document.getElementById('imageUrl').value = e.target.result;
                };
        
                reader.readAsDataURL(input.files[i]);
            }
        }
    }
}


function readTargetImages(input) {
    console.log('fire');
    var list = document.getElementById("target");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }

    if (input.files.length > 5) {
        alert("You can only upload a maximum of 5 images.");
    } else {
        if (input.files && input.files[0]) {
            for (var i = 0; i < input.files.length; i++) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var imgEle = document.createElement('img'); 
                    imgEle.src = e.target.result;
                    imgEle.height = 230;
                    imgEle.width = 200;
                    imgEle.className = 'box';
                    document.getElementById('target').appendChild(imgEle);
                    // document.getElementById('imageUrl').value = e.target.result;
                };
        
                reader.readAsDataURL(input.files[i]);
            }
        }
    }
}


$(function() {
    $("#export").click(function(){  
        var text = document.getElementById('resultText').innerHTML;
        var trimedText = text.trim();
        var textRemovedP = trimedText.slice(3);
        var splitedText = textRemovedP.split('<p>');
        console.log(splitedText);

        var finalText = '';

        for (var i = 0; i < splitedText.length; i++) {
            finalText += splitedText[i].slice(0, -4) + '\n';
        }
        console.log(finalText);
        setBlobUrl("download", finalText);
    });
});

function setBlobUrl(id, content) {

    var blob = new Blob([ content ], { "type" : "application/x-msdownload" });


    window.URL = window.URL || window.webkitURL;
    $("#" + id).attr("href", window.URL.createObjectURL(blob));
    $("#" + id).attr("download", "tmp.txt");
}