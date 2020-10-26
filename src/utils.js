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
        let colors = ['red', 'blue', 'green', 'black', 'orange'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    static filterOutliers(dataSet) {
        return dataSet.filter((x) => !this.findOutliers(dataSet).includes(x));
    }

    static findOutliers(dataSet) {
        if (dataSet.length < 4) {
            return [];
        }

        let values, q1, q3, iqr, maxValue, minValue;

        values = dataSet.slice().sort((a, b) => a - b);

        if ((values.length / 4) % 1 === 0) {
            q1 = 1 / 2 * (values[(values.length / 4)] + values[(values.length / 4) + 1]);
            q3 = 1 / 2 * (values[(values.length * (3 / 4))] + values[(values.length * (3 / 4)) + 1]);
        } else {
            q1 = values[Math.floor(values.length / 4 + 1)];
            q3 = values[Math.ceil(values.length * (3 / 4) + 1)];
        }

        iqr = q3 - q1;
        maxValue = q3 + iqr * 1.5;
        minValue = q1 - iqr * 1.5;

        return values.filter((x) => (x > maxValue) || (x < minValue));
    }
}

Utils.CONFIRMED_COLOR = "#ffc658";
Utils.RECOVERED_COLOR = "#82ca9d";
Utils.DECEASED_COLOR = "#1c1c1c";
Utils.ACTIVE_COLOR = "#fca085";
Utils.CLOSED_COLOR = "#8884d8";
Utils.POSITIVITY_COLOR = "#C889A3";
Utils.BRUSH_COLOR = "#919191";
Utils.TESTS_COLOR = "#719df3";

