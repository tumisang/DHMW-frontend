var playing = false;
var songDuration;
var loop = true;
var mute = true;
var liked = true;
var currentTitlePlaying;
var songLikes = 0;

$(document).ready(function () {
    loadSongs();
    setInterval(function () {
        songbarRange();
    }, 1000);
});

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

function playSelectedRow(artist, title, location, likes) {
    document.getElementById("song-playing").innerText = artist + " - " + title;
    document.getElementById("song-bar").setAttribute("value", 0);
    var likeButtonSpan = document.getElementById("like-button-span");
    likeButtonSpan.setAttribute("class", "glyphicon glyphicon-heart-empty");
    likeButtonSpan.setAttribute("style", "");
    var downloadButton = document.getElementById("download-button");
    downloadButton.setAttribute("download", title);
    downloadButton.setAttribute("href", location);
    var audio = document.getElementById("player");
    audio.src = location;
    audio.load();
    audio.play();
    togglePlayIcon();
    currentTitlePlaying = title;
    liked = true;
    songLikes = likes;
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
    var likeButtonSpan = document.getElementById("like-button-span");
    if (liked) {
        incrementTitleLikes(likeButtonSpan);
    } else {        
        likeButtonSpan.setAttribute("class", "glyphicon glyphicon-heart-empty");
        likeButtonSpan.setAttribute("style", "");
        liked = true;
    }
}

function incrementTitleLikes(likeButtonSpan) {
    songLikes++;
    $.ajax({
        url: "api/v1/likeSong.php?title=" + currentTitlePlaying + "&likes=" + songLikes
    }).done(function (data) {
        likeButtonSpan.setAttribute("class", "glyphicon glyphicon-heart");
        likeButtonSpan.setAttribute("style", "color: red;");
        liked = false;
        loadSongs();
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

function loadSongs() {
    $.ajax({
        url: "api/v1/getAllSongs.php"
    }).done(function (data) {
        const songs = JSON.parse(data);
        var songTags = "";
        for (let i = 0; i < songs.length; i++) {
            songTags += "<tr onclick=playSelectedRow('" + songs[i].artist + "','" + songs[i].title + "','" + songs[i].location + "','" + songs[i].likes + "'); ><th scope=\"row\">" + (i + 1) + "</th><td>" + songs[i].title + "</td><td>" + songs[i].artist + "</td><td>" + songs[i].genre + "</td><td>" + formatDateTime(new Date(songs[i].date))+ "</td><td>" + songs[i].likes + "<span style=\"color: red;\" class=\"glyphicon glyphicon-heart\" aria-hidden=\"true\"></span></td></tr>";
        }
        document.getElementById("table-body").innerHTML = songTags;
    });
}

function formatDateTime(date) {
    var year = date.getFullYear();
    var month = getMonth(String(date.getMonth() + 1).padStart(2, '0'));
    var day = String(date.getDate()).padStart(2, '0');
    return `${day} ${month} ${year}`;
}

function getMonth(month) {
    if (month === "01") {
        return "Jan";
    } else if (month === "02") {
        return "Feb";
    } else if (month === "03") {
        return "Mar";
    } else if (month === "04") {
        return "Apr";
    } else if (month === "05") {
        return "May";
    } else if (month === "06") {
        return "Jun";
    } else if (month === "07") {
        return "Jul";
    } else if (month === "08") {
        return "Aug";
    } else if (month === "09") {
        return "Sep";
    } else if (month === "10") {
        return "Oct";
    } else if (month === "11") {
        return "Nov";
    } else if (month === "12") {
        return "Dec";
    }
}

function myFunction() {
    setTimeout(showPage, 1000);
}

function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("myDiv").style.display = "block";
}