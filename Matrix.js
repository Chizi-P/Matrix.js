/**
 * Create by chizi
 * 
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

class MatrixError {
    static isInstanceofMatrix(...objs) {
        if (!objs.every(obj => obj instanceof Matrix)) throw '參數應為 Matrix 類別';
    }
    static isSquare(...objs) {
        if (!objs.every(obj => Matrix.isSquare(obj))) throw '矩陣必須為方陣';
    }
}

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
        MatrixError.isInstanceofMatrix(obj1, obj2);
        return obj1.height === obj2.height && obj1.width === obj2.width;
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
    // 判斷每一元素是否一樣 //
    static isSame(A, B) {
        return this.isSameSize(A, B) && A.every((row, i) => row.every((e, j) => e === B[i][j]));
    }
    // 判斷單位矩陣 //
    static isI(matrix) {
        return matrix.everyDiag(e => e === 1) && this.isDiagonal(matrix);
    }
    // 判斷上三角矩陣 //
    static isUpperTriangular(matrix) {
        return matrix.everyLowerTriangular(e => e === 0);
    }
    // 判斷下三角矩陣 //
    static isLowerTriangular(matrix) {
        return matrix.everyUpperTriangular(e => e === 0);
    }
    // 判斷對角矩陣 //
    static isDiagonal(matrix) {
        return matrix.everyUpperTriangular(e => e === 0) 
        && matrix.everyLowerTriangular(e => e === 0);
    }
    // 判斷對稱矩陣 //
    static isSymmetric(matrix) {
        return this.isSame(matrix, this.transpose(matrix));
    }
    // 判斷 斜對稱矩陣 或叫 反對稱矩陣 //
    static isSkewSymmetric(matrix) {
        return this.isSame(matrix.divide(-1), this.transpose(matrix));
    }
    // 判斷冪零矩陣 //
    static isNilpotent() {

    }
    // 跡 trace
    static tr(matrix) {
        MatrixError.isSquare(matrix);
        let result = 0
        matrix.forDiag(e => result += e);
        return result;
    }
    // 生成對角線矩陣 //
    static diag() {
        const l = arguments.length;
        let result = new Matrix(l, l, 0);
        for (let i = 0; i < l; i++) {
            result[i][i] = arguments[i];
        }
        return result;
    }
    // 單位矩陣 //
    static I(n = 3) {
        return this.diag(...Array(n).fill(1));
    }
    // Determinant 行列式 //
    static det(matrix) {
        if (!Matrix.isMatrix(matrix)) throw '此參數無法計算行列式';
        MatrixError.isSquare(matrix);
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
    // 餘子矩陣 //
    static minor(matrix) {
        MatrixError.isSquare(matrix);
        let minorOfMatrix = new Matrix(matrix.size);
        for (let i = 0; i < matrix.height; i++) {
            for (let j = 0; j < matrix.height; j++) {
                let temp = new Matrix(matrix);
                temp.deleteRow(i);
                temp.deleteColumn(j);
                minorOfMatrix[i][j] = (-1)**(i + j + 2) * this.det(temp); 
            }
        }
        return minorOfMatrix;
    }
    // adjugate matrix 伴隨矩陣 // 
    static adj(matrix) {
        return Matrix.transpose(matrix);
    }
    // 逆矩陣 // ！ 判斷是否可逆
    static inverse(matrix) {
        return this.adj(matrix).divide(this.det(matrix));
    } 
    // 是否可逆矩陣 // ！ 未完成
    static isInvertible(matrix) {
        return this.isSquare(matrix);
    }

    // Strassen algorithm 施特拉森演算法 //
    static strassenAlgorithm2x2(A, B) {
        if (!this.isSameSize(A, B)) throw '算法要求兩相同尺寸的方陣';
        let M = [];
        let C = new Matrix(A.size);
        M[0] = (A[0][0] + A[1][1]) * (B[0][0] + B[1][1]);
        M[1] = (A[1][0] + A[1][1]) * B[0][0];
        M[2] =  A[0][0] * (B[0][1] - B[1][1]);
        M[3] =  A[1][1] * (B[1][0] - B[0][0]);
        M[4] = (A[0][0] + A[0][1]) * B[1][1];
        M[5] = (A[1][0] - A[0][0]) * (B[0][0] + B[0][1]);
        M[6] = (A[0][1] - A[1][1]) * (B[1][0] + B[1][1]);
        C[0][0] = M[0] + M[3] - M[4] + M[6];
        C[0][1] = M[2] + M[4];
        C[1][0] = M[1] + M[3];
        C[1][1] = M[0] - M[1] + M[2] + M[5];
        return C;
    }

    /** 轉換 */
    // 2維 //
    static rotationMatrix2D(theta) {
        return new Matrix([
            [Math.cos(theta), -Math.sin(theta)],
            [Math.sin(theta), Math.cos(theta)]
        ]);
    }
    // 旋轉 // ！ 未完成
    static rotation2D(matrix, theta) {
        let result = new Matrix(matrix.size);
        let rotationMatrix2D = this.rotationMatrix2D(theta);
        matrix.forAll((e, _, y, x) => {
            let newPosition = rotationMatrix2D.product(new Matrix([[y], [x]]));
            let newX = Math.round(newPosition[1]);
            let newY = Math.round(newPosition[0]);
            console.log(newPosition)
            result[newY][newX] = e;
        });
        return result;
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

        } else if (Number.isInteger(height) && Number.isInteger(width)) {
            // _不被調用的屬性
            this.height = height;
            this.width = width;
            // 生成矩陣
            let array = new Array(height).fill(null);
            matrix = init != undefined 
            ? array.map(() => new Array(width).fill(init)) 
            : array.map(() => new Array(width));

        } else if (height instanceof MatrixSize) {
            this.height = height.height;
            this.width = height.width;
            const init = width;
            let array = new Array(this.height).fill(null);
            matrix = init != undefined 
            ? array.map(() => new Array(this.width).fill(init)) 
            : array.map(() => new Array(this.width));
            
        } else throw '傳入參數數據類型錯誤';

        // 繼承 Matrix 的方法;
        matrix.__proto__ = this;
        // 添加 Matrix 屬性到 matrix 屬性，因為 返回的是 matrix 是原生Array，不帶有 Matrix 的屬性，必須放在 constructor 最後
        // const propertyNames = Object.getOwnPropertyNames(this); // 獲取自身屬性
        // for (const name of propertyNames) {
        //     // 如果 Array 存在就不定義該屬性
        //     Array[name] ?? Object.defineProperty(matrix, name, {
        //         value: this[name],
        //         configurable: false,
        //         writable: false
        //     })
        // }
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
        return new MatrixSize(this.height, this.width);
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
    forAll(callback) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                callback(this[i][j], i * this.width + j, i, j);
            }
        }
    }

    // 遍歷對角線的元素 //
    forDiag(callback) {
        MatrixError.isSquare(this);
        for (let i = 0; i < this.height; i++) {
            callback(this[i][i]);
        }
    }
    // 遍歷上三角的元素 //
    forUpperTriangular(callback) {
        MatrixError.isSquare(this);
        for (let i = 1; i < this.height; i++) {
            for (let j = 0; j < this.height - i; j++) {
                callback(this[j][j + i])
            }
        }
    }
    // 遍歷下三角的元素 //
    forLowerTriangular(callback) {
        MatrixError.isSquare(this);
        for (let i = 1; i < this.height; i++) {
            for (let j = 0; j < this.height - i; j++) {
                callback(this[j + i][j]);
            }
        }
    }
    // 判斷對角線的全部元素是否符合條件 //
    everyDiag(callback) {
        MatrixError.isSquare(this);
        for (let i = 0; i < this.height; i++) {
            if (!callback(this[i][i])) {
                return false;
            }
        }
        return true;
    }
    // 判斷上三角的全部元素是否符合條件 //
    everyUpperTriangular(callback) {
        MatrixError.isSquare(this);
        for (let i = 1; i < this.height; i++) {
            for (let j = 0; j < this.height - i; j++) {
                if (!callback(this[j][j + i])) {
                    return false;
                }
            }
        }
        return true
    }
    // 判斷下三角的全部元素是否符合條件 //
    everyLowerTriangular(callback) {
        MatrixError.isSquare(this);
        for (let i = 1; i < this.height; i++) {
            for (let j = 0; j < this.height - i; j++) {
                if (!callback(this[j + i][j])) {
                    return false;
                }
            }
        }
        return true;
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
    // pow(value = 1) {
    //     return this.__privateBasicOperationsMethod(
    //         value,
    //         (e, _, i, j) => e ** value[i][j],
    //         matrix => (e, _, i, j) => e ** matrix[i][j],
    //         flatted => (e, n) => e ** flatted[n],
    //         e => e ** value
    //     );
    // }
    product(B) {
        let result = new Matrix(this.height, B.width, 0);
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                for (let k = 0; k < B.width; k++) {
                    result[i][k] += this[i][j] * B[j][k];
                }
            }
        }
        return result;
    }
    // 轉置 //
    get T() {
        let transposeMatrix = new Matrix(this.width, this.height);
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                transposeMatrix[j][i] = this[i][j];
            }
        }
        return transposeMatrix;
    }
    // 初始化 //
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
        let temp = [[],[],[],[]];
        let subMatrixs = new Matrix(2, 2);
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                temp[
                    i < column ? j < row ? 0 : 2 : j < row ? 1 : 3
                ].push(this[i][j]);
            }
        }
        subMatrixs[0][0] = new Matrix(temp[0]).reshape(row, column);
        subMatrixs[0][1] = new Matrix(temp[1]).reshape(row, this.width - column);
        subMatrixs[1][0] = new Matrix(temp[2]).reshape(this.height - row, column);
        subMatrixs[1][1] = new Matrix(temp[3]).reshape(this.height - row, this.width - column);
        return subMatrixs;
    }
    // 刪除一列 // 原地，返回被刪除元素之 Matrix
    deleteRow(num, deleteCount = 1 ) {
        this.height--;
        return new Matrix(this.splice(num, deleteCount));
    }
    // 刪除一行 // 原地，返回被刪除元素之 Matrix
    deleteColumn(num, deleteCount = 1) {
        this.width--;
        let matrix = new Matrix(this.size);
        for (let i = 0; i < this.height; i++) {
            matrix[i] = this[i].splice(num, deleteCount);
        }
        return matrix;
    }
    // // 不原地 
    padding(value) {
        let result = new Matrix(this.height + value * 2, this.width + value * 2);
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                result[i + value][j + value] = this[i][j];
            }
        }
        return result;
    }
    /**
     * 卷積的動作
     * @param {MatrixSize} size 
     * @param {number} stride 
     * @param {function} callback 
     * @param {function} callback2
     */
    convo(size, stride = 1, callback, callback2) {
        const featureMapWidth = (this.width - size.width) / stride + 1;
        const featureMapHeight = (this.height - size.height) / stride + 1;
        for (let i = 0; i < featureMapHeight; i += stride) {
            for (let j = 0; j < featureMapWidth; j += stride) {
                for (let k = 0; k < size.height; k++) {
                    for (let l = 0; l < size.width; l++) {
                        callback(this[k + i][l + j], k, l, i, j)
                    }
                }
                callback2(i, j);
            }
        }
    }
    // 卷積 // 不原地
    convolution(matrix, stride = 1) {
        const featureMapWidth = (this.width - matrix.width) / stride + 1;
        const featureMapHeight = (this.height - matrix.height) / stride + 1;
        let featureMap = new Matrix(featureMapHeight, featureMapWidth);
        for (let i = 0; i < featureMapHeight; i += stride) {
            for (let j = 0; j < featureMapWidth; j += stride) {
                let weight = 0;
                for (let k = 0; k < matrix.height; k++) {
                    for (let l = 0; l < matrix.width; l++) {
                        weight += this[k + i][l + j] * matrix[k][l];
                    }
                }
                featureMap[i][j] = weight;
            }
        }
        return featureMap;
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

