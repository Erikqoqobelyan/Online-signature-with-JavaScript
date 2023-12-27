function clear_canvas() {
    const canvas = document.getElementById("signature_canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("signature_canvas");
    const context = canvas.getContext("2d");
    let isDrawing = false;

    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }

    function draw(e) {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        context.lineWidth = 2;
        context.lineCap = "round";
        context.strokeStyle = "#31658d";

        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
    }

    function stopDrawing() {
        isDrawing = false;
        context.beginPath();
    }

    canvas.addEventListener("touchstart", function (e) {
        e.preventDefault();
        startDrawing(e.touches[0]);
    });
    canvas.addEventListener("touchmove", function (e) {
        e.preventDefault();
        draw(e.touches[0]);
    });

    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);
});

function save_signature() {
    const canvas = document.getElementById("signature_canvas");
    canvas.toBlob(function(blob) {
        var formData = new FormData();
        formData.append('file_signature', blob, 'signature.png');

        $.ajax({
            type: 'POST',
            url: url_director,
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log('Signature saved successfully.');
            },
            error: function(xhr, status, error) {
                console.error('Error saving signature:', status, error);
            }
        });
    }, 'image/png');
}
