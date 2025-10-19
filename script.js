let currentsong = new Audio();
let songs;
async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/%5Csongs%5C")[1]);
        }
    }
    return songs;
}


function getSongElementByName(trackName) {
    let items = document.querySelectorAll(".son");
    return Array.from(items).find(
        li => li.innerText.trim() === trackName.trim()
    ) || null;
}

const playmusic = (track, pause= false) => {
    // Set current song source
    currentsong.src = "/songs/" + track.trim();
    currentsong.play();
    console.log("Now playing:", currentsong);

    // Reset all icons to play
    document.querySelectorAll(".playnow").forEach(img => {
        img.src = "assets/play.png";
    });

    // Update current song text
    let playc = document.querySelector(".crnt-song");
    playc.innerHTML = `Current Song - ${track.split(".mp3")[0]}`;

    // Find the corresponding list item
    let currentLi = getSongElementByName(track);

    if (currentLi) {
        let img = currentLi.querySelector(".playnow");
        if (img) img.src = "assets/pause.png"; // show pause for current
    }

    // Handle the main play/pause button
    let playbtn = document.querySelector("#playbtn");
    playbtn.src = "assets/pause.png";

    // When clicking main play button, toggle play/pause state
    playbtn.onclick = function () {
        if (currentsong.paused) {
            currentsong.play();
            playbtn.src = "assets/pause.png";
            if (currentLi) {
                let img = currentLi.querySelector(".playnow");
                if (img) img.src = "assets/pause.png";
            }
        } else {
            currentsong.pause();
            playbtn.src = "assets/play.png";
            if (currentLi) {
                let img = currentLi.querySelector(".playnow");
                if (img) img.src = "assets/play.png";
            }
        }
    };

    // Reset icon when song ends
    currentsong.onended = function () {
        playbtn.src = "assets/play.png";
        if (currentLi) {
            
            let img = currentLi.querySelector(".playnow");
            if (img) img.src = "assets/play.png";
        }
    };
    document.addEventListener("keydown",(e)=>{
            console.log(e.code)
            if(e.code=="Space"){
                console.log("yes")
                currentsong.pause()
                let img = currentLi.querySelector(".playnow");
                if (img) img.src = "assets/play.png";
                pause =true
                let playbtn = document.querySelector("#playbtn");
                playbtn.src = "assets/pause.png";

                console.log(playbtn.src)


            }
            else{console.log("no")}
    })
};


async function main() {
    songs = await getsongs();
    let songL = document.querySelector(".songlist ol");

    
    for (const song of songs) {
        songL.innerHTML += `
            <li class="son">
                ${song.replaceAll("%20", " ")} 
                <img class="playnow" src="assets/play.png" alt="">
            </li>`;
    }

    
    Array.from(songL.getElementsByTagName("li")).forEach(li => {
        li.addEventListener("click", () => {
            playmusic(li.innerText.trim(),true);
        });
    });

    
    currentsong.addEventListener("loadedmetadata", () => {
        let duration = (currentsong.duration / 60).toFixed(2);
        
        console.log("Duration:", duration, "minutes");
        let d= String(duration)
        console.log(typeof d+"j")
        d.replace(".",":")
        document.querySelector(".et").innerHTML = d;
    });
    currentsong.addEventListener("timeupdate", () => {
    let currentt = (currentsong.currentTime / 60).toFixed(2);
    document.querySelector(".st").innerHTML=currentt;
    document.querySelector(".gola").style.left=(currentsong.currentTime/currentsong.duration)*100+"%"
    // console.log("Current time:", currentt, "minutes");
    
});
    document.querySelector(".slide").addEventListener("click",e=>{
        console.log(e.target.getBoundingClientRect().width, e.offsetX)
        let per = (e.offsetX/e.target.getBoundingClientRect().width)*97
        let a = per
        document.querySelector(".gola").style.left=(a)+"%"
        currentsong.currentTime= ((currentsong.duration)*a)/100

        
    })
        document.querySelector(".pre").addEventListener("click",()=>{
        console.log("clicker]d")
        console.log(songs)
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs,index)
        if(index==0){
            alert("This is the First song!")
            playmusic(songs[-1])
        }
        else{
            playmusic(songs[index-1])
        }


    })
    document.querySelector(".nex").addEventListener("click",()=>{
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs,index)
        if(index==-1){
            alert("This is the last song!")
            playmusic(songs[-1])
        }
        else{
            playmusic(songs[index+1])
        }
    })
}

main();
`document.addEventListener("keydown",(e)=>{
     console.log(e.code)
     if(e.code=="Space"){
        currentsong.pause=true
     }
    
})`