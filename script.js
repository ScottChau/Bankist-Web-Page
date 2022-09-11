"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//////////////////////////
// Button scrolling
btnScrollTo.addEventListener("click", function (e) {
  // this means the distance between top of the page to section 1
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  // e.target means btnScrollTo
  console.log(e.target.getBoundingClientRect());
  // this means how many the scroll moved
  console.log("Current scroll (X/Y)", window.pageXOffset, pageYOffset);
  // dimension of the viewport
  console.log(
    "height/width viewport",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  // calculate x and y from HTML body
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: "smooth",
  });

  // modern way to scroll
  section1.scrollIntoView({ behavior: "smooth" });
});

////////////////////////////////////////////////
// Page navigation

// smooth scrolling
// document.querySelectorAll(".nav__link").forEach((el) =>
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   })
// );
// Event delagation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector(".nav__links").addEventListener("click", function (e) {
  console.log(e.target);

  e.preventDefault();
  // Matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

////////////////////////////////////////////////
//  Tab component

// Method that affect the performance
// tabs.forEach((tab) => {
//   tab.addEventListener("click", () => console.log("HI"));
// });

tabsContainer.addEventListener("click", function (e) {
  e.preventDefault();
  const clicked = e.target.closest(".operations__tab");

  // Guard clause
  if (!clicked) return;

  // Remove class "active"
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // Activate tab
  clicked.classList.add("operations__tab--active");

  // Activate content area

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});
////////////////////////////////////////////////
// Menu fade animation

const handleHover = function (e) {
  // console.log(this, e.currentTarget);
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    // make all the links transprant other than e.target
    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = this;
      }
      logo.style.opacity = this;
    });
  }
};

// mouseenter and mouseleave does not bubble up
// addEventListener expect a function not value (call function will become value)
// nav.addEventListener("mouseover", function (e) {
//   handleHover(e, 0.5);
// });

// nav.addEventListener("mouseout", function (e) {
//   handleHover(e, 1);
// });

// bind method - return a new function
// Passing "argument" into handler
// Can also pass in the object or array
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

////////////////////////////////////////////////
// Sticky navigation: Intersection Observer API
/*
const obsCallback = function (entries, observer) {
  entries.forEach((entry) => {
    console.log(entry);
  });
};

const obsOptions = {
  root: null, // viewport
  // 0 means callback will trigger each time that the target element moves completly out of the view
  // and also it moves in the view
  threshold: [0, 0.2],
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
// callback function will be called when target element (section1) is 20% visible on our viewport (intersecting element)
observer.observe(section1);
*/
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headObserver = new IntersectionObserver(stickyNav, {
  root: null,
  // when header is 0 visible in viewport, something happen
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headObserver.observe(header);

////////////////////////////////////////////

// Reveal sections
const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  // console.log(observer);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add("section--hidden");
});

////////////////////////////////////////////////

// Lazy loading images
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

////////////////////////////////////////////////

// Slider

const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const slider = document.querySelector(".slider");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide ="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      // remove all of the active class before assign
      .forEach((dot) => dot.classList.remove("dots__dot--active"));
    // assign active to the dot
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  function goToSlide(slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  }

  function nextSlide() {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  }

  function prevSlide() {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  }

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);

  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();
/*
////////////////////////////////////////////////
// Sticky navigation
const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords.top);

window.addEventListener("scroll", function () {
  console.log(window.scrollY);
  if (window.scrollY > initialCoords.top) {
    nav.classList.add("sticky");
  } else nav.classList.remove("sticky");
});
*/

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

/*
// Selecting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector(".header");
const allSelections = document.querySelectorAll(".section");
console.log(allSelections);

// # is not required
document.getElementById("section--1");

// Html collections means if something deletes in javascript, it returns immediately
const allButtons = document.getElementsByTagName("button");
console.log(allButtons);

console.log(document.getElementsByClassName("btn"));

// Creating and inserting elements

// console.log(.insertAdjacentHTML());

const message = document.createElement("div");
message.classList.add("cookie-message");
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close--cookie">Got it!</button>';

// it can only exist in one place at a time
// header.prepend(message);
// header.append(message);

// create copy
// header.append(message.cloneNode(true));

// header.before(message);
header.after(message);

// Delete elements
document
  .querySelector(".btn--close--cookie")
  .addEventListener("click", function () {
    message.remove();
    // old way to delete
    // message.parentElement.removeChild(message);
  });

// Styles

message.style.backgroundColor = "#37383d";
message.style.width = "120%";

// only able to read inline style
console.log(message.style.color);
console.log(message.style.backgroundColor);

//
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

const height = (message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px");

console.log(height);

// change property in CSS variable

document.documentElement.style.setProperty("--color-primary", "orangered");

// Attributes
const logo = document.querySelector(".nav__logo");
// only works for standard property
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

// non standard attribute
console.log(logo.designer);
console.log(logo.getAttribute("designer"));

// change attribute
logo.alt = "Beautiful minimalist logo";

// create new attribute
logo.setAttribute("company", "Bankist");

// absolute path
console.log(logo.src);

// relative path
console.log(logo.getAttribute("src"));

// Data attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add("c");
logo.classList.remove("c");
logo.classList.toggle("c");
logo.classList.contains("c");

// Don't use, override existing class and it only allows one class
logo.className = "Scott";
*/

/*

*/

/*
// eventListener
const h1 = document.querySelector("h1");

const alertH1 = function (e) {
  alert("addEventListener: Great! You are reading the heading :D");

  h1.removeEventListener("mouseenter", alertH1);
};

// mouseenter = hover
h1.addEventListener("mouseenter", alertH1);

// set timeout and remove the eventListener
// setTimeout(() => h1.removeEventListener("mouseenter", alertH1), 3000);

// another way to set the event listener , old way
// h1.onmouseenter = function (e) {
//   alert("onmouseenter: Great! You are reading the heading :D");
// };
*/

/*
// Bubbling (Propogation)

// rgb(255,255,255)

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector(".nav__link").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();

  // Stop bubbling up (propogation)
  // e.stopPropagation();
});

document.querySelector(".nav__links").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
});

document.querySelector(".nav").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
});

*/

/*
const h1 = document.querySelector("h1");

// Going downwards: child
// find children no matter how deep it is
console.log(h1.querySelectorAll(".highlight"));
console.log(h1.children);
h1.firstElementChild.style.color = "white";
h1.lastElementChild.style.color = "red";

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest(".header").style.background = "var(--gradient-secondary)";

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

// select all siblings
console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = "scale(0.5";
});

*/
