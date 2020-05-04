export default class Utils {
    static formattedNumber(n) {
        return String(n).replace(/(.)(?=(\d{3})+$)/g, '$1 ')
    }

    static getRandomHexaColorCode() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    static getRandomColor() {
        var colors = ['red', 'blue', 'green', 'black', 'orange'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

Utils.CONFIRMED_COLOR = "#ffc658";
Utils.RECOVERED_COLOR = "#82ca9d";
Utils.DECEASED_COLOR = "#1c1c1c";
Utils.ACTIVE_COLOR = "#fca085";
Utils.CLOSED_COLOR = "#8884d8";

