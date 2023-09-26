// check for updates
if (navigator.onLine) { //check for internet connection
    checkForUpdates().then(result => {
        if (result === 1) { //update available
            //display update Dialog box
            let swp = document.querySelector('#spin-wheel-page');
            let uc = document.querySelector('#update-container');
            swp.style.filter = 'blur(2px)';
            uc.style.display = 'flex';
            swp.addEventListener('click', function (e) {
                swp.style.filter = '';
                uc.style.display = 'none';
            })

            //handle update-btn onclick
            document.querySelector('#update-btn').addEventListener('click', function (e) {
                window.open('https://github.com/TheSudoersClub/Randomizer/blob/main/GUI/build/apk/Randomizer.apk?raw=true');
            })
        }
    });
}

async function checkForUpdates() {
    let version = await getVersion("https://thesudoersclub.github.io/Randomizer/GUI/build/apk/version.txt");

    if (localStorage.getItem('version') == null) {
        localStorage.setItem("version", `${version}`);
    }

    let localVersion = localStorage.getItem('version')
    console.log(localVersion);

    if (version !== localVersion) {
        // update available 
        return 1;
    } else {
        // app is upto date
        return 0;
    }
}

async function getVersion(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Could not retrieve file: ${response.statusText}`);
        }
        const text = await response.text();
        return text;
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

let spinWheelPage = document.querySelector('#spin-wheel-page');
let tossPage = document.querySelector('#toss-page');
let initX;
let editContainer = document.querySelector('#editItems-container');

function p1handleTouchStart(e) {
    initX = e.touches[0].clientX;
};

function p1handleTouchMove(e) {
    if (!editContainer.contains(e.target)) {
        e.preventDefault();
        let touch = e.touches[0];
        let coordinateChange = initX - touch.clientX;
        if (coordinateChange < 0) {
            return;
        }
        spinWheelPage.style.left = '-' + coordinateChange + 'px';
        tossPage.style.display = 'block';
        tossPage.style.left = (screen.width - coordinateChange) + 'px';
    }
};

function p1handleTouchEnd(e) {
    let coordinateChange = initX - e.changedTouches[0].clientX;
    let threshold = screen.width / 3;
    if (coordinateChange < threshold) {
        spinWheelPage.style.left = 0;
        tossPage.style.left = '100%';
        tossPage.style.display = 'none';
    } else {
        spinWheelPage.style.transition = 'all .3s';
        tossPage.style.transition = 'all .3s';
        spinWheelPage.style.left = '-100%';
        tossPage.style.left = '0';
        tossPage.style.display = 'block';
    }
}

function p2handleTouchStart(e) {
    initX = e.touches[0].clientX;
    spinWheelPage.style.transition = '';
    tossPage.style.transition = '';
    spinWheelPage.style.display = 'none';
};

function p2handleTouchMove(e) {
    if (!editContainer.contains(e.target)) {
        e.preventDefault();
        let touch = e.touches[0];
        let coordinateChange = touch.clientX - initX;
        if (coordinateChange < 0) {
            return;
        }
        spinWheelPage.style.display = 'flex';
        spinWheelPage.style.left = (coordinateChange - screen.width) + 'px';
        tossPage.style.left = coordinateChange + 'px';
    }
};

function p2handleTouchEnd(e) {
    let coordinateChange = e.changedTouches[0].clientX - initX;
    let threshold = screen.width / 4;
    if (coordinateChange < threshold) {
        spinWheelPage.style.left = '-100%';
        spinWheelPage.style.display = 'none';
        tossPage.style.left = '0';
    } else {
        spinWheelPage.style.transition = 'all .3s';
        tossPage.style.transition = 'all .3s';
        spinWheelPage.style.left = '0';
        tossPage.style.left = '100%';
    }
}

function disableSwipe() {
    spinWheelPage.ontouchstart = null;
    spinWheelPage.ontouchmove = null;
    spinWheelPage.ontouchend = null;

    tossPage.ontouchstart = null;
    tossPage.ontouchmove = null;
    tossPage.ontouchend = null;
}

function enableSwipe() {
    spinWheelPage.ontouchstart = p1handleTouchStart;
    spinWheelPage.ontouchmove = p1handleTouchMove;
    spinWheelPage.ontouchend = p1handleTouchEnd;

    tossPage.ontouchstart = p2handleTouchStart;
    tossPage.ontouchmove = p2handleTouchMove;
    tossPage.ontouchend = p2handleTouchEnd;
}