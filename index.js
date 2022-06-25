
// let tl2 = gsap.timeline({
//     scrollTrigger: {
//       trigger: "header",
//       start: "0%",
//       end: "100%",
//       scrub: 1
//     }
//   });
//   tl2.fromTo(
//     ".name",
//     { scale: 1 },
//     { scale: .5, top: "0rem", right: "50%", x: "50%", y: "0%" }
//   );

//accordion


//projects
//snake game

(function(){  
    /////////////////////////////////////////////////////////////
    
    // Canvas & Context
    var canvas;
    var ctx;
    
    // Snake
    var snake;
    var snake_dir;
	 var snake_next_dir;
    var snake_speed;
    
    // Food
    var food = {x: 0, y: 0};
    
    // Score
    var score;
    
    // Wall
    var wall;
    
    // HTML Elements
    var screen_snake;
    var screen_menu;
    var screen_setting;
    var screen_gameover;
    var button_newgame_menu;
    var button_newgame_setting;
    var button_newgame_gameover;
    var button_setting_menu;
    var button_setting_gameover;
    var ele_score;
    var speed_setting;
    var wall_setting;
    
    
    /////////////////////////////////////////////////////////////

    var activeDot = function(x, y){
        ctx.fillStyle = "#fafafa";
        ctx.fillRect(x * 10, y * 10, 10, 10);
    }
    
    
    /////////////////////////////////////////////////////////////

    var changeDir = function(key){
        
        if(key == 38 && snake_dir != 2){
            snake_next_dir = 0;
        }else{
        
        if (key == 39 && snake_dir != 3){
            snake_next_dir = 1;
        }else{
        
        if (key == 40 && snake_dir != 0){
            snake_next_dir = 2;
        }else{
            
        if(key == 37 && snake_dir != 1){
            snake_next_dir = 3;
        } } } }
        
    }
    
    /////////////////////////////////////////////////////////////

    var addFood = function(){
        food.x = Math.floor(Math.random() * ((canvas.width / 10) - 1));
        food.y = Math.floor(Math.random() * ((canvas.height / 10) - 1));
        for(var i = 0; i < snake.length; i++){
            if(checkBlock(food.x, food.y, snake[i].x, snake[i].y)){
                addFood();
            }
        }
    }
    
    /////////////////////////////////////////////////////////////

    var checkBlock = function(x, y, _x, _y){
        return (x == _x && y == _y) ? true : false;
    }
    
    /////////////////////////////////////////////////////////////
    
    var altScore = function(score_val){
        ele_score.innerHTML = String(score_val);
    }
    
    /////////////////////////////////////////////////////////////

    var mainLoop = function(){
        
            var _x = snake[0].x;
            var _y = snake[0].y;
			snake_dir = snake_next_dir;

            // 0 - Up, 1 - Right, 2 - Down, 3 - Left
            switch(snake_dir){
                case 0: _y--; break;
                case 1: _x++; break;
                case 2: _y++; break;
                case 3: _x--; break;
            }

            snake.pop();
            snake.unshift({x: _x, y: _y});

        
        // --------------------

        // Wall
        
            if(wall == 1){
            // On
                if (snake[0].x < 0 || snake[0].x == canvas.width / 10 || snake[0].y < 0 || snake[0].y == canvas.height / 10){
                    showScreen(3);
                    return;
                }
            }else{
            // Off
                for(var i = 0, x = snake.length; i < x; i++){
                    if(snake[i].x < 0){
                        snake[i].x = snake[i].x + (canvas.width / 10);
                    }
                    if(snake[i].x == canvas.width / 10){
                        snake[i].x = snake[i].x - (canvas.width / 10);
                    }
                    if(snake[i].y < 0){
                        snake[i].y = snake[i].y + (canvas.height / 10);
                    }
                    if(snake[i].y == canvas.height / 10){
                        snake[i].y = snake[i].y - (canvas.height / 10);
                    }
                }
            }
        
        // --------------------
    
        // Autophagy death
            for(var i = 1; i < snake.length; i++){
                if (snake[0].x == snake[i].x && snake[0].y == snake[i].y){
                    showScreen(3);

                    return;
                }
            }
      
        // --------------------
        
      // Eat Food
            if(checkBlock(snake[0].x, snake[0].y, food.x, food.y)){
                snake[snake.length] = {x: snake[0].x, y: snake[0].y};
                score += 1;
                altScore(score);
                addFood();
                activeDot(food.x, food.y);
            }
        
        // --------------------

            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // --------------------

            for(var i = 0; i < snake.length; i++){
                activeDot(snake[i].x, snake[i].y);
            }
        
        // --------------------

            activeDot(food.x, food.y);
        
		// Debug
		//document.getElementById("debug").innerHTML = snake_dir + " " + snake_next_dir + " " + snake[0].x + " " + snake[0].y;		

            setTimeout(mainLoop, snake_speed);
    }
    
    /////////////////////////////////////////////////////////////

    var newGame = function(){
        
        showScreen(0);
        screen_snake.focus();
      
        snake = [];
        for(var i = 4; i >= 0; i--){
            snake.push({x: i, y: 15});
        }
      
        snake_next_dir = 1;
        
        score = 0;
        altScore(score);
        
        addFood();
        
        canvas.onkeydown = function(evt) {
            evt = evt || window.event;
            changeDir(evt.keyCode);
        }
        mainLoop();
                
    }
    
    /////////////////////////////////////////////////////////////
    
    // Change the snake speed...
    // 150 = slow
    // 100 = normal
    // 50 = fast
    var setSnakeSpeed = function(speed_value){
        snake_speed = speed_value;
    }
    
    /////////////////////////////////////////////////////////////
    var setWall = function(wall_value){
        wall = wall_value;
        if(wall == 0){screen_snake.style.borderColor = "#606060";}
        if(wall == 1){screen_snake.style.borderColor = "#FFFFFF";}
    }
     
    /////////////////////////////////////////////////////////////
    
    // 0 for the game
    // 1 for the main menu
    // 2 for the settings screen
    // 3 for the game over screen
    var showScreen = function(screen_opt){
        switch(screen_opt){
                
            case 0:  screen_snake.style.display = "block";
                     screen_menu.style.display = "none";
                     screen_setting.style.display = "none";
                     screen_gameover.style.display = "none";
                     break;
                
            case 1:  screen_snake.style.display = "none";
                     screen_menu.style.display = "block";
                     screen_setting.style.display = "none";
                     screen_gameover.style.display = "none";
                     break;
                
            case 2:  screen_snake.style.display = "none";
                     screen_menu.style.display = "none";
                     screen_setting.style.display = "block";
                     screen_gameover.style.display = "none";
                     break;
                
            case 3: screen_snake.style.display = "none";
                    screen_menu.style.display = "none";
                    screen_setting.style.display = "none";
                    screen_gameover.style.display = "block";
                    break;
        }
    }
        
    /////////////////////////////////////////////////////////////
        
    window.onload = function(){
        
        canvas = document.getElementById("snake");
        ctx = canvas.getContext("2d");
               
            // Screens
            screen_snake = document.getElementById("snake");
            screen_menu = document.getElementById("menu");
            screen_gameover = document.getElementById("gameover");
            screen_setting = document.getElementById("setting");
        
            // Buttons
            button_newgame_menu = document.getElementById("newgame_menu");
            button_newgame_setting = document.getElementById("newgame_setting");
            button_newgame_gameover = document.getElementById("newgame_gameover");
            button_setting_menu = document.getElementById("setting_menu");
            button_setting_gameover = document.getElementById("setting_gameover");
        
            // etc
            ele_score = document.getElementById("score_value");
            speed_setting = document.getElementsByName("speed");
            wall_setting = document.getElementsByName("wall");
        
        // --------------------

        button_newgame_menu.onclick = function(){newGame();};
        button_newgame_gameover.onclick = function(){newGame();}; 
        button_newgame_setting.onclick = function(){newGame();}; 
        button_setting_menu.onclick = function(){showScreen(2);};
        button_setting_gameover.onclick = function(){showScreen(2)};

        setSnakeSpeed(150);
        setWall(1);

        showScreen("menu");
        
        // --------------------
        // Settings
        
            // speed
            for(var i = 0; i < speed_setting.length; i++){
                speed_setting[i].addEventListener("click", function(){
                    for(var i = 0; i < speed_setting.length; i++){
                        if(speed_setting[i].checked){
                            setSnakeSpeed(speed_setting[i].value);
                        }
                    }
                });
            }
        
            // wall
            for(var i = 0; i < wall_setting.length; i++){
                wall_setting[i].addEventListener("click", function(){
                    for(var i = 0; i < wall_setting.length; i++){
                        if(wall_setting[i].checked){
                            setWall(wall_setting[i].value);
                        }
                    }
                });
            }

        document.onkeydown = function(evt){
            if(screen_gameover.style.display == "block"){
                evt = evt || window.event;
                if(evt.keyCode == 32){
                    newGame();
                }
            }
        }
    }

})();
const projects=[{
    id:"01",
    title:"Mpendulo",
    year:"2022",
    tools:["Vue", "Vuetify", "Firebase","AzureDevOps" ],
    link:"https://mpendulotwodoto.web.app",
    imageOne:"images/mpendulo/one.png",
    imageTwo:"images/mpendulo/two.png",
    imageThree:"images/mpendulo/three.png",
    imageFour:"images/mpendulo/four.png",
    description:"Mpendulo, which means 'answer' in Zulu, is a personal finance app with a chatbot that uses artificial intelliece to help a user manage thier finances better. The chatbot through the app links your bank account to track your spending and manages your budgeting and saving goals. some of the key features include a 'moola box' where the user sets asaving goal and Mpendulo suggest how to reach yourtegt within the desired time frame",
    task:"To build a personal finance app that uses an AI chatbot to monitor spending habits, improve saving and aids reaching financial goals ",
    delivery:"I worked closely with the UX designers to increase the fidelity of the designs and prototype of Mpendulo. "
},
{
    id:"02",
    title:"Maarifa blog",
    year:"2021",
    tools:[" React", "Next.js", "Material UI", "GraphQL", ],
    description:"Designed by women for women, Galvan London was launched in 2014 with the mission to fulfill the need for a new kind of occasionwear – clean, cool, and pared down. Currently, Galvan London has expanded into a full ready-to-wear offer, including resort wear, separates and most recently, power knits – that can be worn throughout all the moments of your day. Galvan London’s pieces are created to make you feel empowered for that important meeting, big birthday, wedding, first date or simply to be a trusted wardrobe hero that you can pull out any time to make you look, and feel, incredible from the inside out.",
},
{
    id:"03",
title:"Formula 1 quizz",
year:"2019",
tools:["HTML, CSS, Javascript"],
link:"https://lhamiltonquiz.netlify.app/",
imageOne:"images/hamilton/one.png",
imageTwo:"images/hamilton/two.png",
imageThree:"images/hamilton/three.png",
imageFour:"images/hamilton/four.png",
description:"After a succesful 2020 F1 season, where Lewis Hamilton tied with Michael Schuavher to become most suvessful F1 driver, this game, in a form of a quizz, takes us through Lewis Hamlton's F1 season. This game will test how well you know Lewis Hamilton, from being am ambitous toddler to arguably, the most succesful F1 driver ever.",
task:"To build a user engaging quiz game in tibute of Lewis Hamilton's 7th championship ",
delivery:"I was responsible for the design and development of this project "
},


]
 const parentContainer = document.querySelector(".projectsWrapper")
