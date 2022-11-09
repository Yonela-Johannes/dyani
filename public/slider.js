const slider = document.querySelector('.slider')
const images = document.querySelectorAll(".slider-image")

const len = images.length
let slideNum  = 1
const nextSlide = () => {
        slider.style.transform = `translateX(-${slideNum * 280}px)`
        slideNum++
}

const prevSlide = () => {
    slider.style.transform = `translateX(-${(slideNum - 2) * 280}px)`
    slideNum--
}
const firstSlide = () => {
        slider.style.transform = `translateX(0px)`
        slideNum = 1
}

const lastSlide = () => {
    slider.style.transform = `translateX(-${(len - 1) * 280}px)`
    slideNum = len
}

setInterval(() => {
    slideNum < len ? nextSlide() : firstSlide()
    console.log('dispatch ====>>>>>>>>')
}, 3000);