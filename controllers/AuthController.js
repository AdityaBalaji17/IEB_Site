const sha1=require("sha1");
const randomstring = require("randomstring");
const mysql = require('mysql');
var nodemailer = require("nodemailer");
const con= mysql.createConnection({
  /*host: 'localhost',
  port:3306,
  user: 'root',
  password: '',
  database: 'iebproject'*/

host: 'sql12.freemysqlhosting.net',
  port:3306,
  user: 'sql12217753',
  password: 'RVEJrhi9Tn',
  database: 'sql12217753'

});

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "b3handicrafts@gmail.com",
        pass: "iebwebsite"
    }
});



exports.Logout = function(request, response){
	request.session.destroy();
	response.render("home/Index");
};




exports.Login = function(request, response){
	
    var email=request.body.email;
    var password=sha1(request.body.password);
    
    con.query("SELECT * FROM users where email=? and password=?",[email,password], (err,rows) => {
    	if(err) throw err;
    	if(rows.length==0)
    	{
    		response.setHeader('Content-Type', 'application/json');
    		response.send(JSON.stringify({ code:100 }));
    	}
    	else{
    		if(rows[0].status=="0")
    		{
    			response.setHeader('Content-Type', 'application/json');
    			response.send(JSON.stringify({ code:400 }));
    		}
    		else
    		{
    			request.session.email=email;
    			request.session.name=rows[0].name;
    			response.setHeader('Content-Type', 'application/json');
    			response.send(JSON.stringify({ code:200 }));	

    		}
    	}
    });
};


exports.Checkcode = function(request, response){
  var code1=request.body.code1;

  con.query("SELECT * FROM users where email=?",[request.session.email], (err,rows) => {
  	if(err) throw err;
  	var code2=rows[0].verification_code;
  	console.log(code1+" "+code2);
  	if(code1==code2)
  	{
  		response.setHeader('Content-Type', 'application/json');
  		con.query("UPDATE users set status=? where email=?",["1",request.session.email], (err,rows) => {
  	if(err) throw err;
response.send(JSON.stringify({ code:200 }));
  	});
    	
  	}
  	else
  	{
  		response.setHeader('Content-Type', 'application/json');
		  	response.send(JSON.stringify({ code:400 }));    	
    	
  	}
  	});
};

 
exports.Signup = function(request, response){
	//console.log("hhh");
	var name=request.body.first_name+" "+request.body.last_name;
	var email=request.body.email;
	request.session.email=email;
	var password=sha1(request.body.password);
	var verification_code=randomstring.generate(6);
	var status="0";

	con.query("SELECT * FROM users where email=?",[email], (err,rows) => {
  	if(err) throw err;
  	if(rows.length==0)
  	{
  	response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify({ code:200 }));
    const user = { name: name, email:email,password:password,verification_code:verification_code,status:status };
con.query("insert into users set ?",user, (err,rows) => {
  	if(err) throw err;

  });

sendEmail(email,verification_code);


  	}
  	else
  	{
  		if(rows[0].status=="0")
  		{
  			console.log("hhhhh"+request.session.email);
  		response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify({ code:300 }));
    con.query("delete FROM users where email=?",[email], (err,rows) => {
  	if(err) throw err;

  });
    const user = { name: name, email:email,password:password,verification_code:verification_code,status:status };
con.query("insert into users set ?",user, (err,rows) => {
  	if(err) throw err;

  });
    sendEmail(email,verification_code);


  	
  		}
  		else
  		{
  			response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify({ code:400 }));
  			
  		}
  	}
  	console.log('Data received from Db:\n');
  


});

    
};
function sendEmail(email,verification_code)
{
	var mailOptions={

        to : email,
        subject : "[B3Handicrafts] Email Verification",
        text : "Hi, there! You're almost on board. \n\nJust enter your verification code: \n\n"+verification_code+ "\n\n...on our website and you're good to go."
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response1){
     if(error){
            console.log(error);
    
     }else{
            
    
         }
});

}