window.addEventListener("DOMContentLoaded", function () {
let displayProjects = projects.map(function(project){

return `


<div class="singleProject">
<div class="project-header"><p></p>

    </div>
    <div class="faq"> 
    <a href=javascript:void(); type="button" class="btn btn-primary casestudy-btn" data-toggle="modal" data-target="# ${project.title}" class="case-study trigger ">case study <span class="arrow">→</span></a>
        <button class="accordion js-text2" aria-haspopup="true" aria-expanded="false">
                        <span id="tab-title-dimensions_tab"> C/: ${project.id} &nbsp; &nbsp; ░░░  <h3><span class="project-name">
                        ${project.title}</span> ░░░  ↓ </h3> </span>                
                        <div class="circle-animation closed" >
                        </div>
        </button>

        <div class="panel" style="">
            <div class="tools">
                <ul class="tools-container">
                 ${project.tools}
                </ul>
                <span class="year">${project.year}</span>
            </div>
            
    <p class="port_desc">${project.description}</p>
        </div>
    </div>

</div>
<div>
<div class="modal fade" id=" ${project.title}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
<div class="modal-dialog" role="document">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="exampleModalLabel"> ${project.title}</h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">

<div class="links-wrapper">
<a href="${project.link}" target="_blank" >Visit site</a>
<a href="${project.link}" target="_blank" >Source code</a>

</div>
<br />
<br />
   <div class="task">
   <h6>/ Task:</h6>
  
   <p>${project.task} </p>
   <br />
   <h6> / What I did:</h6>
   <p>${project.delivery} </p>
   <br />
   </div>
   <br />
   <div class="row">
   <div class="swiper mySwiper">
   <div class="swiper-wrapper">
     <div class="swiper-slide" >
<img src="${project.imageOne}" />
    </div>
     <div class="swiper-slide">
     <img src="${project.imageTwo}" /></div>
     <div class="swiper-slide">
     <img src="${project.imageThree}" /></div>
     <div class="swiper-slide">
     <img src="${project.imageFour}" /></div>
    
   </div>
   <div class="swiper-pagination"></div>
 </div>
 </div>

    </div>
   
  </div>
</div>
</div>
</div>

`

});

displayProjects = displayProjects.join("")
parentContainer.innerHTML = displayProjects;
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    console.log(acc[0])
  acc[i].addEventListener("click", function() {
      console.log("I was clicked")
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      panel.classList.remove("open");
      this.setAttribute('aria-expanded',"false")
    } else {
      let active = document.querySelectorAll(".accordion.active");
      for(let j = 0; j < active.length; j++){
        active[j].classList.remove("active");
        active[j].setAttribute('aria-expanded',"false")
        active[j].nextElementSibling.style.maxHeight = null;
        active[j].nextElementSibling.classList.remove("open");
      }
      panel.style.maxHeight = panel.scrollHeight + "px";
      panel.classList.add("open");
      this.setAttribute('aria-expanded',"true")
    }
    this.classList.toggle("active");
    
  });

  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 2.8,

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}
(() => {
    function makeTextHtml(list, pos) {
      const texts = list.map((val, index) => {
        let t = val.substring(pos, 0);
        t += val.substring(pos).replace(/[^ ]/g, "*");
        pos -= val.length;
        return t + (list.length - 1 != index ? "<br>" : "");
      });
  
      return texts.join("");
    }
  
    gsap.utils.toArray(".project-name").forEach((element) => {
      const text = element.innerHTML.replace(/<br\s*\/?>/gi, "\n");
      const list = text.split("\n");
      const len = list.join("").length;
      element.innerHTML = makeTextHtml(list, 0);
  
      ScrollTrigger.create({
        trigger: ".projects",
     scrub:4,
     pin:true,
     start: "top +=200",
     end: "center center",
        once: true,
        onUpdate: (self) => {
          console.log(self)
          const pos = parseInt(len * self.progress);
          element.innerHTML = makeTextHtml(list, pos);
        },
      //   markers: true
      });
      


    });
  })();
});

