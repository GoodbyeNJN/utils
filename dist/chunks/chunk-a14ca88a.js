//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-D6FCK2GA.js
function u$16(o$39, n$15, a$27) {
	let t$24 = (r$20) => o$39(r$20, ...n$15);
	return a$27 === void 0 ? t$24 : Object.assign(t$24, {
		lazy: a$27,
		lazyArgs: n$15
	});
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-WIMGWYZL.js
function u$8(r$20, n$15, o$39) {
	let a$27 = r$20.length - n$15.length;
	if (a$27 === 0) return r$20(...n$15);
	if (a$27 === 1) return u$16(r$20, n$15, o$39);
	throw new Error("Wrong number of arguments");
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-ZRKG4NSC.js
function a$12(...n$15) {
	return u$8(i$39, n$15);
}
var i$39 = (n$15) => `${n$15[0]?.toLowerCase() ?? ""}${n$15.slice(1)}`;

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-ANXBDSUI.js
var e$9 = {
	done: !0,
	hasNext: !1
}, s$9 = {
	done: !1,
	hasNext: !1
}, a$18 = () => e$9, o$9 = (t$24) => ({
	hasNext: !0,
	next: t$24,
	done: !1
});

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-3GOCSNFN.js
function C$1(t$24, ...o$39) {
	let n$15 = t$24, u$26 = o$39.map((e$10) => "lazy" in e$10 ? y$14(e$10) : void 0), p$7 = 0;
	for (; p$7 < o$39.length;) {
		if (u$26[p$7] === void 0 || !B(n$15)) {
			let i$40 = o$39[p$7];
			n$15 = i$40(n$15), p$7 += 1;
			continue;
		}
		let r$20 = [];
		for (let i$40 = p$7; i$40 < o$39.length; i$40++) {
			let l$18 = u$26[i$40];
			if (l$18 === void 0 || (r$20.push(l$18), l$18.isSingle)) break;
		}
		let a$27 = [];
		for (let i$40 of n$15) if (f$7(i$40, a$27, r$20)) break;
		let { isSingle: s$18 } = r$20.at(-1);
		n$15 = s$18 ? a$27[0] : a$27, p$7 += r$20.length;
	}
	return n$15;
}
function f$7(t$24, o$39, n$15) {
	if (n$15.length === 0) return o$39.push(t$24), !1;
	let u$26 = t$24, p$7 = s$9, e$10 = !1;
	for (let [r$20, a$27] of n$15.entries()) {
		let { index: s$18, items: i$40 } = a$27;
		if (i$40.push(u$26), p$7 = a$27(u$26, s$18, i$40), a$27.index += 1, p$7.hasNext) {
			if (p$7.hasMany ?? !1) {
				for (let l$18 of p$7.next) if (f$7(l$18, o$39, n$15.slice(r$20 + 1))) return !0;
				return e$10;
			}
			u$26 = p$7.next;
		}
		if (!p$7.hasNext) break;
		p$7.done && (e$10 = !0);
	}
	return p$7.hasNext && o$39.push(u$26), e$10;
}
function y$14(t$24) {
	let { lazy: o$39, lazyArgs: n$15 } = t$24, u$26 = o$39(...n$15);
	return Object.assign(u$26, {
		isSingle: o$39.single ?? !1,
		index: 0,
		items: []
	});
}
function B(t$24) {
	return typeof t$24 == "string" || typeof t$24 == "object" && t$24 !== null && Symbol.iterator in t$24;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-LFJW7BOT.js
function y$6(t$24, i$40) {
	let a$27 = i$40.length - t$24.length;
	if (a$27 === 1) {
		let [n$15, ...r$20] = i$40;
		return C$1(n$15, {
			lazy: t$24,
			lazyArgs: r$20
		});
	}
	if (a$27 === 0) {
		let n$15 = {
			lazy: t$24,
			lazyArgs: i$40
		};
		return Object.assign((e$10) => C$1(e$10, n$15), n$15);
	}
	throw new Error("Wrong number of arguments");
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-QJLMYOTX.js
function i$17(...e$10) {
	return y$6(a$26, e$10);
}
function a$26() {
	let e$10 = /* @__PURE__ */ new Set();
	return (t$24) => e$10.has(t$24) ? s$9 : (e$10.add(t$24), {
		done: !1,
		hasNext: !0,
		next: t$24
	});
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-7ZI6JRPB.js
function T$2(...e$10) {
	return y$6(y$13, e$10);
}
function y$13(e$10) {
	let u$26 = e$10, n$15 = /* @__PURE__ */ new Set();
	return (t$24, i$40, d$17) => {
		let r$20 = u$26(t$24, i$40, d$17);
		return n$15.has(r$20) ? s$9 : (n$15.add(r$20), {
			done: !1,
			hasNext: !0,
			next: t$24
		});
	};
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-OXJMERKM.js
function m$10(...e$10) {
	return y$6(s$17, e$10);
}
var s$17 = (e$10) => (t$24, n$15, o$39) => o$39.findIndex((u$26, i$40) => n$15 === i$40 || e$10(t$24, u$26)) === n$15 ? {
	done: !1,
	hasNext: !0,
	next: t$24
} : s$9;

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-BSLJB6JE.js
function r$10(...t$24) {
	return u$8(Object.values, t$24);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-NJXNQM3G.js
function d$10(...e$10) {
	return e$10.length === 2 ? (n$15, ...r$20) => t$23(n$15, ...e$10, ...r$20) : t$23(...e$10);
}
var t$23 = (e$10, n$15, r$20, ...a$27) => n$15(e$10, ...a$27) ? typeof r$20 == "function" ? r$20(e$10, ...a$27) : r$20.onTrue(e$10, ...a$27) : typeof r$20 == "function" ? e$10 : r$20.onFalse(e$10, ...a$27);

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-6RKHJ2CP.js
function d$11(...e$10) {
	return u$8(i$38, e$10, o$38);
}
var i$38 = (e$10, n$15) => e$10.length < n$15.length ? e$10.map((t$24, r$20) => [t$24, n$15[r$20]]) : n$15.map((t$24, r$20) => [e$10[r$20], t$24]), o$38 = (e$10) => (n$15, t$24) => ({
	hasNext: !0,
	next: [n$15, e$10[t$24]],
	done: t$24 >= e$10.length - 1
});

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-QDGUNRDA.js
function T$3(e$10, n$15, r$20) {
	return typeof e$10 == "function" ? (t$24, a$27) => o$37(t$24, a$27, e$10) : typeof n$15 == "function" ? u$16(o$37, [e$10, n$15], u$25) : o$37(e$10, n$15, r$20);
}
function o$37(e$10, n$15, r$20) {
	let t$24 = [e$10, n$15];
	return e$10.length < n$15.length ? e$10.map((a$27, i$40) => r$20(a$27, n$15[i$40], i$40, t$24)) : n$15.map((a$27, i$40) => r$20(e$10[i$40], a$27, i$40, t$24));
}
var u$25 = (e$10, n$15) => (r$20, t$24, a$27) => ({
	next: n$15(r$20, e$10[t$24], t$24, [a$27, e$10]),
	hasNext: !0,
	done: t$24 >= e$10.length - 1
});

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-EVIH3PFY.js
function r$6(...n$15) {
	return u$8(e$8, n$15);
}
function e$8(n$15, o$39) {
	return o$39(n$15), n$15;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-MYLLMFC7.js
function a$9(...e$10) {
	return u$8(T$9, e$10);
}
function T$9(e$10, m$14) {
	if (e$10 < 1) return [];
	let r$20 = Number.isInteger(e$10) ? e$10 : Math.floor(e$10), t$24 = new Array(r$20);
	for (let n$15 = 0; n$15 < r$20; n$15++) t$24[n$15] = m$14(n$15);
	return t$24;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-DEVKGLTN.js
var c$8 = new Set([
	"-",
	"_",
	...[
		"	",
		`
`,
		"\v",
		"\f",
		"\r",
		" ",
		"",
		"\xA0",
		" ",
		" ",
		" ",
		" ",
		" ",
		" ",
		" ",
		" ",
		" ",
		" ",
		" ",
		" ",
		"\u2028",
		"\u2029",
		" ",
		" ",
		"　",
		"﻿"
	]
]), i$36 = (r$20) => {
	let e$10 = [], t$24 = "", u$26 = () => {
		t$24.length > 0 && (e$10.push(t$24), t$24 = "");
	};
	for (let s$18 of r$20) {
		if (c$8.has(s$18)) {
			u$26();
			continue;
		}
		if (/[a-z]$/u.test(t$24) && /[A-Z]/u.test(s$18)) u$26();
		else if (/[A-Z][A-Z]$/u.test(t$24) && /[a-z]/u.test(s$18)) {
			let n$15 = t$24.slice(-1);
			t$24 = t$24.slice(0, -1), u$26(), t$24 = n$15;
		} else /\d$/u.test(t$24) !== /\d/u.test(s$18) && u$26();
		t$24 += s$18;
	}
	return u$26(), e$10;
};

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-7ALUHC5I.js
var a$25 = /[a-z]/u, i$37 = !0;
function r$7(e$10, t$24) {
	return typeof e$10 == "string" ? n$14(e$10, t$24) : (s$18) => n$14(s$18, e$10);
}
var n$14 = (e$10, { preserveConsecutiveUppercase: t$24 = i$37 } = {}) => i$36(a$25.test(e$10) ? e$10 : e$10.toLowerCase()).map((s$18, C$2) => `${C$2 === 0 ? s$18[0].toLowerCase() : s$18[0].toUpperCase()}${t$24 ? s$18.slice(1) : s$18.slice(1).toLowerCase()}`).join("");

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-YRJ25UV2.js
function a$10(...e$10) {
	return u$8(o$36, e$10);
}
var o$36 = (e$10) => i$36(e$10).join("-").toLowerCase();

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-Q5ASJ5N7.js
function r$8(...e$10) {
	return u$8(t$22, e$10);
}
var t$22 = (e$10) => e$10.toLowerCase();

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-WZOX4VKU.js
function a$11(...e$10) {
	return u$8(o$35, e$10);
}
var o$35 = (e$10) => i$36(e$10).join("_").toLowerCase();

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-Y3VKZ3P5.js
function r$9(...e$10) {
	return u$8(t$21, e$10);
}
var t$21 = (e$10) => e$10.toUpperCase();

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-UWA26ZTC.js
function s$6(...n$15) {
	return u$8(d$16, n$15);
}
var d$16 = (n$15, t$24) => {
	let r$20 = n$15.entries(), e$10 = r$20.next();
	if ("done" in e$10 && e$10.done) return 0;
	let { value: [, i$40] } = e$10, a$27 = t$24(i$40, 0, n$15);
	for (let [o$39, m$14] of r$20) {
		let b$4 = t$24(m$14, o$39, n$15);
		a$27 += b$4;
	}
	return a$27;
};

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-DM52TTEP.js
function x(...e$10) {
	return u$8(d$15, e$10);
}
var d$15 = (e$10, n$15, t$24) => typeof e$10 == "string" ? o$34([...e$10], n$15, t$24).join("") : o$34(e$10, n$15, t$24);
function o$34(e$10, n$15, t$24) {
	let r$20 = [...e$10];
	if (Number.isNaN(n$15) || Number.isNaN(t$24)) return r$20;
	let s$18 = n$15 < 0 ? e$10.length + n$15 : n$15, i$40 = t$24 < 0 ? e$10.length + t$24 : t$24;
	return s$18 < 0 || s$18 > e$10.length || i$40 < 0 || i$40 > e$10.length || (r$20[s$18] = e$10[i$40], r$20[i$40] = e$10[s$18]), r$20;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-2P44HXVH.js
function T$1(...e$10) {
	return u$8(s$16, e$10);
}
function s$16(e$10, n$15, o$39) {
	let { [n$15]: p$7, [o$39]: r$20 } = e$10;
	return {
		...e$10,
		[n$15]: r$20,
		[o$39]: p$7
	};
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-ZJS5DNQW.js
function l$7(...r$20) {
	return u$8(o$33, r$20, u$24);
}
var o$33 = (r$20, e$10) => e$10 < 0 ? [] : r$20.slice(0, e$10);
function u$24(r$20) {
	if (r$20 <= 0) return a$18;
	let e$10 = r$20;
	return (a$27) => (e$10 -= 1, {
		done: e$10 <= 0,
		hasNext: !0,
		next: a$27
	});
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-DH3BPT6T.js
function o$25(n$15, r$20, e$10) {
	[n$15[r$20], n$15[e$10]] = [n$15[e$10], n$15[r$20]];
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-AIG3BDKO.js
function i$4(...e$10) {
	return u$8(n$13, e$10);
}
var n$13 = (e$10, r$20) => e$10.length >= r$20;

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-ZPVGOJQV.js
function T$5(n$15, o$39) {
	for (let r$20 = Math.floor(n$15.length / 2) - 1; r$20 >= 0; r$20--) c$7(n$15, r$20, o$39);
}
function m$11(n$15, o$39, r$20) {
	if (!i$4(n$15, 1)) return;
	let [t$24] = n$15;
	if (!(o$39(r$20, t$24) >= 0)) return n$15[0] = r$20, c$7(n$15, 0, o$39), t$24;
}
function c$7(n$15, o$39, r$20) {
	let t$24 = o$39;
	for (; t$24 * 2 + 1 < n$15.length;) {
		let i$40 = t$24 * 2 + 1, e$10 = r$20(n$15[t$24], n$15[i$40]) < 0 ? i$40 : t$24, f$8 = i$40 + 1;
		if (f$8 < n$15.length && r$20(n$15[e$10], n$15[f$8]) < 0 && (e$10 = f$8), e$10 === t$24) return;
		o$25(n$15, t$24, e$10), t$24 = e$10;
	}
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-EMIEIAAH.js
var T$8 = {
	asc: (r$20, n$15) => r$20 > n$15,
	desc: (r$20, n$15) => r$20 < n$15
};
function s$12(r$20, n$15) {
	let [e$10, ...o$39] = n$15;
	if (!m$13(e$10)) return r$20(e$10, u$23(...o$39));
	let a$27 = u$23(e$10, ...o$39);
	return (t$24) => r$20(t$24, a$27);
}
function f$4(r$20, [n$15, e$10, ...o$39]) {
	let a$27, t$24;
	return m$13(e$10) ? (a$27 = n$15, t$24 = [e$10, ...o$39]) : (a$27 = e$10, t$24 = [n$15, ...o$39]), s$12((...i$40) => r$20(...i$40, a$27), t$24);
}
function u$23(r$20, n$15, ...e$10) {
	let o$39 = typeof r$20 == "function" ? r$20 : r$20[0], a$27 = typeof r$20 == "function" ? "asc" : r$20[1], { [a$27]: t$24 } = T$8, i$40 = n$15 === void 0 ? void 0 : u$23(n$15, ...e$10);
	return (y$15, c$9) => {
		let p$7 = o$39(y$15), l$18 = o$39(c$9);
		return t$24(p$7, l$18) ? 1 : t$24(l$18, p$7) ? -1 : i$40?.(y$15, c$9) ?? 0;
	};
}
function m$13(r$20) {
	if (d$14(r$20)) return !0;
	if (typeof r$20 != "object" || !Array.isArray(r$20)) return !1;
	let [n$15, e$10, ...o$39] = r$20;
	return d$14(n$15) && typeof e$10 == "string" && e$10 in T$8 && o$39.length === 0;
}
var d$14 = (r$20) => typeof r$20 == "function" && r$20.length === 1;

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-R3YJIBPV.js
function s$7(...r$20) {
	return f$4(p$6, r$20);
}
function p$6(r$20, t$24, e$10) {
	if (e$10 <= 0) return [];
	if (e$10 >= r$20.length) return [...r$20];
	let n$15 = r$20.slice(0, e$10);
	T$5(n$15, t$24);
	let i$40 = r$20.slice(e$10);
	for (let u$26 of i$40) m$11(n$15, t$24, u$26);
	return n$15;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-4UEQNEAO.js
function o$7(...e$10) {
	return u$8(t$20, e$10);
}
var t$20 = (e$10, n$15) => n$15 > 0 ? e$10.slice(Math.max(0, e$10.length - n$15)) : [];

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-FRFM3CFY.js
function o$8(...e$10) {
	return u$8(a$24, e$10);
}
function a$24(e$10, r$20) {
	for (let n$15 = e$10.length - 1; n$15 >= 0; n$15--) if (!r$20(e$10[n$15], n$15, e$10)) return e$10.slice(n$15 + 1);
	return [...e$10];
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-XLGOY5UI.js
function u$12(...e$10) {
	return u$8(o$32, e$10);
}
function o$32(e$10, a$27) {
	let n$15 = [];
	for (let [i$40, r$20] of e$10.entries()) {
		if (!a$27(r$20, i$40, e$10)) break;
		n$15.push(r$20);
	}
	return n$15;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-MSOX5OUI.js
function y$5(...r$20) {
	return u$8(l$17, r$20);
}
function l$17(r$20, t$24, a$27, o$39) {
	let e$10 = [...r$20];
	return e$10.splice(t$24, a$27, ...o$39), e$10;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-RBODUO3Q.js
function i$14(t$24, e$10, n$15) {
	return typeof e$10 == "number" || e$10 === void 0 ? (r$20) => r$20.split(t$24, e$10) : t$24.split(e$10, n$15);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-S52RID4A.js
function i$15(...r$20) {
	return u$8(o$31, r$20);
}
function o$31(r$20, n$15) {
	let t$24 = Math.max(Math.min(n$15 < 0 ? r$20.length + n$15 : n$15, r$20.length), 0);
	return [r$20.slice(0, t$24), r$20.slice(t$24)];
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-WWPMIW33.js
function i$16(...r$20) {
	return u$8(o$30, r$20);
}
function o$30(r$20, a$27) {
	let n$15 = r$20.findIndex(a$27);
	return n$15 === -1 ? [[...r$20], []] : [r$20.slice(0, n$15), r$20.slice(n$15)];
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-57KROWWS.js
function s$4(...t$24) {
	return u$8(i$35, t$24);
}
var i$35 = (t$24, n$15) => t$24.startsWith(n$15);

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-F5HYI5XR.js
var d$13 = /^(?:0|[1-9][0-9]*)$/u;
function s$5(i$40) {
	let t$24 = [], a$27 = /\.{0,4096}(?<propName>[^.[\]]+)|\['(?<quoted>.{0,4096}?)'\]|\["(?<doubleQuoted>.{0,4096}?)"\]|\[(?<unquoted>.{0,4096}?)\]/uy, n$15;
	for (; (n$15 = a$27.exec(i$40)) !== null;) {
		let { propName: e$10, quoted: o$39, doubleQuoted: u$26, unquoted: r$20 } = n$15.groups;
		if (r$20 !== void 0) {
			t$24.push(...s$5(r$20));
			continue;
		}
		t$24.push(e$10 === void 0 ? o$39 ?? u$26 : d$13.test(e$10) ? Number(e$10) : e$10);
	}
	return t$24;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-ALS6JP7S.js
function b$2(...n$15) {
	return u$8(u$22, n$15);
}
var u$22 = (n$15, r$20) => n$15 - r$20;

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-UA6DVSZ3.js
function t$11(n$15, i$40, r$20) {
	return typeof n$15 == "string" ? n$15.slice(i$40, r$20) : (e$10) => e$10.slice(n$15, i$40);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-NFFV4IQT.js
function m$7(...r$20) {
	return u$8(o$29, r$20);
}
function o$29(r$20, t$24) {
	let e$10 = [...r$20];
	return e$10.sort(t$24), e$10;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-FDH4IRIM.js
function a$7(...r$20) {
	return s$12(n$12, r$20);
}
var n$12 = (r$20, t$24) => [...r$20].sort(t$24);

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-QEKOZYJ5.js
function i$32(o$39, l$18) {
	let t$24 = 0, e$10 = o$39.length;
	for (; t$24 < e$10;) {
		let n$15 = t$24 + e$10 >>> 1, d$17 = o$39[n$15];
		l$18(d$17, n$15, o$39) ? t$24 = n$15 + 1 : e$10 = n$15;
	}
	return e$10;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-YDIA5YQI.js
function u$10(...n$15) {
	return u$8(a$23, n$15);
}
var a$23 = (n$15, o$39) => i$32(n$15, (t$24) => t$24 < o$39);

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-6OEKBHIX.js
function m$8(...n$15) {
	return u$8(i$34, n$15);
}
function i$34(n$15, d$17, e$10) {
	let u$26 = e$10(d$17, void 0, n$15);
	return i$32(n$15, (a$27, t$24) => e$10(a$27, t$24, n$15) < u$26);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-GDGEDZJG.js
function t$12(...n$15) {
	return u$8(i$32, n$15);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-XE3XIKTJ.js
function u$11(...n$15) {
	return u$8(a$22, n$15);
}
var a$22 = (n$15, t$24) => i$32(n$15, (o$39) => o$39 <= t$24);

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-HVJXDSOP.js
function m$9(...n$15) {
	return u$8(i$33, n$15);
}
function i$33(n$15, t$24, e$10) {
	let a$27 = e$10(t$24, void 0, n$15);
	return i$32(n$15, (d$17, u$26) => e$10(d$17, u$26, n$15) <= a$27);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-DSLWSGID.js
function u$9(...r$20) {
	return f$4(y$12, r$20);
}
function y$12(r$20, t$24, o$39) {
	let n$15 = 0;
	for (let a$27 of r$20) t$24(o$39, a$27) > 0 && (n$15 += 1);
	return n$15;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-C4OZY4Z2.js
function l$6(...e$10) {
	return u$8(u$21, e$10);
}
var u$21 = (e$10, a$27, n$15) => e$10.reduce(a$27, n$15);

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-P2PQB7KO.js
function t$10(...e$10) {
	return u$8(r$19, e$10);
}
function r$19(e$10) {
	return [...e$10].reverse();
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-FZHIMCK6.js
var b$3 = (n$15) => (t$24, e$10) => {
	if (e$10 === 0) return n$15(t$24);
	if (!Number.isInteger(e$10)) throw new TypeError(`precision must be an integer: ${e$10.toString()}`);
	if (e$10 > 15 || e$10 < -15) throw new RangeError("precision must be between -15 and 15");
	if (Number.isNaN(t$24) || !Number.isFinite(t$24)) return n$15(t$24);
	return u$20(n$15(u$20(t$24, e$10)), -e$10);
};
function u$20(n$15, t$24) {
	let [s$18, r$20] = n$15.toString().split("e"), i$40 = `${s$18}e${((r$20 === void 0 ? 0 : Number.parseInt(r$20, 10)) + t$24).toString()}`;
	return Number.parseFloat(i$40);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-UHZ33J57.js
function i$13(...o$39) {
	return u$8(b$3(Math.round), o$39);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-6RL33UFT.js
function m$6(...e$10) {
	return u$8(o$28, e$10);
}
function o$28(e$10, r$20) {
	if (r$20 <= 0) return [];
	if (r$20 >= e$10.length) return [...e$10];
	let i$40 = Math.min(r$20, e$10.length - r$20), t$24 = /* @__PURE__ */ new Set();
	for (; t$24.size < i$40;) {
		let n$15 = Math.floor(Math.random() * e$10.length);
		t$24.add(n$15);
	}
	return r$20 === i$40 ? [...t$24].sort((n$15, a$27) => n$15 - a$27).map((n$15) => e$10[n$15]) : e$10.filter((n$15, a$27) => !t$24.has(a$27));
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-YNNF733L.js
function s$3(...e$10) {
	return u$8(n$11, e$10);
}
var n$11 = (e$10, r$20, o$39) => ({
	...e$10,
	[r$20]: o$39
});

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-GJXMNVQG.js
function h(...e$10) {
	return u$8(r$18, e$10);
}
function r$18(e$10, s$18, n$15) {
	let [t$24, ...a$27] = s$18;
	if (t$24 === void 0) return n$15;
	if (Array.isArray(e$10)) {
		let o$39 = [...e$10];
		return o$39[t$24] = r$18(e$10[t$24], a$27, n$15), o$39;
	}
	let { [t$24]: u$26,...P } = e$10;
	return {
		...P,
		[t$24]: r$18(u$26, a$27, n$15)
	};
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-KVHF7QRD.js
function d$9(...r$20) {
	return u$8(l$16, r$20);
}
function l$16(r$20) {
	let n$15 = [...r$20];
	for (let e$10 = 0; e$10 < r$20.length; e$10++) {
		let t$24 = e$10 + Math.floor(Math.random() * (r$20.length - e$10)), a$27 = n$15[t$24];
		n$15[t$24] = n$15[e$10], n$15[e$10] = a$27;
	}
	return n$15;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-4NRWDO7P.js
function a$5(...n$15) {
	return u$8(o$27, n$15);
}
function o$27(n$15) {
	let e$10 = typeof n$15[0] == "bigint" ? 1n : 1;
	for (let r$20 of n$15) e$10 *= r$20;
	return e$10;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-G5B2IDWB.js
function p$1(...e$10) {
	return u$8(t$19, e$10);
}
var t$19 = (e$10, o$39) => e$10[o$39];

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-W23M7ZKS.js
function b$1(...e$10) {
	return u$8(l$15, e$10);
}
function l$15(e$10, o$39, i$40) {
	let t$24 = {};
	for (let [r$20, n$15] of e$10.entries()) {
		let u$26 = o$39(n$15, r$20, e$10);
		t$24[u$26] = i$40(n$15, r$20, e$10);
	}
	return t$24;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-VFSOOVKJ.js
function l$5(n$15, t$24) {
	if (t$24 < n$15) throw new RangeError(`randomBigInt: The range [${n$15.toString()},${t$24.toString()}] is empty.`);
	let e$10 = t$24 - n$15, { length: r$20 } = e$10.toString(2), o$39 = Math.ceil(r$20 / 8), a$27 = BigInt(8 - r$20 % 8);
	for (;;) {
		let i$40 = g(c$6(o$39)) >> a$27;
		if (i$40 <= e$10) return i$40 + n$15;
	}
}
function g(n$15) {
	let t$24 = 0n;
	for (let e$10 of n$15) t$24 = (t$24 << 8n) + BigInt(e$10);
	return t$24;
}
function c$6(n$15) {
	let t$24 = new Uint8Array(n$15);
	if (typeof crypto > "u") for (let e$10 = 0; e$10 < n$15; e$10 += 1) t$24[e$10] = Math.floor(Math.random() * 256);
	else crypto.getRandomValues(t$24);
	return t$24;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-K3UJMX27.js
function o$6(r$20, n$15) {
	let e$10 = Math.ceil(r$20), t$24 = Math.floor(n$15);
	if (t$24 < e$10) throw new RangeError(`randomInteger: The range [${r$20.toString()},${n$15.toString()}] contains no integer`);
	return Math.floor(Math.random() * (t$24 - e$10 + 1) + e$10);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-LE6I3KC6.js
var i$31 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function m$5(...n$15) {
	return u$8(a$21, n$15);
}
function a$21(n$15) {
	let r$20 = [];
	for (let t$24 = 0; t$24 < n$15; t$24++) {
		let e$10 = i$31[Math.floor(Math.random() * i$31.length)];
		r$20.push(e$10);
	}
	return r$20.join("");
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-ENS7GPLZ.js
function a$6(...r$20) {
	return u$8(o$26, r$20);
}
function o$26(r$20, t$24) {
	let e$10 = [];
	for (let n$15 = r$20; n$15 < t$24; n$15++) e$10.push(n$15);
	return e$10;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-FMPZ2CLX.js
function i$10(e$10, ...r$20) {
	return (...t$24) => e$10(...r$20, ...t$24);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-R72GEKLP.js
function f$2(e$10, ...t$24) {
	return (...r$20) => e$10(...r$20, ...t$24);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-3IFJP4R5.js
function d$7(...r$20) {
	return u$8(i$30, r$20);
}
var i$30 = (r$20, t$24) => {
	let a$27 = [[], []];
	for (let [o$39, e$10] of r$20.entries()) t$24(e$10, o$39, r$20) ? a$27[0].push(e$10) : a$27[1].push(e$10);
	return a$27;
};

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-J4EKWFDW.js
function r$5(...t$24) {
	return u$8(T$7, t$24);
}
function T$7(t$24, n$15, l$18) {
	let e$10 = t$24;
	for (let o$39 of n$15) {
		if (e$10 == null) break;
		e$10 = e$10[o$39];
	}
	return e$10 ?? l$18;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-MU3RRSCT.js
function i$11(...e$10) {
	return u$8(s$15, e$10);
}
function s$15(e$10, o$39) {
	let r$20 = {};
	for (let n$15 of o$39) n$15 in e$10 && (r$20[n$15] = e$10[n$15]);
	return r$20;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-GGYFZTDW.js
function d$8(...e$10) {
	return u$8(i$29, e$10);
}
function i$29(e$10, o$39) {
	let t$24 = {};
	for (let [r$20, n$15] of Object.entries(e$10)) o$39(n$15, r$20, e$10) && (t$24[r$20] = n$15);
	return t$24;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-EDOGCRPU.js
function i$12(...n$15) {
	return (o$39) => C$1(o$39, ...n$15);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-BZNENX2T.js
function r$1(o$39) {
	if (typeof o$39 != "object" || o$39 === null) return !1;
	let e$10 = Object.getPrototypeOf(o$39);
	return e$10 === null || e$10 === Object.prototype;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-PDQFB3TV.js
function D(...e$10) {
	return u$8(s$14, e$10);
}
function s$14(e$10, t$24) {
	let r$20 = {
		...e$10,
		...t$24
	};
	for (let n$15 in t$24) {
		if (!(n$15 in e$10)) continue;
		let { [n$15]: i$40 } = e$10;
		if (!r$1(i$40)) continue;
		let { [n$15]: c$9 } = t$24;
		r$1(c$9) && (r$20[n$15] = s$14(i$40, c$9));
	}
	return r$20;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-W6ZHPGFP.js
function m$4(...n$15) {
	return u$8(t$18, n$15);
}
var t$18 = (n$15, u$26) => n$15 * u$26;

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-J3IRE4DI.js
var y$11 = (n$15, e$10, r$20) => e$10 < 0 || e$10 >= n$15.length ? void 0 : l$14([...n$15], 0, n$15.length - 1, e$10, r$20);
function l$14(n$15, e$10, r$20, o$39, u$26) {
	if (e$10 === r$20) return n$15[e$10];
	let t$24 = a$20(n$15, e$10, r$20, u$26);
	return o$39 === t$24 ? n$15[o$39] : l$14(n$15, o$39 < t$24 ? e$10 : t$24 + 1, o$39 < t$24 ? t$24 - 1 : r$20, o$39, u$26);
}
function a$20(n$15, e$10, r$20, o$39) {
	let u$26 = n$15[r$20], t$24 = e$10;
	for (let m$14 = e$10; m$14 < r$20; m$14++) o$39(n$15[m$14], u$26) < 0 && (o$25(n$15, t$24, m$14), t$24 += 1);
	return o$25(n$15, t$24, r$20), t$24;
}
function C(...n$15) {
	return f$4(c$5, n$15);
}
var c$5 = (n$15, e$10, r$20) => y$11(n$15, r$20 >= 0 ? r$20 : n$15.length + r$20, e$10);

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-RZUYD7QY.js
function u$7(...n$15) {
	return u$8(r$17, n$15);
}
var r$17 = (n$15, o$39) => ({ [o$39]: n$15 });

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-KI5X74E2.js
function y$4(...t$24) {
	return u$8(f$6, t$24);
}
function f$6(t$24, e$10) {
	if (!i$4(e$10, 1)) return { ...t$24 };
	if (!i$4(e$10, 2)) {
		let { [e$10[0]]: r$20,...m$14 } = t$24;
		return m$14;
	}
	let o$39 = { ...t$24 };
	for (let r$20 of e$10) delete o$39[r$20];
	return o$39;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-DXBCC5V6.js
function i$9(...e$10) {
	return u$8(l$13, e$10);
}
function l$13(e$10, a$27) {
	let t$24 = { ...e$10 };
	for (let [n$15, o$39] of Object.entries(t$24)) a$27(o$39, n$15, e$10) && delete t$24[n$15];
	return t$24;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-C6IMN7SF.js
function l$4(r$20) {
	let e$10 = !1, t$24;
	return () => (e$10 || (t$24 = r$20(), e$10 = !0), t$24);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-NS6ZBRLP.js
function t$9(...n$15) {
	return u$8(o$24, n$15);
}
var o$24 = (n$15) => n$15.length === 1 ? n$15[0] : void 0;

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-P3DXEVTH.js
function l$3(...n$15) {
	return u$8(d$12, n$15);
}
function d$12(n$15, o$39) {
	let e$10 = {};
	for (let [a$27, t$24] of n$15.entries()) {
		let [y$15, u$26] = o$39(t$24, a$27, n$15);
		e$10[y$15] = u$26;
	}
	return e$10;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-3ZJAREUD.js
function i$6(...e$10) {
	return u$8(o$23, e$10);
}
function o$23(e$10, r$20) {
	let a$27 = {};
	for (let [n$15, u$26] of Object.entries(e$10)) a$27[n$15] = r$20(u$26, n$15, e$10);
	return a$27;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-ZXVA7VDE.js
function i$7(...e$10) {
	return y$6(l$12, e$10);
}
var l$12 = (e$10, t$24) => {
	let a$27 = t$24;
	return (n$15, u$26, o$39) => (a$27 = e$10(a$27, n$15, u$26, o$39), {
		done: !1,
		hasNext: !0,
		next: a$27
	});
};

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-567G5ZXL.js
function a$8(...n$15) {
	return u$8(i$28, n$15);
}
function i$28(n$15) {
	let e$10 = typeof n$15[0] == "bigint" ? 0n : 0;
	for (let r$20 of n$15) e$10 += r$20;
	return e$10;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-KQRZQWDE.js
function u$6(...n$15) {
	return u$8(t$17, n$15);
}
function t$17(n$15) {
	if (n$15.length !== 0) return a$8(n$15) / n$15.length;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-3D3RWAVJ.js
function y$3(...n$15) {
	return u$8(m$12, n$15);
}
var m$12 = (n$15, t$24) => {
	if (n$15.length === 0) return NaN;
	let e$10 = 0;
	for (let [a$27, u$26] of n$15.entries()) e$10 += t$24(u$26, a$27, n$15);
	return e$10 / n$15.length;
};

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-K2FFNW24.js
function i$8(...e$10) {
	return u$8(o$22, e$10);
}
var a$19 = (e$10, n$15) => e$10 - n$15;
function o$22(e$10) {
	if (e$10.length === 0) return;
	let n$15 = [...e$10].sort(a$19);
	if (n$15.length % 2 !== 0) return n$15[(n$15.length - 1) / 2];
	let r$20 = n$15.length / 2;
	return (n$15[r$20] + n$15[r$20 - 1]) / 2;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-5S4PYKVY.js
function t$8(...e$10) {
	return u$8(u$19, e$10);
}
var u$19 = (e$10, o$39) => ({
	...e$10,
	...o$39
});

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-5WKPQX7L.js
function r$4(t$24) {
	let e$10 = {};
	for (let n$15 of t$24) e$10 = {
		...e$10,
		...n$15
	};
	return e$10;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-JJZ7E4YG.js
function r$2(o$39) {
	return typeof o$39 == "symbol";
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-XMLUDZIW.js
function n$7(e$10) {
	return !!e$10;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-GMMLSO2N.js
function r$3(...n$15) {
	return u$8(t$16, n$15);
}
var t$16 = (n$15, o$39) => n$15.join(o$39);

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-5NQBDF4H.js
function t$7(...n$15) {
	return u$8(Object.keys, n$15);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-PFSVCZNE.js
function a$4(...e$10) {
	return u$8(n$10, e$10);
}
var n$10 = (e$10) => e$10.at(-1);

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-VO5MRBXA.js
function l$2(...n$15) {
	return u$8(r$16, n$15);
}
var r$16 = (n$15) => "length" in n$15 ? n$15.length : [...n$15].length;

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-XUX3ZEXI.js
function m$3(...a$27) {
	return u$8(o$21, a$27, p$5);
}
var o$21 = (a$27, e$10) => a$27.map(e$10), p$5 = (a$27) => (e$10, t$24, r$20) => ({
	done: !1,
	hasNext: !0,
	next: a$27(e$10, t$24, r$20)
});

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-3EHKPGX2.js
function d$6(...e$10) {
	return u$8(y$10, e$10);
}
function y$10(e$10, a$27) {
	let n$15 = {};
	for (let [o$39, r$20] of Object.entries(e$10)) {
		let u$26 = a$27(o$39, r$20, e$10);
		n$15[u$26] = r$20;
	}
	return n$15;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-JK3VNB42.js
function n$6(e$10) {
	return e$10 == null;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-6GTAPB47.js
function e$2(r$20) {
	return typeof r$20 == "number" && !Number.isNaN(r$20);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-NMC53JVB.js
function o$5(e$10) {
	return typeof e$10 == "object" && e$10 !== null;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-PULGOXDA.js
function e$3(o$39) {
	return o$39 instanceof Promise;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-OLNQBNAJ.js
function c$2(...e$10) {
	return u$8(u$18, e$10);
}
function u$18(e$10, n$15) {
	if (e$10 === n$15 || Object.is(e$10, n$15)) return !0;
	if (typeof e$10 != "object" || e$10 === null || typeof n$15 != "object" || n$15 === null) return !1;
	if (e$10 instanceof Map && n$15 instanceof Map) return s$13(e$10, n$15);
	if (e$10 instanceof Set && n$15 instanceof Set) return f$5(e$10, n$15);
	let t$24 = Object.keys(e$10);
	if (t$24.length !== Object.keys(n$15).length) return !1;
	for (let o$39 of t$24) {
		if (!Object.hasOwn(n$15, o$39)) return !1;
		let { [o$39]: l$18 } = e$10, { [o$39]: a$27 } = n$15;
		if (l$18 !== a$27 || !Object.is(l$18, a$27)) return !1;
	}
	return !0;
}
function s$13(e$10, n$15) {
	if (e$10.size !== n$15.size) return !1;
	for (let [t$24, o$39] of e$10) {
		let l$18 = n$15.get(t$24);
		if (o$39 !== l$18 || !Object.is(o$39, l$18)) return !1;
	}
	return !0;
}
function f$5(e$10, n$15) {
	if (e$10.size !== n$15.size) return !1;
	for (let t$24 of e$10) if (!n$15.has(t$24)) return !1;
	return !0;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-QOEIYQAG.js
function a$3(...t$24) {
	return u$8(o$20, t$24);
}
var o$20 = (t$24, n$15) => t$24 === n$15 || Object.is(t$24, n$15);

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-SFZGYJFI.js
function t$6(r$20) {
	return typeof r$20 == "string";
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-OWH4IQQW.js
function n$3(e$10) {
	return e$10 !== void 0;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-VCYTMP4D.js
function n$4(e$10) {
	return e$10 === void 0 ? !0 : typeof e$10 == "string" || Array.isArray(e$10) ? e$10.length === 0 : Object.keys(e$10).length === 0;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-CAZXBO45.js
function t$4(r$20) {
	return r$20 instanceof Error;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-ENOHV5LT.js
function t$5(n$15) {
	return typeof n$15 == "function";
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-U753ZCO5.js
function a$2(e$10, n$15) {
	if (n$15 === void 0) {
		let t$24 = new Set(e$10);
		return (r$20) => t$24.has(r$20);
	}
	return n$15.includes(e$10);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-5DU4ITSF.js
function n$5(l$18) {
	return l$18 !== null;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-GK5I7C4J.js
function l$1(n$15) {
	return n$15 != null;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-HV3WACXG.js
function o$4(a$27) {
	return (t$24) => !a$27(t$24);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-ICBBHOCR.js
function s$1(...t$24) {
	return y$6(i$27, t$24);
}
function i$27(t$24) {
	if (t$24.length === 0) return a$18;
	let n$15 = /* @__PURE__ */ new Map();
	for (let r$20 of t$24) n$15.set(r$20, (n$15.get(r$20) ?? 0) + 1);
	return (r$20) => {
		let e$10 = n$15.get(r$20);
		return e$10 === void 0 || e$10 === 0 ? s$9 : (e$10 === 1 ? n$15.delete(r$20) : n$15.set(r$20, e$10 - 1), {
			hasNext: !0,
			next: r$20,
			done: n$15.size === 0
		});
	};
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-T45O7BFY.js
function s$2(...r$20) {
	return y$6(i$26, r$20);
}
var i$26 = (r$20, n$15) => (o$39) => r$20.some((e$10) => n$15(o$39, e$10)) ? {
	done: !1,
	hasNext: !0,
	next: o$39
} : s$9;

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-OP5ZF26D.js
function p(...e$10) {
	return u$8(y$9, e$10);
}
function y$9(e$10) {
	let r$20 = {};
	for (let [n$15, o$39] of Object.entries(e$10)) r$20[o$39] = n$15;
	return r$20;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-BO3LQZNF.js
function o$3(r$20) {
	return Array.isArray(r$20);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-I3D2BSWJ.js
function i$5(t$24) {
	return typeof t$24 == "bigint";
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-7QX4DO53.js
function e$1(o$39) {
	return typeof o$39 == "boolean";
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-VMV5GVZ5.js
function t$3(n$15) {
	return n$15 instanceof Date;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-3XVHBXPW.js
var R$1 = Symbol("funnel/voidReducer"), T$6 = () => R$1;
function A(l$18, { triggerAt: f$8 = "end", minQuietPeriodMs: i$40, maxBurstDurationMs: r$20, minGapMs: o$39, reducer: p$7 = T$6 }) {
	let e$10, n$15, d$17, u$26, s$18 = () => {
		let t$24 = d$17;
		t$24 !== void 0 && (d$17 = void 0, t$24 === R$1 ? l$18() : l$18(t$24), o$39 !== void 0 && (n$15 = setTimeout(m$14, o$39)));
	}, m$14 = () => {
		clearTimeout(n$15), n$15 = void 0, e$10 === void 0 && s$18();
	}, y$15 = () => {
		clearTimeout(e$10), e$10 = void 0, u$26 = void 0, n$15 === void 0 && s$18();
	};
	return {
		call: (...t$24) => {
			let a$27 = e$10 === void 0 && n$15 === void 0;
			if ((f$8 !== "start" || a$27) && (d$17 = p$7(d$17, ...t$24)), !(e$10 === void 0 && !a$27)) {
				if (i$40 !== void 0 || r$20 !== void 0 || o$39 === void 0) {
					clearTimeout(e$10);
					let c$9 = Date.now();
					u$26 ??= c$9;
					let g$1 = r$20 === void 0 ? i$40 ?? 0 : Math.min(i$40 ?? r$20, r$20 - (c$9 - u$26));
					e$10 = setTimeout(y$15, g$1);
				}
				f$8 !== "end" && a$27 && s$18();
			}
		},
		cancel: () => {
			clearTimeout(e$10), e$10 = void 0, u$26 = void 0, clearTimeout(n$15), n$15 = void 0, d$17 = void 0;
		},
		flush: () => {
			y$15(), m$14();
		},
		get isIdle() {
			return e$10 === void 0 && n$15 === void 0;
		}
	};
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-HVPVHFDT.js
function i$3(...e$10) {
	return u$8(p$4, e$10);
}
var p$4 = (e$10, d$17) => {
	let r$20 = Object.create(null);
	for (let n$15 = 0; n$15 < e$10.length; n$15++) {
		let t$24 = e$10[n$15], y$15 = d$17(t$24, n$15, e$10);
		if (y$15 !== void 0) {
			let o$39 = r$20[y$15];
			o$39 === void 0 ? r$20[y$15] = [t$24] : o$39.push(t$24);
		}
	}
	return Object.setPrototypeOf(r$20, Object.prototype), r$20;
};

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-HGKLN5KY.js
function k(...n$15) {
	return u$8(u$17, n$15);
}
function u$17(n$15, e$10) {
	if (n$15 === e$10 || Object.is(n$15, e$10)) return !0;
	if (typeof n$15 != "object" || typeof e$10 != "object" || n$15 === null || e$10 === null || Object.getPrototypeOf(n$15) !== Object.getPrototypeOf(e$10)) return !1;
	if (Array.isArray(n$15)) return l$11(n$15, e$10);
	if (n$15 instanceof Map) return a$17(n$15, e$10);
	if (n$15 instanceof Set) return c$4(n$15, e$10);
	if (n$15 instanceof Date) return n$15.getTime() === e$10.getTime();
	if (n$15 instanceof RegExp) return n$15.toString() === e$10.toString();
	if (Object.keys(n$15).length !== Object.keys(e$10).length) return !1;
	for (let [r$20, t$24] of Object.entries(n$15)) if (!(r$20 in e$10) || !u$17(t$24, e$10[r$20])) return !1;
	return !0;
}
function l$11(n$15, e$10) {
	if (n$15.length !== e$10.length) return !1;
	for (let [r$20, t$24] of n$15.entries()) if (!u$17(t$24, e$10[r$20])) return !1;
	return !0;
}
function a$17(n$15, e$10) {
	if (n$15.size !== e$10.size) return !1;
	for (let [r$20, t$24] of n$15.entries()) if (!e$10.has(r$20) || !u$17(t$24, e$10.get(r$20))) return !1;
	return !0;
}
function c$4(n$15, e$10) {
	if (n$15.size !== e$10.size) return !1;
	let r$20 = [...e$10];
	for (let t$24 of n$15) {
		let o$39 = !1;
		for (let [s$18, f$8] of r$20.entries()) if (u$17(t$24, f$8)) {
			o$39 = !0, r$20.splice(s$18, 1);
			break;
		}
		if (!o$39) return !1;
	}
	return !0;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-R7PILVSQ.js
function j(...e$10) {
	return u$8(c$3, e$10);
}
function c$3(e$10, u$26) {
	for (let [t$24, y$15] of Object.entries(u$26)) if (!Object.hasOwn(e$10, t$24) || !k(y$15, e$10[t$24])) return !1;
	return !0;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-HJSE3ESO.js
function e() {
	return n$9;
}
var n$9 = (t$24) => t$24;

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-QIQ2T4AA.js
function u$5(...e$10) {
	return u$8(i$25, e$10);
}
function i$25(e$10, a$27) {
	let r$20 = {};
	for (let [o$39, n$15] of e$10.entries()) {
		let d$17 = a$27(n$15, o$39, e$10);
		r$20[d$17] = n$15;
	}
	return r$20;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-JEUUQSE4.js
function l(...n$15) {
	return s$12(a$16, n$15);
}
function a$16(n$15, y$15) {
	if (!i$4(n$15, 2)) return n$15[0];
	let [r$20] = n$15, [, ...i$40] = n$15;
	for (let e$10 of i$40) y$15(e$10, r$20) < 0 && (r$20 = e$10);
	return r$20;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-XPCYQPKH.js
function y$2(e$10, t$24) {
	return typeof e$10 == "object" ? a$15(e$10, t$24) : u$16(a$15, e$10 === void 0 ? [] : [e$10], o$19);
}
var a$15 = (e$10, t$24) => t$24 === void 0 ? e$10.flat() : e$10.flat(t$24), o$19 = (e$10) => e$10 === void 0 || e$10 === 1 ? l$10 : e$10 <= 0 ? o$9 : (t$24) => Array.isArray(t$24) ? {
	next: t$24.flat(e$10 - 1),
	hasNext: !0,
	hasMany: !0,
	done: !1
} : {
	next: t$24,
	hasNext: !0,
	done: !1
}, l$10 = (e$10) => Array.isArray(e$10) ? {
	next: e$10,
	hasNext: !0,
	hasMany: !0,
	done: !1
} : {
	next: e$10,
	hasNext: !0,
	done: !1
};

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-FRNNS7AX.js
function u$3(...a$27) {
	return u$8(o$18, a$27, l$9);
}
var o$18 = (a$27, r$20) => a$27.flatMap(r$20), l$9 = (a$27) => (r$20, t$24, y$15) => {
	let n$15 = a$27(r$20, t$24, y$15);
	return Array.isArray(n$15) ? {
		done: !1,
		hasNext: !0,
		hasMany: !0,
		next: n$15
	} : {
		done: !1,
		hasNext: !0,
		next: n$15
	};
};

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-QJOWZFYO.js
function i$1(...n$15) {
	return u$8(b$3(Math.floor), n$15);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-VIBSXWWU.js
function u$4(...e$10) {
	return u$8(o$17, e$10, i$24);
}
function o$17(e$10, a$27) {
	return e$10.forEach(a$27), e$10;
}
var i$24 = (e$10) => (a$27, n$15, t$24) => (e$10(a$27, n$15, t$24), {
	done: !1,
	hasNext: !0,
	next: a$27
});

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-T4H4IOYC.js
function i$2(...e$10) {
	return u$8(a$14, e$10);
}
function a$14(e$10, r$20) {
	for (let [t$24, o$39] of Object.entries(e$10)) r$20(o$39, t$24, e$10);
	return e$10;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-GPLTWAVR.js
function n$2(...r$20) {
	return u$8(Object.fromEntries, r$20);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-X33OSP3L.js
function m$2(...e$10) {
	return u$8(y$8, e$10);
}
function y$8(e$10, o$39) {
	let r$20 = {};
	for (let [a$27, t$24] of e$10.entries()) r$20[t$24] = o$39(t$24, a$27, e$10);
	return r$20;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-SZUJ2NZ2.js
function n$1(...t$24) {
	return u$8(Object.entries, t$24);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-PVYOMZ3I.js
function u$2(...e$10) {
	return u$8(v, e$10);
}
function v(e$10, l$18) {
	if (typeof e$10 != "object" || e$10 === null) return e$10;
	let n$15 = { ...e$10 };
	for (let [o$39, t$24] of Object.entries(l$18)) o$39 in n$15 && (n$15[o$39] = typeof t$24 == "function" ? t$24(n$15[o$39]) : v(n$15[o$39], t$24));
	return n$15;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-7U7TOHLV.js
function m$1(...e$10) {
	return u$8(o$16, e$10, i$23);
}
var o$16 = (e$10, n$15) => e$10.filter(n$15), i$23 = (e$10) => (n$15, a$27, d$17) => e$10(n$15, a$27, d$17) ? {
	done: !1,
	hasNext: !0,
	next: n$15
} : s$9;

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-SGAFZVQH.js
var e$7 = (n$15) => Object.assign(n$15, { single: !0 });

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-MQDP6CFS.js
function f$1(...e$10) {
	return u$8(i$22, e$10, e$7(u$15));
}
var i$22 = (e$10, n$15) => e$10.find(n$15), u$15 = (e$10) => (n$15, t$24, o$39) => e$10(n$15, t$24, o$39) ? {
	done: !0,
	hasNext: !0,
	next: n$15
} : s$9;

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-UZ6BOIAH.js
function d$3(...n$15) {
	return u$8(o$15, n$15);
}
var o$15 = (n$15, r$20) => n$15.findIndex(r$20);

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-KI5UAETW.js
function o$2(...e$10) {
	return u$8(t$15, e$10);
}
var t$15 = (e$10, r$20) => {
	for (let n$15 = e$10.length - 1; n$15 >= 0; n$15--) {
		let a$27 = e$10[n$15];
		if (r$20(a$27, n$15, e$10)) return a$27;
	}
};

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-GYH2VCL4.js
function d$4(...n$15) {
	return u$8(o$14, n$15);
}
var o$14 = (n$15, a$27) => {
	for (let e$10 = n$15.length - 1; e$10 >= 0; e$10--) if (a$27(n$15[e$10], e$10, n$15)) return e$10;
	return -1;
};

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-26ILFTOP.js
function d$5(...e$10) {
	return u$8(r$15, e$10, e$7(a$13));
}
var r$15 = ([e$10]) => e$10, a$13 = () => o$13, o$13 = (e$10) => ({
	hasNext: !0,
	next: e$10,
	done: !0
});

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-2KIKGHAO.js
function o$1(...i$40) {
	return u$8(r$14, i$40);
}
var r$14 = (i$40, e$10) => i$40 / e$10;

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-YVMG2XEU.js
function t$2() {
	return n$8;
}
function n$8(...o$39) {}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-WMCGP7PY.js
function s(...e$10) {
	return u$8(p$3, e$10, o$12);
}
var p$3 = (e$10, r$20) => r$20 < 0 ? [...e$10] : e$10.slice(r$20);
function o$12(e$10) {
	if (e$10 <= 0) return o$9;
	let r$20 = e$10;
	return (i$40) => r$20 > 0 ? (r$20 -= 1, s$9) : {
		done: !1,
		hasNext: !0,
		next: i$40
	};
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-6NCEKWMJ.js
function c$1(...r$20) {
	return f$4(s$11, r$20);
}
function s$11(r$20, n$15, e$10) {
	if (e$10 >= r$20.length) return [];
	if (e$10 <= 0) return [...r$20];
	let o$39 = r$20.slice(0, e$10);
	T$5(o$39, n$15);
	let t$24 = [], a$27 = r$20.slice(e$10);
	for (let y$15 of a$27) {
		let m$14 = m$11(o$39, n$15, y$15);
		t$24.push(m$14 ?? y$15);
	}
	return t$24;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-J7R2OSHS.js
function a$1(...n$15) {
	return u$8(t$14, n$15);
}
var t$14 = (n$15, r$20) => r$20 > 0 ? n$15.slice(0, Math.max(0, n$15.length - r$20)) : [...n$15];

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-GIKF2ZNG.js
function i(...e$10) {
	return u$8(o$11, e$10);
}
function o$11(e$10, t$24) {
	for (let n$15 = e$10.length - 1; n$15 >= 0; n$15--) if (!t$24(e$10[n$15], n$15, e$10)) return e$10.slice(0, n$15 + 1);
	return [];
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-XWBKJZIP.js
function m(...e$10) {
	return u$8(i$21, e$10);
}
function i$21(e$10, t$24) {
	for (let [n$15, o$39] of e$10.entries()) if (!t$24(o$39, n$15, e$10)) return e$10.slice(n$15);
	return [];
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-XHPQVWZM.js
function f(...n$15) {
	return u$8(e$6, n$15);
}
var e$6 = (n$15, i$40) => n$15.endsWith(i$40);

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-BCBB46UE.js
function d$1(...n$15) {
	return u$8(u$14, n$15);
}
function u$14(n$15, o$39 = [], t$24 = []) {
	if (typeof n$15 == "function") return n$15;
	if (typeof n$15 != "object" || n$15 === null) return structuredClone(n$15);
	let r$20 = Object.getPrototypeOf(n$15);
	if (!Array.isArray(n$15) && r$20 !== null && r$20 !== Object.prototype) return structuredClone(n$15);
	let e$10 = o$39.indexOf(n$15);
	return e$10 !== -1 ? t$24[e$10] : (o$39.push(n$15), Array.isArray(n$15) ? p$2(n$15, o$39, t$24) : i$20(n$15, o$39, t$24));
}
function i$20(n$15, o$39, t$24) {
	let r$20 = {};
	t$24.push(r$20);
	for (let [e$10, c$9] of Object.entries(n$15)) r$20[e$10] = u$14(c$9, o$39, t$24);
	return r$20;
}
function p$2(n$15, o$39, t$24) {
	let r$20 = [];
	t$24.push(r$20);
	for (let [e$10, c$9] of n$15.entries()) r$20[e$10] = u$14(c$9, o$39, t$24);
	return r$20;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-H4OTHZJB.js
function a(...e$10) {
	return u$8(r$13, e$10);
}
var r$13 = (e$10, t$24) => [...e$10, ...t$24];

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-Y3PDQQTG.js
function u$13(e$10, a$27, n$15) {
	return e$10(n$15[0]) ? (t$24) => a$27(t$24, ...n$15) : a$27(...n$15);
}
var b = Object.assign(s$10, { defaultCase: R });
function s$10(...e$10) {
	return u$13(l$8, o$10, e$10);
}
function o$10(e$10, ...a$27) {
	for (let n$15 of a$27) {
		if (typeof n$15 == "function") return n$15(e$10);
		let [t$24, r$20] = n$15;
		if (t$24(e$10)) return r$20(e$10);
	}
	throw new Error("conditional: data failed for all cases");
}
function l$8(e$10) {
	if (!Array.isArray(e$10)) return !1;
	let [a$27, n$15, ...t$24] = e$10;
	return typeof a$27 == "function" && a$27.length <= 1 && typeof n$15 == "function" && n$15.length <= 1 && t$24.length === 0;
}
function R(e$10 = F) {
	return [T$4, e$10];
}
var T$4 = () => !0, F = () => {};

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-T5XG33UI.js
function r(n$15) {
	return () => n$15;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-QISEVQ4K.js
function c(...e$10) {
	return u$8(y$7, e$10);
}
var y$7 = (e$10, a$27) => {
	let n$15 = /* @__PURE__ */ new Map();
	for (let [d$17, u$26] of e$10.entries()) {
		let r$20 = a$27(u$26, d$17, e$10);
		if (r$20 !== void 0) {
			let t$24 = n$15.get(r$20);
			t$24 === void 0 ? n$15.set(r$20, 1) : n$15.set(r$20, t$24 + 1);
		}
	}
	return Object.fromEntries(n$15);
};

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-OIQJEOF7.js
function y$1(l$18, { waitMs: u$26, timing: a$27 = "trailing", maxWaitMs: d$17 }) {
	if (d$17 !== void 0 && u$26 !== void 0 && d$17 < u$26) throw new Error(`debounce: maxWaitMs (${d$17.toString()}) cannot be less than waitMs (${u$26.toString()})`);
	let n$15, t$24, o$39, i$40, f$8 = () => {
		if (t$24 !== void 0) {
			let r$20 = t$24;
			t$24 = void 0, clearTimeout(r$20);
		}
		if (o$39 === void 0) throw new Error("REMEDA[debounce]: latestCallArgs was unexpectedly undefined.");
		let e$10 = o$39;
		o$39 = void 0, i$40 = l$18(...e$10);
	}, s$18 = () => {
		if (n$15 === void 0) return;
		let e$10 = n$15;
		n$15 = void 0, clearTimeout(e$10), o$39 !== void 0 && f$8();
	}, c$9 = (e$10) => {
		o$39 = e$10, d$17 !== void 0 && t$24 === void 0 && (t$24 = setTimeout(f$8, d$17));
	};
	return {
		call: (...e$10) => {
			if (n$15 === void 0) a$27 === "trailing" ? c$9(e$10) : i$40 = l$18(...e$10);
			else {
				a$27 !== "leading" && c$9(e$10);
				let r$20 = n$15;
				n$15 = void 0, clearTimeout(r$20);
			}
			return n$15 = setTimeout(s$18, u$26 ?? d$17 ?? 0), i$40;
		},
		cancel: () => {
			if (n$15 !== void 0) {
				let e$10 = n$15;
				n$15 = void 0, clearTimeout(e$10);
			}
			if (t$24 !== void 0) {
				let e$10 = t$24;
				t$24 = void 0, clearTimeout(e$10);
			}
			o$39 = void 0;
		},
		flush: () => (s$18(), i$40),
		get isPending() {
			return n$15 !== void 0;
		},
		get cachedValue() {
			return i$40;
		}
	};
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-GKXRNLHM.js
function d$2(...e$10) {
	return y$6(f$3, e$10);
}
function f$3(e$10) {
	if (e$10.length === 0) return o$9;
	let n$15 = /* @__PURE__ */ new Map();
	for (let r$20 of e$10) n$15.set(r$20, (n$15.get(r$20) ?? 0) + 1);
	return (r$20) => {
		let t$24 = n$15.get(r$20);
		return t$24 === void 0 || t$24 === 0 ? {
			done: !1,
			hasNext: !0,
			next: r$20
		} : (n$15.set(r$20, t$24 - 1), s$9);
	};
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-NYIWN625.js
function T(...r$20) {
	return y$6(i$19, r$20);
}
var i$19 = (r$20, t$24) => (e$10) => r$20.every((a$27) => !t$24(e$10, a$27)) ? {
	done: !1,
	hasNext: !0,
	next: e$10
} : s$9;

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-WPTI67A4.js
function t(...n$15) {
	return u$8(r$12, n$15);
}
var r$12 = (n$15, d$17) => n$15 + d$17;

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-W2ARC73P.js
function d(...r$20) {
	return u$8(t$13, r$20);
}
var t$13 = (r$20, p$7, e$10) => ({
	...r$20,
	[p$7]: e$10
});

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-3UBK2BVM.js
function t$1(...a$27) {
	return u$8(e$5, a$27);
}
var e$5 = (a$27, o$39) => o$39.every((l$18) => l$18(a$27));

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-VFECZ57D.js
function y(...a$27) {
	return u$8(r$11, a$27);
}
var r$11 = (a$27, o$39) => o$39.some((e$10) => e$10(a$27));

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-VG2NVNXT.js
function n(...t$24) {
	return u$8(e$4, t$24);
}
var e$4 = (t$24) => `${t$24[0]?.toUpperCase() ?? ""}${t$24.slice(1)}`;

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-HJSE36CH.js
function u(...e$10) {
	return u$8(b$3(Math.ceil), e$10);
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-MMYTEZGW.js
function o(...e$10) {
	return u$8(s$8, e$10);
}
function s$8(e$10, n$15) {
	if (n$15 < 1) throw new RangeError(`chunk: A chunk size of '${n$15.toString()}' would result in an infinite array`);
	if (e$10.length === 0) return [];
	if (n$15 >= e$10.length) return [[...e$10]];
	let a$27 = Math.ceil(e$10.length / n$15), u$26 = new Array(a$27);
	if (n$15 === 1) for (let [r$20, t$24] of e$10.entries()) u$26[r$20] = [t$24];
	else for (let r$20 = 0; r$20 < a$27; r$20 += 1) {
		let t$24 = r$20 * n$15;
		u$26[r$20] = e$10.slice(t$24, t$24 + n$15);
	}
	return u$26;
}

//#endregion
//#region node_modules/.pnpm/remeda@2.26.1/node_modules/remeda/dist/chunk-UHDYHGOF.js
function u$1(...n$15) {
	return u$8(i$18, n$15);
}
var i$18 = (n$15, { min: e$10, max: r$20 }) => e$10 !== void 0 && n$15 < e$10 ? e$10 : r$20 !== void 0 && n$15 > r$20 ? r$20 : n$15;

//#endregion
//#region src/remeda/hasOwnProperty.ts
function hasOwnProperty(...args) {
	return u$8(hasOwnPropertyImplementation, args);
}
function hasOwnPropertyImplementation(data, properties) {
	if (!o$5(data)) return false;
	for (const property of properties) if (!Object.hasOwn(data, property)) return false;
	return true;
}

//#endregion
//#region src/remeda/isPromiseLike.ts
/**
* A function that checks if the passed parameter is a isPromiseLike and narrows its type accordingly.
*
* @param data - The variable to check.
* @returns True if the passed input is a isPromiseLike, false otherwise.
* @signature
*    R.isPromiseLike(data)
* @example
*    R.isPromiseLike(Promise.resolve(5)) //=> true
*    R.isPromiseLike(Promise.reject(5)) //=> true
*    R.isPromiseLike({ then: () => {} }) //=> true
*    R.isPromiseLike('somethingElse') //=> false
* @category Guard
*/
function isPromiseLike(data) {
	return o$5(data) && t$5(data.then) && Object.getOwnPropertyDescriptor(data, "then")?.get === void 0;
}

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/compositions/pipe.js
function pipe(value, ...operations) {
	let result = value;
	for (const operation of operations) result = operation(result);
	return result;
}

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/compositions/compose.js
function compose(...functions) {
	return (value) => pipe(value, ...functions);
}

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/compositions/curry.js
function curry(fn, nth) {
	const curried = ((...args) => (a0) => fn(a0, ...args));
	return nth === void 0 || nth <= 1 ? curried : curry(curried, nth - 1);
}

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/compositions/purry.js
function purry(fn) {
	return ((...args) => fn.length === args.length ? fn(...args) : curry(fn)(...args));
}

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/controls/_guards.js
const _isIterable = (value) => Symbol.iterator in value;

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/controls/accumulate.js
function accumulateSync(input) {
	return [...input];
}
async function accumulateAsync(input) {
	const accumulator = [];
	const awaited = await input;
	if (_isIterable(awaited)) for (const value of awaited) accumulator.push(await value);
	else for await (const value of awaited) accumulator.push(value);
	return accumulator;
}
var accumulate;
(function(accumulate$1) {
	accumulate$1.sync = accumulateSync;
	accumulate$1.async = accumulateAsync;
})(accumulate || (accumulate = {}));
const executeAsync = accumulateAsync;
const toArrayAsync = accumulateAsync;
const awaitAll = accumulateAsync;

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/controls/buffer.js
const isNotEmptyElement = () => true;
const isArrayOrSet = (awaited) => Array.isArray(awaited) || awaited instanceof Set;
const toAwaitedIterator = async (input) => {
	const awaited = await input;
	return isArrayOrSet(awaited) ? awaited.values() : awaited;
};
const constructWorkFunction = (iterator) => async (k$1) => {
	const next = iterator.next();
	return {
		k: k$1,
		result: next instanceof Promise ? await next : {
			value: await next.value,
			done: next.done
		}
	};
};
const constructWorker = async (input, size, mode) => {
	const work = constructWorkFunction(await toAwaitedIterator(input));
	const workers = Array.from({ length: size }, async (_, k$1) => await work(k$1));
	let fifoIndex = 0;
	return {
		next: mode === "fifo" ? async () => {
			const { k: k$1, result } = await workers[fifoIndex];
			if (result.done === true) delete workers[k$1];
			else workers.splice(k$1, 1, work(k$1));
			fifoIndex = (fifoIndex + 1) % size;
			return result;
		} : async () => {
			const { k: k$1, result } = await Promise.race(workers.filter(isNotEmptyElement));
			if (result.done === true) delete workers[k$1];
			else workers.splice(k$1, 1, work(k$1));
			return result;
		},
		get isActive() {
			return workers.some(isNotEmptyElement);
		}
	};
};
async function* _buffer(input, options) {
	const { size, mode } = {
		mode: "frfo",
		...options
	};
	if (size <= 0 || !Number.isInteger(size)) throw new RangeError(`"size" must be a positive integer (got ${size.toString()}).`);
	const worker = await constructWorker(input, size, mode);
	while (worker.isActive) {
		const result = await worker.next();
		if (result.done === true) continue;
		yield result.value;
	}
}
function buffer(...args) {
	return purry(_buffer)(...args);
}
const throttle = buffer;
const concurrency = throttle;

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/controls/chunk.js
function* _syncChunk(input, size) {
	let accumulator = [];
	for (const value of input) {
		accumulator.push(value);
		if (accumulator.length >= size) {
			yield accumulator;
			accumulator = [];
		}
	}
	if (accumulator.length > 0) yield accumulator;
}
async function* _asyncChunk(input, size) {
	let accumulator = [];
	const awaited = await input;
	if (_isIterable(awaited)) for (const value of awaited) {
		accumulator.push(await value);
		if (accumulator.length >= size) {
			yield accumulator;
			accumulator = [];
		}
	}
	else for await (const value of awaited) {
		accumulator.push(value);
		if (accumulator.length >= size) {
			yield accumulator;
			accumulator = [];
		}
	}
	if (accumulator.length > 0) yield accumulator;
}
function chunkSync(...args) {
	return purry(_syncChunk)(...args);
}
function chunkAsync(...args) {
	return purry(_asyncChunk)(...args);
}
var chunk;
(function(chunk$1) {
	chunk$1.sync = chunkSync;
	chunk$1.async = chunkAsync;
})(chunk || (chunk = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/controls/flatten.js
function* flattenSync(input) {
	for (const pool of input) for (const value of pool) yield value;
}
async function* flattenAsync(input) {
	const awaited = await input;
	if (_isIterable(awaited)) for (const pool of awaited) {
		const innerAwaited = await pool;
		if (_isIterable(innerAwaited)) for (const value of innerAwaited) yield value;
		else for await (const value of innerAwaited) yield value;
	}
	else for await (const pool of awaited) if (_isIterable(pool)) for (const value of pool) yield value;
	else for await (const value of pool) yield value;
}
var flatten;
(function(flatten$1) {
	flatten$1.sync = flattenSync;
	flatten$1.async = flattenAsync;
})(flatten || (flatten = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/controls/serialize.js
function serializeSync(input) {
	return input[Symbol.iterator]();
}
async function* serializeAsync(input) {
	const awaited = await input;
	if (_isIterable(awaited)) for (const value of awaited) yield value;
	else for await (const value of awaited) yield value;
}
var serialize;
(function(serialize$1) {
	serialize$1.sync = serializeSync;
	serialize$1.async = serializeAsync;
})(serialize || (serialize = {}));
const toIteratorAsync = serializeAsync;

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/filters/filter.js
function* _syncFilter(input, test) {
	for (const value of input) if (test(value)) yield value;
}
async function* _asyncFilter(input, test) {
	const awaited = await input;
	if (_isIterable(awaited)) {
		for (const value of awaited) if (await test(await value)) yield value;
	} else for await (const value of awaited) if (await test(value)) yield value;
}
function filterSync(...args) {
	return purry(_syncFilter)(...args);
}
function filterAsync(...args) {
	return purry(_asyncFilter)(...args);
}
var filter;
(function(filter$1) {
	filter$1.sync = filterSync;
	filter$1.async = filterAsync;
})(filter || (filter = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/filters/_unique-context.js
const _uniqueContext = () => {
	const set = /* @__PURE__ */ new Set();
	return Object.assign((value) => set.has(value) ? false : (set.add(value), true), { set });
};

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/filters/unique.js
const uniqueSync = (input) => filterSync(input, _uniqueContext());
const uniqueAsync = (input) => filterAsync(input, _uniqueContext());
var unique;
(function(unique$1) {
	unique$1.sync = uniqueSync;
	unique$1.async = uniqueAsync;
})(unique || (unique = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/filters/unique-by.js
const _syncUniqueBy = (input, key) => {
	const isUnique = _uniqueContext();
	return filterSync(input, (value) => isUnique(key(value)));
};
const _asyncUniqueBy = (input, key) => {
	const isUnique = _uniqueContext();
	return filterAsync(input, async (value) => isUnique(await key(value)));
};
function uniqueBySync(...args) {
	return purry(_syncUniqueBy)(...args);
}
function uniqueByAsync(...args) {
	return purry(_asyncUniqueBy)(...args);
}
var uniqueBy;
(function(uniqueBy$1) {
	uniqueBy$1.sync = uniqueBySync;
	uniqueBy$1.async = uniqueByAsync;
})(uniqueBy || (uniqueBy = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/reducers/some.js
function _syncSome(input, test) {
	for (const value of input) if (test(value)) return true;
	return false;
}
async function _asyncSome(input, test) {
	const awaited = await input;
	if (_isIterable(awaited)) {
		for (const value of awaited) if (await test(await value)) return true;
	} else for await (const value of awaited) if (await test(value)) return true;
	return false;
}
function someSync(...args) {
	return purry(_syncSome)(...args);
}
function someAsync(...args) {
	return purry(_asyncSome)(...args);
}
var some;
(function(some$1) {
	some$1.sync = someSync;
	some$1.async = someAsync;
})(some || (some = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/filters/unique-with.js
const _syncUniqueWith = (input, equals) => {
	const array = [];
	return filterSync(input, (value1) => array.some((value2) => equals(value1, value2)) ? false : (array.push(value1), true));
};
const _asyncUniqueWith = (input, equals) => {
	const array = [];
	return filterAsync(input, async (value1) => await someAsync(array, async (value2) => await equals(value1, value2)) ? false : (array.push(value1), true));
};
function uniqueWithSync(...args) {
	return purry(_syncUniqueWith)(...args);
}
function uniqueWithAsync(...args) {
	return purry(_asyncUniqueWith)(...args);
}
var uniqueWith;
(function(uniqueWith$1) {
	uniqueWith$1.sync = uniqueWithSync;
	uniqueWith$1.async = uniqueWithAsync;
})(uniqueWith || (uniqueWith = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/groups/_to-set.js
const _toSet = (input) => input instanceof Set ? input : new Set(input);

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/groups/difference.js
const _syncDifference = (input, other) => {
	const otherSet = _toSet(other);
	return filterSync(input, (value) => !otherSet.has(value));
};
const _asyncDifference = (input, other) => {
	const otherSet = _toSet(other);
	return filterAsync(input, (value) => !otherSet.has(value));
};
function differenceSync(...args) {
	return purry(_syncDifference)(...args);
}
function differenceAsync(...args) {
	return purry(_asyncDifference)(...args);
}
var difference;
(function(difference$1) {
	difference$1.sync = differenceSync;
	difference$1.async = differenceAsync;
})(difference || (difference = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/groups/difference-by.js
const _syncDifferenceBy = (input, other, key) => {
	const otherSet = _toSet(other);
	return filterSync(input, (value) => !otherSet.has(key(value)));
};
const _asyncDifferenceBy = (input, other, key) => {
	const otherSet = _toSet(other);
	return filterAsync(input, async (value) => !otherSet.has(await key(value)));
};
function differenceBySync(...args) {
	return purry(_syncDifferenceBy)(...args);
}
function differenceByAsync(...args) {
	return purry(_asyncDifferenceBy)(...args);
}
var differenceBy;
(function(differenceBy$1) {
	differenceBy$1.sync = differenceBySync;
	differenceBy$1.async = differenceByAsync;
})(differenceBy || (differenceBy = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/groups/_intersect-with.js
const _syncIntersectWith = (other, equals) => (value) => {
	for (const otherValue of other) if (equals(value, otherValue)) return true;
	return false;
};
const _asyncIntersectWith = (other, equals) => async (value) => {
	for (const otherValue of other) if (await equals(value, otherValue)) return true;
	return false;
};

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/groups/_different-with.js
const _syncNot = (fn) => (...args) => !fn(...args);
const _asyncNot = (fn) => async (...args) => !await fn(...args);
const _syncDifferentWith = (other, equals) => _syncNot(_syncIntersectWith(other, equals));
const _asyncDifferentWith = (other, equals) => _asyncNot(_asyncIntersectWith(other, equals));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/groups/difference-with.js
const _syncDifferenceWith = (input, other, equals) => filterSync(input, _syncDifferentWith(other, equals));
const _asyncDifferenceWith = (input, other, equals) => filterAsync(input, _asyncDifferentWith(other, equals));
function differenceWithSync(...args) {
	return purry(_syncDifferenceWith)(...args);
}
function differenceWithAsync(...args) {
	return purry(_asyncDifferenceWith)(...args);
}
var differenceWith;
(function(differenceWith$1) {
	differenceWith$1.sync = differenceWithSync;
	differenceWith$1.async = differenceWithAsync;
})(differenceWith || (differenceWith = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/groups/intersection.js
const _syncIntersection = (input, other) => {
	const otherSet = _toSet(other);
	return filterSync(input, (value) => otherSet.has(value));
};
const _asyncIntersection = (input, other) => {
	const otherSet = _toSet(other);
	return filterAsync(input, (value) => otherSet.has(value));
};
function intersectionSync(...args) {
	return purry(_syncIntersection)(...args);
}
function intersectionAsync(...args) {
	return purry(_asyncIntersection)(...args);
}
var intersection;
(function(intersection$1) {
	intersection$1.sync = intersectionSync;
	intersection$1.async = intersectionAsync;
})(intersection || (intersection = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/groups/intersection-by.js
const _syncIntersectionBy = (input, other, key) => {
	const otherSet = _toSet(other);
	return filterSync(input, (value) => otherSet.has(key(value)));
};
const _asyncIntersectionBy = (input, other, key) => {
	const otherSet = _toSet(other);
	return filterAsync(input, async (value) => otherSet.has(await key(value)));
};
function intersectionBySync(...args) {
	return purry(_syncIntersectionBy)(...args);
}
function intersectionByAsync(...args) {
	return purry(_asyncIntersectionBy)(...args);
}
var intersectionBy;
(function(intersectionBy$1) {
	intersectionBy$1.sync = intersectionBySync;
	intersectionBy$1.async = intersectionByAsync;
})(intersectionBy || (intersectionBy = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/groups/intersection-with.js
const _syncIntersectionWith = (input, other, equals) => filterSync(input, _syncIntersectWith(other, equals));
const _asyncIntersectionWith = (input, other, equals) => filterAsync(input, _asyncIntersectWith(other, equals));
function intersectionWithSync(...args) {
	return purry(_syncIntersectionWith)(...args);
}
function intersectionWithAsync(...args) {
	return purry(_asyncIntersectionWith)(...args);
}
var intersectionWith;
(function(intersectionWith$1) {
	intersectionWith$1.sync = intersectionWithSync;
	intersectionWith$1.async = intersectionWithAsync;
})(intersectionWith || (intersectionWith = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/mappers/flat-map.js
function* _syncFlatMap(input, mapper) {
	for (const value of input) for (const output of mapper(value)) yield output;
}
async function* _asyncFlatMap(input, mapper) {
	const awaited = await input;
	if (_isIterable(awaited)) for (const value of awaited) {
		const results = await mapper(await value);
		if (_isIterable(results)) for (const output of results) yield output;
		else for await (const output of results) yield output;
	}
	else for await (const value of awaited) {
		const results = await mapper(value);
		if (_isIterable(results)) for (const output of results) yield output;
		else for await (const output of results) yield output;
	}
}
function flatMapSync(...args) {
	return purry(_syncFlatMap)(...args);
}
function flatMapAsync(...args) {
	return purry(_asyncFlatMap)(...args);
}
var flatMap;
(function(flatMap$1) {
	flatMap$1.sync = flatMapSync;
	flatMap$1.async = flatMapAsync;
})(flatMap || (flatMap = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/mappers/map.js
function* _syncMap(input, mapper) {
	for (const value of input) yield mapper(value);
}
async function* _asyncMap(input, mapper) {
	const awaited = await input;
	if (_isIterable(awaited)) for (const value of awaited) yield mapper(await value);
	else for await (const value of awaited) yield mapper(value);
}
function mapSync(...args) {
	return purry(_syncMap)(...args);
}
function mapAsync(...args) {
	return purry(_asyncMap)(...args);
}
var map;
(function(map$1) {
	map$1.sync = mapSync;
	map$1.async = mapAsync;
})(map || (map = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/reducers/every.js
function _syncEvery(input, test) {
	for (const value of input) if (!test(value)) return false;
	return true;
}
async function _asyncEvery(input, test) {
	const awaited = await input;
	if (_isIterable(awaited)) {
		for (const value of awaited) if (!await test(await value)) return false;
	} else for await (const value of awaited) if (!await test(value)) return false;
	return true;
}
function everySync(...args) {
	return purry(_syncEvery)(...args);
}
function everyAsync(...args) {
	return purry(_asyncEvery)(...args);
}
var every;
(function(every$1) {
	every$1.sync = everySync;
	every$1.async = everyAsync;
})(every || (every = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/reducers/find.js
function _syncFind(input, test) {
	for (const value of input) if (test(value)) return value;
}
async function _asyncFind(input, test) {
	const awaited = await input;
	if (_isIterable(awaited)) {
		for (const value of awaited) if (await test(await value)) return await value;
	} else for await (const value of awaited) if (await test(value)) return value;
}
function findSync(...args) {
	return purry(_syncFind)(...args);
}
function findAsync(...args) {
	return purry(_asyncFind)(...args);
}
var find;
(function(find$1) {
	find$1.sync = findSync;
	find$1.async = findAsync;
})(find || (find = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/reducers/reduce.js
function _syncReduce(input, reducer, initialValue) {
	let returnValue = initialValue;
	for (const value of input) returnValue = reducer(returnValue, value);
	return returnValue;
}
async function _asyncReduce(input, reducer, initialValue) {
	let returnValue = await initialValue;
	const awaited = await input;
	if (_isIterable(awaited)) for (const value of awaited) returnValue = await reducer(returnValue, await value);
	else for await (const value of awaited) returnValue = await reducer(returnValue, value);
	return returnValue;
}
function reduceSync(...args) {
	return purry(_syncReduce)(...args);
}
function reduceAsync(...args) {
	return purry(_asyncReduce)(...args);
}
var reduce;
(function(reduce$1) {
	reduce$1.sync = reduceSync;
	reduce$1.async = reduceAsync;
})(reduce || (reduce = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/side-effectors/for-each.js
function _syncForEach(input, action) {
	for (const value of input) action(value);
}
async function _asyncForEach(input, action) {
	const awaited = await input;
	if (_isIterable(awaited)) for (const value of awaited) await action(await value);
	else for await (const value of awaited) await action(value);
}
function forEachSync(...args) {
	return purry(_syncForEach)(...args);
}
function forEachAsync(...args) {
	return purry(_asyncForEach)(...args);
}
var forEach;
(function(forEach$1) {
	forEach$1.sync = forEachSync;
	forEach$1.async = forEachAsync;
})(forEach || (forEach = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/side-effectors/peek.js
function* _syncPeek(input, action) {
	for (const value of input) {
		action(value);
		yield value;
	}
}
async function* _asyncPeek(input, action) {
	const awaited = await input;
	if (_isIterable(awaited)) for (const value of awaited) {
		await action(await value);
		yield value;
	}
	else for await (const value of awaited) {
		await action(value);
		yield value;
	}
}
function peekSync(...args) {
	return purry(_syncPeek)(...args);
}
function peekAsync(...args) {
	return purry(_asyncPeek)(...args);
}
var peek;
(function(peek$1) {
	peek$1.sync = peekSync;
	peek$1.async = peekAsync;
})(peek || (peek = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/splicers/concat.js
function* _syncConcat(preceding, following) {
	for (const value of preceding) yield value;
	for (const value of following) yield value;
}
async function* _asyncConcat(preceding, following) {
	const awaitedPreceding = await preceding;
	if (_isIterable(awaitedPreceding)) for (const value of awaitedPreceding) yield value;
	else for await (const value of awaitedPreceding) yield value;
	const awaitedFollowing = await following;
	if (_isIterable(awaitedFollowing)) for (const value of awaitedFollowing) yield value;
	else for await (const value of awaitedFollowing) yield value;
}
function concatSync(...args) {
	return purry(_syncConcat)(...args);
}
function concatAsync(...args) {
	return purry(_asyncConcat)(...args);
}
var concat;
(function(concat$1) {
	concat$1.sync = concatSync;
	concat$1.async = concatAsync;
})(concat || (concat = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/splicers/drop.js
function* _syncDrop(input, drop$1) {
	let leftDrop = drop$1;
	for (const value of input) {
		if (leftDrop > 0) {
			leftDrop--;
			continue;
		}
		yield value;
	}
}
async function* _asyncDrop(input, drop$1) {
	let leftDrop = drop$1;
	const awaited = await input;
	if (_isIterable(awaited)) for (const value of awaited) {
		if (leftDrop > 0) {
			leftDrop--;
			continue;
		}
		yield value;
	}
	else for await (const value of awaited) {
		if (leftDrop > 0) {
			leftDrop--;
			continue;
		}
		yield value;
	}
}
function dropSync(...args) {
	return purry(_syncDrop)(...args);
}
function dropAsync(...args) {
	return purry(_asyncDrop)(...args);
}
var drop;
(function(drop$1) {
	drop$1.sync = dropSync;
	drop$1.async = dropAsync;
})(drop || (drop = {}));

//#endregion
//#region node_modules/.pnpm/rotery@0.7.0/node_modules/rotery/dist/esm/operations/splicers/take.js
function* _syncTake(input, take$1) {
	let leftTake = take$1;
	for (const value of input) {
		if (leftTake <= 0) break;
		yield value;
		leftTake--;
	}
}
async function* _asyncTake(input, take$1) {
	let leftTake = take$1;
	const awaited = await input;
	if (_isIterable(awaited)) for (const value of awaited) {
		if (leftTake <= 0) break;
		yield value;
		leftTake--;
	}
	else for await (const value of awaited) {
		if (leftTake <= 0) break;
		yield value;
		leftTake--;
	}
}
function takeSync(...args) {
	return purry(_syncTake)(...args);
}
function takeAsync(...args) {
	return purry(_asyncTake)(...args);
}
var take;
(function(take$1) {
	take$1.sync = takeSync;
	take$1.async = takeAsync;
})(take || (take = {}));

//#endregion
export { A, C, C$1, D, T, T$1, T$3 as T$2, T$2 as T$3, a, a$1, a$10, a$9 as a$11, a$12, a$2, a$3, a$4, a$8 as a$5, a$6, a$5 as a$7, a$7 as a$8, a$11 as a$9, accumulateAsync, awaitAll, b, b$1, b$2, buffer, c, c$1, c$2, chunkAsync, compose, concatAsync, concurrency, d, d$2 as d$1, d$11 as d$10, d$10 as d$11, d$1 as d$2, d$5 as d$3, d$4, d$3 as d$5, d$6, d$8 as d$7, d$7 as d$8, d$9, differenceAsync, differenceByAsync, differenceWithAsync, dropAsync, e, e$1, e$3 as e$2, e$2 as e$3, everyAsync, executeAsync, f, f$1, f$2, filterAsync, findAsync, flatMapAsync, flattenAsync, forEachAsync, h, hasOwnProperty, i, i$2 as i$1, i$11 as i$10, i$10 as i$11, i$13 as i$12, i$16 as i$13, i$15 as i$14, i$14 as i$15, i$4 as i$16, i$17, i$1 as i$2, i$3, i$5 as i$4, i$8 as i$5, i$7 as i$6, i$6 as i$7, i$9 as i$8, i$12 as i$9, intersectionAsync, intersectionByAsync, intersectionWithAsync, isPromiseLike, j, k, l, l$1, l$2, l$3, l$4, l$5, l$6, l$7, m, m$1, m$10, m$2, m$3, m$4, m$5, m$6, m$9 as m$7, m$8, m$7 as m$9, mapAsync, n, n$1, n$2, n$5 as n$3, n$4, n$3 as n$5, n$6, n$7, o, o$1, o$2, o$3, o$4, o$5, o$6, o$8 as o$7, o$7 as o$8, p, p$1, peekAsync, r, r$3 as r$1, r$10, r$2, r$4 as r$3, r$1 as r$4, r$5, r$9 as r$6, r$8 as r$7, r$7 as r$8, r$6 as r$9, reduceAsync, s, s$2 as s$1, s$1 as s$2, s$3, s$5 as s$4, s$4 as s$5, s$7 as s$6, s$6 as s$7, serializeAsync, someAsync, t$1 as t, t as t$1, t$10, t$12 as t$11, t$11 as t$12, t$2, t$3, t$5 as t$4, t$4 as t$5, t$6, t$7, t$8, t$9, takeAsync, throttle, toArrayAsync, toIteratorAsync, u$1 as u, u as u$1, u$10, u$12 as u$11, u$8 as u$12, u$2, u$4 as u$3, u$3 as u$4, u$5, u$6, u$7, u$9 as u$8, u$11 as u$9, uniqueAsync, uniqueByAsync, uniqueWithAsync, x, y, y$1, y$2, y$3, y$4, y$5 };