var $published = $('#published'),
    $edited = $('#edited'),
    $container = $('.talkcontainer'),
    $identifier = $('#identifier');


$container.on('click', function(){
  $published.toggleClass('hidden');
  $edited.toggleClass('hidden');
  if($identifier.innerText === "Published Version"){
    $identifier.innerText = "Edited Version";
  } else if ($identifier.innerText === "Edited Version"){
    $identifier.innerText = "Published Version";
  }
});