const skills = [{
    id:01,
    title:"Languages",
    skills:["HTML", "CSS", "Javascript", "Python", "SQL"],
},
{id:02,
    title:"Frameworks",
    skills:["Vue.js", "React.js", "Flask", "Jquery"],

},
{
    id:03,
    title:"Libraries",
    skills:["Greensock (GSAP)", "Vuetifyy", "Material UI", "Bootsrap"],
},
{
id:04,
title:"Tools",
skills:["VS Code", "Azure DevOps", "Github", "REST API"],
},
]

const skillsContainer = document.querySelector(".accordionWrapper");
window.addEventListener("DOMContentLoaded", function(){
    let displaySkills = skills.map(function (skill){
       
    return ` <div class="accordionItem open">
    <h2 class="accordionItemHeading js-text">/: ${skill.title}  ░░░ ↓</h2>
    <div class="accordionItemContent">
      <p>${skill.skills}.</p>
   
    </div>
    </div>`
    });
    displaySkills = displaySkills.join("")
skillsContainer.innerHTML = displaySkills;
var accItem = document.getElementsByClassName('accordionItem');
    var accHD = document.getElementsByClassName('accordionItemHeading');
    for (i = 0; i < accHD.length; i++) {
        accHD[i].addEventListener('click', toggleItem, false);
        console.log("i was clicked")
    }
    function toggleItem() {
        var itemClass = this.parentNode.className;
        for (i = 0; i < accItem.length; i++) {
            accItem[i].className = 'accordionItem close';
        }
        if (itemClass == 'accordionItem close') {
            this.parentNode.className = 'accordionItem open';
        }
    }
})



