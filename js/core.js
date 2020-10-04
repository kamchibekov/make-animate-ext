var MakeAnimate = function (container) {

    this.container = container;
    this.options = null;
    this.files = [];
    this.canvas = $(this.container).find('#ma_canvas')[0];
    this.context = this.canvas.getContext('2d');
    this.imgContainer = $(this.container).find('.ma_image_container');

    if (!this.container) return;

    this.init = function () {
        if (!window.File || !window.FileList || !window.FileReader || !this.container) {
            alert("You need a browser with file reader support, to use this form properly.");
            return false;
        } else {
            this.readFiles();
        }
    };

    this.readFiles = function () {
        var $this = this;

        $($this.container).find("#ma_file_input").on('change', function (e) {
            var files = $(this)[0].files;
            if (!$this.files.length) $this.imgContainer.html('');
            $.each(files, function (i, el) {

                var fr = new FileReader();
                fr.onload = function (e) {
                    var current = $this.files.push($('<div class="ma_image_wrap"><img src="' + e.target.result + '"></div>')) - 1;
                    $this.imgContainer.append($this.files[current]);
                    window.maFiles = $this.files;
                };

                fr.readAsDataURL(el);

            });
        });

        var img = null;
        var tmp = null;

        $this.imgContainer.on('click', '.ma_image_wrap', function () {
            $(this).toggleClass("check-mark");
            var context = $this.canvas.getContext('2d');
            img = $(this).find('img');
            tmp = new Image;
            tmp.onload = function () {
                context.fillStyle = 'rgb(255,255,255)';
                context.fillRect(0, 0, 720, 720); //GIF can't do transparent so do white
                var ctx = $this.fitImage($this.canvas, tmp, context);
                img.attr('src', $this.canvas.toDataURL());
            };
            tmp.src = img.attr('src');

        });

        $($this.container).find("#ma_imgRotate").on('click', function () {

            $($this.canvas).cropper({
                crop: function (e) {
                    log(e.x);
                    log(e.y);
                    log(e.width);
                    log(e.height);
                    log(e.rotate);
                    log(e.scaleX);
                    log(e.scaleY);
                },
                viewMode: 1,
                responsive: true,
                movable: true,
                rotatable: true,
                scalable: true,
                zoomable: true,
                zoomOnWheel: true,
                preview: $('.cropped-img-preview')
            });

            /*if (!img) return;
             tmp = new Image;
             tmp.onload = function () {
             $this.imgRotate(90, tmp);
             img.attr('src', $this.canvas.toDataURL());
             };
             tmp.src = $this.canvas.toDataURL();*/
        });


        $("#ma_animate_btn").on('click', function () {

            var context = $("#ma_canvas")[0].getContext('2d');

            var encoder = new GIFEncoder();
            encoder.setRepeat(0);
            encoder.setDelay(1000);
            encoder.start();

            var images = $(".ma_image_container .ma_image_wrap.check-mark img");
            images.each(function (i, e) {

                var img = new Image;
                img.onload = function () {
                    //   $($("#ma_canvas")[0]).attr('width', img.width).attr('height', img.height);
                    context.fillStyle = 'rgb(255,255,255)';
                    context.fillRect(0, 0, 720, 720); //GIF can't do transparent so do white
                    encoder.addFrame($this.fitImage($("#ma_canvas")[0], img, context));
                    if (i >= images.length - 1) {
                        encoder.finish();

                        var binary_gif = encoder.stream().getData(); //notice this is different from the as3gif package!
                        $("#ma_gif_preview").attr('src', 'data:image/gif;base64,' + encode64(binary_gif));
                    }

                };
                img.src = $(this).attr('src');
            });

        });
    };

    this.fitImage = function (canvas, imageObj, context) {
        var imageAspectRatio = imageObj.width / imageObj.height;
        var canvasAspectRatio = canvas.width / canvas.height;
        var renderableHeight, renderableWidth, xStart, yStart;

        // If image's aspect ratio is less than canvas's we fit on height
        // and place the image centrally along width
        if (imageAspectRatio < canvasAspectRatio) {
            renderableHeight = canvas.height;
            renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
            xStart = (canvas.width - renderableWidth) / 2;
            yStart = 0;
        }

        // If image's aspect ratio is greater than canvas's we fit on width
        // and place the image centrally along height
        else if (imageAspectRatio > canvasAspectRatio) {
            renderableWidth = canvas.width;
            renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
            xStart = 0;
            yStart = (canvas.height - renderableHeight) / 2;
        }

        // Happy path - keep aspect ratio
        else {
            renderableHeight = canvas.height;
            renderableWidth = canvas.width;
            xStart = 0;
            yStart = 0;
        }
        context.drawImage(imageObj, xStart, yStart, renderableWidth, renderableHeight);

        return context;
    };

    this.imgRotate = function (degrees, image) {
        this.context.clearRect(0, 0, 720, 720);

        // save the unrotated context of the canvas so we can restore it later
        // the alternative is to untranslate & unrotate after drawing
        this.context.save();

        // move to the center of the canvas
        this.context.translate(720 / 2, 720 / 2);

        // rotate the canvas to the specified degrees
        this.context.rotate(degrees * Math.PI / 180);

        // draw the image
        // since the context is rotated, the image will be rotated also
        this.context.drawImage(image, -image.width / 2, -image.height / 2);

        // we’re done with the rotating so restore the unrotated context
        this.context.restore();
    };

    this.init();

};

function log(value) {
    console.log(value);
}

$(document).ready(function () {

    new MakeAnimate($('.maContainer'));
});