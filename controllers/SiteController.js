var paypal=require('paypal-rest-sdk');
var https=require('https');
const mysql=require("mysql");
var fs = require('fs');
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

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function getCommonElements(arrays){

  var currentValues = {};
  var commonValues = {};
  for (var i = arrays[0].length-1; i >=0; i--){//Iterating backwards for efficiency
    currentValues[arrays[0][i]] = 1; //Doesn't really matter what we set it to
  }
  for (var i = arrays.length-1; i>0; i--){
    var currentArray = arrays[i];
    for (var j = currentArray.length-1; j >=0; j--){
      if (currentArray[j] in currentValues){
        commonValues[currentArray[j]] = 1; //Once again, the `1` doesn't matter
      }
    }
    currentValues = commonValues;
    commonValues = {};
  }
  return Object.keys(currentValues).map(function(value){
    return parseInt(value);
  });

}

Array.prototype.contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};

function occurrence(x, y) 
    {
    main_str=x;
    sub_str=y;
    main_str += '';
    sub_str += '';

    if (sub_str.length <= 0) 
    {
        return main_str.length + 1;
    }

       subStr = sub_str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
       return (main_str.match(new RegExp(subStr, 'gi')) || []).length;
    }
exports.SaveRatings=function(request,response)
{
  var longDescriptions=[];
  var userComments=[];
  var commentLines=[];
  var email=request.session.email;
  var items_bought=[];
  var freq=Array(100);
  
    con.query("SELECT * FROM invoices where email=?",email,(err,rows) => {
    if(err) throw err;

    if(rows.length==0)
    {
      response.redirect("/profile");
    }
    else
    {
      
      for(i=0;i<rows.length;i++)
      {
        var itemsAndQtys = rows[i].item_data.split("|");
        for(j=0;j<itemsAndQtys.length;j++)
        {
          var item_id=Number(itemsAndQtys[j].split(",")[0]);
          if(!freq[item_id] && item_id>0)
          {
            items_bought.push(item_id);
            freq[item_id]=1;
          }
        }
      }
      var ratingString="";
    for(i=0;i<items_bought.length;i++)
    {
     var id=items_bought[i];
     var rating=Number(request.body["rating"+id]);
     ratingString+=""+id+":"+rating+"|";    
    }




      con.query("UPDATE ratings set rating_values = ? where email =?",[ratingString,email],(err,rows) => {
    if(err) throw err;
    var itemArrayString="(";
for(i=0;i<items_bought.length;i++)
{
  itemArrayString+=""+items_bought[i];
  if(i<items_bought.length-1)
    itemArrayString+=",";
}
itemArrayString+=")";
var query="SELECT * from items where iid in "+itemArrayString;

con.query(query,(err,rows) => {
    if(err) throw err;
response.redirect("/profile");

});
  }); 
    
    }

});
  
};



