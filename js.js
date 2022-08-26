const sock = new WebSocket("ws://localhost:56145");
// const sock = new WebSocket("wss://api.kuwa.app/test");

let urlHistory = {
    history: [""],
    num: 0
}

function getDir(path){
    document.getElementById("path").value = path;
    sock.send(JSON.stringify({
        "type":"getDir",
        "path":path
    }));
}

function nextDir(path){
    getDir(path)
    console.log(urlHistory)
    urlHistory.num ++;
    urlHistory.history.splice(urlHistory.num, urlHistory.history.length-urlHistory.num);
    urlHistory.history.push(path)
}


sock.addEventListener("open", data => {
    
});

sock.addEventListener("message", datas => {
    // document.getElementById('files').scrollIntoView(false);
    const data = JSON.parse(datas.data)
    if(data.type == "getDir"){
        let filesdiv = document.getElementById('files')
        filesdiv.innerHTML = '<div class="tr header"><div class="td">名前</div><div class="td">更新日</div><div class="td">サイズ</div></div>'
        data.files.forEach(data => {
            let trdiv = document.createElement('div')
            let tddiv = [document.createElement('div'),document.createElement('div'),document.createElement('div')]
            trdiv.classList.add('tr')
            tddiv[0].innerHTML = `<a href='javascript:nextDir("${data.path}/${data.name}")'>${data.name}</a>`;
            tddiv[0].classList.add('name');
            const date = new Date(data.date)
            tddiv[1].textContent = date.getFullYear()+"/"+date.getMonth()+"/"+date.getDay();
            tddiv[1].classList.add('date');
            tddiv[2].textContent = Math.floor((data.size/1000)*Math.pow(10,2))/Math.pow(10,2)+"KB";
            tddiv[2].classList.add('size');
            tddiv.forEach(data =>{
                data.classList.add('td')
                trdiv.appendChild(data)
            })
            // tddiv.classList.add('td')
            // p.textContent = log
            filesdiv.appendChild(trdiv)
        })
    }
});

sock.addEventListener("close", e => {

});

sock.addEventListener("error", e => {

});

next.addEventListener("click", event => {
    console.log(urlHistory)
    urlHistory.num ++;
    console.log(urlHistory.history[urlHistory.num])
    getDir(urlHistory.history[urlHistory.num])
});
back.addEventListener("click", event => {
    console.log(urlHistory)
    urlHistory.num --;
    console.log(urlHistory.history[urlHistory.num])
    getDir(urlHistory.history[urlHistory.num])
});
search.addEventListener("click", event => {
    let path = document.getElementById("path").value
    // history.replaceState('','',path);
    console.log(path)
    getDir(path)
    urlHistory.num ++;
    urlHistory.history.splice(urlHistory.num, urlHistory.history.length-urlHistory.num);
    urlHistory.history.push(path)
});
path.addEventListener("keypress", event=>{
    if(event.key == "Enter"){
        let path = document.getElementById("path").value
        // history.replaceState('','',path);
        console.log(path)
        getDir(path)
        urlHistory.num ++;
        console.log(urlHistory.num)
        urlHistory.history.splice(urlHistory.num, urlHistory.history.length-urlHistory.num);
        urlHistory.history.push(path)
    }
})