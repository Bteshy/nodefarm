
const fs= require('fs');
const http= require('http');
const url = require('url');

// SERVER 

const replacetemp=(temp,product) => {
    let output= temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output= output.replace(/{%IMAGE%}/g,product.image);
    output= output.replace(/{%PRICE%}/g,product.price);
    output= output.replace(/{%FROM%}/g,product.from);
    output= output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output= output.replace(/{%QUANTITY%}/g,product.quantity);
    output= output.replace(/{%DESCRIPTION%}/g,product.description);
    output= output.replace(/{%ID%}/g,product.id);
    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    return output;
}



const overview=fs.readFileSync ('overview.html','utf-8');
const tempproduct=fs.readFileSync ('product.html','utf-8');
const card=fs.readFileSync ('card.html','utf-8');

const data=fs.readFileSync ('data.json','utf-8');
const dataObj=JSON.parse(data);
const server= http.createServer((req,res)=>{
   
    const {query,pathname}  =url.parse(req.url,true);
    
//OVERVIEW
    if (pathname ==='/'||pathname==='/overview'){
        res.writeHead(200, {'content-type':'text/html'});
        const cardhtml= dataObj.map(el=> replacetemp(card,el)).join('');
        const output= overview.replace('{%PRODUCT CARD%}',cardhtml);
        res.end (output);
    }

// PRODUCT
    else if (pathname=='/product'){
        res.writeHead(200, {'content-type':'text/html'});
        
        const product=dataObj[query.id];
        const output= replacetemp(tempproduct,product);
        res.end(output);
    }

// API
    else if (pathname==='/api'){
        res.writeHead(200, {'content-type':'application/json'});
        res.end(data);
        } 

 //NOT FOUND
    else {
        res.writeHead(404, {
            'content-type':'text/html'
        });
        res.end('<h1>page not found!</h1>')
    }
});
server.listen(8000,'127.0.0.1',()=>{
    console.log('yeey server');
}) ;

 