exports.ShowProfile=function(request,response)
{
  var filedata;
  var query002;
  
  var two_arrays=[];
	var objects=[];
  var itemsString="";
	var items_bought=[];
  var tags_bought=[];
	var freq=Array(100);
	var item_names=[];
	var item_descriptions=[];
  var longDescriptions=[];
	var userComments=[];
  var commentLines=[];
	request.session.ratings={};
	var name=request.session.name.split(" ");
	var email=request.session.email;
	var ratings={};
	con.query("SELECT * FROM ratings where email=?",email,(err,rows) => {
		if(err) throw err;
		if(rows.length==0)
		{
      
			var rating_row={email:email,rating_values:""};
			con.query("INSERT into ratings set ?",rating_row,(err,rows) => {
		if(err) throw err;
    console.log(err);
    //response.render("home/profile",{name:request.session.name,first_name:name[0],last_name:name[1],email:request.session.email,objects:objects}); 
	});		

		}
		else
		{

			var rating_values=rows[0].rating_values;
			if(rating_values)
			{
			var itemsWithRatings=rating_values.split("|");
      console.log(itemsWithRatings);
			for(i=0;i<itemsWithRatings.length-1;i++)
			{
				var parts=itemsWithRatings[i].split(":");
        console.log(parts+"\n");
				var id=Number(parts[0]);
				var rate=Number(parts[1]);
				ratings[id]=rate;
			}
		}
}
		request.session.ratings=ratings;

con.query("SELECT * FROM invoices where email=?",email,(err,rows) => {
    if(err) throw err;

    if(rows.length==0)
    {
     // response.render("home/profile",{name:request.session.name,first_name:name[0],last_name:name[1],email:request.session.email,objects:objects}); 
    }
    else
    {
      
      for(i=0;i<rows.length;i++)
      {
        var itemsAndQtys = rows[i].item_data.split("|");
        for(j=0;j<itemsAndQtys.length-1;j++)
        {
          var item_id=Number(itemsAndQtys[j].split(",")[0]);
          if(!freq[item_id] && item_id>0)
          {
            items_bought.push(item_id);

            itemsString+=item_id+",";
            freq[item_id]=1;
          }
        }
      }
    }



///
var itemArrayString="(";
for(i=0;i<items_bought.length;i++)
{
  itemArrayString+=""+items_bought[i];

    itemArrayString+=",";
}
itemArrayString+="0)";
var query="SELECT * from items where iid in "+itemArrayString;
query002="SELECT * from items where iid not in "+itemArrayString;
console.log(query);
con.query(query,(err,rows) => {
    if(err) throw err;
for(i=0;i<rows.length;i++)
{
  item_names[rows[i].iid]=rows[i].name;
  item_descriptions[rows[i].iid]=rows[i].description;
  var tagsArray=rows[i].tags.split("#");
  for(k=0;k<tagsArray.length;k++)
 {
  if(!tags_bought.contains(tagsArray[k]))
     tags_bought.push(tagsArray[k]);
 }
}



  for(i=0;i<items_bought.length;i++)
  {
    objects[i]={};
    objects[i].item_id=items_bought[i];
    if(ratings[items_bought[i]])
      objects[i].rating=ratings[items_bought[i]];
    else
      objects[i].nonrating=1;
    objects[i].item_name=item_names[items_bought[i]];
    objects[i].item_description=item_descriptions[items_bought[i]];
    
  }

two_arrays[0]=tags_bought;

con.query(query002,(err,rows) => {
    if(err) throw err;

for(i=0;i<rows.length;i++)
{
  two_arrays[1]=[];
  var tA=rows[i].tags.split("#");
  for(j=1;j<tA.length;j++)
  {
    two_arrays[1].push(tA[j]);
  }

rows[i]["common"]=getCommonElements(two_arrays).length;
}
sortByKey(rows,"common");

var itemlist=[];
      var x=0;

      for(i=0;i<rows.length;)
      {
        itemlist[x]={};
        itemlist[x].id1=rows[i].iid;
        itemlist[x].name1=rows[i].name;
        itemlist[x].description1=rows[i].description;
        itemlist[x].price1=rows[i].price;
        itemlist[x].image_url1=rows[i].image_url;
        i++;
        if(i>=rows.length)
          break;
        itemlist[x].id2=rows[i].iid;
        itemlist[x].name2=rows[i].name;
        itemlist[x].description2=rows[i].description;
        itemlist[x].price2=rows[i].price;
        itemlist[x].image_url2=rows[i].image_url;
        i++;
        if(i>=rows.length)
          break;
        x++;
      }

response.render("home/profile",{itemlist:itemlist,itemsString:itemsString,name:request.session.name,first_name:name[0],last_name:name[1],email:request.session.email,objects:objects});    
  });







///////////////////////

  
  


  
  });



  });

	});
	
	
	
	
};    
exports.RemoveFromCart=function(request,response)
{
	var id=request.params.id;
	var idString=""+id+",";
	var email=request.session.email;
	con.query("SELECT * FROM carts where email=?",email,(err,rows) => {
		if(err) throw err;
		var cartString = rows[0].iids;
		var newString = cartString.replace(idString,'');
		con.query("UPDATE carts set iids=? where email=?",[newString,email],(err,rows) => {
			if(err) throw err;

			response.redirect("/mycart");
		});

	});

};
function todayDate()
{
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!

	var yyyy = today.getFullYear();
	if(dd<10){
    	dd='0'+dd;
	} 	
	if(mm<10){
    	mm='0'+mm;
	} 
	var today = dd+'/'+mm+'/'+yyyy;
	return today;
}
exports.ViewCart=function(request,response)
{
	var email=request.session.email;
	var totalAmt=0;
	request.session.rows=[];
	var successMessage;
	if(request.session.successMessage=="yes")
	{
		successMessage="Payment successful! Your order will be delivered within 1 week...";
		request.session.successMessage="";	
	}
	var t=0;
	var invoice_id=1;
	con.query("SELECT max(id) from invoices",(err,rows) => {
		if(rows[0]["max(id)"]!=null)
		{
			invoice_id=Number(rows[0]["max(id)"])+1;
		}

	});
	request.session.todayDate=todayDate();
	con.query("SELECT * FROM carts where email=?",email,(err,rows) => {
		if(rows.length==0||!rows[0].iids)
		{
			response.render("home/cart",{name:request.session.name,successMessage:successMessage});
		}
		else
		{

			var cartString=rows[0].iids;
			var iidarr=cartString.split(",");
			var iids=[];
			var itemlist=[];
    		var x=0;
    		var h=0;
    		var freq=new Array(100);
    		for(i=0;i<iidarr.length-1;i++)
    		{
    			var substring=""+iidarr[i]+",";
    			freq[Number(iidarr[i])]=occurrence(cartString,substring);
    		}
    		
    		var query="SELECT * FROM items where iid in ("+cartString.slice(0,cartString.length-1)+")";
    		con.query(query,(err,rows) => {
    			if(err) throw err;
    			var l=rows.length;
    			request.session.rows=rows;
    			for(i=0;i<l;)
    			{
    				itemlist[x]={};
    				itemlist[x].id1=rows[i].iid;
    				itemlist[x].name1=rows[i].name;
    				itemlist[x].description1=rows[i].description;
    				itemlist[x].price1=rows[i].price;
    				itemlist[x].image_url1=rows[i].image_url;
    				itemlist[x].qty1=freq[Number(rows[i].iid)];
    				
    				request.session.rows[i].qty=freq[Number(rows[i].iid)];
    				request.session.rows[i].cost=Number(request.session.rows[i].qty)*Number(request.session.rows[i].price);
    				totalAmt+=request.session.rows[i].cost;
    				i++;
    				if(i>=rows.length)
    					break;
    				itemlist[x].id2=rows[i].iid;
    				itemlist[x].name2=rows[i].name;
    				itemlist[x].description2=rows[i].description;
    				itemlist[x].price2=rows[i].price;
    				itemlist[x].image_url2=rows[i].image_url;
    				itemlist[x].qty2=freq[Number(rows[i].iid)];
    				
    				request.session.rows[i].qty=freq[Number(rows[i].iid)];
    				request.session.rows[i].cost=Number(request.session.rows[i].qty)*Number(request.session.rows[i].price);
    				totalAmt+=request.session.rows[i].cost;
    				i++;
    				if(i>=rows.length)
    					break;
    				itemlist[x].id3=rows[i].iid;
    				itemlist[x].name3=rows[i].name;
    				itemlist[x].description3=rows[i].description;
    				itemlist[x].price3=rows[i].price;
    				itemlist[x].image_url3=rows[i].image_url;
    				itemlist[x].qty3=freq[Number(rows[i].iid)];
    				
    				request.session.rows[i].qty=freq[Number(rows[i].iid)];
    				request.session.rows[i].cost=Number(request.session.rows[i].qty)*Number(request.session.rows[i].price);
    				totalAmt+=request.session.rows[i].cost;
    				i++;
    				if(i>=rows.length)
    					break;
    		
    				x++;	
    			}

    		request.session.totalAmt=totalAmt;
  response.render("home/cart",{successMessage:successMessage,invoice_id:invoice_id,itemlist:itemlist,name:request.session.name,rows:request.session.rows,todayDate:request.session.todayDate,totalAmt:totalAmt});
    		
    		
    		});
		    
		}
	});


};
exports.AddToCart=function(request,response)
    {
    	var id=request.params.id;
    	var email=request.session.email;
    	var cart={email:email, iids:""};
    	var iids=[];
    	con.query("SELECT * FROM carts where email=?",email,(err,rows) => {
    		if(rows.length==0)
    		{

    		con.query("INSERT into carts SET ?",cart,(err,rows) => {
if(err) throw err;
response.redirect("/mycart");
});		
    		}
    		else
    		{
    			var str=rows[0].iids;
    			var iidarr=str.split(",");
    			for(i=0;i<iidarr.length-1;i++)
    			{
    				iids[i]=Number(iidarr[i]);
    			}
    			iids=iids.sort();

    		}
iids.push(Number(id));
    	con.query("DELETE FROM carts where email=?",email,(err,rows) => {



    	});
    	var newstr="";
    	for(i=0;i<iids.length;i++)
    	{
    		newstr+=""+iids[i]+",";
    	}
    	cart.iids=newstr;
con.query("INSERT into carts SET ?",cart,(err,rows) => {
if(err) throw err;
    		console.log(cart);
    		response.redirect("/mycart");
    		
    	});

    		});
    	

};
////////////////////////////////
var config = {
  "port" : 1337,
  "api" : {
    "host" : "api.sandbox.paypal.com",
    "port" : "",            
    "client_id" : "AcxjFJjsReso7UbiJXfpFmT1HOXpmAn4WP7wXP0wurT81WkGAnkRAOjTZT2AaccRVlcnvlqp1Uhprzr3",  // your paypal application client id
    "client_secret" : "EIqvBeQSeRBcmJ7IBtUzcUdIcCwIf3NArlzzL_yZIA-kn_gQQh7qRUiA0OeFKUgw4Rac20FhTYC2CPvU" // your paypal application secret id
  }
};

