
function getID(Id){
	 return document.getElementById(Id);
};

		var ByEnterShow = getID("ByEnter");
		var ByLocationShow = getID("ByLocation");
		var ByEnter = getID("left");
		var ByLocation = getID("right");


	function leftClick(){
	
		ByEnterShow.style.display="block";
		ByEnter.style.background="#ADADAD";
		ByLocation.style.background="#FFFFDF";
		ByLocationShow.style.display="none";
	};
	function rightClick(){
		ByEnterShow.style.display="none";
		ByEnter.style.background="#FFFFDF";
		ByLocation.style.background="#ADADAD";
		ByLocationShow.style.display="block";
	};







