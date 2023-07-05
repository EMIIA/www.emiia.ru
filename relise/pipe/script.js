const sampleImageUrl = 'http://athenaposters.ca/wp-content/uploads/2017/09/RP15304-Real-Madrid-C-Ronaldo-16.jpg';
const crossOriginUrl = 'https://cors-anywhere.herokuapp.com/';

const imageScaleFactor = 0.5;
const outputStride = 16;
const flipHorizontal = false;

const imageWidth = 500;
const imageHeight = 500;

let joins = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 4],
    [5, 6],
    [5, 7],
    [6, 8],
    [7, 9],
    [8, 10],
    [5, 11],
    [6, 12],
    [11, 12],
    [11, 13],
    [12, 14],
    [13, 15],
    [14, 16]
];

async function estimatePoseOnImage(imageElement) {
    return posenet.load().then((net) => {
        return net.estimateSinglePose(imageElement, imageScaleFactor, flipHorizontal, outputStride)
    });
}

function hasStrongProbability(point) {
    return point.score < 0.65 ? false : true;
}

function drawEstimatedPoseOnCanvas(context, pose) {
    context.fillStyle = "#ffe500";
    context.strokeStyle = "#ffe500";

    points = pose.keypoints;

    points.forEach((point, index, array) => {
        if (hasStrongProbability(point)) {
            context.beginPath();
            context.arc(point.position.x, point.position.y, 2, 0, 2 * Math.PI);
            context.fill();
        }
    });

    joins.forEach(function(join, index, array) {
        if (hasStrongProbability(points[join[0]]) && hasStrongProbability(points[join[1]])) {
            context.moveTo(
            points[join[0]].position.x,
            points[join[0]].position.y
            );
            context.lineTo(
            points[join[1]].position.x,
            points[join[1]].position.y
            );
            context.stroke();
        }
    });
}

window.onload = () => {
    let imageUrl = crossOriginUrl + sampleImageUrl;
    let image = new Image();
    image.crossOrigin = 'anonymous';
    image.height = imageWidth;
    image.width = imageHeight;
    
    let canvas = document.getElementById('output_canvas');
    let imageUrlTextInput = document.getElementById('image_url');
    let estimatePoseButton = document.getElementById('estimate_pose');

    let context = canvas.getContext('2d');

    estimatePoseButton.addEventListener('click', (event) => {
        console.log('Starting fetch...');
        let imageUrl = crossOriginUrl + imageUrlTextInput.value;
        image.src = imageUrl;
    });

    image.addEventListener('load', (event) => {
        console.log('Image fetched!');
        context.clearRect(0, 0, imageWidth, imageHeight);
        context.drawImage(image, 0, 0, imageWidth, imageWidth);
        estimatePoseOnImage(canvas).then((pose) => {
            console.log(pose);
            drawEstimatedPoseOnCanvas(context, pose);
        });
    });

    image.src = imageUrl;
}