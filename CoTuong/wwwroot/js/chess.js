var matrix = [];
var app = new Vue({
    el: '#app',
    data: {
        chessNode: [],
        top: 0,
        left: 0

    },
    methods: {
        getChessNode() {
            axios({
                url: '/api/chess/loadChessBoard',
                method: 'GET',
                responseType: 'Json',

            }).then((response) => {
                this.chessNode = response.data.chessNode;
                matrix = response.data.maxtrix;

            });
        },
        dragStart(event) {

            this.top = event.clientY;
            this.left = event.clientX;
        },
        getIndexByTopLef(top, left, matrix) {
            var obj = {};
            for (var i = 0; i < matrix.length; i++) {
                for (var j = 0; j < matrix[i].length; j++) {
                    if (Math.abs(matrix[i][j].top - top) < 20 && Math.abs(matrix[i][j].left - left) < 20) {
                        obj.i = i;
                        obj.j = j;
                        obj.id = matrix[i][j].id;
                        return obj;
                    }
                }
            }
            return null;
        },
        isValidMoveForMa(nodeStart, nodeEnd) {
            const gapI = Math.abs(nodeEnd.i - nodeStart.i);
            const gapJ = Math.abs(nodeEnd.j - nodeStart.j);

            // Kiểm tra nước đi cho quân Mã
            if (!((gapI === 1 && gapJ === 2) || (gapJ === 1 && gapI === 2))) {
                return false; // Nước đi không hợp lệ
            }

            //// Kiểm tra xem có quân cờ nào ở điểm đích không
            //if (matrix[nodeEnd.i][nodeEnd.j].id !== '') {
            //    return false; // Nước đi không hợp lệ nếu có quân cờ ở đích
            //}

            if (gapI === 1 && gapJ === 2) {
                if (nodeEnd.j > nodeStart.j) {
                    if (matrix[nodeStart.i][nodeStart.j + 1].id !== '') {
                        return false; // Nước đi không hợp lệ nếu có quân cờ ở giữa
                    }
                } else if (nodeEnd.j < nodeStart.j) {
                    if (matrix[nodeStart.i][nodeStart.j - 1].id !== '') {
                        return false; // Nước đi không hợp lệ nếu có quân cờ ở giữa
                    }
                }
            }

            // Kiểm tra nước đi dọc ngang
            if (gapI === 2 && gapJ === 1) {
                if (nodeEnd.i > nodeStart.i) {
                    if (matrix[nodeStart.i + 1][nodeStart.j].id !== '') {
                        return false; // Nước đi không hợp lệ nếu có quân cờ ở giữa
                    }
                } else if (nodeEnd.i < nodeStart.i) {
                    if (matrix[nodeStart.i - 1][nodeStart.j].id !== '') {
                        return false; // Nước đi không hợp lệ nếu có quân cờ ở giữa
                    }
                }
            }

            //if (matrix[nodeEnd.i][nodeEnd.j].id !== '') {
            //    return false; // Nước đi không hợp lệ nếu có quân cờ ở đích
            //}


            return true; // Nếu không có trường hợp nào bị loại, nước đi là hợp lệ
        },
        isValidMoveForRook(nodeStart, nodeEnd) {
            const gapI = Math.abs(nodeEnd.i - nodeStart.i);
            const gapJ = Math.abs(nodeEnd.j - nodeStart.j);

            // Kiểm tra nước đi cho quân Xe
            if (gapI > 0 && gapJ === 0) {
                // Nước đi dọc theo hàng ngang (qua nhiều ô ngang)
                let min = Math.min(nodeStart.i, nodeEnd.i);
                let max = Math.max(nodeStart.i, nodeEnd.i);
                for (let i = min + 1; i < max; i++) {
                    if (matrix[i][nodeStart.j].id !== '') {
                        return false; // Nước đi không hợp lệ nếu có quân cờ ở giữa
                    }
                }
            } else if (gapI === 0 && gapJ > 0) {
                // Nước đi dọc theo hàng dọc (qua nhiều ô dọc)
                let min = Math.min(nodeStart.j, nodeEnd.j);
                let max = Math.max(nodeStart.j, nodeEnd.j);
                for (let j = min + 1; j < max; j++) {
                    if (matrix[nodeStart.i][j].id !== '') {
                        return false; // Nước đi không hợp lệ nếu có quân cờ ở giữa
                    }
                }
            } else {
                return false; // Nước đi không hợp lệ nếu không dọc theo hàng ngang hoặc dọc
            }


            return true; // Nếu không có trường hợp nào bị loại, nước đi là hợp lệ
        },
        isValidMoveForKing(nodeStart, nodeEnd) {
            const gapI = Math.abs(nodeEnd.i - nodeStart.i);
            const gapJ = Math.abs(nodeEnd.j - nodeStart.j);

            // Kiểm tra nước đi cho quân tướng
            // Quân tướng chỉ di chuyển một bước theo chiều ngang hoặc dọc
            if (!((gapI === 1 && gapJ === 0) || (gapI === 0 && gapJ === 1))) {
                return false; // Nước đi không hợp lệ nếu không di chuyển một bước theo chiều ngang hoặc dọc
            }

            // Kiểm tra xem nước đi có ra khỏi ô vuông bảo vệ không (điểm đích không nằm trong ô vuông bảo vệ)
            if (nodeEnd.i < 0 || nodeEnd.i > 2 || nodeEnd.j < 3 || nodeEnd.j > 5) {
                if (nodeEnd.i < 7 || nodeEnd.i > 9 || nodeEnd.j < 3 || nodeEnd.j > 5) {
                    return false; // Nước đi không hợp lệ nếu ra khỏi ô vuông bảo vệ
                }

            }



            return true; // Nếu không có trường hợp nào bị loại, nước đi là hợp lệ
        },
        isValidMoveForTuong(nodeStart, nodeEnd) {
            const gapI = Math.abs(nodeEnd.i - nodeStart.i);
            const gapJ = Math.abs(nodeEnd.j - nodeStart.j);

            // Kiểm tra nước đi cho con tượng
            // Con tượng chỉ di chuyển đường chéo theo độ dài 1 bước
            if (gapI !== gapJ || gapI === 0) {
                return false; // Nước đi không hợp lệ nếu không di chuyển đường chéo 1 bước
            }
            if (nodeStart.i == 4 && nodeEnd.i == 6 || nodeStart.i == 5 && nodeEnd.i == 3) {

                return false; // Nước đi không hợp lệ nếu con tượng vượt qua sông


            }


            // Kiểm tra nếu con tượng cố gắng đi qua các ô bị cản bởi quân cờ

            // Dựa vào hướng của nước đi để xác định xem nước đi có qua các ô bị cản hay không
            let i, j;
            if (nodeEnd.i > nodeStart.i && nodeEnd.j > nodeStart.j) {
                // Diagonal move from top-left to bottom-right
                for (i = nodeStart.i + 1, j = nodeStart.j + 1; i < nodeEnd.i; i++, j++) {
                    if (matrix[i][j].id !== '') {
                        return false; // Nước đi không hợp lệ nếu đi qua ô bị cản
                    }
                }
            } else if (nodeEnd.i > nodeStart.i && nodeEnd.j < nodeStart.j) {
                // Diagonal move from top-right to bottom-left
                for (i = nodeStart.i + 1, j = nodeStart.j - 1; i < nodeEnd.i; i++, j--) {
                    if (matrix[i][j].id !== '') {
                        return false; // Nước đi không hợp lệ nếu đi qua ô bị cản
                    }
                }
            } else if (nodeEnd.i < nodeStart.i && nodeEnd.j > nodeStart.j) {
                // Diagonal move from bottom-left to top-right
                for (i = nodeStart.i - 1, j = nodeStart.j + 1; i > nodeEnd.i; i--, j++) {
                    if (matrix[i][j].id !== '') {
                        return false; // Nước đi không hợp lệ nếu đi qua ô bị cản
                    }
                }
            } else if (nodeEnd.i < nodeStart.i && nodeEnd.j < nodeStart.j) {
                // Diagonal move from bottom-right to top-left
                for (i = nodeStart.i - 1, j = nodeStart.j - 1; i > nodeEnd.i; i--, j--) {
                    if (matrix[i][j].id !== '') {
                        return false; // Nước đi không hợp lệ nếu đi qua ô bị cản
                    }
                }
            }

            return true; // Nếu không có trường hợp nào bị loại, nước đi là hợp lệ
        },
        isValidMoveForSi(nodeStart, nodeEnd) {
            const gapI = Math.abs(nodeEnd.i - nodeStart.i);
            const gapJ = Math.abs(nodeEnd.j - nodeStart.j);

            // Kiểm tra nước đi cho con sĩ
            // Con sĩ chỉ di chuyển đường chéo theo độ dài 1 bước
            if (gapI !== 1 || gapJ !== 1) {
                return false; // Nước đi không hợp lệ nếu không di chuyển đường chéo 1 bước
            }

            // Kiểm tra xem con sĩ có di chuyển ra khỏi khu vực cờ tướng không
            // Trong trường hợp màu đỏ, khu vực cờ tướng là hàng 8-10 và cột 4-6
            // Trong trường hợp màu đen, khu vực cờ tướng là hàng 1-3 và cột 4-6
            if (
                (nodeStart.i >= 7 && nodeStart.i <= 9 && nodeStart.j >= 3 && nodeStart.j <= 5) ||
                (nodeStart.i >= 0 && nodeStart.i <= 2 && nodeStart.j >= 3 && nodeStart.j <= 5)
            ) {
                // Kiểm tra xem nước đi đến vị trí đích có nằm trong khu vực cờ tướng không
                // Nếu không nằm trong khu vực cờ tướng, thì nước đi không hợp lệ
                if (
                    (nodeEnd.i >= 7 && nodeEnd.i <= 9 && nodeEnd.j >= 3 && nodeEnd.j <= 5) ||
                    (nodeEnd.i >= 0 && nodeEnd.i <= 2 && nodeEnd.j >= 3 && nodeEnd.j <= 5)
                ) {
                    return true;
                }
            }

            return false; // Nếu không thoả mãn bất kỳ điều kiện nào, nước đi là không hợp lệ
        },
        isValidMoveForPhao(nodeStart, nodeEnd) {
            const gapI = Math.abs(nodeEnd.i - nodeStart.i);
            const gapJ = Math.abs(nodeEnd.j - nodeStart.j);

            let countHorizontal = 0;
            let countVertical = 0;

            // Kiểm tra nước đi cho con pháo
            // Con pháo di chuyển theo hàng ngang hoặc dọc, nhưng không thể nhảy qua quân cờ
            if (gapI === 0) { // Di chuyển theo hàng ngang
                let min = Math.min(nodeStart.j, nodeEnd.j);
                let max = Math.max(nodeStart.j, nodeEnd.j);
                for (let j = min + 1; j < max; j++) {
                    if (matrix[nodeStart.i][j].id !== '') {
                        countHorizontal++;
                    }
                }
            } else if (gapJ === 0) { // Di chuyển theo hàng dọc
                let min = Math.min(nodeStart.i, nodeEnd.i);
                let max = Math.max(nodeStart.i, nodeEnd.i);
                for (let i = min + 1; i < max; i++) {
                    if (matrix[i][nodeStart.j].id !== '') {
                        countVertical++;
                    }
                }
            }

            if (countHorizontal === 0 || countVertical === 0) {
                if (matrix[nodeEnd.i][nodeEnd.j].id === '') {
                    return true; // Nước đi không hợp lệ nếu có quân cờ ở đích
                }
            }

            // Kiểm tra điều kiện mới cho phép pháo ăn quân địch khi có 1 quân cờ nằm giữa
            if ((countHorizontal === 1 || countVertical === 1) && matrix[nodeEnd.i][nodeEnd.j].id !== '' && matrix[nodeEnd.i][nodeEnd.j].id.charAt(0) !== nodeStart.id.charAt(0)) {
                return true;
            }

            return false; // Nếu không thoả mãn bất kỳ điều kiện nào, nước đi là không hợp lệ
        },
        isValidMoveForChot(nodeStart, nodeEnd, id) {
            const gapI = nodeEnd.i - nodeStart.i;
            const gapJ = Math.abs(nodeEnd.j - nodeStart.j);

            if (id.indexOf('do') >= 0) { // Con chốt đỏ
                if (gapI === 1 && gapJ === 0) {
                    if (nodeStart.i < 5 && nodeEnd.i <= 5) { // Đi thẳng 1 bước về phía trước khi chưa qua sông
                        return true;
                    } else if (nodeStart.i >= 5 && nodeEnd.i >= 5) { // Đi thẳng 1 bước về phía trước sau khi đã qua sông
                        return true;
                    }
                } else if (gapI === 0 && gapJ === 1) {
                    if (nodeEnd.i >= 5) { // Đi ngang 1 bước từ vị trí đã qua sông
                        return true;
                    }
                }
            } else if (id.indexOf('den') >= 0) { // Con chốt đen
                if (gapI === -1 && gapJ === 0) {
                    if (nodeStart.i >= 5 && nodeEnd.i >= 4) { // Đi thẳng 1 bước về phía trước khi chưa qua sông
                        return true;
                    } else if (nodeStart.i < 5 && nodeEnd.i < 5) { // Đi thẳng 1 bước về phía trước sau khi đã qua sông
                        return true;
                    }
                } else if (gapI === 0 && gapJ === 1) {
                    if (nodeEnd.i < 5) { // Đi ngang 1 bước từ vị trí đã qua sông
                        return true;
                    }
                }
            }

            return false; // Nếu không thoả mãn bất kỳ điều kiện nào, nước đi là không hợp lệ cho con chốt
        },
        dragEnd(event) {
            var id = event.currentTarget.id;
            var moveX = event.clientX - this.left;
            var moveY = event.clientY - this.top;
            moveX = moveX + event.currentTarget.offsetLeft;
            moveY = moveY + event.currentTarget.offsetTop;

            var nodeStart = this.getIndexByTopLef(event.currentTarget.offsetTop, event.currentTarget.offsetLeft, matrix);
            var nodeEnd = this.getIndexByTopLef(moveY, moveX, matrix);

            if (nodeEnd == null) {
                return;
            }

            var objRemove = null;

            if (id.indexOf('ma') >= 0) {
                if (!this.isValidMoveForMa(nodeStart, nodeEnd)) {
                    return;
                }
                if (nodeStart.id.indexOf('do') > 0) {
                    if (nodeEnd.id != "" && nodeEnd.id.indexOf('do') > 0) {
                        return false;
                    } else {
                        if (nodeEnd.id != "")//quan den
                        {
                            objRemove = { id: nodeEnd.id };
                        }
                    }
                } else {
                    if (nodeEnd.id != "" && nodeEnd.id.indexOf('den') > 0) {
                        return false;
                    } else {
                        if (nodeEnd.id != "")//quan do
                        {
                            objRemove = { id: nodeEnd.id };
                        }
                    }
                }
            } else if (id.indexOf('xe') >= 0) {
                if (!this.isValidMoveForRook(nodeStart, nodeEnd)) {
                    return;
                }
                if (nodeStart.id.indexOf('do') > 0) {
                    if (nodeEnd.id != "" && nodeEnd.id.indexOf('do') > 0) {
                        return false;
                    } else {
                        if (nodeEnd.id != "")//quan den
                        {
                            objRemove = { id: nodeEnd.id };
                        }
                    }
                } else {
                    if (nodeEnd.id != "" && nodeEnd.id.indexOf('den') > 0) {
                        return false;
                    } else {
                        if (nodeEnd.id != "")//quan do
                        {
                            objRemove = { id: nodeEnd.id };
                        }
                    }
                }
            } else if (id.indexOf('chutuong') >= 0) {
                if (!this.isValidMoveForKing(nodeStart, nodeEnd)) {
                    return;
                }
                if (nodeStart.id.indexOf('do') > 0) {
                    if (nodeEnd.id != "" && nodeEnd.id.indexOf('do') > 0) {
                        return false;
                    } else {
                        if (nodeEnd.id != "")//quan den
                        {
                            objRemove = { id: nodeEnd.id };
                        }
                    }
                } else {
                    if (nodeEnd.id != "" && nodeEnd.id.indexOf('den') > 0) {
                        return false;
                    } else {
                        if (nodeEnd.id != "")//quan do
                        {
                            objRemove = { id: nodeEnd.id };
                        }
                    }
                }
            } else if (id.indexOf('tuong') >= 0) {
                if (!this.isValidMoveForTuong(nodeStart, nodeEnd)) {
                    return;
                }
                if (nodeStart.id.indexOf('do') > 0) {
                    if (nodeEnd.id != "" && nodeEnd.id.indexOf('do') > 0) {
                        return false;
                    } else {
                        if (nodeEnd.id != "")//quan den
                        {
                            objRemove = { id: nodeEnd.id };
                        }
                    }
                } else {
                    if (nodeEnd.id != "" && nodeEnd.id.indexOf('den') > 0) {
                        return false;
                    } else {
                        if (nodeEnd.id != "")//quan do
                        {
                            objRemove = { id: nodeEnd.id };
                        }
                    }
                }
            } else if (id.indexOf('si') >= 0) {
                if (!this.isValidMoveForSi(nodeStart, nodeEnd)) {
                    return;
                }
                if (nodeStart.id.indexOf('do') > 0) {
                    if (nodeEnd.id != "" && nodeEnd.id.indexOf('do') > 0) {
                        return false;
                    } else {
                        if (nodeEnd.id != "")//quan den
                        {
                            objRemove = { id: nodeEnd.id };
                        }
                    }
                } else {
                    if (nodeEnd.id != "" && nodeEnd.id.indexOf('den') > 0) {
                        return false;
                    } else {
                        if (nodeEnd.id != "")//quan do
                        {
                            objRemove = { id: nodeEnd.id };
                        }
                    }
                }
            } else if (id.indexOf('phao') >= 0) {
                if (!this.isValidMoveForPhao(nodeStart, nodeEnd)) {
                    return;
                }

                var count = 0; // Đếm số quân cờ nằm giữa nodeStart và nodeEnd
                if (nodeStart.i === nodeEnd.i) { // Di chuyển theo hàng ngang
                    let min = Math.min(nodeStart.j, nodeEnd.j);
                    let max = Math.max(nodeStart.j, nodeEnd.j);
                    for (let j = min + 1; j < max; j++) {
                        if (matrix[nodeStart.i][j].id !== '') {
                            count++;
                        }
                    }
                } else if (nodeStart.j === nodeEnd.j) { // Di chuyển theo hàng dọc
                    let min = Math.min(nodeStart.i, nodeEnd.i);
                    let max = Math.max(nodeStart.i, nodeEnd.i);
                    for (let i = min + 1; i < max; i++) {
                        if (matrix[i][nodeStart.j].id !== '') {
                            count++;
                        }
                    }
                }



                // Pháo chỉ ăn quân địch khi cách 1 quân cờ
                if (count === 1) {
                    if (nodeStart.id.indexOf('do') > 0) {
                        if (nodeEnd.id != "" && nodeEnd.id.indexOf('do') > 0) {
                            return false;
                        } else {
                            if (nodeEnd.id != "")//quan den
                            {
                                objRemove = { id: nodeEnd.id };
                            }
                        }
                    } else {
                        if (nodeEnd.id != "" && nodeEnd.id.indexOf('den') > 0) {
                            return false;
                        } else {
                            if (nodeEnd.id != "")//quan do
                            {
                                objRemove = { id: nodeEnd.id };
                            }
                        }
                    }
                }

            } else if (id.indexOf('chot') >= 0) {
                if (!this.isValidMoveForChot(nodeStart, nodeEnd, id)) {
                    return;
                }
                if (nodeStart.id.indexOf('do') > 0) {
                    if (nodeEnd.id != "" && nodeEnd.id.indexOf('do') > 0) {
                        return false;
                    } else {
                        if (nodeEnd.id != "")//quan den
                        {
                            objRemove = { id: nodeEnd.id };
                        }
                    }
                } else {
                    if (nodeEnd.id != "" && nodeEnd.id.indexOf('den') > 0) {
                        return false;
                    } else {
                        if (nodeEnd.id != "")//quan do
                        {
                            objRemove = { id: nodeEnd.id };
                        }
                    }
                }
            }


            var para = [{ id: id, fromi: nodeStart.i, fromj: nodeStart.j, toi: nodeEnd.i, toj: nodeEnd.j }];

            if (objRemove != null) {
                para.push(objRemove);
            }

            axios({
                url: '/api/chess/move-check-node',
                method: 'POST',
                responseType: 'Json',
                data: para
            }).then((response) => {
            });
        }
    },
    mounted: function () {
        this.getChessNode();

        //ReceiveChessMove
        var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
        connection.on("ReceiveChessMove", function (message) {
            console.log(message);
            var response = JSON.parse(message);
            matrix[response[0].fromi][response[0].fromj].id = "";
            var nodeEnd = matrix[response[0].toi][response[0].toj];
            nodeEnd.id = response[0].id;


            var obj = document.getElementById(response[0].id);
            obj.style.top = nodeEnd.top + 'px';
            obj.style.left = nodeEnd.left + 'px';

            if (response.length > 1) {
                var temp = document.getElementById(response[1].id);
                temp.style.display = "none";
            }
        });
        connection.start().then(function () {

        }).catch(function (err) {
            return console.error(err.toString());
        });
    }
});