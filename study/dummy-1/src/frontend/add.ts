import 

function layout() {
    let c: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement
    let width: number = document.body.clientWidth;
    c.width = width - 24
    c.height = width - 24
}

function generatorQRCode(c: HTMLCanvasElement) {
}


async function main() {
    layout()

}

main()