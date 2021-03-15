# Matrix.js






## Matrix

### constructor

#### new Matrix(height, width, init)

#### new Matrix(\<MatrixSize>, init)

#### new Matrix(\<Array>)

#### new Matrix(\<URL>) // 未實現



### Methods

#### Matrix.isMatrix(obj)

判斷參數是否為矩陣。

#### Matrix.isSquare(obj)

判斷參數是否為方陣。

#### Matrix.isSameSize(obj1, obj2)

判斷 `obj1` 和 `obj2` 是否尺寸一樣。

#### Matrix.isSameLength()

判斷 是否總長度一樣，即面積一樣。

#### Matrix.isArray(\<Array>)

判斷傳入的 `Array` 是否為矩陣。

#### Matrix.isSame(A, B)

判斷每一元素是否一樣。

#### Matrix.isI(\<Matrix>)

判斷參數是否為單位矩陣。

#### Matrix.isUpperTriangular(\<Matrix>)

判斷參數是否為上三角矩陣。

#### Matrix.isLowerTriangular(\<Matrix>)

判斷參數是否為下三角矩陣。

#### Matrix.isDiagonal(\<Matrix>)

判斷參數是否為對角矩陣。

#### Matrix.isSymmetric(\<Matrix>)

判斷參數是否為對稱矩陣。

#### Matrix.isSkewSymmetric(\<Matrix>)

判斷參數是否為斜對稱矩陣（反對稱矩陣）。

#### Matrix.isNilpotent(\<Matrix>)

判斷參數是否為冪零矩陣。

#### Matrix.tr(\<Matrix>)

求得參數的跡。

#### Matrix.diag([value1[, value2[, ...]]])

生成一個對角線矩陣。

#### Matrix.I(n = 3)

生成一個單位矩陣。

#### Matrix.det(\<Matrix>)

求得參數的行列式。

#### Matrix.minor(\<Matrix>)

求得參數的餘子矩陣。

#### Matrix.transpose(\<Matrix>)

求得該矩陣的轉置矩陣。

#### Matrix.adj(\<Matrix>)

求得參數的伴隨矩陣。

#### Matrix.inverse(\<Matrix>)

求得參數的逆矩陣。

#### Matrix.isInvertible(\<Matrix>)

判斷參數是否為可逆矩陣。

#### Matrix.strassenAlgorithm2x2(A, B)

2x2 的 Strassen algorithm 施特拉森演算法。

#### Matrix.rotationMatrix2D(theta)

獲得旋轉的轉換矩陣。

#### get \<Matrix>.content

獲得該矩陣的所有元素，裝載在原始類型的 `Array` 中。

#### get \<Matrix>.size

獲得該矩陣的尺寸為 `MatrixSize` 類別。

#### \<Matrix>.mapAll(function callback([n[,   [, i[, j]]]]))

遍歷該矩陣的所有元素，保留 `callback` 返回的值構成新的矩陣。

#### \<Matrix>.forAll(function callback(n, ))

遍歷該矩陣的所有元素，不返回任何值。

#### \<Matrix>.forDiag(function callback(n))

遍歷該矩陣的對角線的元素。

#### \<Matrix>.forUpperTriangular(function callback(n))

遍歷該矩陣的上三角的元素。

#### \<Matrix>.forLowerTriangular(function callback(n))

遍歷該矩陣的下三角的元素。

#### \<Matrix>.everyDiag(function condition(n))

判斷該矩陣的對角線的全部元素是否符合某條件。

#### \<Matrix>.everyUpperTriangular(function condition(n))

判斷該矩陣的上三角的全部元素是否符合某條件。

#### \<Matrix>.everyLowerTriangular(function condition(n))

判斷該矩陣的下三角的全部元素是否符合某條件。

#### \<Matrix>.__privateBasicOperationsMethod(value, isSameSizeMatrix, isSameTotalLengthMatrix, isSameTotalLengthArray, other)

不應該使用該方法。

#### \<Matrix>.plus(value = 0)

求得該矩陣的元素加上 `value` 的新矩陣。

#### \<Matrix>.minus(value = 0)

求得該矩陣的元素減去 `value` 的新矩陣。

#### \<Matrix>.multiply(value = 1)

求得該矩陣的元素乘以 `value` 的新矩陣。

#### \<Matrix>.divide(value = 1)

求得該矩陣的元素除以 `value` 的新矩陣。

#### \<Matrix>.mod(value = 1)

求得該矩陣的元素模除 `value` 的新矩陣。

#### \<Matrix>.product(\<Matrix>) 

求得該矩陣乘以另外一個矩陣的新矩陣。

#### get \<Matrix>.T

求得該矩陣的轉置矩陣。

#### \<Matrix>.init(value)

該矩陣的所有元素初始化為 `value`。

#### \<Matrix>.reshape(height, width)

重塑該矩陣。

#### \<Matrix>.partition(row, column)

十字分割矩陣為四份。

#### \<Matrix>.deleteRow(num, deleteCount = 1)

刪除該矩陣其中幾列 `Row` ，返回已處理的新矩陣。

#### \<Matrix>.deleteColumn(num, deleteCount = 1)

刪除該矩陣其中幾行 `Column`，返回已處理的新矩陣。

#### \<Matrix>.putIn(\<Matrix>, row, column)

原地另外一個矩陣的取代該矩陣中的部分元素。

#### \<Matrix>.rotate()

原地旋轉該矩陣。

#### \<Matrix>.padding(value)

該矩陣的邊緣擴充 `value` 圈元素，返回已處理的新矩陣。

#### \<Matrix>.convo(\<MatrixSize>, stride = 1, initCallback, callback, callback2)

對該矩陣進行與卷積一樣的動作，但並不進行運算，保留要如何運算處理的方法在 `callback` 中。

#### \<Matrix>.convolution(\<Matrix>, stride = 1)

該矩陣與另外一個矩陣卷積，返回卷積結果的新矩陣。



## MatrixSize

### Constructor

#### new MatrixSize(height, width)

