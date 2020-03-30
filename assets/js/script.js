//add hover and selection styling for place buttons//
$(function() {

$button= $('button');

$button.on('mouseover click', function(){
    $button.addClass('current');
})

$button.on('mouseover click', function(){
    $button.removeClass('current');
    $(this).addClass('current');
})
});
