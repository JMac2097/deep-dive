

window.onscroll = function() {
    scrolly();
}

function scrolly() {
    if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById('head-container').className = 'container scrolled';
    } else {
        document.getElementById('head-container').className = 'container';
    }
}