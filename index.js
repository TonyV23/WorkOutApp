const main = document.querySelector("main");
const basicArray = [
    {pic : 0, minute :1},
    {pic : 1, minute :1},
    {pic : 2, minute :1},
    {pic : 3, minute :1},
    {pic : 4, minute :1},
    {pic : 5, minute :1},
    {pic : 6, minute :1},
    {pic : 7, minute :1},
    {pic : 8, minute :1},
    {pic : 9, minute :1}
];
let exerciseArray = [ ]; // this table contains all type of exercises

// Anonymous function that starts itself -------- get stored exercises array
(() =>{
    if (localStorage.exercises) {
        exerciseArray = JSON.parse(localStorage.exercises);
    }else
        exerciseArray = basicArray;
})();

//this class generates exercises
class Exercise{
    constructor(){
        this.index = 0;
        this.minute = exerciseArray[this.index].minute;
        this.seconds = 0;
    }

    updateContDown(){
        this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;
        setTimeout(() => {
            if (this.minute === 0 && this.seconds === "00"){
                this.index ++;
                this.ring();
                if (this.index < exerciseArray.length) {
                    this.minute = exerciseArray[this.index].minute;
                    this.seconds = 0;
                    this.updateContDown();
                }else
                    return Page.finish();

            }else if(this.seconds === "00"){
                this.minute --;
                this.seconds = 59;
                this.updateContDown();
            }else{
                this.seconds --;
                this.updateContDown();  // recursive 
            }
        }, 10);

        return (main.innerHTML = `
            <div class="exercice-container">
                <p>${this.minute}:${this.seconds}</p> 
                <img src="./img/${exerciseArray[this.index].pic}.png"/>
                <div>${this.index + 1} / ${exerciseArray.length}</div> 
            </div>
        `)
    }

    ring(){
        const audio = new Audio();
        audio.src = "ring.mp3";
        audio.play();
    }
}

// this Object contain all project's functions 
const Utils = {

    contentPage : function(title, content, btn){
        document.querySelector("h1").innerHTML = title;
        main.innerHTML =content;
        document.querySelector(".btn-container").innerHTML = btn;
    },

    handleEventMinutes : function () {
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener("input", (e) => {
                exerciseArray.map((exo) =>{
                    if (exo.pic == e.target.id){
                        exo.minute = parseInt(e.target.value) ; // set a new value from user
                        this.store();
                    }
                })
            })
        });

    },

    handleEventArrow : function(){
        document.querySelectorAll(".arrow").forEach(arrow =>{
            arrow.addEventListener("click", (e)=>{
                // we gonna create a variable position to find the pic's position 
                let position = 0;
                exerciseArray.map((exo) => {
                    if (exo.pic == e.target.dataset.pic && position !==0){
                        // small structure to change the position of pic
                        [exerciseArray[position],exerciseArray[position - 1]] = [exerciseArray[position - 1], exerciseArray[position]];
                        Page.lobby() // to update changes on screen
                        this.store();
                    }else 
                        position ++;
                })
            })
        })
    },

    deleteItem : function(){
        document.querySelectorAll(".deleteBtn").forEach(btn => {
            btn.addEventListener("click", (e)=>{ 
                let newArray = [];
                exerciseArray.map((exo) =>{
                    if (exo.pic != e.target.dataset.pic) {
                        newArray.push(exo);
                    }
                });
                exerciseArray = newArray;   
                Page.lobby();
                this.store();   // to update screen after delete operation
            })
        })
    },

    reboot : function(){
        exerciseArray = basicArray;
        Page.lobby();
        this.store();
    },

    store : function(){
        localStorage.exercises = JSON.stringify(exerciseArray);     // allow to create a local storage of an array and save the state of an array

    }
};

// this Object contain different page (settings, routine, ended)
const Page = {

    // start page
    lobby : function(){
        let mapArray = exerciseArray.map((exo) =>
            `
                <li>
                    <div class="card-header">
                        <input type="number" id=${exo.pic} min ="1" max="10" value=${exo.minute}>
                        <span>min</span>
                    </div>
                    <img src="./img/${exo.pic}.png">
                    <i class="fas fa-arrow-alt-circle-left arrow" data-pic=${exo.pic}></i>
                    <i class="fas fa-times-circle deleteBtn" data-pic=${exo.pic}></i>
                </li>
            `
        ).join("");

        Utils.contentPage(
            "Settings <i id='reboot' class='fas fa-undo'></i>",
            "<ul>"+mapArray+"</ul>",
            "<button id='start'>Get started<i class='far fa-play-circle'></i></button>"
        );

        Utils.handleEventMinutes();   // function that manages for us minutes
        Utils.handleEventArrow();   // function that manages back's button
        Utils.deleteItem(); // function to delete an item of exercise
        reboot.addEventListener("click", () => Utils.reboot());   // function to reset the page
        start.addEventListener("click", () =>this.routine()); //function that handle start button
    },

    // routine page
    routine : function(){
        const exercise = new Exercise();
        Utils.contentPage(
            "Routine",
            exercise.updateContDown(), 
            null
        )    
    },

    // finish page
    finish : function(){
        Utils.contentPage(
            "Congratulations It's Over !",
            "<button id='start'>Restart</button>",
            "<button id='reboot' class='btn-reboot'>Reset<i class='fas fa-times-circle'></i></button>"
        )
        
    }
}
Page.lobby();