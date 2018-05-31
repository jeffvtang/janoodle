
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
$('.addRow').on("click", function(event) {
    $(".newRow").slideToggle();
    $(".newRow textarea").focus();

  });
});
