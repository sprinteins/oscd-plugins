import { LP_TYPE } from "@/headless/constants";
import type { LpElement } from "./types.lp-list";

type DialogFormData = {
    name: string;
    number?: number;
    desc: string;
    type: keyof typeof LP_TYPE;
}

class UseLpStore {
    dialogFormData = $state<DialogFormData>({
        name: "",
        desc: "",
        type: LP_TYPE.LPDI,
    });
}

export const lpStore = new UseLpStore()