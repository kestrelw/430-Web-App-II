// HELPERS
// NOTE: You can test this in the browser console
const randomElement = array => {
  if(!array.length) throw new Error("Array is empty!");
  return array[Math.floor(Math.random() * array.length)];
}

//NOTE: How about implementing const getJsonXHR = (url, callback) => {...}
const getJsonXHR = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if(xhr.status == "404"){
      console.log(`NOT FOUND: ${url}`);
      callback([{content: `NOT FOUND: ${url}`}]);
      return;
    }
    const text = xhr.responseText;
    
    let json;
    try{
      json = JSON.parse(text);
    }
    catch(err){
      console.log(`ERROR: ${err}`);
      //json = {content: `Don't take any wooden nickels!`};
      json = {content: `Don't take any wooden nickels!`};
    }
    finally{
      callback(json);
    }
  };
  xhr.open("GET", url);
  //add headers here (send request headers?)
  xhr.setRequestHeader("Accept","application/json");
  xhr.send();
};

const getJsonFetch = async (url,callback) => {
  let json;
  try{
    const response = await fetch(url,{
      methor: "GET",
      header: {
        "Accept": "application/json"
      }
    });
    json = await response.json();
  }
  catch(error){
    console.log("ERROR:", error);
    json = {author: `Can't parse data file '${url}''`}
  }
  callback(json);
}

// MAIN
// Note: The page is already loaded (that's what <script defer ...> does) 
// ... so go to town!
// ... get a reference to "random" button 
// ... get a reference to "results" <div>
// ... and so on

const button = document.querySelector("#btn-random");
const btnSearch = document.querySelector("#btn-search");
const resultDiv = document.querySelector("#results");

const resultAuthor = document.querySelector("#author");
const resultQuote = document.querySelector("#quote");

const jsonUrl = "http://localhost:3000/quotes";


const quoteComponent = (json) =>{
  // console.log(json);
  //let q = randomElement(json);

  //resultDiv.innerHTML = `"<i>${randomElement(json).content}</i>"" <b>- ${randomElement(json).author}</b>`;

  resultDiv.innerHTML = `<a class="relative bg-gray-900 block p-6 border border-gray-100 rounded-lg max-w-sm mx-auto mt-24" href="#">
      
   <span class="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

   <div class="my-4">
       <h2 class="text-white text-2xl font-bold pb-2" id="author">${randomElement(json).author}</h2>
       <p class="text-gray-300 py-1" id="quote">"<i>${randomElement(json).content}</i>"</p>
   </div>

   <div class="flex justify-end">
       <button class="px-2 py-1 text-white border border-gray-200 font-semibold rounded hover:bg-gray-800">Click Me</button>
   </div>
  </a>`

};

const quoteSearch = (json) =>{
  // console.log(json);

  let writer;
  let quote;

  if(json.length){
    writer = json[0].author;
    quote = json[0].content;
  }
  else{
    writer = "";
    quote = "ERROR: Quote not found!"
  }


  resultDiv.innerHTML = `<a class="relative bg-gray-900 block p-6 border border-gray-100 rounded-lg max-w-sm mx-auto mt-24" href="#">
      
   <span class="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

   <div class="my-4">
       <h2 class="text-white text-2xl font-bold pb-2" id="author">${writer}</h2>
       <p class="text-gray-300 py-1" id="quote">"<i>${quote}</i>"</p>
   </div>

   <div class="flex justify-end">
       <button class="px-2 py-1 text-white border border-gray-200 font-semibold rounded hover:bg-gray-800">Click Me</button>
   </div>
 </a>`

 
};

button.onclick = () => {
  //console.log("button clicked");
  //getJsonXHR(jsonUrl, quoteComponent);
  getJsonFetch(jsonUrl, quoteComponent);
};

// don't forget to declare and initialize btnSearch
btnSearch.onclick = (evt) => {
  // <form>, don't submit!
  console.log("btn search");
  evt.preventDefault();
  // now grab the `.value` of #input-term
  const searchTerm = document.querySelector("#input-term").value;
  // now build the URL to fetch that specific quote
  const url = "http://localhost:3000/quotes?index="+searchTerm;
  //console.log(url);
  // now call `getJsonFetch()`
  getJsonFetch(url, quoteSearch);
  
}