var playing = false;
var songDuration;
var loop = true;
var mute = true;
var liked = true;
var currentTitlePlaying;

$(document).ready(function () {
    loadSongs();
    setInterval(function () {
        songbarRange();
    }, 1000);
});

function loadSongs() {
    $.get("http://127.0.0.1:8081/songs/all", function (data, status) {
        if (status == "success") {
            const songs = Array.from(data);
            var songTags = "";
            for (let i = 0; i < songs.length; i++) {
                songTags += "<tr onclick=playSelectedRow('" + songs[i].artist + "','" + songs[i].title + "','" + songs[i].location + "'); ><th scope=\"row\">" + (i + 1) + "</th><td>" + songs[i].title + "</td><td>" + songs[i].artist + "</td><td>" + songs[i].genre + "</td><td>" + songs[i].date + "</td><td>" + songs[i].likes + "<span style=\"color: red;\" class=\"glyphicon glyphicon-heart\" aria-hidden=\"true\"></span></td></tr>";
            }
            document.getElementById("table-body").innerHTML = songTags;
        }
    });
};

function songbarRange() {
    var songBar = document.getElementById("song-bar");
    var audio = document.getElementById("player");
    var songPlayerBar = document.getElementById("song-play-bar");
    if (playing) {
        var songBar = document.getElementById("song-bar");
        songDuration = Math.round(audio.duration);
        songBar.setAttribute("max", Math.round(audio.duration));
        songBar.setAttribute("value", Math.round(audio.currentTime));
        changeStartTime(audio.currentTime);
        changeEndTime(audio.duration);
    }
};

function changeStartTime(time) {
    var date = new Date(null);
    date.setSeconds(time);
    var starTime = date.toISOString().substr(11, 8);
    document.getElementById("start-time").innerHTML = starTime;
};

function changeEndTime(time) {
    var date = new Date(null);
    date.setSeconds(time);
    var starTime = date.toISOString().substr(11, 8);
    document.getElementById("end-time").innerHTML = starTime;
}

function controlSong(time) {
    var audio = document.getElementById("player");
    audio.currentTime = time;
    document.getElementById("song-play-bar").innerHTML = "<input type=\"range\" class=\"form-range range-primary\" id=\"song-bar\" min=\"0\" max=\"" + songDuration + "\" value=\"" + (time) + "\" step=\"1\"  onchange=\"controlSong(this.value)\">";
    changeStartTime(time);
};

function playSelectedRow(artist, title, location) {
    document.getElementById("song-playing").innerText = artist + " - " + title;
    document.getElementById("song-bar").setAttribute("value", 0);
    document.getElementById("like-button").setAttribute("class", "btn btn-md pull-right");
    var audio = document.getElementById("player");
    audio.src = location;
    audio.load();
    audio.play();
    togglePlayIcon();
    currentTitlePlaying = title;
    liked = true;
};

function togglePlayIcon() {
    var playButtonIcon = document.getElementById("play-button-icon");
    playButtonIcon.setAttribute("class", "glyphicon glyphicon-pause");
    if (!playing) {
        var audio = document.getElementById("player");
        audio.play();
        playing = true;
    }
};

function togglePauseIcon() {
    var playButtonIcon = document.getElementById("play-button-icon");
    playButtonIcon.setAttribute("class", "glyphicon glyphicon-play");
    if (playing) {
        var audio = document.getElementById("player");
        audio.pause();
        playing = false;
    }
};

function playOrPause() {
    if (playing) {
        togglePauseIcon();
    } else {
        togglePlayIcon();
    }
};

function fastBackward() {
    var audio = document.getElementById("player");
    audio.currentTime -= 15;
};

function fastFoward() {
    var audio = document.getElementById("player");
    audio.currentTime += 15;
};

function songBar(duration) {
    document.getElementById("end-time").innerText = duration;
    var songBar = document.getElementById("song-bar");
    var a = duration.split(':');
    songDuration = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    songBar.setAttribute("max", songDuration);
};

function toggleRepeat(element) {
    var audio = document.getElementById("player");
    if (loop) {
        document.getElementById(element.id).setAttribute("class", "btn btn-success btn-sm");
        audio.loop = true;
        loop = false;
    } else {
        document.getElementById(element.id).setAttribute("class", "btn btn-primary btn-sm");
        audio.loop = false;
        loop = true;
    }
};

function toggleMute(element) {
    var audio = document.getElementById("player");
    if (mute) {
        document.getElementById(element.id).setAttribute("class", "btn btn-success btn-sm");
        audio.muted = true;
        mute = false;
    } else {
        document.getElementById(element.id).setAttribute("class", "btn btn-primary btn-sm");
        audio.muted = false;
        mute = true;
    }
};

function toggleLike() {
    var likedButton = document.getElementById("like-button");
    if (liked) {
        incrementTitleLikes(likedButton);
    } else {
        likedButton.setAttribute("class", "btn btn-md pull-right");
        liked = true;
    }
}

function incrementTitleLikes(likedButton) {
    var url = "http://127.0.0.1:8081/songs/like/" + currentTitlePlaying;
    $.get(url, function (data, status) {
        if (status == "success") {
            likedButton.setAttribute("class", "btn btn-md btn-danger pull-right");
            liked = false;
            loadSongs();
        }
    });
};

function search() {
    var $rows = $('#playlist-table tbody tr');
    $('#search').keyup(function () {
        var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
        $rows.show().filter(function () {
            var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
            return !~text.indexOf(val);
        }).hide();
    });
}