paypal.configure(config.api);
 
///////////////// 
exports.Buy=function(request,response)
    {
    	/*var iid=request.params.id;
    	con.query("SELECT * FROM items where iid=?",iid,(err,rows) => {

      if(err) throw err;
      if(rows.length!=0)
      {
      	var item={};
      	item.iid=rows[0].iid;
      	item.name=rows[0].name;
      	item.description=rows[0].description;
      	item.price=rows[0].price;
      	item.image_url=rows[0].image_url;
      	request.session.bill=item.price;
      	response.render("home/Other",{item:item});
      }
  });*/
  request.session.address="";
  var name=request.body.name;
  
  
  var phone=request.body.phone;
  var address=""+name+"|"+request.body.address+"|"+phone;
  request.session.address=address;
  console.log(address+"lll"+request.session.address);
  if(request.session.rows.length>0)
  {
  //	response.render("home/Pay",{totalAmt:request.session.totalAmt});
  var payment = {
  "intent": "sale",
  "payer": {
    "payment_method": "paypal"
  },
  "redirect_urls": {
    "return_url": "https://b3-ieb-handicrafts.now.sh/success",
    "cancel_url": "https://b3-ieb-handicrafts.now.sh/cancel"
   /*"return_url": "http://localhost:1337/success",
    "cancel_url": "http://localhost:1337/cancel"*/
  },
  "transactions": [{
    "amount": {
      "total":parseInt(request.session.totalAmt),
      "currency":  "USD"
    },
    "description": "Payment to B3 Handicrafts"
  }]
};

  paypal.payment.create(payment, function (error, payment) {
  if (error) {
    console.log(error);
  } else {
    if(payment.payer.payment_method === 'paypal') {
      request.paymentId = payment.id;
      var redirectUrl;
      console.log(payment);
      for(var i=0; i < payment.links.length; i++) {
        var link = payment.links[i];
        if (link.method === 'REDIRECT') {
          redirectUrl = link.href;
        }
      }
      response.redirect(redirectUrl);
    }
  }
});
  }
  else
  {

  }
};

