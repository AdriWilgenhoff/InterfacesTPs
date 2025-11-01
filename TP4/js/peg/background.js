class Background{
    constructor (canvas){
        this.canvas(canvas);
        this.ctx = canvas.getContext('2d');

    }

    start(ctx){
        ctx.fillStyle = '#000000'; 
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}