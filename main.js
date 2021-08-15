class Page {
    constructor(title, url, userName, postedTime, likeNum = 0, stockedNum = 0, commentNum = 0, openedBag = 0, jpycNum = 0, doggodNum = 0) {
        this.title = title;
        this.url = url;
        this.userName = userName;
        this.postedTime = postedTime;
        this.likeNum = likeNum;
        this.stockedNum = stockedNum;
        this.commentNum = commentNum;
        this.openedBag = openedBag;
        this.jpycNum = jpycNum;
        this.doggodNum = doggodNum;
    }
}


var minitue = '分前';
var hours = '時間前';
var days = '日前'
var lastDay;
var fileName = 'ranking.csv';
var pageList = [];
var postedTime;
var page;
var posts;
var host_url = location.host;

if (host_url === "hide.ac") { Init(); }

function Init() {
    InitDate();

    // Add colum names
    pageList.push(['title', 'url', 'userName', 'postedTime', 'likeNum', 'stockedNum', 'comments', 'openedBag', 'jpyc', 'doggod']);

    LoadPages();
}

function InitDate(){
    let dt = new Date();
    lastDay = dt.getDate();
}

var postTimes;
var lastTime;

async function LoadPages(){
    while(true){
        if(lastTime > lastDay) {
            GetPosts();
            console.log('End');
            break;
        }
        else{
            await CheckPostTiem().then(result =>{
                console.log(result);
            });

            // var promise =new Promise((resolve, reject)=>{
            //     CheckPostTiem();
            //     console.log(promise);
            //     resolve();
            // })
            // .then(()=>{
            //     console.log(promise + " continued and then");
            //     // continue;
            // })
            // .catch(()=>{
            //     console.log(promise + " catched");
            // });
        }
    }
}

function CheckPostTiem(){
    return new Promise((resolve, reject)=>{
        postTimes = [...document.querySelectorAll('.css-1pysja1')];
        var finalday = postTimes[postTimes.length - 1].textContent;
        
        if (finalday.includes(days)) {
            lastTime = +(finalday.replace(days, ''));
        }
        
        NextPage();
        resolve();
    });
}

function NextPage() {
    console.log('next');
    try {
        ClickNextPage();
    }
    catch (e) {
        console.error(e);
        ClickNextPage();
    }
}

function ClickNextPage(){
    var ele1 = document.getElementsByClassName("css-wmz95n")[0];
    console.log(ele1);
    ele1.click();
}

function GetPosts() {
    posts = [...document.querySelectorAll('.css-rpl3vx')];
    AddPosts();
}

function AddPosts() {
    posts.forEach(function (elm, index) {

        let title = elm.querySelector('.css-1pysja1').textContent;

        if(title.charAt(0).includes('#')){
            title = title.replace('#', '＃')
        }

        let url = elm.querySelector('.css-1x1vdex').href;

        let userObj = elm.querySelector('.css-1ha9j9m');
        let userName = userObj.querySelector('.css-7jgt70').textContent;
        let postedTimeString = userObj.querySelector('.css-1pysja1').textContent;

        // change to hour unit
        if (postedTimeString.includes(minitue)) {
            postedTime = +(postedTimeString.replace(minitue, '')) / (60 * 24);
        }
        else if (postedTimeString.includes(hours)) {
            postedTime = +(postedTimeString.replace(hours, '')) / 24;
        }
        else if (postedTimeString.includes(days)) {
            postedTime = +(postedTimeString.replace(days, ''));
        }
        else {
            console.error('There is not posted time.')
        }

        let likeNum = +(elm.querySelector('.css-1fyivyj') || { textContent: 0 }).textContent;
        let stockedNum = +(elm.querySelector('.css-9ludpm') || { textContent: 0 }).textContent;
        let commentsNum = +(elm.querySelector('.css-px5w92') || { textContent: 0 }).textContent;
        let openedBag = +(elm.querySelector('.css-1gi2xsa') || { textContent: 0 }).textContent;

        let values = [...elm.querySelectorAll('.css-n8rg3o')];

        // has jpyc and doggod
        if (values.length == 2) {
            let jpycValue = +(values[0].textContent);
            var doggodValue = +(values[1].textContent);
            page = new Page(title, url, userName, postedTime, likeNum, stockedNum, commentsNum, openedBag, jpycValue, doggodValue);
        }
        // has only jpyc
        else if (values.length == 1) {
            let jpycValue = +(values[0]).textContent;
            page = new Page(title, url, userName, postedTime, likeNum, stockedNum, commentsNum, openedBag, jpycValue);
        }
        // has no token
        else {
            page = new Page(title, url, userName, postedTime, likeNum, stockedNum, commentsNum, openedBag);
        }

        pageList.push([page.title, page.url, page.userName, page.postedTime, page.likeNum, page.stockedNum, page.commentNum, page.openedBag, page.jpycNum, page.doggodNum]);

    });

    console.log(pageList);
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
