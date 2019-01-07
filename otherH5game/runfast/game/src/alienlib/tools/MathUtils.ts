/**
 * Created by rockyl on 16/3/9.
 */


module PDKalien {
	export class MathUtils {
		/**
		 * 计算距离
		 * @param p1
		 * @param p2
		 * @returns {number}
		 */
		static distancePoint(p1: any, p2: any): number {
			return this.distance(p1.x, p1.y, p2.x, p2.y);
		}

		/**
		 * 计算距离
		 * @param x1
		 * @param y1
		 * @param x2
		 * @param y2
		 * @returns {number}
		 */
		static distance(x1: number, y1: number, x2: number, y2: number): number {
			return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
		}

		/**
		 * 计算两点直线的斜率
		 * @param p1
		 * @param p2
		 * @returns {number}
		 */
		static angle(p1: any, p2: any): number {
			return Math.atan2(p2.y - p1.y, p2.x - p1.x);
		}

		/**
		 * 获取一个随机整数
		 * @param max
		 * @param min
		 * @returns {number}
		 */
		static makeRandomInt(max: number, min: number = 0): number {
			return Math.floor(Math.random() * (max - min)) + min;
		}

		/**
		 * 获取一个随机浮点数
		 * @param max
		 * @param min
		 * @returns {number}
		 */
		static makeRandomFloat(max: number, min: number = 0): number {
			return Math.random() * (max - min) + min;
		}

		/**
		 * 生成一个基于value的range偏移的随机数
		 * @param value
		 * @param range
		 * @returns {number}
		 */
		static makeRandomByRange(value: number, range: number): number {
			return value + (Math.random() * range * 2 - range);
		}

		/**
		 * 生成一个随机整数数组
		 * @param len
		 * @returns {string}
		 */
		static makeRandomIntArr(len: number, max: number, min: number = 0): number[] {
			let target: number[] = [];
			for (let i: number = 0; i < len; i++) {
				target.push(this.makeRandomInt(max));
			}

			return target;
		}

		/**
		 * 生成一个范围数组
		 * @param to
		 * @param from
		 * @param step
		 * @returns {Array<number>}
		 */
		static makeOrderIntArray(to: number, from: number = 0, step: number = 1): Array<number> {
			let result: Array<number> = [];
			for (let i: number = from; i <= to; i += step) {
				result.push(i);
			}

			return result;
		}

		/**
		 * 打乱一个数组
		 * @param arr
		 * @returns {any}
		 */
		static mixArray(arr: any): Array<any> {
			for (let i: number = 0, len: number = Math.round(arr.length / 2); i < len; i++) {
				let a: number = this.makeRandomInt(arr.length);
				let b: number = this.makeRandomInt(arr.length);
				let temp = arr[a];
				arr[a] = arr[b];
				arr[b] = temp;
			}

			return arr;
		}

		/**
		 * 打乱一个二维数组
		 * @param arr
		 * @returns {Array<Array<any>>}
		 */
		static mixArray2(arr: Array<Array<any>>): Array<Array<any>> {
			let cH: number = arr[0].length;
			let cV: number = arr.length;
			let pos0: number[];
			let pos1: number[];
			for (let i: number = 0, len: number = Math.round(cH * cV / 2); i < len; i++) {
				pos0 = [this.makeRandomInt(cH), this.makeRandomInt(cV)];
				pos1 = [this.makeRandomInt(cH), this.makeRandomInt(cV)];
				let temp = arr[pos0[0]][pos0[1]];
				arr[pos0[0]][pos0[1]] = arr[pos1[0]][pos1[1]];
				arr[pos1[0]][pos1[1]] = temp;
			}

			return arr;
		}

		/**
		 * 随机从一个数组中取出一项
		 * @param arr
		 * @returns {*}
		 */
		static getRandomFromArray(arr: any): any {
			return arr[this.makeRandomInt(arr.length)];
		}

