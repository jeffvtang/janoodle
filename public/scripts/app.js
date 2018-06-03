/*$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});*/

$(document).ready(function() {
  // $(".addRow").on("click", function(event) {
  //   $(".newRow").slideToggle();
  //   $(".newRow textarea").focus();
  // });

/*   $('#togglenew').click(function () {
    $("#slideme").slideToggle()
    // $("#slideme").slideToggle(function () {
      // $('textarea').focus();
      // });
    }); */
    
    $("#availabilities i").on("click", function(event) {
      event.preventDefault();
      const that = this;
      const ids = $(that)
      .data("id")
      .split("-");
      
      const event_url = $(that).data("event-url");
      const userid = ids[0];
      const timeid = ids[1];
      
      if (userid == "delete") {
        console.log("delete trigger");
        $.ajax({
          url: `/poll/${event_url}/delete`,
          method: "delete",
          data: {
            userid,
            timeid
          },
          success: function(data) {
            location.reload();
          }
          
        });
      } else if (userid == "new") {
        $("#slideme").slideToggle()
        
    
    } else {
      console.log("not delete trigger");
      $.ajax({
        url: `/poll/${event_url}/toggle`,
        method: "post",
        data: {
          userid,
          timeid
        },
        
        success: function(data) {
          // if ($(that).hasClass("fa-check")) {
            //   $(that)
            //     .removeClass("fa-check")
            //     .addClass("fa-times");
            // } else {
              //   $(that)
              //     .removeClass("fa-times")
              //     .addClass("fa-check");
              // }
              location.reload();
        }
      });
    }
  });
});
