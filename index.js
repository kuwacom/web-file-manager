const http = require('http');
const fs = require('fs');
const ws = require("ws")
const glob = require('glob');
const readline = require("readline");
readline.emitKeypressEvents(process.stdin);

// const html = fs.readFileSync("./test1.txt", 'utf8');
// const js = fs.readFileSync("./test1.txt", 'utf8');

const websocket = ws.Server;
const wsserver = new websocket({ port: 56145 });

wsserver.on("connection", ws => {
    ws.on("message", data => {
        data = JSON.parse(data)
        // console.log(data);
        let outData = {}
        if(data.type == "getDir"){
            outData = {
                type: "getDir",
                files: []
            }
            // glob(data.path+"*", {stat: true}, (err, files) => {
            //     let num = 0;
            //     console.log(files)
            //     files.forEach(file => {
            //         console.log(file);
            //         // outData.files[num].name
            //         num ++;
            //     });
            // });
            try {
                fs.readdir(data.path, (erro, files) => {
                    console.log(files)
                    // let fileList = files.filter((file) => {
                    //     return fs.statSync(file).isFile() && /.*\.*$/.test(file); //絞り込み
                    // })
                    // console.log(fileList);
                    try {
                        files.forEach(file => {
                            try {
                                const status = fs.statSync(data.path+"/"+file)
                                outData.files.push({
                                    name: file,
                                    date: status.atime,
                                    size: status.size,
                                    path: data.path
                                })
                            } catch (error) {
                                outData.files.push({
                                    name: file,
                                    date: "permission deny",
                                    size: "permission deny",
                                    path: null
                                })
                            }
                        })
                    } catch (error) {
                        outData.files.push({
                            name: "permission deny",
                            date: null,
                            size: null,
                            path: null
                        })
                        ws.send(JSON.stringify(outData))
                    }
                    console.log(outData)
                    ws.send(JSON.stringify(outData))
                })
            } catch (error) {
                outData.files.push({
                    name: "permission deny",
                    date: null,
                    size: null
                })
                ws.send(JSON.stringify(outData))
            }
        };
    });
});


let server = http.createServer(function(request, response){
    console.log(request.url)
    let html = ""
    try{
        html = fs.readFileSync("."+request.url, 'utf8');
    }catch (e){
        html = "error"
    }
    response.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
    response.end(html);
})
server.listen(80);



// console.log("parent:" + process.pid);

(async function(){
while (1){
    await new Promise(resolve=>{
        // process.stdin.on("keypress",function self(key,ch){
        //     if(ch.name=="return") {
        //         //自分のイベントを削除
        //         process.stdin.removeListener("keypress",self);
        //         return resolve();
        //     }
        //     //文字として取得
        //     console.log(key);
        //     proc.stdin.write(key+"\n");
        //     //キーボードステータスの取得
        //     // console.log(ch);
        // });
        // rl.question("question", (answer) => {
        //     console.log(answer)
        //     resolve();
        //     rl.close();
        // });
        let out = ""
        process.stdin.on("keypress",function self(key,ch){
            if(ch.name=="return") {
                process.stdin.removeListener("keypress",self);
                proc.stdin.write(out+"\n")
                return resolve();
            }
            out += key;

        })
    })
}
})();