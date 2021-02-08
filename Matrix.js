/**
 * Matrix Class
 * 方便做矩陣計算
 */


Object.prototype.safeDefineProperty = Object.prototype.safeDefineProperty ?? function safeDefineProperty(obj, prop, descriptor) {
    if (obj[prop]) throw `${obj.constructor.name} 的 ${prop} 已存在！`;
    return Object.defineProperty(obj, prop, descriptor);
}

// 淺拷貝
Object.safeDefineProperty(Array.prototype, 'shallowCopy', {
    value: function() {
        this.slice();
    }
});
// 深拷貝（無關聯）
Object.safeDefineProperty(Array.prototype, 'deepCopy', {
    value: function() {
        return JSON.parse(JSON.stringify(this));
    }
});

Object.safeDefineProperty(Array.prototype, 'totalLength', {
    get: function() {
        return this.flat(Infinity).length
    }
});


class StaticMatrix {
    constructor() {}
    static isMatrix(obj) {
        const w = obj[0]?.length;
        return obj.every?.(e => e.length === w) ?? false;
    }
    static isSquare(obj) {
        return obj.isMatrix() && obj.length === obj[0].length;
    }
    static isSameSize(obj1, obj2) {
        if (obj1 instanceof Matrix && obj2 instanceof Matrix) {
            return obj1.height === obj2.height && obj1.width === obj2.width;
        
        } else throw '參數應為 Matrix 類別';
    }
    static isSameLength(matrixObj, arrayObj) {
        if (matrixObj instanceof Matrix && Array.isArray(arrayObj)) {
            return matrixObj.width * matrixObj.height == arrayObj.length;
            
        } else throw '參數應為 (Matrix 類別, Array 類別)';
    }
}


class Matrix extends StaticMatrix {
    constructor(height = 1, width = 1, init) {
        super();
        let matrix;
        if (Array.isArray(height)) {
            if (Matrix.isMatrix(height)) {
                matrix = height.deepCopy();
                this._height = matrix.length;
                this._width = matrix[0].length;

            } else throw '傳入了非矩陣';

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

    mapAll(callback) {
        let matrix = new Matrix(this.height, this.width);
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                matrix[i][j] = callback(this[i][j], i * this.width + j, i, j);
            }
        }
        return matrix;
    }

    /** 
     * Basic operations
     * 基本運算
     */

    __privateBasicOperationsMethod(value, isSameSizeMatrix, isSameTotalLengthMatrix, isSameTotalLengthArray, other) {
        if (Array.isArray(value)) {
            if (value instanceof Matrix) {
                if (Matrix.isSameSize(this, value)) {
                    return this.mapAll(isSameSizeMatrix);
                } else if (this.height * this.width == value.height * value.width) {
                    let matrix = value.reshape(this.height, this.width);
                    return this.mapAll(isSameTotalLengthMatrix(matrix));
                } else throw '矩陣的總長度不同，無法運算';
            } else if (this.height * this.width == value.totalLength) {
                const flatted = value.flat(Infinity);
                return this.mapAll(isSameTotalLengthArray(flatted));
            } else throw '矩陣的總長度不同，無法運算';
        } else return this.mapAll(other);
    }
    
    plus(value = 0) {
        return this.__privateBasicOperationsMethod(
            value,
            (e, _, i, j) => e + value[i][j],
            matrix => (e, _, i, j) => e + matrix[i][j],
            flatted => (e, n) => e + flatted[n],
            e => e + value
        );
    }
    minus(value = 0) {
        return this.__privateBasicOperationsMethod(
            value,
            (e, _, i, j) => e - value[i][j],
            matrix => (e, _, i, j) => e - matrix[i][j],
            flatted => (e, n) => e - flatted[n],
            e => e - value
        );
    }
    multiply(value) {
        return this.__privateBasicOperationsMethod(
            value,
            (e, _, i, j) => e * value[i][j],
            matrix => (e, _, i, j) => e * matrix[i][j],
            flatted => (e, n) => e * flatted[n],
            e => e * value
        );
    }
    divide(value) {
        return this.__privateBasicOperationsMethod(
            value,
            (e, _, i, j) => e / value[i][j],
            matrix => (e, _, i, j) => e / matrix[i][j],
            flatted => (e, n) => e / flatted[n],
            e => e / value
        );
    }
    mod(value) {
        return this.__privateBasicOperationsMethod(
            value,
            (e, _, i, j) => e % value[i][j],
            matrix => (e, _, i, j) => e % matrix[i][j],
            flatted => (e, n) => e % flatted[n],
            e => e % value
        );
    }
    pow(value) {
        return this.__privateBasicOperationsMethod(
            value,
            (e, _, i, j) => e ** value[i][j],
            matrix => (e, _, i, j) => e ** matrix[i][j],
            flatted => (e, n) => e ** flatted[n],
            e => e ** value
        );
    }

    /**
     * @param {any} value
     */
    init(value) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this[i][j] = value;
            }
        }
        return this;
    }
    reshape(row, column) {
        if (this.height * this.width != row * column) {
            throw '此參數值的長寬無法重塑矩陣';
        }
        let matrix = new Matrix(row, column);
        // const iterator = this.flat().entries();
        const temp = this.flat();
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < column; j++) {
                  matrix[i][j] = temp[i + j * row];
            }
        }
        return matrix;
    }
    
}
// Matrix 繼承 Array 的方法和迭代器
Matrix.prototype.__proto__ = Array.prototype;

