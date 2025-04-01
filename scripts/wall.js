window.location.hash = 'main';

window.onbeforeunload = function () {
    window.scrollTo(0,0);
}

window.onload = function reset(){
    document.getElementById("enable").checked = false;
    document.getElementById("locked_grid").checked = false;
    document.getElementById("lock_value").value = 50;
    var x_input = document.getElementsByName("pos-X")
    var y_input = document.getElementsByName("pos-Y")
    x_input[0].value = 0;
    y_input[0].value = 0;
    var rows_input = document.getElementsByName("rows")
    var cols_input = document.getElementsByName("cols")
    rows_input[0].value = 2;
    cols_input[0].value = 2;
    var replace_LI = document.getElementById("replace_LI")
    replace_LI.checked = false
    console.log("done")
}

const el = document.querySelector(".dummy-window");
const el2 = document.querySelector(".main-window");
const el3 = document.querySelector(".locked-window");
const screenbox = document.querySelector(".screen");
var resizers = document.querySelectorAll(".resizer");

var x_input = document.getElementsByName("pos-X")
var y_input = document.getElementsByName("pos-Y")
var width_input = document.getElementsByName("size-width")
var height_input = document.getElementsByName("size-height")
var rows_input = document.getElementsByName("rows")
var cols_input = document.getElementsByName("cols")

var main = [false,0,0,parseInt(window.getComputedStyle(el, null).width,10),parseInt(window.getComputedStyle(el, null).height,10),2,2]
var dummy = [false,0,0,parseInt(window.getComputedStyle(el2, null).width,10),parseInt(window.getComputedStyle(el2, null).height,10),2,2]
var locked = [false,0,0,parseInt(window.getComputedStyle(el3, null).width,10),parseInt(window.getComputedStyle(el3, null).height,10),2,2]
var enable = [false,false,false]
var replace_LI = document.getElementById("replace_LI")

var lock_x = 0;
var lock_y = 0;
var locked_value = document.getElementById("lock_value").value;
var is_locked = document.getElementById("locked_grid").checked;

let currentResizer;
let isResizing = false;
let isResizing2 = false;
let bounding_for_scroll = screenbox.getBoundingClientRect().top;

el.addEventListener('mousedown',mousedown);
el2.addEventListener('mousedown',mousedown);
el3.addEventListener('mousedown',mousedown);
x_input[0].addEventListener("blur", set_x);
y_input[0].addEventListener("blur", set_y);
width_input[0].addEventListener("blur", set_width)
height_input[0].addEventListener("blur", set_height)
rows_input[0].addEventListener("blur", set_rows)
cols_input[0].addEventListener("blur", set_cols)

function set_rows(){
    switch (window.location.hash){
        case '#main': 
            main[5] = rows_input[0].value
            break;
        case '#locked':
            locked[5] = rows_input[0].value
            break;
        case '#dummy':
            dummy[5] = rows_input[0].value
            break;
    }
}

function set_cols(){
    switch (window.location.hash){
        case '#main': 
            main[6] =   cols_input[0].value
            break;
        case '#locked':
            locked[6] = cols_input[0].value
            break;
        case '#dummy':
            dummyn[6] = cols_input[0].value
            break;
    } 
}
function set_x(){
    console.log("executed")
    switch (window.location.hash){
        case '#main': 
            el2.style.left = x_input[0].value + "px";
            main[1] = x_input[0].value
            break;
        case '#locked':
            el3.style.left = x_input[0].value + "px";
            locked[1] = x_input[0].value
            break;
        case '#dummy':
            el.style.left = x_input[0].value + "px";
            dummy[1] = x_input[0].value
            break;
    }
}

function set_y(){
    switch (window.location.hash){
        case '#main': 
            el2.style.top = parseInt(y_input[0].value) + 380.2 + "px";
            console.log(el2.style.top)
            main[2] = y_input[0].value
            break;
        case '#locked':
            el3.style.top = parseInt(y_input[0].value) + 380.2 + "px";
            locked[2] = y_input[0].value
            break;
        case '#dummy':
            el.style.top = parseInt(y_input[0].value) + 380.2 + "px";
            dummy[2] = y_input[0].value
            break;
    }
}

function set_width(){
    switch (window.location.hash){
        case '#main': 
            el2.style.width = width_input[0].value + "px";
            main[3] = width_input[0].value
            break;
        case '#locked':
            el3.style.width = width_input[0].value + "px";
            locked[3] = width_input[0].value
            break;
        case '#dummy':
            el.style.width = width_input[0].value + "px";
            dummy[3] = width_input[0].value
            break;
    }
}

function set_height(){
    switch (window.location.hash){
        case '#main': 
            el2.style.height = height_input[0].value + "px";
            main[4] = height_input[0].value
            break;
        case '#locked':
            el3.style.height = height_input[0].value + "px";
            locked[4] = height_input[0].value
            break;
        case '#dummy':
            el.style.height = height_input[0].value + "px";
            dummy[4] = height_input[0].value
            break;
    }
}

