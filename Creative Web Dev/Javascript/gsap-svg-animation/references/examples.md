# GSAP & SVG Animation Examples

## Complete Cookie Modal Implementation

### 1. HTML Markup (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cookie Popup</title>
  <link rel="stylesheet" href="./style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="cookie-container">
    <svg class="cookie" width="98" height="98" viewBox="0 0 98 98" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="cookie">
        <path d="M49 0C21.9 0 0 21.9 0 49C0 76.1 21.9 98 49 98C76.1 98 98 76.1 98 49C98 47.7 97.9 46.4 97.8 45.1C93.4 46.3 88.7 44.8 85.9 41.2C82.7 37.1 83.4 31.2 87.5 28C88.6 27.1 89.9 26.5 91.3 26.2C88.5 21.5 84.4 17.8 79.5 15.6C78.9 19.8 75.8 23.3 71.6 24.3C66.8 25.5 61.9 22.5 60.7 17.7C59.9 14.5 61.1 11.2 63.4 9.1C59 6.8 54.1 5.3 49 5.3V0Z" fill="#E8B074"/>
        <circle cx="28" cy="35" r="5" fill="#6B4423"/>
        <circle cx="45" cy="65" r="6" fill="#6B4423"/>
        <circle cx="68" cy="48" r="4" fill="#6B4423"/>
      </g>
      <g id="crumbs">
        <circle cx="92" cy="18" r="3" fill="#E8B074"/>
        <circle cx="85" cy="10" r="2" fill="#E8B074"/>
      </g>
    </svg>

    <div class="text">
      <h2 class="cookie-title">Cookie Policy</h2>
      <p class="cookie-subtitle">We use analytical cookies (yum) to make your experience on this website better.</p>
      <button type="button">Okay, got it</button>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="./app.js"></script>
</body>
</html>
```

### 2. CSS Styling (`style.css`)

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.cookie-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 25rem;
  padding: 1rem;
  border-radius: 1.2rem;
  background: linear-gradient(260deg, #9b6c50 0%, #4f2626 100%);
  color: white;
}

.cookie {
  transform: scale(0.6);
  padding-right: 1rem;
  overflow: visible;
}

.text {
  width: 70%;
}

.cookie-title {
  font-size: 1rem;
  font-weight: lighter;
}

.cookie-subtitle {
  font-size: 0.6rem;
  font-weight: bold;
  padding: 0.5rem 0;
}

button {
  border-style: none;
  padding: 0.5rem 1rem;
  background: white;
  color: #4f2626;
  font-family: 'Poppins', sans-serif;
  font-size: 0.6rem;
  font-weight: bold;
  border-radius: 0.3rem;
  cursor: pointer;
}
```

### 3. JavaScript Animation Logic (`app.js`)

```javascript
// 1. Initialize timeline with shared defaults
const tl = gsap.timeline({
  defaults: { duration: 0.75, ease: "power1.out" }
});

// 2. Entrance sequence with synchronized choreography
tl.fromTo('.cookie-container', 
  { scale: 0 }, 
  { scale: 1, ease: "elastic.out(1, 0.4)", duration: 1.5 }
)
.fromTo('.cookie', 
  { opacity: 0, x: -50, rotation: '-45deg' }, 
  { opacity: 1, x: 0, rotation: '0deg' }, 
  '<50%'
)
.fromTo('.text', 
  { x: 30, opacity: 0 }, 
  { x: 0, opacity: 1 }, 
  '<'
);

// 3. Persistent idle floating & yoyo oscillation
tl.fromTo('.cookie', 
  { y: 0, rotation: '0deg' }, 
  { y: -20, rotation: '-20deg', yoyo: true, repeat: -1 }
)
.fromTo('#crumbs', 
  { y: 0 }, 
  { y: -20, yoyo: true, repeat: -1 }, 
  '<'
);

// 4. Interactive modal dismissal
const button = document.querySelector('button');
button.addEventListener('click', () => {
  gsap.to('.cookie-container', {
    opacity: 0,
    y: 100,
    duration: 0.75,
    ease: 'power1.out'
  });
});
```
