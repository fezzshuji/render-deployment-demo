const express = require('express'); 
// Initialize App 
const app = express(); 
//const data = require('./data'); 

let inputStr;

$('#submitBtn').on('click', getStr);
function getStr() {
  $(document).ready(function() {
    //$('#showname').empty();
    inputStr = $("#searchInput").val();
    console.log(inputStr);
    getShip()
  });
};

function getShip() {

  $.get("https://petshop-19oi.onrender.com/api/ships" + inputStr, (data) => {

      console.log(data);
      console.table(data);

      let stringData = JSON.stringify(data);
      let results = JSON.parse(stringData);
 
  $.each(results, function(i) {
        $(document).ready(function() {
          $("<div/>", {
            id: "shipname",
            class: "shipclass",
            text: results[i]['name']
          }).appendTo("body");

        //   let img = $('<img />', {
        //     id: 'imgid',
        //     src: results[i]['show']['image']['medium'],
        //     alt: 'MyAlt'
        //   });
        //   img.appendTo($('body'));
         })
      });
    })
  }