const caseStudies = [{
id:01,
title:"Mpendulo",
projectDesc:"Mpendulo is personal finance application"
}]
//game
const playBtn = document.querySelector(".snake-btn")
const gameIntro = document.querySelector(".game-intro")
const gameContainer = document.querySelector(".gameWrapper");

playBtn.addEventListener("click", function(){
    gameContainer.style.display = "block";
  gameIntro.style.display="none";

})
//animation


const blinkElements = gsap.utils.toArray(".section-title");
blinkElements.forEach((element, i) => {
ScrollTrigger.create({
    trigger:element,
    toglleClass: "typingElement",
    start:'top 90%',
    end:"top 10%",
})
    })
    gsap.registerPlugin(ScrollTrigger)
const headings = gsap.utils.toArray(".section-title");

headings.forEach((title) => {
    gsap.to(title, {
      scrollTrigger: {
        trigger: title,
        start: "top +=800",
        end: "+=50",
        scrub: true,
        opacity:0,
        toggleClass:  "typingElement",
      }
    })
});
gsap.registerPlugin(ScrollTrigger);

// Type1: Use element.textContent
// (() => {
//   gsap.utils.toArray(".js-text").forEach((element) => {
//     const orgText = element.textContent;
//     const orgTextLen = orgText.length;
//     const replacedText = orgText.replace(/[^ ]/g, "*");
//     element.textContent = replacedText;

