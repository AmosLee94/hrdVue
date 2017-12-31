(function(){
// 全局变量：
	var board = document.getElementById("board");
	var pieces = new Array;//棋子，一个字符数组，包含七个棋子和两个空位
	var blankPieces = new Array;
	var subsistentPiece = new Array;
	var activePiece;//当前被选中的棋子
	// 按钮
	var resetButton = document.getElementById("reset");
	var nextButton = document.getElementById('nextStep');
	var preButton = document.getElementById('preStep');
	var autoButton = document.getElementById('auto');
	resetButton.addEventListener("click",function(){reset(0);});
//解决方法
	var solution = [["HuangZhong","DOWN"],["GuanYu" ,"RIGHT"],["Zu1" ,"LEFT"],["Zu2" ,"LEFT"],["Zu3" ,"DOWN"],["Zu4" ,"LEFT"],["MaChao" ,"LEFT"],["ZhaoYun" ,"DOWN"],["ZhaoYun" ,"DOWN"],["CaoCao" ,"RIGHT"],["Zu2" ,"UP"],["Zu1" ,"RIGHT"],["HuangZhong","UP"],["Zu2" ,"UP"],["Zu1" ,"UP"],["Zu4" ,"UP"],["Zu3" ,"UP"],["GuanYu" ,"LEFT"],["ZhaoYun" ,"DOWN"],["GuanYu" ,"LEFT"],["MaChao" ,"DOWN"],["CaoCao" ,"DOWN"],["Zu2" ,"RIGHT"],["Zu1" ,"UP"],["Zu2" ,"RIGHT"],["Zu1" ,"RIGHT"],["Zu4" ,"UP"],["Zu4" ,"UP"],["CaoCao" ,"LEFT"],["ZhaoYun" ,"UP"],["ZhaoYun" ,"UP"],["MaChao" ,"RIGHT"],["Zu3" ,"RIGHT"],["Zu3" ,"DOWN"],["CaoCao" ,"DOWN"],["Zu1" ,"DOWN"],["Zu4" ,"RIGHT"],["ZhangFei" ,"RIGHT"],["HuangZhong","UP"],["HuangZhong","UP"],["CaoCao" ,"LEFT"],["Zu1" ,"DOWN"],["Zu1" ,"DOWN"],["Zu4" ,"DOWN"],["Zu2" ,"LEFT"],["ZhaoYun" ,"UP"],["MaChao" ,"UP"],["Zu3" ,"RIGHT"],["Zu1" ,"DOWN"],["CaoCao" ,"RIGHT"],["HuangZhong","DOWN"],["HuangZhong","DOWN"],["ZhangFei" ,"LEFT"],["Zu2" ,"LEFT"],["Zu4" ,"LEFT"],["ZhaoYun" ,"LEFT"],["MaChao" ,"UP"],["MaChao" ,"UP"],["CaoCao" ,"RIGHT"],["HuangZhong","RIGHT"],["ZhangFei" ,"DOWN"],["Zu2" ,"LEFT"],["Zu4" ,"UP"],["HuangZhong","UP"],["GuanYu" ,"UP"],["Zu1" ,"LEFT"],["Zu1" ,"LEFT"],["Zu3" ,"LEFT"],["Zu3" ,"LEFT"],["CaoCao" ,"DOWN"],["ZhaoYun" ,"DOWN"],["MaChao" ,"DOWN"],["Zu4" ,"RIGHT"],["Zu2" ,"RIGHT"],["ZhangFei" ,"UP"],["Zu4" ,"RIGHT"],["Zu2" ,"RIGHT"],["HuangZhong","UP"],["GuanYu" ,"UP"],["Zu1" ,"UP"],["Zu3" ,"LEFT"],["CaoCao" ,"LEFT"]];

//自动行走
	var stepNumber = 0;
	var AutoMoveTimer;
//函数：
//init() 	//添加方块，并按方案进行排列，再把节点都存进pieces变量中
//reset()	//按照方案重新排列
//moveByDirection()	//移动一个方块
	init();
	resetButton.addEventListener("click",function(){reset(0);});
	nextButton.addEventListener("click",autoMove);
	preButton.addEventListener("click",revokeAutoMove);
	autoButton.addEventListener("click",addAutoMoveTimer);
	document.addEventListener("keydown",function(event){
		switch(event.keyCode){
			case 40:autoMove();break;
			case 38:revokeAutoMove();break;
		}
	});
// 函数
	function init() {
		function addPiece(id){
			switch(id){
				case "ZhaoYun":case "HuangZhong":case "ZhangFei":case "MaChao":
					rowspan = 2;colspan = 1;break;
				case "Zu1":case "Zu2":case "Zu3":case "Zu4":
					rowspan = 1;colspan = 1;break;
				case "CaoCao":
					rowspan = 2;colspan = 2;break;
				case "GuanYu":
					rowspan = 1;colspan = 2;break;
			}
			var newPiece = document.createElement("img");
			newPiece.setAttribute("class","piece");
			newPiece.setAttribute("x",0);
			newPiece.setAttribute("y",0);
			newPiece.setAttribute("colspan",colspan);
			newPiece.setAttribute("rowspan",rowspan);
			newPiece.setAttribute("id",id);
			newPiece.setAttribute("src","img/"+id+".jpg");
			newPiece.setAttribute("draggable","false");
			board.appendChild(newPiece);
			pieces[id] = newPiece;
			subsistentPiece[id] = newPiece;
		}
		function addBlank(number){
			id = "blank_"+number;
			var newBlank = document.createElement("div");
			newBlank.setAttribute("class","piece");
			newBlank.setAttribute("x",0);
			newBlank.setAttribute("y",0);
			newBlank.setAttribute("colspan",1);
			newBlank.setAttribute("rowspan",1);
			newBlank.setAttribute("id",id);
			board.appendChild(newBlank);
			pieces[id] = newBlank;
			blankPieces[number] = newBlank;
		}
		addPiece("CaoCao");
		addPiece("GuanYu");
		addPiece("ZhaoYun");
		addPiece("HuangZhong");
		addPiece("ZhangFei");
		addPiece("MaChao");
		addPiece("Zu1");
		addPiece("Zu2");
		addPiece("Zu3");
		addPiece("Zu4");
		addBlank(0);
		addBlank(1);
		reset(0);
	}
	function reset(planIndex){//按照方案重新排列
		var pieceID = ["CaoCao","GuanYu","ZhaoYun","HuangZhong","ZhangFei","MaChao","Zu1","Zu2","Zu3","Zu4","blank_0","blank_1"]
		var plan = [
			[[1,0],[1,4],[3,0],[0,2],[0,0],[3,2],[1,2],[2,2],[1,3],[2,3],[0,4],[3,4]]
		];
		for (var i in pieceID) {
			moveByXY(pieceID[i],plan[planIndex][i][0],plan[planIndex][i][1]);
		}
		stepNumber= 0;
		removeAutoMoveTimer();
	}
	function moveByDirection(id,direction){//移动一个方块
		var piece = pieces[id];
		if(!piece){
			console.log("error 0:function moveByDirection("+id+","+direction+"):Unable to find!");
			return;
		}else{
			x = parseInt(piece.getAttribute("x"));
			y = parseInt(piece.getAttribute("y"));
			rowspan = parseInt(piece.getAttribute("rowspan"));
			colspan = parseInt(piece.getAttribute("colspan"));
			switch(direction){
				case "UP":y -=1;break;
				case "DOWN":y +=1;break;
				case "LEFT":x -=1;break;
				case "RIGHT":x +=1;break;
			}
			if(x>=0 && x+colspan<5 && y>=0 &&y+rowspan<6){
				piece.setAttribute("x",x);
				piece.setAttribute("y",y);
				return true;
			}else{
				console.log("error 2:function moveByDirection("+id+","+direction+"):Unable to move!("+"X="+x+";y="+y+")");
				return false;
			}
		}
	}
	function moveByXY(id,x,y){//移动一个方块
		var piece = pieces[id];
		piece.setAttribute("x",x);
		piece.setAttribute("y",y);
	}
	for (var key in subsistentPiece) {
		subsistentPiece[key].addEventListener("click",function(e){
			if(activePiece&&activePiece.getAttribute("active")) activePiece.removeAttribute("active");
			activePiece = this;
			activePiece.setAttribute("active",1);
			if ( e && e.stopPropagation ) e.stopPropagation();else window.event.cancelBubble = true; 
		});
	}
	// for(var key in blankPieces){
	// 	blankPieces[key].addEventListener("click",function(e){
	// 		if(activePiece){
	// 			var direction;
	// 			var activeBlankPieces;
	// 			var temp;
	// 			// 长，宽
	// 			var length;
	// 			var width;

	// 			var colspan=parseInt(activePiece.getAttribute("colspan"));
	// 			var rowspan=parseInt(activePiece.getAttribute("rowspan"));

	// 			var blank = this;
	// 			var otherBlank;
	// 			if(blank == blankPieces[0]){
	// 				otherBlank = blankPieces[1];
	// 			}else{
	// 				otherBlank = blankPieces[0];
	// 			}
	// 			// 判断方向
	// 			direction = findDirection(activePiece,blank);
	// 			switch(direction){
	// 				case "UP":case "DOWN":
	// 					length = rowspan;
	// 					width = colspan;
	// 					break;
	// 				case "LEFT":case "RIGHT":
	// 					length = colspan;
	// 					width = rowspan;
	// 					break;
	// 				default:console.log("error!direction="+direction);return false;
	// 			}
	// 			if(width == 1){
	// 				activeBlankPieces = new Array(this);
	// 			}else{
	// 				activeBlankPieces = new Array(this,otherBlank);
	// 				// 判断第二个空白的方向
	// 				if(direction != findDirection(activePiece,otherBlank)){
	// 					console.log("error");
	// 					return false;
	// 				}
	// 			}
	// 			moveByDirection(activePiece.id,direction);
	// 			for (var i = activeBlankPieces.length - 1; i >= 0; i--) {
	// 				for(var j = length;j > 0;j --){
	// 					moveByDirection(activeBlankPieces[i].id,oppositeOfDirection(direction));
	// 				}
	// 			}
	// 			if(pieces["CaoCao"].getAttribute("y") == "3" && pieces["CaoCao"].getAttribute("x") == "1") setTimeout(function(){alert('恭喜通关！');},350);
	// 		}
	// 		function findDirection(start,end){
	// 			var startX=parseInt(start.getAttribute("x"));
	// 			var startY=parseInt(start.getAttribute("y"));
	// 			var colspan=parseInt(start.getAttribute("colspan"));
	// 			var rowspan=parseInt(start.getAttribute("rowspan"));
	// 			var endX=parseInt(end.getAttribute("x"));
	// 			var endY=parseInt(end.getAttribute("y"));
	// 			if(endY >= startY && endY < startY + rowspan){
	// 				if(startX + colspan == endX)return "RIGHT";
	// 				else if(startX - 1 == endX)return "LEFT";
	// 			}
	// 			if(endX >= startX && endX < startX + colspan){
	// 				if(startY + rowspan == endY)return "DOWN";
	// 				else if(startY - 1 == endY)return "UP";
	// 			}
	// 		}
	// 	});
	// }

	for(var key in blankPieces){
		blankPieces[key].addEventListener("click",function(e){
			if(activePiece){
			var direction;
			var activeBlankPieces;
			var temp;
			// 长，宽
			var length;
			var width;

			var colspan=parseInt(activePiece.getAttribute("colspan"));
			var rowspan=parseInt(activePiece.getAttribute("rowspan"));

			var blank = this;
			var otherBlank;
			if(blank == blankPieces[0]){
				otherBlank = blankPieces[1];
			}else{
				otherBlank = blankPieces[0];
			}
			// 判断方向
			direction = findDirection(activePiece,blank);
			switch(direction){
				case "UP":case "DOWN":
					length = rowspan;
					width = colspan;
					break;
				case "LEFT":case "RIGHT":
					length = colspan;
					width = rowspan;
					break;
				default:console.log("error!direction="+direction);return false;
			}
			if(width == 1){
				activeBlankPieces = new Array(this);
			}else{
				activeBlankPieces = new Array(this,otherBlank);
				// 判断第二个空白的方向
				if(direction != findDirection(activePiece,otherBlank)){
					console.log("error");
					return false;
				}
			}
			moveByDirection(activePiece.id,direction);
			for (var i = activeBlankPieces.length - 1; i >= 0; i--) {
				for(var j = length;j > 0;j --){
					moveByDirection(activeBlankPieces[i].id,oppositeOfDirection(direction));
				}
			}
			if(pieces["CaoCao"].getAttribute("y") == "3" && pieces["CaoCao"].getAttribute("x") == "1") setTimeout(function(){alert('恭喜通关！');},350);
			}
			function findDirection(start,end){
				var startX=parseInt(start.getAttribute("x"));
				var startY=parseInt(start.getAttribute("y"));
				var colspan=parseInt(start.getAttribute("colspan"));
				var rowspan=parseInt(start.getAttribute("rowspan"));
				var endX=parseInt(end.getAttribute("x"));
				var endY=parseInt(end.getAttribute("y"));
				if(endY >= startY && endY < startY + rowspan){
					if(startX + colspan == endX)return "RIGHT";
					else if(startX - 1 == endX)return "LEFT";
				}
				if(endX >= startX && endX < startX + colspan){
					if(startY + rowspan == endY)return "DOWN";
					else if(startY - 1 == endY)return "UP";
				}
			}
		});
	}

	function autoMove(){
		if(solution[stepNumber]){
	 		moveByDirection(solution[stepNumber][0],solution[stepNumber][1]);
		 	stepNumber++;
		 	return true;
		}else{
			console.log("error[autoMove()]:solution[stepNumber] = "+solution[stepNumber]+";stepNumber = "+stepNumber);
		 	return false;
		}
	}
	function revokeAutoMove(){
		var direction;
		if(stepNumber>0){
		 	stepNumber--;
			switch(solution[stepNumber][1]){
				case "UP" : direction = "DOWN";break;
				case "DOWN" : direction = "UP";break;
				case "LEFT" : direction = "RIGHT";break;
				case "RIGHT" : direction = "LEFT";break;
			}
	 		moveByDirection(solution[stepNumber][0],direction);
		}
	}
	function addAutoMoveTimer(){
		AutoMoveTimer = window.setInterval(function(){
			if(solution[stepNumber]){
				autoMove();
			}else{
				removeAutoMoveTimer();
			}
		},500);
	}
	function removeAutoMoveTimer(){
		console.log("clearInterval(AutoMoveTimer)!");
		window.clearInterval(AutoMoveTimer); 
	}
	function oppositeOfDirection(direction){
		switch(direction){
			case "UP" : return "DOWN";
			case "DOWN" : return "UP";
			case "LEFT" : return "RIGHT";
			case "RIGHT" : return "LEFT";
			default : return false;
		}
	}
})();
// meta移动端缩放
(function(){
	var oMeta = document.createElement('meta');
	oMeta.name="viewport"
	oMeta.content = 'width=device-width,initial-scale='+document.documentElement.clientWidth/400+',maximum-scale='+document.documentElement.clientWidth/400+', user-scalable=no';
	document.getElementsByTagName('head')[0].appendChild(oMeta);
})();
// 修改手机端click（没有成功T_T）
(function(){
	var buttons = document.getElementsByTagName('button');
	for (var i = buttons.length - 1; i >= 0; i--) {
		buttons[i].addEventListener("tap",function(){
			this.onclick();
			alert(this.innerHTML);
		});
	}
})();







