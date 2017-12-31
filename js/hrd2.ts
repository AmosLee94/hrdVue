//类：
// 	Layout布局：	记录：棋子的大小，位置，名字，等信息
// 					函数：1、获取棋子位置；2、改变棋子位置
// 	Game游戏：		记录：布局
// 					函数：1、判断等否移动并移动


class Layout{
    public piecesCoords = new Array();//棋子，十个坐标，代表十个棋子和两个空白的坐标，从0-9，分别是，Zu1-Zu4，ZhangFei，MaChao，HuangZhong，ZhaoYun，GuanYu，CaoCao
    public piecesName = ["Zu1","Zu2","Zu3","Zu4","ZhangFei","MaChao","HuangZhong","ZhaoYun","GuanYu","CaoCao","blank1","blank2"];
    public piecesSize = [[1,1],[1,1],[1,1],[1,1],[1,2],[1,2],[1,2],[1,2],[2,1],[2,2],[1,1],[1,1]];
    constructor(coords:number[][] = [[1,2],[2,2],[1,3],[2,3],[0,0],[0,2],[3,0],[3,2],[1,4],[1,0],[0,4],[3,4]]){
        if(coords.length != 12 ){
            console.log("error![Layout.constructor]");
            return ;
        }
        for(let i = 0;i < 12;i ++){
            this.piecesCoords.push([coords[i][0],coords[i][1]]);
        }
    }
    public moveTo(id:number,x:number,y:number){
        this.piecesCoords[id] = [x,y];
    }
    public moveByDelta(id:number,x:number,y:number){
		this.piecesCoords[id][0] += x;
		this.piecesCoords[id][1] += y;
    }

    public move(pieceId:number,direction:string){
		let moveDistance = {"UP":[0,-1],"DOWN":[0,1],"LEFT":[-1,0],"RIGHT":[1,0]}

		let pieceSize = this.piecesSize[pieceId];
		let pieceWidth = pieceSize[0];
		let pieceHeith = pieceSize[1];

		let moveDistance2 = {"UP":[0,-1],"DOWN":[0,pieceHeith],"LEFT":[-1,0],"RIGHT":[pieceWidth,0]}


		let blankId = (this.piecesCoords[pieceId][0] + moveDistance2[direction][0] == this.piecesCoords[10][0] && this.piecesCoords[pieceId][1] + moveDistance2[direction][1] == this.piecesCoords[10][1])? 10 : 11;

		this.moveByDelta(pieceId,moveDistance[direction][0],moveDistance[direction][1]);
		this.moveByDelta(blankId,- moveDistance[direction][0] * pieceWidth,- moveDistance[direction][1] * pieceHeith);

    }
}
class Game {
	public layout:Layout;
	constructor() {
		this.layout = new Layout([[1,2],[2,2],[1,3],[2,3],[0,0],[0,2],[3,0],[3,2],[1,4],[1,0],[0,4],[3,4]]);
	}

	public checkAttach(pieceId:number,blankId:number) {	//判断空白是否贴着棋子，是的话，返回方向,否则返回false
		let direction:any = false;	

		let pieceSize = this.layout.piecesSize[pieceId];
		let pieceCoords = this.layout.piecesCoords[pieceId];
		let pieceX = pieceCoords[0];
		let pieceY = pieceCoords[1];
		let pieceWidth = pieceSize[0];
		let pieceHeith = pieceSize[1];

		let blankCoords = this.layout.piecesCoords[blankId];
		let blankX = blankCoords[0];
		let blankY = blankCoords[1];

		// console.log(this.layout.piecesName[pieceId]+"("+pieceX+","+pieceY+")"+" to "+this.layout.piecesName[blankId]+"("+blankX+","+blankY+")");
		
		if(blankX >= pieceX && blankX < pieceX + pieceWidth){	//x坐标上看，空白在范围内
			if(pieceY - 1 == blankY)direction = "UP";
			else if(pieceY + pieceHeith == blankY)direction = "DOWN";
		}
		if(blankY >= pieceY && blankY < pieceY + pieceWidth){	//y坐标上看，空白在范围内
			if(pieceX - 1 == blankX)direction = "LEFT";
			else if(pieceX + pieceWidth == blankX)direction = "RIGHT";
		}
		return direction;
	}
	public checkGO(pieceId:number,blankId:number){
		let anotherBlankId = blankId == 10?11:10;

		let pieceSize = this.layout.piecesSize[pieceId];
		let pieceWidth = pieceSize[0];
		let pieceHeith = pieceSize[1];

		let direction = this.checkAttach(pieceId,blankId);
		if(direction == "UP" || direction == "DOWN"){
			if (pieceWidth == 2){
				let anotherDirection = this.checkAttach(pieceId,anotherBlankId);
				if(anotherDirection == direction) return direction;
			}else if (pieceWidth == 1){
				return direction;
			}
		}else if(direction == "RIGHT" || direction == "LEFT"){
			if (pieceHeith == 2){
				let anotherDirection = this.checkAttach(pieceId,anotherBlankId);
				if(anotherDirection == direction) return direction;
			}else if (pieceHeith == 1){
				return direction;
			}
		}
	}
	public moveTo(pieceId:number,blankId:number){
		let direction = this.checkGO(pieceId,blankId);
		if(direction){	//能移动
			this.layout.move(pieceId,direction);
		}else{
			let anotherBlankId = blankId == 10?11:10;
			let anotherDirection = this.checkGO(pieceId,anotherBlankId);
			if(anotherDirection){//另一快空白贴着棋子
				let blankDirection = this.checkGO(anotherBlankId,blankId);
				if(blankDirection){//目标空白贴着空白
					if(anotherDirection == blankDirection){	//两个方向相同
						this.layout.move(pieceId,anotherDirection);
						this.layout.move(pieceId,anotherDirection);
					}else{
						let piecesSize = this.layout.piecesSize[pieceId];
						if(piecesSize[0] == 1 && piecesSize[1] == 1){
							this.layout.move(pieceId,anotherDirection);
							this.layout.move(pieceId,blankDirection);
						}
					}
				}
			}
		}
	}
}
// function main() {
// 	let game = new Game();
// 	game.layout.piecesCoords[0]

// }
// main();



