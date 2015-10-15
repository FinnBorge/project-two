var $containers = $('.index-container'),
    $categories = $('.index-category')
    $index = $('#index'),
    notHidden = true;

// returns an array of elements

/* splice the right one out by clicking on it and apply hidden to the rest */

$index.on('click', '.index-category', function(e){
  if (notHidden) {
    $(this).parent().siblings().hide("slow"); //siblings receive display = 'none'
  } else {
    $(this).parent().siblings().show("slow");
  }
  notHidden = !notHidden;
});
