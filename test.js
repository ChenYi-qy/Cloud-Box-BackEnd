


/* 发送 "类型一" 数据 */
const SerialPort = require("serialport");

function sendData(mode, brightness, speed) {
    const SerialPort = require("serialport");
    let serialPort = new SerialPort( //设置串口属性

        "COM3", {

            baudRate: 9600, //波特率

            dataBits: 8, //数据位

            parity: 'none', //奇偶校验

            stopBits: 2, //停止位

            flowControl: false ,

            autoOpen:false // 自动打开

        }, false);

     // 计算校验码
    let checkCode = parseInt(getCheckCode(0xaa,0x01,mode,brightness,speed),16);

    const data = [0xaa, 0x01, mode, brightness,speed, checkCode];
    console.log(data)

    serialPort.open();

    serialPort.on('open',() => {
        console.log("串口已打开，准备写入数据")
        serialPort.write(data);
    })

    serialPort.on('readable', function () {
        console.log('Data:', serialPort.read())
    })


    serialPort.on('data',(data) => {

        console.log("命令已经发出")
        console.log("回应的数据: " + data)
        serialPort.close();
    })

}

/* 关闭RGB灯控 */
function closeRGB() {
    const SerialPort = require("serialport");
    let serialPort = new SerialPort( //设置串口属性

        "COM3", {

            baudRate: 9600, //波特率

            dataBits: 8, //数据位

            parity: 'none', //奇偶校验

            stopBits: 2, //停止位

            flowControl: false ,

            autoOpen:false // 自动打开

        }, false);

    const data = [0xaa, 0xff, 0x00, 0x00,0x00, 0x55];
    serialPort.open();

    serialPort.on('open',() => {
        console.log("串口已打开，准备写入数据")
        serialPort.write(data);
    })

    serialPort.on('readable', function () {
        console.log('Data:', serialPort.read())
    })


    serialPort.on('data',(data) => {

        console.log("命令已经发出")
        console.log("回应的数据: " + data)
        serialPort.close();
    })
}

/* 设置亮度状态码（Hex）*/
function setBrightness(brightness) {
    return decToHex(parseHex(brightness));
}

/* 设置速度状态码(Hex) */
function setSpeed(speed) {
    return decToHex(parseHex(speed));
}

/* 设置模式状态码 */
function setMode(mode) {
    return decToHex(parseHex(mode));
}

/* 获取校验码 */
function getCheckCode(start,type,mode,brightness,speed,) {
    let result = (start ^ type);

    result ^= mode;
    result ^= brightness;
    result ^= speed;
    return  '0x' + result.toString(16);
}

/* 十六进制字符串 -> 十进制数字 */
function parseHex(str) {
    return parseInt(str,16);
}


/* 十进制数字 -> 十六进制数字 */
function decToHex(params) {
    typeof params == "string" ? params = Number(params) : ''
    return '0x' + params.toString(16);
}


module.exports = {sendData,closeRGB};