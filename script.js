document.addEventListener('DOMContentLoaded', ()=>{
    let active = 0;
    const storyDuration = 6000;
    const contentUpdateDelay = 0.4;
    let direction = "next";
    let storyTimeout;

    const cursor = document.querySelector("#cursor");
    const cursorText = document.querySelector("p");

    // TODO: test
    // setTimeout(() => {
    //     changeStory()
    // },3000)
    
    function gsapDefaultSet(element) {
        gsap.to(element, {
            y: 0,
            duration:0.5,
            delay: contentUpdateDelay
        })       
    }
    
    function changeStory() {
        const prev = active;
        if (direction === "next") {
            active = (active+1) % stories.length;
        } else {
            active = (active-1+stories.length) % stories.length;
        }
        
        const story = stories[active]

        gsap.to(".profile-name p", {
            y: direction === "next" ? -24 : 24,
            duration:0.5,
            delay: contentUpdateDelay
        })
        gsap.to(".title-row h1", {
            y: direction === "next" ? -48 : 48,
            duration:0.5,
            delay: contentUpdateDelay
        })

        const currentImgContainer = document.querySelector(".story-img .img")
        const currentImg = document.querySelector("img")

        setTimeout(() => { 
            const newProfileName = document.createElement("p");
            newProfileName.innerText = story.profileName;
            newProfileName.style.transform = 
                direction === "next" ? "translateY(24px)" : "translateY(-24px)"
            
            const profileNameDiv = document.querySelector(".profile-name");
            profileNameDiv.appendChild(newProfileName);
            gsapDefaultSet(newProfileName)

            const titleRows = document.querySelectorAll('.title-row')
            story.title.forEach((v,i) => {
                if (titleRows[i]) {
                    const newTitle = document.createElement("h1")
                    newTitle.innerText = v;
                    newTitle.style.transform = 
                        direction === "next" ? "translateY(48px)" : "translateY(-48px)"
                    titleRows[i].appendChild(newTitle);
                    gsapDefaultSet(newTitle)
                }
            })

            const newImgContainer = document.createElement("div")
            newImgContainer.classList.add('img');
            const newStoryImg = document.createElement("img");
            newStoryImg.src = story.storyImg;
            newImgContainer.appendChild(newStoryImg)

            const storyImgDiv = document.querySelector('.story-img');
            storyImgDiv.appendChild(newImgContainer)
            const upcomingImg = newStoryImg;

            animateImageScale(currentImg, upcomingImg);
            resetIndexHighlight(prev);
            animateIndexHighlight(active);

            clearUpElements();
            clearTimeout(storyTimeout);
            storyTimeout = setTimeout(changeStory, storyDuration);
        }, 500)
    }

    function animateImageScale(currentImg, upcomingImg) {
        gsap.fromTo(
            upcomingImg,
            {   
                x: direction === "next" ? "100%" : "-100%",
                // scale: 2,
                rotate: direction === "next" ? 10 : -10,
            },
            {
                x: 0,
                // scale: 1,
                rotate: 0,
                duration: 1,
                ease: "power4.inOut",
                onComplete: () => {
                    currentImg.parentElement.remove();
                }
            }
        )
    }

    function resetIndexHighlight(i) {
        const highlight = document.querySelectorAll(".index .index-highlight")[i];
        gsap.killTweensOf(highlight)
        gsap.to(highlight, {
            width: direction === "next" ? "100%" : "0%",
            duration: 0.3,
            onStart: () => {
                gsap.to(highlight, {
                    transformOrigin: "right center",
                    scaleX: 0,
                    duration: 0.3,
                })
            }
        })
    }

    function animateIndexHighlight(i) {
        const highlight = document.querySelectorAll(".index .index-highlight")[i];
        gsap.set(highlight, {
            width: "0%",
            scaleX: 1,
            transformOrigin: "right center",
        })
        gsap.to(highlight, {
            width: "100%",
            duration: storyDuration / 1000,
            ease: "none",
        })        
    }

    function clearUpElements() {
        const profileNameDiv = document.querySelector(".profile-name");
        const titleRows = document.querySelectorAll(".title-row");

        while (profileNameDiv.childElementCount > 2) {
            profileNameDiv.removeChild(profileNameDiv.firstChild);
        }

        titleRows.forEach((row) => {
            while (row.childElementCount > 2) {
                row.removeChild(row.firstChild);
            }
        })
    }

    document.addEventListener("mousemove", (e) => {
        const {x,y} = e;
        gsap.to(cursor, {
            x: x - cursor.offsetWidth / 2,
            y: y - cursor.offsetHeight / 2,
            ease: "power2.out",
            duration: 0.3
        })
    
        const viewportWidth = window.innerWidth;
        if (x < viewportWidth/2) {
            cursorText.textContent = "Prev";
            direction = "prev"
        } else {
            cursorText.textContent = "Next";
            direction = "next"
        }
    })

// export issue
const stories = [
    {
        profileImg: "public/img1.jpg",
        profileName: "Marmot",
        title: [
            "live", "happy life", "marmot"
        ],
        linkLabel: "Read More",
        storyImg: "public/img1.jpg",
    },
    {
        profileImg: "public/img2.jpg",
        profileName: "Marmot",
        title: [
            "live", "happy life", "marmot"
        ],
        linkLabel: "Read More",
        storyImg: "public/img2.jpg",
    },
    {
        profileImg: "public/img3.jpg",
        profileName: "Marmot",
        title: [
            "live", "happy life", "marmot"
        ],
        linkLabel: "Read More",
        storyImg: "public/img3.jpg",
    },
    {
        profileImg: "public/img4.jpg",
        profileName: "Marmot",
        title: [
            "live", "happy life", "marmot"
        ],
        linkLabel: "Read More",
        storyImg: "public/img4.jpg",
    }
]

document.addEventListener("click", (e) => {
    clearTimeout(storyTimeout)
    resetIndexHighlight(active)
    changeStory();
})

storyTimeout = setTimeout(changeStory, storyDuration);
animateIndexHighlight(active)
})
