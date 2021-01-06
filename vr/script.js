function radiansToDegrees (_val) {  
  return _val * (Math.PI/180);
}

function makeZdogBezier (_path) {	
	let arr = [];
	arr[0] = {x: _path[0].x, y: _path[0].y};	
	for(let i = 1; i < _path.length; i++) {
		if(i % 3 == 0 ) {
			var key = "bezier";
			var obj = {};
			obj[key] = [
				{x: _path[i-2].x, y: _path[i-2].y},
				{x: _path[i-1].x, y: _path[i-1].y},
				{x: _path[i].x, y: _path[i].y}
			];
			arr.push(obj);		
		}
	}
	return arr;
}
let svg = document.querySelector('.zdog-svg');

let animationObject = { zoom: 1, paddleRotationZ: 0, sceneRotationY: 0, sunRotationZ: 0 };
let windowBezier = MorphSVGPlugin.pathDataToBezier('M17,8.5v7.6H0V8.5C0,3.8,3.8,0,8.5,0c2.3,0,4.5,1,6,2.5C16,4,17,6.1,17,8.5z', {
  offsetX: 0,
  offsetY: 0
})
let doorBezier = MorphSVGPlugin.pathDataToBezier('M28.5,14.3V27H0V14.3C0,6.4,6.4,0,14.3,0c3.9,0,7.5,1.6,10.1,4.2C26.9,6.8,28.5,10.3,28.5,14.3z', {
  offsetX: 0,
  offsetY: 0
})

let scene = new Zdog.Anchor({
  translate: {x: 240, y: 240},
	scale: 1
});

var mainBody = new Zdog.Group({
  addTo: scene,
  translate: {y: 0, z: 0 }
});

var windmillGroup = new Zdog.Group({
  addTo: scene,
  translate: {y: 0, z: 0 }
});
var platformGroup = new Zdog.Anchor({
  addTo: scene,
  translate: {y: 0, z: 0 }
});

var windMillAnchor = new Zdog.Anchor({
  addTo: windmillGroup,
  translate: {y: -20, z: 40 },
	rotate: {z: radiansToDegrees(animationObject.paddleRotationZ)}
});

let cone = new Zdog.Cone({
  addTo: scene,
  diameter: 70,
	translate: {y: -60},
	rotate: {x: radiansToDegrees(90)},
  length: 50,
  stroke: false,
  color: '#904E55',
  backface: '#713E43',
});
let can = new Zdog.Cylinder({
  addTo: mainBody,
  diameter: 60,
	rotate: {x: radiansToDegrees(-90)},
  length: 120,
  stroke: false,
  color: '#F2C8AD'
 
});


var windowAnchor = new Zdog.Anchor({
  addTo: mainBody,
	rotate: {y: radiansToDegrees(160)},
  translate: {y: 0, z: 0 }
});

var windowAnchor2 = new Zdog.Anchor({
  addTo: scene,
	rotate: {y: radiansToDegrees(200)},
  translate: {y: 0, z: 0 }
});

let windowShape = new Zdog.Shape({
	addTo: windowAnchor,
	path: makeZdogBezier(windowBezier),
	translate: {x: -8, y: -30, z: 30},
	rotate: {y: 0},
	stroke: false,
	fill: true,
	color: '#A87494',
	backface: false
})
let windowShape2 = new Zdog.Shape({
	addTo: windowAnchor2,
	path: makeZdogBezier(windowBezier),
	translate: {x: -8, y: 20, z: 30},
	rotate: {y: 0},
	stroke: false,
	fill: true,
	color: '#A87494'
})
var doorAnchor = new Zdog.Anchor({
  addTo: mainBody,
	rotate: {y: 0},
  translate: {y: 0, z: 0 }
});

let doorShape = new Zdog.Shape({
	addTo: doorAnchor,
	path: makeZdogBezier(doorBezier),
	translate: {x: -15, y: 28, z: 30},
	rotate: {y: 0},
	scale: 1,
	stroke: false,
	fill: true,
	color: '#A87494',
	backface: false
})

var spokeAnchor = new Zdog.Anchor({
  addTo: windMillAnchor,
  translate: {y: 0, z: 0 }
});



let spoke = new Zdog.Shape({
	addTo: spokeAnchor,
	translate: {x: 0, y: -0, z: 0},
	stroke: 3,
	fill: false,
	path: [
		{x: 0, y: -13},
		{x: 0, y: -18}
	],
	color: '#564E58'
})

spoke.copyGraph({
	rotate: {z: radiansToDegrees(90)}
})

spoke.copyGraph({
	rotate: {z: radiansToDegrees(180)}
})
spoke.copyGraph({
	rotate: {z: radiansToDegrees(270)}
})

var paddleAnchor = new Zdog.Anchor({
  addTo: windMillAnchor,
  translate: {y: 0, z: 0 }
});
let platformShape = new Zdog.Cylinder({
  addTo: platformGroup,
  diameter: 160,
	rotate: {x: radiansToDegrees(90)},
	translate: {y: 60, z: -0},
  length: 6,
  stroke: false,
  color: '#B88D7E',
  backface: '#9BBBAE',
	
})

