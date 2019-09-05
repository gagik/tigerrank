function scrollTo(num, callback) {
    $("html, body").delay(1000).animate({ scrollTop: $('#r' + num).offset().top - 100 }, 2300, callback);
}

var toomuch = false;

function swapPlaces(p1, p2) {
  if(toomuch)
    return;

  var table = $("#rank-table");
  var tbody = table.children("tbody").eq(0);

  if(p2 >= tbody.children().length - 1)
    p2 = tbody.children().length - 1;

  if(p1 > p2 || p1 == p2)
    return;

  var row1 = tbody.children("tr").eq(p1);
  var row2 = tbody.children("tr").eq(p2);

  var zC = row1.attr("class");
  $("row1").attr("class", row2.attr("class"));
  row2.attr("class", zC);

  var n = row1.children('td').text();
  // var newRank = row2.children('th').text();

  function secondRow() {
    row1.children("td").children("div").show();
    row2.animate({backgroundColor:"#E6B8B6"}).delay(500)
    .queue(function() {
       $(this).children('td')
       .children('div').text(n)
         .slideDown(500)
         .delay(2000)
         .queue(function() {
          row2.css({backgroundColor:"#fff"});
          M.toast({html: 'Thanks! Your complaint has been submitted!', classes:"green darken-1"})
         })
      });
  }

  row1.animate({backgroundColor:"#E6B8B6"}).delay(500).queue(function() {
      $(this).children('td')
        .wrapInner('<div />')
        .children()
        .slideUp(1000).delay(500)
        .queue(function() {
         row2.children('td').wrapInner('<div />')
          .children()
          .slideUp(1000);

         scrollTo(p2, secondRow);
         row1.css({backgroundColor:"#fff"});
         row1.children('td').children('div').text(row2.children('td').text())
         .slideDown(500)
         .delay(2000)
        });
      });
  
  return table;
}

$(document).ready(function() {
  $('.modal').modal();
  var rank = parseInt($("." + userid).children("th").text());
  $("#msg-rank").text("#" + (rank));

  socket.on("toomuch", function() {
      $(".btn[href='#complaint'").remove();
      M.toast({html: "Hello! You have reached the limit of complaints. Feedback is important but too much feedback can be hurtful. Thanks!", classes: "red darken-3"});
      toomuch = true;
  });

  $("#feedback").click(
    function() {
      $(".btn[href='#complaint'").remove();
      if(toomuch) return;

      var cur = parseInt($("." + userid).children("th").text()) - 1;
      var msg = $("#complaint-msg").val();
      var netid = $("#netid").val();
      if(msg.length < 5 || netid == "")
      {
        M.toast({html: "Please write a longer message in your complaint as well as a valid Net ID.", classes: "red darken-3"});
        return;
      }

      socket.emit("complaint", "(" + netid + ") " + msg);
      scrollTo(cur, function()
        {
          swapPlaces(cur, cur + 250);
        });
    });
});
