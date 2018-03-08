exports.Index = function(request, response){
	response.message="";
    response.render('home/Index');
};
 
exports.Other = function(request, response){
    response.render('home/Other');
};
