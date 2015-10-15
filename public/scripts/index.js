var $containers = $('.index-container'),
    $categories = $('.index-category')
    $index = $('#index'),
    notHidden = true;

// returns an array of elements

/* splice the right one out by clicking on it and apply hidden to the rest */

$index.on('click', '.index-category', function(e){
  if (notHidden) {
    $(this).siblings().hide();
  } else {
    $(this).siblings().show();
  }

  notHidden = !notHidden;

  // if(notHidden){
  //   var target = e.target; //click a .index-category
  //   var targetParent = $(target).parent(); //hold its parent container
  //   var position = $.inArray(target, $categories); //the position of the clicked inside the array of categories
  //   if(position !== -1){
  //     var hideContainers = $containers;
  //     hideContainers.splice(position, 1);
  //     var $hideThese = $(hideContainers);
  //     $hideThese.toggleClass('hide-these');
  //     notHidden = false;
  //   }
  // } else if (!notHidden) {
  //   $containers.attr("class", "index-container");
  //   notHidden = true;
  // }
})
