
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

GetPosts();

function GetPosts() {

    var posts = [...document.querySelectorAll('.css-rpl3vx')];

    // Add colum names
    pageList.push(['title', 'url', 'userName', 'postedTime', 'likeNum', 'comments', 'openedBag', 'jpyc', 'doggod']);

    posts.map(elm => {

        let title = elm.querySelector('.css-1pysja1').textContent;
        let url = elm.querySelector('.css-1x1vdex').href;

        let userObj = elm.querySelector('.css-1ha9j9m');
        let userName = userObj.querySelector('.css-7jgt70').textContent;
        let postedTimeString = userObj.querySelector('.css-1pysja1').textContent;

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

        let likeNum = +(elm.querySelector('.css-1fyivyj') || { textContent: 0 }).textContent;
        let commentsNum = +(elm.querySelector('.css-px5w92') || { textContent: 0 }).textContent;
        let openedBag = +(elm.querySelector('.css-1gi2xsa') || { textContent: 0 }).textContent;

        let values = [...elm.querySelectorAll('.css-n8rg3o')];

        var page;
        if (values.length == 2) { // has jpyc and doggod
            let jpycValue = +(values[0].textContent);
            var doggodValue = +(values[1].textContent);
            page = new Page(title, url, userName, postedTime, likeNum, commentsNum, openedBag, jpycValue, doggodValue);
        }
        else if (values.length == 1) { // has only jpyc
            let jpycValue = +(values[0]).textContent;
            page = new Page(title, url, userName, postedTime, likeNum, commentsNum, openedBag, jpycValue);
        }
        else {
            page = new Page(title, url, userName, postedTime, likeNum, commentsNum, openedBag);
        }
        
        pageList.push([page.title, page.url, page.userName, page.postedTime, page.likeNum, page.commentNum, page.openedBag, page.jpycNum, page.doggodNum]);

    });

    CreateAndDownloadCsv(pageList);
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






// ---old func-------------------------------------------------------
const host_url = location.host;

if (host_url === "hide.ac") { }



var postElement = "css-rpl3vx";
var likeElement = "css-1fyivyj";

GetPost();

function GetPost() {
    let posts = document.getElementsByClassName(postElement);

    // let url = posts[0].children[0].href;

    let likeEle = posts[0].children[0].getElementsByClassName("css-141sx3y");
    let like = likeEle[0].getElementsByClassName(likeElement);

    console.log(like[0].textContent);

    // console.log(posts.length);
    // for (let i = 0; i <posts.length; i++) {
    //     console.log(posts[i]);
    // }
}




// ---loader-------------------------------------------------------------

OnBottom();

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

var nextPageButtonElement = "fas fa-angle-down css-19y7vkx";

function NextPage() {
    try {
        const ele1 = document.getElementsByClassName(nextPageButtonElement);

        setTimeout(() => {
            ele1[0].click();
        }, 1000);
    } catch (e) { console.log(e); }
}


OnElementAppeared(nextPageButtonElement, NextPage);
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




// ----------------------------------------------------------------