		/**
		 * 根据范围阻隔
		 * @param value
		 * @param lower
		 * @param upper
		 * @returns {number}
		 */
		static fixRange(value: number, lower: number, upper: number): number {
			if (value < lower) {
				value = lower;
			} else if (value > upper) {
				value = upper;
			}

			return value;
		}

		/**
		 * 根据范围补足
		 * @param value
		 * @param max
		 * @param min
		 * @returns {number}
		 */
		static roundFix(value: number, max: number, min: number = 0): number {
			if (value < min) {
				value += max - min;
			} else if (value >= max) {
				value -= max - min;
			}

			return value;
		}

		/**
		 * 弧度转角度
		 * @param radius
		 * @returns {number}
		 */
		static radiusToAngle(radius: number): number {
			return radius * 180 / Math.PI;
		}

		/**
		 * 角度转弧度
		 * @param angle
		 * @returns {number}
		 */
		static angleToRadius(angle: number): number {
			return angle * Math.PI / 180;
		}

		/**
		 * 数组向右旋转
		 * @param arr
		 * @returns {Array}
		 */
		static turnRight(arr) {
			let temp = [];
			for (let t = 0, tl = arr.length; t < tl; t++) {
				temp.push([]);
			}
			for (let i = 0, il = arr.length; i < il; i++) {
				for (let j = 0, jl = arr[i].length; j < jl; j++) {
					temp[i][j] = arr[jl - j - 1][i];
				}
			}
			return temp;
		}

		/**
		 * 数组向左旋转
		 * @param arr
		 * @returns {Array}
		 */
		static turnLeft(arr) {
			let temp = [];
			for (let t = 0, tl = arr.length; t < tl; t++) {
				temp.push([]);
			}
			for (let i = 0, il = arr.length; i < il; i++) {
				for (let j = 0, jl = arr[i].length; j < jl; j++) {
					temp[i][j] = arr[j][jl - i - 1];
				}
			}
			return temp;
		}

		/**
		 * 根据两点计算量化方向,用于手势识别
		 * @param x0
		 * @param y0
		 * @param x1
		 * @param y1
		 * @returns {number}
		 */
		static calDir(x0: number, y0: number, x1: number, y1: number): number {
			if (x0 == x1 && y0 == y1) {
				return -1;
			}

			let r: number = Math.atan2(y1 - y0, x1 - x0);
			let d: number;
			if (Math.abs(r) < Math.PI / 4) {
				d = 0;
			} else if (Math.abs(r) > Math.PI / 4 * 3) {
				d = 2;
			} else if (r > 0) {
				d = 1;
			} else {
				d = 3;
			}
			return d;
		}

		/**
		 * 数值正负计算
		 * @param num
		 * @returns {number}
		 */
		static sign(num: number): number {
			return num == 0 ? 0 : (num > 0 ? 1 : -1);
		}

		/**
		 * 把一个正整数分割成若干个整数
		 * @param total
		 * @param count
		 * @returns {Array}
		 */
		static split(total, count) {
			let result = [];
			for (let i = 0; i < count; i++) {
				result[i] = 0;
			}
			for (let i = 0; i < total; i++) {
				result[this.makeRandomInt(count)]++;
			}
			return result;
		}

		static bezierPoints(points, count) {
			let result = [];
			let t = 0;
			let arr2;

			let perT = 1 / (count - 1);
			for(let i = 0; i < count; i++){
				let arr = points.concat();
				for(let k = arr.length - 1; k > 0; k--){
					arr2 = [];
					for(let j = 0, lj = arr.length; j < lj - 1; j++){
						arr2.push(unit(arr[j], arr[j + 1], t));
					}
					arr = arr2;
				}

				result.push(arr[0]);

				t += perT;
			}

			function unit(a, b, t){
				return {
					x: (b.x - a.x) * t + a.x,
					y: (b.y - a.y) * t + a.y,
				};
			}

			return result;
		}
	}
}