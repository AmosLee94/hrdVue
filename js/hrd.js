//类：
// 	Layout布局：	记录：棋子的大小，位置，名字，等信息
// 					函数：1、获取棋子位置；2、改变棋子位置
// 	Game游戏：		记录：布局
// 					函数：1、判断等否移动并移动
var Layout = /** @class */ (function () {
    function Layout(coords) {
        if (coords === void 0) { coords = [[1, 2], [2, 2], [1, 3], [2, 3], [0, 0], [0, 2], [3, 0], [3, 2], [1, 4], [1, 0], [0, 4], [3, 4]]; }
        this.piecesCoords = new Array(); //棋子，十个坐标，代表十个棋子和两个空白的坐标，从0-9，分别是，Zu1-Zu4，ZhangFei，MaChao，HuangZhong，ZhaoYun，GuanYu，CaoCao
        this.piecesName = ["Zu1", "Zu2", "Zu3", "Zu4", "ZhangFei", "MaChao", "HuangZhong", "ZhaoYun", "GuanYu", "CaoCao", "blank1", "blank2"];
        this.piecesSize = [[1, 1], [1, 1], [1, 1], [1, 1], [1, 2], [1, 2], [1, 2], [1, 2], [2, 1], [2, 2], [1, 1], [1, 1]];
        if (coords.length != 12) {
            console.log("error![Layout.constructor]");
            return;
        }
        for (var i = 0; i < 12; i++) {
            this.piecesCoords.push([coords[i][0], coords[i][1]]);
        }
    }
    Layout.prototype.moveTo = function (id, x, y) {
        this.piecesCoords[id] = [x, y];
    };
    Layout.prototype.moveByDelta = function (id, x, y) {
        this.piecesCoords[id][0] += x;
        this.piecesCoords[id][1] += y;
    };
    Layout.prototype.move = function (pieceId, direction) {
        var moveDistance = { "UP": [0, -1], "DOWN": [0, 1], "LEFT": [-1, 0], "RIGHT": [1, 0] };
        var pieceSize = this.piecesSize[pieceId];
        var pieceWidth = pieceSize[0];
        var pieceHeith = pieceSize[1];
        var moveDistance2 = { "UP": [0, -1], "DOWN": [0, pieceHeith], "LEFT": [-1, 0], "RIGHT": [pieceWidth, 0] };
        var blankId = (this.piecesCoords[pieceId][0] + moveDistance2[direction][0] == this.piecesCoords[10][0] && this.piecesCoords[pieceId][1] + moveDistance2[direction][1] == this.piecesCoords[10][1]) ? 10 : 11;
        this.moveByDelta(pieceId, moveDistance[direction][0], moveDistance[direction][1]);
        this.moveByDelta(blankId, -moveDistance[direction][0] * pieceWidth, -moveDistance[direction][1] * pieceHeith);
    };
    return Layout;
}());
var Game = /** @class */ (function () {
    function Game() {
        this.layout = new Layout([[1, 2], [2, 2], [1, 3], [2, 3], [0, 0], [0, 2], [3, 0], [3, 2], [1, 4], [1, 0], [0, 4], [3, 4]]);
    }
    Game.prototype.checkAttach = function (pieceId, blankId) {
        var direction = false;
        var pieceSize = this.layout.piecesSize[pieceId];
        var pieceCoords = this.layout.piecesCoords[pieceId];
        var pieceX = pieceCoords[0];
        var pieceY = pieceCoords[1];
        var pieceWidth = pieceSize[0];
        var pieceHeith = pieceSize[1];
        var blankCoords = this.layout.piecesCoords[blankId];
        var blankX = blankCoords[0];
        var blankY = blankCoords[1];
        // console.log(this.layout.piecesName[pieceId]+"("+pieceX+","+pieceY+")"+" to "+this.layout.piecesName[blankId]+"("+blankX+","+blankY+")");
        if (blankX >= pieceX && blankX < pieceX + pieceWidth) {
            if (pieceY - 1 == blankY)
                direction = "UP";
            else if (pieceY + pieceHeith == blankY)
                direction = "DOWN";
        }
        if (blankY >= pieceY && blankY < pieceY + pieceWidth) {
            if (pieceX - 1 == blankX)
                direction = "LEFT";
            else if (pieceX + pieceWidth == blankX)
                direction = "RIGHT";
        }
        return direction;
    };
    Game.prototype.checkGO = function (pieceId, blankId) {
        var anotherBlankId = blankId == 10 ? 11 : 10;
        var pieceSize = this.layout.piecesSize[pieceId];
        var pieceWidth = pieceSize[0];
        var pieceHeith = pieceSize[1];
        var direction = this.checkAttach(pieceId, blankId);
        if (direction == "UP" || direction == "DOWN") {
            if (pieceWidth == 2) {
                var anotherDirection = this.checkAttach(pieceId, anotherBlankId);
                if (anotherDirection == direction)
                    return direction;
            }
            else if (pieceWidth == 1) {
                return direction;
            }
        }
        else if (direction == "RIGHT" || direction == "LEFT") {
            if (pieceHeith == 2) {
                var anotherDirection = this.checkAttach(pieceId, anotherBlankId);
                if (anotherDirection == direction)
                    return direction;
            }
            else if (pieceHeith == 1) {
                return direction;
            }
        }
    };
    Game.prototype.moveTo = function (pieceId, blankId) {
        var direction = this.checkGO(pieceId, blankId);
        if (direction) {
            this.layout.move(pieceId, direction);
        }
        else {
            var anotherBlankId = blankId == 10 ? 11 : 10;
            var anotherDirection = this.checkGO(pieceId, anotherBlankId);
            if (anotherDirection) {
                var blankDirection = this.checkGO(anotherBlankId, blankId);
                if (blankDirection) {
                    if (anotherDirection == blankDirection) {
                        this.layout.move(pieceId, anotherDirection);
                        this.layout.move(pieceId, anotherDirection);
                    }
                    else {
                        var piecesSize = this.layout.piecesSize[pieceId];
                        if (piecesSize[0] == 1 && piecesSize[1] == 1) {
                            this.layout.move(pieceId, anotherDirection);
                            this.layout.move(pieceId, blankDirection);
                        }
                    }
                }
            }
        }
    };
    return Game;
}());
// function main() {
// 	let game = new Game();
// 	game.layout.piecesCoords[0]
// }
// main();
//# sourceMappingURL=hrd2.js.map