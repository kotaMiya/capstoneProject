(function(){


window.hangsper = window.hs = {
	/*
	 * initialize 
	 */
 	keyPress:function(e,succFn){
		    if(e.keyCode === 13){
		        e.preventDefault(); // Ensure it is only this code that rusn
		        succFn(this);
			    }
			},

	init:function(){


	},

	/**
	 *get Element By Id
	 */

	getId:function(element_id){
		return document.getElementById(element_id);
	},

	/**
	 *
	 *get Element By ClassName
	 *
	 */
	getClassName:function(parentElement,classElement){
		if(classElement == undefined){
			return document.getElementsByClassName(parentElement);
		}
		return parentElement.getElementsByClassName(classElement);
	},

	/**
	 * get Elements By TagName
	 */
	getTagName:function(parentElement,tagElement){		
		if(tagElement == undefined){
			return document.getElementsByTagName(parentElement);
		}
		return parentElement.getElementsByTagName(tagElement);
	},
	/**
	 * Get current time 
	 */
	getCurrentTime:function(){
		var oDate = new Date();
		var aDate = [];
		aDate.push(oDate.getFullYear());
		aDate.push(oDate.getMonth()+1);
		aDate.push(oDate.getDate());
		aDate.push(oDate.getHours());
		aDate.push(oDate.getMinutes());
		aDate.push(oDate.getSeconds());
		aDate.push(oDate.getDay());
		aDate.push(oDate.getTime());
		return aDate;
	},

	isEmpty:function(value){
		var empty=true;
		if (value=="" || value == undefined || value == null){
			empty = true;
		}else{
			empty = false;
		}
		return empty;
	},
	/**
	 * Ajax connect
	 * 
	 */
	ajax:function(json){
		var timer=null;
		json=json || {};
		if(!json.url){
			alert('Please check your Url');
			return;	
		}
		json.type=json.type || 'get';
		json.time=json.time ||  10;
		json.data=json.data || {};
		if(window.XMLHttpRequest){
			var oAjax=new XMLHttpRequest();
		}
		else{
			var oAjax=new ActiveXObject('Microsoft.XMLHTTP');	
		}
		switch(json.type.toLowerCase()){
			case 'get':
				oAjax.open('GET',json.url+getjson2url(json.data),true);
				oAjax.setRequestHeader('X-Requested-With','XMLHttpRequest');
				oAjax.send();
				break;
			case 'post':
				oAjax.open('POST',json.url,true);
				oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				oAjax.setRequestHeader('X-Requested-With','XMLHttpRequest');
				oAjax.send(postjson2url(json.data));
				break;
		}	
		oAjax.onreadystatechange=function(){
			if(oAjax.readyState==4){
				if(oAjax.status>=200 && oAjax.status<300 || oAjax.status==304){
					clearTimeout(timer);
					json.succFn && json.succFn(oAjax.responseText);	
				}else{
					clearTimeout(timer);
					json.errFn && json.errFn(oAjax.status);
				}
			}	
		}
		timer=setTimeout(function(){
			alert('Time Out');
			oAjax.onreadystatechange=null;
		},json.time*1000);	
		
		function getjson2url(json){
			//json.t = Math.random();
			var arr=[];
			for(var name in json){
				arr.push('/'+json[name]);
			}
			return arr.join('');
		}


		function postjson2url(json){
			// json.t = Math.random();
			var arr=[];
			for(var name in json){
				arr.push(name+'='+json[name]);
			}
			return arr.join('&');
		}	
	},
	/**
	 * Ajax - get
	 */
	getAjax:function(jsonData){
		hs.ajax({
			url:jsonData.url,
			data:jsonData.data,
			succFn:jsonData.succFn,
			type:'get'
		});
	},
	/**
	 * Ajax - post
	 */
	postAjax:function(jsonData){
		hs.ajax({
			url:jsonData.url,
			data:jsonData.data,
			succFn:jsonData.succFn,
			type:'post'
		});
	},
	/**
	* redirect
	*/
	redirect:function(url){
		return window.location.href = url;
	},


	text:function(el,text){
		el.innerHTML = text;
	},


	click:function(el,succfn){
		el.addEventListener('click',function(){
			succfn(this);
		});
	},

	toast:function(color,time,text){
		var colorCode = {
			green:"#00cc33",
			red:"#ff0000"
		}
		var div = document.createElement('div');
		hs.text(div,text);
		div.setAttribute('id', 'toast');
		document.body.appendChild(div);
		if (color == "green"){
			div.style.background = colorCode.green;
		}else if (color == "red"){
			div.style.background =colorCode.red;
		}
	    // Add the "show" class to DIV
	    div.className = "show";

	    // After 3 seconds, remove the show class from DIV
	    setTimeout(function(){ 
	    	div.className = div.className.replace("show", "");
	    	hs.removeEle(div);
	     }, time*1000);
	},

	removeEle:function (el) {
	    return el.parentNode.removeChild(el);
	},
	randomColor:function(){
		return '#' + ('00000'+(Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
	},
	randomNum:function(min,max){
		return Math.floor(min + Math.random() * (max-min));
	},

	calandar:function(el, data, settings){
	    var obj = new Calendar(data, settings);
	 	createCalendar(obj, el);
	},

	pageLoader:function(toLoadTag){
		var loader = document.createElement('div');
		loader.setAttribute('id', 'loader');
		document.body.appendChild(loader);

		var element = hs.getTagName(toLoadTag)[0];
		var parent = element.parentNode;
		var wrapper = document.createElement('div');
		wrapper.setAttribute('id','respones');
		wrapper.setAttribute('class','animate-bottom');
		parent.replaceChild(wrapper, element);
		wrapper.appendChild(element);
	},

	loading:function(){
		hs.getId("loader").style.display = "block";
		hs.getId("respones").style.display = "none";
		var load = setTimeout(function(){
		  hs.getId("loader").style.display = "none";
		  hs.getId("respones").style.display = "block";
		},10000);
	},

    sqlToJsDate:function(sqlDate){
      	var sqlDateArr1 = sqlDate.split("-");
      //format of sqlDateArr1[] = ['yyyy','mm','dd hh:mm:ms']
     	var sYear = sqlDateArr1[0];
      	var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
      	var sqlDateArr2 = sqlDateArr1[2].split("T");
      //format of sqlDateArr2[] = ['dd', 'hh:mm:ss.ms']
      	var sDay = (Number(sqlDateArr2[0]) + 1).toString();
      
      	return new Date(sYear,sMonth,sDay);
	},


	uploadFile:function(file,url,succFn){
		var xhr = new XMLHttpRequest();
		var formData = new FormData();
	    formData.append('file', file);
	    xhr.onload = function(){
	    	if(xhr.readyState==4){
				if(xhr.status>=200 && xhr.status<300 || xhr.status==304){
					succFn(xhr.responseText);	
				}else{
					hs.toast('red',2,'error code: '+xhr.status);
				}
			}	
	    };
	    xhr.open('post', url, true);
	    xhr.send(formData);
	}


	

}

})();


	/*
	* Calandar function
	*/
	var Calendar = function(model, options, date){
	  // Default Values
	  this.Options = {
	    Color: '',
	    LinkColor: '',
	    NavShow: true,
	    NavVertical: false,
	    NavLocation: '',
	    DateTimeShow: true,
	    DateTimeFormat: 'mmm, yyyy',
	    DatetimeLocation: '',
	    EventClick: '',
	    EventTargetWholeDay: false,
	    DisabledDays: [],
	    ModelChange: model
	  };
	  // Overwriting default values
	  for(var key in options){
	    this.Options[key] = typeof options[key]=='string'?options[key].toLowerCase():options[key];
	  }

	  model?this.Model=model:this.Model={};
	  this.Today = new Date();

	  this.Selected = this.Today
	  this.Today.Month = this.Today.getMonth();
	  this.Today.Year = this.Today.getFullYear();
	  if(date){this.Selected = date}
	  this.Selected.Month = this.Selected.getMonth();
	  this.Selected.Year = this.Selected.getFullYear();

	  this.Selected.Days = new Date(this.Selected.Year, (this.Selected.Month + 1), 0).getDate();
	  this.Selected.FirstDay = new Date(this.Selected.Year, (this.Selected.Month), 1).getDay();
	  this.Selected.LastDay = new Date(this.Selected.Year, (this.Selected.Month + 1), 0).getDay();

	  this.Prev = new Date(this.Selected.Year, (this.Selected.Month - 1), 1);
	  if(this.Selected.Month==0){this.Prev = new Date(this.Selected.Year-1, 11, 1);}
	  this.Prev.Days = new Date(this.Prev.getFullYear(), (this.Prev.getMonth() + 1), 0).getDate();
	};

	function createCalendar(calendar, element, adjuster){
	  if(typeof adjuster !== 'undefined'){
	    var newDate = new Date(calendar.Selected.Year, calendar.Selected.Month + adjuster, 1);
	    calendar = new Calendar(calendar.Model, calendar.Options, newDate);
	    element.innerHTML = '';
	  }else{
	    for(var key in calendar.Options){
	      typeof calendar.Options[key] != 'function' && typeof calendar.Options[key] != 'object' && calendar.Options[key]?element.className += " " + key + "-" + calendar.Options[key]:0;
	    }
	  }
	  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	  function AddSidebar(){
	    var sidebar = document.createElement('div');
	    sidebar.className += 'cld-sidebar';

	    var monthList = document.createElement('ul');
	    monthList.className += 'cld-monthList';

	    for(var i = 0; i < months.length - 3; i++){
	      var x = document.createElement('li');
	      x.className += 'cld-month';
	      var n = i - (4 - calendar.Selected.Month);
	      // Account for overflowing month values
	      if(n<0){n+=12;}
	      else if(n>11){n-=12;}
	      // Add Appropriate Class
	      if(i==0){
	        x.className += ' cld-rwd cld-nav';
	        x.addEventListener('click', function(){
	          typeof calendar.Options.ModelChange == 'function'?calendar.Model = calendar.Options.ModelChange():calendar.Model = calendar.Options.ModelChange;
	          createCalendar(calendar, element, -1);});
	        x.innerHTML += '<svg height="15" width="15" viewBox="0 0 100 75" fill="rgba(255,255,255,0.5)"><polyline points="0,75 100,75 50,0"></polyline></svg>';
	      }
	      else if(i==months.length - 4){
	        x.className += ' cld-fwd cld-nav';
	        x.addEventListener('click', function(){
	          typeof calendar.Options.ModelChange == 'function'?calendar.Model = calendar.Options.ModelChange():calendar.Model = calendar.Options.ModelChange;
	          createCalendar(calendar, element, 1);} );
	        x.innerHTML += '<svg height="15" width="15" viewBox="0 0 100 75" fill="rgba(255,255,255,0.5)"><polyline points="0,0 100,0 50,75"></polyline></svg>';
	      }
	      else{
	        if(i < 4){x.className += ' cld-pre';}
	        else if(i > 4){x.className += ' cld-post';}
	        else{x.className += ' cld-curr';}

	        //prevent losing var adj value (for whatever reason that is happening)
	        (function () {
	          var adj = (i-4);
	          //x.addEventListener('click', function(){createCalendar(calendar, element, adj);console.log('kk', adj);} );
	          x.addEventListener('click', function(){
	            typeof calendar.Options.ModelChange == 'function'?calendar.Model = calendar.Options.ModelChange():calendar.Model = calendar.Options.ModelChange;
	            createCalendar(calendar, element, adj);} );
	          x.setAttribute('style', 'opacity:' + (1 - Math.abs(adj)/4));
	          x.innerHTML += months[n].substr(0,3);
	        }()); // immediate invocation

	        if(n==0){
	          var y = document.createElement('li');
	          y.className += 'cld-year';
	          if(i<5){
	            y.innerHTML += calendar.Selected.Year;
	          }else{
	            y.innerHTML += calendar.Selected.Year + 1;
	          }
	          monthList.appendChild(y);
	        }
	      }
	      monthList.appendChild(x);
	    }
	    sidebar.appendChild(monthList);
	    if(calendar.Options.NavLocation){
	      document.getElementById(calendar.Options.NavLocation).innerHTML = "";
	      document.getElementById(calendar.Options.NavLocation).appendChild(sidebar);
	    }
	    else{element.appendChild(sidebar);}
	  }

	  var mainSection = document.createElement('div');
	  mainSection.className += "cld-main";

	  function AddDateTime(){
	      var datetime = document.createElement('div');
	      datetime.className += "cld-datetime";
	      if(calendar.Options.NavShow && !calendar.Options.NavVertical){
	        var rwd = document.createElement('div');
	        rwd.className += " cld-rwd cld-nav";
	        rwd.addEventListener('click', function(){createCalendar(calendar, element, -1);} );
	        rwd.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0,0,0,0.5)"><polyline points="0,50 75,0 75,100"></polyline></svg>';
	        datetime.appendChild(rwd);
	      }
	      var today = document.createElement('div');
	      today.className += ' today';
	      today.innerHTML = months[calendar.Selected.Month] + ", " + calendar.Selected.Year;
	      datetime.appendChild(today);
	      if(calendar.Options.NavShow && !calendar.Options.NavVertical){
	        var fwd = document.createElement('div');
	        fwd.className += " cld-fwd cld-nav";
	        fwd.addEventListener('click', function(){createCalendar(calendar, element, 1);} );
	        fwd.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0,0,0,0.5)"><polyline points="0,0 75,50 0,100"></polyline></svg>';
	        datetime.appendChild(fwd);
	      }
	      if(calendar.Options.DatetimeLocation){
	        document.getElementById(calendar.Options.DatetimeLocation).innerHTML = "";
	        document.getElementById(calendar.Options.DatetimeLocation).appendChild(datetime);
	      }
	      else{mainSection.appendChild(datetime);}
	  }

	  function AddLabels(){
	    var labels = document.createElement('ul');
	    labels.className = 'cld-labels';
	    var labelsList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	    for(var i = 0; i < labelsList.length; i++){
	      var label = document.createElement('li');
	      label.className += "cld-label";
	      label.innerHTML = labelsList[i];
	      labels.appendChild(label);
	    }
	    mainSection.appendChild(labels);
	  }
	  function AddDays(){
	    // Create Number Element
	    function DayNumber(n){
	      var number = document.createElement('p');
	      number.className += "cld-number";
	      number.innerHTML += n;
	      return number;
	    }
	    var days = document.createElement('ul');
	    days.className += "cld-days";
	    // Previous Month's Days
	    for(var i = 0; i < (calendar.Selected.FirstDay); i++){
	      var day = document.createElement('li');
	      day.className += "cld-day prevMonth";
	      //Disabled Days
	      var d = i%7;
	      for(var q = 0; q < calendar.Options.DisabledDays.length; q++){
	        if(d==calendar.Options.DisabledDays[q]){
	          day.className += " disableDay";
	        }
	      }

	      var number = DayNumber((calendar.Prev.Days - calendar.Selected.FirstDay) + (i+1));
	      day.appendChild(number);

	      days.appendChild(day);
	    }
	    // Current Month's Days
	    for(var i = 0; i < calendar.Selected.Days; i++){
	      var day = document.createElement('li');
	      day.className += "cld-day currMonth";
	      //Disabled Days
	      var d = (i + calendar.Selected.FirstDay)%7;
	      for(var q = 0; q < calendar.Options.DisabledDays.length; q++){
	        if(d==calendar.Options.DisabledDays[q]){
	          day.className += " disableDay";
	        }
	      }
	      var number = DayNumber(i+1);
	      // Check Date against Event Dates
	      for(var n = 0; n < calendar.Model.length; n++){
	        var evDate = calendar.Model[n].Date //hs.sqlToJsDate(calendar.Model[n].Date);
	        var toDate = new Date(calendar.Selected.Year, calendar.Selected.Month, (i+1));
	        if(evDate.getTime() == toDate.getTime()){
	          number.className += " eventday";
	          var title = document.createElement('span');
	          title.className += "cld-title";
	          if(typeof calendar.Model[n].Link == 'function' || calendar.Options.EventClick){
	            var a = document.createElement('a');
	            a.setAttribute('href', '#');
	            a.innerHTML += calendar.Model[n].Title;
	            if(calendar.Options.EventClick){
	              var z = calendar.Model[n].Link;
	              if(typeof calendar.Model[n].Link != 'string'){
	                  a.addEventListener('click', calendar.Options.EventClick.bind.apply(calendar.Options.EventClick, [null].concat(z)) );
	                  if(calendar.Options.EventTargetWholeDay){
	                    day.className += " clickable";
	                    day.addEventListener('click', calendar.Options.EventClick.bind.apply(calendar.Options.EventClick, [null].concat(z)) );
	                  }
	              }else{
	                a.addEventListener('click', calendar.Options.EventClick.bind(null, z) );
	                if(calendar.Options.EventTargetWholeDay){
	                  day.className += " clickable";
	                  day.addEventListener('click', calendar.Options.EventClick.bind(null, z) );
	                }
	              }
	            }else{
	              a.addEventListener('click', calendar.Model[n].Link);
	              if(calendar.Options.EventTargetWholeDay){
	                day.className += " clickable";
	                day.addEventListener('click', calendar.Model[n].Link);
	              }
	            }
	            title.appendChild(a);
	          }else{

	          	//////////must write a eventsClick(self) function to handle click logic/////////////////// 
	            


	            title.innerHTML += '<div id = "'+calendar.Model[n].Link+'" class="dateEvent" onclick="eventsClick(this);">'+ calendar.Model[n].Title + '</div>';
	          


	            ////////////////////////////////////////////////////////////////////////////////////
	          }
	          number.appendChild(title);
	        }
	      }
	      day.appendChild(number);
	      // If Today..
	      if((i+1) == calendar.Today.getDate() && calendar.Selected.Month == calendar.Today.Month && calendar.Selected.Year == calendar.Today.Year){
	        day.className += " today";
	      }
	      days.appendChild(day);
	    }
	    // Next Month's Days
	    // Always same amount of days in calander
	    var extraDays = 13;
	    if(days.children.length>35){extraDays = 6;}
	    else if(days.children.length<29){extraDays = 20;}

	    for(var i = 0; i < (extraDays - calendar.Selected.LastDay); i++){
	      var day = document.createElement('li');
	      day.className += "cld-day nextMonth";
	      //Disabled Days
	      var d = (i + calendar.Selected.LastDay + 1)%7;
	      for(var q = 0; q < calendar.Options.DisabledDays.length; q++){
	        if(d==calendar.Options.DisabledDays[q]){
	          day.className += " disableDay";
	        }
	      }

	      var number = DayNumber(i+1);
	      day.appendChild(number);

	      days.appendChild(day);
	    }
	    mainSection.appendChild(days);
	  }
	  if(calendar.Options.Color){
	    mainSection.innerHTML += '<style>.cld-main{color:' + calendar.Options.Color + ';}</style>';
	  }
	  if(calendar.Options.LinkColor){
	    mainSection.innerHTML += '<style>.cld-title a{color:' + calendar.Options.LinkColor + ';}</style>';
	  }
	  element.appendChild(mainSection);

	  if(calendar.Options.NavShow && calendar.Options.NavVertical){
	    AddSidebar();
	  }
	  if(calendar.Options.DateTimeShow){
	    AddDateTime();
	  }
	  AddLabels();
	  AddDays();
	}


	////////////////////////////End of calandar function//////////////////////////////////

	