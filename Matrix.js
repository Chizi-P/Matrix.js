/**
 * Matrix Class
 * 方便做矩陣計算
 */


Object.prototype.safeDefineProperty = Object.prototype.safeDefineProperty ?? function safeDefineProperty(obj, prop, descriptor) {
    if (obj[prop]) throw `${obj.constructor.name} 的 ${prop} 已存在！`;
    return Object.defineProperty(obj, prop, descriptor);
}

// 淺拷貝 //
Object.safeDefineProperty(Array.prototype, 'shallowCopy', {
    value: function() {
        this.slice();
    }
});
// 深拷貝（無關聯）//
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

// 淺尺寸 // 
Object.safeDefineProperty(Array.prototype, 'lengths', {
    get: function() {
        let lengths = [];
        for (let i = 0; i < this.length; i++) {
            lengths.push(
                Array.isArray(this[i]) 
                ? this[i].length 
                : 1
            );
        }
        return lengths;
    }
});

class StaticMatrix {
    constructor() {}
    static isMatrix(obj) {
        const w = obj[0]?.length;
        return obj.every?.(e => e.length === w) ?? false;
    }
    static isSquare(obj) {
        return Matrix.isMatrix(obj) && obj.length === obj[0].length;
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
    /**
     * Matrix.isArray(.) 判斷是否為一維矩陣，與 Array.isArray(.) 有區別
     * @param {array} array 
     */
    static isArray(array) {
        return array.every(e => !Array.isArray(e));
    }

    // Determinant 行列式 //
    static det(matrix) {
        if (!Matrix.isMatrix(matrix)) {
            throw '此參數無法計算行列式';
        }
        if (!Matrix.isSquare(matrix)) {
            throw '矩陣必須為方陣';
        }
        let pt = 0,
            nt = 0;
        if (matrix.length == 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }
        for (let k = 0, w = matrix[0].length; k < w; k++) {
            let s = 1;
            for (let i = 0, j = k, h = matrix.length; i < h; i++, j++) {
                j = j >= w ? 0 : j;
                s *= matrix[i][j];
            }
            pt += s;
        }
        for (let w = matrix[0].length, k = w - 1; k >= 0; k--) {
            let s = 1;
            for (let i = 0, j = k, h = matrix.length; i < h; i++, j--) {
                j = j < 0 ? w - 1 : j;
                s *= matrix[i][j];
            }
            nt += s;
        }
        return pt - nt;
    }
    // adjugate matrix 伴隨矩陣 // ！未完成
    // https://zh.wikipedia.org/wiki/%E4%BC%B4%E9%9A%8F%E7%9F%A9%E9%98%B5
    static adj(matrix) {
        new Matrix(matrix.size);
        (-1)**(i + j) * m[i][j]
    }
}

class Matrix extends StaticMatrix {
    constructor(height, width, init) {
        super();
        let matrix = [];
        if (Array.isArray(height)) {
            if (Matrix.isMatrix(height)) {
                matrix = height.deepCopy();
                this.height = matrix.length;
                this.width = matrix[0]?.length;
                if (this.width == undefined) {
                    this.width = this.height;
                    this.height = 1;
                }

            } else throw '傳入了非矩陣';

        } else if (Number.isInteger(height + width)) {
            // _不被調用的屬性
            this.height = height;
            this.width = width;
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
    // get height() {
    //     return this._height;
    // }
    // get width() {
    //     return this._width;
    // }
    
    get size() {
        return [this.height, this.width];
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
    multiply(value = 1) {
        return this.__privateBasicOperationsMethod(
            value,
            (e, _, i, j) => e * value[i][j],
            matrix => (e, _, i, j) => e * matrix[i][j],
            flatted => (e, n) => e * flatted[n],
            e => e * value
        );
    }
    divide(value = 1) {
        return this.__privateBasicOperationsMethod(
            value,
            (e, _, i, j) => e / value[i][j],
            matrix => (e, _, i, j) => e / matrix[i][j],
            flatted => (e, n) => e / flatted[n],
            e => e / value
        );
    }
    mod(value = 1) {
        return this.__privateBasicOperationsMethod(
            value,
            (e, _, i, j) => e % value[i][j],
            matrix => (e, _, i, j) => e % matrix[i][j],
            flatted => (e, n) => e % flatted[n],
            e => e % value
        );
    }
    pow(value = 1) {
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
    // 重塑 //
    reshape(height, width) {
        if (this.height * this.width != height * width) {
            throw '此參數值的長寬無法重塑矩陣';
        }
        let matrix = new Matrix(height, width);
        const temp = this.flat();
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                  matrix[i][j] = temp[i + j * height];
            }
        }
        return matrix;
    }
    // 分割 //
    // ！需優化，！無法任意分割
    partition(row, column) {
        let subMatrixs = [[],[],[],[]];
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                subMatrixs[
                    i < column ? j < row ? 0 : 2 : j < row ? 1 : 3
                ].push(this[i][j]);
            }
        }
        subMatrixs[0] = new Matrix(subMatrixs[0]).reshape(row, column);
        subMatrixs[1] = new Matrix(subMatrixs[1]).reshape(row, this.width - column);
        subMatrixs[2] = new Matrix(subMatrixs[2]).reshape(this.height - row, column);
        subMatrixs[3] = new Matrix(subMatrixs[3]).reshape(this.height - row, this.width - column);
        return subMatrixs;
    }
    // 刪除一列 // 原地，返回被刪除元素之 Matrix
    deleteRow(num) {
        return new Matrix(this.splice(num, 1))
    }
    // 刪除一行 // 原地，返回被刪除元素之 Matrix
    deleteColumn(num) {
        let matrix = new Matrix(...this.size);
        for (let i = 0; i < this.height; i++) {
            matrix[i] = this[i].splice(num, 1);
        }
        return matrix;
    }
}
// Matrix 繼承 Array 的方法和迭代器
Matrix.prototype.__proto__ = Array.prototype;

class MatrixSize {
    constructor(height, width) {
        let size = { height, width };
        size.__proto__ = this;
        return Object.seal(size);
    }
}