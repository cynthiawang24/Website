$(document).ready(function() {
  $('button').click(function() {
    $('div').toggle();
    $('button').toggleClass('active'); 
  }); 
});