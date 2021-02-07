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
    value: () => this.slice()
});
// 深拷貝（無關聯）
Object.safeDefineProperty(Array.prototype, 'deepCopy', {
    value: () => JSON.parse(JSON.stringify(this))
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

    /** 
     * Basic operations
     * 基本運算
     */
    
    forAll(currentValue, indexI, indexJ, ) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                matrix[i][j] = this[i][j] + value[i]?.[j] ?? value;
            }
        }
    }

    plus(value = 0) {
        if (value instanceof Matrix) {
            if (!Matrix.isSameSize(this, value)) {
                throw '矩陣不同大小，無法相加';
            }
        }
        let matrix = new Matrix(this.height, this.width);
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                matrix[i][j] = this[i][j] + value[i]?.[j] ?? value;
            }
        }
        return matrix;
    }
    minus(value = 0) {
        
    }
    multiply() {

    }
    divide() {

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

function executionTime(func) {
    const t0 = new Date().getTime();
    func();
    const t1 = new Date().getTime();
    console.log(`執行了 ${t1 - t0} 毫秒`);
    return t1 - t0;
}


let A = new Matrix(2, 3, 1);
let B = new Matrix(2, 3, 0);
console.log(A);
executionTime(() => {
    console.log(A.plus(B.init(3)))
})
console.log(A)
