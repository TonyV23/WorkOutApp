const main = document.querySelector("main");
let exerciseArray = [
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
]; // this table contains all type of exercises

//this class generates exercises
class Exercise{

}

// this Object contain all project's functions 
const Utils = {

}

// this Object contain different page (settings, routine, ended)
const Page = {
    lobby : function(){
        document.querySelector("h1").innerHTML = 
        "Settings <i id='reboot' class='fas fa-undo'></i>"
        main.innerHTML = "Exercises";
        document.querySelector(".btn-container").innerHTML = 
        "<button id='start'>Get started<i class='far fa-play-circle'></i></button>"
    }
}
Page.lobby();