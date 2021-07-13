import '../scss/main-page.scss'

import 'popper.js';
import 'bootstrap';
import 'jquery';


function Slider(configuration) {
    this.slideIndex = configuration.slideIndex;
    this.sliderWrapper = document.querySelector(configuration.sliderWrapperSelector);
    this.keepGoing = configuration.keepGoing;
    this.slides = document.querySelectorAll(configuration.slidesSelector);
    this.sliderInterval = configuration.sliderIntervalInMiliseconds;
    this.leftControls = document.querySelector(configuration.sliderControlsPrev);
    this.rightControls = document.querySelector(configuration.sliderControlsNext);


    this.sliderWrapper.addEventListener('mouseout', () => {
        this.keepGoing = true;
    });

    this.sliderWrapper.addEventListener('mouseover', () => {
        this.keepGoing = false;
    });

    this.showSlides = function() {
        let n = this.slideIndex;
        let i;
        if (n > this.slides.length) {
            this.slideIndex = 1;
        }
        if (n < 1) {
            this.slideIndex = this.slides.length;
        }
        for (i = 0; i < this.slides.length; i++) {
            this.slides[i].style.display = 'none';
        }
        this.slides[this.slideIndex - 1].style.display = 'block';
    }

    this.turnOn = function() {
        this.showSlides();
        setInterval(() => {
            if (this.keepGoing) {
                this.showSlides(this.slideIndex += 1);
            }
        }, this.sliderInterval)
    };

    this.plusSlide = function() {
        this.showSlides(this.slideIndex += 1);
    }

    this.minusSlide = function() {
        this.showSlides(this.slideIndex -= 1);
    }

    this.currentSlide = function(n) {
        this.showSlides(this.slideIndex = n);
    }

    this.leftControls.addEventListener('click', () => {
        this.minusSlide();
    });
    this.rightControls.addEventListener('click', () => {
        this.plusSlide();
    });

}

function MultiplyItemsSlider(configuration) {
    this.slideCountToChange = configuration.slideCountToChange;
    Slider.apply(this, arguments);
    this.showSlides = function() {
        let n = this.slideIndex;
        if (n >= this.slides.length) {
            this.slideIndex = 0;
        }
        if (n < 0) {
            this.slideIndex = this.slides.length - configuration.slideCountToChange;
        }
        for (let i = 0; i < this.slides.length; i++) {
            this.slides[i].style.display = 'none';
        }
        for (let i = this.slideIndex; i < this.slideIndex + configuration.slideCountToChange; i++) {
            this.slides[i].style.display = 'flex';
        }
    }

    this.turnOn = function() {
        this.showSlides();
        setInterval(() => {
            if (this.keepGoing) {
                this.slideIndex += this.slideCountToChange
                this.showSlides();
            }
        }, this.sliderInterval)
    };

    this.plusSlide = function() {
        this.slideIndex += this.slideCountToChange
        this.showSlides();
    }

    this.minusSlide = function() {
        this.slideIndex -= this.slideCountToChange
        this.showSlides();
    }
}

function SliderWithDots(configuration) {
    Slider.apply(this, arguments);
    this.sliderDots = document.querySelectorAll(configuration.dotsSelector);
    this.showSlides = function() {
        let n = this.slideIndex;
        let i;
        if (n > this.slides.length) {
            this.slideIndex = 1;
        }
        if (n < 1) {
            this.slideIndex = this.slides.length;
        }
        for (i = 0; i < this.slides.length; i++) {
            this.slides[i].style.display = 'none';
        }
        for (i = 0; i < this.sliderDots.length; i++) {
            this.sliderDots[i].className = this.sliderDots[i].className.replace(' slider-dots_active', '');
        }
        this.slides[this.slideIndex - 1].style.display = 'block';
        this.sliderDots[this.slideIndex - 1].className += ' slider-dots_active';
    }
}

const configuration = {
    slideIndex: 1,
    sliderWrapperSelector: '.slider-wrapper',
    keepGoing: true,
    slidesSelector: '.item',
    sliderIntervalInMiliseconds: 3000,
    sliderControlsPrev: '.testimonials__controls_left',
    sliderControlsNext: '.testimonials__controls_right',
    dotsSelector: '.slider-dots_item'
};

const configuration2 = {
    slideIndex: 0,
    sliderWrapperSelector: '.latest-portfolio__slider-wrapper',
    keepGoing: true,
    slidesSelector: '.latest-portfolio__card',
    sliderIntervalInMiliseconds: 2000,
    sliderControlsPrev: '.latest-portfolio__controls_left',
    sliderControlsNext: '.latest-portfolio__controls_right',
    slideCountToChange: 3

};

new SliderWithDots(configuration).turnOn();
new MultiplyItemsSlider(configuration2).turnOn();