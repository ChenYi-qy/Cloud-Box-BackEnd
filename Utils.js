/* 发送 "类型一" 数据 */
function sendTypeOneData(mode, brightness, speed) {
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
    let checkCode = parseInt(getTypeOneCheckCode(0xaa,0x01,mode,brightness,speed),16);
    // 速度
    speed = 0xff - speed;
    const data = [0xaa, 0x01, mode, brightness,speed, checkCode];
    console.log(data)

    serialPort.open();

    serialPort.on('open',() => {
        console.log("串口已打开，准备写入数据")
        serialPort.write(data);
    })

    serialPort.on('readable', function () {
        console.log('回应的数据: ', serialPort.read())
    })


    serialPort.on('data',(data) => {

        console.log("命令已经发出")
        serialPort.close();
    })

}

/* 发送 “类型二” 数据 */
function sendTypeTwoData(colorNum, mode, positions) {
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
    let checkCode = parseInt(getTypeTwoCheckCode(0xaa,0x02,colorNum,mode,positions),16);

    let data = [];
    data[0] = 0xaa;
    data[1] = 0x02;
    data[2] = colorNum;
    data[3] = mode;
    for (let pos of positions) {
        data.push(pos);
    }
    data.push(checkCode);

    console.log("类型二数据:  " + data)

    serialPort.open();

    serialPort.on('open',() => {

        console.log("串口已打开，准备写入数据")
        serialPort.write(data);
    })

    serialPort.on('readable', function () {
        console.log('回应的数据: ', serialPort.read())
    })


    serialPort.on('data',() => {

        console.log("命令已经发出")
        serialPort.close();
    })

}

/* 发送 “类型三” 数据 */

function sendTypeThreeData(pos, green, red,blue) {
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
    let checkCode = parseInt(getTypeThreeCheckCode(0xaa,0x03,pos,green,red,blue),16);

    const data = [0xaa, 0x03, pos, green,red, blue,checkCode];
    console.log("类型三数据  " + data)

    serialPort.open();

    serialPort.on('open',() => {
        console.log("串口已打开，准备写入数据")
        serialPort.write(data);
    })

    serialPort.on('readable', function () {
        console.log('回应的数据: ', serialPort.read())
    })


    serialPort.on('data',(data) => {

        console.log("命令已经发出")
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
        serialPort.close();
    })
}


//
/* 获取 “类型一指令” 校验码 */
function getTypeOneCheckCode(start,type,mode,brightness,speed,) {
    let result = (start ^ type);

    result ^= mode;
    result ^= brightness;
    result ^= speed;
    return  '0x' + result.toString(16);
}

/* 获取 “类型二指令” 校验码 */
function getTypeTwoCheckCode(start,type,colorNum,mode,positions) {
    let result = (start ^ type);
    result ^= colorNum;
    result ^= mode;

    for (let i = 0; i < positions.length; i++) {
        result ^= positions[i];
    }

    return  '0x' + result.toString(16);
}

/* 获取 “类型三指令” 校验码 */
function getTypeThreeCheckCode(start,type,pos,green,red,blue) {
    let result = (start ^ type);

    result ^= pos;
    result ^= green;
    result ^= red;
    result ^= blue;
    return  '0x' + result.toString(16);

}




// sendTypeThreeData(0x0f,0x00,0x00,0xff); // 0x0f为蓝色
// sendTypeThreeData(0x0e,0x26,0x5e,0x12); // 0x0e为乌贼莫棕色色


// let positions = [0x00,0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0D,0x0E,0x0F];
// sendTypeTwoData(0x10,0x00,positions);
sendTypeOneData(0x00,0xff,0xff);


module.exports = {sendTypeOneData,closeRGB};