let paddle = new Zdog.Rect({
	addTo: paddleAnchor,
	width: 48,
	height: 11,
	translate: {x: 40, y: -0},
	stroke: 3,
	fill: true,
	color: '#785964'
})

paddleAnchor.copyGraph({
	rotate: {z: radiansToDegrees(90)}
	
})

paddleAnchor.copyGraph({
	rotate: {z: radiansToDegrees(180)}
	
})

paddleAnchor.copyGraph({
	rotate: {z: radiansToDegrees(270)}
	
})

let centreBit = new Zdog.Cylinder ({
	addTo: windMillAnchor,
	translate: {x: 0, y: -0, z: -0},
	diameter: 16,
	length: 3,
	stroke: 4,
	fill: true,
	color: '#9E94A0',
  backface: '#564E58'
})


var sunAnchor = new Zdog.Anchor({
  addTo: scene,
  translate: {x: -120, y: -100, z: -30 }
});

let sun = new Zdog.Ellipse({
  addTo: scene,
  width: 30,
  height: 30,
	translate: {x: -120, y: -100, z: -30 },
	fill: true,	
  stroke: 4,
  color: '#F3B61F',
});

let sunLine = new Zdog.Shape({
	addTo: sunAnchor,
	path: [
		{x: 0, y: -23},
		{x: 0, y: -28},
	],
  color: '#F3B61F',
  stroke: 4,
})
sunLine.copyGraph({
	rotate: {z: radiansToDegrees(30)}
})
sunLine.copyGraph({
	rotate: {z: radiansToDegrees(60)}
})
sunLine.copyGraph({
	rotate: {z: radiansToDegrees(90)}
})
sunLine.copyGraph({
	rotate: {z: radiansToDegrees(120)}
})
sunLine.copyGraph({
	rotate: {z: radiansToDegrees(150)}
})
sunLine.copyGraph({
	rotate: {z: radiansToDegrees(180)}
})
sunLine.copyGraph({
	rotate: {z: radiansToDegrees(210)}
})
sunLine.copyGraph({
	rotate: {z: radiansToDegrees(240)}
})
sunLine.copyGraph({
	rotate: {z: radiansToDegrees(270)}
})
sunLine.copyGraph({
	rotate: {z: radiansToDegrees(300)}
})
sunLine.copyGraph({
	rotate: {z: radiansToDegrees(330)}
})


var cloudAnchor = new Zdog.Anchor({
  addTo: scene,
  translate: {x: -50, y: -40, z: 0 }
});


let cloudShape = new Zdog.Shape({
  addTo: cloudAnchor,
	translate: {x: -50, y: -50, z: -3},
  // no path set, default to single point
  stroke: 40,
  color: '#F5F5F3',
});
cloudShape.copyGraph({
	translate: {x: -50, y: -46, z: 3},
  stroke: 36,
  color:  '#FAFAF8',
	
})
cloudShape.copyGraph({
	translate: {x: -30, y: -44},
  stroke: 30,
  color:  '#FAFAF8',
	
})
cloudShape.copyGraph({
	translate: {x: -66, y: -40},
  stroke: 20,	
  color:  '#FAFAF8'
})

let cloud2 = cloudAnchor.copyGraph({
  translate: {x: 150, y: 0, z: 0 }
})


scene.rotate.x  = radiansToDegrees(-8);
function animate() {
	
	windMillAnchor.rotate.z = radiansToDegrees(animationObject.paddleRotationZ);
	sunAnchor.rotate.z = radiansToDegrees(animationObject.sunRotationZ);
	
  scene.updateGraph();
  render();
}

function render() {
  empty( svg );
  scene.renderGraphSvg( svg );
}

function empty( element ) {
  while ( element.firstChild ) {
    element.removeChild( element.firstChild );
  }
}
var tl = new TimelineMax({ onUpdate: animate });
tl.to(animationObject, 6, {
  paddleRotationZ: 360,
  ease: Linear.easeNone,
	repeat: -1
})
.staggerTo(sunAnchor.children, 0.5, {
	color: '#F87514',
	repeat: -1,
	yoyo: true
	}, 0.0833333333333333, 0)
.to(animationObject, 20, {
	sunRotationZ: -360,
	ease: Linear.easeNone,
	repeat: -1
}, 0)
.to(animationObject, 5, {
	sceneRotationY: 360,
	onUpdate: function () {
		scene.rotate.y  = radiansToDegrees(animationObject.sceneRotationY);
	},
	ease: Sine.easeInOut
}, 1);

// ----- drag ----- //
let isSpinning = true;
const TAU = Zdog.TAU;
// click drag to rotate
let dragStartRX, dragStartRY;
let minSize = Math.min( 480, 480 );

// add drag-rotatation with Dragger
new Zdog.Dragger({
  startElement: svg,
  onDragStart: function() {
    isSpinning = false;
    dragStartRX = scene.rotate.x;
    dragStartRY = scene.rotate.y;
  },
  onDragMove: function( pointer, moveX, moveY ) {
    scene.rotate.x = dragStartRX - ( moveY / minSize * TAU );
    scene.rotate.y = dragStartRY - ( moveX / minSize * TAU );
  },
});

//console.log(sunAnchor)