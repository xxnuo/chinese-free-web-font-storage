import type { Atom } from "@cn-ui/reactive";

export const  VModel = (e:Atom<any>) => ({
    value: e(),
    "on:input": (r:any) => e(() => r.target.value)
  })