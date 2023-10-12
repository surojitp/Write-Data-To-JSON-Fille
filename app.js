const express = require('express'); 
const fs = require('fs');
// const fsp = fs.promises;
let csv= require('fast-csv');
const axios = require('axios');
  
const app = express(); 
const PORT = 3000; 
// const csvData = fs.readFileSync('ids.csv');
// console.log(csvData.toString());

var stream = fs.createReadStream("ids.csv");

csv
 .parseStream(stream, {headers : true})
 .on("data", async function(csvData){
    console.log('I am one line of data', csvData);
    const apiData = await axios('https://jsonplaceholder.typicode.com/posts/' + csvData.IDS)
    console.log("apiData", apiData.data);
    await writeData(apiData.data)
    
 })
 .on("end", function(){
     console.log("done");
 });

 function writeData(data){
    console.log("data----------", data);
    return new Promise(async (resolve, reject) => {
        //check if file exist
        if (!fs.existsSync('result.json')) {
            //create new file if not exist
            fs.closeSync(fs.openSync('result.json', 'w'));
        }

        // read file
        const file = fs.readFileSync('result.json');

        console.log("data---", typeof data);

        //check if file is empty
        if (file.length == 0) {
            //add data to json file
            await fs.writeFileSync("result.json", JSON.stringify([data]))
        } else {
            //append data to jso file
            let json = JSON.parse(file.toString())

            const exists = json.findIndex(element => element.id === data.id) > -1;
            if(!exists){
                console.log("pushed data", data);
                //add json element to json object
                json.push(data);
            }
            

            console.log(Array.isArray(json), "json", json);
            fs.writeFileSync("result.json", JSON.stringify(json))
        }
        resolve(1)
    })
 }

  
app.listen(PORT, (error) =>{ 
    if(!error) 
        console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
    else 
        console.log("Error occurred, server can't start", error); 
    } 
); 