exports.StoreTransaction=function(request,response)
{
	
	var invoice={};
	var item_data="";
	for(i=0;i<request.session.rows.length;i++)
	{
		item_data+=request.session.rows[i].iid+","+request.session.rows[i].qty+"|";
	}
	var address=request.session.address;
	var invoice={email:request.session.email,address:address,item_data:item_data};
	con.query("INSERT into invoices SET ?",invoice,(err,rows) => {
	if(err) throw err;
	con.query("UPDATE carts set iids=? where email=?",["",request.session.email],(err,rows) => {
			if(err) throw err;
			request.session.rows=[];
			request.session.totalAmt="";
			request.session.address="";
			request.session.successMessage="yes";
			response.redirect("/mycart");
		});
	});


};

exports.Finduser = function(request, response){
  con.query("SELECT * FROM ratings",(err,rows) => {
    if(err) throw err;
    var totalNums=[];
    var totalRatings=[];
    var avg_ratings=[];
    for(q=0;q<rows.length;q++)
    {
      var parts=rows[q].rating_values.split("|");
      for(w=0;w<parts.length;w++)
      {
       var parts2=parts[w].split(":");
       var id=Number(parts2[0]);
       if(totalNums[id])
        totalNums[id]++;
       else
        totalNums[id]=1;
       var r=Number(parts2[1]);
       if(totalRatings[id])
        totalRatings[id]+=r;
       else
        totalRatings[id]=r;
      }

    }
    for(s=0;s<totalNums.length;s++)
    {
     if(totalNums[s])
     {
        avg_ratings[s]=totalRatings[s]/totalNums[s];
     }
    }
   var cid=request.params.id;
  if(request.session.name)
  {
    var categories=[];
    var active_category={};
    con.query("SELECT * FROM categories",(err,rows) => {
      if(err) throw err;
      categories=rows;
      for (i=0;i<rows.length;i++)
      {
        if(rows[i].cid==request.params.id)
        {
          active_category=rows[i];
        }
      }
      con.query("SELECT * FROM items where cid=?",cid,(err,rows) => {

      if(err) throw err;
      var itemlist=[];
      var x=0;

      for(i=0;i<rows.length;)
      {
        itemlist[x]={};
        itemlist[x].id1=rows[i].iid;
        itemlist[x].name1=rows[i].name;
        itemlist[x].description1=rows[i].description;
        itemlist[x].price1=rows[i].price;
        itemlist[x].image_url1=rows[i].image_url;
        itemlist[x].avg_rating_num1=(avg_ratings[Number(rows[i].iid)]);
        console.log(itemlist[x].avg_rating_num1);
        i++;
        if(i>=rows.length)
          break;
        itemlist[x].id2=rows[i].iid;
        itemlist[x].name2=rows[i].name;
        itemlist[x].description2=rows[i].description;
        itemlist[x].price2=rows[i].price;
        itemlist[x].image_url2=rows[i].image_url;
        itemlist[x].avg_rating_num2=(avg_ratings[Number(rows[i].iid)]);
        i++;
        if(i>=rows.length)
          break;
        itemlist[x].id3=rows[i].iid;
        itemlist[x].name3=rows[i].name;
        itemlist[x].description3=rows[i].description;
        itemlist[x].price3=rows[i].price;
        itemlist[x].image_url3=rows[i].image_url;
        itemlist[x].avg_rating_num3=(avg_ratings[Number(rows[i].iid)]);
        i++;
        if(i>=rows.length)
          break;
        
        x++;
      }
    response.render("home/site",{categories:categories,active_category:active_category,itemlist:itemlist,name:request.session.name});
      });
      
      }); 
    

  }
  else
  {
    response.render("home/Index");
  } 
  });
	
};