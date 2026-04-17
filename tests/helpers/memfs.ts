import { fs, vol } from "memfs";

for (const method of ["cpSync", "statfsSync"] as const) {
    if (typeof vol[method] === "function") {
        (fs as any)[method] = vol[method].bind(vol);
    }
}

export { fs, vol };
