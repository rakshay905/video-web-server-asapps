var streamingURL = 'https://streamhub.to/emb.html?';
var movies_folder_id = '3389';
var shows_folder_id = '3542';
let sidebarVisible = true;
let trendingVideoList = [];
let allMovieList = [];
let allMovieYearList = [];
async function loadTrendingVideo (_folderId = '') {
    // const folderId = _folderId !== '' ? _folderId : (movies_folder_id || '3389');
    const folderId = _folderId !== '' ? _folderId : '';
    let url = folderId ? `&fld_id=${folderId}&files=all` : '&files=all';
    const videoList = await fetch(`/api/folder/list?key=2309m1r83vjzf0hb57zc${url}`).then(res => res.json());
    // const videoList = await fetch("/api/file/list?key=2309m1r83vjzf0hb57zc").then(res => res.json());
    console.log('111111111111111111111111111 videoList :: ', videoList)
    // if (videoList && videoList.status === 200) {
    //     trendingVideoList = videoList?.result?.files;
    // }
    if (videoList?.result?.files) {
        if (trendingVideoList && trendingVideoList.length === 0) {
            trendingVideoList = [];
            trendingVideoList = videoList?.result?.files;
        } else if (trendingVideoList?.length > 0) {
            trendingVideoList = [...trendingVideoList, ...videoList?.result.files];
        }
        if (videoList?.result?.folders?.length > 0) {
            getByFoldersForTrending(videoList?.result?.folders);    
        } else {
            trendingVideoElement(trendingVideoList)
        }
    } else if (videoList?.result?.folders?.length > 0) {
        getByFoldersForTrending(videoList?.result?.folders);
    }
    trendingVideoElement(trendingVideoList)
}

function getByFoldersForTrending (_folderList) {
    _folderList.forEach(async(element) => {
        await loadTrendingVideo(element?.fld_id, false);
    });
}

function trendingVideoElement(videos) {
    document.getElementById('image-slider').innerHTML = null;
    var i = 0;
    var stop = videos && videos.length < 5 ? videos.length : 5;
    for (i = 0; i < stop; i++) { 
        const slider = document.createElement('span')
        slider.id = 'slide-' + (Number(i) + 1);
        document.getElementById('image-slider').appendChild(slider);
    }
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');
    imageContainer.id = 'image-container';
    document.getElementById('image-slider').appendChild(imageContainer);
    const element = document.getElementById('image-container')

    const imageSliderButton = document.createElement('div');
    imageSliderButton.classList.add('buttons');
    imageSliderButton.id = 'image-slider-button';
    document.getElementById('image-slider').appendChild(imageSliderButton);

    for (i = 0; i < stop; i++) {
        const v1 = document.createElement('div');
        v1.classList.add('slide');
        element.appendChild(v1);
        var v = document.createElement('img');
        v.src = videos[i].thumbnail;
        // v.classList.add('slide');
        v.widht = '500';
        v.height = '300';
        v.code = videos[i].file_code;
        v.addEventListener('click', (e) => {
            const pageUrl = './play-movie-season.html?' + e.target.code;
            window.open(pageUrl, '_self');
        }, false);
        // element.appendChild(v);
        v1.appendChild(v);
        const nameSpan = document.createElement('span');
        nameSpan.innerText = videos[i].title;
        nameSpan.classList.add('trending-name-span');
        v1.appendChild(nameSpan);
        const button = document.createElement('a');
        button.href = '#slide-' + (Number(i) + 1);
        document.getElementById('image-slider-button').appendChild(button);
    }
    setTimeout(() => {
        refreshCSS();
    }, 300);
}
function toggleSidebar(e) {
    const element = document.getElementById('sidebar');
    if (sidebarVisible) {
        element.classList.remove('show');
        element.classList.add('hide');
    } else {
        element.classList.remove('hide');
        element.classList.add('show');
    }
    sidebarVisible = !sidebarVisible;
}

function refreshCSS () {
let links = document.getElementsByTagName('link');
    for (let i = 0; i < links.length; i++) {
        if (links[i].getAttribute('rel') == 'stylesheet') {
        let href = links[i].getAttribute('href').split('?')[0];
            let newHref = href + '?version=' 
                        + new Date().getMilliseconds();
            console.log(newHref)
            links[i].setAttribute('href', newHref);
        }
    }
}

function getVideoDetailsForPlay () {
    const queryString = window.location.search.split('?')[1];
    // <IFRAME
    //     SRC="https://streamhub.to/emb.html?tgrph22kt0p1=v802.streamhub.to/i/01/00080/tgrph22kt0p1"
    //     FRAMEBORDER=0 MARGINWIDTH=0 MARGINHEIGHT=0 SCROLLING=NO WIDTH=640 HEIGHT=360 allowfullscreen
    //     style="position:absolute;top:0;left:0;width:100%;height:100%;">
    // </IFRAME>
    const link = streamingURL + queryString + '=v802.streamhub.to/i/01/00080/' + queryString;
    console.log('11111111111111111111111111111 query string :: ', link);
    console.log('1212121212121212 :: ', streamingURL)
    const iframe = document.createElement('iframe');
    iframe.setAttribute('SRC', link);
    iframe.setAttribute('FRAMEBORDER', 0);
    iframe.setAttribute('MARGINWIDTH', 0);
    iframe.setAttribute('MARGINHEIGHT', 0);
    iframe.setAttribute('SCROLLING', 'NO');
    // iframe.setAttribute('WIDTH', 640);
    // iframe.setAttribute('HEIGHT', 360);
    iframe.setAttribute('WIDTH', '100%');
    iframe.setAttribute('HEIGHT', '100%');
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.setAttribute('allowfullscreen', true);
    iframe.classList.add('iframe-class')
    iframe.addEventListener('load', (e) => {
        console.log('1111111111111111111111111111111 iframe loaded', e)
        setTimeout(() => {
            console.log('document :::::: ', window.document.getElementsByClassName('vjs-watermark-content'));
        }, 200)
    }, false)
    document.getElementById('player-main-div').appendChild(iframe);
}

