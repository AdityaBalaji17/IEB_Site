jQuery(document).ready(function(){ 
    $(function(){
        $('#slideshow h5:gt(0)').hide();
        setInterval(function(){
          $('#slideshow :first-child').fadeOut(2000)
             .next('h5').fadeIn(2000)
             .end().appendTo('#slideshow');}, 
          2000);
    });
});
(function ($) {
    $(function () {
    $('#collapse1').sideNav();
    $('#collapse2').sideNav();
    //$('#collapse2').sideNav('show');
        //initialize all modals           
        $('.modal').modal();

        //or by click on trigger
        $('.trigger-modal').modal();

    }); // end of document ready
})(jQuery); // end of jQuery name space