//     ScrollTrigger.create({
//       trigger: element,
//       start: "center center+=100",
//       end: "center center-=100",
//       onUpdate: (self) => {
//         const pos = parseInt(orgTextLen * self.progress);
//         const str = orgText.substring(pos, 0) + replacedText.substring(pos);
//         element.textContent = str;
//       },
//     //   markers: true
//     });
    
//   });
// })();


// Type2: Use element.innerHTML
(() => {
  function makeTextHtml(list, pos) {
    const texts = list.map((val, index) => {
      let t = val.substring(pos, 0);
      t += val.substring(pos).replace(/[^ ]/g, "*");
      pos -= val.length;
      return t + (list.length - 1 != index ? "<br>" : "");
    });

    return texts.join("");
  }

  gsap.utils.toArray(".js-text2").forEach((element) => {
    const text = element.innerHTML.replace(/<br\s*\/?>/gi, "\n");
    const list = text.split("\n");
    const len = list.join("").length;
    element.innerHTML = makeTextHtml(list, 0);

    ScrollTrigger.create({
      trigger: element,
   scrub:1,
      start: "center center+=50",
      end: "center center-=50",
      once: true,
      onUpdate: (self) => {
        console.log(self)
        const pos = parseInt(len * self.progress);
        element.innerHTML = makeTextHtml(list, pos);
      },
    //   markers: true
    });
    
  });
})();
//modal
