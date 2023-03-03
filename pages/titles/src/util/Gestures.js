const { GestureDescription, Finger, FingerCurl } = window.fp;
  
const HanglooseGesture = new GestureDescription('hangloose'); // 🤙
const ScrollDownGesture = new GestureDescription('scroll-down'); // ✊️
const ScrollUpGesture = new GestureDescription('scroll-up'); // 🖐
const ClickGesture = new GestureDescription('click'); // 🤏
  
// Hangloose
// -----------------------------------------------------------------------------
  
// thumb and pinky not curled
for(let finger of [Finger.Thumb, Finger.Pinky]) {
    HanglooseGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
    HanglooseGesture.addCurl(finger, FingerCurl.HalfCurl, 0.5);
}

// all curved
for(let finger of [Finger.Index, Finger.Middle, Finger.Ring]) {
	HanglooseGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
    HanglooseGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

// Scroll down
// -----------------------------------------------------------------------------
  
// thumb: half curled
// accept no curl with a bit lower confidence
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

// all other fingers: curled
for(let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    ScrollDownGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
    ScrollDownGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}


// Scroll up
// -----------------------------------------------------------------------------
  
// no finger should be curled
for(let finger of Finger.all) {
    ScrollUpGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

// Click
// -----------------------------------------------------------------------------
  
// thumb straight or smootlhy curved
ClickGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.4);
ClickGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
  
// index curved
ClickGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.8);
ClickGesture.addCurl(Finger.Index, FingerCurl.FullCurl, 0.5);

// no finger should be curled
for(let finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
    ClickGesture.addCurl(finger, FingerCurl.HalfCurl, 1.0);
    ClickGesture.addCurl(finger, FingerCurl.FullCurl, 0.9);
}

const knownGestures = [
	ScrollDownGesture, ScrollUpGesture, HanglooseGesture, ClickGesture
]

const gesturesStrings = {
	'scroll-up': '🖐️',
	'scroll-down': '✊',
	'click': '🤏',
	'hangloose': '🤙',
}

export {
    knownGestures, gesturesStrings
}