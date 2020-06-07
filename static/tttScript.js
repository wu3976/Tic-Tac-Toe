status_arr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
result = 0;

result_count = [0, 0, 0]; // [You win, I win, fair]
/**
 * step 1 : check if there is a winning.
 * @return {number} 0: no win, 1:you win, 2: I win.
 */
const judgeWin = () => {
    if (checkHorizontalCase(1).length === 3
        || checkVerticalCase(1).length === 3
        || checkLeftDiagCase(1).length === 3
        || checkRightDiagCase(1).length === 3){
        return 1;
    }
    if (checkHorizontalCase(2).length === 3
        || checkVerticalCase(2).length === 3
        || checkLeftDiagCase(2).length === 3
        || checkRightDiagCase(2).length === 3){
        return 2;
    }
    if (status_arr.indexOf(0) < 0){ return 3; }
    return 0;
}

/**
 * step 2: check if opponent is going to win.
 * @return {[]} the array of positions which is judged or operated.
 */
const judgeWouldWinAndSave = () => {
    let result_arr = checkLeftDiagCase(1);
    if (result_arr.length === 2){
        checkLackPosAndInsert(result_arr, 0, status_arr.length, 4);
        return result_arr;
    }
    result_arr = checkRightDiagCase(1);
    if (result_arr.length === 2){
        checkLackPosAndInsert(result_arr, 2, 7, 2);
        return result_arr;
    }
    result_arr = checkHorizontalCase(1);
    console.log("Hori arr: " + result_arr);
    if (result_arr.length === 2){
        let start_pos = 3 * Math.floor(result_arr[0] / 3);
        checkLackPosAndInsert(result_arr, start_pos, start_pos + 3, 1);
        return result_arr;
    }
    result_arr = checkVerticalCase(1);
    if (result_arr.length === 2){
        let start_pos = result_arr[0] % 3;
        checkLackPosAndInsert(result_arr, start_pos, status_arr.length, 3);
        return result_arr;
    }
    return result_arr;
}

const checkLackPosAndInsert = (result_arr, start, til, step) => {
    for (let i = start; i < til; i += step){
        if (result_arr.indexOf(i) < 0){
            processAction(2, i);
        }
    }
}

/**
 * Step 3: judge if opponent firstly occupy a corner.
 * @return {boolean} whether processed action or not.
 */
const judgeOppositeCase = () => {
    let temp_count = 0;
    let pos = 0;
    for (let i = 0; i < status_arr.length; i++){
        if (i % 2 === 0 && i !== 4){
            if (status_arr[i] === 1){
                temp_count++;
                pos = i;
            }
        }
    }
    if (temp_count === 1 && status_arr.reduce((a, b) => {
        return a + b;
    }) === 1){
        switch (pos) {
            case 0 : {
                processAction(2, 8);
                return true;
            }
            case 8 : {
                processAction(2, 2);
                return true;
            }
            case 2 : {
                processAction(2, 6);
                return true;
            }
            case 6 : {
                processAction(2, 2);
                return true;
            }
            default: return false;
        }
    } else if (status_arr[4] === 0){ // step 4
        processAction(2, 4);
        return true;
    } else {
        return false;
    }
}

/**
 * Step 5: See if can place to any diagonal.
 */
const judgeDiag = () => {
    for (let i = 0; i < status_arr.length && i !== 4; i += 2){
        if (status_arr[i] === 2){
            let temp_arr = [i + 2, i - 2, i + 3 * 2, i - 3 * 2];
            // navigate through all neighbours
            for (let ele of temp_arr){
                if (ele >= 0 && ele < status_arr.length && status_arr[ele] === 0){
                    processAction(2, ele);
                    return true;
                }
            }
        }
    }
    // if does not exist diag, or diag's neigh is occupied, prioritize any diag.
    for (let i = 1; i < status_arr.length; i += 2){
        if (status_arr[i] === 1){
            let temp_arr;
            if (i % 6 === 1){
                temp_arr = [i + 1, i - 1];
            } else {
                temp_arr = [i + 3, i - 3];
            }
            let rnd = Math.round(Math.random());

            if (status_arr[temp_arr[rnd]] === 0){
                processAction(2, temp_arr[rnd]); return true;
            } else if (status_arr[temp_arr[1 - rnd]] === 0){
                processAction(2, temp_arr[1 - rnd]); return true
            }
        }
    }

    for (let i = 0; i < status_arr.length && i !== 4; i += 2){
        if (status_arr[i] === 0){
            processAction(2, i);
            return true;
        }
    }
    return false;
}


