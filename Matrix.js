/**
 * Matrix Class
 * 方便做矩陣計算
 */


Object.prototype.safeDefineProperty = Object.prototype.safeDefineProperty ?? function(obj, prop, descriptor) {
    if (obj[prop]) throw `${obj.constructor.name} 的 ${prop} 已存在！`;
    return Object.defineProperty(obj, prop, descriptor);
}

// 無關聯複製
Array.prototype.copy = function() {
    return JSON.parse(JSON.stringify(this));
}


class StaticMatrix {
    constructor() {}
    static isMatrix(obj) {
        const w = obj[0]?.length;
        return obj.every?.(e => e.length === w) ?? false;
    }
    static isSquareMatrix(obj) {
        return obj.isMatrix() && obj.length === obj[0].length;
    }
}

class Matrix extends StaticMatrix {
    constructor(height = 1, width = 1, init) {
        super();
        let matrix;
        if (Array.isArray(height)) {
            if (Matrix.isMatrix(height)) {
                matrix = height;
                this._height = matrix.length;
                this._width = matrix[0].length;
            }

            else throw '傳入了非矩陣';

        } else if (Number.isInteger(height + width)) {
            // _不被調用的屬性
            this._height = height;
            this._width = width;
            // 生成矩陣
            let array = new Array(height).fill(null);
            matrix = init != undefined 
            ? array.map(() => new Array(width).fill(init)) 
            : array.map(() => new Array(width));

        } else throw '傳入參數數據類型錯誤';
        // 繼承 Matrix 的方法;
        matrix.__proto__ = Matrix.prototype;
        // 添加 Matrix 屬性到 matrix 屬性，因為 返回的是 matrix 是原生Array，不帶有 Matrix 的屬性，必須放在 constructor 最後
        const propertyNames = Object.getOwnPropertyNames(this); // 獲取自身屬性
        for (const name of propertyNames) {
            // 如果 Array 存在就不定義該屬性
            Array[name] ?? Object.defineProperty(matrix, name, {
                value: this[name],
                configurable: false,
                writable: false
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
    toString() {
        P.shared.toSave(this);
    }
}
// Matrix 繼承 Array 的方法和迭代器
Matrix.prototype.__proto__ = Array.prototype;

