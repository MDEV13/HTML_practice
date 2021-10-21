function canvas(selector, options){
    const canvas = document.querySelector(selector);
    canvas.classList.add('canvas')
    canvas.setAttribute('width', `${options.width || 400}px`)
    canvas.setAttribute('height', `${options.height || 300}px`)
 
 
    // отримання контексту для малювання
    const context = canvas.getContext('2d')
   // отримуємо координати canvas відносно viewport
    const rect = canvas.getBoundingClientRect();
 
   // ...
   let isPaint = false // чи активно малювання
    let points = [] //масив з точками

        // об’являємо функцію додавання точок в масив
    const addPoint = (x, y, dragging,color,size) => {
    // преобразуємо координати події кліка миші відносно canvas
    points.push({
        x: (x - rect.left),
        y: (y - rect.top),
        dragging: dragging,
        color: color,
        size: size
    })
    }

        // головна функція для малювання
    const redraw = () => {
    //очищуємо  canvas
    // context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    // context.strokeStyle = options.strokeColor;
    context.lineJoin = "round";
    // context.lineWidth = options.strokeWidth;
    let prevPoint = null;
    for (let point of points){
        context.beginPath();
        context.strokeStyle=point.color
        context.lineWidth=point.size
        if (point.dragging && prevPoint){
            context.moveTo(prevPoint.x, prevPoint.y)
        } else {
            context.moveTo(point.x - 1, point.y);
        }
        context.lineTo(point.x, point.y)
        context.closePath()
        context.stroke();
        prevPoint = point;
    }
    }

        // функції обробники подій миші
    const mouseDown = event => {
    isPaint = true
    addPoint(event.pageX, event.pageY,false,BrushcolorBtn.value,BrushsizeBtn.value);
    redraw();
    }

    const mouseMove = event => {
    if(isPaint){
        addPoint(event.pageX, event.pageY, true,BrushcolorBtn.value,BrushsizeBtn.value);
        redraw();
    }
    }

    // додаємо обробку подій
    canvas.addEventListener('mousemove', mouseMove)
    canvas.addEventListener('mousedown', mouseDown)
    canvas.addEventListener('mouseup',() => {
    isPaint = false;
    });
    canvas.addEventListener('mouseleave',() => {
    isPaint = false;
    });

    // TOOLBAR
    const toolBar = document.getElementById('toolbar')
    // clear button
    const clearBtn = document.createElement('button')
    clearBtn.classList.add('btn')
    clearBtn.textContent = 'Clear'

    clearBtn.addEventListener('click', () => {
    // тут необхідно додати код очистки canvas та масиву точок (clearRect)
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        while(points.length!=0)
        {
            points.pop()
        }
    })
    toolBar.insertAdjacentElement('afterbegin', clearBtn)

    const DownloadBtn = document.createElement('button')
    DownloadBtn.classList.add('btn')
    DownloadBtn.textContent = 'Download'
    

    DownloadBtn.addEventListener('click', () => {
        const dataUrl = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        const newTab = window.open('about:blank','image from canvas');
        newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");
    })
    toolBar.insertAdjacentElement('afterbegin', DownloadBtn)

    const SaveBtn = document.createElement('button')
    SaveBtn.classList.add('btn')
    SaveBtn.textContent = 'Save'
    SaveBtn.addEventListener('click', () => 
    {
        localStorage.setItem('points', JSON.stringify(points));
    })
    toolBar.insertAdjacentElement('afterbegin', SaveBtn)

    const RestoreBtn = document.createElement('button')
    RestoreBtn.classList.add('btn')
    RestoreBtn.textContent = 'Restore'
    // Timestamp
    RestoreBtn.addEventListener('click', () => 
    {
        points = JSON.parse(localStorage.getItem('points'));
        redraw();
    })
    toolBar.insertAdjacentElement('afterbegin', RestoreBtn)

    let prevDate = null;
    let background = "#eee";
    const TimestampBtn = document.createElement('button')
    TimestampBtn.classList.add('btn')
    TimestampBtn.textContent = 'Timestamp'
    TimestampBtn.addEventListener('click', () => 
    {
        console.log(context)
        context.fillStyle = background;
        context.textAlign = "center";
        context.fillText(prevDate, 250, 290);
        // let time = new Date();
        context.fillStyle = "black";
        context.textAlign = "center";
        prevDate = new Date().toString()
        context.fillText(prevDate, 250, 290);
    })
    toolBar.insertAdjacentElement('afterbegin', TimestampBtn)

    const BrushcolorBtn = document.getElementById("color-picker")
    BrushcolorBtn.classList.add('btn')
    BrushcolorBtn.addEventListener('input', () => 
    {
        points.color=BrushcolorBtn.value
    })
    toolBar.insertAdjacentElement('afterbegin', BrushcolorBtn)
    // BrushSize

    const BrushsizeBtn = document.getElementById("size-picker")
    BrushsizeBtn.classList.add('btn')
    BrushsizeBtn.addEventListener('input', () => 
    {
        points.size=BrushsizeBtn.value
    })
    toolBar.insertAdjacentElement('afterbegin', BrushsizeBtn)



    const BackgroundBtn = document.createElement('button')
    BackgroundBtn.classList.add('btn')
    BackgroundBtn.textContent = 'Background'
    BackgroundBtn.addEventListener('click', () => 
    {
        const img = new Image;
        img.src =`https://www.fillmurray.com/200/300`;
        img.onload = () => {
        context.drawImage(img, 0, 0);
        }
    })
    toolBar.insertAdjacentElement('afterbegin',  BackgroundBtn)
 }
 