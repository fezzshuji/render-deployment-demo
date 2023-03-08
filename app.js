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

  $.get("https://petshop-19oi.onrender.com/api/ships/" + inputStr, (data) => {

      console.log(data);
      console.table(data);

      let stringData = JSON.stringify(data);
      let results = JSON.parse(stringData);
 
  $.each(results, function(i) {
        $(document).ready(function() {
          $("<div/>", {
            id: "shipname",
            class: "shipclass",
            text: 'Name: '+results[i]['name'] + ' | Type:  '+ results[i]['kind'] +' | Manufacturer:  '+ results[i]['manufacturer'] ,
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
