/**
 * Matrix Class
 * 方便做矩陣計算
 */


class Matrix {
    constructor(height = 1, width = 1, init) {
        // _不被調用的屬性
        this._height = height;
        this._width = width;
        // 生成矩陣
        let array = new Array(height).fill(null);
        let matrix = init != undefined 
        ? array.map(() => new Array(width).fill(init)) 
        : array.map(() => new Array(width));
        // 繼承 Matrix 的方法;
        matrix.__proto__ = Matrix.prototype;
        // 添加 Matrix 屬性到 matrix 屬性，因為 返回的是 matrix 是原生Array，不帶有 Matrix 的屬性，必須放在 constructor 最後
        const propertyNames = Object.getOwnPropertyNames(this); // 獲取自身屬性
        for (const name of propertyNames) {
            // 如果 Array 存在就不定義該屬性
            Array[name] ?? Object.defineProperty(matrix, name, {
                value: this[name],
                configurable: false,
                writable: true,
            })
        }
        return matrix;
    }
    get content() {
        return [...this];
    }
    get height() {
        return this._height;
    }
    get width() {
        return this._width;
    }
    get column() {
        return 
    }
    /**
     * @param {any} value
     */
    set init(value) {
        for (let i = 0, l1 = this.length; i < l1; i++) {
            for (let j = 0, l2 = this[0].length; j < l2; j++) {
                this[i][j] = value;
            }
        }
    }
}
// Matrix 繼承 Array 的方法和迭代器
Matrix.prototype.__proto__ = Array.prototype;

let A = new Matrix(2, 3, 0);
A.init = 1;