async function getAllShows(_folderId = '') {
    const queryString = window.location.search.split('?')[1];
    let folderId;
    if (queryString) {
        folderId = queryString;
    } else {
        folderId = _folderId !== '' ? _folderId : (shows_folder_id || '3542');
    }
    await getAllMoviesByYear(folderId);
}

async function getAllMovies(_folderId = '') {
    const queryString = window.location.search.split('?')[1];
    console.log('111111111111111111111111 :: ', queryString)
    let folderId;
    if (queryString) {
        folderId = queryString;
    } else {
        folderId = _folderId !== '' ? _folderId : (movies_folder_id || '3389');
    }
    const videoList = await fetch(`/api/folder/list?key=2309m1r83vjzf0hb57zc&fld_id=${folderId}&files=all`).then(res => res.json());
    if (videoList && videoList.status === 200) {
        if (videoList?.result?.files) {
            if (allMovieList && allMovieList.length === 0) {
                allMovieList = [];
                allMovieList = videoList?.result?.files;
            } else if (allMovieList?.length > 0) {
                allMovieList = [...allMovieList, ...videoList?.result.files];
            }
            if (videoList?.result?.folders?.length > 0) {
                getByFolders(videoList?.result?.folders);    
            } else {
                showListOfMovies()
            }
        } else if (videoList?.result?.folders?.length > 0) {
            getByFolders(videoList?.result?.folders);
        }
    }
}

function getByFolders (_folderList) {
    _folderList.forEach(async(element) => {
        await getAllMovies(element?.fld_id, false);
    });
}

async function getAllMoviesByYear(_folderId = '', show = true) {
    const folderId = _folderId !== '' ? _folderId : (movies_folder_id || '3389');
    const videoList = await fetch(`/api/folder/list?key=2309m1r83vjzf0hb57zc&fld_id=${folderId}`).then(res => res.json());
    if (videoList && videoList.status === 200) {
        if (videoList?.result?.folders) {
            if (allMovieYearList && allMovieYearList.length === 0) {
                allMovieYearList = [];
                allMovieYearList = videoList?.result?.folders;
            } else {
                allMovieYearList = [...allMovieYearList, ...videoList?.result?.folders]
            }
            showListOfMovieYears()
        }
    }
}

function showListOfMovies () {
    const allMovieListDiv = document.getElementById('allmovielist');
    allMovieListDiv.innerHTML = null;
    allMovieListDiv.classList.add('all-movie-list');
    for(let i = 0; i < allMovieList.length; i++) {
        const mainDiv = document.createElement('div');
        mainDiv.classList.add('all-movie-list-main');
        // element.appendChild(v1);
        var video = document.createElement('img');
        video.src = allMovieList[i].thumbnail;
        // v.classList.add('slide');
        video.setAttribute('width', '100%');
        video.setAttribute('height', '100%')
        video.code = allMovieList[i].file_code;
        video.addEventListener('click', (e) => {
            const pageUrl = './play-movie-season.html?' + e.target.code;
            window.open(pageUrl, '_self');
        }, false);
        // element.appendChild(v);
        mainDiv.appendChild(video);
        const nameSpan = document.createElement('span');
        nameSpan.innerText = allMovieList[i].title;
        nameSpan.classList.add('video-list-span');
        mainDiv.appendChild(nameSpan);
        allMovieListDiv.appendChild(mainDiv)
    }
    document.getElementById('allmovielist').appendChild(allMovieListDiv)
}

function showListOfMovieYears () {
    const allMovieListDiv = document.getElementById('allmovieyearlist');
    allMovieListDiv.innerHTML = null;
    allMovieListDiv.classList.add('all-movie-list');
    for(let i = 0; i < allMovieYearList.length; i++) {
        const mainDiv = document.createElement('div');
        mainDiv.classList.add('all-movie-list-main');
        // element.appendChild(v1);
        var video = document.createElement('div');
        // video.src = allMovieYearList[i].thumbnail;
        // v.classList.add('slide');
        // video.setAttribute('width', '100%');
        // video.setAttribute('height', '100%')
        video.classList.add('folder-view');
        video.code = allMovieYearList[i].fld_id;
        video.innerText = allMovieYearList[i].name.split(' ')[0];
        video.addEventListener('click', (e) => {
            const pageUrl = './movies.html?' + e.target.code;
            window.open(pageUrl, '_self');
        }, false);
        // element.appendChild(v);
        mainDiv.appendChild(video);
        const nameSpan = document.createElement('span');
        nameSpan.innerText = allMovieYearList[i].name;
        nameSpan.classList.add('video-list-span');
        mainDiv.appendChild(nameSpan);
        allMovieListDiv.appendChild(mainDiv)
    }
    document.getElementById('allmovielist').appendChild(allMovieListDiv)
}