function mousedown(e){
    let target = e.target;
    console.log(e.target);
    console.log(enable);
    window.addEventListener('mousemove',mousemove);
    window.addEventListener('mouseup',mouseup);
    // prev client x and y mouse positions
    let prevX = e.clientX;
    let prevY = e.clientY;

    let current_box_selected;
    if(target.classList.contains("main-window" || "r2esizer") == true){
        current_box_selected = main
    }else if (target.classList.contains("locked-window") == true){
        current_box_selected = locked
    }else if(target.classList.contains("dummy-window" || "resizer") == true){
        current_box_selected = dummy
    }
    x_input[0].value = current_box_selected[1]
    y_input[0].value = current_box_selected[2]
    width_input[0].value = current_box_selected[3]
    height_input[0].value = current_box_selected[4]
    rows_input[0].value = current_box_selected[5]
    cols_input[0].value = current_box_selected[6]

    function mousemove(e){
        if(!isResizing){
            const bounding = screenbox.getBoundingClientRect();
            let newX = prevX - e.clientX;
            let newY = prevY - e.clientY;
            var rect;
            var window_current;
            var current_box;
            var difference_scroll = bounding_for_scroll - bounding.top;
            locked_value = document.getElementById("lock_value").value;
            if(difference_scroll != 0){
                newY = newY - 2*difference_scroll;
            }
            if(target.classList.contains("main-window" || "r2esizer") == true){
                rect = el2.getBoundingClientRect();
                window_current = el2;
                resizers = document.querySelectorAll(".r3esizer")
                current_box = main //to store coords and display for each movable item
            }else if(target.classList.contains("locked-window") == true){
                rect = el3.getBoundingClientRect();
                window_current = el3;
                resizers = document.querySelectorAll(".r2esizer")
                current_box = locked //to store coords and display for each movable item
            }else if(target.classList.contains("dummy-window" || "resizer") == true){
                rect = el.getBoundingClientRect();
                window_current = el;
                resizers = document.querySelectorAll(".resizer")
                current_box = dummy //to store coords and display for each movable item
            }else{
                return
            }

             //move object
            var posX = rect.left - newX
            var posY = rect.top - newY
            lock_x = lock_x - newX
            lock_y = lock_y - newY -2*difference_scroll
            console.log(bounding.top)
            //LOCK Y IS GETTING AN INSANE VALUE BECAUSE OF DIFFERENCE SCROLL
            if(rect.top > bounding.top){
                if((lock_y >= locked_value || lock_y <= -locked_value) && is_locked){
                    console.log("yes")
                    lock_y = lock_y - (lock_y%locked_value)
                    console.log(rect.top + lock_y)
                    y_input[0].value = current_box[2] = Math.floor(rect.top + lock_y + difference_scroll - 380.2);

                    window_current.style.top = rect.top + lock_y + difference_scroll + "px";
                    lock_y = 0 
                }

                if((lock_x >= locked_value || lock_x <= -locked_value) && is_locked){
                    lock_x = lock_x - (lock_x%locked_value)
                    x_input[0].value = current_box[1] = rect.left + lock_x;
                    window_current.style.left = rect.left + lock_x + "px";
                    lock_x = 0
                
                }else if(!is_locked){
                    x_input[0].value = current_box[1] = posX;
                    window_current.style.left = posX + "px";
                    y_input[0].value = current_box[2] = Math.floor(posY - difference_scroll-380.2);
                    window_current.style.top = posY - difference_scroll + "px";
                }
            }
            else{
                y_input[0].value = current_box[2] = Math.floor(bounding.top + 1 + difference_scroll-380.2);
                window_current.style.top = bounding.top + 1 + difference_scroll + "px";
            }
            if((rect.left <= bounding.left)){
                x_input[0].value = current_box[1] = bounding.left + 1
                window_current.style.left = bounding.left + 1 + "px";
            }
            if((rect.right > bounding.right-2)){
                x_input[0].value = current_box[1] = bounding.right-2 - window_current.offsetWidth;
                window_current.style.left = bounding.right-2 - window_current.offsetWidth + "px";
            }
            if((rect.bottom > bounding.bottom-1)){
                y_input[0].value = current_box[2] = (bounding.bottom-1 - window_current.offsetHeight + difference_scroll - 1);
                window_current.style.top = bounding.bottom-1 - window_current.offsetHeight + difference_scroll - 1 + "px";
            }
            prevX = e.clientX;
            prevY = e.clientY;
        }
    }

    function mouseup(){
        lock_x = 0
        window.removeEventListener('mousemove',mousemove);
        window.removeEventListener('mouseup',mouseup);
    }
}