/**
 * check horiz case
 * @param num The number being checked.
 * @return {[]} One of the largest_length hori occupation array
 */
const checkHorizontalCase = (num) => {
    let result_arr = [];
    for (let i = 0; i < status_arr.length; i += 3){
        let temp_arr = [];
        for (let j = i; j < i + 3; j++){
            if (status_arr[j] !== 0 && status_arr[j] !== num){
                temp_arr = [];
                break;
            }
            else if (status_arr[j] === num){
                temp_arr.push(j);
            }
        }
        result_arr = temp_arr.length > result_arr.length ? temp_arr : result_arr;
    }

    return result_arr;
}

/**
 * vert case
 * @param num Number checked
 * @return {[]} One of the largest_length vert occupation array
 */
const checkVerticalCase = (num) => {
    let result_arr = [];
    for (let i = 0; i < status_arr.length / 3; i++){
        let temp_arr = [];
        for (let j = i; j < status_arr.length; j += 3){
            if (status_arr[j] !== 0 && status_arr[j] !== num){
                temp_arr = [];
                break;
            }
            else if (status_arr[j] === num){
                temp_arr.push(j);
            }
        }
        result_arr = temp_arr.length > result_arr.length ? temp_arr : result_arr;
    }
    return result_arr;
}

const checkLeftDiagCase = (num) => {
    let result_arr = [];
    for (let i = 0; i < status_arr.length; i += 4){
        if (status_arr[i] !== 0 && status_arr[i] !== num){
            result_arr = [];
            break;
        }
         else if (status_arr[i] === num){
            result_arr.push(i);
        }
    }
    return result_arr;
}

const checkRightDiagCase = (num) => {
    let result_arr = [];
    for (let i = 2; i < 7; i += 2){
        if (status_arr[i] !== 0 && status_arr[i] !== num){
            result_arr = [];
            break;
        }
        if (status_arr[i] === num){
            result_arr.push(i);
        }
    }
    return result_arr;
}

const next = () => { // check if there is any win at both start and end.
    let winningResult = judgeWin();
    if (winningResult !== 0){
        return winningResult;
    } else {
        let arr = judgeWouldWinAndSave();
        if (arr.length !== 2) { // this means opponent is not going to win
            let temp_res = judgeOppositeCase();
            if (!temp_res) {
                if (!judgeDiag()) {
                    processAction(2, status_arr.indexOf(0));// step 6
                }
            }
        }
    }
    console.log(status_arr);
    return judgeWin();
}


// Listener zone
for (let i = 0; i < status_arr.length; i++){
    document.getElementById("" + i).addEventListener('click', (event) => {
        if (result === 0 && status_arr[i] === 0){
            processAction(1, i);
            result = next();
            if (result !== 0){
                let text;
                if (result === 1){
                    text = "You win!";
                } else if (result === 2){
                    text = "I win!";
                } else {
                    text = "Fair!";
                }
                result_count[result - 1]++;
                document.getElementById("status").innerText = text;
                syncCount();
            }
        }
    });
}

const syncCount = () => {

    let yw = document.getElementById("yw");
    let iw = document.getElementById("iw");
    yw.innerText = result_count[0];
    iw.innerText = result_count[1];
    document.getElementById("f").innerText = result_count[2];

    yw.style.backgroundColor = "white";
    iw.style.backgroundColor = "white";
    if (result_count[0] > result_count[1]){
        yw.style.backgroundColor = "yellow";
    } else if (result_count[0] < result_count[1]){
        iw.style.backgroundColor = "yellow";
    }
}

const reset = () => {
    status_arr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < status_arr.length; i++){
        document.getElementById("" + i).innerHTML = "";
    }
    result = 0;
    document.getElementById("status").innerText = "";
}

const resetAll = () => {
    reset();
    result_count = [0, 0, 0];
}

const processAction = (player, pos) => {
    status_arr[pos] = player;
    if (player === 1){
        document.getElementById("" + pos).innerHTML =
            "<img class='grid-image' src='circle.jpg' alt='circle'>";
    } else {
        document.getElementById("" + pos).innerHTML =
            "<img class='grid-image' src='cross.jpg' alt='cross'>";
    }
}

document.getElementById("new_game").addEventListener('click', (event) => {
    reset();
});

let logoutButton = document.getElementById("logout");

if (document.cookie.indexOf('id') < 0){
    logoutButton.disabled = true;
    logoutButton.style.backgroundColor = "#D3D3D3";
    logoutButton.style.color = "black";
}