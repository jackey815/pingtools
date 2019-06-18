const {ipcRenderer} = require('electron')
const fs = require('fs');
const csv = require('fast-csv');
const originData = require('./data.json');
var readline = require('readline');
var ping = require('ping');
var s = document.getElementById('output');
var st;
var rows = [];

const selectDirBtn = document.getElementById('file')

selectDirBtn.addEventListener('click', (event) => {
  ipcRenderer.send('open-file-dialog')
})

window.onload = function () {
    document.getElementById('txt').value = originData.file;
    document.getElementById('t').value = originData.time
    document.getElementById('hour').value = originData.hour
    var btn_clock = document.getElementById('clock')
    var btn_save = document.getElementById('save')
    var btn_output = document.getElementById('out')
    btn_clock.onclick = function () {
        clearInterval(st);
        var time = (document.getElementById('t').value * 1) + (document.getElementById('hour').value * 60);
        var shengyu = time * 60;
        if (shengyu > 0) {
            s.innerHTML=showTime(shengyu);
            nao(shengyu);
        }
    }
     btn_save.onclick = function() {
        save_json();
     }
     btn_output.onclick = function(){
        ipcRenderer.send('save-dialog')
        
     }
}

ipcRenderer.on('saved-file', (event, path) => {
    if (!path) path = 'No path'
    console.log(path)
    csv.writeToPath(path, rows)
            .on('error', err => console.error(err))
            .on('finish', () => console.log('Done writing.'));
  })


ipcRenderer.on('selectedItem', (event, path) => {
    document.getElementById('txt').value = `${path}`
    s.innerHTML = "读取txt成功！"
  })

function nao(time) {
    st = setInterval(() => {
        time--;
        s.innerHTML = showTime(time);
        if (time <= 0) {
            s.innerHTML = '测试开始!\n';
            //getMusic();
            get_ping();
            clearInterval(st);
        }
    }, 1000);
}
function showTime(time) {
    var show_time
    if (time >= (60*60)){
        show_time = Math.floor(time / 3600) + '时' + Math.floor((time % 3600)/60) + ' 分 ' + ((time % 3600) % 60) + ' 秒' 
    }
    else if(time > 60 && time < (60*60)){
        show_time = Math.floor((time % 3600)/60) + ' 分 ' + ((time % 3600) % 60) + ' 秒'
    }
    else{
        show_time = time + '秒'
    }

    return  show_time
}

function save_json(){
    data = {
        "file" :　document.getElementById('txt').value,
        "time" :  document.getElementById('t').value,
        "hour" :  document.getElementById('hour').value
    }
    let str = JSON.stringify(data)
    fs.writeFile('data.json',str,function(err){
        if (err) {console.log('something is error...')}
        })
}

function get_ping(){
    var fRead = fs.createReadStream(document.getElementById('txt').value);
    var objReadline = readline.createInterface({
        input:fRead
    });
    var arr = new Array();
    objReadline.on('line',function (line) {
        arr.push(line);
        //console.log('line:'+ line);
        to_ping(line);
    });
    objReadline.on('close',function () {
        console.log(arr);
    });
}

function to_ping(host){
    ping.sys.probe(host, function(isAlive){
        var msg
        if (isAlive == true){
            rows.push([host,"alive"])
            msg = 'host ' + host + ' is alive'
        }
        else{
            rows.push([host,"dead"])
            msg = 'host ' + host + ' is dead'
        }
        //console.log(msg);
        s.append(msg + '\n');
    })
}