for(let resizer of resizers){
    resizer.addEventListener('mousedown',mousedown);

    function mousedown(e){
        isResizing = true;
        let currentResizer = e.target;
        var window_current2;
        var current_box2;
        if(currentResizer.classList.contains("dummy")){
            window_current2 = el;
            current_box2 = dummy
        }else if(currentResizer.classList.contains("main")){
            window_current2 = el2;
            current_box2 = main
        }else if(currentResizer.classList.contains("locked")){
            window_current2 = el3;
            current_box2 = locked
        }

        let prevX = e.clientX;
        let prevY = e.clientY;

        window.addEventListener('mousemove',mousemove);
        window.addEventListener('mouseup',mouseup);

        function mousemove(e){
            const rect = window_current2.getBoundingClientRect();

            if(currentResizer.classList.contains("se") || currentResizer.classList.contains("s2e") || currentResizer.classList.contains("s3e")){
                width_input[0].value = current_box2[3] = rect.width - (prevX - e.clientX);
                window_current2.style.width = rect.width - (prevX - e.clientX) + "px";
                height_input[0].value = current_box2[4] = rect.height - (prevY - e.clientY);
                window_current2.style.height = rect.height - (prevY - e.clientY) + "px";
            }
            prevX = e.clientX;
            prevY = e.clientY;
        }

        function mouseup(){
            window.removeEventListener('mousemove',mousemove);
            window.removeEventListener('mouseup',mouseup);
            isResizing=false;
        }
    }
}

function enable_window(){
    var cb = document.getElementById("enable")
    var dummyWindow = document.getElementsByClassName("dummy-window")
    var mainWindow = document.getElementsByClassName("main-window")
    var lockedWindow = document.getElementsByClassName("locked-window")
    console.log(window.location.href)
    console.log(window.location.hash)
    if(cb.checked==true){
        if(window.location.href == "0kia.github.io/main.html#dummy"){
            dummyWindow[0].style.display = "block";
            enable[0] = true
        }
        else if(window.location.href == "0kia.github.io/main.html#main"){
            mainWindow[0].style.display = "block";
            enable[1] = true
        }
        else if(window.location.href == "0kia.github.io/main.html#locked"){
            lockedWindow[0].style.display = "block";
            enable[2] = true
        }
    }
    else{
        if(window.location.href == "0kia.github.io/main.html#dummy"){
            dummyWindow[0].style.display = "none";
            enable[0] = false

        }else if(window.location.href == "0kia.github.io/main.html#main"){
            mainWindow[0].style.display = "none";
            enable[1] = false
        }
        else if(window.location.href == "0kia.github.io/main.html#locked"){
            lockedWindow[0].style.display = "none";
            enable[2] = false
        }
    }
}

function enable_lock(){
    is_locked = document.getElementById("locked_grid").checked;
}

function page_dummy(){
    var cb = document.getElementById("enable")
    cb.checked = enable[0];
    window.location.hash = 'dummy';
    console.log(dummy[1])
    x_input[0].value = dummy[1]
    y_input[0].value = dummy[2]
    width_input[0].value = dummy[3]
    height_input[0].value = dummy[4]
    rows_input[0].value = dummy[5]
    cols_input[0].value = dummy[6]
}

function page_main(){
    var cb = document.getElementById("enable")
    cb.checked = enable[1];
    window.location.hash = 'main';
    x_input[0].value = main[1]
    y_input[0].value = main[2]
    width_input[0].value = main[3]
    height_input[0].value = main[4]
    rows_input[0].value = main[5]
    cols_input[0].value = main[6]
    console.log(main[5])
}

function page_locked(){
    var cb = document.getElementById("enable")
    cb.checked = enable[2];
    window.location.hash = 'locked';
    x_input[0].value = locked[1]
    y_input[0].value = locked[2]
    width_input[0].value = locked[3]
    height_input[0].value = locked[4]
    rows_input[0].value = locked[5]
    cols_input[0].value = locked[6]
}

function get_json(){
    custom_layout = {
        "main":
        {
            "rows" : main[5],
            "columns" : main[6],
            "x" : main[1]/1920.0,
            "y" : main[2]/1080.0,
            "width" : main[3]/1920.0,
            "height" : main[4]/1080.0
        },
        "locked":
        {
            "rows" : locked[5],
            "columns" : locked[6],
            "x" : locked[1]/1920.0,
            "y" : locked[2]/1080.0,
            "width" : locked[3]/1920.0,
            "height" : locked[4]/1080.0
        },
        "preparing":
        [{
            "rows" : dummy[5],
            "columns" : dummy[6],
            "x" : dummy[1]/1920.0,
            "y" : dummy[2]/1080.0,
            "width" : dummy[3]/1920.0,
            "height" : dummy[4]/1080.0
        }],
        "replaceLockedInstances": replace_LI.checked
    }

    if(!enable[0]){
        delete custom_layout.preparing
    }
    if(!enable[1]){
        delete custom_layout.main
    }
    if(!enable[2]){
        delete custom_layout.locked
    }

    navigator.clipboard.writeText(JSON.stringify(custom_layout, undefined, 2))
}