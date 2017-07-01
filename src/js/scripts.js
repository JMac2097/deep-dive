global.jQuery = require('jquery');
bootstrap = require('bootstrap');

window.onscroll = function() {
    scrolly();
}

function scrolly() {
    if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById('head-container').className = 'container scrolled';
    } else {
        document.getElementById('head-container').className = 'container';
    }

    if(document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        document.getElementById('info-wrapper').className = 'scrolled';
    } else {
        document.getElementById('info-wrapper').className = '';
    }

    if(document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        document.getElementById('img-container').className = 'scrolled';
    } else {
        document.getElementById('img-container').className = '';
    }


}

// find the scroll distance
// jQuery(document).scroll(function() {
//     var top = jQuery(document).scrollTop();
//     console.log(top);
// })