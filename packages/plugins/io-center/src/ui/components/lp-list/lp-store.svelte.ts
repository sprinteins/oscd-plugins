import { LP_TYPE } from "@/headless/constants";
import type { LpElement } from "./types.lp-list";

type DialogFormData = {
    name: string;
    instance: string;
    desc: string;
    type: keyof typeof LP_TYPE;
}

class UseLpStore {
    dialogFormData = $state<DialogFormData>({
        name: "",
        instance: "",
        desc: "",
        type: LP_TYPE.LPDI,
    });
}

export const lpStore = new UseLpStore()