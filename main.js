
class Page {
    constructor(title, url, userName, postedTime, likeNum = 0, commentNum = 0, openedBag = 0, jpycNum = 0, doggodNum = 0) {
        this.title = title;
        this.url = url;
        this.userName = userName;
        this.postedTime = postedTime;
        this.likeNum = likeNum;
        this.commentNum = commentNum;
        this.openedBag = openedBag;
        this.jpycNum = jpycNum;
        this.doggodNum = doggodNum;
    }
}

var pageList = [];
var fileName = 'ranking.csv';
var minitue = '分前';
var hours = '時間前';
var days = '日前'
var postedTime;
var lastPageNum = 0;
var lastDay = 3 * 24;

var page;
var posts;

var host_url = location.host;



if (host_url === "hide.ac") {
    Init();
}

function Init() {
    // Add colum names
    pageList.push(['title', 'url', 'userName', 'postedTime', 'likeNum', 'comments', 'openedBag', 'jpyc', 'doggod']);

    GetPosts();
}


function GetPosts() {
    posts = [...document.querySelectorAll('.css-rpl3vx')];
    AddPosts();
}

function AddPosts() {
    posts.forEach(function (elm, index) {

        if (index < lastPageNum) return;

        let title = elm.querySelector('.css-1pysja1').textContent;
        let url = elm.querySelector('.css-1x1vdex').href;

        let userObj = elm.querySelector('.css-1ha9j9m');
        let userName = userObj.querySelector('.css-7jgt70').textContent;
        let postedTimeString = userObj.querySelector('.css-1pysja1').textContent;

        // change to hour unit
        if (postedTimeString.includes(minitue)) {
            postedTime = +(postedTimeString.replace(minitue, '')) / 60;
        }
        else if (postedTimeString.includes(hours)) {
            postedTime = +(postedTimeString.replace(hours, ''));
        }
        else if (postedTimeString.includes(days)) {
            postedTime = +(postedTimeString.replace(days, '')) * 24;
        }
        else {
            console.error('There is not posted time.')
        }

        if (postedTime > lastDay) return; // should be break


        let likeNum = +(elm.querySelector('.css-1fyivyj') || { textContent: 0 }).textContent;
        let commentsNum = +(elm.querySelector('.css-px5w92') || { textContent: 0 }).textContent;
        let openedBag = +(elm.querySelector('.css-1gi2xsa') || { textContent: 0 }).textContent;

        let values = [...elm.querySelectorAll('.css-n8rg3o')];

        // has jpyc and doggod
        if (values.length == 2) {
            let jpycValue = +(values[0].textContent);
            var doggodValue = +(values[1].textContent);
            page = new Page(title, url, userName, postedTime, likeNum, commentsNum, openedBag, jpycValue, doggodValue);
        }
        // has only jpyc
        else if (values.length == 1) {
            let jpycValue = +(values[0]).textContent;
            page = new Page(title, url, userName, postedTime, likeNum, commentsNum, openedBag, jpycValue);
        }
        // has no token
        else {
            page = new Page(title, url, userName, postedTime, likeNum, commentsNum, openedBag);
        }

        pageList.push([page.title, page.url, page.userName, page.postedTime, page.likeNum, page.commentNum, page.openedBag, page.jpycNum, page.doggodNum]);

    });

    lastPageNum = posts.length;

    if (page.postedTime < lastDay) {
        NextPage();
        setTimeout(() => {
            GetPosts();
        }, 500);
    }
    else {
        console.log(pageList);
        CreateAndDownloadCsv(pageList);
    }
}


var nextPageButtonElement = "css-wmz95n";

function NextPage() {
    try {
        const ele1 = document.getElementsByClassName(nextPageButtonElement);
        ele1[0].click();
    } catch (e) {
        console.error(e);
    }
}




function CreateAndDownloadCsv(array) {

    let bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    let data = array.map((record) => record.join('\t')).join('\r\n');

    let blob = new Blob([bom, data], { 'type': 'text/csv' });

    let downloadLink = document.createElement('a');
    downloadLink.download = fileName;
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.dataset.downloadurl = ['text/plain', downloadLink.download, downloadLink.href].join(':');
    downloadLink.click();
}



// ---loader-------------------------------------------------------------

function OnBottom() {

    window.onscroll = function () {

        let windowH = document.body.clientHeight;
        let bodyH = document.documentElement.scrollHeight;
        let scrollErea = bodyH - windowH;
        let top = document.documentElement.scrollTop;

        if (scrollErea <= top - 50) {
            NextPage();
        }
    }
}


// OnElementAppeared(nextPageButtonElement, NextPage);
// https://www.marukin-ad.co.jp/marulog/?p=1891
function OnElementAppeared(element, callback) {
    $(window).scroll(function () {
        let top = $(element).offset().top;
        let position = top - $(window).height();

        if ($(window).scrollTop() > position) {
            callback();
        }
    });
}
